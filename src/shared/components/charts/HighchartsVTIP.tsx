import { useMemo, lazy, forwardRef, type ComponentRef, Suspense } from "react";
import type { VtipResponse } from "../../../api/endpoints/verical_profile/verticalProfilesAPI";
import { useTheme } from "../../hooks/useTheme";
import { ErrorBoundary } from "react-error-boundary";
import { useHighchartsModules } from "./hook/useChartModules";

const HighchartsReact = lazy(() => import("highcharts-react-official"));


interface VtipChartProps {
  data: VtipResponse;
  title?: boolean;
}

interface DayNightChart extends Highcharts.Chart {
  dayNightRects?: Highcharts.SVGElement[];
}


const VtipChart = forwardRef<ComponentRef<typeof HighchartsReact> , VtipChartProps>(
  ({ data, title = false }, ref) => {

    // Loading modules dynamically
    const [ Highcharts, loaded] = useHighchartsModules(["accessibility", "windbarb", "annotations", "exporting", "export-data", "offline-exporting"]);


    const { theme } = useTheme();
    const { chartFontColor, chartGridline, chartLegendColor, borderBox } = theme.charts;

    const options = useMemo(() => {
      if (!data || !Highcharts) return {};

      Highcharts?.setOptions({ time: { useUTC: false, timezone: undefined } });

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
        Object.fromEntries(kigaliFormatter.formatToParts(dt).map(p => [p.type, p.value]));

      const formatKigaliFull = (dt: Date) => {
        const p = parseParts(dt);
        return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
      };

      const times = data.times.map(t => Date.parse(t.replace(" ", "T") + "Z"));
      const sunrise = data.sunrise.map(t => Date.parse(t.replace(" ", "T") + "Z"));
      const sunset = data.sunset.map(t => Date.parse(t.replace(" ", "T") + "Z"));

      const seriesData = times.map((t, i) => [t, data.parameter[i]]);

      const seriesWind = times.reduce<number[][]>((acc, t, i) => {
        if (data.ff[i] > 0.1) acc.push([t, data.ff[i], data.dd[i]]);
        return acc;
      }, []);

      let pmin = Math.min(...data.parameter);
      let pmax = Math.max(...data.parameter);
      if (pmax === pmin) {
        pmin = pmin - 0.1;
        pmax = pmin + 0.1;
      }
      const ymax = pmax + (pmax - pmin) * 0.01;

      const heightPb = (pmax - pmin) * 0.03;
      const startPb: number[] = [times[0]];
      const colorPb: string[] = [(times[0] >= sunrise[0] && times[0] <= sunset[0]) ? '#f7f78f' : '#162c54'];
      const daynightPb: string[] = [(times[0] >= sunrise[0] && times[0] <= sunset[0]) ? 'Daytime' : 'Night'];
      const endPb: number[] = [];

      let isDay0 = times[0] >= sunrise[0] && times[0] <= sunset[0];
      for (let j = 1; j < times.length; j++) {
        const isDay = times[j] >= sunrise[j] && times[j] <= sunset[j];
        if (isDay !== isDay0) {
          endPb.push(times[j]);
          startPb.push(times[j]);
          colorPb.push(isDay ? '#f7f78f' : '#162c54');
          daynightPb.push(isDay ? 'Daytime' : 'Night');
        }
        isDay0 = isDay;
      }
      if (endPb.length !== startPb.length) endPb.push(times[times.length - 1]);

      const drawDayNightBar = (chart: DayNightChart) => {
        chart.dayNightRects?.forEach(r => r.destroy());
        chart.dayNightRects = [];

        for (let j = 0; j < startPb.length; j++) {
          const xs = startPb[j];
          const ys = chart.yAxis[0].min! - 1.15 * heightPb;
          const xw = endPb[j] - startPb[j];
          const yh = heightPb;

          const xP = chart.xAxis[0].toPixels(xs);
          const yP = chart.yAxis[0].toPixels(ys + yh);
          const wP = chart.xAxis[0].toPixels(xs + xw) - xP;
          const hP = chart.yAxis[0].toPixels(ys) - yP;

          const rect = chart.renderer.rect(xP, yP, wP, hP, 0)
            .attr({ fill: colorPb[j], zIndex: 5 }).add();

          const tooltip = chart.renderer.label(
            daynightPb[j], xP + wP / 2 - 70, yP + hP - 30, 'rect', 0, 0, true
          ).attr({ padding: 8, fill: 'rgba(0,0,0,0.75)', zIndex: 9 })
            .css({ color: '#fff', fontSize: '11px', pointerEvents: 'none' })
            .hide()
            .add();

          rect.element.addEventListener('mouseover', () => tooltip.show());
          rect.element.addEventListener('mouseout', () => tooltip.hide());

          chart.dayNightRects.push(rect, tooltip);
        }
      };

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
              drawDayNightBar(this as unknown as DayNightChart);
            },
            render: function () {
              drawDayNightBar(this as unknown as DayNightChart);
            },
          },
        },
        title: {
          text: title ? `${data.name} [${data.units}]` : undefined,
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
            type: 'area', 
            id: 'parameter', 
            data: seriesData, 
            name: data.name ,
            turboThreshold: 0,
          },
          { 
            type: 'windbarb', 
            onSeries: 'parameter', 
            data: seriesWind, 
            name: 'Wind', 
            color: 'red', 
            lineWidth: 1.5, 
            turboThreshold: 0,
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
                tooltip += `<b>${p.series.name}</b><br/>Value: ${Highcharts?.numberFormat(
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
          },
          fallbackToExportServer: false,
        }
      };
    }, [Highcharts, borderBox, chartFontColor, chartGridline, chartLegendColor, data, title]);

    if (!loaded || !Highcharts) {
      return <div></div>;
    }

    return (
      <ErrorBoundary
        fallback={<div className="w-full h-full">...</div>}
      >
        <Suspense fallback={<div style={{width: '100%', height: '100%'}}></div>}>
          <HighchartsReact 
            highcharts={Highcharts} 
            options={options} 
            ref={ref} 
            containerProps={{ style: { width: "100%" } }} 
          />
        </Suspense>
      </ErrorBoundary>
    );
  }
);

export default VtipChart;
