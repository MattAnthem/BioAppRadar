import { useState } from "react";
import SectionCard from "../../../shared/components/cards/SectionCard";
import DataLoading from "../../../shared/components/loader/DataLoading";
import FetchError from "../../../shared/components/loader/FetchError";
import { useTheme } from "../../../shared/hooks/useTheme";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { changeVptsHistPayload } from "../slices/vptsHistChartSlice";
import ChartModal from "./ChartModal";
import { Fullscreen, Unplug } from "lucide-react";
import Tooltip from "../../../shared/components/popups/tooltip/Tooltip";
import loader from '../../../assets/loader.webp';
import VptsHeatmapChart from "../../../shared/components/charts/HighchartsVpts";
import VptsHistPopup from "./popups/VptsHistPopup";
import { useVptsHistData } from "../hooks/useData/useVptsHistData";
import { useVptsImageQuery } from "../hooks/useQuery/useVptsImageQuery";


type VptsChartProps = {
  className?: string;
}

const VptsHistChart = ({className}: VptsChartProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

  // Redux
  const { selectedParameter, vptsPayload, vptsStartTime, vptsEndTime } = useAppSelector(state => state.vpts_histchart);
  const dispatch = useAppDispatch();

  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  // Tanstack
  const { isLoading, data, error } = useVptsHistData();

  const { data: vptsImageData, isLoading: vptsImageLoading, error: vptsImageError } = useVptsImageQuery(vptsPayload, displayMode === 'png');



  
    // Submit Vtip Popup data
    const submitVptsPopup = () => {

      dispatch(changeVptsHistPayload(
        {
          startTime: vptsStartTime,
          endTime: vptsEndTime,
          parameter: selectedParameter.id as string
        }
      ))
    }

  if (isLoading) return (
    <div className={`${className}  p-1`}>
      <DataLoading />
    </div> 
  )
  if (error) return (
    <div className={`${className}  p-1`}>
      <FetchError />
    </div> 
  )

  // handler to open the modal
  const handleOpenModal = () => {
        setIsModalOpen(true);
  }

  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayMode(e.target.value as 'png' | 'interactive');
  }

  return (
    <SectionCard className={`${className} p-1`}>


          {/* Modal chart */}
          <ChartModal
              isModalOpen={isModalOpen}
              modalTitle={`${selectedParameter.displayText} Chart`}
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
        <div className="p-1 w-full flex justify-between items-center">
            <h3 className='tracking-wider text-xs font-semibold'>{data?.name} ({data?.units})</h3>
            
            <div className="flex gap-2">
              
                {/* Controls */}
                <VptsHistPopup onSubmitPopup={submitVptsPopup} />


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
        </div>           

        {/* Chart */}
        <div className="flex w-full h-full items-center justify-center">
          {
            data && (
              <VptsHeatmapChart data={data}/>
            )
          }
        </div>

    </SectionCard>
  )
}

export default VptsHistChart;
