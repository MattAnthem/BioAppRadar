import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { map_baseOptions } from "../../../shared/static/select-options";





/**
 * @var isMapBasePopupOpen: UI state handling the Map Base selection Select element
 * @var mapBaseOptions: Available Map Bases
 * @var selectedMapBase: Selected Map Base
 */
interface VarPopupState {
    isMapBasePopupOpen: boolean;
    mapBaseOptions: SelectOption[];
    selectedMapBase: SelectOption;
}

const initialState: VarPopupState = {
    isMapBasePopupOpen: false,
    mapBaseOptions: map_baseOptions,
    selectedMapBase: {
      id: 'carto_light',
      displayText: 'CARTO Light',
      url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
    },
}

const baseMapPopupSlice = createSlice({
    name: 'basemappopup',
    initialState,
    reducers: { 
        changeBaseMap: (state, action) => {
            state.selectedMapBase = action.payload;
        },
        toggleShowMapBasePopup: (state) => {
            state.isMapBasePopupOpen = !state.isMapBasePopupOpen;
        },

        hideMapBasePopup: (state) => {
            state.isMapBasePopupOpen = false;
        },

    }
})

export const {  
  hideMapBasePopup, 
  toggleShowMapBasePopup, 
  changeBaseMap  } = baseMapPopupSlice.actions;
export default baseMapPopupSlice.reducer;