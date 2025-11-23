import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changeVcrossColorbar, setVcrossBioClassPayload, setVcrossCoordinates, setVcrossRadarPayload } from './slice/vcrossMapSlice';
import { useEffect, useRef, lazy } from 'react'
import { useVcrossClassificationOverlayData } from './useData/useVcrossClassificationOverlayData';
import { useVcrossRadarOverlayData } from './useData/useVcrossRadarOverlayData';
import { Unplug } from 'lucide-react';
import loader from '../../assets/loader.webp';
import { useBoundariesQuery } from '../../shared/hooks/useBoundaries/useBoundariesQuery';
import { useVcrossSevipOverlayData } from './useData/useVcrossSevipOverlayData'
import type { ClassificationDataResponse } from '../../api/endpoints/spatial/classificationAPI';
import type { SpatialDataResponse } from '../../api/endpoints/spatial/spatialDataAPI';

const Colorbar = lazy(() => import('../livemap/components/Colorbar'));
const MapbaseVcrossPopup = lazy(() => import('./components/MapbaseVcrossPopup'));
const VcrossRadarDataPopup = lazy(() => import('./components/VcrossRadarDataPopup'));
const VcrossBioClsDataPopup = lazy(() => import('./components/VcrossBioClsDataPopup'));
const LeafletMap = lazy(() => import('../../shared/components/map/LeafletMap'));
const SectionCard  = lazy(() => import('../../shared/components/cards/SectionCard'));
const GlassHeader = lazy(() => import('../../shared/components/cards/GlassHeader'));
const VcrossSevipDataPopup = lazy(() => import('./components/VcrossSevipDataPopup'));


const Vcrossmap = () => {

    const { selectedMapBase, selectedBoundary, selectedBoundaryType } = useAppSelector(state => state.vcross_basemap);

    const { mapMode } = useAppSelector(state => state.vcrossmap);
    const dispatch = useAppDispatch();

    const mapModeRef = useRef(mapMode);


    useEffect(() => {
        mapModeRef.current = mapMode;
    }, [mapMode]);

    // Map boundary GeoJson
    const payload = {
        type: selectedBoundary.id as string,
        json: selectedBoundaryType.id as string
    }
    const { data: coverageJson, error: coverageError , isLoading: coverageLoading} = useBoundariesQuery(
        payload, 
        Boolean(selectedBoundary.id && selectedBoundaryType.id)
    )

    //#region Overlay FETCHING
    // Fetching overlay for the map
    const isRadar = mapMode === 'vcross_radar';
    const isBioclass = mapMode === 'vcross_bioclass';
    const isSevip = mapMode === 'vcross_sevip';

    const { data: classifOvrlay, isLoading: classifOvrlayLoading, error: classiOvrlayError } = useVcrossClassificationOverlayData(isBioclass);
    const { data: radarOverlay, isLoading: radarOverlayLoading, error:  radarOvrlayError} = useVcrossRadarOverlayData(isRadar);
    const { data: sevipOverlay, isLoading: sevipOverlayLoading, error:  sevipOvrlayError} = useVcrossSevipOverlayData(isSevip);

    let data: ClassificationDataResponse | SpatialDataResponse | null = null;
    let isLoading = false;
    let error = null;

    switch (true) {
        case isBioclass: 
            data = classifOvrlay as ClassificationDataResponse
            isLoading = classifOvrlayLoading;
            error = classiOvrlayError
            break;
        case isRadar:
            data = radarOverlay as SpatialDataResponse;
            isLoading = radarOverlayLoading;
            error = radarOvrlayError;
            break;
        case isSevip:
            data = sevipOverlay as SpatialDataResponse;
            isLoading = sevipOverlayLoading;
            error = sevipOvrlayError;
            break;
    }

    //#endregion

    //#region HANDLERS 

    // Change overlay colorbar (Sevip and radar)
    const handleChangeColorbar = (colorname: string) => {
        dispatch(changeVcrossColorbar(colorname));
    }

    // Handling BIOCLASS/RADAR Payload elements
    // coordinates
    const handleTransectLineDrawn = (start: L.LatLng, end: L.LatLng) => {
        const coords = {
          startLat: start.lat,
          endLat: end.lat,
          startLon: start.lng,
          endLon: end.lng,
        };
        const currentMode = mapModeRef.current;
        dispatch(setVcrossCoordinates(coords));
        if (currentMode === 'vcross_bioclass') {
          dispatch(setVcrossBioClassPayload(coords));
        } else if (currentMode === 'vcross_radar') {
          dispatch(setVcrossRadarPayload(coords));
        }
      };

 

//#endregion


  return (
    <SectionCard className='relative w-full h-full'>

            {
                (error || coverageError ) && (
                    <div className="absolute z-10 w-full h-full flex items-center justify-center">
                        <Unplug width={35} height={35} className='text-red-500'/>
                    </div>
                )
            }

            {
                isLoading && (
                    <div className="absolute z-10 w-full h-full flex items-center justify-center">
                        <img src={loader} alt="loading-data" width={35} height={35}  />
                    </div>
                )
            }

            {
                ( coverageLoading ) && (
                    <div className="absolute z-10 w-full h-full flex flex-col items-center justify-center">
                        <img src={loader} alt="loading-data" width={35} height={35}  />
                        <p className='text-gray-700'>Loading coverage</p>
                    </div>
                )
            }

      
            {/* Header: Options */}
            <GlassHeader
              className='z-20 p-1 flex justify-between items-center'
            >

                <h3 className='text-white tracking-wider text-xs'>{data?.info.name}</h3>

                {/* Data popover Options */}
                <div className="z-5 flex gap-2 justify-center items-end">
                    <VcrossSevipDataPopup />
                    <VcrossRadarDataPopup />
                    <VcrossBioClsDataPopup />
                    <MapbaseVcrossPopup 
                        onChangeOverlayColor={handleChangeColorbar}
                        displayColorbarOption= {mapMode == 'vcross_radar' || mapMode == 'vcross_sevip'}
                    />
                </div>

            </GlassHeader>

            {/* Colorbar */}
            {
                (mapMode !== 'vcross_bioclass') && (
                    <Colorbar
                        colorCodes={(data as SpatialDataResponse)?.ckeys?.colors ?? []}
                        valueScale={(data as SpatialDataResponse)?.ckeys?.labels.map(Number)  ?? []}
                        className='absolute bottom-0 left-0 z-10'
                    />
                )
            }


            {/* Cross section Map */}
            <LeafletMap
                className='relative z-4 w-full h-full rounded-sm '            
                baseMap={selectedMapBase.url as string}
                drawable={false}
                enableLineDraw={true}
                center={[-2.158, 30.1131097]}
                zoom={9}
                onDrawLine={handleTransectLineDrawn}
                overlayImg={
                    {
                        url: data?.data?.png ?? '',
                        bounds: data?.data?.bounds as L.LatLngBoundsExpression ?? [[0,0], [0, 0]],
                    }
                }
                overlayShapes={coverageJson}
                onShapeClicked={(geojson) => {
                    console.log('Clicked shape:', geojson);
                }}
            />

            {/* Map Time */}
            <div className={`absolute  text-xs flex flex-col justify-center gap-1.5 z-10 lg:w-1/6 w:1/3 ${mapMode === 'vcross_bioclass' ? 'bottom-1' : 'bottom-8' } p-2 left-2  border-white/20 bg-gray-900/55 rounded-sm`}>

                <small className='text-white tracking-wide'>Time: {data?.info.time}</small>

            </div>

    </SectionCard>
  )
}

export default Vcrossmap;
