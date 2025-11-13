import { useState } from "react";
import SectionCard from "../../shared/components/cards/SectionCard";
import VptsHeatmapChart from "../../shared/components/charts/HighchartsVpts";
import { useAppSelector } from "../../store/hooks";
import { useVptsData } from "./hooks/useVptsData";
import ChartModal from "../history_charts/components/ChartModal";
import Tooltip from "../../shared/components/popups/tooltip/Tooltip";
import { Fullscreen, Unplug } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import loader from '../../assets/loader.webp';
import { useVptsImageQuery } from "../history_charts/hooks/useQuery/useVptsImageQuery";


type VptsChartProps = {
  className?: string;
}

const VptsChart = ({className}: VptsChartProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

  // Redux
  const { vptsPayload } = useAppSelector(state => state.vptschart);
  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  // Tanstack
  const { isLoading, data, error } = useVptsData();
  const { data: vptsImageData, isLoading: vptsImageLoading, error: vptsImageError } = useVptsImageQuery(vptsPayload, displayMode === 'png');





  // handler to open the modal
  const handleOpenModal = () => {
      setIsModalOpen(true);
  }

  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayMode(e.target.value as 'png' | 'interactive');
  }

  return (
    <SectionCard className={`${className} w-full h-full flex flex-col`}>


          {/* Modal chart */}
          <ChartModal
              isModalOpen={isModalOpen}
              modalTitle={`${data?.name} chart`}
              mdlToggler_func={() => setIsModalOpen(false)}
          >

           
              {/* Handle display mode */}
              <div className="w-full flex justify-center items-center p-1 gap-2">
                <p className="text-sm">Display as :</p>

                <input
                  type="radio"
                  name="display"
                  value="png"
                  checked={displayMode === 'png'}
                  onChange={handleDisplayChange}
                  id="disp_image"
                />
                <label htmlFor="disp_image" className="text-xs">PNG</label>

                <input
                  type="radio"
                  name="display"
                  value="interactive"
                  checked={displayMode === 'interactive'}
                  onChange={handleDisplayChange}
                  id="disp_interactive"
                />
                <label htmlFor="disp_interactive" className="text-xs">Interactive Chart</label>
              </div>

              {
                  (vptsImageLoading || isLoading) && (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                          <img width={35} height={35}  src={loader} alt="loader" />
                          <p className='font-semibold text-xs tracking-wider text-blue-600'>Loading data...</p>
                      </div>
                  )
              }
                  
              {
                (vptsImageError || error) && (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Unplug width={30} height={30} className='text-red-500'/>
                    <p className='font-semibold text-xs tracking-wider text-red-600'>Error fetching data</p>
                  </div>
                )
              }

              {
                  vptsImageData && !vptsImageLoading && !vptsImageError && (displayMode === 'png') && (
                      <div className="w-full h-full flex items-center justify-center">
                          <img src={vptsImageData} alt="VTIP Chart" className="max-w-full max-h-full object-contain"/>
                      </div>
                  )
              }

              {
                (displayMode === 'interactive' && data) && (
                  <div className="flex w-full h-full justify-center items-center">
                      <VptsHeatmapChart 
                        data={data} 
                        title
                        legend
                        chartHeight={500}
                      />
                  </div>
                )
              }
                      
          </ChartModal>


        {/* Heading */}
        <div className="p-1 w-full flex items-center justify-between">
            <h3 className='tracking-wider text-xs font-semibold'>{`${data?.name ?? '--'} (${data?.units ?? '--'})`}</h3>
            {/* Controls */}

            {/* Open the modal */}
            <Tooltip 
              position="bottom" 
              display_condition={!isModalOpen}  // is popup open
              text={"Open in fullscreen"}
            >                  
                    <button onClick={handleOpenModal} className={`${bg} ${border} ${hover} rounded-sm p-1`}>
                        <Fullscreen width={15} height={15}/>
                    </button>
            </Tooltip>
        </div>           

        {/* Chart */}
        <div className="h-full grid">
          {
            data && (
              <VptsHeatmapChart data={data}/>
            )
          }
          {
            isLoading && (
                <div className="w-full h-full flex items-center justify-center">
                    <img src={loader} alt="loading-vphist" width={35} height={35}  />
                </div>
            )
        }
        {         
          error && (
            <div className="absolute z-30 w-full h-full flex items-center justify-center">
              <Unplug width={60} height={60} className='text-red-500'/>
            </div> 
        )}
        </div>

    </SectionCard>
  )
}

export default VptsChart;
