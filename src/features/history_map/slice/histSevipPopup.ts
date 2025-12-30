import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { radar_options, sevip_options, species_options } from "../../../shared/static/select-options";


interface SevipPopupState {
    selectedVariable: SelectOption;
    availableVariables: SelectOption[];
    speciesOptions: SelectOption[];
    selectedSpecie: SelectOption;
    radars: SelectOption[];
    selectedRadar: SelectOption;

    // time for png image
    histTimeSevip: string;

    // timerange for gif animation
    startTimeSevip: string;
    endTimeSevip: string;
}



const initialState: SevipPopupState = {

    selectedVariable: Array.isArray(sevip_options[0].availableType) ? sevip_options[0].availableType[0] : null,
    availableVariables: Array.isArray(sevip_options[0].availableType) ? sevip_options[0].availableType : [],
    speciesOptions: species_options,
    selectedSpecie: species_options[0],
    histTimeSevip: '2020-11-10 12:00:33',
    radars: radar_options,
    selectedRadar: radar_options[0],
    
    startTimeSevip: '2020-11-10 12:00:33',
    endTimeSevip: '2020-11-10 12:50:00'
}

const histSevippopupSlice = createSlice({
    name: 'sevippopup',
    initialState,
    reducers: {
        setSelectedHistSevipOption: (state, action) => {
            state.selectedVariable = action.payload;
        },
        setSelectedHistSevipSpecie: (state, action) => {
          state.selectedSpecie = action.payload;
        },
        setHistTimeSevip: (state, action) => {
          state.histTimeSevip = action.payload;
        },
        setHistSevipTimeStart: (state, action) => {
          state.startTimeSevip = action.payload;
        },
        setHistSevipTimeEnd: (state, action) => {
          state.endTimeSevip = action.payload;
        },
        setSelectedRadar: (state, action) => {
          state.selectedRadar = action.payload;
        }
    }
})

export const { setSelectedHistSevipOption, setHistTimeSevip, setHistSevipTimeEnd, setHistSevipTimeStart, setSelectedHistSevipSpecie, setSelectedRadar } = histSevippopupSlice.actions;
export default histSevippopupSlice.reducer;