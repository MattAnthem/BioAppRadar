import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { boundarieOptionsHist } from "../../history_map/slice/histBaseMapPopupSlice";
import { colormapOptions, mapbaseOptions } from "../../livemap/slice/baseMapPopupSlice";

interface VcrossMapBaseState {
    isPopupOpen: boolean;
    mapBaseOptions: SelectOption[];
    selectedMapBase: SelectOption;
    //colormap
    colormapOptions: SelectOption[];
    selectedColormap: SelectOption;
    // GeoJson
    boundaryOptions: SelectOption[];
    boundaryTypes: SelectOption[];
    selectedBoundaryType: SelectOption;
    selectedBoundary: SelectOption;
}

const initialState: VcrossMapBaseState = {
    isPopupOpen: false,
    mapBaseOptions: mapbaseOptions,
    colormapOptions: colormapOptions,
    selectedColormap: colormapOptions[0],
    selectedMapBase: mapbaseOptions[0],

    boundaryOptions: boundarieOptionsHist,
    selectedBoundary: boundarieOptionsHist[0],
    boundaryTypes: Array.isArray(boundarieOptionsHist[0].availableType) ? boundarieOptionsHist[0].availableType : [],
    selectedBoundaryType: Array.isArray(boundarieOptionsHist[0].availableType) ? boundarieOptionsHist[0].availableType[0] : {id: '', displayText: ''}
}

const vcrossBaseMapSlice = createSlice({
    name: 'basemapvcross',
    initialState,
    reducers: {
        changeVcrossBaseMap: (state, action) => {
            state.selectedMapBase = action.payload;
        },
        changeVcrossColormap: (state, action) => {
            state.selectedColormap = action.payload;
        },
        toggleShowVcrossMapBasePopup: (state) => {
            state.isPopupOpen = !state.isPopupOpen;
        },

        hideVcrossMapBasePopup: (state) => {
            state.isPopupOpen = false;
        },
        setSelectedBoundaryVcross: (state, action) => {
          state.boundaryTypes = Array.isArray(action.payload.availableType) ? action.payload.availableType : [];
          state.selectedBoundaryType = state.boundaryTypes[0];
          state.selectedBoundary = action.payload;
        },
        setSelectedBoundaryTypeVcross: (state, action) => {
            state.selectedBoundaryType = action.payload;
        },
    }
});
export const { changeVcrossColormap, changeVcrossBaseMap, hideVcrossMapBasePopup, setSelectedBoundaryTypeVcross, setSelectedBoundaryVcross, toggleShowVcrossMapBasePopup } = vcrossBaseMapSlice.actions;
export default vcrossBaseMapSlice.reducer;