import { useRef, useState, lazy, Suspense } from "react";
import { useTheme } from "../../../shared/hooks/useTheme";
import { useVtipData } from "../hooks/useVtipData";
import { useVtipImageQuery } from "../../history_charts/hooks/useQuery/useVtipImageQuery";
import { useAppSelector } from "../../../store/hooks";
import Tooltip from "../../../shared/components/popups/tooltip/Tooltip";
import { ChartLine, Download, Fullscreen, ImageIcon, LucideDownload, Unplug } from "lucide-react";
import loader from '../../../assets/loader.webp';
import type HighchartsReact from "highcharts-react-official";

const HighchartVtip =  lazy(() => import("../../../shared/components/charts/HighchartsVTIP"));
const Modal = lazy(() => import("../../../shared/components/modal/Modal"));

const VtipModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

    // Redux 
    const { vtipPayload } = useAppSelector(state => state.vtipchart);

    const themes = useTheme();
    const { bg, border, hover } = themes.theme.simpleSelect;
    const { active_border, active_text, border: tog_border, hover: tog_hover } = themes.theme.displayTogglerBtn;


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
            chart: { 
                backgroundColor: 'white',   
            },
            legend: {
                enabled: true,
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                itemStyle: {
                    fontSize: "12px"
                }
            }
        });

    };

    // Image ref
    const chartImgRef = useRef<HTMLImageElement | null>(null);
    // Image downloader handler
    const handleDowloadChartImg = async () => {
        const img = chartImgRef.current;
        if (!img?.src) return;

        const resp = await fetch(img.src);
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${vtipPayload.species}_${vtipPayload.parameter}-${vtipPayload.startTime}_${vtipPayload.endTime}`;
        link.click();

        URL.revokeObjectURL(url);
    }

    const capitalize = (s: string | undefined) => {
        if( s === undefined) return "--";
        return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
    }
  return (
    <div>

        {/* Button open modal */}
        <Tooltip 
            position="bottom" 
            display_condition={!isModalOpen}  
            text={"Open in fullscreen"}
        >                  
            <button
                aria-label="Open VTIP chart in fullscreen" 
                onClick={handleOpenModal} className={`${bg} ${border} ${hover} rounded-sm p-1`}>
                <Fullscreen width={15} height={15}/>
            </button>
        </Tooltip>

        <Suspense fallback={<div></div>}>
            <Modal
                isOpen={isModalOpen}
                title={`${capitalize(data?.query_spec)} ${data?.name ?? '--'}`}
                handle_toggle_mdl={handleOpenModal}
                ariaLabelledBy='vtip-mdl'
            >

                    {/* Handle display mode */}
                    <div className=" px-8 py-2 grid grid-cols-2 justify-start items-center gap-2">
                            <Tooltip
                                display_condition={isModalOpen}
                                position="bottom"
                                text="Display as image"
                            >
                            <button 
                                aria-label="Display interactive chart"
                                onClick={handleDisplayInteractiveChart} 
                                className={`
                                    w-full flex gap-1 justify-center items-center 
                                    px-2 py-0.5 cursor-pointer border-b-2 rounded-t-sm
                                    ${displayMode === 'interactive' ? `${active_border} ${active_text} font-semibold` : tog_border} 
                                    ${tog_hover}
                                `}
                            >
                                <ChartLine className="w-4"/>
                                <h1>Interactive</h1>
                            </button>
                            </Tooltip>

                            <Tooltip
                                display_condition={isModalOpen}
                                position="bottom"
                                text="Display as gif"
                            >
                            <button 
                                aria-label="Display image chart"
                                onClick={handleDisplayImage} 
                                className={`
                                    w-full flex gap-1 justify-center items-center 
                                    px-2 py-0.5 cursor-pointer border-b-2 rounded-t-sm
                                    ${displayMode === 'png' ? `${active_border} ${active_text} font-semibold` : tog_border} 
                                    ${tog_hover}
                                `}
                                >
                                <ImageIcon className="w-4"/>
                                <h1>Image</h1>
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
                            <div className="flex flex-col w-full h-full justify-center items-center">
                                
                                <div className="w-full h-full flex flex-col">

                                    {/* Download image */}
                                    <div className="flex w-full justify-end px-8 items-center pt-1">
                                        <Tooltip
                                            position="bottom"
                                            text="Download image"
                                            display_condition={isModalOpen}
                                        >
                                            <button
                                                aria-label="Download chart image" 
                                                onClick={handleDowloadChartImg} className="p-1 bg-sky-800 hover:bg-sky-900 rounded-sm text-white">
                                                <LucideDownload className="w-4 h-4"/> 
                                            </button>
                                            
                                        </Tooltip>
                                    </div>
                                    <img ref={chartImgRef} src={vtipImageData} alt="VTIP Chart" className="max-w-full max-h-full object-contain"/>
                                </div>
                            </div>
                        )
                    }

                    {
                        (displayMode === 'interactive' && data) && (
                        <div className="flex flex-col w-full h-full justify-center items-center">
                            {/* Download : Dataset/Image */}
                            <div className="flex w-full justify-end items-center px-1">
                                <Tooltip
                                position="bottom"
                                text="Download as image"
                                display_condition={isModalOpen}
                                >
                                    <button
                                        aria-label="Download chart as image" 
                                        onClick={handleDownloadChart} className="p-1 bg-sky-800 hover:bg-sky-900 rounded-sm text-white">
                                        <Download className="w-4 h-4"/>
                                    </button>
                                </Tooltip>
                            </div>
                            <HighchartVtip
                                data={data}
                                title
                                ref={chartRef}
                                chartHeight={450}
                            />
                        </div>
                        )
                    }

            </Modal>
        </Suspense>
      
    </div>
  )
}

export default VtipModal;
