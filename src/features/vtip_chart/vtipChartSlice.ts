import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VtipPayload } from "../../api/endpoints/verical_profile/verticalProfilesAPI";
import type { SelectOption } from "../../shared/components/selects/types";
import { species_options, vtip_parameterOptions } from "../../shared/static/select-options";



interface VtipChartState {
    parameterOptions: SelectOption[];
    selectedParameter: SelectOption;
    speciesOptions: SelectOption[];
    selectedSpecie: SelectOption;
    vtipStartTime: string;
    vtipEndTime: string;
    vtipPayload: VtipPayload;
}


const initialState: VtipChartState = {

    parameterOptions: vtip_parameterOptions,
    selectedParameter: vtip_parameterOptions[0],
    speciesOptions: species_options,
    selectedSpecie: species_options[0],
    vtipStartTime: '2020-11-10 12:01:00',
    vtipEndTime: '2020-11-10 12:50:00',

    vtipPayload: {
        startTime: '"2025-10-01 00:00:00",',
        endTime: '2025-10-01 01:10:00',
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
        setVtipParameter: (state, action) => {
            state.selectedParameter = action.payload
        }

    }
});

export const { changeVtipPayload, setSelectedVtipParameterOption, setVtipParameter } = vtipChartSlice.actions;
export default vtipChartSlice.reducer;