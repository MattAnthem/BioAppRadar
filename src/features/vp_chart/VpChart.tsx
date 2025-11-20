import SectionCard from "../../shared/components/cards/SectionCard";
import VpChartHighcharts from "../../shared/components/charts/HighchartsVP";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useVpData } from "./hooks/useVpData";
import loader from '../../assets/loader.webp'
import { Fullscreen, LucideDownload, Unplug } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../shared/hooks/useTheme";
import { capitalize } from "../../shared/utils/text_format";
import VpSpeciePopup from "./popup/VpSpeciePopup";
import dayjs from "dayjs";
import { useVpTemporalCoverageQuery } from "../../shared/hooks/useQuery/useVpTemporalCoverageQuery";
import { changeVpPayload } from "./vpChartSlice";

const ChartModal = React.lazy(() => import('../history_charts/components/ChartModal'));
const Tooltip = React.lazy(() => import('../../shared/components/popups/tooltip/Tooltip'));


type VpChartProps = {
  className?: string;
}

const VpChart = ({ className }: VpChartProps) => {

  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redux
  const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.altitude);
  const currentHeight = altitudeOptions[currentAltitudeIndex];
  const dispatch = useAppDispatch();

  // --- Temporal coverages to restrict time selects  ---
  const { data: temporal, isSuccess } = useVpTemporalCoverageQuery(1);

    // --Adjust time to use fresh timerange from the time coverage ---
  const adjustedTimes = useMemo(() => {
        if (!temporal) return null;
      
        const fresh_time = dayjs(temporal.end_time).add(2, "hour").format("YYYY-MM-DD HH:mm:ss");

        return { fresh_time };
  }, [temporal]);

    // --- Hydrate Redux Slice if the query succeed
  useEffect(() => {
      if(!isSuccess || !adjustedTimes) return;
      dispatch(changeVpPayload(
        {
          time: adjustedTimes.fresh_time
        }
      ));

  }, [adjustedTimes, dispatch, isSuccess]);

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
              modalTitle={`${capitalize(data?.query_spec)} ${data?.name ?? '--'}`}
              mdlToggler_func={() => setIsModalOpen(false)}
          >


              {data && (
                <div className="w-full h-full flex flex-col  items-center justify-center">
                  <div className="lg:w-1/2 w-full h-full">
                        {/* Download : Dataset/Image */}
                        <div className="flex w-full justify-end items-end pt-1 px-1">
                          <Tooltip
                            position="bottom"
                            text="Download chart"
                            display_condition={isModalOpen}
                          >
                            <button className="p-1 bg-sky-800 hover:bg-sky-900 rounded-sm text-white">
                              <LucideDownload className="w-4 h-4"/>
                            </button>
                          </Tooltip>
                        </div>
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
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Unplug width={30} height={30} className='text-red-500'/>
                    <p className='font-semibold text-xs tracking-wider text-red-600'>Error fetching data</p>
                  </div>
              )}

                      
          </ChartModal>

        {/* Heading */}
        <div className="p-1 w-full flex justify-between items-center">
            <h3 className='tracking-wider text-xs font-semibold'>{capitalize(data?.query_spec)} - {data?.name ?? '--'} ({data?.units ?? '--'})</h3>

            {/* Open the modal */}
            <div className="flex justify-center gap-1 5">

              <VpSpeciePopup/>

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
                        <img src={loader} alt="loading-vp" width={25} height={25}  />
                    </div>
                )
            }
            {         
              error && (
                <div className="flex items-center justify-center">
                  <Unplug width={25} height={25} className='text-red-500'/>
                </div> 
            )}
        </div>


    </SectionCard>
  )
}

export default VpChart;
