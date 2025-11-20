import type { SelectOption } from "../components/selects/types";

// --- Species Options ---
export const species_options: SelectOption[] = [
    {
        id: 'bird',
        displayText: 'Bird'
    },
    {
        id: 'insect',
        displayText: 'Insect'
    }
]

// --- Verical Profiles ---
export const vp_parameterOptions: SelectOption[] = [
    {
        id: 'dens',
        displayText: 'Volume density'
    },
    {
        id: 'eta',
        displayText: 'Reflectivity eta '
    },
    {
        id: 'dbz',
        displayText: 'Reflectivity factor'
    },
    {
        id: 'w',
        displayText: 'Vertical speed'
    },
    {
        id: 'n_dbz',
        displayText: 'Number of range gates in density estimates'
    },
    {
        id: 'n_dbz_all',
        displayText: 'Number of range gates in DBZH estimates'
    },
    {
        id: 'sd_vvp',
        displayText: 'VVP-retrieved radial velocity stdev'
    },
]

export const vtip_parameterOptions: SelectOption[] = [
    {
        id: 'mtr',
        displayText: 'Migration traffic rate'
    },

    {
        id: 'rtr',
        displayText: 'Reflectivity traffic rate'
    },
    {
        id: 'vid',
        displayText: 'Vertically integrated densities'
    },
    {
        id: 'vir',
        displayText: 'Vertically Integrated Reflectivity'
    },
    {
        id: 'mt',
        displayText: 'Cumulative migration traffic'
    },
    {
        id: 'rt',
        displayText: 'Cumulative reflectivity traffic'
    },
]

// --- Map boundaries ---
export const map_boundarieOptions: SelectOption[] = [
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

// --- Map base ---
export const map_baseOptions: SelectOption[] = [
    {
      id: 'carto_light',
      displayText: 'CARTO Light',
      url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
    },
    {
      id: 'openstreet',
      displayText: 'Openstreet',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
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

// --- Colormap ---
export const colormapsOptions: SelectOption[] = [
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

// --- Classification options ---
export const classif_Options: SelectOption[] = [
    {
        id: 'classification',
        displayText: 'Classification',
        availableType: [
          {
            id: 'species',
            displayText: 'Bird vs Insect Classification',
            type0: 'Insects',
            type1: 'Birds'
          },
          {
            id: 'biometeo',
            displayText: 'Biological vs Meteorological Classification',
            type0: 'Meteorological',
            type1: 'Biological'
          }
        ]
    }
]

// --- RADAR ---
export const radar_TypeOptions: SelectOption[] = [

    {
        id: 'grid',
        displayText: 'Cartesian Grid '
    },
    {
        id: 'polar',
        displayText: 'Polar Volume'
    },
]

export const radar_ParameterOptions: SelectOption[] = [
{ 
    id: 'ref', 
    displayText: 'Reflectivity' 
},
{ 
    id: 'zdr', 
    displayText: 'Differential Reflectivity' 
},
{ 
    id: 'phi', 
    displayText: 'Differential Phase' 
},
{ 
    id: 'rho', 
    displayText: 'Correlation Coefficient' 
},
{ 
    id: 'vel', 
    displayText: 'Radial Velocity' 
},
{ 
    id: 'sw', 
    displayText: 'Spectrum Width' 
},
{ 
    id: 'dr', 
    displayText: 'Depolarization Ratio' 
}
]

// --- SEVIP ---
export const sevip_options: SelectOption[] = [
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
            id: 'eta_sum',
            displayText: 'Sum of observed linear reflectivities'
          },
          {
            id: 'eta_sum_expected',
            displayText: 'Sum of expected linear reflectivities'
          }
        ]
    },
]