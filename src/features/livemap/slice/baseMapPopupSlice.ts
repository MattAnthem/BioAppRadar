import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { map_baseOptions } from "../../../shared/static/select-options";





/**
 * @var isMapBasePopupOpen: UI state handling the Map Base selection Select element
 * @var mapBaseOptions: Available Map Bases
 * @var selectedMapBase: Selected Map Base
 */
interface VarPopupState {
    mapBaseOptions: SelectOption[];
    selectedMapBase: SelectOption;
}

const initialState: VarPopupState = {
    mapBaseOptions: map_baseOptions,
    selectedMapBase: map_baseOptions[0],
}

const baseMapPopupSlice = createSlice({
    name: 'basemappopup',
    initialState,
    reducers: { 
        changeBaseMap: (state, action) => {
            state.selectedMapBase = action.payload;
        },

    }
})

export const { 
  changeBaseMap  } = baseMapPopupSlice.actions;
export default baseMapPopupSlice.reducer;