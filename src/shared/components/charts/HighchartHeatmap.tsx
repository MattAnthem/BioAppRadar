import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCHeatmap from 'highcharts/modules/heatmap';
import { useTheme } from '../../hooks/useTheme';
import type { CrossSectionRadarResponse, CrossSectionBioClassResponse } from '../../../api/endpoints/crossSectionAPI';

HCHeatmap(Highcharts);

type Props = {
  data: CrossSectionRadarResponse | CrossSectionBioClassResponse;
};

const VcrossHeatmap: React.FC<Props> = ({ data }) => {
  const { theme } = useTheme();
  const { chartFontColor, chartGridline } = theme;

  const options = useMemo(() => {
    const seriesData: [number, number, number | null][] = [];
    const xVals = data.xaxis.values;
    const yVals = data.yaxis.values;

    for (let j = 0; j < yVals.length; j++) {
      for (let i = 0; i < xVals.length; i++) {
        seriesData.push([xVals[i], yVals[j], data.vcross[j][i]]);
      }
    }

    const colorStops: [number, string][] = [
      [0.0, '#0000FF'],
      [0.2, '#00FFFF'],
      [0.4, '#00FF00'],
      [0.6, '#FFFF00'],
      [0.8, '#FFA500'],
      [1.0, '#FF0000']
    ];

    return {
      chart: {
        type: 'heatmap',
        zoomType: 'x',
        // backgroundColor: 'transparent',
        plotBorderWidth: 1,
        style: {
          fontFamily: 'Inter, sans-serif',
          color: chartFontColor
        }
      },
      title: { text: null },
      xAxis: {
        title: { text: data.xaxis.label },
        lineWidth: 1,
        gridLineColor: chartGridline,
        labels: { style: { color: chartFontColor } }
      },
      yAxis: {
        title: { text: data.yaxis.label },
        labels: { style: { color: chartFontColor } },
        gridLineColor: chartGridline,
        min: 0,
        max: 7000
      },
      colorAxis: {
        min: 0,
        stops: colorStops,
        labels: { format: '{value:.1f}' }
      },
      tooltip: {
        formatter: function (this: any) {
          if (this.point.value !== null) {
            return `
              <b>${data.info.name ?? data.info.class}</b><br/>
              ${data.xaxis.label}: ${this.point.x}<br/>
              ${data.yaxis.label}: ${this.point.y}<br/>
              Value: ${this.point.value.toFixed(2)} ${'units' in data.info ? data.info.units : ''}
            `;
          }
          return false;
        }
      },
      series: [
        {
          type: 'heatmap',
          name: data.info.name ?? data.info.class,
          data: seriesData,
          turboThreshold: 0,
          colsize: 1,
          rowsize: 1000,
          nullColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 0
        }
      ],
      legend: { enabled: false },
      credits: { enabled: false }
    };
  }, [data, chartFontColor, chartGridline]);

  return (
    <div className="w-full h-full">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
    </div>
  );
};

export default VcrossHeatmap;
