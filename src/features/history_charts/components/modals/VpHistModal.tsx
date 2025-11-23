import {memo, useRef, useState, lazy} from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { useTheme } from '../../../../shared/hooks/useTheme';
import { useVpHistData } from '../../hooks/useData/useVpHistData';
import { useVpImageQuery } from '../../hooks/useQuery/useVpImageQuery';
import Tooltip from '../../../../shared/components/popups/tooltip/Tooltip';
import { ChartLine, Fullscreen, ImageIcon, LucideDownload, Unplug } from 'lucide-react';
import Modal from '../../../../shared/components/modal/Modal';
import loader from '../../../../assets/loader.webp';
import type HighchartsReact from 'highcharts-react-official';

const VpChartHighcharts = lazy(() => import('../../../../shared/components/charts/HighchartsVP'));

const VpHistModal = () => {
    const themes = useTheme();
    const { bg, border, hover } = themes.theme.simpleSelect;
    const { active_border, active_text, border: tog_border, hover: tog_hover } = themes.theme.displayTogglerBtn;


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

    // Redux
    const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.hist_altitude);
    const { vpPayload } = useAppSelector(state => state.vp_histchart);
    const currentHeight = altitudeOptions[currentAltitudeIndex];

    // Chart data fetching
    const { isLoading, data, error } = useVpHistData(isModalOpen);
    const { data: vpImageData, isLoading: vpImageLoading, error: vpImageError } = useVpImageQuery(vpPayload, displayMode === 'png');


    
    // handler to open the modal
    const handleOpenModal = () => {
        setIsModalOpen(!isModalOpen);
    }
        // Display mode handlers
    const handleDisplayImage = () => {
        setDisplayMode('png');
    }
    const handleDisplayInteractiveChart = () => {
        setDisplayMode('interactive');
    }

    //  Chart download
    const chartRef = useRef<HighchartsReact.RefObject | null>(null);
    
    const handleDownloadChart = () => {
        const chart = chartRef.current?.chart;
        if (!chart) return;

        chart.exportChartLocal({
                filename: `${vpPayload.species}_${vpPayload.parameter}_${vpPayload.time}`,
                type: 'image/png',
                sourceWidth: chart.chartWidth,
                sourceHeight: chart.chartHeight,
            },
            {
                chart: {
                    backgroundColor: 'white'
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
            }
        )
    }

    // Still image dowloader
    const chartImgRef = useRef<HTMLImageElement | null>(null);

    const handleDowloadChartImg = async () => {
        const img = chartImgRef.current;
        if (!img?.src) return;

        const resp = await fetch(img.src);
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${vpPayload.species}_${vpPayload.parameter}_${vpPayload.time}`;
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
            <button aria-label='Open chart in fullscreen' onClick={handleOpenModal} className={`${bg} ${border} ${hover} rounded-sm p-1`}>
                <Fullscreen width={15} height={15}/>
            </button>
        </Tooltip>
      
        <Modal
            isOpen={isModalOpen}
            title={`${capitalize(data?.query_spec)} ${data?.name ?? '--'}`}
            handle_toggle_mdl={handleOpenModal}
            ariaLabelledBy='vp-mdl'
        >

                {/* Handle display mode */}
                <div className=" px-8 py-2 grid grid-cols-2 justify-start items-center gap-2">
                        <Tooltip
                            display_condition={isModalOpen}
                            position="bottom"
                            text="Display as image"
                        >
                        <button 
                            aria-label='Display interactive chart'
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
                            aria-label='Display image chart'
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

                {(displayMode === 'interactive' && data) && (

                    <div className="w-full h-full flex flex-col p-2 items-center justify-center">

                        <div className="lg:w-1/2 w-full h-full">
                            {/* Download : Dataset/Image */}
                            <div className="flex  w-full justify-end items-end pt-1 px-1">
                                <Tooltip
                                position="bottom"
                                text="Download as image"
                                display_condition={isModalOpen}
                                >
                                <button aria-label='Download interactive chart as png' onClick={handleDownloadChart} className="p-1 bg-sky-800 hover:bg-sky-900 rounded-sm text-white">
                                    <LucideDownload className="w-4 h-4"/>
                                </button>
                                </Tooltip>
                            </div>
                            
                            <VpChartHighcharts
                                data={data}
                                displayTitle
                                selectedHeight={currentHeight}
                                chartHeight={500}
                                ref={chartRef}
                            />
                        </div>
                    </div>

                    )}
                    {
                        vpImageData && !vpImageLoading && !vpImageError && (displayMode === 'png') && (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                    <div className="lg:w-1/2 w-full h-full flex flex-col">
                                        {/* Download image */}
                                        <div className="flex justify-end items-center pt-1 px-1">
                                            <Tooltip
                                                position="bottom"
                                                text="Download image"
                                                display_condition={isModalOpen}
                                            >
                                                <button aria-label='Download chart as image' onClick={handleDowloadChartImg} className="p-1 bg-sky-800 hover:bg-sky-900 rounded-sm text-white">
                                                    <LucideDownload className="w-4 h-4"/> 
                                                </button>
                                            </Tooltip>
                                        </div>
                                        <img ref={chartImgRef} src={vpImageData} alt="VTIP Chart" className="max-w-full max-h-full object-contain"/>
                                    </div>
                            </div>
                        )
                    }
                    {
                    (vpImageLoading || isLoading) && (
                        <div className="w-full h-full flex items-center justify-center">
                            <img src={loader} alt="loading-data" width={30} height={30}  />
                        </div>
                    )
                    }
                    {         
                        (vpImageError || error) && (
                        <div className="w-full h-full flex items-center justify-center">
                            <Unplug width={30} height={30}  className='text-red-500'/>
                        </div> 
                    )}

        </Modal>

    </div>
  )
}

export default memo(VpHistModal);
