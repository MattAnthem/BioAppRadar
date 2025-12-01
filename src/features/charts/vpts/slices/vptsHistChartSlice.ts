import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../../shared/components/selects/types";
import type { VptsPayload } from "../../../../api/endpoints/verical_profile/verticalProfilesAPI";
import { species_options, vp_parameterOptions } from "../../../../shared/static/select-options";


interface VptsChartState {
    // UI states
    isPopupOpen: boolean;
    parameterOptions: SelectOption[];
    selectedParameter: SelectOption;
    speciesOptions: SelectOption[];
    selectedSpecie: SelectOption;
    vptsStartTime: string;
    vptsEndTime: string;

    vptsPayload: VptsPayload;
}

const initialState: VptsChartState = {
    isPopupOpen: false,
    

    parameterOptions: vp_parameterOptions,
    selectedParameter: vp_parameterOptions[0],
    speciesOptions: species_options,
    selectedSpecie: species_options[0],
    vptsStartTime: '2025-10-01 02:00:00',
    vptsEndTime: '2025-10-01 02:50:00',

    vptsPayload: {
        startTime: '2025-10-01 02:00:00',
        endTime: '2025-10-01 02:50:00',
        parameter: vp_parameterOptions[0].id as string,
        radarID: 1,
        species: 'bird'
    },
}

const vptsHistChartSlice = createSlice({
    name: 'vptschart',
    initialState,
    reducers: {
        changeVptsHistPayload: (state, action: PayloadAction<Partial<VptsPayload>>) => {
            state.vptsPayload = { ...state.vptsPayload, ...action.payload }
        },
        setSelectedVptsHistParameterOption: (state, action) => {
            state.selectedParameter = action.payload;
        },
        setSelectedVptsHistSpecie: (state, action) => {
            state.selectedSpecie = action.payload;
        },
        setVptsHistStartTime: (state, action) => {
            state.vptsStartTime = action.payload
        },
        setVptsHistEndTime: (state, action) => {
            state.vptsEndTime = action.payload
        },
        toggleVptsHistPopup: (state) => {
            state.isPopupOpen = !state.isPopupOpen
        },
        closeVptsHistPopup: (state) => {
            state.isPopupOpen = false;
        }

    }
});

export const { changeVptsHistPayload, setSelectedVptsHistParameterOption, closeVptsHistPopup, setVptsHistEndTime, setVptsHistStartTime, toggleVptsHistPopup, setSelectedVptsHistSpecie } = vptsHistChartSlice.actions;
export default vptsHistChartSlice.reducer;