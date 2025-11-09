import React, { useEffect, useRef, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCHeatmap from 'highcharts/modules/heatmap';
import HCAnnotations from 'highcharts/modules/annotations';
import type { VptsResponse } from '../../../api/endpoints/verticalProfilesAPI';
import { useTheme } from '../../hooks/useTheme';

HCHeatmap(Highcharts);
HCAnnotations(Highcharts);

interface VpHeatmapChartProps {
    data: VptsResponse;
    radarAltitude?: number;
    legend?: boolean;
    title?: boolean;
}

interface DayNightChart extends Highcharts.Chart {
    dayNightRects?: Highcharts.SVGElement[];
}

const VptsHeatmapChart: React.FC<VpHeatmapChartProps> = ({
    data,
    radarAltitude = 1616,
    legend = false,
    title = false
}) => {
    const chartRef = useRef<HighchartsReact>(null);
    const { theme } = useTheme();
    const { chartFontColor } = theme;

    const seriesData = useMemo(() => {
        const arr: [number, number, number | null][] = [];
        data.height.forEach((h, j) => {
            data.times.forEach((t, i) => {
                arr.push([Date.parse(t.replace(' ', 'T') + 'Z'), h, data.parameter[j][i]]);
            });
        });
        return arr;
    }, [data]);


    const colorPalette = useMemo(() => {
        const paletteVpts = [
            "#ffffffff", "#ffffd3ff", "#ffffa8ff", "#ffff7cff",
            "#ffff51ff", "#e6ec26ff", "#a6a300ff", "#ffa300ff",
            "#ffa33fff", "#ff6e1fff", "#ff2900ff", "#f20000ff",
            "#a70007ff", "#5d004fff", "#510097ff", "#2300e0ff",
            "#0000d5ff", "#00008fff", "#00004aff", "#000005ff"
        ];
        const paletteViridis = [
            "#fde725ff", "#dce318ff", "#b8de29ff", "#94d840ff", "#74d055ff",
            "#56c667ff", "#3cbc75ff", "#29af7fff", "#20a386ff", "#1f968bff",
            "#238a8dff", "#287d8eff", "#2d718eff", "#32648eff", "#39558cff",
            "#3f4788ff", "#453781ff", "#482677ff", "#481568ff", "#440154ff"
        ];

        let palette: string[];
        let ticks: number[] = [];
        const parLower = data.name.toLowerCase();
        if (['dens', 'eta'].includes(parLower)) {
            palette = paletteVpts;
            ticks = [1, 2, 5, 10, 15, 20, 25, 30, 50, 70, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000];
        } else if (parLower === 'dbz') {
            palette = paletteVpts;
            for (let i = -20; i <= 27.5; i += 2.5) ticks.push(i);
        } else {
            palette = paletteViridis;
            ticks = Array.from({ length: 20 }, (_, i) => i + 1);
        }

        const tckn = Math.min(...ticks);
        const tckx = Math.max(...ticks);
        const stick = ticks.map(x => (x - tckn) / (tckx - tckn));
        return palette.map((c, j) => [stick[j] as number, c] as [number, string]);
    }, [data]);

    useEffect(() => {
        if (!data) return;

        const kigaliFormatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Kigali',
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });

        const parseParts = (dt: Date) => {
            const parts = kigaliFormatter.formatToParts(dt);
            return Object.fromEntries(parts.map(p => [p.type, p.value]));
        };

        const formatKigaliFull = (dt: Date) => {
            const p = parseParts(dt);
            return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
        };

        const times = data.times.map(t => Date.parse(t.replace(' ', 'T') + 'Z'));
        const sunrise = data.sunrise.map(t => Date.parse(t.replace(' ', 'T') + 'Z'));
        const sunset = data.sunset.map(t => Date.parse(t.replace(' ', 'T') + 'Z'));
        const heights = data.height;

        const xmin = Math.min(...times);
        const xmax = Math.max(...times);
        const ymin = Math.min(...heights) + radarAltitude;
        const ymax = Math.max(...heights);
        const p_ymin = ymin;
        const p_ymax = ymax + (ymax - ymin) * 0.05;

        const nTimes = times.length;
        const colsize = (xmax - xmin) / (nTimes - 1);
        const rowsize = heights[1] - heights[0];

        const heightPb = (ymax - ymin) * 0.09; 
        const startPb: number[] = [times[0]];
        let isDay0 = times[0] >= sunrise[0] && times[0] <= sunset[0];
        const colorPb: string[] = [isDay0 ? '#f7f78f' : '#162c54'];
        const daynightPb: string[] = [isDay0 ? 'Daytime' : 'Night'];
        let endPb: number[] = [];

        if (nTimes > 1) {
            for (let j = 1; j < nTimes; j++) {
                const isDay = times[j] >= sunrise[j] && times[j] <= sunset[j];
                if (isDay0 !== isDay) {
                    endPb.push(times[j]);
                    startPb.push(times[j]);
                    colorPb.push(isDay ? '#f7f78f' : '#162c54');
                    daynightPb.push(isDay ? 'Daytime' : 'Night');
                }
                isDay0 = isDay;
            }
            if (endPb.length !== startPb.length) endPb.push(times[nTimes - 1]);
        } else endPb = [times[0]];

        const drawDayNightBar = (chart: DayNightChart) => {
            if (chart.dayNightRects) chart.dayNightRects.forEach(r => r.destroy());
            chart.dayNightRects = [];
            for (let j = 0; j < startPb.length; j++) {
                const xs = startPb[j];
                const ys = chart.yAxis[0].min - 1.15 * heightPb;
                const xw = endPb[j] - startPb[j];
                const yh = heightPb;

                const xP = chart.xAxis[0].toPixels(xs);
                const yP = chart.yAxis[0].toPixels(ys + yh);
                const wP = chart.xAxis[0].toPixels(xs + xw) - xP;
                const hP = chart.yAxis[0].toPixels(ys) - yP;

                const rect = chart.renderer.rect(xP, yP, wP, hP, 0)
                    .attr({ fill: colorPb[j], zIndex: 5 })
                    .add();

                const tooltip = chart.renderer.label(
                    daynightPb[j],
                    xP + wP / 2 - 70,
                    yP + hP - 30,
                    'rect',
                    0, 0, true
                ).attr({ padding: 8, fill: 'rgba(0,0,0,0.75)', zIndex: 9 })
                    .css({ color: '#fff', fontSize: '11px', pointerEvents: 'none' })
                    .hide()
                    .add();

                rect.element.addEventListener('mouseover', () => tooltip.show());
                rect.element.addEventListener('mouseout', () => tooltip.hide());

                chart.dayNightRects.push(rect);
                chart.dayNightRects.push(tooltip);
            }
        };

        Highcharts.setOptions({
            time: {
              useUTC: false,
              timezone: 'Africa/Kigali',
            },
          });

        const options: Highcharts.Options = {
            chart: {
                plotBorderWidth: 1,
                backgroundColor: 'transparent',
                height: 200,
                style: { fontFamily: 'Inter, sans-serif', color: chartFontColor, fontSize: '14' },
                events: {
                    load() { drawDayNightBar(this as DayNightChart); },
                    render() { drawDayNightBar(this as DayNightChart); },
                    selection() { setTimeout(() => this.redraw(), 100); }
                },
                zooming: { type: 'x' }
            },
            title: { text: title ? `${data.name} [${data.units}]` : undefined },
            xAxis: {
                type: 'datetime',
                tickLength: 13,
                tickPixelInterval: 100,
                minTickInterval: 20 * 60 * 1000,
                labels: {style: {color: chartFontColor, fontSize: '11'}}
            },
            yAxis: {
                min: p_ymin,
                max: p_ymax,
                tickPositions: [0, 2000, 3000, 5000], 
                title: { text: 'Altitude (m)' },
                gridLineWidth: 0,
                labels: {style: {color: chartFontColor, fontSize: '11'}}
            },
            series: [{
                type: 'heatmap',
                name: data.name,
                data: seriesData,
                turboThreshold: 0,
                colsize,
                rowsize,
                nullColor: '#c8c8c8',
                tooltip: {
                    pointFormatter: function(this: Highcharts.Point) {
                        if (this.value !== null && this.value !== undefined) {
                            return `<b>Time:</b> ${formatKigaliFull(new Date(this.x as number))}<br>
                                    <b>Altitude:</b> ${this.y} m<br>
                                    <b>${data.name}:</b> ${this.value.toFixed(2)} ${data.units}`;
                        }
                        return '';
                    }
                }
            }],
            tooltip: { enabled: true, shared: false },
            colorAxis: { min: 0, stops: colorPalette, labels: { format: '{value:.1f}' } },
            legend: legend ? { align: 'right', layout: 'vertical', verticalAlign: 'middle', symbolHeight: 250 } : { enabled: false },
            credits: { enabled: false }
        };

        chartRef.current?.chart.update(options, true, true);

    }, [data, radarAltitude, legend, title, seriesData, colorPalette, chartFontColor]);

    return (


            <HighchartsReact 
                containerProps={{ style: { width: '100%', height: '100%' }}}
                highcharts={Highcharts} options={{}} ref={chartRef} 
            />
  
    );
};

export default VptsHeatmapChart;
