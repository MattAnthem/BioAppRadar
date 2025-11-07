import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import type { VtipPayload } from "../../../api/endpoints/verticalProfilesAPI";

// static
export const parameterOptions: SelectOption[] = [
    {
        id: 'mtr',
        displayText: 'Migration traffic rate'
    },
    {
        id: 'mt',
        displayText: 'Cumulative migration traffic'
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
}


const initialState: VtipChartState = {
    parameterOptions: parameterOptions,
    selectedParameter: parameterOptions[0],
    vtipPayload: {
        startTime: '2020-11-10 12:01:00',
        endTime: '2020-11-10 12:50:00',
        parameter: parameterOptions[0].id as string
    }
}

const vtipHistChartSlice = createSlice({
    name: 'vtipchart',
    initialState,
    reducers: {
        changeVtipHistPayload: (state, action: PayloadAction<Partial<VtipPayload>>) => {
            state.vtipPayload = { ...state.vtipPayload, ...action.payload }
        },
        setSelectedVtipHistParameterOption: (state, action) => {
            state.selectedParameter = action.payload;
            state.vtipPayload = {
                ...state.vtipPayload,
                parameter: action.payload.id,
            }
        },

    }
});

export const { changeVtipHistPayload, setSelectedVtipHistParameterOption } = vtipHistChartSlice.actions;
export default vtipHistChartSlice.reducer;