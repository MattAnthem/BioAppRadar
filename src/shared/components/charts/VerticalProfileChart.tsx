import React from "react";
import Plot from "react-plotly.js";
import type { Data } from "plotly.js"; // adapte le chemin à ton projet
import type { VpResponse } from "../../../api/endpoints/verticalProfilesAPI";
import { useTheme } from "../../hooks/useTheme";
import { setLayout } from "../../layouts/PlotlyLayout";

interface Props {
  data: VpResponse | null;
}

const VerticalProfileChart: React.FC<Props> = ({ data }) => {
  const theme = useTheme();
  const textColor = theme.theme.chartFontColor;

  if (!data) {
    return <div className="text-gray-400 text-center p-4">No data available</div>;
  }



  const trace: Data = {
    type: "scatter",
    mode: "lines+markers",
    x: data.parameter,
    y: data.height,
    line: { color: "red", width: 2 },
    marker: { size: 6, color: "white", line: { color: "red", width: 1 } },
    name: `${data.name} (${data.units})`,
    connectgaps: true,
  };


  const layout = setLayout({
    xaxis: {
      title: { text: `${data.name} [${data.units}]`, font: {size: 12} },
      rangemode: 'tozero'
    },
    yaxis: {
      title: { text: "Altitude [m]", font: { size: 12 } },
      autorange: "min",
      rangemode: 'nonnegative'
    },
    textColor
  })



  return (
    <div className="w-full h-full">
      <Plot
        className="w-full h-full"
        data={[trace]}
        layout={{
          ...layout,
          autosize: true,
          height: undefined, 
        }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler
      />
    </div>
  );
};

export default VerticalProfileChart;
