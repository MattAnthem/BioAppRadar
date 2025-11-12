import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { colormapsOptions, map_baseOptions, map_boundarieOptions } from "../../../shared/static/chart-options";



interface HistoryBaseMapState {
    isMapBasePopupOpen: boolean;
    mapBaseOptions: SelectOption[];
    selectedMapBase: SelectOption;
    colormapOptions: SelectOption[];
    selectedColormap: SelectOption;
    // GeoJson
    boundaryOptions: SelectOption[];
    boundaryTypes: SelectOption[];
    selectedBoundaryType: SelectOption;
    selectedBoundary: SelectOption;
}

const initialState: HistoryBaseMapState =  {
    isMapBasePopupOpen: false,
    mapBaseOptions: map_baseOptions,
    colormapOptions: colormapsOptions,
    selectedColormap: colormapsOptions[0],
    selectedMapBase: map_baseOptions[0],

    boundaryOptions: map_boundarieOptions,
    selectedBoundary: map_boundarieOptions[0],
    boundaryTypes: Array.isArray(map_boundarieOptions[0].availableType) ? map_boundarieOptions[0].availableType : [],
    selectedBoundaryType: Array.isArray(map_boundarieOptions[0].availableType) ? map_boundarieOptions[0].availableType[0] : {id: '', displayText: ''},
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
          setSelectedBoundaryHist: (state, action) => {
            state.boundaryTypes = Array.isArray(action.payload.availableType) ? action.payload.availableType : [];
            state.selectedBoundaryType = state.boundaryTypes[0];
            state.selectedBoundary = action.payload;
        },
        setSelectedBoundaryTypeHist: (state, action) => {
            state.selectedBoundaryType = action.payload;
        },
    }
});

export const { changeHistBaseMap, setSelectedBoundaryHist, setSelectedBoundaryTypeHist,  changeHistColormap, hideHistMapBasePopup,  toggleShowHistMapBasePopup} = historyBaseMapSlice.actions;
export default historyBaseMapSlice.reducer;