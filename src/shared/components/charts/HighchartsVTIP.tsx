import { useMemo, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HCDataGrouping from "highcharts/modules/datagrouping";
import HCWindbarb from "highcharts/modules/windbarb";
import HCAnnotations from "highcharts/modules/annotations";
import HCAccessibility from "highcharts/modules/accessibility";
import { useTheme } from "../../hooks/useTheme";
import type { VtipResponse } from "../../../api/endpoints/verical_profile/verticalProfilesAPI";
import HCExporting from "highcharts/modules/exporting";
import HCOfflineExporting from "highcharts/modules/offline-exporting";
import HCExportData from "highcharts/modules/export-data";
import { ErrorBoundary } from "react-error-boundary";

HCExporting(Highcharts);
HCExportData(Highcharts);
HCOfflineExporting(Highcharts);

HCDataGrouping(Highcharts);
HCWindbarb(Highcharts);
HCAnnotations(Highcharts);
HCAccessibility(Highcharts);

interface DayNightChart extends Highcharts.Chart {
  dayNightRects?: Highcharts.SVGElement[];
}

interface VtipChartProps {
  data: VtipResponse;
  displayTitle?: boolean;
}

const HighchartVtip = forwardRef<Highcharts.Chart | null, VtipChartProps>(
  ({ data, displayTitle = false }, ref) => {
    
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const { theme } = useTheme();

  useImperativeHandle<Highcharts.Chart | null | undefined, Highcharts.Chart | null>(
    ref,
    () => chartRef.current?.chart ?? null,
  );
  const { chartFontColor, chartGridline, chartLegendColor, borderBox } = theme.charts;


  useEffect(() => {
    if (!chartRef.current || !data?.times?.length) return;
    const chart = chartRef.current.chart as DayNightChart;
    drawDayNightBar(chart, data);
  }, [data]);

  const options = useMemo<Highcharts.Options>(() => {
    if (!data?.times?.length) return {};

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
      Object.fromEntries(
        kigaliFormatter.formatToParts(dt).map((p) => [p.type, p.value])
      ) as Record<string, string>;

    const formatKigaliFull = (dt: Date) => {
      const p = parseParts(dt);
      return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
    };

    const times = data.times.map((t) => Date.parse(t.replace(" ", "T") + "Z"));
    const seriesData = times.map<[number, number]>((t, i) => [
      t,
      data.parameter[i],
    ]);
    const seriesWind = times.map<[number, number, number]>((t, i) => [
      t,
      data.ff[i],
      data.dd[i],
    ]);

    let pmin = Math.min(...data.parameter);
    let pmax = Math.max(...data.parameter);
    if (pmax === pmin) {
      pmin = pmin - 0.1;
      pmax = pmin + 0.1;
    }
  
    const ymax = pmax + (pmax - pmin) * 0.01;

    return {
      
      chart: {
        zoomType: "x",
        borderColor: borderBox,
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: "transparent",
        reflow: true,
        events: {
          load: function () {
            drawDayNightBar(this as DayNightChart, data);
          },
          render: function () {
            drawDayNightBar(this as DayNightChart, data);
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
        gridLineColor: chartGridline,
        lineColor: chartGridline,
        lineWidth: 1,
        tickColor: chartGridline,
        labels: {
          useHTML: false,
          rotation: 0,
          align: "center",
          style: {
            fontSize: "11px",
            color: chartFontColor,
          },
          formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
            const tickTime = new Date(this.value as number);
            const p = parseParts(tickTime);
            const axis = this.axis as Highcharts.Axis;
            const idx = axis.tickPositions?.indexOf(this.value as number) ?? 0;
            const prev =
              idx > 0 ? new Date(axis.tickPositions![idx - 1]) : undefined;

            const isFirst = idx === 0;
            const isNewDay = prev && parseParts(prev).day !== p.day;

            const dateStr = `${p.year}-${p.month}-${p.day}`;
            const timeStr = `${p.hour}:${p.minute}`;

            if (isFirst || isNewDay) {
              return `
                <div style="text-align:center;">
                  <span style="color:${chartFontColor};font-weight:700;">${dateStr}</span><br/>
                  <span style="color:${chartFontColor};">${timeStr}</span>
                </div>`;
            }
            return `<span style="color:${chartFontColor};">${timeStr}</span>`;
          },
        },
      },
      yAxis: {
        min: pmin,
        max: ymax,
        tickColor: chartGridline,
        lineColor: chartGridline,
        title: {
          text: `${data.name} (${data.units})`,
          style: {
            fontSize: "11px",
            color: chartLegendColor,
          }
        },
        labels: {
          style: { color: chartFontColor, fontSize: "11px" },
        },
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
        shared: true,
        useHTML: true,
        backgroundColor: "rgba(255,255,255,0.95)",
        borderColor: "#aaa",
        borderWidth: 1,
        formatter: function (this: Highcharts.TooltipFormatterContextObject) {
          let tooltip = "";
          this.points?.forEach((p) => {
            if (p.series.type === "area") {
              tooltip += `<b>${p.series.name}</b><br/>Value: ${Highcharts.numberFormat(
                p.y as number,
                2
              )} ${data.units}<br/><hr>`;
            } else if (p.series.type === "windbarb") {
              const point = p.point as unknown as {
                value: number;
                direction: number;
              };
              tooltip += `<b>${p.series.name}</b><br/>Speed: ${point.value.toFixed(
                1
              )} m/s<br>Direction: ${point.direction.toFixed(
                0
              )}°<br/><hr>`;
            }
          });
          tooltip += `<b>Date</b><br/>${formatKigaliFull(
            new Date(this.x as number)
          )}`;
          return tooltip;
        },
      },
      legend: { enabled: false },
      credits: { enabled: false },
      exporting: {
        buttons: {
          contextButton: {enabled: false}
        }
      }
    };
  }, [data, displayTitle, chartFontColor, chartGridline, chartLegendColor]);

  return (
    <ErrorBoundary
      fallback={<div>...</div>}
    >

      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
        containerProps={{ style: { width: "100%" } }}
      />
    </ErrorBoundary>

  );
});

export default HighchartVtip;

// 
function drawDayNightBar(chart: DayNightChart, json: VtipResponse) {
  if (!chart || !json?.times?.length) return
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

  chart.dayNightRects?.forEach((r) => r.destroy());
  chart.dayNightRects = [];

  for (let i = 0; i < startPb.length; i++) {
    const xs = startPb[i];
    const xe = endPb[i];
    const ys = chart.yAxis[0].min! - 1.15 * heightPb;

    const xP = chart.xAxis[0].toPixels(xs);
    const wP = chart.xAxis[0].toPixels(xe) - xP;
    const yP = chart.yAxis[0].toPixels(ys + heightPb);
    const hP = chart.yAxis[0].toPixels(ys) - yP;

    const rect = chart.renderer
      .rect(xP, yP, wP, hP, 0)
      .attr({ fill: colorPb[i], zIndex: 5 })
      .add();

    const tooltip = chart.renderer
      .label(labelPb[i], xP + wP / 2 - 70, yP + hP - 30, "rect", 0, 0, true)
      .attr({
        padding: 8,
        fill: "rgba(0,0,0,0.75)",
        zIndex: 9,
      })
      .css({
        color: "#fff",
        fontSize: "11px",
        pointerEvents: "none",
      })
      .hide()
      .add();

    rect.element.addEventListener("mouseover", () => tooltip.show());
    rect.element.addEventListener("mouseout", () => tooltip.hide());

    chart.dayNightRects.push(rect, tooltip);
  }
}
