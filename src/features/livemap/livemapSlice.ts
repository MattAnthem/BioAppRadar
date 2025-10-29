import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cellCov from '../../shared/geojsons/administrative/rwanda_cell.json';
import countryCov from '../../shared/geojsons/administrative/rwanda_country.json';
import districtCov from '../../shared/geojsons/administrative/rwanda_district.json';
import provinceCov from '../../shared/geojsons/administrative/rwanda_province.json';
import sectorCov from '../../shared/geojsons/administrative/rwanda_sector.json';
import villageCov from '../../shared/geojsons/administrative/rwanda_village.json';
import type { SpatialDataPayload, SpatialDataResponse } from "../../api/endpoints/spatialDataAPI";

interface LivemapState {
    coverage: object;
    spatialPayload: SpatialDataPayload;
    spatialData: SpatialDataResponse | null;
}

export type Administrative_boundaries = 'country' | 'district' | 'province' | 'sector' | 'village' | 'cell';

const initialState: LivemapState = {
    coverage: countryCov,
    spatialPayload: {
        map: 'vid',
        type: 'vertical',
        height: 200,
        time: "2025-10-23 16:34:00",
    },
    spatialData: null
}

const livemapSlice = createSlice({
    name: 'livemap',
    initialState,
    reducers: {
        setSpatialPayload: (state, action: PayloadAction<Partial<SpatialDataPayload>>) => {
            state.spatialPayload = { ...state.spatialPayload, ...action.payload }
        },
        setRadarData(state, action: PayloadAction<SpatialDataResponse | null>) {
            state.spatialData = action.payload;
        },
        changeCoverage: (state, action) => {
            if (action.payload === 'country') {
                state.coverage = countryCov;
            } else if (action.payload === 'district') {
                state.coverage = districtCov;
            }else if (action.payload === 'province') {
                state.coverage = provinceCov;
            }else if (action.payload === 'sector') {
                state.coverage = sectorCov;
            }else if (action.payload === 'village') {
                state.coverage = villageCov;
            } else if (action.payload === 'cell') {
                state.coverage = cellCov;
            }
        }
    }
})

export const { changeCoverage, setSpatialPayload, setRadarData } = livemapSlice.actions;
export default livemapSlice.reducer;

