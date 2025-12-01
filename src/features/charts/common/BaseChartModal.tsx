import { Suspense, useRef, type RefObject, lazy } from "react";
import { useTheme } from "../../../shared/hooks/useTheme";
import Tooltip from "../../../shared/components/popups/tooltip/Tooltip";
import { FileTextIcon, Fullscreen, LucideDownload, SheetIcon, Unplug } from "lucide-react";
import type HighchartsReact from "highcharts-react-official";
import loader from '../../../assets/loader.webp';
import { useDownloadChart } from "./hook/useDownloadChart";

const MdlChartDisplayMode = lazy(() => import("./component/MdlChartDisplayMode"));
const Modal = lazy(() => import("../../../shared/components/modal/Modal"));

type BaseChartModalProps<TData> = {
    title: string | null;
    data: TData | undefined;
    dataLoading: boolean;
    dataError: Error | null;
    dataImage: Base64URLString;
    imageError: Error | null;
    imageLoading: boolean;
    isModalOpen: boolean;
    toggleModal: () => void;
    displayMode: 'png' | 'interactive';
    handleDisplayImage: () => void;
    handleDisplayInteractiveChart: () => void;
    downloadFilename?: string;
    selectedHeight?: number;


    renderInteractive: (chartRef: RefObject<HighchartsReact.RefObject | null>) => React.ReactNode;
    renderImage: (imgRef: React.RefObject<HTMLImageElement | null>) => React.ReactNode;
}

function BaseChartModal<TData>({
    data,
    dataError,
    dataLoading,
    displayMode,
    handleDisplayImage,
    handleDisplayInteractiveChart,
    imageError,
    isModalOpen,
    title,
    toggleModal,
    imageLoading,
    downloadFilename,
    renderImage,
    renderInteractive
}: Readonly<BaseChartModalProps<TData>>){
    const themes = useTheme();
    const { bg, border, hover } = themes.theme.simpleSelect;
    const { active_border, active_text, border: tog_border, hover: tog_hover } = themes.theme.displayTogglerBtn;

    // Dowload the chart
    const chartRef = useRef<HighchartsReact.RefObject | null>(null);
    // Image ref
    const chartImgRef = useRef<HTMLImageElement | null>(null);

    const { downloadInteractiveChart, downloadChartImage, dowloadChartAsPDF, dowloadDataCSV } = useDownloadChart({
        filename: downloadFilename ?? 'chart',
        highchartsRef: chartRef,
        chartImgRef: chartImgRef
    })

    return (
        <div>
            {/* Button open modal */}
            <Tooltip 
                position="bottom" 
                display_condition={!isModalOpen}  
                text={"Open in fullscreen"}
            >                  
                <button
                    aria-label='open-fullscreen-modal'
                    onClick={toggleModal} className={`${bg} ${border} ${hover} rounded-sm p-1`}>
                    <Fullscreen width={15} height={15}/>
                </button>
            </Tooltip>
            
            <Suspense fallback={<div></div>}>
                <Modal
                    isOpen={isModalOpen}
                    title={title ?? ''}
                    handle_toggle_mdl={toggleModal}
                    ariaLabelledBy='vp-mdl'

                >

                        {/* Handle display mode */}
                        <MdlChartDisplayMode
                            active_border={active_border}
                            active_text={active_text}
                            displayMode={displayMode}
                            handleDisplayImage={handleDisplayImage}
                            handleDisplayInteractiveChart={handleDisplayInteractiveChart}
                            isModalOpen={isModalOpen}
                            tog_border={tog_border}
                            tog_hover={tog_hover}
                        />

                        { (displayMode === 'interactive' && data) && (
                            <div className="w-full h-full flex flex-col  items-center justify-center">
                                        {/* Download : Dataset/Image/Pdf */}
                                        <div className="flex w-full justify-end items-end pt-1 px-1 gap-1.5">
                                            <Tooltip
                                                position="bottom"
                                                text="Download as Image"
                                                display_condition={isModalOpen}
                                            >
                                                <button 
                                                    aria-label='download-interactive-chart-img'
                                                    onClick={downloadInteractiveChart} className="p-1 bg-sky-800 hover:bg-sky-900 rounded-sm text-white">
                                                    <LucideDownload className="w-4 h-4"/>
                                                </button>
                                            </Tooltip>
                                            <Tooltip
                                                position="bottom"
                                                text="Download as PDF"
                                                display_condition={isModalOpen}
                                            >
                                                <button 
                                                    aria-label='download-interactive-chart-pdf'
                                                    onClick={dowloadChartAsPDF} className="p-1 bg-sky-800 hover:bg-sky-900 rounded-sm text-white">
                                                    <FileTextIcon className="w-4 h-4"/>
                                                </button>
                                            </Tooltip>
                                            <Tooltip
                                                position="bottom"
                                                text="Download as CSV"
                                                display_condition={isModalOpen}
                                            >
                                                <button 
                                                    aria-label='download-interactive-chart-data-csv'
                                                    onClick={dowloadDataCSV} className="p-1 bg-sky-800 hover:bg-sky-900 rounded-sm text-white">
                                                    <SheetIcon className="w-4 h-4"/>
                                                </button>
                                            </Tooltip>
                                        </div>

                                        {/* interactive chart */}
                                        {renderInteractive(chartRef)}

                            </div>

                        )}

                        {
                            ImageData && !imageLoading && !imageError && (displayMode === 'png') && (
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                        <div className=" w-full h-full flex flex-col">
                                            {/* Download image */}
                                            <div className="flex justify-end items-center pt-1 px-1">
                                                <Tooltip
                                                    position="bottom"
                                                    text="Download image"
                                                    display_condition={isModalOpen}
                                                >
                                                    <button
                                                        aria-label='download-chart-image'
                                                        onClick={downloadChartImage} className="p-1 bg-sky-800 hover:bg-sky-900 rounded-sm text-white">
                                                        <LucideDownload className="w-4 h-4"/> 
                                                    </button>
                                                </Tooltip>
                                            </div>
                                            {/* Chart image */}
                                            {renderImage(chartImgRef)}
                                        </div>
                                </div>
                            )
                        }
                        {
                            (imageLoading || dataLoading) && (
                                <div className="w-full h-full flex items-center justify-center">
                                    <img src={loader} alt="loading-data" width={35} height={35}  />
                                </div>
                            )
                        }
                        {         
                            (imageError || dataError) && (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                <Unplug width={30} height={30} className='text-red-500'/>
                                <p className='font-semibold text-xs tracking-wider text-red-600'>Error fetching data</p>
                            </div>
                        )}

                
                </Modal>
            </Suspense>
        </div>
    );

}

export default BaseChartModal;