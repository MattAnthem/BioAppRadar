import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { colormapsOptions, map_baseOptions, map_boundarieOptions } from "../../../shared/static/select-options";

interface VcrossMapBaseState {
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
    mapBaseOptions: map_baseOptions,
    colormapOptions: colormapsOptions,
    selectedColormap: colormapsOptions[0],
    selectedMapBase: map_baseOptions[0],

    boundaryOptions: map_boundarieOptions,
    selectedBoundary: map_boundarieOptions[0],
    boundaryTypes: Array.isArray(map_boundarieOptions[0].availableType) ? map_boundarieOptions[0].availableType : [],
    selectedBoundaryType: Array.isArray(map_boundarieOptions[0].availableType) ? map_boundarieOptions[0].availableType[0] : {id: '', displayText: ''}
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
export const { changeVcrossColormap, changeVcrossBaseMap, setSelectedBoundaryTypeVcross, setSelectedBoundaryVcross } = vcrossBaseMapSlice.actions;
export default vcrossBaseMapSlice.reducer;