import { Unplug } from "lucide-react";
import type { CrossSectionBioClassResponse, CrossSectionRadarResponse } from "../../api/endpoints/crossSectionAPI";
import HeatmapChart from "../../shared/components/charts/HighchartHeatmap";
import { useAppSelector } from "../../store/hooks";
import { useVcrossBioclassData } from "./useData/useVcrossBioclassData"
import { useVcrossRadarData } from "./useData/useVcrossRadarData";
import loader from '../../assets/loader.webp';

const VcrossHeatmap = () => {

    const { mapMode } = useAppSelector(state => state.vcrossmap);
    const isBioclass = mapMode === 'vcross_bioclass';
    const isRadar = mapMode === 'vcross_radar';

    const { data: bioClassData, error: bioClassError, isLoading: bioclassLoading } = useVcrossBioclassData(isBioclass);
    const { data: radarData, error: radarError, isLoading: radarLoading } = useVcrossRadarData(isRadar);


    let data: CrossSectionBioClassResponse | CrossSectionRadarResponse | null = null;
    let isLoading = false;
    let error = null;

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


    console.log("DATA HEATMAP : ", data)

  return (
    <div className=' w-full h-full flex flex-col items-center justify-start'>


        {/* Heaader title */}
        <div className="p-1 w-full flex items-center justify-between">
        <h3 className='tracking-wider text-xs font-semibold'>{`Vertical cross section of ${data?.info.name ?? '--'}`}</h3>
        </div>

        <div className="w-full h-full relative items-center">
            {
                (error) && (
                    <div className="absolute z-10 w-full h-full flex items-center justify-center">
                        <Unplug width={35} height={35} className='text-red-500'/>
                    </div>
                )
            }

            {
                isLoading && (
                    <div className="absolute z-10 w-full h-full flex items-center justify-center">
                        <img src={loader} alt="loading-data" width={35} height={35}  />
                    </div>
                )
            }
            {
                data && (
                    <div className="h-full grid p-2">
                        <HeatmapChart data={data} />
                    </div>
                )
            }
        </div>


    </div>
  )
}

export default VcrossHeatmap;
