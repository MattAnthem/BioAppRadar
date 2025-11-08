import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";

const SevipOptions: SelectOption[] = [
    {
        id: 'vertical',
        displayText: 'Vertically Integrated Profile',
        availableType: [
          {
            id: 'vir',
            displayText: 'Vertically Integrated Reflectivity'
          },
          {
            id: 'vid',
            displayText: 'Vertically Integrated Density '
          },
          {
            id: 'eta_sum',
            displayText: 'Sum of observed linear reflectivities'
          },
          {
            id: 'eta_sum_expected',
            displayText: 'Sum of expected linear reflectivities'
          }
        ]
    },
]

interface SevipPopupState {
    isPopupOpen: boolean;
    selectedVariable: SelectOption;
    availableVariables: SelectOption[];

    histTimeSevip: string;
}

const initialState: SevipPopupState = {
    isPopupOpen: false,

    selectedVariable: Array.isArray(SevipOptions[0].availableType) ? SevipOptions[0].availableType[0] : null,
    availableVariables: Array.isArray(SevipOptions[0].availableType) ? SevipOptions[0].availableType : [],
    histTimeSevip: '2020-11-10 12:00:33'
}

const histSevippopupSlice = createSlice({
    name: 'sevippopup',
    initialState,
    reducers: {
        setSelectedHistSevipOption: (state, action) => {
            state.selectedVariable = action.payload;
        },
        setHistTimeSevip: (state, action) => {
          state.histTimeSevip = action.payload;
        },
        toggleSevipPopup: (state) => {
          state.isPopupOpen = !state.isPopupOpen;
        },
        closeSevipPopup: (state) => {
          state.isPopupOpen = false;
        }
    }
})

export const { setSelectedHistSevipOption, setHistTimeSevip, closeSevipPopup, toggleSevipPopup } = histSevippopupSlice.actions;
export default histSevippopupSlice.reducer;