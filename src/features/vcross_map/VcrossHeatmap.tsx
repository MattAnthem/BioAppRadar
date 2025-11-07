import type { CrossSectionBioClassResponse, CrossSectionRadarResponse } from "../../api/endpoints/crossSectionAPI";
import HeatmapChart from "../../shared/components/charts/HighchartHeatmap";
import DataLoading from "../../shared/components/loader/DataLoading";
import FetchError from "../../shared/components/loader/FetchError";
import { useAppSelector } from "../../store/hooks";
import { useVcrossBioclassData } from "./useData/useVcrossBioclassData"
import { useVcrossRadarData } from "./useData/useVcrossRadarData";

const VcrossHeatmap = () => {

    const { mapMode } = useAppSelector(state => state.vcrossmap);
    const isBioclass = mapMode === 'vcross_bioclass';
    const isRadar = mapMode === 'vcross_radar';

    const { data: bioClassData, error: bioClassError, isLoading: bioclassLoading } = useVcrossBioclassData(isBioclass);
    const { data: radarData, error: radarError, isLoading: radarLoading } = useVcrossRadarData(isRadar);


    let data: CrossSectionBioClassResponse | CrossSectionRadarResponse | null = null;
    let isLoading = false;
    let error: unknown = null;

    switch (true) {
        case isBioclass: 
            data = bioClassData as CrossSectionBioClassResponse
            isLoading = bioclassLoading;
            error = bioClassError
            break;
        case isRadar:
            data = radarData as CrossSectionRadarResponse;
            isLoading = radarLoading;
            error = radarError;
    }



    if (isLoading) return (
        <div className='w-full h-full'>
            <DataLoading/>
        </div>
    )
    if (error) return (
        <div className='w-full h-full'>
            <FetchError/>
        </div>
    )

  return (
    <div className='w-full h-full flex items-center justify-center'>

        <HeatmapChart data={data!} />

    </div>
  )
}

export default VcrossHeatmap;
