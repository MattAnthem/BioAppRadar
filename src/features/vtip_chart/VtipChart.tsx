import { useState } from "react";
import SectionCard from "../../shared/components/cards/SectionCard";
import HighchartVtip from "../../shared/components/charts/HighchartsVTIP";
import DataLoading from "../../shared/components/loader/DataLoading";
import FetchError from "../../shared/components/loader/FetchError";
import { useAppSelector } from "../../store/hooks"
import { useVtipData } from "./hooks/useVtipData";
import { useVtipImageQuery } from "../history_charts/hooks/useVtipImageQuery";
import ChartModal from "../history_charts/components/ChartModal";
import { Fullscreen, Unplug } from "lucide-react";
import loader from '../../assets/loader.webp';
import Tooltip from "../../shared/components/popups/tooltip/Tooltip";
import { useTheme } from "../../shared/hooks/useTheme";


type VtipChartProps = {
  className?: string;
}

const VtipChart = ({ className }: VtipChartProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redux 
  const {  selectedParameter, vtipPayload } = useAppSelector(state => state.vtipchart)
  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  // Tanstack
  const { isLoading, data, error } = useVtipData();
  const { data: vtipImageData, isLoading: vtipImageLoading, error: vtipImageError } = useVtipImageQuery(vtipPayload, isModalOpen);


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
          <div className="p-1 w-full flex items-center justify-between">
              <h3 className='tracking-wider text-xs'>{selectedParameter.displayText} ({data?.units})</h3>

                {/* Open the modal */}
                <Tooltip 
                  position="bottom" 
                  display_condition={!isModalOpen}  
                  text={"Open in fullscreen"}
                >                  
                  <button onClick={handleOpenModal} className={`${bg} ${border} ${hover} rounded-sm p-1`}>
                      <Fullscreen width={15} height={15}/>
                  </button>
                </Tooltip>


          </div>

          {/* Chart */}
          <div className="flex-1 w-full h-full items-center justify-center ">
            {
              data && (
                <HighchartVtip
                  data={data}
                />
              )
            }
          </div>

    </SectionCard>
  )
}

export default VtipChart;
