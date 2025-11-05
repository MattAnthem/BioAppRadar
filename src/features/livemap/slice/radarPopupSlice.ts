import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";

const RadarTypeOptions: SelectOption[] = [

          {
            id: 'polar',
            displayText: 'Polar Volume'
          },
          {
            id: 'grid',
            displayText: 'Cartesian Grid '
          },
]

const RadarParameterOptions: SelectOption[] = [
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

interface RadarPopupState {
    selectedType: SelectOption;
    availableTypes: SelectOption[];
    selectedParameter: SelectOption;
    availableParameters: SelectOption[];
}

const initialState: RadarPopupState = {
    availableParameters: RadarParameterOptions,
    availableTypes: RadarTypeOptions,
    selectedType: RadarTypeOptions[0],
    selectedParameter: RadarParameterOptions[0],
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