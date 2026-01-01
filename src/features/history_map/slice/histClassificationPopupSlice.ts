import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { classif_Options, radar_options, species_options } from "../../../shared/static/select-options";

interface HistClassificationPopupState {
    selectedVariable: SelectOption;
    availableVariables: SelectOption[];
    radars: SelectOption[];
    selectedRadar: SelectOption;

    // Species
    speciesOptions: SelectOption[];
    selectedSpecie: SelectOption;

    color_0: string;
    color_1: string;
    height: number;

    // for still image (at a specific date)
    histClassifTime: string;
    // for gif animated (time range)
    startTimeClassif: string;
    endTimeClassif: string;
}

const initialState: HistClassificationPopupState = {
    selectedVariable: Array.isArray(classif_Options[0].availableType) ? classif_Options[0].availableType[0] : null,
    availableVariables: Array.isArray(classif_Options[0].availableType) ? classif_Options[0].availableType : [],
    speciesOptions: species_options,
    selectedSpecie: species_options[0],
    radars: radar_options,
    selectedRadar: radar_options[0],

    color_0: '#dc3545',
    color_1: '#0d6efd',
    height: 0,
    histClassifTime: '2020-11-10 12:00:33',

    startTimeClassif: '2020-11-10 12:00:33',
    endTimeClassif: '2020-11-10 12:50:00',
}

const HistclassificationpopupSlice = createSlice({
    name: 'classificationpopup_hist',
    initialState,
    reducers: {
        setSelectedHistClassificationOption: (state, action) => {
            state.selectedVariable = action.payload;
        },
        setSelectedClassifHistSpecie: (state, action) => {
            state.selectedSpecie = action.payload;
        },
        setHistClassificationColorZero: (state, action) => {
            state.color_0 = action.payload;
        },
        setHistClassificationColorOne: (state, action) => {
            state.color_1 = action.payload;
        },
        setHistClassifTime: (state, action) => {
            state.histClassifTime = action.payload;
        },
        setHistClassifStartTime: (state, action) => {
            state.startTimeClassif = action.payload;
        },
        setHistClassifEndTime: (state, action) => {
            state.endTimeClassif = action.payload;
        },
        setClassifRadar: (state, action) => {
            state.selectedRadar = action.payload;
        }
    }
})

export const { setHistClassificationColorOne, setHistClassifEndTime, setSelectedClassifHistSpecie, setHistClassifStartTime, setHistClassificationColorZero, setSelectedHistClassificationOption,  setHistClassifTime, setClassifRadar } = HistclassificationpopupSlice.actions;
export default HistclassificationpopupSlice.reducer;
