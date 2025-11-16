import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { radar_ParameterOptions, radar_TypeOptions } from "../../../shared/static/select-options";

interface RadarOptionsState {
    isPopupOpen: boolean;
    selectedType: SelectOption;
    availableTypes: SelectOption[];
    selectedParameter: SelectOption;
    availableParameters: SelectOption[];

    // still image time
    radarTimeHist: string;

    // Time ranges for gif animated
    startTimeRadar: string;
    endTimeRadar: string;
}

const initialState: RadarOptionsState = {
    isPopupOpen: false,
    availableParameters: radar_ParameterOptions,
    availableTypes: radar_TypeOptions,
    selectedType: radar_TypeOptions[0],
    selectedParameter: radar_ParameterOptions[0],
    radarTimeHist: '2020-11-10 12:00:33',

    startTimeRadar: '2020-11-10 12:00:33',
    endTimeRadar: '2020-11-10 12:50:00'
} 

const radarOptionSlice = createSlice({
    name: 'radaroption',
    initialState,
    reducers: {
        setSelectedHistRadarType: (state, action) => {
            state.selectedType = action.payload;
        },
        setSelectedHistRadarParameter: (state, action) => {
            state.selectedParameter = action.payload;
        },
        setRadarStartTimeHist: (state, action) => {
            state.startTimeRadar = action.payload;
        },
        setRadarEndTimeHist: (state, action) => {
            state.endTimeRadar = action.payload;
        },
        setRadarTimeHist: (state, action) => {
            state.radarTimeHist = action.payload;
        },
        toggleRadarPopup: (state) => {
            state.isPopupOpen = !state.isPopupOpen;
        },
        closeRadarPopup: (state) => {
            state.isPopupOpen = false;
        }
    }
});

export const { setSelectedHistRadarParameter, setRadarEndTimeHist, setRadarStartTimeHist, setSelectedHistRadarType, setRadarTimeHist, closeRadarPopup, toggleRadarPopup } = radarOptionSlice.actions;
export default radarOptionSlice.reducer;