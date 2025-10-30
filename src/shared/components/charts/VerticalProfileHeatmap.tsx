import React from "react";
import Plot from "react-plotly.js";
import type { Layout, Data } from "plotly.js";
import type { VptsResponse } from "../../../api/endpoints/verticalProfilesAPI";
import { useTheme } from "../../hooks/useTheme";



interface Props {
  data: VptsResponse | null;
}

const VerticalProfileHeatmap: React.FC<Props> = ({ data }) => {
  const theme = useTheme();
  const textColor = theme.theme.chartFontColor;

  if (!data) {
    return <div className="text-gray-400 text-center p-4">No data available</div>;
  }

  const trace: Data = {
    type: "heatmap",
    z: data.parameter,
    x: data.times,      
    y: data.height,     
    colorscale: "Cividis",
    // colorbar: { title: `${data.name} [${data.units}]` },
    // zsmooth: "fast", 
  };

  const layout: Partial<Layout> = {
    xaxis: {
      title: { text: "Time" },
      type: "date", 
      tickangle: -45,
      
    },
    yaxis: {
      title: { text: "Altitude [m]" },
      dtick: 500,
      autorange: "reversed", 
      rangemode: 'nonnegative'
    },
    margin: { l: 60, r: 20, t: 45, b: 40 },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: { color: textColor },
  };

  return (
    <div className="w-full h-full">
      <Plot
        className="w-full h-full"
        data={[trace]}
        layout={{...layout, autosize: true,}}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default VerticalProfileHeatmap;