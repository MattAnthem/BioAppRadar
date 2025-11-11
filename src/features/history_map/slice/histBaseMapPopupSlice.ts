import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";
import { colormapOptions, mapbaseOptions } from "../../livemap/slice/baseMapPopupSlice";


const boundarieOptionsHist: SelectOption[] = [
    {
        id: 'administrative',
        displayText: 'Administrative Boundaries',
        availableType: [
            {
                id: 'country',
                displayText: 'Country'
            },
            {
                id: 'province',
                displayText: 'State/Province'
            },
            {
                id: 'district',
                displayText: 'County/District'
            },
            {
                id: 'sector',
                displayText: 'Sector'
            },
            {
                id: 'cell',
                displayText: 'Cell'
            },
            {
                id: 'village',
                displayText: 'Village'
            }
        ]
    },
    {
        id: 'special_zones',
        displayText: 'Special Zones',
        availableType: [
            {
                id: 'protected_areas',
                displayText: 'Protected Areas'
            },
            {
                id: 'wetland_zones',
                displayText: 'Wetland Zones'
            },
            {
                id: 'airports',
                displayText: 'Airports'
            }
        ]
    }
];

interface HistoryBaseMapState {
    isMapBasePopupOpen: boolean;
    mapBaseOptions: SelectOption[];
    selectedMapBase: SelectOption;
    colormapOptions: SelectOption[];
    selectedColormap: SelectOption;
    // GeoJson
    boundaryOptions: SelectOption[];
    boundaryTypes: SelectOption[];
    selectedBoundaryType: SelectOption;
    selectedBoundary: SelectOption;
}

const initialState: HistoryBaseMapState =  {
    isMapBasePopupOpen: false,
    mapBaseOptions: mapbaseOptions,
    colormapOptions: colormapOptions,
    selectedColormap: colormapOptions[0],
    selectedMapBase: mapbaseOptions[0],

    boundaryOptions: boundarieOptionsHist,
    selectedBoundary: boundarieOptionsHist[0],
    boundaryTypes: Array.isArray(boundarieOptionsHist[0].availableType) ? boundarieOptionsHist[0].availableType : [],
    selectedBoundaryType: Array.isArray(boundarieOptionsHist[0].availableType) ? boundarieOptionsHist[0].availableType[0] : {id: '', displayText: ''},
}

const historyBaseMapSlice = createSlice({
    name: 'basemaphistory',
    initialState,
    reducers: {
          changeHistBaseMap: (state, action) => {
              state.selectedMapBase = action.payload;
          },
          changeHistColormap: (state, action) => {
              state.selectedColormap = action.payload;
          },
          toggleShowHistMapBasePopup: (state) => {
              state.isMapBasePopupOpen = !state.isMapBasePopupOpen;
          },
  
          hideHistMapBasePopup: (state) => {
              state.isMapBasePopupOpen = false;
          },
          setSelectedBoundaryHist: (state, action) => {
            state.boundaryTypes = Array.isArray(action.payload.availableType) ? action.payload.availableType : [];
            state.selectedBoundaryType = state.boundaryTypes[0];
            state.selectedBoundary = action.payload;
        },
        setSelectedBoundaryTypeHist: (state, action) => {
            state.selectedBoundaryType = action.payload;
        },
    }
});

export const { changeHistBaseMap, setSelectedBoundaryHist, setSelectedBoundaryTypeHist,  changeHistColormap, hideHistMapBasePopup,  toggleShowHistMapBasePopup} = historyBaseMapSlice.actions;
export default historyBaseMapSlice.reducer;