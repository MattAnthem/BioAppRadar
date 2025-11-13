import SectionCard from "../../shared/components/cards/SectionCard";
import VpChartHighcharts from "../../shared/components/charts/HighchartsVP";
import { useAppSelector } from "../../store/hooks";
import { useVpData } from "./hooks/useVpData";
import loader from '../../assets/loader.webp'
import { Fullscreen, Unplug } from "lucide-react";
import React, { useState } from "react";
import { useTheme } from "../../shared/hooks/useTheme";

const ChartModal = React.lazy(() => import('../history_charts/components/ChartModal'));
const Tooltip = React.lazy(() => import('../../shared/components/popups/tooltip/Tooltip'));


type VpChartProps = {
  className?: string;
}

const VpChart = ({ className }: VpChartProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('png');

  // Redux
  const { selectedParameter } = useAppSelector(state => state.vpchart);
  const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.altitude);
  const currentHeight = altitudeOptions[currentAltitudeIndex];
  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  const { isLoading, data, error } = useVpData();


    // handler to open the modal
  const handleOpenModal = () => {
      setIsModalOpen(true);
  }

  return (
    <SectionCard className={`${className} w-full h-full flex flex-col`}>

          {/* Modal chart */}
          <ChartModal
              isModalOpen={isModalOpen}
              modalTitle={`${data?.name} chart`}
              mdlToggler_func={() => setIsModalOpen(false)}
          >


              {data && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="lg:w-1/2 w-full h-full">
                    <VpChartHighcharts
                      data={data}
                      displayTitle
                      chartHeight={500}
                      selectedHeight={currentHeight}
                    />
                  </div>
                </div>

              )}
              {
                  isLoading && (
                      <div className="absolute z-30 w-full h-full flex items-center justify-center">
                          <img src={loader} alt="loading-data" width={35} height={35}  />
                      </div>
                  )
              }
              {         
                error && (
                  <div className="absolute z-30 w-full h-full flex items-center justify-center">
                    <Unplug width={60} height={60} className='text-red-500'/>
                  </div> 
              )}

                      
          </ChartModal>

        {/* Heading */}
        <div className="p-1 w-full flex justify-between items-center">
            <h3 className='tracking-wider text-xs font-semibold'>{selectedParameter.displayText} ({data?.units})</h3>

            {/* Open the modal */}
            <Tooltip 
                  position="bottom" 
                  display_condition={!isModalOpen}  
                  text={"Open in fullscreen"}
            >                  
                <button onClick={handleOpenModal} className={`${bg} ${border} ${hover} rounded-sm p-1`}>
                    <Fullscreen width={15} height={15}/>
                </button>
            </Tooltip>
            
        </div>           

        {/* Chart */}
        <div className="h-full grid">
          {data && (

                <VpChartHighcharts
                  data={data}
                  selectedHeight={currentHeight}
                />

            )}
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

export default VpChart;
