import { useRef, useState } from "react";
import { useTheme } from "../../../shared/hooks/useTheme";
import { useVtipData } from "../hooks/useVtipData";
import { useVtipImageQuery } from "../../history_charts/hooks/useQuery/useVtipImageQuery";
import { useAppSelector } from "../../../store/hooks";
import Tooltip from "../../../shared/components/popups/tooltip/Tooltip";
import { ChartLine, Download, Fullscreen, ImageIcon, Unplug } from "lucide-react";
import Modal from "../../../shared/components/modal/Modal";
import { capitalize } from "../../../shared/utils/text_format";
import HighchartVtip from "../../../shared/components/charts/HighchartsVTIP";
import loader from '../../../assets/loader.webp';
import type HighchartsReact from "highcharts-react-official";

const VtipModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

    // Redux 
    const { vtipPayload } = useAppSelector(state => state.vtipchart);

    const themes = useTheme();
    const { bg, border, hover } = themes.theme.simpleSelect;

    // handler to open the modal
    const handleOpenModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    // Tanstack
    const { isLoading, data, error } = useVtipData(isModalOpen);
    const { data: vtipImageData, isLoading: vtipImageLoading, error: vtipImageError } = useVtipImageQuery(vtipPayload, displayMode === 'png');

    // Display mode handlers
    const handleDisplayImage = () => {
        setDisplayMode('png');
    }
    const handleDisplayInteractiveChart = () => {
        setDisplayMode('interactive');
    }

    // Dowload the chart
    const chartRef = useRef<HighchartsReact.RefObject | null>(null);


    // Handler de téléchargement
    const handleDownloadChart = () => {
        const chart = chartRef.current?.chart;
        if (!chart) return;
    

        chart.exportChartLocal({
                filename: `${vtipPayload.species}_${vtipPayload.parameter}-${vtipPayload.startTime}_${vtipPayload.endTime}`,
                type: 'image/png',
                sourceWidth: chart.chartWidth,
                sourceHeight: chart.chartHeight,
            }, {
            chart: { backgroundColor: 'white' }
        });

    };

  return (
    <div>

        {/* Button open modal */}
        <Tooltip 
            position="bottom" 
            display_condition={!isModalOpen}  
            text={"Open in fullscreen"}
        >                  
            <button onClick={handleOpenModal} className={`${bg} ${border} ${hover} rounded-sm p-1`}>
                <Fullscreen width={15} height={15}/>
            </button>
        </Tooltip>

        <Modal
            isOpen={isModalOpen}
            title={`${capitalize(data?.query_spec)} ${data?.name ?? '--'}`}
            handle_toggle_mdl={handleOpenModal}
            ariaLabelledBy='vtip-mdl'
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
                    <div className="flex flex-col w-full h-full justify-start items-center">
                        {/* Download : Dataset/Image */}
                        <div className="flex w-full justify-end items-center px-1">
                            <Tooltip
                            position="bottom"
                            text="Download as image"
                            display_condition={isModalOpen}
                            >
                            <button onClick={handleDownloadChart} className="p-1 bg-sky-800 hover:bg-sky-900 rounded-sm text-white">
                                <Download className="w-4 h-4"/>
                            </button>
                            </Tooltip>
                        </div>
                        <HighchartVtip
                            data={data}
                            title
                            ref={chartRef}
                        />
                    </div>
                    )
                }

        </Modal>
      
    </div>
  )
}

export default VtipModal;
