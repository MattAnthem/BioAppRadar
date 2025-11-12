import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { classif_Options } from "../../../shared/static/chart-options";

interface HistClassificationPopupState {
    isPopupOpen: boolean,
    selectedVariable: SelectOption;
    availableVariables: SelectOption[];
    color_0: string;
    color_1: string;
    height: number;

    histClassifTime: string;
}

const initialState: HistClassificationPopupState = {
    isPopupOpen: false,
    selectedVariable: Array.isArray(classif_Options[0].availableType) ? classif_Options[0].availableType[0] : null,
    availableVariables: Array.isArray(classif_Options[0].availableType) ? classif_Options[0].availableType : [],
    color_0: '#dc3545',
    color_1: '#0d6efd',
    height: 0,
    histClassifTime: '2020-11-10 12:00:33'
}

const HistclassificationpopupSlice = createSlice({
    name: 'classificationpopup_hist',
    initialState,
    reducers: {
        setSelectedHistClassificationOption: (state, action) => {
            state.selectedVariable = action.payload;
        },
        setHistClassificationColorZero: (state, action) => {
            state.color_0 = action.payload
        },
        setHistClassificationColorOne: (state, action) => {
            state.color_1 = action.payload
        },
        setHistClassifTime: (state, action) => {
            state.histClassifTime = action.payload
        },
        toggleClassifPopup: (state) => {
            state.isPopupOpen = !state.isPopupOpen;
        },
        closeClassifPopup: (state) => {
            state.isPopupOpen = false;
        }
    }
})

export const { setHistClassificationColorOne, setHistClassificationColorZero,closeClassifPopup, toggleClassifPopup,  setSelectedHistClassificationOption,  setHistClassifTime } = HistclassificationpopupSlice.actions;
export default HistclassificationpopupSlice.reducer;
