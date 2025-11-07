import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VpPayload } from "../../../api/endpoints/verticalProfilesAPI";
import type { SelectOption } from "../../../shared/components/selects/types";

// Statics
export const parameterOptions: SelectOption[] = [

    {
        id: 'dens',
        displayText: 'Volume density'
    },
    {
        id: 'eta',
        displayText: 'Reflectivity eta '
    },
    {
        id: 'dbz',
        displayText: 'Reflectivity factor '
    },
    {
        id: 'w',
        displayText: 'Vertical speed '
    },
    {
        id: 'n_dbz',
        displayText: 'Number of range gates in density estimates '
    },
    {
        id: 'n_dbz_all',
        displayText: 'Number of range gates in DBZH estimates '
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
}

const initialState: VpCharState = {
    parameterOptions: parameterOptions,
    selectedParameter: parameterOptions[0],
    vpPayload: {
        parameter: parameterOptions[0].id as string,
        time: '2020-11-10 12:01:00'
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
            state.vpPayload = {
                ...state.vpPayload,
                parameter: action.payload.id,
            };
        },
    }
}) 

export const { changeVpHistPayload, setSelectedVpHistParameterOption } = vpHistChartSlice.actions;
export default vpHistChartSlice.reducer;