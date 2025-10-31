import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cellCov from '../../shared/geojsons/administrative/rwanda_cell.json';
import countryCov from '../../shared/geojsons/administrative/rwanda_country.json';
import districtCov from '../../shared/geojsons/administrative/rwanda_district.json';
import provinceCov from '../../shared/geojsons/administrative/rwanda_province.json';
import sectorCov from '../../shared/geojsons/administrative/rwanda_sector.json';
import villageCov from '../../shared/geojsons/administrative/rwanda_village.json';
import type { CrossSectionPayload, SpatialDataPayload, SpatialDataResponse } from "../../api/endpoints/spatialDataAPI";
import type { SelectOption } from "../../shared/components/selects/types";

const coverageOptions: SelectOption[] = [
    {
        id: 'country',
        displayText: 'Country',
        geometry: countryCov,
    },
    {
        id: 'district',
        displayText: 'District',
        geometry: districtCov,
    },
    {
        id: 'province',
        displayText: 'Province',
        geometry: provinceCov,
    },
    {
        id: 'sector',
        displayText: 'Sector',
        geometry: sectorCov,
    },
    {
        id: 'village',
        displayText: 'Village',
        geometry: villageCov,
    },
    {
        id: 'cell',
        displayText: 'Cell',
        geometry: cellCov,
    }
]


interface LivemapState {
    coverageOptions: SelectOption[];
    selectedCoverage: SelectOption;
    spatialPayload: SpatialDataPayload;
    spatialData: SpatialDataResponse | null;
    crossSectionPayload: CrossSectionPayload;
}


const initialState: LivemapState = {
    coverageOptions: coverageOptions,
    selectedCoverage: coverageOptions[0],
    spatialPayload: {
        map: 'vid',
        type: 'vertical',
        height: 200,
        time: "2025-10-23 16:34:00",
    },
    spatialData: null,
    crossSectionPayload: {
        startLat: 0,
        startLon: 0,
        endLat: 0,
        endLon: 0,
        map: 'zdr',
        time: '',
        type: 'map'
    },
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
            const selected = state.coverageOptions.find(option => option.id === action.payload);
            if (selected) {
                state.selectedCoverage = selected;
            }
        },

        setCrossSectionPayload: (state, action: PayloadAction<Partial<CrossSectionPayload>>) => {
            state.crossSectionPayload = { ...state.crossSectionPayload, ...action.payload }
        }

    }
})

export const { changeCoverage, setSpatialPayload, setRadarData, setCrossSectionPayload } = livemapSlice.actions;
export default livemapSlice.reducer;

