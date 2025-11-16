import GlassHeader from '../../shared/components/cards/GlassHeader';
import SectionCard from '../../shared/components/cards/SectionCard';
import LeafletMap from '../../shared/components/map/LeafletMap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useClassifData } from './hooks/useData/useClassifData';
import { useRadarData } from './hooks/useData/useRadarData';
import { useSevipData } from './hooks/useData/useSevipData';
import { changeHistAltitude } from './slice/histAltitudeSlice';
import { setAltitudeForAll, setColorbarForAll, setRadarPayloadHist } from './slice/historyMapSlice';
import loader from '../../assets/loader.webp';
import { useElevationsQuery } from '../../shared/hooks/useQuery/useElevationsQuery';
import React,{ Suspense, useEffect, useMemo, useState } from 'react';
import { Unplug } from 'lucide-react';
import { useBoundariesQuery } from '../../shared/hooks/useBoundaries/useBoundariesQuery';
import type { ClassificationDataResponse } from '../../api/endpoints/spatial/classificationAPI';
import type { SpatialDataResponse } from '../../api/endpoints/spatial/spatialDataAPI';
import { useSevipGifData } from './hooks/useData/useSevipGifData';
import { useRadarGifData } from './hooks/useData/useRadarGifData';

const ClassificationPopup = React.lazy(() => import('./components/ClassificationPopupHist'));
const MapbasePopup = React.lazy(() => import('./components/MapbasePopup'));
const RadarOptionPopup =React.lazy(() => import('./components/RadarOptionPopup'));
const SevipPopup = React.lazy(() => import('./components/SevipPopup'));
const AltitudeSlider = React.lazy(() => import('../livemap/components/AltitudeSlider'));
const Colorbar = React.lazy(() => import('../livemap/components/Colorbar'));
const ElevationSlider = React.lazy(() => import('./components/ElevationSlider'));


