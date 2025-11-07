import { useState } from "react";
import GlassHeader from "../../../shared/components/cards/GlassHeader";
import SectionCard from "../../../shared/components/cards/SectionCard";
import VerticalProfileHeatmap from "../../../shared/components/charts/VerticalProfileHeatmap";
import DataLoading from "../../../shared/components/loader/DataLoading";
import FetchError from "../../../shared/components/loader/FetchError";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../../shared/components/selects/types";
import ChartParamsPopup from "../../../shared/features/chart-option-popups/ChartParamsPopup";
import { useTheme } from "../../../shared/hooks/useTheme";
import { formatChartDateParam } from "../../../shared/utils/date_format";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useVptsHistData } from "../hooks/useVptsHistData";
import { useVptsImageQuery } from "../hooks/useVptsImageQuery";
import { changeVptsHistPayload, setSelectedVptsHistParameterOption } from "../slices/vptsHistChartSlice";
import ChartModal from "./ChartModal";
import { Fullscreen, Unplug } from "lucide-react";
import Tooltip from "../../../shared/components/popups/tooltip/Tooltip";
import loader from '../../../assets/loader.webp';


type VptsChartProps = {
  className?: string;
  showControls?: boolean;
}

const VptsHistChart = ({className, showControls}: VptsChartProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redux
  const { parameterOptions, selectedParameter, vptsPayload } = useAppSelector(state => state.vpts_histchart);
  const dispatch = useAppDispatch();

  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  // Tanstack
  const { isLoading, data, error, refetch } = useVptsHistData();

  const { data: vptsImageData, isLoading: vptsImageLoading, error: vptsImageError } = useVptsImageQuery(vptsPayload, isModalOpen);



  const handleStartTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const raw = evt.target.value; 
    const formatted = formatChartDateParam(raw);
    dispatch(changeVptsHistPayload({startTime: formatted}));
  }

  const handleEndTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const raw = evt.target.value; 
    const formatted = formatChartDateParam(raw);
    dispatch(changeVptsHistPayload({endTime: formatted}));
  }

  const handleVariableChange = (option: SelectOption) => {
    dispatch(setSelectedVptsHistParameterOption(option));
    refetch();
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
        <GlassHeader className="p-1 z-10 w-full">
            <h3 className='text-white tracking-wider text-sm'>{selectedParameter.displayText} ({data?.units})</h3>
            
            <div className="flex gap-2">
              {/* Controls */}
              {
                showControls && (
                  <ChartParamsPopup hoverText="Select Options">

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
                      <input max={vptsPayload.endTime} onChange={handleStartTimeChange} value={vptsPayload.startTime} step={1} className="w-full p-2 mb-2 rounded-sm border" type="datetime-local" name="date" id="start-time" />
                      <small>Select end Time</small>
                      <input min={vptsPayload.startTime} onChange={handleEndTimeChange} value={vptsPayload.endTime} step={1} className="w-full p-2 rounded-sm border" type="datetime-local" name="date" id="end-time" />
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
        <div className="flex w-full h-full items-center justify-center ">
          {
            data && (
              <VerticalProfileHeatmap data={data}/>
            )
          }
        </div>

    </SectionCard>
  )
}

export default VptsHistChart;
