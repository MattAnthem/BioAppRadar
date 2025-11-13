import type { VptsResponse } from "../../../../api/endpoints/verticalProfilesAPI";

// ---
self.onmessage = (e: MessageEvent<{data: VptsResponse}>) => {
    const { data } = e.data;
    if (!data) return;
    const result = computeVpts(data);
    postMessage(result);
}

// Web worker to compute TimeSeries
function computeVpts(data: VptsResponse): [number, number, number | null][] {
    const arr: [number, number, number | null][] = [];
    data.height.forEach((h, j) => {
        data.times.forEach((t, i) => {
            arr.push([Date.parse(t.replace(' ', 'T') + 'Z'), h, data.parameter[j][i]]);
        });
    });
    return arr;
} 