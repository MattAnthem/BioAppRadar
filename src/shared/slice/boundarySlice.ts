import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../components/selects/types";
import { map_boundarieOptions } from "../static/select-options";


interface BoundaryState {
    boundaryOptions: SelectOption[];
    selectedBoundary: SelectOption;
    boundaryTypes: SelectOption[];
    selectedBoundaryType: SelectOption;
}

const initialState: BoundaryState = {
    boundaryOptions: map_boundarieOptions,
    selectedBoundary: map_boundarieOptions[0],
    boundaryTypes: Array.isArray(map_boundarieOptions[0].availableType) ? map_boundarieOptions[0].availableType : [],
    selectedBoundaryType: Array.isArray(map_boundarieOptions[0].availableType) ? map_boundarieOptions[0].availableType[0] : {id: '', displayText: ''},
};

const boundarySlice = createSlice({
    name: 'boundary',
    initialState,
    reducers: {
        setSelectedBoundary: (state, action) => {
            state.boundaryTypes = Array.isArray(action.payload.availableType) ? action.payload.availableType : [];
            state.selectedBoundaryType = state.boundaryTypes[0];
            state.selectedBoundary = action.payload;
        },
        setSelectedBoundaryType: (state, action) => {
            state.selectedBoundaryType = action.payload;
        },
    }
})

export const { setSelectedBoundary, setSelectedBoundaryType } = boundarySlice.actions;
export default boundarySlice.reducer;