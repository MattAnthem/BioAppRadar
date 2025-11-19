import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RadarGridPayload, RadarPayload, RadarPolarPayload, SevipPayload } from "../../../api/endpoints/spatial/spatialDataAPI";
import type { ClassificationDataPayload } from "../../../api/endpoints/spatial/classificationAPI";


interface HistorymapSliceState {
    mapModeHist: 'sevip' | 'classification' | 'radar' | 'sevip_gif' | 'radar_gif' | 'classif_gif';
    radarPayloadHist: RadarPayload;
    sevipPayloadHist: SevipPayload;
    classifPayloadHist: ClassificationDataPayload;

    // gif animated states
    sevipGifPayloadHist: SevipPayload;
    radarGifPayloadHist: RadarPayload;
    classifGifPayloadHist: ClassificationDataPayload;
} 

const initialState: HistorymapSliceState = {
    mapModeHist: 'classification',
    radarPayloadHist: {
        colorbar: 'viridis',
        parameter: 'ref',
        time: '2020-11-10 12:00:33',
        type: 'grid',
        height: 0,
    },
    classifPayloadHist: {
        class: 'species',
        color_0: '#dc3545',
        color_1: '#0d6efd',
        height: 0,
        time: '2020-11-10 12:00:33',
    },
    sevipPayloadHist: {
        parameter: 'vid',
        colorbar: 'viridis',
        time: '2020-11-10 12:00:33',
    },

    // Gif animated default payloads
    sevipGifPayloadHist: {
        colorbar: 'viridis',
        parameter: 'vid',
        startTime: '2020-11-10 12:00:33',
        endTime: '2020-11-10 12:50:00'
    },
    radarGifPayloadHist: {
        colorbar: 'viridis',
        parameter: 'ref',
        startTime: '2020-11-10 12:00:33',
        endTime: '2020-11-10 12:50:00',
        type: 'grid',
        height: 0
    },
    classifGifPayloadHist: {
        class: 'species',
        color_0: '#dc3545',
        color_1: '#0d6efd',
        height: 0,
        startTime: '2020-11-10 12:00:33',
        endTime: '2020-11-10 12:50:00',
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
        setSevipGifPayloadHist: (state, action: PayloadAction<Partial<SevipPayload>>) => {
            state.mapModeHist = 'sevip_gif';
            state.sevipGifPayloadHist = {...state.sevipGifPayloadHist, ...action.payload}
        },
        setClassifPayloadHist: (state, action: PayloadAction<Partial<ClassificationDataPayload>>) => {
            state.mapModeHist = 'classification';
            state.classifPayloadHist = { ...state.classifPayloadHist, ...action.payload }
        },
        setClassifGifPayloadHist: (state, action: PayloadAction<Partial<ClassificationDataPayload>>) => {
            state.mapModeHist = 'classif_gif';
            state.classifGifPayloadHist = { ...state.classifGifPayloadHist, ...action.payload }
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
              colorbar: incoming.colorbar ?? "viridis",
              height: (incoming as Partial<RadarGridPayload>).height ?? 0,
            };
          } else {
            state.radarPayloadHist = {
              type: "polar",
              parameter: incoming.parameter ?? "ref",
              time: incoming.time ?? "2020-11-10 12:00:33",
              colorbar: incoming.colorbar ?? "viridis",
              elevation_angle: (incoming as Partial<RadarPolarPayload>).elevation_angle ?? 0.5,
            };
          }
        },
        setRadarGifPayloadHist: (
          state,
          action: PayloadAction<Partial<RadarGridPayload> | Partial<RadarPolarPayload>>
        ) => {
          state.mapModeHist = "radar_gif";
        
          const incoming = action.payload;
          const effectiveType = incoming.type ?? state.radarGifPayloadHist.type;
        
          if (effectiveType === "grid") {
            state.radarGifPayloadHist = {
              type: "grid",
              parameter: incoming.parameter ?? "ref",
              startTime: incoming.startTime ?? "2020-11-10 12:00:33",
              endTime: incoming.endTime ?? '2020-11-10 12:50:00',
              colorbar: incoming.colorbar ?? "viridis",
              height: (incoming as Partial<RadarGridPayload>).height ?? 0,
            };
          } else {
            state.radarGifPayloadHist = {
              type: "polar",
              parameter: incoming.parameter ?? "ref",
              startTime: incoming.startTime ?? "2020-11-10 12:00:33",
              endTime: incoming.endTime ?? '2020-11-10 12:50:00',
              colorbar: incoming.colorbar ?? "viridis",
              elevation_angle: (incoming as Partial<RadarPolarPayload>).elevation_angle ?? 0.5,
            };
          }
        },
        setColorbarForAll: (state, action: PayloadAction<string>) => {
            const color = action.payload;
            switch (state.mapModeHist) {
              case ('radar'):
                state.radarPayloadHist.colorbar = color;
                break;
              case ('radar_gif'):
                state.radarGifPayloadHist.colorbar = color;
                break;
              case ('sevip'):
                state.sevipPayloadHist.colorbar = color;
                break;
              case ('sevip_gif'):
                state.sevipGifPayloadHist.colorbar = color;
                break;
            }    
        },
        setAltitudeForAll: (state, action: PayloadAction<number>) => {
            const height = action.payload;
            if (state.mapModeHist === 'radar'  && state.radarPayloadHist.type === 'grid') {
                (state.radarPayloadHist as RadarGridPayload).height = height;
                
            }
            else if (state.mapModeHist === 'radar_gif' && state.radarGifPayloadHist.type === 'grid') {
                (state.radarGifPayloadHist as RadarGridPayload).height = height;
            }
            state.classifPayloadHist.height = height;
            state.classifGifPayloadHist.height = height;
        },
        setElevation: (state, action: PayloadAction<number>) => {
            if ((state.mapModeHist === 'radar' || state.mapModeHist === 'radar_gif') && (state.radarPayloadHist.type === 'polar' || state.radarGifPayloadHist.type === 'polar')) {
                (state.radarPayloadHist as RadarPolarPayload).elevation_angle = action.payload;
                (state.radarGifPayloadHist as RadarPolarPayload).elevation_angle = action.payload;
            }
        }
    }
});

export const { 
    setMapModeHist, 
    setSevipGifPayloadHist, 
    setRadarGifPayloadHist, 
    setSevipPayloadHist, 
    setClassifPayloadHist, 
    setClassifGifPayloadHist,
    setRadarPayloadHist, 
    setColorbarForAll, 
    setAltitudeForAll, 
    setElevation } = historymapSlice.actions;
export default historymapSlice.reducer;