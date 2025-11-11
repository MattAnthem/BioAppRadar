import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";

export const RadarTypeOptions: SelectOption[] = [
    {
      id: 'polar',
      displayText: 'Polar Volume'
    },
    {
      id: 'grid',
      displayText: 'Cartesian Grid '
    },
]

export const RadarParameterOptions: SelectOption[] = [
    { 
    id: 'ref', 
    displayText: 'Reflectivity' 
    },
    { 
    id: 'zdr', 
    displayText: 'Differential Reflectivity' 
    },
    { 
    id: 'phi', 
    displayText: 'Differential Phase' 
    },
    { 
    id: 'rho', 
    displayText: 'Correlation Coefficient' 
    },
    { 
    id: 'vel', 
    displayText: 'Radial Velocity' 
    },
    { 
    id: 'sw', 
    displayText: 'Spectrum Width' 
    },
    { 
    id: 'dr', 
    displayText: 'Depolarization Ratio' 
    }
]

const vcrossBioclassOptions: SelectOption[] = [
    {
        id: 'species',
        displayText: 'Bird vs Insect Classification' 
    },
    {
        id: 'biometeo',
        displayText: 'Biological vs Meteorological Classification'
    }
]

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

    availableBioClass: vcrossBioclassOptions,
    selectedBioClass: vcrossBioclassOptions[0],
    timeBioClass: '2020-11-10 12:00:33',

    availableRadarParameters: RadarParameterOptions,
    avalaibleRadarTypes: RadarTypeOptions,
    selectedRadarParameter: RadarParameterOptions[0],
    selectedRadarType: RadarTypeOptions[0],
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