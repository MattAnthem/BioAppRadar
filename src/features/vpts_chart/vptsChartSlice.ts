import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VptsPayload, VptsResponse } from "../../api/endpoints/verticalProfilesAPI";
import type { SelectOption } from "../../shared/components/selects/types";
import { vp_parameterOptions } from "../../shared/static/chart-options";



interface VptsChartState {
    parameterOptions: SelectOption[];
    selectedParameter: SelectOption;
    vptsPayload: VptsPayload;
    vptsData: VptsResponse | null;
}

const initialState: VptsChartState = {
    parameterOptions: vp_parameterOptions,
    selectedParameter: vp_parameterOptions[0],
    vptsPayload: {
        startTime: '2020-11-10 12:01:00',
        endTime: '2020-11-10 12:50:00',
        parameter: vp_parameterOptions[0].id as string
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