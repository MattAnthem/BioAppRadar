import  { useState, memo } from 'react'
import { useTheme } from '../../../shared/hooks/useTheme';
import { useAppSelector } from '../../../store/hooks';
import { useVptsData } from '../hooks/useVptsData';
import { useVptsImageQuery } from '../../history_charts/hooks/useQuery/useVptsImageQuery';
import Tooltip from '../../../shared/components/popups/tooltip/Tooltip';
import { ChartLine, Fullscreen, ImageIcon, LucideDownload, Unplug } from 'lucide-react';
import Modal from '../../../shared/components/modal/Modal';
import { capitalize } from '../../../shared/utils/text_format';
import loader from '../../../assets/loader.webp';
import VptsHeatmapChart from '../../../shared/components/charts/HighchartsVpts';

const VptsModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

    const themes = useTheme();
    const { bg, border, hover } = themes.theme.simpleSelect;

    // handler to open the modal
    const handleOpenModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    // Redux
    const { vptsPayload } = useAppSelector(state => state.vptschart);

    // Tanstack
    const { isLoading, data, error } = useVptsData(isModalOpen);
    const { data: vptsImageData, isLoading: vptsImageLoading, error: vptsImageError } = useVptsImageQuery(vptsPayload, displayMode === 'png');

    // Display mode handlers
    const handleDisplayImage = () => {
        setDisplayMode('png');
    }
    const handleDisplayInteractiveChart = () => {
        setDisplayMode('interactive');
    }

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
            ariaLabelledBy='vpts-mdl'
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
                    <div className="flex flex-col w-full h-full justify-center items-center">
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
                            chartHeight={500}
                        />
                    </div>
                    )
                }

        </Modal>
    </div>
  )
}

export default memo(VptsModal);
