import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { RadarParameterOptions, RadarTypeOptions } from "../../livemap/slice/radarPopupSlice";

interface RadarOptionsState {
    selectedType: SelectOption;
    availableTypes: SelectOption[];
    selectedParameter: SelectOption;
    availableParameters: SelectOption[];

    radarTimeHist: string;
}

const initialState: RadarOptionsState = {
    availableParameters: RadarParameterOptions,
    availableTypes: RadarTypeOptions,
    selectedType: RadarTypeOptions[0],
    selectedParameter: RadarParameterOptions[0],
    radarTimeHist: '2020-11-10 12:00:33'
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
        setRadarTimeHist: (state, action) => {
            state.radarTimeHist = action.payload;
        }
    }
});

export const { setSelectedHistRadarParameter, setSelectedHistRadarType, setRadarTimeHist } = radarOptionSlice.actions;
export default radarOptionSlice.reducer;