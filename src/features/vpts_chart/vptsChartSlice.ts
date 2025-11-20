import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VptsPayload, VptsResponse } from "../../api/endpoints/verical_profile/verticalProfilesAPI";
import type { SelectOption } from "../../shared/components/selects/types";
import { species_options, vp_parameterOptions } from "../../shared/static/select-options";



interface VptsChartState {
    isSpeciesPopupOpen: boolean;

    parameterOptions: SelectOption[];
    selectedParameter: SelectOption;
    speciesOptions: SelectOption[];
    selectedSpecie: SelectOption;
    vptsPayload: VptsPayload;
    vptsData: VptsResponse | null;
}

const initialState: VptsChartState = {
    isSpeciesPopupOpen: false,

    parameterOptions: vp_parameterOptions,
    selectedParameter: vp_parameterOptions[0],
    speciesOptions: species_options,
    selectedSpecie: species_options[0],
    vptsPayload: {
        startTime: "2025-10-01 02:00:00",
        endTime: '2025-10-01 02:50:00',
        parameter: vp_parameterOptions[0].id as string,
        radarID: 1,
        species: 'bird'
    },
    vptsData: null,
}

const vptsChartSlice = createSlice({
    name: 'vptschart',
    initialState,
    reducers: {
        changeVptsPayload: (state, action: PayloadAction<Partial<VptsPayload>>) => {
            state.vptsPayload = { ...state.vptsPayload, ...action.payload }
        },
        setSelectedVptsParameterOption: (state, action) => {
            state.selectedParameter = action.payload;
            state.vptsPayload = {
                ...state.vptsPayload,
                parameter: action.payload.id,
            }
        },
        toggleSpeciesPopup: (state) => {
            state.isSpeciesPopupOpen = !state.isSpeciesPopupOpen;
        },
        closeSpeciesPopup: (state) => {
            state.isSpeciesPopupOpen = false;
        },
        setSelectedVptsSPecie: (state, action) => {
            state.selectedSpecie = action.payload;
            state.vptsPayload = {
                ...state.vptsPayload,
                species: action.payload.id
            }
        },
        setVptsData: (state, action: PayloadAction<VptsResponse | null>) => {
            state.vptsData = action.payload
        }
    }
});

export const { changeVptsPayload, setSelectedVptsParameterOption, setVptsData, setSelectedVptsSPecie, closeSpeciesPopup, toggleSpeciesPopup } = vptsChartSlice.actions;
export default vptsChartSlice.reducer;