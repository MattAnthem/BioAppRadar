import SectionCard from "../../shared/components/cards/SectionCard";
import VpChartHighcharts from "../../shared/components/charts/HighchartsVP";
import { useAppSelector } from "../../store/hooks";
import { useVpData } from "./hooks/useVpData";
import loader from '../../assets/loader.webp'
import { Fullscreen, Unplug } from "lucide-react";
import { useState } from "react";
import ChartModal from "../history_charts/components/ChartModal";
import Tooltip from "../../shared/components/popups/tooltip/Tooltip";
import { useTheme } from "../../shared/hooks/useTheme";

type VpChartProps = {
  className?: string;
}

const VpChart = ({ className }: VpChartProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <SectionCard className={`${className} h-full flex flex-col`}>

          {/* Modal chart */}
          <ChartModal
              isModalOpen={isModalOpen}
              modalTitle={`${selectedParameter.displayText} Chart`}
              mdlToggler_func={() => setIsModalOpen(false)}
          >


                      
          </ChartModal>

        {/* Heading */}
        <div className="px-1 w-full flex justify-between items-center">
            <h3 className='tracking-wider text-xs'>{selectedParameter.displayText} ({data?.units})</h3>

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
        <div className="flex-1 w-full min-h-0 overflow-hidden">
          {data && (

                <VpChartHighcharts
                  data={data}
                  selectedHeight={currentHeight}
                />

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
        </div>

    </SectionCard>
  )
}

export default VpChart;
