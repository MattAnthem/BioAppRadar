import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../../shared/components/selects/types";
import type { VtipPayload } from "../../../../api/endpoints/verical_profile/verticalProfilesAPI";
import { species_options, vtip_parameterOptions } from "../../../../shared/static/select-options";



interface VtipChartState {
    isSpeciesPopupOpen: boolean;

    parameterOptions: SelectOption[];
    selectedParameter: SelectOption;
    speciesOptions: SelectOption[];
    selectedSpecie: SelectOption;
    vtipStartTime: string;
    vtipEndTime: string;
    vtipPayload: VtipPayload;
}


const initialState: VtipChartState = {
    isSpeciesPopupOpen: false,

    parameterOptions: vtip_parameterOptions,
    selectedParameter: vtip_parameterOptions[0],
    speciesOptions: species_options,
    selectedSpecie: species_options[0],
    vtipStartTime: '2025-10-01 02:00:00',
    vtipEndTime: '2025-10-01 02:50:00',

    vtipPayload: {
        startTime: "2025-10-01 02:00:00",
        endTime: '2025-10-01 02:50:00',
        parameter: 'mtr',
        radarID: 1,
        species: 'bird'
    }
}

const vtipChartSlice = createSlice({
    name: 'vtipchart',
    initialState,
    reducers: {
        changeVtipPayload: (state, action: PayloadAction<Partial<VtipPayload>>) => {
            state.vtipPayload = { ...state.vtipPayload, ...action.payload }
        },
        setSelectedVtipParameterOption: (state, action) => {
            state.selectedParameter = action.payload;
        },
        setSelectedVtipSpecie: (state, action) => {
            state.selectedSpecie = action.payload;
            state.vtipPayload = {
                ...state.vtipPayload,
                species: action.payload.id,
            }
        },
        toggleSpeciesPopup: (state) => {
            state.isSpeciesPopupOpen = !state.isSpeciesPopupOpen;
        },
        closeSpeciesPopup: (state) => {
            state.isSpeciesPopupOpen = false;
        },
        setVtipParameter: (state, action) => {
            state.selectedParameter = action.payload
        }

    }
});

export const { changeVtipPayload, setSelectedVtipSpecie, closeSpeciesPopup, toggleSpeciesPopup, setSelectedVtipParameterOption, setVtipParameter } = vtipChartSlice.actions;
export default vtipChartSlice.reducer;