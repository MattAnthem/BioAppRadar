import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import type { VptsPayload } from "../../../api/endpoints/verticalProfilesAPI";




// static
export const parameterOptions: SelectOption[] = [
    {
        id: 'dens',
        displayText: 'Volume density'
    },
    {
        id: 'dbz',
        displayText: 'Reflectivity factor'
    },
    {
        id: 'dens',
        displayText: 'Reflectivity eta'
    },
    {
        id: 'n_dbz_all',
        displayText: 'Number of range gates in DBZH estimates'
    },
    {
        id: 'n_dbz',
        displayText: 'Number of range gates in density estimates'
    },
    {
        id: 'sd_vvp',
        displayText: 'VVP-retrieved radial velocity stdev'
    },
    {
        id: 'w',
        displayText: 'Vertical speed'
    }
]

interface VptsChartState {
    parameterOptions: SelectOption[];
    selectedParameter: SelectOption;
    vptsPayload: VptsPayload;
}

const initialState: VptsChartState = {
    parameterOptions: parameterOptions,
    selectedParameter: parameterOptions[0],
    vptsPayload: {
        startTime: '2020-11-10 12:01:00',
        endTime: '2020-11-10 12:50:00',
        parameter: parameterOptions[0].id as string
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
            state.vptsPayload = {
                ...state.vptsPayload,
                parameter: action.payload.id,
            }
        },
    }
});

export const { changeVptsHistPayload, setSelectedVptsHistParameterOption } = vptsHistChartSlice.actions;
export default vptsHistChartSlice.reducer;