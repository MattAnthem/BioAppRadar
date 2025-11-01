import SectionCard from '../../shared/components/cards/SectionCard';
import GlassHeader from '../../shared/components/cards/GlassHeader';
import AltitudeSlider from '../../shared/features/altitude-slider/AltitudeSlider';
import Colorbar from '../../shared/components/colorbar/Colorbar';
import TimelineSlider from '../../shared/components/sliders/TimelineSlider';
import LeafletMap from '../../shared/components/map/LeafletMap';
import VaribalePopup from '../../shared/features/map-option-popups/VaribalePopup';
import MapbasePopup from '../../shared/features/map-option-popups/MapbasePopup';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCrossSectionPayload, setSelectedTime, setSevipPayload } from './livemapSlice';
import { changeAltitude } from '../../shared/features/altitude-slider/altitudeSlice';
import { useSevipData } from './hooks/useData/useSevipData';
import DataLoading from '../../shared/components/loader/DataLoading';
import FetchError from '../../shared/components/loader/FetchError';

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
    const { selectedMapBase, selectedMapOption, selectedSubOption } = useAppSelector(state => state.mappopups);
    const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.altitude);
    const dispatch = useAppDispatch();
    const currentIndex = Math.max(0, mapTimeRange.indexOf(selectedMapTime));

    // Tanstack fetch query
    const  { error, isLoading, data } = useSevipData();


    const handleFrameChange = (newIndex: number) => {
        const newTime = mapTimeRange[newIndex];
        dispatch(setSelectedTime(newTime));
    };
    
    //#region  Transect payload

    const handleLineCreated = (start: L.LatLng, end: L.LatLng) => {
        console.log('start :', start, 'end:', end)
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


    if (isLoading) return (
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
            colorCodes={data?.ckeys.colors ?? []}
            valueScale={data?.ckeys.labels.map(Number)  ?? []}
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
                    url: data?.data?.png ?? '',
                    bounds: data?.data?.bounds as L.LatLngBoundsExpression,
                }
            }
            overlayShapes={[selectedCoverage.geometry as GeoJSON.Feature]}
        />
    
    </SectionCard>
  )
}

export default LiveMap;