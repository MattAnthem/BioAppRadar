import { useState } from 'react';
import activeRadar from '../../assets/radar_on.png';
import offRadar from '../../assets/radar_off.png';
import { parameters, spatialData } from './livemapAPI';
import DataLoading from '../../shared/components/loader/DataLoading';
import FetchError from '../../shared/components/loader/FetchError';
import SectionCard from '../../shared/components/cards/SectionCard';
import GlassHeader from '../../shared/components/cards/GlassHeader';
import AltitudeSlider from '../../shared/components/sliders/AltitudeSlider';
import Colorbar from '../../shared/components/colorbar/Colorbar';
import TimelineSlider from '../../shared/components/sliders/TimelineSlider';
import LeafletMap from '../../shared/components/map/LeafletMap';
import VaribalePopup from '../../shared/features/map-option-popups/VaribalePopup';
import MapbasePopup from '../../shared/features/map-option-popups/MapbasePopup';
import { useAppSelector } from '../../store/hooks';

type LiveMapProps = {
    drawable: boolean;
}

const colors = [
    "#30123b",
    "#4685fa",
    "#1ae4b6",
    "#a4fc3c",
    "#faba39",
    "#e4450a",
    "#7a0403"
]

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
    const { coverage } = useAppSelector(state => state.livemap);

    // TODO use tanstack state
    const [dataLoading, setDataLoading] = useState(false); 
    const [fetchError, setFetchError] = useState(false);

    const [currentFrame, setCurrentFrame] = useState(0);

    const [altIndex, setAltIndex] = useState(parameters.altitudesBand.length - 1);

    



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
    // Format payload
    /**
     * {
     *   type: vertical int prf
     *   map: 'vid',   
     *   height: 200,
     *   time: '2025-10-23 16:34:00'     
     * }
     */

    
    //#endregion


    if (dataLoading) return <DataLoading/>

    if (fetchError) return <FetchError/>


  return (
    <SectionCard className='relative w-full h-full p-1'>

        {/* Heading */}
        <GlassHeader className='flex justify-between items-center'>
        
            <h3 className='text-white tracking-wider'>Live Map</h3>

            {/* Overlay controller */}
            <div className="z-5 flex gap-3 justify-center items-end">

                {/* Changer de variable */}
                <VaribalePopup/> 

                
                <MapbasePopup/>

            </div>

        </GlassHeader>

        {/* Altitude slider */}
        <AltitudeSlider
            currentIndex={altIndex}
            onChangeAltitude={setAltIndex}
            position='right'
            altitudes={parameters.altitudesBand}
        />


        {/* Colorbar */}
        <Colorbar
            colorCodes={colors}
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

            overlayShapes={[coverage]}
            onShapeClicked={handlePolygonClick}
        />
    
    </SectionCard>
  )
}

export default LiveMap;