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
        id: 'eta',
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
    

    parameterOptions: parameterOptions,
    selectedParameter: parameterOptions[0],
    vptsStartTime: '2020-11-10 12:01:00',
    vptsEndTime: '2020-11-10 12:50:00',

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