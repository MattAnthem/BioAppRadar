import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import type { VtipPayload } from "../../../api/endpoints/verticalProfilesAPI";
import { vtip_parameterOptions } from "../../../shared/static/select-options";


interface VtipChartState {
    isPopupOpen: boolean;
    parameterOptions: SelectOption[];
    selectedParameter: SelectOption;
    vtipStartTime: string;
    vtipEndTime: string;

    vtipPayload: VtipPayload;
}


const initialState: VtipChartState = {
    isPopupOpen: false,

    parameterOptions: vtip_parameterOptions,
    selectedParameter: vtip_parameterOptions[0],
    vtipStartTime: '2020-11-10 12:01:00',
    vtipEndTime: '2020-11-10 12:50:00',

    vtipPayload: {
        startTime: '2020-11-10 12:01:00',
        endTime: '2020-11-10 12:50:00',
        parameter: vtip_parameterOptions[0].id as string
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
        },
        setVtipHistStartTime: (state, action) => {
            state.vtipStartTime = action.payload
        },
        setVtipHistEndTime: (state, action) => {
            state.vtipEndTime = action.payload
        },
        toggleVtipHistPopup: (state) => {
            state.isPopupOpen = !state.isPopupOpen
        },
        closeVtipHistPopup: (state) => {
            state.isPopupOpen = false;
        }

    }
});

export const { changeVtipHistPayload, setSelectedVtipHistParameterOption, closeVtipHistPopup, setVtipHistEndTime, setVtipHistStartTime,  toggleVtipHistPopup } = vtipHistChartSlice.actions;
export default vtipHistChartSlice.reducer;