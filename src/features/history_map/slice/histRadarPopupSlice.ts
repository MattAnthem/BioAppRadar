import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { radar_options, radar_ParameterOptions, radar_TypeOptions, species_options } from "../../../shared/static/select-options";

interface RadarOptionsState {
    selectedType: SelectOption;
    availableTypes: SelectOption[];
    selectedParameter: SelectOption;
    availableParameters: SelectOption[];
    speciesOptions: SelectOption[];
    selectedSpecie: SelectOption;
    radars: SelectOption[];
    selectedRadar: SelectOption;

    // still image time
    radarTimeHist: string;

    // Time ranges for gif animated
    startTimeRadar: string;
    endTimeRadar: string;
}

const initialState: RadarOptionsState = {
    availableParameters: radar_ParameterOptions,
    availableTypes: radar_TypeOptions,
    selectedType: radar_TypeOptions[0],
    selectedParameter: radar_ParameterOptions[0],
    speciesOptions: species_options,
    selectedSpecie: species_options[0],
    radarTimeHist: '2020-11-10 12:00:33',
    radars: radar_options,
    selectedRadar: radar_options[0],

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
        setSelectedHistRadarSpecie: (state, action) => {
            state.selectedSpecie = action.payload;
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
        setSelectedRadar: (state, action) => {
            state.selectedRadar = action.payload;
        }
    }
});

export const { setSelectedHistRadarParameter, setRadarEndTimeHist, setRadarStartTimeHist, setSelectedHistRadarType, setRadarTimeHist, setSelectedHistRadarSpecie, setSelectedRadar } = radarOptionSlice.actions;
export default radarOptionSlice.reducer;