import {lazy, Suspense} from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedTime } from './slice/livemapSlice';
import { changeAltitude } from './slice/altitudeSlice';
import { usePreloadClassificationFrames } from './hooks/usePreload/usePreloadClassificationFrames';
import { useClassificationDataQuery } from './hooks/useQuery/useClassificationDataQuery';
import { useQueryClient } from '@tanstack/react-query';
import loader from '../../assets/loader.webp';
import { useBoundariesQuery } from '../../shared/hooks/useBoundaries/useBoundariesQuery';
import { Unplug } from 'lucide-react';
import type { ClassificationDataResponse } from '../../api/endpoints/spatial/classificationAPI';
import type { SpatialDataResponse } from '../../api/endpoints/spatial/spatialDataAPI';



const MapbasePopup = lazy(() => import('./components/MapbasePopup'));
const ClassificationPopup = lazy(() => import('./components/ClassificationPopup'));
const LeafletMap = lazy(() => import('../../shared/components/map/LeafletMap'));
const SectionCard = lazy(() => import('../../shared/components/cards/SectionCard'));
const GlassHeader = lazy(() => import('../../shared/components/cards/GlassHeader'));
const TimelineSlider = lazy(() => import('./components/TimelineSlider'));
const AltitudeSlider = lazy(() => import('./components/AltitudeSlider'));


const LiveMap = () => {

    // Redux states
    const { selectedMapTime, mapTimeRange, classificationPayload } = useAppSelector(state => state.livemap);
    // Coverage
    const { selectedBoundary, selectedBoundaryType } = useAppSelector(state => state.boundary);
    const { selectedMapBase } = useAppSelector(state => state.basemappopup);
    const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.altitude);
    const dispatch = useAppDispatch()


    // Fetch Map Boundary
    const payload = {
        type: selectedBoundary.id as string,
        json: selectedBoundaryType.id as string
    }
    const { data: coverageJson, error: coverageError , isLoading: coverageLoading} = useBoundariesQuery(
        payload, 
        Boolean(selectedBoundary.id && selectedBoundaryType.id)
    );



    // ALtitude
    const currentHeight = altitudeOptions[currentAltitudeIndex];
    const handleAltitudeChange = (altitudeIndex: number) => {
        dispatch(changeAltitude(altitudeIndex))
    }

    // Timeline
    // to be replaced by actual time
    const currentIndex = Math.max(0, mapTimeRange.indexOf(selectedMapTime));
    const handleFrameChange = (newIndex: number) => {
        const newTime = mapTimeRange[newIndex];
        dispatch(setSelectedTime(newTime));
    };




    // Prefetch classification frames (only if we are in this page)
    const { isPreloading, progress } = usePreloadClassificationFrames(
        mapTimeRange,
        classificationPayload.class,
        classificationPayload.color_0,
        classificationPayload.color_1,
        currentHeight,
    )

    const { data: classifData, error } = useClassificationDataQuery({
        class: classificationPayload.class,
        time: selectedMapTime,
        color_0: classificationPayload.color_0,
        color_1: classificationPayload.color_1,
        height: currentHeight,
    })

    const queryKey = [
        "classification_data", 
        selectedMapTime, 
        classificationPayload.class, 
        classificationPayload.color_0, 
        classificationPayload.color_1,
        currentHeight,
    ]

    // Check if already cached
    const queryClient = useQueryClient();
    const cachedFrame = queryClient.getQueryData<SpatialDataResponse>(queryKey);
    
    const data = cachedFrame ?? classifData;



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
            (isPreloading) && (
                <div className="absolute z-10 w-full h-full flex flex-col items-center justify-center">
                    <img src={loader} alt="loading-data" width={35} height={35}  />
                    <p className='text-gray-700'>{`Loading animation ${progress}%...`}</p>
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
        <GlassHeader className='z-20 p-1 flex justify-between items-center'>

            <h1 className='text-white tracking-wider text-xs'>{data?.info.name}</h1>

            {/* Overlay controller */}
            <div className="z-5 flex gap-2 justify-center items-end">
                <Suspense>
                    <ClassificationPopup />
                </Suspense>
                <Suspense>
                    <MapbasePopup />
                </Suspense>

            </div>


        </GlassHeader>


        {/* Map Leaflet */}
        <Suspense>
            <LeafletMap
                className='relative z-4 w-full h-full rounded-sm'            
                baseMap={selectedMapBase.url as string}
                drawable={false}
                enableLineDraw={false}
                center={[-2.158, 30.1131097]}
                zoom={8}
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
        </Suspense>

        {/* Altitude slider */}

        <div className="lg:h-full h-[80%] absolute lg:bottom-3 bottom-[6vh] right-2 flex lg:items-center items-start lg:py-12 ">
                <AltitudeSlider
                    currentIndex={currentAltitudeIndex}
                    onChangeAltitude={handleAltitudeChange}
                    altitudes={altitudeOptions}
                />
        </div>

        {/* Timeline */}

        <TimelineSlider 
            frames={mapTimeRange}
            currentIndex={currentIndex}
            onFrameChange={handleFrameChange}
            preloadingFrames = {isPreloading}
        />


        {/* Classification legends */}

            <div className="absolute lg:flex lg:flex-col lg:gap-0.5 z-10 lg:w-1/10 h-10  right-4 lg:bottom-4 bottom-1">
                    
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


      
    </SectionCard>
  )
}

export default LiveMap;
