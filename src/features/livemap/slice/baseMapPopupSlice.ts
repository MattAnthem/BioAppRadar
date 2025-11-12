import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { colormapsOptions, map_baseOptions } from "../../../shared/static/select-options";





/**
 * @var isVarPopupOpen: UI state handling the Variable selection Select element
 * @var isMapBasePopupOpen: UI state handling the Map Base selection Select element
 * @var mapBaseOptions: Available Map Bases
 * @var selectedMapBase: Selected Map Base
 * @var colormapOptions: Available Colormaps
 * @var selectedColormap: Selected Colormap
 * @var selectedSubOption: Selected SubVariable From a Variable
 */
interface VarPopupState {
    isVarPopupOpen: boolean;
    isMapBasePopupOpen: boolean;
    mapBaseOptions: SelectOption[];
    selectedMapBase: SelectOption;
    colormapOptions: SelectOption[];
    selectedColormap: SelectOption;

}

const initialState: VarPopupState = {
    isVarPopupOpen: false,
    isMapBasePopupOpen: false,
    mapBaseOptions: map_baseOptions,
    selectedMapBase: {
      id: 'carto_light',
      displayText: 'CARTO Light',
      url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
    },
    colormapOptions: colormapsOptions,
    selectedColormap: colormapsOptions[0],
}

const baseMapPopupSlice = createSlice({
    name: 'basemappopup',
    initialState,
    reducers: { 
        changeBaseMap: (state, action) => {
            state.selectedMapBase = action.payload;
        },
        changeColormap: (state, action) => {
            state.selectedColormap = action.payload;
        },
        toggleShowVarPopup: (state) => {
            state.isVarPopupOpen = !state.isVarPopupOpen;
        },

        hideVarPopup: (state) => {
            state.isVarPopupOpen = false;
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
  hideVarPopup, 
  toggleShowVarPopup, 
  hideMapBasePopup, 
  toggleShowMapBasePopup, 
  changeBaseMap, 
  changeColormap } = baseMapPopupSlice.actions;
export default baseMapPopupSlice.reducer;