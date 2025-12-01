import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../../shared/components/selects/types";
import type { VpPayload, VpResponse } from "../../../../api/endpoints/verical_profile/verticalProfilesAPI";
import { species_options, vp_parameterOptions } from "../../../../shared/static/select-options";



interface VpCharState {
    isSpeciesPopupOpen: boolean;

    parameterOptions: SelectOption[];
    selectedParameter: SelectOption; 
    speciesOptions: SelectOption[];
    selectedSpecie: SelectOption;
    vpPayload: VpPayload;
    vpData: VpResponse | null;
}

const initialState: VpCharState = {
    isSpeciesPopupOpen: false,

    parameterOptions: vp_parameterOptions,
    selectedParameter: vp_parameterOptions[0],
    speciesOptions: species_options,
    selectedSpecie: species_options[0],
    vpPayload: {
        parameter: vp_parameterOptions[0].id as string,
        time: '2025-10-01 02:00:00',
        radarID: 1,
        species: species_options[0].id as string,
    },
    vpData: null,
}

const vpChartSlice = createSlice({
    name: 'vpchart',
    initialState,
    reducers: {
        changeVpPayload: (state, action: PayloadAction<Partial<VpPayload>>) => {
            state.vpPayload = {...state.vpPayload, ...action.payload}
        },
        setSelectedVpParameterOption: (state, action) => {
            state.selectedParameter = action.payload;
            state.vpPayload = {
                ...state.vpPayload,
                parameter: action.payload.id,
            };
        }, 
        toggleSpeciesPopup: (state) => {
            state.isSpeciesPopupOpen = !state.isSpeciesPopupOpen;
        },
        closeSpeciesPopup: (state) => {
            state.isSpeciesPopupOpen = false;
        },
        setSelectedVpSpecie: (state, action) => {
            state.selectedSpecie = action.payload;
            state.vpPayload = {
                ...state.vpPayload,
                species: action.payload.id,
            }
        },
        setVpData: (state, action: PayloadAction<VpResponse | null>) => {
            state.vpData = action.payload;
        },
    }
}) 

export const { changeVpPayload, setSelectedVpParameterOption, setVpData, setSelectedVpSpecie, closeSpeciesPopup, toggleSpeciesPopup } = vpChartSlice.actions;
export default vpChartSlice.reducer;