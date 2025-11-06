import SectionCard from '../../shared/components/cards/SectionCard'
import GlassHeader from '../../shared/components/cards/GlassHeader'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import LeafletMap from '../../shared/components/map/LeafletMap'
import VcrossBioClsDataPopup from './components/VcrossBioClsDataPopup'
import VcrossRadarDataPopup from './components/VcrossRadarDataPopup'
import { setVcrossBioClassPayload } from './slice/vcrossMapSlice'
import type { SelectOption } from '../../shared/components/selects/types'
import MapbasePopup from '../livemap/components/MapbasePopup'

const Vcrossmap = () => {

    const { selectedMapBase } = useAppSelector(state => state.basemappopup);
    // const { vcrossBioclassPayload } = useAppSelector(state => state.vcrossmap);
    const dispatch = useAppDispatch();

    // Handling BIOCLASS Payload elements
    // coordinates
    const handleTransectLineDrawn = (start: L.LatLng, end: L.LatLng) => {
        dispatch(setVcrossBioClassPayload({
            startLat: start.lat,
            endLat: end.lat,
            startLon: start.lng,
            endLon: end.lng
        }))
    }

    // Bioclass 
    const handleChangeVcrossBioclassTime = (time: string) => {
        dispatch(setVcrossBioClassPayload({
            time
        }))
    }
    const handleChangeVcrossBioclass = (option: SelectOption) => {
        dispatch(setVcrossBioClassPayload({
            class: option.id as string
        }))
    }

    // Radar




  return (
    <SectionCard className='w-full h-full'>
      
            {/* Header: Options */}
            <GlassHeader
              className='z-20 p-1 flex justify-between items-center'
            >

                <h3 className='text-white tracking-wider text-sm'>Cross Section</h3>

                {/* Data popover Options */}
                <div className="z-5 flex gap-3 justify-center items-end">
                    <MapbasePopup/>

                    <VcrossRadarDataPopup/>
                    <VcrossBioClsDataPopup onChangeBioclass={handleChangeVcrossBioclass} onChangeBioclassTime={handleChangeVcrossBioclassTime}/>
                </div>

            </GlassHeader>


            {/* Cross section Map */}
            <LeafletMap
                className='relative z-4 w-full h-full rounded-sm '            
                baseMap={selectedMapBase.url as string}
                drawable={false}
                enableLineDraw={true}
                center={[-2.158, 30.1131097]}
                zoom={9}
                onDrawLine={handleTransectLineDrawn}
                // overlayImg={
                //     {
                //         url: data?.data?.png ?? '',
                //         bounds: data?.data?.bounds as L.LatLngBoundsExpression ?? [[0,0], [0, 0]],
                //     }
                // }
                // overlayShapes={[selectedCoverage.geometry as GeoJSON.Feature]}
            />

    </SectionCard>
  )
}

export default Vcrossmap
