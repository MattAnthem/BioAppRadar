import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CrossSectionPayload, RadarGridPayload, RadarPayload, RadarPolarPayload, SevipPayload } from "../../../api/endpoints/spatialDataAPI";
import type { ClassificationDataPayload } from "../../../api/endpoints/classificationAPI";




// const avalaibleTimes: string[] = [
//     "2020-11-12 12:00:33",
//     "2020-11-12 12:10:05",
//     "2020-11-12 12:20:10",
//     "2020-11-12 12:30:16",
//     "2020-11-12 12:40:23",
//     "2020-11-12 12:50:30",
//     "2020-11-12 12:05:20",
//     "2020-11-12 12:15:25",
//     "2020-11-12 12:15:26",
//     "2020-11-12 12:35:01",
//     "2020-11-12 12:45:08",
//     "2020-11-12 12:55:14",
// ]
const avalaibleTimes: string[] = [
    "2020-11-12 00:05:00",
    "2020-11-12 00:05:05",
    "2020-11-12 00:05:10",
    "2020-11-12 00:05:15",
    "2020-11-12 00:05:20",
    "2020-11-12 00:05:25",
    "2020-11-12 00:05:30",
    "2020-11-12 00:05:35",
    "2020-11-12 00:05:40",
    "2020-11-12 00:05:45",
    "2020-11-12 00:05:50",
    "2020-11-12 00:05:55"
]


interface LivemapState {
    displayedData: 'sevip' | 'classification' | 'radar'
    sevipPayload: SevipPayload,
    classificationPayload: ClassificationDataPayload;
    radarPayload: RadarPayload;
    crossSectionPayload: CrossSectionPayload;
    mapTimeRange: string[],
    selectedMapTime: string;
}


const initialState: LivemapState = {
    displayedData: 'classification',

    sevipPayload: {
        parameter: 'vid',
        colorbar: 'viridis',
        time: '2020-11-10 12:00:33',
    },
    classificationPayload: {
        class: 'biometeo',
        color_0: '#dc3545',
        color_1: '#0d6efd',
        height: 250,
        time: '2020-11-10 12:00:33',
    },
    radarPayload: {
        colorbar: 'viridis',
        parameter: 'ref',
        time: '2020-11-10 12:00:33', 
        type: 'polar',
        elevation_angle: 0.5,
    },
    crossSectionPayload: {
        startLat: 0,
        startLon: 0,
        endLat: 0,
        endLon: 0,
        map: 'zdr',
        time: '',
        type: 'map'
    },

    mapTimeRange: avalaibleTimes,
    selectedMapTime: avalaibleTimes[0]   
}

const livemapSlice = createSlice({
    name: 'livemap',
    initialState,
    reducers: {

        setDisplayedData: (state, action) => {
            state.displayedData = action.payload;
        },
        setSevipPayload: (state, action: PayloadAction<Partial<SevipPayload>>) => {
            state.displayedData = 'sevip';
            state.sevipPayload = {...state.sevipPayload, ...action.payload}
        },
        setClassificationPayload: (state, action: PayloadAction<Partial<ClassificationDataPayload>>) => {
            state.displayedData = 'classification';
            state.classificationPayload = {...state.classificationPayload, ...action.payload}
        },
        setRadarPayload: (
            state,
            action: PayloadAction<Partial<RadarGridPayload> | Partial<RadarPolarPayload>>
          ) => {
            state.displayedData = "radar";
          
            const prevPayload = state.radarPayload;
            const incoming = action.payload;
          
            const effectiveType = incoming.type ?? prevPayload.type; 
          
            if (effectiveType === "grid") {
              state.radarPayload = {
                ...(prevPayload as RadarGridPayload),
                ...(incoming as Partial<RadarGridPayload>),
              };
            } else {
              state.radarPayload = {
                ...(prevPayload as RadarPolarPayload),
                ...(incoming as Partial<RadarPolarPayload>),
              };
            }
          },
          

        setCrossSectionPayload: (state, action: PayloadAction<Partial<CrossSectionPayload>>) => {
            state.crossSectionPayload = { ...state.crossSectionPayload, ...action.payload }
        },

        setSelectedTime: (state, action) => {
            state.sevipPayload.time = action.payload;
            state.selectedMapTime = action.payload;
        }
        
    }
})

export const { setCrossSectionPayload, setSevipPayload, setSelectedTime, setClassificationPayload, setRadarPayload, setDisplayedData } = livemapSlice.actions;
export default livemapSlice.reducer;

