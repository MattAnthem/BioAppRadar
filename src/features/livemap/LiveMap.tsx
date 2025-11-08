import SectionCard from '../../shared/components/cards/SectionCard';
import GlassHeader from '../../shared/components/cards/GlassHeader';
import MapbasePopup from './components/MapbasePopup';
import ClassificationPopup from './components/ClassificationPopup';
import LeafletMap from '../../shared/components/map/LeafletMap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setClassificationPayload, setSelectedTime } from './slice/livemapSlice';
import type { SelectOption } from '../../shared/components/selects/types';
import DataLoading from '../../shared/components/loader/DataLoading';
import FetchError from '../../shared/components/loader/FetchError';
import TimelineSlider from './components/TimelineSlider';
import AltitudeSlider from './components/AltitudeSlider';
import { changeAltitude } from './slice/altitudeSlice';
import type { ClassificationDataResponse } from '../../api/endpoints/classificationAPI';
import { usePreloadClassificationFrames } from './hooks/usePreload/usePreloadClassificationFrames';
import { useClassificationDataQuery } from './hooks/useQuery/useClassificationDataQuery';
import { useQueryClient } from '@tanstack/react-query';
import type { SpatialDataResponse } from '../../api/endpoints/spatialDataAPI';

type LiveMapProps = {
    drawable: boolean;
    enableLineDraw: boolean;
}


const LiveMap = ({ drawable, enableLineDraw }: LiveMapProps) => {

    // Redux states
    const { selectedMapTime, mapTimeRange, displayedData, classificationPayload, radarPayload } = useAppSelector(state => state.livemap);
    const { selectedMapBase } = useAppSelector(state => state.basemappopup);
    const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.altitude);
    const dispatch = useAppDispatch()


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
    // Classification
    const handleClassificationVarsChange = (variable: SelectOption) => {
        dispatch(setClassificationPayload({
            class: variable.id as string
        }))
    }
    const handleClassificationColor0Change = (color: string) => {
        dispatch(setClassificationPayload({
            color_0: color
        }))
    }
    const handleClassificationColor1Change = (color: string) => {
        dispatch(setClassificationPayload({
            color_1: color
        }))
    }
    //#endregion


    // Prefetch classification frames
    const { isPreloading, progress } = usePreloadClassificationFrames(
        mapTimeRange,
        classificationPayload.class,
        classificationPayload.color_0,
        classificationPayload.color_1,
        currentHeight,
        {enabled: true}
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
    
    const data = cachedFrame ?? classifData




    if (isPreloading) return (
        <div className="relative w-full h-full col-span-6">
            <DataLoading
                message={`Loading animation ${progress}%...`}
            >
                <MapbasePopup/>
                <ClassificationPopup onChangeClassifVariable={handleClassificationVarsChange} onChangeClassifColorOne={handleClassificationColor1Change} onChangeClassifColorZero={handleClassificationColor0Change}/>
            </DataLoading>
        </div>
    )

    if (error) return (
        <SectionCard className="relative w-full h-full col-span-6">
            <FetchError>
                <MapbasePopup/>
                <ClassificationPopup onChangeClassifVariable={handleClassificationVarsChange} onChangeClassifColorOne={handleClassificationColor1Change} onChangeClassifColorZero={handleClassificationColor0Change}/>
            </FetchError>   
        </SectionCard>
    )


  return (
    <SectionCard className='relative w-full h-full p-1 col-span-6'>

        {/* Heading */}
        <GlassHeader className='z-20 p-1 flex justify-between items-center'>

            <h3 className='text-white tracking-wider text-sm'>{data?.info.name}</h3>

            {/* Overlay controller */}
            <div className="z-5 flex gap-3 justify-center items-end">

                <MapbasePopup displayColorbarOption={false}/>
                <ClassificationPopup 
                    color0Legend={(data as ClassificationDataResponse)?.legend?.class_0?.name} 
                    color1Legend={(data as ClassificationDataResponse)?.legend?.class_1?.name} 
                    onChangeClassifVariable={handleClassificationVarsChange} 
                    onChangeClassifColorOne={handleClassificationColor1Change} 
                    onChangeClassifColorZero={handleClassificationColor0Change}
                />

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
            // overlayShapes={[selectedCoverage.geometry as GeoJSON.Feature]}
        />

        {/* Altitude slider */}
        {
            (displayedData === "classification" || radarPayload.type === 'grid') && (
                <div className="h-full absolute bottom-3 right-2 flex lg:items-center items-start">
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
            animSpeed={900}
            currentIndex={currentIndex}
            onFrameChange={handleFrameChange}
        />


        {/* Classification legends */}
        {
            (displayedData === "classification") && (
                <div className="absolute flex flex-col gap-1.5 z-10 w-1/5 h-20 py-2 right-2 bottom-1">
                    
                    {/* Color 0 */}
                    <div className="flex gap-2">
                        <div className='w-8 h-4 rounded-sm border border-gray-400' style={{backgroundColor: (data as ClassificationDataResponse)?.legend?.class_0?.color}}/>
                        <small className='text-white tracking-widest'>{(data as ClassificationDataResponse)?.legend?.class_0?.name}</small>
                    </div>
                    {/* Color 1 */}
                    <div className="flex gap-2">
                        <div className='w-8 h-4 rounded-sm border border-gray-400' style={{backgroundColor: (data as ClassificationDataResponse)?.legend?.class_1?.color}}/>
                        <small className='text-white tracking-widest'>{(data as ClassificationDataResponse)?.legend?.class_1?.name}</small>
                    </div>

                    <small className='text-white tracking-wide'>Height: {data?.info.height}</small>

                </div>
            )
        }

      
    </SectionCard>
  )
}

export default LiveMap;
