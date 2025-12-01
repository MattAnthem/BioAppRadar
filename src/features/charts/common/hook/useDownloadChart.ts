import type HighchartsReact from "highcharts-react-official";
import type { RefObject } from "react";

type UseDownloadChartParams = {
    filename: string;
    highchartsRef?: RefObject<HighchartsReact.RefObject | null>;
    chartImgRef?: RefObject<HTMLImageElement | null>;
};

/**
 * Hooks to download chart as image/PDF or CSV data
 * 
 * @param filename - The filename for the downloaded chart 
 * @param highchartsRef - RefObject to HighchartsReact component
 * @param chartImgRef - RefObject to HTMLImageElement of the chart
 * @returns Functions to download chart as image, PDF, CSV data
 */
export function useDownloadChart({
    filename,
    highchartsRef,
    chartImgRef
}: UseDownloadChartParams) {

    // Download interactive Highcharts chart as image
    function downloadInteractiveChart() {
        const chart = highchartsRef?.current?.chart;
        if (!chart) return;
        chart.exportChartLocal({
            filename,
            type: 'image/png',
            sourceWidth: chart.chartWidth,
            sourceHeight: chart.chartHeight,
        },{
            chart: {
                backgroundColor: 'white',
                borderColor: 'black'
            },
            legend: {
                enabled: true,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                itemStyle: {
                    fontSize: '13px'
                }
            }
        })
    }

    // Download interactive Highcharts chart as PDF
    function dowloadChartAsPDF() {
        const chart = highchartsRef?.current?.chart;
        if (!chart) return;
        chart.exportChartLocal({
            filename,
            type: 'application/pdf',
            sourceWidth: chart.chartWidth,
            sourceHeight: chart.chartHeight,
        },{
            chart: {
                backgroundColor: 'white',
                borderColor: 'black'
            },
            legend: {
                enabled: true,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                itemStyle: {
                    fontSize: '13px'
                }
            }
        })
    }

    // Download chart data as CSV
    function dowloadDataCSV() {
        const chart = highchartsRef?.current?.chart;
        if (!chart) return;
        const csv = chart.getCSV();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename.replace(/\.[^/.]+$/, ".csv");
        link.click();
        URL.revokeObjectURL(url);
    }

    // Download static chart image
    async function downloadChartImage()  {
        const img = chartImgRef?.current;
        if (!img?.src) return;
        const resp = await fetch(img.src);
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    return {
        downloadInteractiveChart: highchartsRef ? downloadInteractiveChart : undefined, 
        downloadChartImage: chartImgRef ? downloadChartImage : undefined,
        dowloadDataCSV: highchartsRef ? dowloadDataCSV : undefined,
        dowloadChartAsPDF: highchartsRef ? dowloadChartAsPDF : undefined,
    }
}