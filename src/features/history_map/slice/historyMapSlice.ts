import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RadarGridPayload, RadarPayload, RadarPolarPayload, SevipPayload } from "../../../api/endpoints/spatialDataAPI";
import type { ClassificationDataPayload } from "../../../api/endpoints/classificationAPI";



interface HistorymapSliceState {
    mapModeHist: 'sevip' | 'classification' | 'radar';
    radarPayloadHist: RadarPayload;
    sevipPayloadHist: SevipPayload;
    classifPayloadHist: ClassificationDataPayload;
} 

const initialState: HistorymapSliceState = {
    mapModeHist: 'classification',
    radarPayloadHist: {
        colorbar: 'turbo',
        parameter: 'ref',
        time: '2020-11-10 12:00:33',
        type: 'grid',
        height: 0,
    },
    classifPayloadHist: {
        class: 'biometeo',
        color_0: '#dc3545',
        color_1: '#0d6efd',
        height: 250,
        time: '2020-11-10 12:00:33',
    },
    sevipPayloadHist: {
        parameter: 'vid',
        colorbar: 'viridis',
        time: '2020-11-10 12:00:33',
    }
}

const historymapSlice = createSlice({
    name: 'historymap',
    initialState,
    reducers: {
        setMapModeHist: (state, action) => {
            state.mapModeHist = action.payload;
        },
        setSevipPayloadHist: (state, action: PayloadAction<Partial<SevipPayload>>) => {
            state.mapModeHist = 'sevip';
            state.sevipPayloadHist = {...state.sevipPayloadHist, ...action.payload}
        },
        setClassifPayloadHist: (state, action: PayloadAction<Partial<ClassificationDataPayload>>) => {
            state.mapModeHist = 'classification';
            state.classifPayloadHist = { ...state.classifPayloadHist, ...action.payload }
        },
        setRadarPayloadHist: (
          state,
          action: PayloadAction<Partial<RadarGridPayload> | Partial<RadarPolarPayload>>
        ) => {
          state.mapModeHist = "radar";
        
          const incoming = action.payload;
          const effectiveType = incoming.type ?? state.radarPayloadHist.type;
        
          if (effectiveType === "grid") {
            state.radarPayloadHist = {
              type: "grid",
              parameter: incoming.parameter ?? "ref",
              time: incoming.time ?? "2020-11-10 12:00:33",
              colorbar: incoming.colorbar ?? "turbo",
              height: (incoming as Partial<RadarGridPayload>).height ?? 0,
            };
          } else {
            state.radarPayloadHist = {
              type: "polar",
              parameter: incoming.parameter ?? "ref",
              time: incoming.time ?? "2020-11-10 12:00:33",
              colorbar: incoming.colorbar ?? "turbo",
              elevation_angle: (incoming as Partial<RadarPolarPayload>).elevation_angle ?? 0.5,
            };
          }
        },
        setColorbarForAll: (state, action: PayloadAction<string>) => {
            const color = action.payload;
            state.radarPayloadHist.colorbar = color;
            state.sevipPayloadHist.colorbar = color;
        },
        setAltitudeForAll: (state, action: PayloadAction<number>) => {
            const height = action.payload;
            if (state.mapModeHist === 'radar' && state.radarPayloadHist.type === 'grid') {
                (state.radarPayloadHist as RadarGridPayload).height = height;
            }
            state.classifPayloadHist.height = height;
        }
    }
});

export const { setMapModeHist, setSevipPayloadHist, setClassifPayloadHist, setRadarPayloadHist, setColorbarForAll, setAltitudeForAll } = historymapSlice.actions;
export default historymapSlice.reducer;