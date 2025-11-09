import { useState } from "react";
import SectionCard from "../../shared/components/cards/SectionCard";
import VptsHeatmapChart from "../../shared/components/charts/HighchartsVpts";
import DataLoading from "../../shared/components/loader/DataLoading";
import FetchError from "../../shared/components/loader/FetchError";
import { useAppSelector } from "../../store/hooks";
import { useVptsData } from "./hooks/useVptsData";
import ChartModal from "../history_charts/components/ChartModal";
import Tooltip from "../../shared/components/popups/tooltip/Tooltip";
import { Fullscreen, Unplug } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import loader from '../../assets/loader.webp';
import { useVptsImageQuery } from "../history_charts/hooks/useQuery/useVptsImageQuery";


type VptsChartProps = {
  className?: string;
}

const VptsChart = ({className}: VptsChartProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redux
  const { selectedParameter, vptsPayload } = useAppSelector(state => state.vptschart);
  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  // Tanstack
  const { isLoading, data, error } = useVptsData();
  const { data: vptsImageData, isLoading: vptsImageLoading, error: vptsImageError } = useVptsImageQuery(vptsPayload, isModalOpen);



  

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
        <div className="px-1 w-full flex justify-between items-center">
            <h3 className='tracking-wider text-xs'>{selectedParameter.displayText} ({data?.units})</h3>
            {/* Controls */}

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
