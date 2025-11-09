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
  showControls?: boolean;
}

const VptsHistChart = ({className, showControls}: VptsChartProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redux
  const { selectedParameter, vptsPayload, vptsStartTime, vptsEndTime } = useAppSelector(state => state.vpts_histchart);
  const dispatch = useAppDispatch();

  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  // Tanstack
  const { isLoading, data, error } = useVptsHistData();

  const { data: vptsImageData, isLoading: vptsImageLoading, error: vptsImageError } = useVptsImageQuery(vptsPayload, isModalOpen);



  
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

  return (
    <SectionCard className={`${className} p-1`}>


          {/* Modal chart */}
          <ChartModal
              isModalOpen={isModalOpen}
              modalTitle={`${selectedParameter.displayText} Chart`}
              mdlToggler_func={() => setIsModalOpen(false)}
          >

              {
                  vptsImageLoading && (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                          <img width={35} height={35}  src={loader} alt="loader" />
                          <p className='font-semibold text-xs tracking-wider text-blue-600'>Loading data...</p>
                      </div>
                  )
              }
                  
              {
                vptsImageError && (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Unplug width={30} height={30} className='text-red-500'/>
                    <p className='font-semibold text-xs tracking-wider text-red-600'>Error fetching data</p>
                  </div>
                )
              }

              {
                  vptsImageData && !vptsImageLoading && !vptsImageError && (
                      <div className="w-full h-full flex items-center justify-center">
                          <img src={vptsImageData} alt="VTIP Chart" className="max-w-full max-h-full object-contain"/>
                      </div>
                  )
              }
                      
          </ChartModal>

        {/* Heading */}
        <div className="p-1 w-full flex justify-between items-center">
            <h3 className='tracking-wider text-xs'>{data?.name} ({data?.units})</h3>
            
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
