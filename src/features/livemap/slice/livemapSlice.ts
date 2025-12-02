import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ClassificationDataPayload } from "../../../api/endpoints/spatial/classificationAPI";


const avalaibleTimes: string[] = [
    "2020-11-10 12:00:33",
    "2020-11-10 12:10:05",
    "2020-11-10 12:20:10",
    "2020-11-10 12:30:16",
    "2020-11-10 12:40:23",
    "2020-11-10 12:50:30",
    "2020-11-10 12:05:20",
    "2020-11-10 12:15:25",
    "2020-11-10 12:15:26",
    "2020-11-10 12:35:01",
    "2020-11-10 12:45:08",
    "2020-11-10 12:55:14",
]



interface LivemapState {
    classificationPayload: ClassificationDataPayload;
    mapTimeRange: string[],
    selectedMapTime: string;
}


const initialState: LivemapState = {
    classificationPayload: {
        class: 'species',
        color_0: '#dc3545',
        color_1: '#0d6efd',
        height: 0,
        time: '2020-11-10 12:00:33',
    },
    mapTimeRange: avalaibleTimes,
    selectedMapTime: avalaibleTimes[0]   
}

const livemapSlice = createSlice({
    name: 'livemap',
    initialState,
    reducers: {
        setClassificationPayload: (state, action: PayloadAction<Partial<ClassificationDataPayload>>) => {
            state.classificationPayload = {...state.classificationPayload, ...action.payload}
        },

        setSelectedTime: (state, action) => {
            state.selectedMapTime = action.payload;
        }
        
    }
})

export const { setSelectedTime, setClassificationPayload } = livemapSlice.actions;
export default livemapSlice.reducer;

