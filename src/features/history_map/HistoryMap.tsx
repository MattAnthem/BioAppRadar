import GlassHeader from '../../shared/components/cards/GlassHeader';
import SectionCard from '../../shared/components/cards/SectionCard';
import DataLoading from '../../shared/components/loader/DataLoading';
import FetchError from '../../shared/components/loader/FetchError';
import LeafletMap from '../../shared/components/map/LeafletMap';
import type { SelectOption } from '../../shared/components/selects/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Colorbar from '../livemap/components/Colorbar';
import MapbasePopup from './components/MapbasePopup';
import RadarOptionPopup from './components/RadarOptionPopup';
import { useRadarData } from './hooks/useData/useRadarData';
import { setHistoryMapPayload } from './slice/historyMapSice';

const HistoryMap = () => {

    // Redux call
    // Selected Radar type and Radar Parameter
    const { selectedMapBase, selectedColormap, selectedCoverage } = useAppSelector(state => state.basemaphistory);
    const dispatch = useAppDispatch();


    const { data, isLoading, error } = useRadarData();

    
    const handleRadarTypeChange = (option: SelectOption) => {
        dispatch(setHistoryMapPayload({
            type: option.id as string, 
            colorbar: selectedColormap.id as string
        }))
    }
    const handleRadarParameterChange = (option: SelectOption) => {
        dispatch(setHistoryMapPayload({
            parameter: option.id as string,
            colorbar: selectedColormap.id as string
        }))
    }

    if (isLoading) return (
        <div className="relative w-full h-full col-span-6">
            <DataLoading>
                <MapbasePopup/>
                <RadarOptionPopup 
                    onChangeRadarType={handleRadarTypeChange}
                    onChangeRadarParameter={handleRadarParameterChange}
                />
            </DataLoading>
        </div>
    )

    if (error) return (
        <SectionCard className="relative w-full h-full col-span-6">
            <FetchError>
                <MapbasePopup/>
                <RadarOptionPopup 
                    onChangeRadarType={handleRadarTypeChange}
                    onChangeRadarParameter={handleRadarParameterChange}
                />
            </FetchError>   
        </SectionCard>
    )

  return (
    <SectionCard className='relative w-full h-full'>

        {/* Heading */}
        <GlassHeader className='p-1 flex justify-between items-center'>

            <h3 className='text-white tracking-wider text-sm'>{data?.info.type} {data?.info.name}</h3>

            <div className="z-5 flex gap-3 justify-center items-end">

                <MapbasePopup/>

                <RadarOptionPopup 
                    onChangeRadarType={handleRadarTypeChange}
                    onChangeRadarParameter={handleRadarParameterChange}
                />
                
            </div>

        </GlassHeader>

        {/* Colorbar */}
        <Colorbar
            colorCodes={data?.ckeys?.colors ?? []}
            valueScale={data?.ckeys?.labels.map(Number)  ?? []}
            className='absolute bottom-0 left-0 z-10'
        />


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
                    url: data?.data?.png ?? '',
                    bounds: data?.data?.bounds as L.LatLngBoundsExpression ?? [[0,0], [0, 0]],
                }
            }
            overlayShapes={[selectedCoverage.geometry as GeoJSON.Feature]}
        />

      
    </SectionCard>
  )
}

export default HistoryMap;
