import { useState } from 'react';
import activeRadar from '../../assets/radar_on.png';
import { spatialData } from './livemapAPI';
import SectionCard from '../../shared/components/cards/SectionCard';
import GlassHeader from '../../shared/components/cards/GlassHeader';
import AltitudeSlider from '../../shared/features/altitude-slider/AltitudeSlider';
import Colorbar from '../../shared/components/colorbar/Colorbar';
import TimelineSlider from '../../shared/components/sliders/TimelineSlider';
import LeafletMap from '../../shared/components/map/LeafletMap';
import VaribalePopup from '../../shared/features/map-option-popups/VaribalePopup';
import MapbasePopup from '../../shared/features/map-option-popups/MapbasePopup';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useSpatialData } from './hooks/useSpatialData';
import type { SelectOption } from '../../shared/components/selects/types';
import { setSpatialPayload } from './livemapSlice';
import { changeAltitude } from '../../shared/features/altitude-slider/altitudeSlice';

type LiveMapProps = {
    drawable: boolean;
}

const valueScale = [
    0,
    10,
    20,
    30,
    40,
    50,
    60
]

/**
 * Interactive Live Map Feature 
 * @param drawable allow polygon drawing on the map and retrieve a GeoJSON
 * @returns React.JSX.Element
 */
const LiveMap = ({ drawable }: LiveMapProps) => {

    // Redux
    const { selectedCoverage } = useAppSelector(state => state.livemap);
    const { selectedMapBase, selectedColormap, selectedMapOption } = useAppSelector(state => state.mappopups);
    const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.altitude);
    const dispatch = useAppDispatch();


    const [currentFrame, setCurrentFrame] = useState(0);




    //#region  Transect payload
    // Todo tanstack Payload to fecth transect
    const handlePolygonCreated = (geojson: GeoJSON.Feature) => {
        console.log('SELECTED TRANSECT LINE', geojson)
    }

    const handlePolygonClick = (geojson: GeoJSON.Feature) => {
        console.log('SELECTED POLYGON AREA', geojson)
    }
    //#endregion


    //#region Api call
 
    const  { error, isLoading, data } = useSpatialData();



    // handle parameters changes
    const handleSelectedVars = (option: SelectOption) => {
        dispatch(setSpatialPayload({type: selectedMapOption.id as string, map: option.id as string}));
    }

    const handleAltitudeChange = (altitudeIndex: number) => {
        dispatch(setSpatialPayload({height: altitudeOptions[altitudeIndex]}));
        dispatch(changeAltitude(altitudeIndex))
    }

    
    //#endregion


    // if (isLoading) return <DataLoading/>

    // if (error) return <FetchError/>


  return (
    <SectionCard className='relative w-full h-full p-1'>

        {/* Heading */}
        <GlassHeader className='p-1 flex justify-between items-center'>
        
            <h3 className='text-white tracking-wider'>Live Map</h3>

            {/* Overlay controller */}
            <div className="z-5 flex gap-3 justify-center items-end">

                {/* Changer de variable */}
                <VaribalePopup onChangeMapVariable={handleSelectedVars}/> 

                
                <MapbasePopup/>

            </div>

        </GlassHeader>

        {/* Altitude slider */}
        <AltitudeSlider
            currentIndex={currentAltitudeIndex}
            onChangeAltitude={handleAltitudeChange}
            position='right'
            altitudes={altitudeOptions}
        />


        {/* Colorbar */}
        <Colorbar
            colorCodes={selectedColormap.colors as string[]}
            valueScale={valueScale}
            className='absolute bottom-0 left-0 z-10'
        />

        {/* Timeline + timestamp indication  */}
        <TimelineSlider 
            frames={spatialData.timestamps}
            animSpeed={900}
            currentIndex={currentFrame}
            onFrameChange={setCurrentFrame}
        />

        {/* Map Leaflet */}
        <LeafletMap
            baseMap={selectedMapBase.url as string}
            drawable={drawable}
            onDrawPolygon={handlePolygonCreated}
            center={[-2.158, 30.1131097]}
            zoom={8}
            className='relative z-4 w-full h-full rounded-sm'
            markers={
                [                
                    {
                        position: [-2.158, 30.1131097],
                        popup: 'Radar 001',
                        iconUrl: activeRadar
                    },
                ]
            }
            
            // overlayImg={
            //     {
            //         url: spatialData.reflectivities[currentFrame],
            //         bounds: bounds as L.LatLngBoundsExpression
            //     }
            // }

            overlayShapes={[selectedCoverage.geometry as GeoJSON.Feature]}
            onShapeClicked={handlePolygonClick}
        />
    
    </SectionCard>
  )
}

export default LiveMap;