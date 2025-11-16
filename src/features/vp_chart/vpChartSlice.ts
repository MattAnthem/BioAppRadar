import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VpPayload, VpResponse } from "../../api/endpoints/verical_profile/verticalProfilesAPI";
import type { SelectOption } from "../../shared/components/selects/types";
import { vp_parameterOptions } from "../../shared/static/select-options";


interface VpCharState {
    parameterOptions: SelectOption[];
    selectedParameter: SelectOption; 
    vpPayload: VpPayload;
    vpData: VpResponse | null;
}

const initialState: VpCharState = {
    parameterOptions: vp_parameterOptions,
    selectedParameter: vp_parameterOptions[0],
    vpPayload: {
        parameter: vp_parameterOptions[0].id as string,
        time: '2020-11-10 12:01:00'
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
        setVpData: (state, action: PayloadAction<VpResponse | null>) => {
            state.vpData = action.payload;
        },
    }
}) 

export const { changeVpPayload, setSelectedVpParameterOption, setVpData } = vpChartSlice.actions;
export default vpChartSlice.reducer;