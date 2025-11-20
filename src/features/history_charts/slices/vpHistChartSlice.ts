import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VpPayload } from "../../../api/endpoints/verical_profile/verticalProfilesAPI";
import type { SelectOption } from "../../../shared/components/selects/types";
import { species_options, vp_parameterOptions } from "../../../shared/static/select-options";


interface VpCharState {
    isPopupOpen: boolean;

    // UI State
    parameterOptions: SelectOption[];
    selectedParameter: SelectOption; 
    speciesOptions: SelectOption[];
    selectedSpecie: SelectOption;
    vpTime: string;

    // Payload for the API call
    vpPayload: VpPayload;
}

const initialState: VpCharState = {
    isPopupOpen: false,

    parameterOptions: vp_parameterOptions,
    selectedParameter: vp_parameterOptions[0],
    speciesOptions: species_options,
    selectedSpecie: species_options[0],
    vpTime: '2025-10-01 02:00:00',

    vpPayload: {
        parameter: vp_parameterOptions[0].id as string,
        time: '2025-10-01 02:00:00',
        radarID: 1,
        species: 'bird'
    },
}

const vpHistChartSlice = createSlice({
    name: 'vpchart',
    initialState,
    reducers: {
        changeVpHistPayload: (state, action: PayloadAction<Partial<VpPayload>>) => {
            state.vpPayload = {...state.vpPayload, ...action.payload}
        },
        setSelectedVpHistParameterOption: (state, action) => {
            state.selectedParameter = action.payload;
        },
        setSelectedVpHistSpecie: (state, action) => {
            state.selectedSpecie = action.payload;
        },
        setVpHistTime: (state, action) => {
            state.vpTime = action.payload
        },
        toggleVpHistPopup: (state) => {
            state.isPopupOpen = !state.isPopupOpen
        },
        closeVpHistPopup: (state) => {
            state.isPopupOpen = false;
        }
    }
}) 

export const { changeVpHistPayload, setSelectedVpHistParameterOption,  closeVpHistPopup, setVpHistTime, toggleVpHistPopup, setSelectedVpHistSpecie } = vpHistChartSlice.actions;
export default vpHistChartSlice.reducer;