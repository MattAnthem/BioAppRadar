import type { ClassificationDataResponse } from '../../api/endpoints/classificationAPI';
import type { SpatialDataResponse } from '../../api/endpoints/spatialDataAPI';
import GlassHeader from '../../shared/components/cards/GlassHeader';
import SectionCard from '../../shared/components/cards/SectionCard';
import DataLoading from '../../shared/components/loader/DataLoading';
import FetchError from '../../shared/components/loader/FetchError';
import LeafletMap from '../../shared/components/map/LeafletMap';
import type { SelectOption } from '../../shared/components/selects/types';
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
import { setClassifPayloadHist, setRadarPayloadHist, setSevipPayloadHist } from './slice/historyMapSlice';

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

    // Sevip
    const handleSevipVariableChange = (variable: SelectOption) => {
        dispatch(setSevipPayloadHist({
            parameter: variable.id as string
        }))
    }

    const handleSevipTimeChange = (time: string) => {
        dispatch(setSevipPayloadHist({
            time: time
        }))
    }

    // Radar
    const handleRadarParameterChange = (param: SelectOption) => {
        dispatch(setRadarPayloadHist({
            parameter: param.id as string
        }))
    }
    const handleRadarTypeChange = (type: SelectOption) => {
        dispatch(setRadarPayloadHist({
            type: type.id as 'grid' | 'polar'
        }))
    }
    const handleRadarTimeChange = (time: string) => {
        dispatch(setRadarPayloadHist({
            time: time
        }))
    }

    // Classification
    const handleChangeClassifColor1 = (color: string) => {
        dispatch(setClassifPayloadHist({
            color_1: color
        }))
    }
    const handleChangeClassifColor0 = (color: string) => {
        dispatch(setClassifPayloadHist({
            color_0: color
        }))
    }

    const handleChangeClassifVariable = (variable: SelectOption) => {
        dispatch(setClassifPayloadHist({
            class: variable.id as string
        }))
    }

    const handleChangeClassifTime = (time: string) => {
        dispatch(setClassifPayloadHist({
            time: time
        }))
    }

    // Change overlay colorbar (Sevip and radar)
    const handleChangeColorbar = (colorname: string) => {
        dispatch(setRadarPayloadHist({
            colorbar: colorname
        }))
        dispatch(setSevipPayloadHist({
            colorbar: colorname
        }))
    }

    // Altitude 
    const handleAltitudeChange = (altIndex: number) => {
        dispatch(changeHistAltitude(altIndex));

        dispatch(setClassifPayloadHist({height: altitudeOptions[altIndex]}))
        dispatch(setRadarPayloadHist({height: altitudeOptions[altIndex]}))

    }
    

    //#endregion

    if (isLoading) return (
        <div className="relative w-full h-full col-span-6">
            <DataLoading>
                <MapbasePopup/>
                <SevipPopup  onSevipTimeChange={handleSevipTimeChange} onSevipVariableChange={handleSevipVariableChange}/>
                <RadarOptionPopup onChangeRadarTime={handleRadarTimeChange} onChangeRadarType={handleRadarTypeChange} onChangeRadarParameter={handleRadarParameterChange} />
                <ClassificationPopup onChangeClassifTime={handleChangeClassifTime} onChangeClassifVariable={handleChangeClassifVariable} onChangeClassifColorZero={handleChangeClassifColor0} onChangeClassifColorOne={handleChangeClassifColor1} />

            </DataLoading>
        </div>
    )

    if (error) return (
        <SectionCard className="relative w-full h-full col-span-6">
            <FetchError>
                <MapbasePopup/>
                <SevipPopup  onSevipTimeChange={handleSevipTimeChange} onSevipVariableChange={handleSevipVariableChange}/>
                <RadarOptionPopup onChangeRadarTime={handleRadarTimeChange} onChangeRadarType={handleRadarTypeChange} onChangeRadarParameter={handleRadarParameterChange} />
                <ClassificationPopup onChangeClassifTime={handleChangeClassifTime} onChangeClassifVariable={handleChangeClassifVariable} onChangeClassifColorZero={handleChangeClassifColor0} onChangeClassifColorOne={handleChangeClassifColor1} />

            </FetchError>   
        </SectionCard>
    )

  return (
    <SectionCard className='relative w-full h-full'>

        {/* Heading */}
        <GlassHeader className='z-20  p-1 flex justify-between items-center'>

            <h3 className='text-white tracking-wider text-sm'>{data?.info.name}</h3>

            <div className="z-5 flex gap-3 justify-center items-end">

                <MapbasePopup onChangeOverlayColor={handleChangeColorbar}/>
                
                <SevipPopup  onSevipTimeChange={handleSevipTimeChange} onSevipVariableChange={handleSevipVariableChange}/>
                <RadarOptionPopup onChangeRadarTime={handleRadarTimeChange} onChangeRadarType={handleRadarTypeChange} onChangeRadarParameter={handleRadarParameterChange} />
                <ClassificationPopup 
                    color0Legend={data?.legend?.class_0?.name} 
                    color1Legend={data?.legend?.class_1?.name} 
                     onChangeClassifTime={handleChangeClassifTime} 
                     onChangeClassifVariable={handleChangeClassifVariable} 
                     onChangeClassifColorZero={handleChangeClassifColor0} 
                     onChangeClassifColorOne={handleChangeClassifColor1} 
                />

                
            </div>

        </GlassHeader>

        {/* Colorbar */}
        {
            !isClassif && (
                <Colorbar
                    colorCodes={data?.ckeys?.colors ?? []}
                    valueScale={data?.ckeys?.labels.map(Number)  ?? []}
                    className='absolute bottom-0 left-0 z-10'
                />
            )
        }

        {/* altitude slider */}
        {
            ((mapModeHist === 'classification' || radarPayloadHist.type === 'grid') && (mapModeHist !== 'sevip' || radarPayloadHist.type !== 'polar')) && (
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


        {/* Classification legends */}


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

      
    </SectionCard>
  )
}

export default HistoryMap;
