import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../components/selects/types";

// statics to be moved to the backend
const mapDataOptions: SelectOption[] = [
    {
      id: 'vertical',
      displayText: 'Vertically Integrated Profile'
    },
    {
      id: 'classification',
      displayText: 'Classification'
    },
    {
      id: 'radar_data',
      displayText: 'Radar Data'
    },
  ]
  
  const vipOptions: SelectOption[] = [
    {
      id: 'vir',
      displayText: 'Vertically Integrated Reflectivity'
    },
    {
      id: 'vid',
      displayText: 'Vertically Integrated Density '
    },
    {
      id: 'eta-exp',
      displayText: 'Eta Expected '
    },
    {
      id: 'eta-obs',
      displayText: 'Eta Observed '
    },
  ]
  
  const classificationOptions: SelectOption[] = [
    {
      id: 'meteo-biology',
      displayText: 'Meteorological vs Biological'
    },
    {
      id: 'bird-insect',
      displayText: 'Bird vs Insect  '
    },
  ]
  const radarDataOptions: SelectOption[] = [
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
    },
  ]


type Selected = {
    paramType: SelectOption;
    availableOnType: SelectOption[];
}

interface VarPopupState {
    isVarPopupOpen: boolean;
    isMapBasePopupOpen: boolean;
    selected: Selected;
}

const initialState: VarPopupState = {
    isVarPopupOpen: false,
    isMapBasePopupOpen: false,
    selected: {
        paramType: {
            id: 'vertical',
            displayText: 'Verically Integrated Profile'
        },
        availableOnType: vipOptions
    }
}

const varpopupSlice = createSlice({
    name: 'mappopups',
    initialState,
    reducers: {
        toggleShowVarPopup: (state) => {
            state.isVarPopupOpen = !state.isVarPopupOpen;
        },

        hideVarPopup: (state) => {
            state.isVarPopupOpen = false;
        },
        toggleShowMapBasePopup: (state) => {
            state.isMapBasePopupOpen = !state.isMapBasePopupOpen;
        },

        hideMapBasePopup: (state) => {
            state.isMapBasePopupOpen = false;
        },
    }
})

export const { hideVarPopup, toggleShowVarPopup, hideMapBasePopup, toggleShowMapBasePopup } = varpopupSlice.actions;
export default varpopupSlice.reducer;