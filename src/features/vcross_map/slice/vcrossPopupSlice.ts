import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { classif_Options, radar_options, radar_ParameterOptions, radar_TypeOptions, sevip_options, species_options } from "../../../shared/static/select-options";



interface VcrossState {

    selectedBioClass: SelectOption;
    availableBioClass: SelectOption[];
    timeBioClass: string;
    segmentBioclass: boolean;
    color_0: string;
    color_1: string;

    radars: SelectOption[];
    selectedRadar: SelectOption;

    speciesOptions: SelectOption[];
    selectedSpecie: SelectOption;

    sevipVariables: SelectOption[];
    selectedSevipVar: SelectOption;
    sevipTime: string;

    selectedRadarType:SelectOption;
    avalaibleRadarTypes: SelectOption[];
    selectedRadarParameter: SelectOption;
    availableRadarParameters: SelectOption[];
    timeRadar: string;
    segmentRadar: boolean;
}

const initialState: VcrossState = {

    availableBioClass: Array.isArray(classif_Options[0].availableType) ? classif_Options[0].availableType : [],
    selectedBioClass: Array.isArray(classif_Options[0].availableType) ? classif_Options[0].availableType[0] : {id: '', displayText: ''},
    timeBioClass: '2020-11-10 12:00:33',

    speciesOptions: species_options,
    selectedSpecie: species_options[0],

    segmentBioclass: true,
    color_0: '#dc3545',
    color_1: '#0d6efd',

    radars: radar_options,
    selectedRadar: radar_options[0],

    sevipTime: '2020-11-10 12:00:33',
    sevipVariables: Array.isArray(sevip_options[0].availableType) ? sevip_options[0].availableType : [],
    selectedSevipVar: Array.isArray(sevip_options[0].availableType) ? sevip_options[0].availableType[0] : null,

    availableRadarParameters: radar_ParameterOptions,
    avalaibleRadarTypes: radar_TypeOptions,
    selectedRadarParameter: radar_ParameterOptions[0],
    selectedRadarType: radar_TypeOptions[0],
    timeRadar: '2020-11-10 12:00:33',
    segmentRadar: true,
}

const vcrossPopupSlice = createSlice({
    name: 'vcrosspopup',
    initialState,
    reducers: {
        //  --- bioclass ---
        setSelectedVcrossBioCls: (state, action) => {
            state.selectedBioClass = action.payload;
        },
        setSelectedBioclassTime: (state, action) => {
            state.timeBioClass = action.payload;
        },
        setVcrossBioclassSegment: (state, action) => {
            state.segmentBioclass = action.payload;
        },
        setVcrossClassificationColorZero: (state, action) => {
            state.color_0 = action.payload
        },
        setVcrossClassificationColorOne: (state, action) => {
            state.color_1 = action.payload
        },
        // --- Radar ---
        setSelectedVcrossRadarType: (state, action) => {
            state.selectedRadarType = action.payload;
        },
        setSelectedVcrossRadarParameter: (state, action) => {
            state.selectedRadarParameter = action.payload;
        },
        setSelectedVcrossRadarTime: (state, action) => {
            state.timeRadar = action.payload;
        },
        setVcrossRadarSegment: (state, action) => {
            state.segmentRadar = action.payload;
        },
        // --- sevip --
        setSelectedVcrossSevipVariable: (state, action) => {
            state.selectedSevipVar = action.payload;
        },
        setVcrossSevipTime: (state, action) => {
            state.sevipTime = action.payload;
        },
        setSelectedVcrossRadar: (state, action) => {
            state.selectedRadar = action.payload;
        },
        setSelectedVcrossSevipSpecie: (state, action) => {
            state.selectedSpecie = action.payload;
        },
    }
});

export const { 
    setVcrossBioclassSegment, 
    setVcrossRadarSegment,
    setVcrossClassificationColorOne,
    setVcrossClassificationColorZero,
    setSelectedVcrossBioCls, 
    setSelectedBioclassTime, 
    setSelectedVcrossRadarParameter, 
    setSelectedVcrossRadarTime, 
    setSelectedVcrossRadarType,
    setSelectedVcrossSevipVariable,
    setVcrossSevipTime,
    setSelectedVcrossRadar,
    setSelectedVcrossSevipSpecie
} = vcrossPopupSlice.actions;
export default vcrossPopupSlice.reducer;