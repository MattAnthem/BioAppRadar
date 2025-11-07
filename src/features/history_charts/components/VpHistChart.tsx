import SectionCard from "../../../shared/components/cards/SectionCard";
import VerticalProfileChart from "../../../shared/components/charts/VerticalProfileChart";
import DataLoading from "../../../shared/components/loader/DataLoading";
import FetchError from "../../../shared/components/loader/FetchError";
import SimpleSelect from "../../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../../shared/components/selects/types";
import ChartParamsPopup from "../../../shared/features/chart-option-popups/ChartParamsPopup";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useVpHistData } from "../hooks/useVpHistData";
import { changeVpHistPayload, setSelectedVpHistParameterOption } from "../slices/vpHistChartSlice";



type VpChartProps = {
  className?: string;
  showControls?: boolean;
}

const VpHistChart = ({ className, showControls }: VpChartProps) => {

  // Redux
  const { parameterOptions, selectedParameter, vpPayload } = useAppSelector(state => state.vp_histchart)
  const dispatch = useAppDispatch();

  const { isLoading, data, error, refetch } = useVpHistData();


  const handleDateChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const raw = evt.target.value; 
    const date = new Date(raw);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    dispatch(changeVpHistPayload({time: formatted}))
  }

  const handleVariableChange = (option: SelectOption) => {
    dispatch(setSelectedVpHistParameterOption(option));
    refetch();
  }


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

  return (
    <SectionCard className={`${className} flex flex-col h-[400px] p-1`}>

        {/* Heading */}
        <div className="flex rounded-t-sm justify-between border-white/20 bg-gray-900/55 shadow-md ring-2 ring-black/5 p-1 w-full">
            <h3 className='text-white tracking-wider text-sm'>{selectedParameter.displayText} ({data?.units})</h3>

            {/* controls */}
            {
              showControls && (
                <ChartParamsPopup
                  hoverText="Select Options"
                >

                  <div className="w-full">
                    <small>Select Variable</small>
                    <SimpleSelect
                      options={parameterOptions}
                      value={selectedParameter.displayText}
                      onSelectValue={handleVariableChange}
                      width="w-full"
                    />
                  </div>

                  <div className="w-full mb-2">
                    <small>Select Time</small>
                    <input onChange={handleDateChange} value={vpPayload.time} step={1} className="w-full p-2 border rounded-sm" type="datetime-local" name="date" id="" />
                  </div>
                </ChartParamsPopup>
              )
            }
            
        </div>           

        {/* Chart */}
        <div className="flex-1 w-full h-full items-center justify-center ">
        {data && (

            <VerticalProfileChart
              data={data}
            />

          )}
        </div>

    </SectionCard>
  )
}

export default VpHistChart;
