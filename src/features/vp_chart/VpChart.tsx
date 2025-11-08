import SectionCard from "../../shared/components/cards/SectionCard";
import VpChartHighcharts from "../../shared/components/charts/HighchartsVP";
import SimpleSelect from "../../shared/components/selects/SimpleSelect";
import type { SelectOption } from "../../shared/components/selects/types";
import ChartParamsPopup from "../../shared/features/chart-option-popups/ChartParamsPopup";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useVpData } from "./hooks/useVpData";
import { changeVpPayload, setSelectedVpParameterOption } from "./vpChartSlice";
import loader from '../../assets/loader.webp'
import { Unplug } from "lucide-react";

type VpChartProps = {
  className?: string;
  showControls?: boolean;
}

const VpChart = ({ className, showControls }: VpChartProps) => {

  // Redux
  const { parameterOptions, selectedParameter, vpPayload } = useAppSelector(state => state.vpchart);
  const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.altitude);
  const currentHeight = altitudeOptions[currentAltitudeIndex];
  const dispatch = useAppDispatch();

  const { isLoading, data, error, refetch } = useVpData();


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

  return (
    <SectionCard className={`${className} h-full p-1`}>

        {/* Heading */}
        <div className="p-1 z-20 w-full border-b">
            <h3 className='tracking-wider text-xs'>{selectedParameter.displayText} ({data?.units})</h3>

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
        <div className="flex w-full h-full items-center justify-center ">
        {data && (

              <VpChartHighcharts
                data={data}
                selectedHeight={currentHeight}
              />

          )}
        </div>
        {
            isLoading && (
                <div className="absolute z-30 w-full h-full flex items-center justify-center">
                    <img src={loader} alt="loading-data" width={35} height={35}  />
                </div>
            )
        }
        {         
          error && (
            <div className="absolute z-30 w-full h-full flex items-center justify-center">
              <Unplug width={60} height={60} className='text-red-500'/>
            </div> 
        )}

    </SectionCard>
  )
}

export default VpChart;
