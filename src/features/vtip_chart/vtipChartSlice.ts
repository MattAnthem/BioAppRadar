import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VtipPayload } from "../../api/endpoints/verticalProfilesAPI";
import type { SelectOption } from "../../shared/components/selects/types";

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
    vtipStartTime: string;
    vtipEndTime: string;
    vtipPayload: VtipPayload;
}


const initialState: VtipChartState = {

    parameterOptions: parameterOptions,
    selectedParameter: parameterOptions[0],
    vtipStartTime: '2020-11-10 12:01:00',
    vtipEndTime: '2020-11-10 12:50:00',

    vtipPayload: {
        startTime: '2020-11-10 12:01:00',
        endTime: '2020-11-10 12:50:00',
        parameter: 'mtr'
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