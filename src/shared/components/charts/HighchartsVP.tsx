import { forwardRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useTheme } from '../../hooks/useTheme';
import type { VpResponse } from '../../../api/endpoints/verical_profile/verticalProfilesAPI';
import { ErrorBoundary } from "react-error-boundary";
import { useHighchartsModules } from './hook/useChartModules';



interface VpChartHighchartsProps {
  data: VpResponse;
  radarAltitude?: number;
  selectedHeight?: number;
  displayTitle?: boolean;
  chartHeight?: number | string;
}

type AxisWithBands = Highcharts.Axis & {
  plotLinesAndBands?: Highcharts.PlotLineOrBand[];
};


const VpChartHighcharts = forwardRef<HighchartsReact.RefObject | null, VpChartHighchartsProps>(
  ({ data, chartHeight, displayTitle, radarAltitude = 1616, selectedHeight = 0 }, chartRef) => {


    // Loading dynamically module
    const isModuleReady = useHighchartsModules(['accessibility', 'exporting', 'export-data', 'offline-exporting', 'windbarb']);

    const theme = useTheme();
    const { chartFontColor, chartGridline, chartLegendColor, borderBox } = theme.theme.charts;

    const seriesData = data.height.map((h, i) => [h, data.parameter[i]]);

    const seriesWind = data.height
      .map((h, i) => [h, data.ff[i], data.dd[i]])
      .filter(([ff]) => ff! > 0.1);
    
    const vmax = Math.max(...data.parameter.filter((v): v is number => v !== null));

    const options: Highcharts.Options = {
      exporting: { buttons: { contextButton: { enabled: false } } },

      chart: {
        inverted: true,
        reflow: true,
        backgroundColor: 'transparent',
        height: chartHeight ?? null,
        borderColor: borderBox,
        borderWidth: 1,
        borderRadius: 3,

        events: {
          load: function () {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const chart = this;
            const yPos = chart.plotLeft;
            const xPix = chart.xAxis[0].toPixels(radarAltitude);
            const arrowLen = 15;
            const halfH = 6;
            const offset = 16;

            const arrowPath: Highcharts.SVGPathArray = [
              ['M', yPos - offset, xPix - halfH],
              ['L', yPos - offset + arrowLen, xPix],
              ['L', yPos - offset, xPix + halfH],
              ['Z']
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
                zIndex: 999,
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

          redraw: function () {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const chart = this;
          
            const axis = chart.xAxis[0] as AxisWithBands;
          
            axis.plotLinesAndBands?.forEach(plb => plb.destroy());
          
            axis.addPlotLine({
              id: 'selectedHeightLine',
              color: 'brown',
              width: 2,
              value: radarAltitude + selectedHeight
            });
          }
          
          
        }
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
          lineColor: chartGridline,
          tickColor: chartGridline,
          lineWidth: 1,
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
          style: { color: chartLegendColor, fontSize: '11px', },
        },
        labels: {
          format: '{value}',
          style: { color: chartFontColor, fontSize: '11px',  },
        },
        lineColor: chartGridline,
        gridLineColor: chartGridline,
        lineWidth: 1,
        tickColor: chartGridline,
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
          turboThreshold: 0,
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
          turboThreshold: 0
        },
      ],

      legend: { enabled: false },
      credits: { enabled: false },
    };

    // Render nothing if modules are not ready
    if (!isModuleReady) {
      return <div></div>;
    }

    return (
      <ErrorBoundary fallback={<div>...</div>}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
          containerProps={{ style: { width: '100%' } }}
        />
      </ErrorBoundary>
    );
  }
);

export default VpChartHighcharts;
