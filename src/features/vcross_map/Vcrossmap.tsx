import SectionCard from '../../shared/components/cards/SectionCard'
import GlassHeader from '../../shared/components/cards/GlassHeader'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import LeafletMap from '../../shared/components/map/LeafletMap'
import VcrossBioClsDataPopup from './components/VcrossBioClsDataPopup'
import VcrossRadarDataPopup from './components/VcrossRadarDataPopup'
import { setOverlayClassificationPayload, setOverlayRadarPayload, setVcrossBioClassPayload, setVcrossCoordinates, setVcrossRadarPayload } from './slice/vcrossMapSlice'
import type { SelectOption } from '../../shared/components/selects/types'
import MapbasePopup from '../livemap/components/MapbasePopup'
import { useEffect, useRef } from 'react'
import { useVcrossClassificationOverlayData } from './useData/useVcrossClassificationOverlayData'
import DataLoading from '../../shared/components/loader/DataLoading'
import FetchError from '../../shared/components/loader/FetchError'
import { useVcrossRadarOverlayData } from './useData/useVcrossRadarOverlayData'
import type { ClassificationDataResponse } from '../../api/endpoints/classificationAPI'
import type { SpatialDataResponse } from '../../api/endpoints/spatialDataAPI'

const Vcrossmap = () => {

    const { selectedMapBase } = useAppSelector(state => state.basemappopup);
    const { mapMode } = useAppSelector(state => state.vcrossmap)
    const dispatch = useAppDispatch();

    const mapModeRef = useRef(mapMode);

    useEffect(() => {
        mapModeRef.current = mapMode;
    }, [mapMode]);

    //#region Overlay FETCHING
    // Fetching overlay for the map
    const isRadar = mapMode === 'vcross_radar';
    const isBioclass = mapMode === 'vcross_bioclass';

    const { data: classifOvrlay, isLoading: classifOvrlayLoading, error: classiOvrlayError } = useVcrossClassificationOverlayData(isBioclass);
    const { data: radarOverlay, isLoading: radarOverlayLoading, error:  radarOvrlayError} = useVcrossRadarOverlayData(isRadar);

    let data: ClassificationDataResponse | SpatialDataResponse | null = null;
    let isLoading = false;
    let error: unknown = null;

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
    }

    //#endregion

    //#region HANDLERS 
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


    // Bioclass 
    const handleChangeVcrossBioclassTime = (time: string) => {
        dispatch(setVcrossBioClassPayload({
            time
        }))
        dispatch(setOverlayClassificationPayload({
            time
        }))
    }
    const handleChangeVcrossBioclass = (option: SelectOption) => {
        dispatch(setVcrossBioClassPayload({
            class: option.id as string
        }))
        dispatch(setOverlayClassificationPayload({
            class: option.id as string
        }))
    }

    // Radar
    const handleChangeVcrossRadarType = (type: SelectOption) => {
        dispatch(setVcrossRadarPayload({
            type: type.id as string
        }))
        dispatch(setOverlayRadarPayload({
            type: type.id as 'polar' | 'grid'
        }))
    }
    const handleChangeVcrossRadarParam = (param: SelectOption) => {
        dispatch(setVcrossRadarPayload({
            parameter: param.id as string
        }))
        dispatch(setOverlayRadarPayload({
            parameter: param.id as string
        }))
    }
    const handleChangeVcrossRadarTime = (time: string) => {
        dispatch(setVcrossRadarPayload({
            time: time
        }))
        dispatch(setOverlayRadarPayload({
            time: time
        }))
    }
//#endregion

    if (isLoading) return (
        <div className="relative w-full h-full col-span-6">
            <DataLoading>
                <MapbasePopup/>
            </DataLoading>
        </div>
    )

    if (error) return (
        <SectionCard className="relative w-full h-full col-span-6">
            <FetchError>
                <MapbasePopup/>
            </FetchError>   
        </SectionCard>
    )


  return (
    <SectionCard className='w-full h-full'>
      
            {/* Header: Options */}
            <GlassHeader
              className='z-20 p-1 flex justify-between items-center'
            >

                <h3 className='text-white tracking-wider text-sm'>{data?.info.name} {data?.info.time}</h3>

                {/* Data popover Options */}
                <div className="z-5 flex gap-3 justify-center items-end">
                    <MapbasePopup/>

                    <VcrossRadarDataPopup onChangeVcrossRadarType={handleChangeVcrossRadarType} onChangeVcrossRadarParam={handleChangeVcrossRadarParam} onChangeVcrossRadarTime={handleChangeVcrossRadarTime}/>
                    <VcrossBioClsDataPopup onChangeBioclass={handleChangeVcrossBioclass} onChangeBioclassTime={handleChangeVcrossBioclassTime}/>
                </div>

            </GlassHeader>


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
                // overlayShapes={[selectedCoverage.geometry as GeoJSON.Feature]}
            />

    </SectionCard>
  )
}

export default Vcrossmap
