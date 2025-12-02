import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../../shared/components/selects/types";
import type { VpPayload, VpResponse } from "../../../../api/endpoints/verical_profile/verticalProfilesAPI";
import { species_options, vp_parameterOptions } from "../../../../shared/static/select-options";



interface VpCharState {

    parameterOptions: SelectOption[];
    selectedParameter: SelectOption; 
    speciesOptions: SelectOption[];
    selectedSpecie: SelectOption;
    vpPayload: VpPayload;
    vpData: VpResponse | null;
}

const initialState: VpCharState = {

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
        setSelectedVpSpecie: (state, action) => {
            state.selectedSpecie = action.payload;
            state.vpPayload = {
                ...state.vpPayload,
                species: action.payload.id,
            }
        },
    }
}) 

export const { changeVpPayload, setSelectedVpParameterOption, setSelectedVpSpecie } = vpChartSlice.actions;
export default vpChartSlice.reducer;