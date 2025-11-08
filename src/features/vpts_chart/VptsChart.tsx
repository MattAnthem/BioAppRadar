import SectionCard from "../../shared/components/cards/SectionCard";
import VptsHeatmapChart from "../../shared/components/charts/HighchartsVpts";
import DataLoading from "../../shared/components/loader/DataLoading";
import FetchError from "../../shared/components/loader/FetchError";
import SimpleSelect from "../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../shared/components/selects/types";
import ChartParamsPopup from "../../shared/features/chart-option-popups/ChartParamsPopup";
import { formatChartDateParam } from "../../shared/utils/date_format";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useVptsData } from "./hooks/useVptsData";
import { changeVptsPayload, setSelectedVptsParameterOption } from "./vptsChartSlice";


type VptsChartProps = {
  className?: string;
  showControls?: boolean;
}

const VptsChart = ({className, showControls}: VptsChartProps) => {

  // Redux
  const { parameterOptions, selectedParameter, vptsPayload } = useAppSelector(state => state.vptschart);
  const dispatch = useAppDispatch();

  // Tanstack
  const { isLoading, data, error, refetch } = useVptsData();

  const handleStartTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const raw = evt.target.value; 
    const formatted = formatChartDateParam(raw);
    dispatch(changeVptsPayload({startTime: formatted}));
  }

  const handleEndTimeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const raw = evt.target.value; 
    const formatted = formatChartDateParam(raw);
    dispatch(changeVptsPayload({endTime: formatted}));
  }

  const handleVariableChange = (option: SelectOption) => {
    dispatch(setSelectedVptsParameterOption(option));
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
        <div className="p-1 z-10 w-full border-b">
            <h3 className='tracking-wider text-xs'>{selectedParameter.displayText} ({data?.units})</h3>
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
        </div>           

        {/* Chart */}
        <div className="flex w-full h-full items-center justify-center ">
          {
            data && (
              <VptsHeatmapChart data={data}/>
            )
          }
        </div>

    </SectionCard>
  )
}

export default VptsChart;
