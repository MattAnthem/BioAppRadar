import SectionCard from '../../shared/components/cards/SectionCard';
import GlassHeader from '../../shared/components/cards/GlassHeader';
import MapbasePopup from './components/MapbasePopup';
import ClassificationPopup from './components/ClassificationPopup';
import LeafletMap from '../../shared/components/map/LeafletMap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setClassificationPayload, setSelectedTime } from './slice/livemapSlice';
import TimelineSlider from './components/TimelineSlider';
import AltitudeSlider from './components/AltitudeSlider';
import { changeAltitude } from './slice/altitudeSlice';
import type { ClassificationDataResponse } from '../../api/endpoints/classificationAPI';
import { usePreloadClassificationFrames } from './hooks/usePreload/usePreloadClassificationFrames';
import { useClassificationDataQuery } from './hooks/useQuery/useClassificationDataQuery';
import { useQueryClient } from '@tanstack/react-query';
import type { SpatialDataResponse } from '../../api/endpoints/spatialDataAPI';
import loader from '../../assets/loader.webp';
import { useBoundariesQuery } from '../../shared/hooks/useBoundaries/useBoundariesQuery';
import { Unplug } from 'lucide-react';
import type { MenuNames } from '../../shared/components/buttons/navbtn/MenuTypes';

type LiveMapProps = {
    drawable: boolean;
    enableLineDraw: boolean;
}


const LiveMap = ({ drawable, enableLineDraw }: LiveMapProps) => {

    // Redux states
    const { selectedMapTime, mapTimeRange, displayedData, classificationPayload, radarPayload } = useAppSelector(state => state.livemap);
    // Coverage
    const { selectedBoundary, selectedBoundaryType } = useAppSelector(state => state.boundary);
    const { selectedMapBase } = useAppSelector(state => state.basemappopup);
    const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.altitude);
    const dispatch = useAppDispatch()


    // Fetch Map Boundary
    const { data: coverageJson, error: coverageError , isLoading: coverageLoading} = useBoundariesQuery({
        type: selectedBoundary.id as string,
        json: selectedBoundaryType.id as string
    })



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


    //#region Classification data handler 

    const { selectedVariable, color_0, color_1 } = useAppSelector(state=> state.classificationpopup);
    const handleSubmitPopupData = () => {
        dispatch(setClassificationPayload({
            class: selectedVariable.id as string,
            color_0,
            color_1,
        }))
    }

    //#endregion


    // Prefetch classification frames (only if we are in this page)
    const currentPath = location.pathname.replace('/', '') as MenuNames;
    const { isPreloading, progress } = usePreloadClassificationFrames(
        mapTimeRange,
        classificationPayload.class,
        classificationPayload.color_0,
        classificationPayload.color_1,
        currentHeight,
        {enabled: currentPath === ''}
    )

    const { data: classifData, error } = useClassificationDataQuery({
        class: classificationPayload.class,
        time: selectedMapTime,
        color_0: classificationPayload.color_0,
        color_1: classificationPayload.color_1,
        height: currentHeight,
    }, true)

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
    <SectionCard className='relative w-full h-full p-0.5'>

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

            <h3 className='text-white tracking-wider text-xs'>{data?.info.name}</h3>

            {/* Overlay controller */}
            <div className="z-5 flex gap-2 justify-center items-end">

                <ClassificationPopup 
                    onSubmitPopup={handleSubmitPopupData}
                />
                <MapbasePopup displayColorbarOption={false}/>

            </div>


        </GlassHeader>


        {/* Map Leaflet */}
        <LeafletMap
            className='relative z-4 w-full h-full rounded-sm'            
            baseMap={selectedMapBase.url as string}
            drawable={drawable}
            enableLineDraw={enableLineDraw}
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

        {/* Altitude slider */}
        {
            (displayedData === "classification" || radarPayload.type === 'grid') && (
                <div className="lg:h-full h-[70%] absolute lg:bottom-0 bottom-[12vh] right-2 flex lg:items-center items-start lg:py-16 ">
                    <AltitudeSlider
                        position='right'
                        currentIndex={currentAltitudeIndex}
                        onChangeAltitude={handleAltitudeChange}
                        altitudes={altitudeOptions}
                    />
                </div>
            )
        }
        {/* Timeline */}

        <TimelineSlider 
            frames={mapTimeRange}
            currentIndex={currentIndex}
            onFrameChange={handleFrameChange}
            preloadingFrames = {isPreloading}
        />


        {/* Classification legends */}
        {
            (displayedData === "classification") && (
                <div className="absolute lg:flex lg:flex-col lg:gap-0.5 z-10 lg:w-1/12 h-10  right-4 lg:bottom-4 bottom-1">
                    
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

export default LiveMap;
