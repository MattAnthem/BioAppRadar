import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { sevip_options } from "../../../shared/static/select-options";


interface SevipPopupState {
    isPopupOpen: boolean;
    selectedVariable: SelectOption;
    availableVariables: SelectOption[];

    histTimeSevip: string;
}

const initialState: SevipPopupState = {
    isPopupOpen: false,

    selectedVariable: Array.isArray(sevip_options[0].availableType) ? sevip_options[0].availableType[0] : null,
    availableVariables: Array.isArray(sevip_options[0].availableType) ? sevip_options[0].availableType : [],
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