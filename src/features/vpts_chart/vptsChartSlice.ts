import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VptsPayload, VptsResponse } from "../../api/endpoints/verticalProfilesAPI";
import type { SelectOption } from "../../shared/components/selects/types";



// static
export const parameterOptions: SelectOption[] = [
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
    vptsData: VptsResponse | null;
}

const initialState: VptsChartState = {
    parameterOptions: parameterOptions,
    selectedParameter: parameterOptions[0],
    vptsPayload: {
        startTime: '2020-11-10 12:01:00',
        endTime: '2020-11-10 12:50:00',
        parameter: parameterOptions[0].id as string
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
        setVptsData: (state, action: PayloadAction<VptsResponse | null>) => {
            state.vptsData = action.payload
        }
    }
});

export const { changeVptsPayload, setSelectedVptsParameterOption, setVptsData } = vptsChartSlice.actions;
export default vptsChartSlice.reducer;