import React from "react";
import Plot from "react-plotly.js";
import type { Data } from "plotly.js";
import type { VptsResponse } from "../../../api/endpoints/verticalProfilesAPI";
import { useTheme } from "../../hooks/useTheme";
import { setLayout } from "../../layouts/PlotlyLayout";


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
  };


  const layout = setLayout({
    xaxis: {
      type: "date", 
      tickangle: -9,
      tickformat: "%Y-%m-%d",
    },
    yaxis: {
      title: { text: `Altitude (m)`, font: {size: 12} },
      dtick: 800,
      rangemode: 'nonnegative'
    },
    textColor
  })



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

export default VerticalProfileHeatmap;