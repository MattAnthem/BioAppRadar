import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VtipPayload, VtipResponse } from "../../api/endpoints/verticalProfilesAPI";
import type { SelectOption } from "../../shared/components/selects/types";

// static
export const parameterOptions: SelectOption[] = [
    {
        id: 'mt',
        displayText: 'Cumulative migration traffic'
    },
    {
        id: 'mtr',
        displayText: 'Migration traffic rate'
    },
    {
        id: 'rt',
        displayText: 'Cumulative reflectivity traffic'
    },
    {
        id: 'rtr',
        displayText: 'Reflectivity traffic rate'
    },
    {
        id: 'vid',
        displayText: 'Vertically integrated densities'
    },
    {
        id: 'vir',
        displayText: 'Vertically Integrated Reflectivity'
    },
]

interface VtipChartState {
    parameterOptions: SelectOption[];
    selectedParameter: SelectOption;
    vtipPayload: VtipPayload;
    vtipData: VtipResponse | null;
}


const initialState: VtipChartState = {
    parameterOptions: parameterOptions,
    selectedParameter: parameterOptions[0],
    vtipPayload: {
        startTime: '2020-11-10 12:01:00',
        endTime: '2020-11-10 12:50:00',
        parameter: parameterOptions[0].id as string
    },
    vtipData: null,
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
            state.vtipPayload = {
                ...state.vtipPayload,
                parameter: action.payload.id,
            }
        },
        setVtipData: (state, action: PayloadAction<VtipResponse | null>) => {
            state.vtipData = action.payload;
        }
    }
});

export const { changeVtipPayload, setSelectedVtipParameterOption, setVtipData } = vtipChartSlice.actions;
export default vtipChartSlice.reducer;