const HistoryMap = () => {
    const [currentElevationIndex, setCurrentElevationIndex] = useState<number>(0);

    // Redux call
    // Selected Radar type and Radar Parameter
    const { selectedMapBase, selectedBoundary, selectedBoundaryType } = useAppSelector(state => state.hist_basemap);
    const { altitudeOptions, currentAltitudeIndex } = useAppSelector(state => state.hist_altitude);
    const dispatch = useAppDispatch();
    const { mapModeHist, radarPayloadHist, radarGifPayloadHist } = useAppSelector(state => state.historymap);


    // Map boundary GeoJson
    const { data: coverageJson, error: coverageError , isLoading: coverageLoading} = useBoundariesQuery({
            type: selectedBoundary.id as string,
            json: selectedBoundaryType.id as string
    })

    
    //#region  Overlay fetching
    const isRadar = mapModeHist === 'radar';
    const isSevip = mapModeHist === 'sevip';
    const isClassif = mapModeHist === 'classification';
    const isSevipGif = mapModeHist === 'sevip_gif';
    const isRadarGif = mapModeHist === 'radar_gif';
     
    // Still images
    const { data: radarData, isLoading: radarDataLoading, error: radarError } = useRadarData(isRadar);
    const { data: sevipData, isLoading: sevipDataLoading, error: sevipError } = useSevipData(isSevip);
    const { data: classifData, isLoading: classifDataLoading, error: classifError } = useClassifData(isClassif);

    // Gif animated
    const { data: sevipGifData, isLoading: sevipGifLoading, error: sevipGifError } = useSevipGifData(isSevipGif);
    const { data: radarGifData, isLoading: radarGifLoading, error: radarGifError } = useRadarGifData(isRadarGif);
    
    let data: ClassificationDataResponse | SpatialDataResponse | null = null;
    let isLoading = false;
    let error = null;
    
    switch (true) {
        case isRadar: 
            data = radarData as SpatialDataResponse
            isLoading = radarDataLoading;
            error = radarError;
            break;
        case isSevip:
            data = sevipData as SpatialDataResponse;
            isLoading = sevipDataLoading;
            error = sevipError;
            break;
        case isClassif:
            data = classifData as ClassificationDataResponse;
            isLoading = classifDataLoading;
            error = classifError;
            break;
        case isSevipGif: 
            data = sevipGifData as SpatialDataResponse;
            isLoading = sevipGifLoading;
            error = sevipGifError;
            break;
        case isRadarGif:
            data = radarGifData as SpatialDataResponse;
            isLoading = radarGifLoading;
            error = radarGifError;
            break;
    }
    
    //#endregion
            
    //#region Fetch default elevations for polar radar mode
    const { data: defaultElevations } = useElevationsQuery(isRadar && radarPayloadHist.type === 'polar');

    const elevations = useMemo(() => {
        if (!defaultElevations) return [];
        return [...defaultElevations].reverse();
    }, [defaultElevations]);

    useEffect(() => {
        if (elevations.length > 0) {
          setCurrentElevationIndex(elevations.length - 1); 
        }
    }, [elevations]);

    //#endregion
      
    
    //#region HANDLERS         
    // Change overlay colorbar (Sevip and radar)
    const handleChangeColorbar = (colorname: string) => {
        dispatch(setColorbarForAll(colorname));
    }

    // Altitude change for classification and radar grid
    const handleAltitudeChange = (altIndex: number) => {
        dispatch(changeHistAltitude(altIndex));
        dispatch(setAltitudeForAll(altitudeOptions[altIndex]));
    }

    // Elevation change for polar radar
    const handleElevationChange = (elevIndex: number) => {
        setCurrentElevationIndex(elevIndex);
        const selectedElevation = elevations[elevIndex];
        dispatch(setRadarPayloadHist({
            elevation_angle: selectedElevation
        }));
    }

    //#endregion




  return (
    <SectionCard className='relative w-full h-full'>

        
        {
            (error || coverageError) && (
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


        {/* Heading */}
        <GlassHeader className='z-20  p-1 flex justify-between items-center'>

            <h3 className='text-white tracking-wider text-xs'>{data?.info.name}</h3>

            <div className="z-5 flex gap-2 justify-center items-end">

                <Suspense>
                    <SevipPopup />
                </Suspense>
                <Suspense>
                    <RadarOptionPopup />
                </Suspense>

                <Suspense>
                    <ClassificationPopup />
                </Suspense>
                <Suspense>
                    <MapbasePopup onChangeOverlayColor={handleChangeColorbar} displayColorbarOption={!isClassif}/>
                </Suspense>
                
            </div>

        </GlassHeader>

        {/* Colorbar */}
        {
            (mapModeHist !== 'classification') && (
                <Colorbar
                    colorCodes={(data as SpatialDataResponse)?.ckeys?.colors ?? []}
                    valueScale={(data as SpatialDataResponse)?.ckeys?.labels.map(Number)  ?? []}
                    className='absolute bottom-0 left-0 z-10'
                />
            )
        }

        {/* altitude slider */}
        {
            (isClassif || (isRadar && radarPayloadHist.type === 'grid') || (isRadarGif && radarGifPayloadHist.type === 'grid')) && (
                <div className="lg:h-full  h-[70%] absolute lg:bottom-2 bottom-[12vh] right-2 flex lg:items-center items-start lg:py-16 ">
                    <AltitudeSlider
                        position='right'
                        currentIndex={currentAltitudeIndex}
                        onChangeAltitude={handleAltitudeChange}
                        altitudes={altitudeOptions}
                    />
                </div>
            )
        }

        {/* Elevation angles */}
        <div className="h-full absolute right-2 bottom-0 flex items-end justify-center py-10">
            {
                (mapModeHist === 'radar' && radarPayloadHist.type === 'polar') && (
                    <ElevationSlider
                        currentIdx={currentElevationIndex}
                        elevations={elevations}
                        handleChange={handleElevationChange}
                    />
                )
            } 
        </div>


        {/* Map Time */}
        {
            (mapModeHist === 'sevip_gif' || mapModeHist === 'radar_gif') ? (
                <div className={`absolute  text-xs flex flex-col justify-center gap-1.5 z-10 lg:w-2/7 w:1/3 ${isClassif ? 'bottom-1' : 'bottom-8' } p-2 left-2  border-white/20 bg-gray-900/55 rounded-sm`}>
                    <small className='text-white tracking-wide'>Time: {data?.info.time[0]} - {data?.info.time[data.info.time.length - 1]}</small>
                </div>
            ):
            (
                <div className={`absolute  text-xs flex flex-col justify-center gap-1.5 z-10 lg:w-1/6 w:1/3 ${isClassif ? 'bottom-1' : 'bottom-8' } p-2 left-2  border-white/20 bg-gray-900/55 rounded-sm`}>
                    <small className='text-white tracking-wide'>Time: {data?.info.time}</small>
                </div>
            )
        }

        {/* Map Leaflet */}
        <LeafletMap
            className='relative z-4 w-full h-full rounded-sm'            
            baseMap={selectedMapBase.url as string}
            drawable={false}
            enableLineDraw={false}
            center={[-2.158, 30.1131097]}
            zoom={8}
            overlayImg={
                {
                    url: (data?.data?.png || data?.data?.gif) ?? '',
                    bounds: data?.data?.bounds as L.LatLngBoundsExpression ?? [[0,0], [0, 0]],
                }
            }
            overlayShapes={coverageJson}
            onShapeClicked={(geojson) => {
                console.log('Clicked shape:', geojson);
            }}
        />


        {/* Classification legends */}
        {
            (mapModeHist === "classification") && (
                <div className=" absolute flex flex-col gap-0.5 z-10 lg:w-1/7 h-16 p-2 right-2 bottom-1 border-white/20 bg-gray-900/55 rounded-sm">
                    
                    {/* Color 0 */}
                    <div className="flex justify-start items-center gap-0.5 text-xs">
                        <div className='lg:w-4 lg:h-4 xl:w-4 xl:h-4 w-2 h-2  rounded-full border border-gray-400' style={{backgroundColor: (data as ClassificationDataResponse)?.legend?.class_0?.color}}/>
                        <small className='text-white tracking-wide'>{(data as ClassificationDataResponse)?.legend?.class_0?.name}</small>
                    </div>
                    {/* Color 1 */}
                    <div className="flex justify-start items-center gap-2 text-xs">
                        <div className='lg:w-4 lg:h-4 w-2 h-2  rounded-full border border-gray-400' style={{backgroundColor: (data as ClassificationDataResponse)?.legend?.class_1?.color}}/>
                        <small className='text-white tracking-wide'>{(data as ClassificationDataResponse)?.legend?.class_1?.name}</small>
                    </div>
                    <div className="lg:text-xs text-[10px]">
                        <small className='text-white tracking-wide'>Height: {data?.info.height}</small>
                    </div>

                </div>
            )
        }

      
    </SectionCard>
  )
}

export default HistoryMap;
