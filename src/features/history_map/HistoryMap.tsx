import type { ClassificationDataResponse } from '../../api/endpoints/classificationAPI';
import type { SpatialDataResponse } from '../../api/endpoints/spatialDataAPI';
import GlassHeader from '../../shared/components/cards/GlassHeader';
import SectionCard from '../../shared/components/cards/SectionCard';
import DataLoading from '../../shared/components/loader/DataLoading';
import FetchError from '../../shared/components/loader/FetchError';
import LeafletMap from '../../shared/components/map/LeafletMap';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import AltitudeSlider from '../livemap/components/AltitudeSlider';
import Colorbar from '../livemap/components/Colorbar';
import ClassificationPopup from './components/ClassificationPopupHist';
import MapbasePopup from './components/MapbasePopup';
import RadarOptionPopup from './components/RadarOptionPopup';
import SevipPopup from './components/SevipPopup';
import { useClassifData } from './hooks/useData/useClassifData';
import { useRadarData } from './hooks/useData/useRadarData';
import { useSevipData } from './hooks/useData/useSevipData';
import { changeHistAltitude } from './slice/histAltitudeSlice';
import { setAltitudeForAll, setClassifPayloadHist, setColorbarForAll, setRadarPayloadHist, setSevipPayloadHist } from './slice/historyMapSlice';
import loader from '../../assets/loader.webp';

const HistoryMap = () => {

    // Redux call
    // Selected Radar type and Radar Parameter
    const { selectedMapBase, selectedColormap, selectedCoverage } = useAppSelector(state => state.hist_basemap);
    const { altitudeOptions, currentAltitudeIndex } = useAppSelector(state => state.hist_altitude);
    const dispatch = useAppDispatch();
    const { mapModeHist, radarPayloadHist } = useAppSelector(state => state.historymap)

    //#region  Overlay fetching
    const isRadar = mapModeHist === 'radar';
    const isSevip = mapModeHist === 'sevip';
    const isClassif = mapModeHist === 'classification';

    const { data: radarData, isLoading: radarDataLoading, error: radarError } = useRadarData(isRadar);
    const { data: sevipData, isLoading: sevipDataLoading, error: sevipError } = useSevipData(isSevip);
    const { data: classifData, isLoading: classifDataLoading, error: classifError } = useClassifData(isClassif);
    
    let data: ClassificationDataResponse | SpatialDataResponse | null = null;
    let isLoading = false;
    let error: unknown = null;

    switch (true) {
        case isRadar: 
            data = radarData as SpatialDataResponse
            isLoading = radarDataLoading;
            error = radarError;
            break;
        case isSevip:
            data = sevipData as SpatialDataResponse;
            isLoading = sevipDataLoading;
            error = sevipError;
            break;
        case isClassif:
            data = classifData as ClassificationDataResponse;
            isLoading = classifDataLoading;
            error = classifError;
            break;
    }

    //#endregion


    //#region HANDLERS 

    // Change overlay colorbar (Sevip and radar)
    const handleChangeColorbar = (colorname: string) => {
        dispatch(setColorbarForAll(colorname));

    }

    // Altitude 
    const handleAltitudeChange = (altIndex: number) => {
        dispatch(changeHistAltitude(altIndex));
        dispatch(setAltitudeForAll(altitudeOptions[altIndex]));
    }

    //#endregion

    //#region Popup Options submits
    // classification
    const { selectedVariable, color_0, color_1, histClassifTime } = useAppSelector(state => state.hist_classifpopup)
    const submitClassifPopupData = () => {
        dispatch(setClassifPayloadHist({
            class: selectedVariable.id as string,
            color_0: color_0,
            color_1: color_1,
            time: histClassifTime
        }))
    }

    // Radar
    const { selectedType, selectedParameter, radarTimeHist } = useAppSelector(state => state.hist_radarpopup);
    const submitRadarPopupData = () => {
        dispatch(setRadarPayloadHist({
            type: selectedType.id as 'grid' | 'polar',
            parameter: selectedParameter.id as string,
            time: radarTimeHist
        }))
    }

    // sevip
    const { selectedVariable: sevipSelVariable , histTimeSevip } = useAppSelector(state => state.hist_sevippopup);
    const submitSevipPopupData = () => {
        dispatch(setSevipPayloadHist({
            parameter: sevipSelVariable.id as string,
            time: histTimeSevip
        }))
    }

    //#endregion

    if (error) return (
        <SectionCard className=" w-full h-full col-span-6">
            <FetchError>
                <MapbasePopup/>
                <SevipPopup onSubmitPopup={submitSevipPopupData} />
                <RadarOptionPopup onSubmitPopup={submitRadarPopupData} />
                <ClassificationPopup onSubmitPopup={submitClassifPopupData} />
            </FetchError>   
        </SectionCard>
    )

  return (
    <SectionCard className='relative w-full h-full'>


        {
            isLoading && (
                <div className="absolute z-30 w-full h-full flex items-center justify-center">
                    <img src={loader} alt="loading-data" width={35} height={35}  />
                </div>
            )
        }


        {/* Heading */}
        <GlassHeader className='z-20  p-1 flex justify-between items-center'>

            <h3 className='text-white tracking-wider text-sm'>{data?.info.name}</h3>

            <div className="z-5 flex gap-3 justify-center items-end">

                <MapbasePopup onChangeOverlayColor={handleChangeColorbar}/>
                
                <SevipPopup onSubmitPopup={submitSevipPopupData}/>
                <RadarOptionPopup onSubmitPopup={submitRadarPopupData} />
                <ClassificationPopup 
                    onSubmitPopup={submitClassifPopupData}
                />
                
            </div>

        </GlassHeader>

        {/* Colorbar */}
        {
            (mapModeHist !== 'classification') && (
                <Colorbar
                    colorCodes={(data as SpatialDataResponse)?.ckeys?.colors ?? []}
                    valueScale={(data as SpatialDataResponse)?.ckeys?.labels.map(Number)  ?? []}
                    className='absolute bottom-0 left-0 z-10'
                />
            )
        }

        {/* altitude slider */}
        {
            (mapModeHist === 'classification' || (mapModeHist === 'radar' && radarPayloadHist.type === 'grid')) && (
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


        {/* Map Time */}
        <div className={`absolute flex flex-col justify-center gap-1.5 z-10 w-1/5 ${isClassif ? 'bottom-2' : 'bottom-8' } p-2 left-2  border-white/20 bg-gray-900/55 rounded-sm`}>

            <small className='text-white tracking-wide'>Time: {data?.info.time}</small>
            {
                (mapModeHist === 'radar' && radarPayloadHist.type === 'grid' && data?.info.height) && (
                    <small className='text-white tracking-wide'>Height: {data?.info.height} m</small>
                )
            }
            {
                (mapModeHist === 'radar' && radarPayloadHist.type === 'polar' && (data as SpatialDataResponse)?.info.elevation_angle) && (
                    <small className='text-white tracking-wide'>Elevation angle: {(data as SpatialDataResponse)?.info.elevation_angle} deg</small>
                )
            }

        </div>

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
            // overlayShapes={[selectedCoverage.geometry as GeoJSON.Feature]}
        />


        {/* Classification legends */}
        {
            (mapModeHist === "classification") && (
                <div className="absolute flex flex-col gap-1.5 z-10 w-1/5 h-20 p-2 right-2 bottom-1 border-white/20 bg-gray-900/55 rounded-sm">
                    
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

export default HistoryMap;
