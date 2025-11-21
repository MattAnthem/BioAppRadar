import SectionCard from "../../shared/components/cards/SectionCard";
import VpChartHighcharts from "../../shared/components/charts/HighchartsVP";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useVpData } from "./hooks/useVpData";
import loader from '../../assets/loader.webp'
import { ChartLine, Fullscreen, ImageIcon, LucideDownload, Unplug } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../shared/hooks/useTheme";
import { capitalize } from "../../shared/utils/text_format";
import VpSpeciePopup from "./popup/VpSpeciePopup";
import dayjs from "dayjs";
import { useVpTemporalCoverageQuery } from "../../shared/hooks/useQuery/useVpTemporalCoverageQuery";
import { changeVpPayload } from "./vpChartSlice";
import { useVpImageQuery } from "../history_charts/hooks/useQuery/useVpImageQuery";

const ChartModal = React.lazy(() => import('../history_charts/components/ChartModal'));
const Tooltip = React.lazy(() => import('../../shared/components/popups/tooltip/Tooltip'));


type VpChartProps = {
  className?: string;
}

const VpChart = ({ className }: VpChartProps) => {

  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

  // Redux
  const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.altitude);
  const { vpPayload } = useAppSelector(state => state.vpchart)
  const currentHeight = altitudeOptions[currentAltitudeIndex];
  const dispatch = useAppDispatch();

  // --- Temporal coverages to restrict time selects  ---
  const { data: temporal, isSuccess, isRefetching } = useVpTemporalCoverageQuery(1, {
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: true,
  });

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

  // Chart data fetching
  const { isLoading, data, error } = useVpData();
  const { data: vpImageData, isLoading: vpImageLoading, error: vpImageError } = useVpImageQuery(vpPayload, displayMode === 'png');


  // handler to open the modal
  const handleOpenModal = () => {
      setIsModalOpen(true);
  }

  // Display mode handlers
  const handleDisplayImage = () => {
    setDisplayMode('png');
  }
  const handleDisplayInteractiveChart = () => {
    setDisplayMode('interactive');
  }

  return (
    <SectionCard className={`${className} w-full h-full flex flex-col`}>

          {/* Modal chart */}
          <ChartModal
              isModalOpen={isModalOpen}
              modalTitle={`${capitalize(data?.query_spec)} ${data?.name ?? '--'}`}
              mdlToggler_func={() => setIsModalOpen(false)}
          >

              {/* Handle display mode */}
              <div className="w-full flex justify-start items-center p-1 gap-1">
                <Tooltip
                  display_condition={isModalOpen}
                  position="bottom"
                  text="Display as interactive chart"
                >
                  <button onClick={handleDisplayInteractiveChart} className={`px-2 py-0.5 ${displayMode === 'interactive' ? 'bg-sky-800 border-sky-900 text-white hover:bg-sky-900' : 'border-gray-400 hover:bg-gray-300'} rounded-sm cursor-pointer border-2`}>
                      <ChartLine className="w-4"/>
                  </button>
                </Tooltip>

                <Tooltip
                  display_condition={isModalOpen}
                  position="bottom"
                  text="Display as image"
                >
                  <button onClick={handleDisplayImage} value={'png'} className={`px-2 py-0.5 ${displayMode === 'png' ? 'bg-sky-800 border-sky-900 text-white hover:bg-sky-900' : 'border-gray-400 hover:bg-gray-300'}  rounded-sm cursor-pointer border-2`}>
                      <ImageIcon className="w-4"/>
                  </button>
                </Tooltip>


              </div>

              { (displayMode === 'interactive' && data) && (
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
                  vpImageData && !vpImageLoading && !vpImageError && (displayMode === 'png') && (
                      <div className="w-full h-full flex items-center justify-center">
                          <img src={vpImageData} alt="VTIP Chart" className="max-w-full max-h-full object-contain"/>
                      </div>
                  )
              }
              {
                  (vpImageLoading || isLoading) && (
                      <div className="absolute z-30 w-full h-full flex items-center justify-center">
                          <img src={loader} alt="loading-data" width={35} height={35}  />
                      </div>
                  )
              }
              {         
                (vpImageError || error) && (
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
          {(data && !isRefetching && !error) && (

                <VpChartHighcharts
                  data={data}
                  selectedHeight={currentHeight}
                />

            )}
            {
                (isRefetching || isLoading) && (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <img src={loader} alt="loading-vp" width={25} height={25}  />
                        <small>Updating data...</small>
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
