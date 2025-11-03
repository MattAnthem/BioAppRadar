import SectionCard from '../../shared/components/cards/SectionCard';
import GlassHeader from '../../shared/components/cards/GlassHeader';
import Colorbar from './components/Colorbar';
import TimelineSlider from './components/TimelineSlider';
import LeafletMap from '../../shared/components/map/LeafletMap';
import VaribalePopup from './components/VaribalePopup';
import MapbasePopup from './components/MapbasePopup';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changeAltitude } from './slice/altitudeSlice';
import DataLoading from '../../shared/components/loader/DataLoading';
import FetchError from '../../shared/components/loader/FetchError';
import { usePreloadSevipFrames } from './hooks/useQuery/usePreloadSevipFrames';
import { useSevipDataQuery } from './hooks/useQuery/useSevipQuery';
import { useQueryClient } from '@tanstack/react-query';
import type { SpatialDataResponse } from '../../api/endpoints/spatialDataAPI';
import { setCrossSectionPayload, setSelectedTime, setSevipPayload } from './slice/livemapSlice';
import AltitudeSlider from './components/AltitudeSlider';

type LiveMapProps = {
    drawable: boolean;
    enableLineDraw: boolean;
    displayTimeline: boolean;
    displayControls?: boolean;
}


/**
 * Interactive Live Map Feature 
 * @param drawable allow polygon drawing on the map and retrieve a GeoJSON
 * @returns React.JSX.Element
 */
const LiveMap = ({ drawable, enableLineDraw, displayTimeline, displayControls }: LiveMapProps) => {

    // Redux
    const { selectedCoverage, mapTimeRange, selectedMapTime } = useAppSelector(state => state.livemap);
    const { selectedMapBase, selectedMapOption, selectedSubOption, selectedColormap } = useAppSelector(state => state.mappopups);
    const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.altitude);
    const dispatch = useAppDispatch();
    const currentIndex = Math.max(0, mapTimeRange.indexOf(selectedMapTime));
    const queryClient = useQueryClient();


    // Tanstack fetch query
    usePreloadSevipFrames(mapTimeRange, selectedSubOption.id as string, selectedColormap.id as string);


    const { data, isLoading, error } = useSevipDataQuery({
      parameter: selectedSubOption.id as string,
      colorbar: selectedColormap.id as string,
      time: selectedMapTime
    })

    // Query the cached sevip data from IDB by its key 'sevip_data'
    const key = ["sevip_data", selectedSubOption.id, selectedColormap.id, selectedMapTime];
    const cached = queryClient.getQueryData<SpatialDataResponse>(key);
    const currentData = data ?? cached;


    const handleFrameChange = (newIndex: number) => {
        const newTime = mapTimeRange[newIndex];
        dispatch(setSelectedTime(newTime));
    };
    
    //#region  Transect payload

    const handleLineCreated = (start: L.LatLng, end: L.LatLng) => {
        dispatch(setCrossSectionPayload({
            startLat: start.lat,
            endLat: end.lat,
            startLon: start.lng,
            endLon: end.lng
        }))
    }
    //#endregion


    //#region Api call
    // handle parameters changes
    const handleSelectedVars = () => {
        dispatch(setSevipPayload({parameter: selectedSubOption.id as string}))
    }

    const handleAltitudeChange = (altitudeIndex: number) => {
        dispatch(changeAltitude(altitudeIndex))
    }
    //#endregion


    if (isLoading && !cached) return (
        <div className="relative w-full h-full col-span-6">
            <DataLoading>
                <MapbasePopup/>
                <VaribalePopup  onChangeMapVariable={handleSelectedVars}/> 
            </DataLoading>
        </div>
    )

    if (error) return (
        <SectionCard className="relative w-full h-full col-span-6">
            <FetchError>
                <MapbasePopup/>
                <VaribalePopup onChangeMapVariable={handleSelectedVars}/> 
            </FetchError>   
        </SectionCard>
    )



  return (
    <SectionCard className='relative w-full h-full p-1 col-span-6'>

        {/* Heading */}
        <GlassHeader className='p-1 flex justify-between items-center'>
        
            <h3 className='text-white tracking-wider text-sm'>{selectedSubOption.displayText}</h3>

            {/* Overlay controller */}
            <div className="z-5 flex gap-3 justify-center items-end">

                <MapbasePopup/>
                {/* Change variable */}
                {
                    displayControls && (
                        <VaribalePopup onChangeMapVariable={handleSelectedVars}/> 
                    )
                }

            </div>

        </GlassHeader>

        {/* Altitude slider */}
        {
            (selectedMapOption.id !== "vertical") && (
                <div className="h-full absolute bottom-2 right-0 flex lg:items-center items-start">
                    <AltitudeSlider
                         position='right'
                        currentIndex={currentAltitudeIndex}
                        onChangeAltitude={handleAltitudeChange}
                        altitudes={altitudeOptions}
                    />
                </div>
            )
        }


        {/* Colorbar */}
        <Colorbar
            colorCodes={data?.ckeys?.colors ?? []}
            valueScale={data?.ckeys?.labels.map(Number)  ?? []}
            className='absolute bottom-0 left-0 z-10'
        />

        {/* Timeline   */}
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

        {/* Map Leaflet */}
        <LeafletMap
            className='relative z-4 w-full h-full rounded-sm'            
            baseMap={selectedMapBase.url as string}
            drawable={drawable}
            enableLineDraw={enableLineDraw}
            onDrawLine={handleLineCreated}
            center={[-2.158, 30.1131097]}
            zoom={8}
            overlayImg={
                {
                    url: currentData?.data?.png ?? '',
                    bounds: currentData?.data?.bounds as L.LatLngBoundsExpression ?? undefined,
                }
            }
            overlayShapes={[selectedCoverage.geometry as GeoJSON.Feature]}
        />
    
    </SectionCard>
  )
}

export default LiveMap;