import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { radar_ParameterOptions, radar_TypeOptions } from "../../../shared/static/select-options";




interface RadarPopupState {
    selectedType: SelectOption;
    availableTypes: SelectOption[];
    selectedParameter: SelectOption;
    availableParameters: SelectOption[];
}

const initialState: RadarPopupState = {
    availableParameters: radar_ParameterOptions,
    availableTypes: radar_TypeOptions,
    selectedType: radar_TypeOptions[0],
    selectedParameter: radar_ParameterOptions[0],
}

const radarpopupSlice = createSlice({
    name: 'radarpopup',
    initialState,
    reducers: {
        setSelectedRadarType: (state, action) => {
            state.selectedType = action.payload;
        },
        setSelectedRadarParameter: (state, action) => {
            state.selectedParameter = action.payload;
        }
    }
});

export const { setSelectedRadarParameter, setSelectedRadarType } = radarpopupSlice.actions;
export default radarpopupSlice.reducer;