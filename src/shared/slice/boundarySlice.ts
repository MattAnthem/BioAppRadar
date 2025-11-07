import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../components/selects/types";

const boundarieOptions: SelectOption[] = [
    {
        id: 'administrative',
        displayText: 'Administrative Boundaries',
        availableTypes: [
            {
                id: 'country',
                displayText: 'Country'
            },
            {
                id: 'province',
                displayText: 'State/Province'
            },
            {
                id: 'district',
                displayText: 'County/District'
            },
            {
                id: 'sector',
                displayText: 'Sector'
            },
            {
                id: 'cell',
                displayText: 'Cell'
            },
            {
                id: 'village',
                displayText: 'Village'
            }
        ]
    },
    {
        id: 'special_zones',
        displayText: 'Special Zones',
        availableTypes: [
            {
                id: 'protected_areas',
                displayText: 'Protected Areas'
            },
            {
                id: 'wetland_zones',
                displayText: 'Wetland Zones'
            },
            {
                id: 'airports',
                displayText: 'Airports'
            }
        ]
    }
];

interface BoundaryState {
    boundaryOptions: SelectOption[];
    selectedBoundary: SelectOption;
    boundaryTypes: SelectOption[];
    selectedBoundaryType: SelectOption;
}

const initialState: BoundaryState = {
    boundaryOptions: boundarieOptions,
    selectedBoundary: boundarieOptions[0],
    boundaryTypes: Array.isArray(boundarieOptions[0].availableType) ? boundarieOptions[0].availableType : [],
    selectedBoundaryType: Array.isArray(boundarieOptions[0].availableType) ? boundarieOptions[0].availableType[0] : {id: '', displayText: ''},
};

const boundarySlice = createSlice({
    name: 'boundary',
    initialState,
    reducers: {
        setSelectedBoundary: (state, action) => {
            state.selectedBoundary = action.payload;
            state.boundaryTypes = Array.isArray(action.payload.availableType) ? action.payload.availableType : [];
            state.selectedBoundaryType = state.boundaryTypes[0] || {id: '', displayText: ''};
        },
        setSelectedBoundaryType: (state, action) => {
            state.selectedBoundaryType = action.payload;
        },
    }
})

export const { setSelectedBoundary, setSelectedBoundaryType } = boundarySlice.actions;
export default boundarySlice.reducer;