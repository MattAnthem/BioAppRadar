import SectionCard from "../../../shared/components/cards/SectionCard";
import VpChartHighcharts from "../../../shared/components/charts/HighchartsVP";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useVpHistData } from "../hooks/useData/useVpHistData";
import { changeVpHistPayload } from "../slices/vpHistChartSlice";
import VpHistPopup from "./popups/VpHistPopup";
import loader from '../../../assets/loader.webp';
import { Unplug } from "lucide-react";



type VpChartProps = {
  className?: string;
}

const VpHistChart = ({ className }: VpChartProps) => {

  // Redux
  const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.hist_altitude);
  const { selectedParameter, vpTime } = useAppSelector(state => state.vp_histchart);
  const currentHeight = altitudeOptions[currentAltitudeIndex];
  const dispatch = useAppDispatch();

  const { isLoading, data, error } = useVpHistData();


  const onSubmitVpPopup = () => {
    dispatch(changeVpHistPayload({
      parameter: selectedParameter.id as string,
      time: vpTime,
    }))
  }





  return (
    <SectionCard className={`${className} h-full flex flex-col`}>

        {/* Heading */}
        <div className="px-1 w-full flex justify-between items-center">
            <h3 className='tracking-wider text-xs'>{data?.name} ({data?.units})</h3>
            
            {/* controls */}
            <VpHistPopup
              onSubmitPopup={onSubmitVpPopup}
            />
            
        </div>           

        {/* Chart */}
        <div className="flex-1 w-full min-h-0 overflow-hidden">
        {data && (

          <VpChartHighcharts
            data={data}
            selectedHeight={currentHeight}
          />

        )}

        {
            isLoading && (
                <div className="absolute z-40 w-full h-full flex items-center justify-center">
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

        </div>

    </SectionCard>
  )
}

export default VpHistChart;
