import { useState } from "react";
import SectionCard from "../../../shared/components/cards/SectionCard";
import DataLoading from "../../../shared/components/loader/DataLoading";
import FetchError from "../../../shared/components/loader/FetchError";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useVtipHistData } from "../hooks/useVtipHistData";
import { changeVtipHistPayload } from "../slices/vtipHistChartSlice";
import ChartModal from "./ChartModal";
import { useTheme } from "../../../shared/hooks/useTheme";
import { Fullscreen, Unplug } from "lucide-react";
import Tooltip from "../../../shared/components/popups/tooltip/Tooltip";
import { useVtipImageQuery } from "../hooks/useVtipImageQuery";
import loader from '../../../assets/loader.webp';
import HighchartVtip from "../../../shared/components/charts/HighchartsVTIP";
import VtipHistPopup from "./popups/VtipHistPopup";


type VtipChartProps = {
  className?: string;
}

const VtipHistChart = ({ className }: VtipChartProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redux 
  const { selectedParameter, vtipPayload, vtipStartTime, vtipEndTime } = useAppSelector(state => state.vtip_histchart);
  const dispatch = useAppDispatch();
  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  // Tanstack

  //#region  Data Fetching
  const { isLoading, data, error } = useVtipHistData();

  const { data: vtipImageData, isLoading: vtipImageLoading, error: vtipImageError } = useVtipImageQuery(vtipPayload, isModalOpen);

  //#endregion




  // Submit Vtip Popup data
  const submitVtipPopup = () => {
      dispatch(changeVtipHistPayload(
        {
          startTime: vtipStartTime,
          endTime: vtipEndTime,
          parameter: selectedParameter.id as string
        }
      ))
  }


  if (isLoading) return (
    <div className={`${className} p-1`}>
      <DataLoading />
    </div> 
  )
  if (error) return (
    <div className={`${className} p-1`}>
      <VtipHistPopup onSubmitPopup={submitVtipPopup}/>
      <FetchError />
    </div> 
  )


  // Chart modal handler
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
                  vtipImageLoading && (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                          <img width={35} height={35}  src={loader} alt="loader" />
                          <p className='font-semibold text-xs tracking-wider text-blue-600'>Loading data...</p>
                      </div>
                  )
              }
                  
              {
                vtipImageError && (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Unplug width={30} height={30} className='text-red-500'/>
                    <p className='font-semibold text-xs tracking-wider text-red-600'>Error fetching data</p>
                  </div>
                )
              }

              {
                  vtipImageData && !vtipImageLoading && !vtipImageError && (
                      <div className="w-full h-full flex items-center justify-center">
                          <img src={vtipImageData} alt="VTIP Chart" className="max-w-full max-h-full object-contain"/>
                      </div>
                  )
              }
                      
          </ChartModal>

      
          {/* Heading */}
          <div className="p-1 z-10 w-full">
              <h3 className='text-white tracking-wider text-sm'>{data?.name} ({data?.units})</h3>


              <div className="flex gap-2">

                {/* Controls popup */}
                <VtipHistPopup onSubmitPopup={submitVtipPopup}/>
                
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
          <div className="flex-1 mt-8 w-full h-full items-center justify-center ">
            {
              data && (
                <HighchartVtip
                  data={data}
                />
              )
            }
          </div>

    </SectionCard>
  )
}

export default VtipHistChart;
