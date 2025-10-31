import React from "react";
import Plot from "react-plotly.js";
import type { Layout, Data } from "plotly.js";
import { useTheme } from "../../hooks/useTheme";
import type { CrossSectionResponse } from "../../../api/endpoints/spatialDataAPI";

interface Props {
  data: CrossSectionResponse | null;
}

const CrossSectionHeatmap: React.FC<Props> = ({ data }) => {
  const theme = useTheme();
  const textColor = theme.theme.chartFontColor;

  if (!data) {
    return <div className="text-gray-400 text-center p-4">No data available</div>;
  }

  // ---- Calcul de la distance horizontale cumulée entre chaque point ----
  const distances = computeCumulativeDistances(data.lat, data.lon);

  // ---- Trace Plotly ----
  const trace: Data = {
    type: "heatmap",
    z: data.parameter,
    x: distances,
    y: data.height.map(Number), // hauteur numérique
    colorscale: "Cividis",
    // colorbar: {
    //   title: `${data.name} [${data.units}]`,
    // },
    zsmooth: "best",
  };

  // ---- Layout ----
  const layout: Partial<Layout> = {
    title: {
      text: `${data.name} (Vertical Cross Section)`,
      x: 0.5,
    },
    xaxis: {
      title: { text: "Distance (km)" },
      tickmode: "auto",
    },
    yaxis: {
      title: { text: "Altitude (m)" },
      autorange: "reversed", 
    },
    margin: { l: 70, r: 60, t: 50, b: 60 },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: { color: textColor },
  };

  return (
    <div className="w-full h-full">
      <Plot
        data={[trace]}
        layout={{ ...layout, autosize: true }}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};


function computeCumulativeDistances(latitudes: number[], longitudes: number[]): number[] {
  if (latitudes.length !== longitudes.length) return [];

  const R = 6371; // rayon Terre (km)
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const distances = [0];
  for (let i = 1; i < latitudes.length; i++) {
    const dLat = toRad(latitudes[i] - latitudes[i - 1]);
    const dLon = toRad(longitudes[i] - longitudes[i - 1]);
    const lat1 = toRad(latitudes[i - 1]);
    const lat2 = toRad(latitudes[i]);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    distances.push(distances[i - 1] + distance);
  }

  return distances;
}

export default CrossSectionHeatmap;
