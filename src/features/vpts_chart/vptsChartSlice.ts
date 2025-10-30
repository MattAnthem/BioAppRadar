import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VptsPayload, VptsResponse } from "../../api/endpoints/verticalProfilesAPI";
import type { SelectOption } from "../../shared/components/selects/types";



// static
export const parameterOptions: SelectOption[] = [
    {
        id: 'mt',
        displayText: 'cumulative migration traffic'
    },
    {
        id: 'mtr',
        displayText: 'migration traffic rate'
    },
    {
        id: 'rt',
        displayText: 'cumulative reflectivity traffic'
    },
    {
        id: 'rtr',
        displayText: 'reflectivity traffic rate'
    },
    {
        id: 'vid',
        displayText: 'vertically integrated densities'
    },
    {
        id: 'vir',
        displayText: 'Vertically Integrated Reflectivity'
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
        startTime: '2020-11-12 03:00:30',
        endTime: '2020-11-12 04:35:03',
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