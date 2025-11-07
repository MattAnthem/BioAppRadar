import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";

const ClassificationOptions: SelectOption[] = [
    {
        id: 'classification',
        displayText: 'Classification',
        availableType: [
          {
            id: 'biometeo',
            displayText: 'Biological vs Meteorological Classification'
          },
          {
            id: 'species',
            displayText: 'Bird vs Insect Classification'
          }
        ]
    }
]

interface ClassificationPopupState {
    selectedVariable: SelectOption;
    availableVariables: SelectOption[];
    color_0: string;
    color_1: string;
    height: number;

}

const initialState: ClassificationPopupState = {
    selectedVariable: Array.isArray(ClassificationOptions[0].availableType) ? ClassificationOptions[0].availableType[0] : null,
    availableVariables: Array.isArray(ClassificationOptions[0].availableType) ? ClassificationOptions[0].availableType : [],
    color_0: '#dc3545',
    color_1: '#0d6efd',
    height: 0,
}

const classificationpopupSlice = createSlice({
    name: 'classificationpopup',
    initialState,
    reducers: {
        setSelectedClassificationOption: (state, action) => {
            state.selectedVariable = action.payload;
        },
        setClassificationColorZero: (state, action) => {
            state.color_0 = action.payload
        },
        setClassificationColorOne: (state, action) => {
            state.color_1 = action.payload
        }
    }
})

export const { setSelectedClassificationOption, setClassificationColorOne, setClassificationColorZero } = classificationpopupSlice.actions;
export default classificationpopupSlice.reducer;