import React, { useMemo, useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HCDataGrouping from "highcharts/modules/datagrouping";
import HCWindbarb from "highcharts/modules/windbarb";
import HCAnnotations from "highcharts/modules/annotations";
import HCAccessibility from "highcharts/modules/accessibility";
import { useTheme } from "../../hooks/useTheme";
import type { VtipResponse } from "../../../api/endpoints/verticalProfilesAPI";

HCDataGrouping(Highcharts);
HCWindbarb(Highcharts);
HCAnnotations(Highcharts);
HCAccessibility(Highcharts);

interface VtipChartProps {
  data: VtipResponse;
  displayTitle?: boolean; 
  chartHeight?: number; 
}

const HighchartVtip: React.FC<VtipChartProps> = ({ data, displayTitle=false, chartHeight }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const { theme } = useTheme();
  const { chartFontColor, chartGridline, chartLegendColor } = theme;

  useEffect(() => {
    if (!chartRef.current || !data?.times?.length) return;
    const chart = chartRef.current.chart;
    drawDayNightBar(chart, data);
  }, [data]);

  const options = useMemo(() => {
    if (!data || !data.times?.length) return {};

    Highcharts.setOptions({
      time: {
        useUTC: false,
        timezone: undefined,
      },
    });

    const kigaliFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Kigali",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const parseParts = (dt: Date) =>
      Object.fromEntries(kigaliFormatter.formatToParts(dt).map((p) => [p.type, p.value]));

    const formatKigaliFull = (dt: Date) => {
      const p = parseParts(dt);
      return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
    };

    const times = data.times.map((t) => Date.parse(t.replace(" ", "T") + "Z"));
    const sunrise = data.sunrise.map((t) => Date.parse(t.replace(" ", "T") + "Z"));
    const sunset = data.sunset.map((t) => Date.parse(t.replace(" ", "T") + "Z"));

    const seriesData = times.map((t, i) => [t, data.parameter[i]]);
    const seriesWind = times.map((t, i) => [t, data.ff[i], data.dd[i]]);

    const pmin = Math.min(...data.parameter);
    const pmax = Math.max(...data.parameter);
    const ymax = pmax + (pmax - pmin) * 0.01;

    return {
      chart: {
        zoomType: "x",
        plotBorderWidth: 1,
        backgroundColor: "transparent",
        height: chartHeight || 200,
        events: {
          load: function () {
            drawDayNightBar(this, data);
          },
          render: function () {
            drawDayNightBar(this, data);
          },
        },
      },
      title: {
        text: displayTitle ? `${data.name} [${data.units}]` : undefined,
        style: { color: chartLegendColor, fontSize: "13px" },
      },
      xAxis: {
        type: "datetime",
        tickLength: 13,
        tickPixelInterval: 100,
        minTickInterval: 20 * 60 * 1000,
        labels: {
          useHTML: true,
          rotation: 0,
          align: "center",
          style: {
            fontSize: "11px",
            color: chartFontColor,
            whiteSpace: "nowrap", // <- empêche le wrapping automatique
          },
          formatter: function (this: any) {
            const tickTime = new Date(this.value);
            const p = parseParts(tickTime);
            const idx = this.axis.tickPositions.indexOf(this.value);
            const prev = idx > 0 ? new Date(this.axis.tickPositions[idx - 1]) : null;
            const isFirst = idx === 0;
            const isNewDay = prev && parseParts(prev).day !== p.day;
        
            const dateStr = `${p.year}-${p.month}-${p.day}`;
            const timeStr = `${p.hour}:${p.minute}`;
        
            if (isFirst || isNewDay) {
              // div parent avec deux spans pour couleurs différentes
              return `
                <div style="text-align:center; display:inline-block;">
                  <span style="color:#666; display:block;">${dateStr}</span>
                  <span style="color:${chartFontColor}; display:block;">${timeStr}</span>
                </div>
              `;
            }
            return `<span style="color:${chartFontColor}">${timeStr}</span>`;
          },
        },
        
      },
      yAxis: {
        min: pmin,
        max: ymax,
        title: {
          text: null,
          style: { color: chartLegendColor, fontSize: "11px" },
        },
        labels: { style: { color: chartFontColor, fontSize: '11px' } },
        gridLineColor: chartGridline,
      },
      series: [
        {
          type: "area",
          id: "parameter",
          data: seriesData,
          name: data.name,
          color: "rgba(0, 120, 255, 0.4)",
          fillOpacity: 0.5,
        },
        {
          type: "windbarb",
          onSeries: "parameter",
          data: seriesWind,
          name: "Wind",
          color: "red",
          lineWidth: 1.5,
          vectorLength: 20,
        },
      ],
      tooltip: {
        shared: false,
        useHTML: true,
        backgroundColor: "rgba(255,255,255,0.95)",
        borderColor: "#aaa",
        borderWidth: 1,
        formatter: function (this: any) {
          if (this.series.type === "area") {
            return `<b>${this.series.name}</b><br/>Value: ${Highcharts.numberFormat(this.y, 2)} ${data.units}<br/><hr><b>Date</b><br/>${formatKigaliFull(new Date(this.x))}`;
          }
          if (this.series.type === "windbarb") {
            return `<b>${this.series.name}</b><br/>Speed: ${this.point.value.toFixed(1)} m/s<br>Direction: ${this.point.direction.toFixed(0)}°<br><hr><b>Date</b><br/>${formatKigaliFull(new Date(this.x))}`;
          }
        },
      },
      legend: { enabled: false },
      credits: { enabled: false },
    };
  }, [data, displayTitle, chartLegendColor, chartFontColor, chartGridline, chartHeight]);

  return (
    <div className="w-full h-full">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
        containerProps={{ style: { width: "100%", height: "100%" } }}
      />
    </div>
  );
};

export default HighchartVtip;


function drawDayNightBar(chart: Highcharts.Chart, json: VtipResponse) {
  if (!chart || !json?.times?.length) return;

  const times = json.times.map((t) => Date.parse(t.replace(" ", "T") + "Z"));
  const sunrise = json.sunrise.map((t) => Date.parse(t.replace(" ", "T") + "Z"));
  const sunset = json.sunset.map((t) => Date.parse(t.replace(" ", "T") + "Z"));
  const pmin = Math.min(...json.parameter);
  const pmax = Math.max(...json.parameter);
  const heightPb = (pmax - pmin) * 0.03;

  const nTimes = times.length;
  const startPb = [times[0]];
  let isDay0 = times[0] >= sunrise[0] && times[0] <= sunset[0];
  const colorPb = [isDay0 ? "#f7f78f" : "#162c54"];
  const labelPb = [isDay0 ? "Daytime" : "Night"];
  const endPb: number[] = [];

  for (let j = 1; j < nTimes; j++) {
    const isDay = times[j] >= sunrise[j] && times[j] <= sunset[j];
    if (isDay !== isDay0) {
      endPb.push(times[j]);
      startPb.push(times[j]);
      colorPb.push(isDay ? "#f7f78f" : "#162c54");
      labelPb.push(isDay ? "Daytime" : "Night");
    }
    isDay0 = isDay;
  }
  if (endPb.length !== startPb.length) endPb.push(times[nTimes - 1]);

  if ((chart as any).dayNightRects) (chart as any).dayNightRects.forEach((r: any) => r.destroy());
  (chart as any).dayNightRects = [];

  for (let i = 0; i < startPb.length; i++) {
    const xs = startPb[i];
    const xe = endPb[i];
    const ys = chart?.yAxis[0]?.min - 1.15 * heightPb;

    const xP = chart.xAxis[0].toPixels(xs);
    const wP = chart.xAxis[0].toPixels(xe) - xP;
    const yP = chart.yAxis[0].toPixels(ys + heightPb);
    const hP = chart.yAxis[0].toPixels(ys) - yP;

    const rect = chart.renderer
      .rect(xP, yP, wP, hP, 0)
      .attr({ fill: colorPb[i], zIndex: 5 })
      .add();

    const tooltip = chart.renderer
      .label(labelPb[i], xP + wP / 2 - 40, yP + hP - 25, "rect", 0, 0, true)
      .attr({
        padding: 6,
        fill: "rgba(0,0,0,0.75)",
        zIndex: 9,
      })
      .css({
        color: "#fff",
        fontSize: "10px",
        pointerEvents: "none",
      })
      .hide()
      .add();

    rect.element.addEventListener("mouseover", () => tooltip.show());
    rect.element.addEventListener("mouseout", () => tooltip.hide());

    (chart as any).dayNightRects.push(rect);
    (chart as any).dayNightRects.push(tooltip);
  }
}
