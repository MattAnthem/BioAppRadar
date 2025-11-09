import React, { useRef, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCDataGrouping from 'highcharts/modules/datagrouping';
import HCWindbarb from 'highcharts/modules/windbarb';
import HCAnnotations from 'highcharts/modules/annotations';
import HCAccessibility from 'highcharts/modules/accessibility';
import { useTheme } from '../../hooks/useTheme';
import type { VtipResponse } from '../../../api/endpoints/verticalProfilesAPI';


HCDataGrouping(Highcharts);
HCWindbarb(Highcharts);
HCAnnotations(Highcharts);
HCAccessibility(Highcharts);

interface VtipChartProps {
  data: VtipResponse;
}

const HighchartVtip: React.FC<VtipChartProps> = ({ data }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const { theme } = useTheme();
  const { chartFontColor, chartGridline, chartLegendColor } = theme;

  const options = useMemo(() => {
    if (!data || !data.times?.length) return {};


    const times = data.times.map(t => new Date(t).getTime());
    const sunrise = data.sunrise.map(t => new Date(t).getTime());
    const sunset = data.sunset.map(t => new Date(t).getTime());


    const seriesData = times.map((t, i) => [t, data.parameter[i]]);
    const seriesWind = times.map((t, i) => [t, data.ff[i], data.dd[i]]);

    const pmin = Math.min(...data.parameter);
    const pmax = Math.max(...data.parameter);
    const ymax = pmax + (pmax - pmin) * 0.1;

    const iconPos = ymax;
    const iconLabels = times.map((t, i) => {
      const isDay = t >= sunrise[i] && t <= sunset[i];
      return {
        point: { xAxis: 0, yAxis: 0, x: t, y: iconPos },
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
        zoomType: 'x',
        backgroundColor: 'transparent',
        height: 200,
        style: { fontFamily: 'Inter, sans-serif', color: chartFontColor, fontSize: 14 }
      },
      title: { text: null },
      xAxis: {
        type: 'datetime',
        lineWidth: 1,
        tickLength: 5,
        gridLineColor: chartGridline,
        labels: { style: { color: chartFontColor, fontSize: 11 } }
      },
      yAxis: {
        min: pmin,
        max: ymax,
        title: { text: `${data.name} (${data.units})`, style: { color: chartLegendColor, fontSize: 11 } },
        gridLineWidth: 1,
        gridLineColor: chartGridline,
        labels: { style: { color: chartFontColor, fontSize: 11 } }
      },
      tooltip: {
        shared: true,
        formatter: function (this: any) {
          const header = `<b>${data.name}</b><br/>Time: ${Highcharts.dateFormat('%H:%M', this.x)}<br/>`;
          const param = this.points?.find((p: any) => p.series.type === 'area');
          const wind = this.points?.find((p: any) => p.series.type === 'windbarb');
          let content = '';
          if (param) content += `Value: ${param.y.toFixed(2)} ${data.units}<br/>`;
          if (wind) content += `Wind: ${wind.point.value.toFixed(1)} m/s @ ${wind.point.direction.toFixed(0)}°`;
          return header + content;
        }
      },
      series: [
        {
          type: 'area',
          id: 'parameter',
          data: seriesData,
          name: data.name,
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `Value: {point.y:.2f} ${data.units}<br>Date: {point.x:%Y-%m-%d %H:%M:%S}`
          },
          color: 'rgba(0, 120, 255, 0.4)',
          fillOpacity: 0.5
        },
        {
          type: 'windbarb',
          onSeries: 'parameter',
          data: seriesWind,
          name: 'Wind',
          color: '#FF3B3B',
          lineWidth: 1.5,
          vectorLength: 20,
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `Speed: {point.value:.1f} m/s<br>Direction: {point.direction:.0f}°<br>Date: {point.x:%Y-%m-%d %H:%M:%S}`
          }
        }
      ]
      ,
      annotations: [
        {
          draggable: '',
          labelOptions: {
            allowOverlap: true,
            backgroundColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            verticalAlign: 'bottom',
            align: 'center'
          },
          labels: iconLabels
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
        ref={chartRef}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
    </div>
  );
};

export default HighchartVtip;
