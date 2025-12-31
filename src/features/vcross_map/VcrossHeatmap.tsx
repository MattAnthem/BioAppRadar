import { ChartLine, ImageIcon, Unplug } from "lucide-react";
import type { CrossSectionBioClassResponse, CrossSectionRadarResponse } from "../../api/endpoints/crossSectionAPI";
import { useAppSelector } from "../../store/hooks";
import { useVcrossBioclassData } from "./useData/useVcrossBioclassData"
import { useVcrossRadarData } from "./useData/useVcrossRadarData";
import loader from '../../assets/loader.webp';
import { lazy, useState } from "react";
import Tooltip from "../../shared/components/popups/tooltip/Tooltip";
import { useTheme } from "../../shared/hooks/useTheme";

const HeatmapChart = lazy(() => import('../../shared/components/charts/HighchartHeatmap'));

const VcrossHeatmap = () => {
    const themes = useTheme();
    const { active_border, active_text, border: tog_border, hover: tog_hover } = themes.theme.displayTogglerBtn;


    const { mapMode } = useAppSelector(state => state.vcrossmap);
    const [displayMode, setDisplayMode] =  useState<'png' | 'interactive'>('interactive');
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

    const handleDisplayInteractiveChart = () => {
        setDisplayMode('interactive');
    };

    const handleDisplayImage = () => {
        setDisplayMode('png');
    }

  return (
    <div className=' w-full h-full flex flex-col items-center justify-start'>


        {/* Heaader title */}
        <div className="p-1 w-full flex items-center justify-between">
            <h3 className='tracking-wider text-[clamp(0.8em,0.8vw,1em)] font-[600]'>{`Vertical cross section of ${data?.info.name ?? '--'}`}</h3>
        </div>

        <div className="w-full h-full relative items-center">

            <div className=" px-8 py-2 grid grid-cols-2 justify-start items-center gap-2">
                <Tooltip
                    display_condition={true}
                    position="bottom"
                    text="Display as image"
                >
                <button 
                    aria-label='Display interactive chart'
                    onClick={handleDisplayInteractiveChart} 
                    className={`
                        w-full flex gap-1 justify-center items-center 
                        px-2 py-0.5 cursor-pointer border-b-2 rounded-t-sm
                        ${displayMode === 'interactive' ? `${active_border} ${active_text} font-semibold` : tog_border} 
                        ${tog_hover}
                    `}
                >
                    <ChartLine className="w-4"/>
                    <h1 className='text-[clamp(0.8rem,0.8vw,2rem)]'>Interactive</h1>
                </button>
                </Tooltip>

                <Tooltip
                    display_condition={true}
                    position="bottom"
                    text="Display as gif"
                >
                <button 
                    aria-label='Display image chart'
                    onClick={handleDisplayImage} 
                    className={`
                        w-full flex gap-1 justify-center items-center 
                        px-2 py-0.5 cursor-pointer border-b-2 rounded-t-sm
                        ${displayMode === 'png' ? `${active_border} ${active_text} font-semibold` : tog_border} 
                        ${tog_hover}
                    `}
                    >
                    <ImageIcon className="w-4"/>
                    <h1 className='text-[clamp(0.8rem,0.8vw,2rem)]'>Image</h1>
                </button>
                </Tooltip>
            </div>

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
