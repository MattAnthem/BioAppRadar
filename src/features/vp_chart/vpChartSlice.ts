import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VpPayload, VpResponse } from "../../api/endpoints/verticalProfilesAPI";
import type { SelectOption } from "../../shared/components/selects/types";

// Statics
export const parameterOptions: SelectOption[] = [
    {
        id: 'dens',
        displayText: 'volume density '
    },
    {
        id: 'eta',
        displayText: 'reflectivity eta '
    },
    {
        id: 'dbz',
        displayText: 'reflectivity factor '
    },
    {
        id: 'w',
        displayText: 'vertical speed '
    },
    {
        id: 'n_dbz',
        displayText: 'number of range gates in density estimates '
    },
    {
        id: 'n_dbz_all',
        displayText: 'number of range gates in DBZH estimates '
    },
    {
        id: 'sd_vvp',
        displayText: 'VVP-retrieved radial velocity stdev '
    },
]

interface VpCharState {
    parameterOptions: SelectOption[];
    selectedParameter: SelectOption; 
    vpPayload: VpPayload;
    vpData: VpResponse | null;
}

const initialState: VpCharState = {
    parameterOptions: parameterOptions,
    selectedParameter: parameterOptions[0],
    vpPayload: {
        parameter: parameterOptions[0].id as string,
        time: '2020-11-12 05:55:14'
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