import Tooltip from '../../../../shared/components/popups/tooltip/Tooltip';
import { ChartLine, ImageIcon } from 'lucide-react';

type MdlChartDisplayProps =  {
    isModalOpen: boolean;
    displayMode: 'png' | 'interactive';
    handleDisplayImage: () => void;
    handleDisplayInteractiveChart: () => void;
    active_border: string;
    active_text: string;
    tog_border: string;
    tog_hover: string;
}

const MdlChartDisplayMode = ({
    isModalOpen,
    displayMode,
    handleDisplayImage,
    handleDisplayInteractiveChart,
    active_border,
    active_text,
    tog_border,
    tog_hover
}: MdlChartDisplayProps) => {
  return (
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
            <h1 className='text-[clamp(0.8rem,0.8vw,2rem)]'>Interactive</h1>
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
            <h1 className='text-[clamp(0.8rem,0.8vw,2rem)]'>Image</h1>
        </button>
        </Tooltip>
    </div>
  )
}

export default MdlChartDisplayMode;
