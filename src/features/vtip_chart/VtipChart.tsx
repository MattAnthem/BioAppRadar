import { useState } from "react";
import SectionCard from "../../shared/components/cards/SectionCard";
import HighchartVtip from "../../shared/components/charts/HighchartsVTIP";
import { useAppSelector } from "../../store/hooks"
import { useVtipData } from "./hooks/useVtipData";
import ChartModal from "../history_charts/components/ChartModal";
import { Fullscreen, Unplug } from "lucide-react";
import loader from '../../assets/loader.webp';
import Tooltip from "../../shared/components/popups/tooltip/Tooltip";
import { useTheme } from "../../shared/hooks/useTheme";
import { useVtipImageQuery } from "../history_charts/hooks/useQuery/useVtipImageQuery";


type VtipChartProps = {
  className?: string;
}

const VtipChart = ({ className }: VtipChartProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

  // Redux 
  const {  selectedParameter, vtipPayload } = useAppSelector(state => state.vtipchart)
  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  // Tanstack
  const { isLoading, data, error } = useVtipData();
  const { data: vtipImageData, isLoading: vtipImageLoading, error: vtipImageError } = useVtipImageQuery(vtipPayload, displayMode === 'png');



  // handler to open the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayMode(e.target.value as 'png' | 'interactive');
  }


  return (
    <SectionCard className={`${className} w-full h-full flex flex-col`}>

          {/* Modal chart */}
          <ChartModal
              isModalOpen={isModalOpen}
              modalTitle={`${selectedParameter.displayText} Chart`}
              mdlToggler_func={() => setIsModalOpen(false)}
          >
            
            {/* Handle display mode */}
            <div className="w-full flex justify-center items-center p-1 gap-2">
                <p className="text-sm">Display as :</p>

                <input
                  type="radio"
                  name="display"
                  value="png"
                  checked={displayMode === 'png'}
                  onChange={handleDisplayChange}
                  id="disp_image"
                />
                <label htmlFor="disp_image" className="text-xs">PNG</label>

                <input
                  type="radio"
                  name="display"
                  value="interactive"
                  checked={displayMode === 'interactive'}
                  onChange={handleDisplayChange}
                  id="disp_interactive"
                />
                <label htmlFor="disp_interactive" className="text-xs">Interactive Chart</label>
              </div>

              {
                  (vtipImageLoading || isLoading)  && (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                          <img width={35} height={35}  src={loader} alt="loader" />
                          <p className='font-semibold text-xs tracking-wider text-blue-600'>Loading data...</p>
                      </div>
                  )
              }
                  
              {
                (vtipImageError || error) && (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Unplug width={30} height={30} className='text-red-500'/>
                    <p className='font-semibold text-xs tracking-wider text-red-600'>Error fetching data</p>
                  </div>
                )
              }

              {
                  vtipImageData && !vtipImageLoading && !vtipImageError && (displayMode === 'png') && (
                      <div className="w-full h-full flex items-center justify-center">
                          <img src={vtipImageData} alt="VTIP Chart" className="max-w-full max-h-full object-contain"/>
                      </div>
                  )
              }

              {
                (displayMode === 'interactive' && data) && (
                  <div className="flex w-full h-full justify-center items-center">
                    <HighchartVtip
                      data={data}
                      displayTitle
                      chartHeight={500}
                    />
                  </div>
                )
              }
                      
          </ChartModal>
      

          {/* Heading */}
          <div className="p-1 w-full flex items-center justify-between">
              <h3 className='tracking-wider text-xs font-semibold'>{`${data?.name ?? '--'} (${data?.units ?? '--'})`}</h3>

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
          <div className="h-full grid">
            {
              data && (
                <HighchartVtip
                  data={data}
                />
              )
            }
            {
              isLoading && (
                  <div className="w-full h-full flex items-center justify-center">
                      <img src={loader} alt="loading-vphist" width={35} height={35}  />
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

export default VtipChart;
