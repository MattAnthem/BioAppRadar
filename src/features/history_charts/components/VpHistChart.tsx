import GlassHeader from "../../../shared/components/cards/GlassHeader";
import SectionCard from "../../../shared/components/cards/SectionCard";
import VpChartHighcharts from "../../../shared/components/charts/HighchartsVP";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useVpHistData } from "../hooks/useVpHistData";
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
    <SectionCard className={`${className} p-1`}>

        {/* Heading */}
        <GlassHeader className="p-1 z-20 w-full">
            <h3 className='text-white tracking-wider text-sm'>{data?.name} ({data?.units})</h3>
            
            {/* controls */}
            <VpHistPopup
              onSubmitPopup={onSubmitVpPopup}
            />
            
        </GlassHeader>           

        {/* Chart */}
        <div className="flex-1 w-full h-full items-center justify-center ">
        {data && (

          <VpChartHighcharts
            data={data}
            selectedHeight={currentHeight}
          />

        )}

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

        </div>

    </SectionCard>
  )
}

export default VpHistChart;
