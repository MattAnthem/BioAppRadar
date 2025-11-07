import { useState } from "react";
import GlassHeader from "../../../shared/components/cards/GlassHeader";
import SectionCard from "../../../shared/components/cards/SectionCard";
import VtipLineChart from "../../../shared/components/charts/VtipLineChart";
import DataLoading from "../../../shared/components/loader/DataLoading";
import FetchError from "../../../shared/components/loader/FetchError";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../../shared/components/selects/types";
import ChartParamsPopup from "../../../shared/features/chart-option-popups/ChartParamsPopup";
import { formatChartDateParam } from "../../../shared/utils/date_format";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useVtipHistData } from "../hooks/useVtipHistData";
import { changeVtipHistPayload, setSelectedVtipHistParameterOption } from "../slices/vtipHistChartSlice";
import ChartModal from "./ChartModal";
import { useTheme } from "../../../shared/hooks/useTheme";
import { Fullscreen, Unplug } from "lucide-react";
import Tooltip from "../../../shared/components/popups/tooltip/Tooltip";
import { useVtipImageQuery } from "../hooks/useVtipImageQuery";
import loader from '../../../assets/loader.webp';


type VtipChartProps = {
  className?: string;
  showControls?: boolean;
}

const VtipHistChart = ({ className, showControls }: VtipChartProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redux 
  const { parameterOptions, selectedParameter, vtipPayload } = useAppSelector(state => state.vtipchart)
  const dispatch = useAppDispatch();
  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  // Tanstack

  //#region  Data Fetching
  const { isLoading, data, error, refetch } = useVtipHistData();

  const { data: vtipImageData, isLoading: vtipImageLoading, error: vtipImageError } = useVtipImageQuery(vtipPayload, isModalOpen);

  //#endregion

  //#region  Event Handlers
  const handleStartTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const raw = evt.target.value; 
    const formatted = formatChartDateParam(raw);
    dispatch(changeVtipHistPayload({startTime: formatted}));
  }

  const handleEndTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const raw = evt.target.value; 
    const formatted = formatChartDateParam(raw);
    dispatch(changeVtipHistPayload({endTime: formatted}));
  }

  const handleVariableChange = (option: SelectOption) => {
    dispatch(setSelectedVtipHistParameterOption(option));
    refetch();
  } 
  //#endregion

  if (isLoading) return (
    <div className={`${className} p-1`}>
      <DataLoading />
    </div> 
  )
  if (error) return (
    <div className={`${className} p-1`}>
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
          <GlassHeader className="p-1 z-10 w-full">
              <h3 className='text-white tracking-wider text-sm'>{selectedParameter.displayText} ({data?.units})</h3>


              

              <div className="flex gap-2">
                {/* Controls */}
                {
                  showControls && (
                    <ChartParamsPopup
                      hoverText="Select Options"
                    >

                      <div className="w-ful">
                        <small>Select variable</small>
                        <SimpleSelect
                          options={parameterOptions}
                          value={selectedParameter.displayText}
                          onSelectValue={handleVariableChange}
                          width="w-full"
                        />
                      </div>

                      <div className="w-full mb-2 flex flex-col">
                        <small>Select start Time</small>
                        <input max={vtipPayload.endTime} onChange={handleStartTimeChange} value={vtipPayload.startTime} step={1} className="w-full p-2 mb-2 rounded-sm border" type="datetime-local" name="date" id="start-time" />
                        <small>Select end Time</small>
                        <input min={vtipPayload.startTime} onChange={handleEndTimeChange} value={vtipPayload.endTime} step={1} className="w-full p-2 rounded-sm border" type="datetime-local" name="date" id="end-time" />
                      </div>

                    </ChartParamsPopup>
                  )
                }
                
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

          </GlassHeader>

          {/* Chart */}
          <div className="flex-1 w-full h-full items-center justify-center ">
            {
              data && (
                <VtipLineChart
                  data={data}
                />
              )
            }
          </div>

    </SectionCard>
  )
}

export default VtipHistChart;
