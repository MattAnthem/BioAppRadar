import type { Data, Layout } from "plotly.js";
import type { VtipResponse } from "../../../api/endpoints/verticalProfilesAPI";
import { useTheme } from "../../hooks/useTheme";
import Plot from "react-plotly.js";

interface Props {
    data: VtipResponse | null;
  }
  
  const VtipLineChart: React.FC<Props> = ({ data }) => {
    const theme = useTheme();
    const textColor = theme.theme.chartFontColor;
  
    if (!data) {
      return <div className="text-gray-400 text-center p-4">No data available</div>;
    }
  
  
    // Trace (vertical profile)
    const trace: Data = {
      type: "scatter",
      mode: "lines",
      x: data.times,
      y: data.parameter,
      line: { color: "black", width: 2 },
      // marker: { size: 6, color: "white", line: { color: "red", width: 1 } },
      name: `${data.name} (${data.units})`,
      connectgaps: true,
    };
  
  
    const layout: Partial<Layout> = {
      xaxis: {
        // title: { text: "Altitude [m]" } ,
        rangemode: 'tozero',
        tickformat: "%Y-%m-%d",
        tickangle: -9,
      },
      yaxis: {
        title: { text: `${data.name} [${data.units}]`, font: {size: 12} },
        autorange: "min",
        rangemode: 'nonnegative'
      },
      margin: { l: 60, r: 20, t: 45, b: 40 },
      // height: 3,
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { color: textColor },
    };
  
    return (
      <div className="w-full h-full">
        <Plot
          className="w-full h-full"
          data={[trace]}
          layout={{...layout, autosize: true, height: undefined}}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: "100%", height: "100%" }}
          useResizeHandler
        />
      </div>
    );
  };
  
  export default VtipLineChart;
  