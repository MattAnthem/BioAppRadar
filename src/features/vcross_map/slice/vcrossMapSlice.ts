import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CrossSectionBioClassPayload, CrossSectionRadarPayload } from "../../../api/endpoints/crossSectionAPI";
import type { ClassificationDataPayload } from "../../../api/endpoints/spatial/classificationAPI";
import type { RadarGridPayload, RadarPayload, RadarPolarPayload, SevipPayload } from "../../../api/endpoints/spatial/spatialDataAPI";

interface VcrossMapState {
    mapMode: 'vcross_bioclass' | 'vcross_radar' | 'vcross_sevip';
    vcrossBioclassPayload: CrossSectionBioClassPayload;
    vcrossBioclassOvrlayPayload: ClassificationDataPayload;
    vcrossRadarPayload: CrossSectionRadarPayload;
    vcrossRadarOvrlayPayload: RadarPayload,
    vcrossSevipOvrlayPayload: SevipPayload,
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
        colorbar: 'viridis',
        parameter: 'ref',
        time: '2020-11-10 12:00:33', 
        type: 'grid',
        height: 0,
    },
    vcrossSevipOvrlayPayload: {
        colorbar: 'viridis',
        time: '2020-11-10 12:00:33',
        parameter: 'vir'
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
        setVcrossSevipPayload: (state, action: PayloadAction<Partial<SevipPayload>>) => {
            state.mapMode = 'vcross_sevip';
            state.vcrossSevipOvrlayPayload = { ...state.vcrossSevipOvrlayPayload, ...action.payload };
        },
        setVcrossCoordinates: (state, action) => {
            state.coordinates = action.payload;
        },
        setOverlayClassificationPayload: (state, action: PayloadAction<Partial<ClassificationDataPayload>>) => {
            state.vcrossBioclassOvrlayPayload = { ...state.vcrossBioclassOvrlayPayload, ...action.payload }
        },
        setOverlayRadarPayload: (state, action: PayloadAction<Partial<RadarGridPayload> | Partial<RadarPolarPayload>>) => {
            const incoming = action.payload;
            const effectiveType = incoming.type ?? state.vcrossRadarOvrlayPayload.type;
          
            if (effectiveType === "grid") {
              state.vcrossRadarOvrlayPayload = {
                type: "grid",
                parameter: incoming.parameter ?? "ref",
                time: incoming.time ?? "2020-11-10 12:00:33",
                colorbar: incoming.colorbar ?? "turbo",
                height: (incoming as Partial<RadarGridPayload>).height ?? 0,
              };
            } else {
              state.vcrossRadarOvrlayPayload = {
                type: "polar",
                parameter: incoming.parameter ?? "ref",
                time: incoming.time ?? "2020-11-10 12:00:33",
                colorbar: incoming.colorbar ?? "turbo",
                elevation_angle: (incoming as Partial<RadarPolarPayload>).elevation_angle ?? 0.5,
              };
            }
        },
        changeVcrossColorbar: (state, action: PayloadAction<string>) => {
            state.vcrossRadarOvrlayPayload.colorbar = action.payload;
            state.vcrossSevipOvrlayPayload.colorbar = action.payload;
        }
    }
});

export const { setVcrossSevipPayload, setOverlayClassificationPayload, setVcrossBioClassPayload, setVcrossRadarPayload, setVcrossCoordinates, setMapMode, setOverlayRadarPayload, changeVcrossColorbar } = vcrossMapSlice.actions;
export default vcrossMapSlice.reducer;