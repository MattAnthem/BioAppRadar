import GlassHeader from "../../../shared/components/cards/GlassHeader";
import SectionCard from "../../../shared/components/cards/SectionCard";
import VerticalProfileHeatmap from "../../../shared/components/charts/VerticalProfileHeatmap";
import DataLoading from "../../../shared/components/loader/DataLoading";
import FetchError from "../../../shared/components/loader/FetchError";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../../shared/components/selects/types";
import ChartParamsPopup from "../../../shared/features/chart-option-popups/ChartParamsPopup";
import { formatChartDateParam } from "../../../shared/utils/date_format";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useVptsHistData } from "../hooks/useVptsHistData";
import { changeVptsHistPayload, setSelectedVptsHistParameterOption } from "../slices/vptsHistChartSlice";



type VptsChartProps = {
  className?: string;
  showControls?: boolean;
}

const VptsHistChart = ({className, showControls}: VptsChartProps) => {

  // Redux
  const { parameterOptions, selectedParameter, vptsPayload } = useAppSelector(state => state.vpts_histchart);
  const dispatch = useAppDispatch();

  // Tanstack
  const { isLoading, data, error, refetch } = useVptsHistData();

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

  return (
    <SectionCard className={`${className} p-1`}>

        {/* Heading */}
        <GlassHeader className="p-1 z-10 w-full">
            <h3 className='text-white tracking-wider text-sm'>{selectedParameter.displayText} ({data?.units})</h3>
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
