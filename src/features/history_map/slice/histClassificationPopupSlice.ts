import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";

const ClassificationOptions: SelectOption[] = [
    {
        id: 'classification',
        displayText: 'Classification',
        availableType: [
          {
            id: 'biometeo',
            displayText: 'Biological vs Meteorological Classification',
            type0: 'Meteorological',
            type1: 'Biological'
          },
          {
            id: 'species',
            displayText: 'Bird vs Insect Classification',
            type0: 'Insects',
            type1: 'Birds'
          }
        ]
    }
]

interface HistClassificationPopupState {
    selectedVariable: SelectOption;
    availableVariables: SelectOption[];
    color_0: string;
    color_1: string;
    height: number;

    histClassifTime: string;
}

const initialState: HistClassificationPopupState = {
    selectedVariable: Array.isArray(ClassificationOptions[0].availableType) ? ClassificationOptions[0].availableType[0] : null,
    availableVariables: Array.isArray(ClassificationOptions[0].availableType) ? ClassificationOptions[0].availableType : [],
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
        }
    }
})

export const { setHistClassificationColorOne, setHistClassificationColorZero, setSelectedHistClassificationOption,  setHistClassifTime } = HistclassificationpopupSlice.actions;
export default HistclassificationpopupSlice.reducer;
