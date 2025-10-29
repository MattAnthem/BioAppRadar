// import h0_0_0 from '../../api/pngs_test/reflectivity_00-00-00.png'
// import h0_0_5 from '../../api/pngs_test/reflectivity_00-00-05.png'
// import h0_10_0 from '../../api/pngs_test/reflectivity_00-10-00.png'
// import h0_15_0 from '../../api/pngs_test/reflectivity_00-15-00.png'
// import h0_20_1 from '../../api/pngs_test/reflectivity_00-20-01.png'
// import h0_25_0 from '../../api/pngs_test/reflectivity_00-25-00.png'
// import h0_30_0 from '../../api/pngs_test/reflectivity_00-30-00.png'
// import h0_35_1 from '../../api/pngs_test/reflectivity_00-35-01.png'
// import h0_40_0 from '../../api/pngs_test/reflectivity_00-40-00.png'
// import h0_45_0 from '../../api/pngs_test/reflectivity_00-45-00.png'
// import h0_50_0 from '../../api/pngs_test/reflectivity_00-50-00.png'
// import h0_55_1 from '../../api/pngs_test/reflectivity_00-55-01.png'

// import { cities_fakeApi, parks_fakeApi } from '../../api/fake/geojsons';

// TODO replace with backend APIs

/**
 * API for live map real time (showing data for 30 min past ?)
 * 
 * api parameters could be : 
 *  - A country
 *  - coverage
 *  - colormap
 *  - type
 *  - altitude 
 *  
 * 
 * Response will include :
 *  - radars available on the selected country
 *  - overlays PNGs with time/date and wind direction by radars
 *  - bounds
 *  - coverage zones on the country
 * 
 * E.G:
 *  function fetchSpatialData(country, colormap, type, altitude) {
 *      some fetch loic
 *      ...
 *      return {
 *          overlays: { //with wind direction 
 *              wind: [],
 *              product: [],
 *          },
 *          coverages: [],
 *          bounds: [[], []]
 *      }
 *  }
 * 
 * 
 */



// parameters (coverages, scattererstypes, colormaps)
export const parameters = {
    coverages: ['Airports', 'Parks', 'Cities', 'Rivers', 'Lakes'],
    colormap: ['viridis', 'cividis', 'rainbow', 'plasma'],
    scattererType: ['Birds', 'Insects', 'Bats'],
    altitudesBand: [0, 100, 150, 350, 1000, 1500].reverse(),
}

// spatial data
export const spatialData = {
    timestamps: [
        '2025-01-02 00:00:00', 
        '2025-01-02 00:00:05', 
        '2025-01-02 00:10:00', 
        '2025-01-02 00:15:00', 
        '2025-01-02 00:20:01', 
        '2025-01-02 00:25:00', 
        '2025-01-02 00:30:00', 
        '2025-01-02 00:35:01', 
        '2025-01-02 00:40:00', 
        '2025-01-02 00:45:00', 
        '2025-01-02 00:50:00', 
        '2025-01-02 00:55:01',
    ],
    // reflectivities: [
    //      h0_0_0, 
    //      h0_0_5, 
    //      h0_10_0, 
    //      h0_15_0, 
    //      h0_20_1, 
    //      h0_25_0, 
    //      h0_30_0, 
    //      h0_35_1, 
    //      h0_40_0, 
    //      h0_45_0, 
    //      h0_50_0, 
    //      h0_55_1, 
    // ],
    windDirection: [
        
    ],
    coverages: [], // geojsons
    imageBounds: [
        [-3.506983025814523, 28.7617212096075],
        [-0.8085435432205722, 31.464498190392497],
    ]
}