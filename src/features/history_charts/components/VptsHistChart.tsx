import React,{ useRef, useState } from "react";
import SectionCard from "../../../shared/components/cards/SectionCard";
import { useTheme } from "../../../shared/hooks/useTheme";
import { ChartLine, Fullscreen, ImageIcon, LucideDownload, Unplug } from "lucide-react";
import loader from '../../../assets/loader.webp';
import VptsHeatmapChart from "../../../shared/components/charts/HighchartsVpts";
import { useVptsHistData } from "../hooks/useData/useVptsHistData";
import { useVptsHistImagaData } from "../hooks/useData/useVptsHistImagaData";
import { capitalize } from "../../../shared/utils/text_format";

const ChartModal = React.lazy(() => import('./ChartModal'));
const Tooltip = React.lazy(() => import('../../../shared/components/popups/tooltip/Tooltip'));
const VptsHistPopup = React.lazy(() => import('./popups/VptsHistPopup'));

type VptsChartProps = {
  className?: string;
}

const VptsHistChart = ({className}: VptsChartProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

  // Chart ref
  const chartRef = useRef(null);


  const themes = useTheme();
  const { bg, border, hover } = themes.theme.simpleSelect;

  // Tanstack
  const { isLoading, data, error } = useVptsHistData();

  const { data: vptsImageData, isLoading: vptsImageLoading, error: vptsImageError } = useVptsHistImagaData(displayMode === 'png');





  // handler to open the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleDisplayImage = () => {
    setDisplayMode('png');
  }
  const handleDisplayInteractiveChart = () => {
    setDisplayMode('interactive');
  }

  return (
    <SectionCard className={`${className} w-full h-full flex flex-col`}>


          {/* Modal chart */}
          <ChartModal
              isModalOpen={isModalOpen}
              modalTitle={`${data?.name} chart`}
              mdlToggler_func={handleCloseModal}
          >

              {/* Handle display mode */}
              <div className="w-full flex justify-start items-center p-1 gap-1">
                <Tooltip
                  display_condition={isModalOpen}
                  position="bottom"
                  text="Display as interactive chart"
                >
                  <button onClick={handleDisplayInteractiveChart} className={`px-2 py-0.5 ${displayMode === 'interactive' ? 'bg-sky-800 border-sky-900 text-white hover:bg-sky-900' : 'border-gray-400 hover:bg-gray-300'} rounded-sm cursor-pointer border-2`}>
                      <ChartLine className="w-4"/>
                  </button>
                </Tooltip>

                <Tooltip
                  display_condition={isModalOpen}
                  position="bottom"
                  text="Display as image"
                >
                  <button onClick={handleDisplayImage} value={'png'} className={`px-2 py-0.5 ${displayMode === 'png' ? 'bg-sky-800 border-sky-900 text-white hover:bg-sky-900' : 'border-gray-400 hover:bg-gray-300'}  rounded-sm cursor-pointer border-2`}>
                      <ImageIcon className="w-4"/>
                  </button>
                </Tooltip>


              </div>



              {
                  (vptsImageLoading || isLoading) && (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                          <img width={35} height={35}  src={loader} alt="loader" />
                          <p className='font-semibold text-xs tracking-wider text-blue-600'>Loading data...</p>
                      </div>
                  )
              }
                  
              {
                (vptsImageError || error) && (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Unplug width={30} height={30} className='text-red-500'/>
                    <p className='font-semibold text-xs tracking-wider text-red-600'>Error fetching data</p>
                  </div>
                )
              }

              {
                  vptsImageData && !vptsImageLoading && !vptsImageError && (displayMode === 'png') && (
                      <div className="w-full h-full flex items-center justify-center">
                          <img src={vptsImageData} alt="VTIP Chart" className="max-w-full max-h-full object-contain"/>
                      </div>
                  )
            }
			      {
                (displayMode === 'interactive' && data) && (
                  <div className="flex flex-col w-full h-full justify-start items-center">

                      {/* Download : Dataset/Image */}
                      <div className="flex w-full justify-end items-center px-1">
                        <Tooltip
                          position="bottom"
                          text="Download chart"
                          display_condition={isModalOpen}
                        >
                          <button className="p-1 bg-sky-800 hover:bg-sky-900 rounded-sm text-white">
                            <LucideDownload className="w-4 h-4"/>
                          </button>
                        </Tooltip>
                      </div>

                      <VptsHeatmapChart 
                        
                        data={data} 
                        title
                        legend
                      />

                  </div>
                )
            }
                      
          </ChartModal>

        {/* Heading */}
        <div className="p-1 w-full flex justify-between items-center">
            <h3 className='tracking-wider text-xs font-semibold'>{`${capitalize(data?.query_spec)} - ${data?.name ?? '--'} (${data?.units ?? '--'}) `}</h3>
            
            <div className="flex gap-2">
              
                {/* Controls */}
                <VptsHistPopup />


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
        </div>           

        {/* Chart */}
        <div className="h-full grid px-2 pb-2">
          {
            data && (
              <VptsHeatmapChart data={data}/>
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

export default VptsHistChart;
