import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import Windbarb from 'highcharts/modules/windbarb';
import HighchartsReact from 'highcharts-react-official';
import { useTheme } from '../../hooks/useTheme';
import type { VpResponse } from '../../../api/endpoints/verticalProfilesAPI';

Windbarb(Highcharts);

interface VpChartHighchartsProps {
  data: VpResponse;
  radarAltitude?: number;      
  selectedHeight?: number;
  displayTitle?: boolean;   
  chartHeight?: number; 
}

const VpChartHighcharts: React.FC<VpChartHighchartsProps> = ({
  data,
  radarAltitude = 1616,
  selectedHeight = 0,
  displayTitle,
  chartHeight,
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const theme = useTheme();
  const { chartFontColor, chartGridline, chartLegendColor } = theme.theme;

  const getChartOptions = (): Highcharts.Options => {
    const seriesData = data.height.map((h, i) => [h, data.parameter[i]]);
    const seriesWind = data.height.map((h, i) => [h, data.ff[i], data.dd[i]]);
    const vmax = Math.max(...data.parameter.filter((v): v is number => v !== null));

    return {
      chart: {
        inverted: true,
        backgroundColor: 'transparent',
        height: chartHeight || 365,
        events: {
          load: function () {
            const chart = this;
            const yPos = chart.plotLeft;
            const xPix = chart.xAxis[0].toPixels(radarAltitude);
            const arrowLength = 15;
            const arrowHalfHeight = 6;
            const offset = 16;

            // Dessin de la flèche radar altitude
            const arrowPath = [
              'M', yPos - offset, xPix - arrowHalfHeight,
              'L', yPos - offset + arrowLength, xPix,
              'L', yPos - offset, xPix + arrowHalfHeight,
              'Z'
            ];

            const arrow = chart.renderer.path(arrowPath)
              .attr({
                fill: 'orange',
                stroke: 'red',
                'stroke-width': 2,
                zIndex: 5,
                cursor: 'pointer',
              })
              .add();

            const tooltip = chart.renderer
              .label(`Radar altitude: ${radarAltitude} m`, yPos + 15, xPix - 20)
              .attr({
                fill: 'rgba(0,0,0,0.75)',
                padding: 6,
                r: 4,
                zIndex: 9,
              })
              .css({
                color: '#FFFFFF',
                fontSize: '12px',
                pointerEvents: 'none',
              })
              .hide()
              .add();

            arrow.element.addEventListener('mouseover', () => tooltip.show());
            arrow.element.addEventListener('mouseout', () => tooltip.hide());
          },
        },
      },
      title: { 
        text: displayTitle ? `${data.name} [${data.units}]` : undefined, 
        style: { color: chartFontColor, fontSize: '13px' },
      },
      xAxis: [
        {
          min: radarAltitude - 250,
          max: radarAltitude + 5000,
          tickInterval: 500,
          reversed: false,
          title: {
            text: 'Altitude [m]',
            style: { color: chartLegendColor, fontSize: '11px' },
          },
          labels: {
            format: '{value}',
            style: { color: chartFontColor, fontSize: '11px' },
          },
          gridLineColor: chartGridline,
          gridLineWidth: 1,
          plotLines: [
            {
              color: 'brown',
              width: 2,
              value: radarAltitude + selectedHeight,
            },
          ],
        },
        {
          id: 'windbarb-axis',
          opposite: true,
          linkedTo: 0,
          labels: { enabled: false },
          lineWidth: 1,
          tickLength: 0,
        },
      ],
      yAxis: {
        title: {
          text: `${data.name} [${data.units}]`,
          style: { color: chartLegendColor, fontSize: '11px' },
        },
        labels: {
          format: '{value}',
          style: { color: chartFontColor, fontSize: '11px' },
        },
        gridLineColor: chartGridline,
        lineWidth: 1,
      },
      series: [
        {
          type: 'spline',
          name: data.name,
          data: seriesData,
          color: '#0077cc',
          lineWidth: 2,
          marker: { enabled: true, radius: 3 },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `Altitude: {point.x} m<br>{series.name}: {point.y:.2f} ${data.units}`,
          },
        },
        {
          type: 'windbarb',
          xAxis: 'windbarb-axis',
          data: seriesWind,
          name: 'Wind',
          color: 'red',
          lineWidth: 1.5,
          vectorLength: 20,
          xOffset: vmax,
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `Altitude: {point.x} m<br>Speed: {point.value:.1f} m/s<br>Direction: {point.direction:.0f}°`,
          },
        },
      ],
      legend: { enabled: false },
      credits: { enabled: false },
    };
  };
  useEffect(() => {
    if (chartRef.current?.chart) {
      const chart = chartRef.current.chart;
      chart.update(
        {
          xAxis: [
            {
              plotLines: [
                {
                  color: 'brown',
                  width: 2,
                  value: radarAltitude + selectedHeight,
                },
              ],
            },
          ],
        },
        false
      );
      chart.redraw();
    }
  }, [selectedHeight, radarAltitude]);

  return (
    <div className="h-full w-full">
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
