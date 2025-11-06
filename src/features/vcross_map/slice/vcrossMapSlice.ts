import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CrossSectionBioClassPayload } from "../../../api/endpoints/crossSectionAPI";

interface VcrossMapState {
    mapMode: 'vcross_bioclass' | 'vcross_radar'
    vcrossBioclassPayload: CrossSectionBioClassPayload
    // ...
}

const initialState: VcrossMapState = {
    mapMode: 'vcross_bioclass',
    vcrossBioclassPayload: {
        class: 'species',
        time: '2020-11-10 12:00:33',
        startLon: 29.394,
        startLat: -2.325,
        endLon: 30.530,
        endLat: -1.602,
        segment: true
    }
}

const vcrossMapSlice = createSlice({
    name: 'vcrossmap',
    initialState,
    reducers: {
        setVcrossBioClassPayload: (state, action: PayloadAction<Partial<CrossSectionBioClassPayload>>) => {
            state.mapMode = 'vcross_bioclass';
            state.vcrossBioclassPayload = { ...state.vcrossBioclassPayload, ...action.payload }
        }
    }
});

export const { setVcrossBioClassPayload } = vcrossMapSlice.actions;
export default vcrossMapSlice.reducer;