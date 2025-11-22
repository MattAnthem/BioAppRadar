import { useState, memo, useRef } from 'react';
import Modal from '../../../shared/components/modal/Modal';
import { useVpImageQuery } from '../../history_charts/hooks/useQuery/useVpImageQuery';
import { useAppSelector } from '../../../store/hooks';
import { useVpData } from '../hooks/useVpData';
import Tooltip from '../../../shared/components/popups/tooltip/Tooltip';
import { ChartLine, Fullscreen, ImageIcon, LucideDownload, Unplug } from 'lucide-react';
import loader from '../../../assets/loader.webp';
import VpChartHighcharts from '../../../shared/components/charts/HighchartsVP';
import { useTheme } from '../../../shared/hooks/useTheme';
import { capitalize } from '../../../shared/utils/text_format';
import type HighchartsReact from 'highcharts-react-official';

const VpModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

    const themes = useTheme();
    const { bg, border, hover } = themes.theme.simpleSelect;

    // handler to open the modal
    const handleOpenModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    // Redux
    const { currentAltitudeIndex, altitudeOptions } = useAppSelector(state => state.altitude);
    const currentHeight = altitudeOptions[currentAltitudeIndex];

    const { vpPayload } = useAppSelector(state => state.vpchart);
    const { isLoading, data, error } = useVpData(isModalOpen);
    const { data: vpImageData, isLoading: vpImageLoading, error: vpImageError } = useVpImageQuery(vpPayload, displayMode === 'png');


    // Display mode handlers
    const handleDisplayImage = () => {
        setDisplayMode('png');
    }
    const handleDisplayInteractiveChart = () => {
        setDisplayMode('interactive');
    }


    // Chart dowload
    const chartRef = useRef<HighchartsReact.RefObject | null>(null);

    // Handler de téléchargement
    const handleDownloadChart = () => {
        const chart = chartRef.current?.chart;
        if (!chart) return;

        chart.exportChartLocal({
            filename: `${vpPayload.species}_${vpPayload.parameter}_${vpPayload.time}`,
            type: 'image/png',
            sourceWidth: chart.chartWidth,
            sourceHeight: chart.chartHeight,
        },{
            chart: {
                backgroundColor: 'white'
            }
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
            ariaLabelledBy='vp-mdl'

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

                { (displayMode === 'interactive' && data) && (
                    <div className="w-full h-full flex flex-col  items-center justify-center">
                    <div className="lg:w-1/2 w-full h-full">
                            {/* Download : Dataset/Image */}
                            <div className="flex w-full justify-end items-end pt-1 px-1">
                            <Tooltip
                                position="bottom"
                                text="Download as Image"
                                display_condition={isModalOpen}
                            >
                                <button onClick={handleDownloadChart} className="p-1 bg-sky-800 hover:bg-sky-900 rounded-sm text-white">
                                    <LucideDownload className="w-4 h-4"/>
                                </button>
                            </Tooltip>
                            </div>
                            <VpChartHighcharts
                                ref={chartRef}
                                data={data}
                                displayTitle
                                chartHeight={500}
                                selectedHeight={currentHeight}
                            />
                    </div>
                    </div>

                )}

                {
                    vpImageData && !vpImageLoading && !vpImageError && (displayMode === 'png') && (
                        <div className="w-full h-full flex items-center justify-center">
                            <img src={vpImageData} alt="VTIP Chart" className="max-w-full max-h-full object-contain"/>
                        </div>
                    )
                }
                {
                    (vpImageLoading || isLoading) && (
                        <div className="absolute z-30 w-full h-full flex items-center justify-center">
                            <img src={loader} alt="loading-data" width={35} height={35}  />
                        </div>
                    )
                }
                {         
                    (vpImageError || error) && (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <Unplug width={30} height={30} className='text-red-500'/>
                        <p className='font-semibold text-xs tracking-wider text-red-600'>Error fetching data</p>
                    </div>
                )}

        
        </Modal>
    </div>
  )
}

export default memo(VpModal);
