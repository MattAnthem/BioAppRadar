import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../shared/components/selects/types";

// Static
const MapOptions: SelectOption[] = 
[  

  {
    id: 'classification',
    displayText: 'Classification',
    availableType: [
      {
        id: 'meteo-biology',
        displayText: 'Meteorological vs Biological'
      },
      {
        id: 'bird-insect',
        displayText: 'Bird vs Insect  '
      }
    ]
  },
  {
    id: 'radar_data',
    displayText: 'Radar Data',
    availableType: [
      {
        id: 'dr',
        displayText: 'Depolarization ratio '
      },
      {
        id: 'ref',
        displayText: 'Reflectivity '
      },
      {
        id: 'zdr',
        displayText: 'Differential Reflectivity '
      },
      {
        id: 'phi',
        displayText: 'Differential Phase '
      },
      {
        id: 'rho',
        displayText: 'Correlation Coefficient '
      },
      {
        id: 'vel',
        displayText: 'Radial Velocity '
      },
      {
        id: 'sw',
        displayText: 'Spectrum Width '
      }
    ]
  }
]

interface CrSectionChartState {
    isVarPopupOpen: boolean,
    parameterOptions: SelectOption[];
    selectedParameterOption: SelectOption;
    subOptions: SelectOption[];
    selectedSubOption: SelectOption;
}

const initialState: CrSectionChartState = {
    isVarPopupOpen: false,
    parameterOptions: MapOptions,
    selectedParameterOption: MapOptions[0],
    subOptions: Array.isArray(MapOptions[0].availableType) ? MapOptions[0].availableType : [],
    selectedSubOption: Array.isArray(MapOptions[0].availableType) ? MapOptions[0].availableType[0] : null,
}

const crSectionChartSlice = createSlice({
    name: 'cr_section',
    initialState,
    reducers: {
        changeSelectedParameterOption: (state, action) => {
            state.subOptions = Array.isArray(action.payload.availableType) ? action.payload.availableType : [];
            state.selectedParameterOption = action.payload;
        },
        changeSelectedSubOption: (state, action) => {
            state.selectedSubOption = action.payload;
        },
        toggleShowVarPopup: (state) => {
            state.isVarPopupOpen = !state.isVarPopupOpen;
        },

        hideVarPopup: (state) => {
            state.isVarPopupOpen = false;
        },
    }
});

export const { changeSelectedParameterOption, changeSelectedSubOption, hideVarPopup, toggleShowVarPopup } = crSectionChartSlice.actions;
export default crSectionChartSlice.reducer;
