import { createSlice } from "@reduxjs/toolkit";
import type { SelectOption } from "../../components/selects/types";

const MapOptions: SelectOption[] = 
[  
  {
    id: 'vertical',
    displayText: 'Vertically Integrated Profile',
    availableType: [
      {
        id: 'vir',
        displayText: 'Vertically Integrated Reflectivity'
      },
      {
        id: 'vid',
        displayText: 'Vertically Integrated Density '
      },
      {
        id: 'eta-exp',
        displayText: 'Eta Expected '
      },
      {
        id: 'eta-obs',
        displayText: 'Eta Observed '
      }
    ]
  },
  {
    id: 'classification',
    displayText: 'Classification',
    availableType: [
      {
        id: 'meteo-biology',
        displayText: 'Meteorological vs Biological'
      },
      {
        id: 'bird-insect',
        displayText: 'Bird vs Insect  '
      }
    ]
  },
  {
    id: 'radar_data',
    displayText: 'Radar Data',
    availableType: [
      {
        id: 'dr',
        displayText: 'Depolarization ratio '
      },
      {
        id: 'ref',
        displayText: 'Reflectivity '
      },
      {
        id: 'zdr',
        displayText: 'Differential Reflectivity '
      },
      {
        id: 'phi',
        displayText: 'Differential Phase '
      },
      {
        id: 'rho',
        displayText: 'Correlation Coefficient '
      },
      {
        id: 'vel',
        displayText: 'Radial Velocity '
      },
      {
        id: 'sw',
        displayText: 'Spectrum Width '
      }
    ]
  }
]


// statics to be moved to the backend

  


const colormapOptions: SelectOption[] = [
  {
    id: 'viridis',
    displayText: 'Viridis',
    colors: ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725']
  },
  {
    id: 'Rainbow',
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
    id: 'ghistrainbow',
    displayText: 'Ghist Rainbow',
    colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']
  },
]

const mapbaseOptions: SelectOption[] = [
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


interface VarPopupState {
    isVarPopupOpen: boolean;
    isMapBasePopupOpen: boolean;
    mapBaseOptions: SelectOption[];
    selectedMapBase: SelectOption;
    colormapOptions: SelectOption[];
    selectedColormap: SelectOption;
    selectedMapOption: SelectOption;
    mapOptions: SelectOption[];
    subOptions: SelectOption[];
    selectedSubOption: SelectOption;
}

const initialState: VarPopupState = {
    isVarPopupOpen: false,
    isMapBasePopupOpen: false,
    mapBaseOptions: mapbaseOptions,
    selectedMapBase: {
      id: 'openstreet',
      displayText: 'Openstreet',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    colormapOptions: colormapOptions,
    selectedColormap: colormapOptions[0],
    mapOptions: MapOptions,
    selectedMapOption: MapOptions[0],
    subOptions: Array.isArray(MapOptions[0].availableType) ? MapOptions[0].availableType : [],
    selectedSubOption: Array.isArray(MapOptions[0].availableType) ? MapOptions[0].availableType[0] : null,
    
}

const varpopupSlice = createSlice({
    name: 'mappopups',
    initialState,
    reducers: {
        changeSelectedMapOption: (state, action) => {
          state.subOptions = Array.isArray(action.payload.availableType) ? action.payload.availableType : [];
          state.selectedMapOption = action.payload;
        },
        changeSelectedSubOption: (state, action) => {
          state.selectedSubOption = action.payload;
        },  
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
    }
})

export const { hideVarPopup, toggleShowVarPopup, hideMapBasePopup, toggleShowMapBasePopup, changeBaseMap, changeColormap, changeSelectedMapOption, changeSelectedSubOption } = varpopupSlice.actions;
export default varpopupSlice.reducer;