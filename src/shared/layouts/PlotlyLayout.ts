import type { Layout, LayoutAxis } from "plotly.js";

type LayoutParams = {
    xaxis: Partial<LayoutAxis>,
    yaxis: Partial<LayoutAxis>,
    textColor: string,
}

export function setLayout(
    {
        textColor,
        xaxis,
        yaxis
    }: LayoutParams
): Partial<Layout> {
    const l: Partial<Layout> = {
        xaxis,
        yaxis,
        margin: { l: 60, r: 20, t: 45, b: 45 },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        font: { color: textColor },
    } 
    return l;
}