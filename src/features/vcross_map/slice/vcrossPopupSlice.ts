import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { classif_Options, radar_ParameterOptions, radar_TypeOptions } from "../../../shared/static/select-options";



interface VcrossState {

    isRadarPopupOpen: boolean;

    selectedBioClass: SelectOption;
    availableBioClass: SelectOption[];
    timeBioClass: string;

    selectedRadarType:SelectOption;
    avalaibleRadarTypes: SelectOption[];
    selectedRadarParameter: SelectOption;
    availableRadarParameters: SelectOption[];
    timeRadar: string;
}

const initialState: VcrossState = {
    isRadarPopupOpen: false,

    availableBioClass: classif_Options,
    selectedBioClass: Array.isArray(classif_Options[0].availableType) ? classif_Options[0].availableType[0] : {id: '', displayText: ''},
    timeBioClass: '2020-11-10 12:00:33',

    availableRadarParameters: radar_ParameterOptions,
    avalaibleRadarTypes: radar_TypeOptions,
    selectedRadarParameter: radar_ParameterOptions[0],
    selectedRadarType: radar_TypeOptions[0],
    timeRadar: '2020-11-10 12:00:33'
}

const vcrossPopupSlice = createSlice({
    name: 'vcrosspopup',
    initialState,
    reducers: {
        setSelectedVcrossBioCls: (state, action) => {
            state.selectedBioClass = action.payload;
        },
        setSelectedBioclassTime: (state, action) => {
            state.timeBioClass = action.payload;
        },
        setSelectedVcrossRadarType: (state, action) => {
            state.selectedRadarType = action.payload;
        },
        setSelectedVcrossRadarParameter: (state, action) => {
            state.selectedRadarParameter = action.payload;
        },
        setSelectedVcrossRadarTime: (state, action) => {
            state.timeRadar = action.payload;
        },
        closeVcrossRadarPopup: (state) => {
            state.isRadarPopupOpen = false
        },
        toggleVcrossRadarPopup: (state) => {
            state.isRadarPopupOpen = !state.isRadarPopupOpen;
        }
    }
});

export const { closeVcrossRadarPopup, toggleVcrossRadarPopup, setSelectedVcrossBioCls, setSelectedBioclassTime, setSelectedVcrossRadarParameter, setSelectedVcrossRadarTime, setSelectedVcrossRadarType } = vcrossPopupSlice.actions;
export default vcrossPopupSlice.reducer;