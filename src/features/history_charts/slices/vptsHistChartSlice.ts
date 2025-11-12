import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import type { VptsPayload } from "../../../api/endpoints/verticalProfilesAPI";
import { vp_parameterOptions } from "../../../shared/static/select-options";


interface VptsChartState {
    // UI states
    isPopupOpen: boolean;
    parameterOptions: SelectOption[];
    selectedParameter: SelectOption;
    vptsStartTime: string;
    vptsEndTime: string;

    vptsPayload: VptsPayload;
}

const initialState: VptsChartState = {
    isPopupOpen: false,
    

    parameterOptions: vp_parameterOptions,
    selectedParameter: vp_parameterOptions[0],
    vptsStartTime: '2020-11-10 12:01:00',
    vptsEndTime: '2020-11-10 12:50:00',

    vptsPayload: {
        startTime: '2020-11-10 12:01:00',
        endTime: '2020-11-10 12:50:00',
        parameter: vp_parameterOptions[0].id as string
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
        },
        setVptsHistStartTime: (state, action) => {
            state.vptsStartTime = action.payload
        },
        setVptsHistEndTime: (state, action) => {
            state.vptsEndTime = action.payload
        },
        toggleVptsHistPopup: (state) => {
            state.isPopupOpen = !state.isPopupOpen
        },
        closeVptsHistPopup: (state) => {
            state.isPopupOpen = false;
        }

    }
});

export const { changeVptsHistPayload, setSelectedVptsHistParameterOption, closeVptsHistPopup, setVptsHistEndTime, setVptsHistStartTime, toggleVptsHistPopup } = vptsHistChartSlice.actions;
export default vptsHistChartSlice.reducer;