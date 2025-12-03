import  { useMemo, lazy, forwardRef, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import type { VptsResponse } from '../../../api/endpoints/verical_profile/verticalProfilesAPI';
import { useTheme } from '../../hooks/useTheme';
import { useHighchartsModules } from './hook/useChartModules';

const HighchartsReact = lazy(() => import('highcharts-react-official'));


interface VpHeatmapChartProps {
    data: VptsResponse;
    radarAltitude?: number;
    legend?: boolean;
    title?: boolean;
}

interface DayNightChart extends Highcharts.Chart {
    dayNightRects?: Highcharts.SVGElement[];
}

const VptsHeatmapChart = forwardRef<React.ComponentRef<typeof HighchartsReact>, VpHeatmapChartProps>(
    ({ data, legend, title, radarAltitude=1616}, ref) => {

    // Dynamic module importing
    const [ Highcharts, loaded ] = useHighchartsModules(['accessibility', 'exporting', 'export-data', 'offline-exporting', 'heatmap', 'annotations']);



    const { theme } = useTheme();
    const { chartFontColor, chartLegendColor, chartGridline, borderBox } = theme.charts;


    const seriesData = useMemo(() => {
        const out: [number, number, number | null][] = [];
        data.height.forEach((h, j) => {
            data.times.forEach((t, i) => {
                out.push([Date.parse(t.replace(' ', 'T') + 'Z'), h, data.parameter[j][i]]);
            });
        });
        return out;
    }, [data]);



    const { colorPalette, tckn, tckx } = useMemo(() => {
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

        let palette: string[] = [];
        let ticks: number[] = [];
        const par = data.query_par.toLowerCase();

        if (['dens', 'eta'].includes(par)) {
            palette = paletteVpts;
            ticks = [1, 2, 5, 10, 15, 20, 25, 30, 50, 70, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000];
        } else if (par === 'dbz') {
            palette = paletteVpts;
            for (let i = -20; i <= 27.5; i += 2.5) ticks.push(i);
        } else {
            palette = paletteViridis;
            ticks = Array.from({ length: 20 }, (_, i) => i + 1);
        }

        const tckn = Math.min(...ticks);
        const tckx = Math.max(...ticks);
        const stick = ticks.map(x => (x - tckn) / (tckx - tckn));

        const colorPalette: [number, string][] = palette.map((c, i) => [stick[i], c]);

        return { colorPalette, ticks, tckn, tckx };
    }, [data]);


    const options = useMemo<Highcharts.Options>(() => {

        if (!data || !Highcharts) return {};

        Highcharts?.setOptions({
            time: { useUTC: false, timezone: 'Africa/Kigali' }
        });

        const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Kigali',
            hour12: false, year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });

        const parseParts = (dt: Date) =>
            Object.fromEntries(formatter.formatToParts(dt).map(p => [p.type, p.value]));

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

        const colsize = (xmax - xmin) / (times.length - 1);
        const rowsize = heights[1] - heights[0];


        const heightPb = (ymax - ymin) * 0.03;

        const startPb: number[] = [times[0]];
        const colorPb: string[] = [];
        const daynightPb: string[] = [];
        const endPb: number[] = [];

        let isDayPrev = times[0] >= sunrise[0] && times[0] <= sunset[0];
        colorPb.push(isDayPrev ? '#f7f78f' : '#162c54');
        daynightPb.push(isDayPrev ? 'Daytime' : 'Night');

        for (let i = 1; i < times.length; i++) {
            const isDay = times[i] >= sunrise[i] && times[i] <= sunset[i];
            if (isDay !== isDayPrev) {
                endPb.push(times[i]);
                startPb.push(times[i]);
                colorPb.push(isDay ? '#f7f78f' : '#162c54');
                daynightPb.push(isDay ? 'Daytime' : 'Night');
            }
            isDayPrev = isDay;
        }
        if (endPb.length !== startPb.length) endPb.push(times[times.length - 1]);


        /** draw rectangles */
        const drawDayNightBar = (chart: DayNightChart) => {
            chart.dayNightRects?.forEach(el => el.destroy());
            chart.dayNightRects = [];

            for (let i = 0; i < startPb.length; i++) {
                const xs = startPb[i];
                const xw = endPb[i] - startPb[i];
                const ys = chart.yAxis[0].min! - 1.6 * heightPb;
                const yh = heightPb;

                const xP = chart.xAxis[0].toPixels(xs);
                const wP = chart.xAxis[0].toPixels(xs + xw) - xP;
                const yP = chart.yAxis[0].toPixels(ys + yh);
                const hP = chart.yAxis[0].toPixels(ys) - yP;

                const rect = chart.renderer
                    .rect(xP, yP, wP, hP, 0)
                    .attr({ fill: colorPb[i], zIndex: 5 })
                    .add();

                const tooltip = chart.renderer
                    .label(daynightPb[i], xP + wP / 2 - 50, yP + hP - 30, 'rect')
                    .attr({ padding: 6, fill: 'rgba(0,0,0,0.75)', zIndex: 9 })
                    .css({ color: '#fff', pointerEvents: 'none', fontSize: '11px' })
                    .hide()
                    .add();

                rect.element.addEventListener('mouseover', () => tooltip.show());
                rect.element.addEventListener('mouseout', () => tooltip.hide());

                chart.dayNightRects.push(rect, tooltip);
            }
        };


        return {
            exporting: {
                buttons: { contextButton: { enabled: false } }
            },

            chart: {
                borderColor: borderBox,
                borderWidth: 1,
                borderRadius: 3,
                backgroundColor:'transparent',
                reflow: true,
                style:{fontFamily:'Inter, sans-serif',color:chartFontColor,fontSize:'14px'},
                events:{load(){drawDayNightBar(this as DayNightChart);}, render(){drawDayNightBar(this as DayNightChart);}},
                zooming:{type:'x'}
            },

            title: title
                ? { text: `${data.name} [${data.units}]`, style: { color: chartLegendColor, fontSize: '14px'  } }
                : undefined,

            xAxis: {
                type:'datetime', 
                tickLength:13, 
                tickPixelInterval:100, 
                lineColor: chartGridline,
                tickColor: chartGridline,
                minTickInterval:20*60*1000, 
                labels: {
                    useHTML: false,
                    rotation: 0,
                    align: 'center',
                    style: {
                        whiteSpace: 'normal',
                        fontSize: '12px',
                        lineHeight: '13px',
                        color: chartFontColor,
                    },
                    formatter: function(this: Highcharts.AxisLabelsFormatterContextObject) {
                        const tickTime = new Date(this.value);
                        const p = parseParts(tickTime);
                        const idx = this.axis?.tickPositions?.indexOf(this.value as number);
                        const prev = idx! > 0 ? new Date(this.axis.tickPositions![idx! - 1]) : null;

                        const isFirst = idx === 0;
                        const isNewDay = prev && parseParts(prev).day !== p.day;

                        if (isFirst || isNewDay) {
                            const dateStr = `${p.year}-${p.month}-${p.day}`;
                            const timeStr = `${p.hour}:${p.minute}`;
                            return `<span style="white-space:nowrap;color:${chartFontColor};font-weight:700;">${dateStr}</span><br>` +
                                `<span style="color:${chartFontColor};">${timeStr}</span>`;
                        }

                        return `<span style="color:${chartFontColor};">${p.hour}:${p.minute}</span>`;
                    }
                }
            },

            yAxis: {
                min: p_ymin, 
                max: p_ymax,
                startOnTick: false,
                endOnTick: false,
                lineColor: chartGridline,
                tickColor: chartGridline,
                softMin: p_ymin,
                softMax: p_ymax,
                title: { 
                    text: 'Altitude (m)', 
                    style: { 
                        color: chartLegendColor,
                        fontWeight: '500', 
                        fontSize: '12px'
                    } 
                },
                labels:{
                    useHTML: false,
                    style:{
                        color: chartFontColor,
                        fontSize:'12px'
                    },
                    format: '{value}'
                },
                gridLineWidth: 0
            },

            colorAxis: {
                reversed: false,
                min: tckn,
                max: tckx,
                // tickPositions: ticks ,
                stops:colorPalette,
                labels:{
                    // format:'{value:.1f}',
                    style: {
                        color: chartFontColor
                    }
                }
            },

            series: [{
                type: 'heatmap',
                name: data.name,
                data: seriesData,
                colsize,
                rowsize,
                nullColor: '#c8c8c8',
                boostThreshold: 1,
                tooltip: {
                    pointFormatter: function () {
                        if (this.value == null) return '';
                        return `
                            <b>Time:</b> ${formatKigaliFull(new Date(this.x as number))}<br>
                            <b>Altitude:</b> ${this.y} m<br>
                            <b>${data.name}:</b> ${this.value.toFixed(2)} ${data.units}
                        `;
                    }
                }
            }],

            legend: legend ? {
                align: 'right',
                layout: 'vertical',
                symbolHeight: 250,
                verticalAlign: 'middle',
            } : { enabled: false },

            credits: { enabled: false }
        };
    }, [data, Highcharts, radarAltitude, borderBox, chartFontColor, title, chartLegendColor, chartGridline, tckn, tckx, colorPalette, seriesData, legend]);

    // Fallback if module not loaded yet
    if (!loaded || !Highcharts) {
        return <div></div>;
    }

    return (
        <ErrorBoundary fallback={<div></div>}>
            <Suspense fallback={<div className='h-fit grid px-2 pb-2'></div>}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    ref={ref}
                    containerProps={{ style: { width: '100%' } }}
                />
            </Suspense>
        </ErrorBoundary>
    );

    }
);



export default VptsHeatmapChart;
