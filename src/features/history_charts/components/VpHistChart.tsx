import SectionCard from "../../../shared/components/cards/SectionCard";
import VpChartHighcharts from "../../../shared/components/charts/HighchartsVP";
import { useAppSelector } from "../../../store/hooks";
import { useVpHistData } from "../hooks/useData/useVpHistData";
import loader from '../../../assets/loader.webp';
import { Fullscreen, Unplug } from "lucide-react";
import React,{ useState } from "react";
import { useTheme } from "../../../shared/hooks/useTheme";

const VpHistPopup = React.lazy(() => import('./popups/VpHistPopup'));
const ChartModal = React.lazy(() => import('./ChartModal'));
const Tooltip = React.lazy(() => import('../../../shared/components/popups/tooltip/Tooltip'));



type VpChartProps = {
  className?: string;
}

const VpHistChart = ({ className }: VpChartProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redux
  const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.hist_altitude);
  const currentHeight = altitudeOptions[currentAltitudeIndex];

  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  const { isLoading, data, error } = useVpHistData();





      // handler to open the modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

  return (
    <SectionCard className={`${className} h-full flex flex-col`}>


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
                          selectedHeight={currentHeight}
                          chartHeight={500}
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
            <h3 className='tracking-wider text-xs font-semibold'>{`${data?.name ?? '--'} (${data?.units ?? '--'})`}</h3>
            
            <div className="flex justify-center gap-2">
              {/* controls */}
              <VpHistPopup />

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
            
        </div>           

        {/* Chart */}
        <div className="h-full grid px-2 pb-2">
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

export default VpHistChart;
