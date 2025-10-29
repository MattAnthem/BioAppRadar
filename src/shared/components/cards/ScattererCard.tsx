import { ChartNoAxesColumn, Moon, Sun } from 'lucide-react';
import  { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

type ScattererCardProps = {
    scattererType: string;
    scattererNumber: number;
    mtr_day: number;
    trr_day: number;
    vid_day: number;
    vir_day: number;
    mtr_night: number;
    trr_night: number;
    vid_night: number;
    vir_night: number;
    alert?: string;
}


/**
 * Card to show overview of scatterers 
 * @param scattererType 
 * @param scattererNumber 
 * @param mtr_day: Migration traffic rate day 
 * @returns 
 */
const ScattererCard = (props: ScattererCardProps) => {
    const { scattererType, scattererNumber, mtr_day, trr_day, vid_day, vir_day, mtr_night, trr_night, vid_night, vir_night, alert } = props;
    const [isShowDetails, setIsShowDetails] = useState(false);

    const themes = useTheme();
    const {scattererCard} = themes.theme;
    
    // Theme colors
    const { bg, border, details_bg, shadow, primary_text, secondary_text } = scattererCard;

    const handleShowDetails = () => {
        setIsShowDetails(!isShowDetails);
    }
  return (
    <div aria-label='stat-card' className={`relative rounded-sm border-2 ${border} ${bg} p-2 ${shadow}`}>
      
        <div className="w-full p-2">
            <h2 className={`${primary_text} text-2xl font-semibold`}>{scattererNumber.toLocaleString('en-US')} {scattererType}</h2>
            <p className={secondary_text}>Total {scattererType} detected</p>
            <p className='text-blue-600'>{alert}</p>
        </div>

        <div className="flex w-full justify-end ">
            <button onClick={() => handleShowDetails()} className='p-1 rounded-sm hover:bg-blue-800 bg-blue-700 cursor-pointer'>
                <ChartNoAxesColumn className='text-white' />
            </button>
        </div>

        <div className={`${details_bg}  p-2 top-0 rounded-sm right-0 absolute ${isShowDetails ? 'h-full w-full opacity-100' : 'w-0 h-0 opacity-0'} pointer-events-none transition-[width]  duration-300 ease-linear`}>
            <div className="flex items-start h-full gap-5 px-2">
                {/* Left details */}
                <div className="flex-col">
                    <div className="flex gap-1 mb-2">
                        <Moon/>
                        <h2 className='text-xl tracking-wide font-semibold'>Night</h2>
                    </div>
                    <p className='text-blue-400 text-sm font-light tracking-widest'><span className=' font-semibold'>MTR: </span>  {mtr_night} /Km</p>
                    <p className='text-blue-400 text-sm font-light tracking-widest'><span className=' font-semibold'>RTR: </span> {trr_night} cm2/Km</p>
                    <p className='text-blue-400 text-sm font-light tracking-widest'><span className=' font-semibold'>VID: </span> {vid_night} /Km2</p>
                    <p className='text-blue-400 text-sm font-light tracking-widest'><span className=' font-semibold'>VIR: </span> {vir_night} cm2/Km2</p>
                </div>

                <div className='border-gray-300 border-1 h-full' />
                {/* Right details */}
                <div className="flex-col">
                    <div className="flex gap-1 mb-2">
                        <Sun/>
                        <h2 className='text-xl font-semibold'>Day</h2>
                    </div>
                    <p className='text-gray-300 text-sm font-light'><span className=' font-semibold'>MTR: </span>  {mtr_day} /Km</p>
                    <p className='text-gray-300 text-sm font-light'><span className=' font-semibold'>RTR: </span> {trr_day} cm2/Km</p>
                    <p className='text-gray-300 text-sm font-light'><span className=' font-semibold'>VID: </span> {vid_day} /Km2</p>
                    <p className='text-gray-300 text-sm font-light'><span className=' font-semibold'>VIR: </span> {vir_day} cm2/Km2</p>
                </div>
            </div>
            {/* Hide details btn */}
            <div className="relative bottom-8 flex justify-end  w-full">
                <button onClick={() => handleShowDetails()} className='p-1 rounded-sm bg-blue-800 cursor-pointer'>
                    <ChartNoAxesColumn className='text-white' />
                </button>
            </div>
        </div>

    </div>
  )
}

export default ScattererCard;
