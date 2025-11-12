import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { sevip_options } from "../../../shared/static/chart-options";



interface SevipPopupState {
    selectedVariable: SelectOption;
    availableVariables: SelectOption[];
}

const initialState: SevipPopupState = {
    selectedVariable: Array.isArray(sevip_options[0].availableType) ? sevip_options[0].availableType[0] : null,
    availableVariables: Array.isArray(sevip_options[0].availableType) ? sevip_options[0].availableType : [],
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