import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../../shared/components/selects/types";


// statics 

export const CoverageOptions: SelectOption[] =  [
  {
    id: 'administrative',
    displayText: 'Administrative',
    availableType: [
      {
          id: 'country',
          displayText: 'Country',
      },
      {
          id: 'province',
          displayText: 'Province',
      },
      {
          id: 'district',
          displayText: 'District',
      },
      {
          id: 'sector',
          displayText: 'Sector',
      },
      {
          id: 'cell',
          displayText: 'Cell',
      },
      {
          id: 'village',
          displayText: 'Village',
      },
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
          displayText: 'Wetland Zones',
      },
      {
          id: 'airports',
          displayText: 'Airports'
      }
    ]
  },
]

export const colormapOptions: SelectOption[] = [
  {
    id: 'viridis',
    displayText: 'Viridis',
    colors: ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725']
  },
  {
    id: 'rainbow',
    displayText: 'Rainbow',
    colors: ['#9400D3', '#4B0082', '#0000FF', '#00FF00', '#FFFF00', '#FF7F00', '#FF0000']
  },
  {
    id: 'winter',
    displayText: 'Winter',
    colors: ['#0000FF', '#0033FF', '#0066FF', '#0099FF', '#00CCFF', '#00FFFF', '#33FFFF', '#66FFFF', '#99FFFF', '#CCFFFF']
  },
  {
    id: 'summer',
    displayText: 'Summer',
    colors: ['#008000', '#339900', '#66B200', '#99CC00', '#CCFF00', '#FFFF33', '#FFFF66', '#FFFF99', '#FFFFCC', '#FFFFFF']
  },
  {
    id: 'gist_rainbow',
    displayText: 'Gist Rainbow',
    colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']
  },
]

export const mapbaseOptions: SelectOption[] = [
  {
    id: 'openstreet',
    displayText: 'Openstreet',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  },
  {
    id: 'carto_light',
    displayText: 'CARTO Light',
    url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
  },
  {
    id: 'carto_dark',
    displayText: 'CARTO Dark',
    url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
  },
  {
    id: 'satellite',
    displayText: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  },
  {
    id: 'stamen_terrain',
    displayText: 'Stamen Terrain',
    url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg'
  },
  {
    id: 'open_topo',
    displayText: 'Open Topo',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  },
]

/**
 * @var isVarPopupOpen: UI state handling the Variable selection Select element
 * @var isMapBasePopupOpen: UI state handling the Map Base selection Select element
 * @var mapBaseOptions: Available Map Bases
 * @var selectedMapBase: Selected Map Base
 * @var colormapOptions: Available Colormaps
 * @var selectedColormap: Selected Colormap
 * @var selectedSubOption: Selected SubVariable From a Variable
 */
interface VarPopupState {
    isVarPopupOpen: boolean;
    isMapBasePopupOpen: boolean;
    mapBaseOptions: SelectOption[];
    selectedMapBase: SelectOption;
    colormapOptions: SelectOption[];
    selectedColormap: SelectOption;
    coverageOptions: SelectOption[];
    selectedCoverage: SelectOption;
    coverageTypes: SelectOption[];
    selectedCoverageType: SelectOption;
}

const initialState: VarPopupState = {
    isVarPopupOpen: false,
    isMapBasePopupOpen: false,
    mapBaseOptions: mapbaseOptions,
    selectedMapBase: {
      id: 'carto_light',
      displayText: 'CARTO Light',
      url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
    },
    colormapOptions: colormapOptions,
    selectedColormap: colormapOptions[0],
    coverageOptions: CoverageOptions,
    selectedCoverage: CoverageOptions[0],
    coverageTypes: Array.isArray(CoverageOptions[0].availableType) ? CoverageOptions[0].availableType : [],
    selectedCoverageType: Array.isArray(CoverageOptions[0].availableType) ? CoverageOptions[0].availableType[0] : null,

}

const baseMapPopupSlice = createSlice({
    name: 'basemappopup',
    initialState,
    reducers: { 
        changeBaseMap: (state, action) => {
            state.selectedMapBase = action.payload;
        },
        changeColormap: (state, action) => {
            state.selectedColormap = action.payload;
        },
        toggleShowVarPopup: (state) => {
            state.isVarPopupOpen = !state.isVarPopupOpen;
        },

        hideVarPopup: (state) => {
            state.isVarPopupOpen = false;
        },
        toggleShowMapBasePopup: (state) => {
            state.isMapBasePopupOpen = !state.isMapBasePopupOpen;
        },

        hideMapBasePopup: (state) => {
            state.isMapBasePopupOpen = false;
        },
        
        setSelectedCoverageGenre: (state, action) => {
          state.coverageTypes = Array.isArray(action.payload.availableType) ? action.payload.availableType : [];
          state.selectedCoverageType = action.payload.availableType[0];
          state.selectedCoverage = action.payload;
        },
        setSelectedCoverageType: (state, action) => {
          state.selectedCoverageType = action.payload;
        }

    }
})

export const { 
  setSelectedCoverageType,
  setSelectedCoverageGenre,
  hideVarPopup, 
  toggleShowVarPopup, 
  hideMapBasePopup, 
  toggleShowMapBasePopup, 
  changeBaseMap, 
  changeColormap } = baseMapPopupSlice.actions;
export default baseMapPopupSlice.reducer;