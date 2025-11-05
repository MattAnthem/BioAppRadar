import SectionCard from '../../shared/components/cards/SectionCard';
import GlassHeader from '../../shared/components/cards/GlassHeader';
import MapbasePopup from './components/MapbasePopup';
import RadarPopup from './components/RadarPopup';
import SevipPopup from './components/SevipPopup';
import ClassificationPopup from './components/ClassificationPopup';
import LeafletMap from '../../shared/components/map/LeafletMap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setClassificationPayload, setRadarPayload, setSelectedTime, setSevipPayload } from './slice/livemapSlice';
import type { SelectOption } from '../../shared/components/selects/types';
import { usePrefetchAnimationData } from './hooks/prefetchLive/prefetchAnimationData';
import DataLoading from '../../shared/components/loader/DataLoading';
import FetchError from '../../shared/components/loader/FetchError';
import TimelineSlider from './components/TimelineSlider';
import Colorbar from './components/Colorbar';
import AltitudeSlider from './components/AltitudeSlider';
import { changeAltitude } from './slice/altitudeSlice';

type LiveMapProps = {
    drawable: boolean;
    enableLineDraw: boolean;
    displayTimeline: boolean;
}


const LiveMap = ({ displayTimeline, drawable, enableLineDraw, }: LiveMapProps) => {

    // Redux states
    const { selectedCoverage, selectedMapTime, mapTimeRange, displayedData, classificationPayload, sevipPayload, radarPayload } = useAppSelector(state => state.livemap);
    const { selectedMapBase, selectedColormap } = useAppSelector(state => state.basemappopup);
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

    // Radar
    const handleRadarTypeChange = (option: SelectOption) => {
        dispatch(
          setRadarPayload({
            type: option.id as "polar" | "grid",
            colorbar: selectedColormap.id as string,
          })
        );
      };
      
      const handleRadarParameterChange = (option: SelectOption) => {
        dispatch(
          setRadarPayload({
            parameter: option.id as string,
            colorbar: selectedColormap.id as string,
          })
        );
      };


    // Sevip
    const handleSevipVarChange = (option: SelectOption) => {
        dispatch(setSevipPayload({
            parameter: option.id as string
        }))
    }


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



    const { data, isLoading, error } = usePrefetchAnimationData({
        currentTime: selectedMapTime,
        displayedData,
        timeRange: mapTimeRange, 
        classifPayload: classificationPayload,
        sevipPayload,
        radarPayload,
        colormap: selectedColormap.id as string,
        altitude: currentHeight,
    })


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
    <SectionCard className='relative w-full h-full p-1 col-span-6'>

        {/* Heading */}
        <GlassHeader className='p-1 flex justify-between items-center'>

            <h3 className='text-white tracking-wider text-sm'>{data?.info.name}</h3>

            {/* Overlay controller */}
            <div className="z-5 flex gap-3 justify-center items-end">

                <MapbasePopup/>

                <RadarPopup onChangeRadarType={handleRadarTypeChange} onChangeRadarParameter={handleRadarParameterChange} />

                <SevipPopup onSevipVariableChange={handleSevipVarChange}/>

                <ClassificationPopup onChangeClassifVariable={handleClassificationVarsChange} onChangeClassifColorOne={handleClassificationColor1Change} onChangeClassifColorZero={handleClassificationColor0Change}/>

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
                <div className="h-full absolute bottom-2 right-2 flex lg:items-center items-start">
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
        {
            displayTimeline && (
                <TimelineSlider 
                    frames={mapTimeRange}
                    animSpeed={900}
                    currentIndex={currentIndex}
                    onFrameChange={handleFrameChange}
                />
            )
        }

        {/* Colorbar */}
        {
            (displayedData !== 'classification') && (
                <Colorbar
                    colorCodes={data?.ckeys?.colors ?? []}
                    valueScale={data?.ckeys?.labels.map(Number)  ?? []}
                    className='absolute bottom-0 left-0 z-10'
                />
            )
        }

        {/* Classification legends */}
        {
            (displayedData === "classification") && (
                <div className="absolute flex flex-col gap-1.5 z-10 w-1/5 h-20 py-2 right-2 bottom-1">
                    
                    {/* Color 0 */}
                    <div className="flex gap-2">
                        <div className='w-8 h-4 rounded-sm border border-gray-400' style={{backgroundColor: data?.legend?.class_0?.color}}/>
                        <small className='text-white tracking-widest'>{data?.legend?.class_0?.name}</small>
                    </div>
                    {/* Color 1 */}
                    <div className="flex gap-2">
                        <div className='w-8 h-4 rounded-sm border border-gray-400' style={{backgroundColor: data?.legend?.class_1?.color}}/>
                        <small className='text-white tracking-widest'>{data?.legend?.class_1?.name}</small>
                    </div>

                    <small className='text-white tracking-wide'>Height: {data?.info.height}</small>

                </div>
            )
        }

      
    </SectionCard>
  )
}

export default LiveMap;
