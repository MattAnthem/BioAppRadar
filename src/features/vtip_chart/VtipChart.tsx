import React,{ useEffect, useMemo, useRef, useState } from "react";
import SectionCard from "../../shared/components/cards/SectionCard";
import HighchartVtip from "../../shared/components/charts/HighchartsVTIP";
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { useVtipData } from "./hooks/useVtipData";
import { ChartLine, Download, Fullscreen, ImageIcon, Unplug } from "lucide-react";
import loader from '../../assets/loader.webp';
import { useTheme } from "../../shared/hooks/useTheme";
import { useVtipImageQuery } from "../history_charts/hooks/useQuery/useVtipImageQuery";
import { capitalize } from "../../shared/utils/text_format";
import VtipSpeciePopup from "./popup/VtipSpeciePopup";
import dayjs from "dayjs";
import { useVpTemporalCoverageQuery } from "../../shared/hooks/useQuery/useVpTemporalCoverageQuery";
import { changeVtipPayload } from "./vtipChartSlice";

const ChartModal = React.lazy(() => import('../history_charts/components/ChartModal'));
const Tooltip = React.lazy(() => import('../../shared/components/popups/tooltip/Tooltip'));


type VtipChartProps = {
  className?: string;
}

const VtipChart = ({ className }: VtipChartProps) => {
  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

  // Redux 
  const { vtipPayload } = useAppSelector(state => state.vtipchart);
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
      
        const fresh_end = dayjs(temporal.end_time).add(2, "hour").format("YYYY-MM-DD HH:mm:ss");
        const fresh_start = dayjs(fresh_end).subtract(1, "hour").format("YYYY-MM-DD HH:mm:ss");
      
        return { fresh_start, fresh_end };
  }, [temporal]);

  // --- Hydrate Redux Slice if the query succeed
  useEffect(() => {
      if(!isSuccess || !adjustedTimes) return;
      dispatch(changeVtipPayload(
          {
            startTime: adjustedTimes.fresh_start,
            endTime: adjustedTimes.fresh_end,
          }
  ));

  }, [adjustedTimes, dispatch, isSuccess]);

  // Tanstack
  const { isLoading, data, error } = useVtipData();
  const { data: vtipImageData, isLoading: vtipImageLoading, error: vtipImageError } = useVtipImageQuery(vtipPayload, displayMode === 'png');


  // Ref to the chart
  const chartRef = useRef<Highcharts.Chart | null>(null);


  // handler to open the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleDisplayImage = () => {
    setDisplayMode('png');
  }
  const handleDisplayInteractiveChart = () => {
    setDisplayMode('interactive');
  }

  // Dowload handlers
  // CSV
  const handleDownloadInteractiveChartCSV = () => {
    if (!chartRef.current) return;
    chartRef.current.downloadCSV();
  }

  return (
    <SectionCard className={`${className} w-full h-full flex flex-col`}>

          {/* Modal chart */}
          <ChartModal
              isModalOpen={isModalOpen}
              modalTitle={`${capitalize(data?.query_spec)} ${data?.name ?? '--'}`}
              mdlToggler_func={handleCloseModal}
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

              {
                  (vtipImageLoading || isLoading)  && (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                          <img width={35} height={35}  src={loader} alt="loader" />
                          <p className='font-semibold text-xs tracking-wider text-blue-600'>Loading data...</p>
                      </div>
                  )
              }
                  
              {
                (vtipImageError || error) && (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Unplug width={30} height={30} className='text-red-500'/>
                    <p className='font-semibold text-xs tracking-wider text-red-600'>Error fetching data</p>
                  </div>
                )
              }

              {
                  vtipImageData && !vtipImageLoading && !vtipImageError && (displayMode === 'png') && (
                      <div className="w-full h-full flex items-center justify-center">
                          <img src={vtipImageData} alt="VTIP Chart" className="max-w-full max-h-full object-contain"/>
                      </div>
                  )
              }

              {
                (displayMode === 'interactive' && data) && (
                  <div className="flex flex-col w-full h-full justify-start items-center">
                      {/* Download : Dataset/Image */}
                      <div className="flex w-full justify-end items-center px-1">
                        <Tooltip
                          position="bottom"
                          text="Download CSV"
                          display_condition={isModalOpen}
                        >
                          <button onClick={handleDownloadInteractiveChartCSV} className="p-1 bg-sky-800 hover:bg-sky-900 rounded-sm text-white">
                            <Download className="w-4 h-4"/>
                          </button>
                        </Tooltip>
                      </div>
                    <HighchartVtip
                      data={data}
                      displayTitle
                      ref={chartRef}
                    />
                  </div>
                )
              }
                      
          </ChartModal>
      

          {/* Heading */}
          <div className="p-1 w-full flex items-center justify-between">
              <h3 className='tracking-wider text-xs font-semibold'>{`${capitalize(data?.query_spec)} - ${data?.name ?? '--'} (${data?.units ?? '--'})`}</h3>

                <div className="flex justify-center gap-1.5">
                    <VtipSpeciePopup/>
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
            {
              (data && !isRefetching && !error) && (
                <HighchartVtip
                  data={data}
                />
              )
            }
            {
              isLoading && (
                  <div className="w-full h-full flex items-center justify-center">
                      <img src={loader} alt="loading-vphist" width={25} height={25}  />
                  </div>
            )
            }
            {
                isRefetching && (
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

export default VtipChart;
