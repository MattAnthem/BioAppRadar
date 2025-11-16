import React, { useEffect, useRef, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCHeatmap from 'highcharts/modules/heatmap';
import HCAnnotations from 'highcharts/modules/annotations';
import type { VptsResponse } from '../../../api/endpoints/verical_profile/verticalProfilesAPI';
import { useTheme } from '../../hooks/useTheme';
// import exportingModule from "highcharts/modules/exporting";

HCHeatmap(Highcharts);
HCAnnotations(Highcharts);
// exportingModule(Highcharts);

interface VpHeatmapChartProps {
    data: VptsResponse;
    radarAltitude?: number;
    legend?: boolean;
    title?: boolean;
    chartHeight?: number;
}

interface DayNightChart extends Highcharts.Chart {
    dayNightRects?: Highcharts.SVGElement[];
}



const VptsHeatmapChart: React.FC<VpHeatmapChartProps> = ({
    data,
    radarAltitude = 1616,
    legend = false,
    title = false,
    chartHeight = 200,
}) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null);
    const { theme } = useTheme();
    const { chartFontColor, chartLegendColor, chartGridline, borderBox } = theme.charts;


    
    // Heavy calculation
    const seriesData = useMemo(() => {
        const arr: [number, number, number | null][] = [];
        data.height.forEach((h, j) => {
            data.times.forEach((t, i) => {
                arr.push([Date.parse(t.replace(' ', 'T') + 'Z'), h, data.parameter[j][i]]);
            });
        });
        return arr;
    }, [data]);

   
    const { colorPalette, ticks, tckn, tckx } = useMemo(() => {
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
        const parLower = data.query_par.toLowerCase();

        if (['dens', 'eta'].includes(parLower)) {
            palette = paletteVpts;
            ticks = [1, 2, 5, 10, 15, 20, 25,
                30, 50, 70, 100, 150, 200, 250,
                300, 400, 500, 600, 800, 1000
            ];
        } else if (parLower === 'dbz') {
            palette = paletteVpts;
            for (let i=-20; i<=27.5; i+=2.5) ticks.push(i);
        } else {
            palette = paletteViridis;
            ticks = Array.from({length:20}, (_, i) => i + 1);
        }

        const tckn = Math.min(...ticks);
        const tckx = Math.max(...ticks);
        const stick = ticks.map(x => (x - tckn)/(tckx - tckn));
        const ncolor = palette.length;
        const colorPalette: [number, string][] = [];
        for (let j = 0; j < ncolor; j++) {
            const data = [stick[j], palette[j]] as [number, string];
            colorPalette.push(data);
        }

        return { colorPalette, ticks, tckn, tckx };
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

        const parseParts = (dt: Date) =>
            Object.fromEntries(kigaliFormatter.formatToParts(dt).map(p => [p.type, p.value]));

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
        const ymin = Math.min(...heights)+radarAltitude;
        const ymax = Math.max(...heights);

        const p_ymin = ymin;
        const p_ymax = ymax + (ymax - ymin) * 0.05;

        const colsize = (xmax - xmin) / (times.length - 1);
        const rowsize = heights[1]-heights[0];

        // Day/Night bar 
        const heightPb = (ymax - ymin) * 0.03; 
        const startPb: number[] = [times[0]];
        let isDay0 = times[0]>=sunrise[0] && times[0]<=sunset[0];
        const colorPb: string[] = [isDay0?'#f7f78f':'#162c54'];
        const daynightPb: string[] = [isDay0?'Daytime':'Night'];
        const endPb: number[] = [];

        for (let j=1;j<times.length;j++){
            const isDay = times[j]>=sunrise[j] && times[j]<=sunset[j];
            if (isDay0!==isDay){
                endPb.push(times[j]);
                startPb.push(times[j]);
                colorPb.push(isDay?'#f7f78f':'#162c54');
                daynightPb.push(isDay?'Daytime':'Night');
            }
            isDay0=isDay;
        }
        if (endPb.length!==startPb.length) endPb.push(times[times.length-1]);

        const drawDayNightBar = (chart: DayNightChart) => {
            chart.dayNightRects?.forEach(r=>r.destroy());
            chart.dayNightRects = [];
            for (let j = 0; j < startPb.length; j++) {
                const xs=startPb[j];
                const ys=chart.yAxis[0].min! -1.6 * heightPb;
                const xw=endPb[j] - startPb[j];
                const yh=heightPb;

                const xP=chart.xAxis[0].toPixels(xs);
                const yP=chart.yAxis[0].toPixels(ys + yh);
                const wP=chart.xAxis[0].toPixels(xs + xw) - xP;
                const hP=chart.yAxis[0].toPixels(ys) - yP;

                const rect=chart.renderer.rect(xP, yP, wP, hP, 0)
                    .attr({fill:colorPb[j],zIndex:5})
                    .add();
                const tooltip= chart.renderer.label(
                    daynightPb[j],
                    xP + wP/ 2 - 70,
                    yP + hP - 30,
                    'rect',
                    0, 0, true
                )
                    .attr({
                            padding: 8,
                            margin: '0 0 0 0',
                            fill:'rgba(0,0,0,0.75)',
                            zIndex: 9
                        })
                    .css({
                        color:'#fff',
                        fontSize:'11px',
                        pointerEvents:'none',
                    })
                    .hide().add();
                rect.element.addEventListener('mouseover',()=>tooltip.show());
                rect.element.addEventListener('mouseout',()=>tooltip.hide());
                chart.dayNightRects.push(rect);
                chart.dayNightRects.push(tooltip);
            }
        };

        Highcharts.setOptions({time:{useUTC:false,timezone:'Africa/Kigali'}});

        //
        const options: Highcharts.Options = {
            exporting: {
                buttons: {
                    contextButton: {
                        enabled: false,
                    }
                },
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
            title:{text:title?`${data.name} [${data.units}]`:undefined, style:{color:chartLegendColor,fontSize:'12px'}},
            xAxis:{
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
                        fontSize: '11px',
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
            yAxis:{
                min:p_ymin,
                max:p_ymax,
                startOnTick: false,
                endOnTick: false,
                lineColor: chartGridline,
                tickColor: chartGridline,
                softMin: p_ymin,
                softMax: p_ymax,
                title:{
                    text:'Altitude (m)',
                    style: {
                        color: chartLegendColor,
                        fontWeight: '500',
                    }
                }, 
                gridLineWidth:0, 
                labels:{
                    useHTML: false,
                    style:{
                        color: chartFontColor,
                        fontSize:'12px'
                    },
                    format: '{value}'
                },
            },
            series:[{
                type:'heatmap',
                boostThreshold: 1,
                animation: false,
                allowPointSelect: false,
                name:data.name,
                data: seriesData,
                turboThreshold:0,
                colsize,
                rowsize,
                nullColor:'#c8c8c8',
                tooltip:{
                    pointFormatter:function(this:Highcharts.Point){
                    if(this.value!==null&&this.value!==undefined){
                        return `<b>Time:</b> ${formatKigaliFull(new Date(this.x as number))}<br>
                                <b>Altitude:</b> ${this.y} m<br>
                                <b>${data.name}:</b> ${this.value.toFixed(2)} ${data.units}`;
                    } return '';
                }}
            }],
            tooltip:{
                enabled:true
            },
            colorAxis:{
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
            legend:legend ? {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'middle',
                symbolHeight: 250,
            }:{enabled:false},
            credits:{enabled:false}
        };

        chartRef.current?.chart.update(options,true,true, false);

    },[data, radarAltitude, legend, title, colorPalette, chartFontColor, chartHeight, chartLegendColor]);

    return (

            <HighchartsReact containerProps={{style:{width:'100%'}}} highcharts={Highcharts} options={{}} ref={chartRef} />
    );
};

export default VptsHeatmapChart;
