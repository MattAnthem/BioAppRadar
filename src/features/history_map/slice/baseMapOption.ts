import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { colormapOptions, mapbaseOptions } from "../../livemap/slice/baseMapPopupSlice";


interface HistoryBaseMapState {
    isMapBasePopupOpen: boolean;
    mapBaseOptions: SelectOption[];
    selectedMapBase: SelectOption;
    colormapOptions: SelectOption[];
    selectedColormap: SelectOption;
    coverageOptions: SelectOption[];
    selectedCoverage: SelectOption;
}

const initialState: HistoryBaseMapState =  {
    isMapBasePopupOpen: false,
    mapBaseOptions: mapbaseOptions,
    colormapOptions: colormapOptions,
    selectedColormap: colormapOptions[0],
    selectedMapBase: mapbaseOptions[0],
    coverageOptions: [],
    selectedCoverage: {id: '', displayText:''},
}

const historyBaseMapSlice = createSlice({
    name: 'basemaphistory',
    initialState,
    reducers: {
          changeHistBaseMap: (state, action) => {
              state.selectedMapBase = action.payload;
          },
          changeHistColormap: (state, action) => {
              state.selectedColormap = action.payload;
          },
          toggleShowHistMapBasePopup: (state) => {
              state.isMapBasePopupOpen = !state.isMapBasePopupOpen;
          },
  
          hideHistMapBasePopup: (state) => {
              state.isMapBasePopupOpen = false;
          },
          changeHistCoverage: (state, action) => {
            const selected = state.coverageOptions.find(option => option.id === action.payload);
            if (selected) {
                state.selectedCoverage = selected;
            }
        },
    }
});

export const { changeHistBaseMap, changeHistCoverage,  changeHistColormap, hideHistMapBasePopup,  toggleShowHistMapBasePopup} = historyBaseMapSlice.actions;
export default historyBaseMapSlice.reducer;