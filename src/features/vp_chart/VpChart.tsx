import SectionCard from "../../shared/components/cards/SectionCard";
import VerticalProfileChart from "../../shared/components/charts/VerticalProfileChart";
import DataLoading from "../../shared/components/loader/DataLoading";
import FetchError from "../../shared/components/loader/FetchError";
import SimpleSelect from "../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../shared/components/selects/types";
import ChartParamsPopup from "../../shared/features/chart-option-popups/ChartParamsPopup";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useVpData } from "./hooks/useVpData";
import { changeVpPayload, setSelectedVpParameterOption } from "./vpChartSlice";


type VpChartProps = {
  className?: string
}

const VpChart = ({ className }: VpChartProps) => {

  // Redux
  const { parameterOptions, selectedParameter, vpPayload } = useAppSelector(state => state.vpchart)
  const dispatch = useAppDispatch();

  const { isLoading, data, error, refetch } = useVpData();
  // console.log(data)


  const handleDateChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const raw = evt.target.value; 
    const date = new Date(raw);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    dispatch(changeVpPayload({time: formatted}))
  }

  const handleVariableChange = (option: SelectOption) => {
    dispatch(setSelectedVpParameterOption(option));
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
            <h3 className='text-white tracking-wider'>VP (<small>{selectedParameter.displayText}</small>)</h3>

            {/* controls */}
            <ChartParamsPopup>
              <div className="w-full mb-2">
                <small>Select Time</small>
                <input onChange={handleDateChange} value={vpPayload.time} step={1} className="w-full p-2 border rounded-sm" type="datetime-local" name="date" id="" />
              </div>

              <div className="w-full">
                <small>Select Variable</small>
                <SimpleSelect
                  options={parameterOptions}
                  value={selectedParameter.displayText}
                  onSelectValue={handleVariableChange}
                  width="w-full"
                />
              </div>
            </ChartParamsPopup>
            
        </div>           

        {/* Chart */}
        <div className=" w-full h-full items-center justify-center ">
        {data && (

            <VerticalProfileChart
              data={data}
            />

          )}
        </div>

    </SectionCard>
  )
}

export default VpChart;
