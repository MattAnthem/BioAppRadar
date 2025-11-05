import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";

const RadarOptions: SelectOption[] = [
    {
        id: 'polar',
        displayText: 'Polar Volume',
        availableType: [
            {
                id: 'ref',
                displayText: 'Reflectivity',
            },
            {
                id: 'zdr',
                displayText: 'Differential Reflectivity',
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
    },
    {
        id: 'grid',
        displayText: 'Cartesian Grid',
        availableType: [
            {
                id: 'ref',
                displayText: 'Reflectivity',
            },
            {
                id: 'zdr',
                displayText: 'Differential Reflectivity',
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
    }
]

interface RadarOptionsState {
    isPopupOpen: boolean;
    radarOptions: SelectOption[];
    selectedRadarOption: SelectOption;
    radarParameters: SelectOption[];
    selectedParameter: SelectOption;
}

const initialState: RadarOptionsState = {
    isPopupOpen: false,
    radarOptions: RadarOptions,
    selectedRadarOption: RadarOptions[0],
    radarParameters: Array.isArray(RadarOptions[0].availableType) ? RadarOptions[0].availableType : [],
    selectedParameter: Array.isArray(RadarOptions[0].availableType) ? RadarOptions[0].availableType[0] : null,
} 

const radarOptionSlice = createSlice({
    name: 'radaroption',
    initialState,
    reducers: {
        changeSelectedRadarOption: (state, action) => {
            state.radarParameters = Array.isArray(action.payload.availableType) ? action.payload.availableType : [];
            state.selectedParameter = action.payload.availableType[0];
            state.selectedRadarOption = action.payload;
        },
        changeSelectedParameter: (state, action) => {
            state.selectedParameter = action.payload;
        },
        toggleShowRadarParamsOptions: (state) => {
            state.isPopupOpen = !state.isPopupOpen;
        },

        hideRadarParamsOptions: (state) => {
            state.isPopupOpen = false;
        }
    }
});

export const { changeSelectedParameter, changeSelectedRadarOption, hideRadarParamsOptions, toggleShowRadarParamsOptions } = radarOptionSlice.actions;
export default radarOptionSlice.reducer;