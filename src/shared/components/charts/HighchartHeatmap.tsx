import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCHeatmap from 'highcharts/modules/heatmap';
import type { CrossSectionBioClassResponse, CrossSectionRadarResponse } from '../../../api/endpoints/crossSectionAPI';

HCHeatmap(Highcharts);



interface VcrossHeatmapProps {
  data: CrossSectionRadarResponse | CrossSectionBioClassResponse;
}

const VcrossHeatmap: React.FC<VcrossHeatmapProps> = ({ data }) => {
  const heatmapData = useMemo(() => {
    const points: [number, number, number][] = [];
    data.vcross.forEach((row, yIndex) => {
      row.forEach((value, xIndex) => {
        if (value !== null && value !== undefined) {
          points.push([xIndex, yIndex, value]);
        }
      });
    });
    return points;
  }, [data]);

  const options: Highcharts.Options = {
    chart: {
      type: 'heatmap',
      // backgroundColor: 'transparent', 
      plotBorderWidth: 0,
      margin: [60, 100, 80, 100],
      height: 600,
      style: {
        fontFamily: 'Work-sans, Inter, sans-serif',
      },
    },
    title: {
      text: `Vertical Cross Section of ${data.info.name}`,
      style: {
        color: '#2b2b2b ',
        fontSize: '14px',
        fontWeight: '600',
      },
    },
    subtitle: {
      text: `(${data.start_point.lat.toFixed(2)}, ${data.start_point.lon.toFixed(2)}) → (${data.end_point.lat.toFixed(2)}, ${data.end_point.lon.toFixed(2)})`,
      style: {
        color: '#bbbbbb',
        fontSize: '13px',
      },
    },
    xAxis: {
      categories: data.xaxis.values.map((v) => v.toFixed(1)),
      title: {
        text: data.xaxis.label,
        style: { color: '#ffffff', fontSize: '13px' },
      },
      labels: { style: { color: '#cccccc', fontSize: '11px' } },
      lineColor: '#333',
      tickColor: '#555',
    },
    yAxis: {
      categories: data.yaxis.values.map((v) => v.toFixed(1)),
      title: {
        text: data.yaxis.label,
        style: { color: '#ffffff', fontSize: '13px' },
      },
      labels: { style: { color: '#cccccc', fontSize: '11px' } },
      reversed: false,
      gridLineColor: '#222',
      min: 0,
      max: 6000,
      tickInterval: 500,
    },
    colorAxis: {
      min: Math.min(...heatmapData.map((p) => p[2])),
      max: Math.max(...heatmapData.map((p) => p[2])),
      stops: [
        [0, '#001f3f'], 
        [0.25, '#0074D9'],
        [0.5, '#2ECC40'], 
        [0.75, '#FFDC00'], 
        [1, '#FF4136'], 
      ],
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      verticalAlign: 'middle',
      symbolHeight: 200,
      itemStyle: { color: '#ffffff', fontSize: '11px' },
    },
    series: [
      {
        name: 'Value',
        type: 'heatmap',
        data: heatmapData,
        borderWidth: 0.3,
        borderColor: '#222',
        dataLabels: { enabled: false },
      },
    ],
    tooltip: {
      backgroundColor: '#1a1d25',
      borderColor: '#333',
      style: { color: '#fff', fontSize: '12px' },
      formatter: function () {
        const xLabel = data.xaxis.values[(this.point as any).x];
        const yLabel = data.yaxis.values[(this.point as any).y];
        const value = (this.point as any).value;
        return `
          <b>${value.toFixed(2)}</b><br/>
          ${data.xaxis.label}: ${xLabel.toFixed(2)}<br/>
          ${data.yaxis.label}: ${yLabel.toFixed(2)}
        `;
      },
    },
    credits: { enabled: false },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default VcrossHeatmap;
