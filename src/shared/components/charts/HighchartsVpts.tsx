import React, { useRef, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCHeatmap from 'highcharts/modules/heatmap';
import HCAnnotations from 'highcharts/modules/annotations';
import { useTheme } from '../../hooks/useTheme';
import type { VptsResponse } from '../../../api/endpoints/verticalProfilesAPI';

HCHeatmap(Highcharts);
HCAnnotations(Highcharts);



interface VptsChartProps {
  data: VptsResponse;
  radarAltitude?: number;
}

const VptsHeatmapChart: React.FC<VptsChartProps> = ({ data, radarAltitude = 1616 }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const { theme } = useTheme();
  const { chartFontColor, chartGridline, chartLegendColor } = theme;

  const options = useMemo(() => {
    const times = data.times.map(t => new Date(t).getTime());
    const heights = data.height;
    const sunrise = data.sunrise.map(t => new Date(t).getTime());
    const sunset = data.sunset.map(t => new Date(t).getTime());

    const seriesData: [number, number, number | null][] = [];
    for (let j = 0; j < heights.length; j++) {
      for (let i = 0; i < times.length; i++) {
        seriesData.push([times[i], heights[j], data.parameter[j][i]]);
      }
    }

    const palette = ["#FFFFFFFF", "#FFFFD3FF", "#FFFFA8FF", "#FFFF7CFF",
      "#FFFF51FF", "#E6EC26FF", "#A6A300FF", "#FFA300FF",
      "#FFA33FFF", "#FF6E1FFF", "#FF2900FF", "#F20000FF",
      "#A70007FF", "#5D004FFF", "#510097FF", "#2300E0FF",
      "#0000D5FF", "#00008FFF", "#00004AFF", "#000005FF"
  ];
    const colorStops = palette.map((c, i) => [i / (palette.length - 1), c]);


    const xmin = Math.min(...times);
    const xmax = Math.max(...times);
    const ymin = Math.min(...heights);
    const ymax = Math.max(...heights) + radarAltitude;

    const colsize = (xmax - xmin) / (times.length - 1);
    const rowsize = heights[1] - heights[0];


    const iconLabels = times.map((t, i) => {
      const isDay = t >= sunrise[i] && t <= sunset[i];
      return {
        point: { xAxis: 0, yAxis: 0, x: t, y: 0 },
        text: isDay ? '\u2600' : '\u263E',
        style: {
          fontSize: '14px',
          color: isDay ? 'orange' : 'purple'
        },
        y: -5
      };
    });

    return {
      chart: {
        type: 'heatmap',
        zoomType: 'x',
        backgroundColor: 'transparent',
        plotBorderWidth: 1,
        height: 200,
        reflow: true,
        style: { fontFamily: 'Inter, sans-serif', color: chartFontColor, fontSize: 14 }
      },
      title: { text: null },
      xAxis: {
        type: 'datetime',
        lineWidth: 1,
        tickLength: 5,
        gridLineColor: chartGridline,
        labels: { style: { color: chartFontColor } },
      },
      yAxis: {
        min: ymin,
        max: ymax,
        title: { text: 'Altitude (m)' },
        gridLineWidth: 0,
        labels: { style: { color: chartFontColor } }
      },
      colorAxis: {
        min: 0,
        stops: colorStops,
        labels: { format: '{value:.1f}' },
      },
      tooltip: {
        formatter: function (this: any) {
          if (this.point.value !== null) {
            return `
              <b>${data.name}</b><br/>
              <b>Time:</b> ${Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.point.x)}<br>
              <b>Height:</b> ${this.point.y} m<br>
              <b>Value:</b> ${this.point.value.toFixed(2)} ${data.units}
            `;
          }
          return false;
        },
      },
      series: [
        {
          name: data.name,
          data: seriesData,
          turboThreshold: 0,
          colsize,
          rowsize,
          nullColor: '#C8C8C8',
          borderWidth: 0,
        },
      ],
      annotations: [{
        draggable: '',
        labelOptions: {
          allowOverlap: true,
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 0,
          verticalAlign: 'bottom',
          align: 'center',
        },
        labels: iconLabels,
      }],
      legend: { enabled: false },
      credits: { enabled: false },
    };
  }, [data, radarAltitude, chartFontColor, chartGridline]);

  return (
    <div className="w-full h-full">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
    </div>
  );
};

export default VptsHeatmapChart;
