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
    selectedVariable: SelectOption;
    availableVariables: SelectOption[];
}

const initialState: SevipPopupState = {
    selectedVariable: Array.isArray(SevipOptions[0].availableType) ? SevipOptions[0].availableType[0] : null,
    availableVariables: Array.isArray(SevipOptions[0].availableType) ? SevipOptions[0].availableType : [],
}

const sevippopupSlice = createSlice({
    name: 'sevippopup',
    initialState,
    reducers: {
        setSelectedSevipOption: (state, action) => {
            state.selectedVariable = action.payload;
        }
    }
})

export const { setSelectedSevipOption } = sevippopupSlice.actions;
export default sevippopupSlice.reducer;