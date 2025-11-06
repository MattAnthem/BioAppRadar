import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CrossSectionBioClassPayload, CrossSectionRadarPayload } from "../../../api/endpoints/crossSectionAPI";
import type { ClassificationDataPayload } from "../../../api/endpoints/classificationAPI";
import type { RadarGridPayload, RadarPayload, RadarPolarPayload } from "../../../api/endpoints/spatialDataAPI";

interface VcrossMapState {
    mapMode: 'vcross_bioclass' | 'vcross_radar';
    vcrossBioclassPayload: CrossSectionBioClassPayload;
    vcrossBioclassOvrlayPayload: ClassificationDataPayload;
    vcrossRadarPayload: CrossSectionRadarPayload;
    vcrossRadarOvrlayPayload: RadarPayload,
    coordinates: {
        startLon: number;
        startLat: number;
        endLon: number;
        endLat: number;
    }
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
    },
    vcrossBioclassOvrlayPayload: {
        class: 'species',
        color_0: '#dc3545',
        color_1: '#0d6efd',
        height: 0,
        time: '2020-11-10 12:00:33'
    },
    vcrossRadarPayload: {
        type: 'polar',
        parameter: 'ref',
        time: '2020-11-10 12:40:00',
        startLon: 29.394,
        startLat: -2.325,
        endLon: 30.530,
        endLat: -1.602,
        segment: true
    },
    vcrossRadarOvrlayPayload: {
        colorbar: 'BuGn_r',
        parameter: 'ref',
        time: '2020-11-10 12:00:33', 
        type: 'grid',
        height: 0,
    },
    coordinates: {
        startLon: 29.394,
        startLat: -2.325,
        endLon: 30.530,
        endLat: -1.602,
    }
}

const vcrossMapSlice = createSlice({
    name: 'vcrossmap',
    initialState,
    reducers: {
        setMapMode: (state, action: PayloadAction<'vcross_bioclass' | 'vcross_radar'>) => {
            state.mapMode = action.payload;
        },
        setVcrossBioClassPayload: (state, action: PayloadAction<Partial<CrossSectionBioClassPayload>>) => {
            state.mapMode = 'vcross_bioclass'
            state.vcrossBioclassPayload = { ...state.vcrossBioclassPayload, ...action.payload }
        },
        setVcrossRadarPayload: (state, action: PayloadAction<Partial<CrossSectionRadarPayload>>) => {
            state.mapMode = 'vcross_radar';
            state.vcrossRadarPayload = { ...state.vcrossRadarPayload, ...action.payload }
        },
        setVcrossCoordinates: (state, action) => {
            state.coordinates = action.payload;
        },
        setOverlayClassificationPayload: (state, action: PayloadAction<Partial<ClassificationDataPayload>>) => {
            state.vcrossBioclassOvrlayPayload = { ...state.vcrossBioclassOvrlayPayload, ...action.payload }
        },
        setOverlayRadarPayload: (state, action: PayloadAction<Partial<RadarGridPayload> | Partial<RadarPolarPayload>>) => {
            const prevPayload = state.vcrossRadarOvrlayPayload;
            const incoming = action.payload;
            const effectiveType = incoming.type ?? prevPayload.type;
            if (effectiveType === 'grid') {
                state.vcrossRadarOvrlayPayload = {
                    ...(prevPayload as RadarGridPayload),
                    ...(incoming as Partial<RadarGridPayload>)
                }
            } else {
                state.vcrossRadarOvrlayPayload = {
                    ...(prevPayload as RadarPolarPayload),
                    ...(incoming as Partial<RadarPolarPayload>)
                }
            }
        }
    }
});

export const { setOverlayClassificationPayload, setVcrossBioClassPayload, setVcrossRadarPayload, setVcrossCoordinates, setMapMode, setOverlayRadarPayload } = vcrossMapSlice.actions;
export default vcrossMapSlice.reducer;