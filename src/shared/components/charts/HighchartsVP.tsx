import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import Windbarb from 'highcharts/modules/windbarb';
import HighchartsReact from 'highcharts-react-official';
import { useTheme } from '../../hooks/useTheme';
import type { VpResponse } from '../../../api/endpoints/verticalProfilesAPI';

// Initialiser le module Windbarb
Windbarb(Highcharts);


interface VpChartProps {
  data: VpResponse;
  radarAltitude?: number; // altitude radar pour plotLine
  selectedHeight?: number;
}

const VpChartHighcharts: React.FC<VpChartProps> = ({ data, radarAltitude = 1616, selectedHeight }) => {
  const chartRef = useRef<HighchartsReact>(null);

  const themes = useTheme();
  const { chartFontColor, chartGridline } = themes.theme;

  const getChartOptions = () => {
    const seriesData = data.height.map((h, i) => [h, data.parameter[i]]);
    const seriesWind = data.height.map((h, i) => [h, data.ff[i], data.dd[i]]);
    const maxParams = Math.max(...data.parameter.filter((v): v is number => v !== null));

    return {
      chart: { 
        inverted: true, 
        backgroundColor: 'transparent', 
        fontFamily: 'Work-sans, Inter, sans-serif',
        reflow: true,
        fontColor: chartFontColor,
      },
      title: { text: null },
      xAxis: [
        {
          reversed: false,
          title: { text: 'Altitude in [m]' },
          labels: { format: '{value}', style: { color: chartFontColor } },
          lineWidth: 1,
          showLastLabel: true,
          tickInterval: 500,
          gridLineWidth: 1,
          max: 7000,
          gridLineColor: chartGridline,
          plotLines: [
            { color: 'brown', width: 2, value: radarAltitude + selectedHeight! }
          ]
        },
        {
          reversed: false,
          id: 'windbarb-axis',
          opposite: true,
          linkedTo: 0,
          labels: { enabled: false },
          lineWidth: 1,
          tickLength: 0
        }
      ],
      yAxis: {
        title: { text: `${data.name} [${data.units}]` },
        labels: { format: '{value}', style: { color: chartFontColor } },
        lineWidth: 1,    
        gridLineColor: chartGridline,
      },
      series: [
        {
          type: 'spline',
          data: seriesData,
          name: data.name,
          color: '#0077cc',
          lineWidth: 2,
          marker: { enabled: true, radius: 3 },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `Value: {point.y:.2f} ${data.units}<br>Altitude: {point.x} m<br>Date: {point.x:%Y-%m-%d %H:%M:%S}`
          }
        },
        {
          type: 'windbarb',
          xAxis: 'windbarb-axis',
          data: seriesWind,
          name: 'Wind',
          color: 'red',
          lineWidth: 1.5,
          vectorLength: 20,
          xOffset: maxParams,
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `Speed: {point.value:.1f} m/s<br>Direction: {point.direction:.0f}°<br>Altitude: {point.x} m<br>Date: {point.x:%Y-%m-%d %H:%M:%S}`
          }
        }
      ],
      legend: { enabled: false  },
      credits: { enabled: false },

    };
  };

  useEffect(() => {
    if (chartRef.current?.chart) {
      const chart = chartRef.current.chart;
      const plotLine = chart.xAxis[0].plotLinesAndBands[0];
      if (plotLine) {
        plotLine.options.value = radarAltitude + selectedHeight!;
        chart.xAxis[0].update({}, false);
        chart.redraw();
      }
    }
  }, [selectedHeight, radarAltitude]);

  return (
    <div className='h-full w-full'>

      <HighchartsReact
        highcharts={Highcharts}
        options={getChartOptions()}
        ref={chartRef}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
    </div>
  );
};

export default VpChartHighcharts;
