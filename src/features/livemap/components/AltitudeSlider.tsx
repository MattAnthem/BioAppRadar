import { formatBigNumber } from '../../../shared/utils/number_format';
import Tooltip from '../../../shared/components/popups/tooltip/Tooltip';
import radarIcon from '../../../assets/radarIcon.webp';
import { memo } from 'react';




type AltitudeSliderProps = {
    className?: string;
    altitudes: number[];
    currentIndex: number;
    onChangeAltitude: (index: number) => void; 
}


/**
 * Allow users to choose an altitude from any API given altitudes 
 * @param position altitude band component position "left" or "right" 
 * @param className additional CSS class
 * @param altitudes available altitudes list
 * @param currentIndex current selected altitude idex from the altitude list
 * @param onChangeAltitude handler function on altitude changes
 * @returns React.JSX.Element
 */
const AltitudeSlider = (
  { 
    className,
    altitudes, 
    currentIndex, 
    onChangeAltitude 
  }: AltitudeSliderProps
) => {


  return (
    <div className={` ${className} z-10 border-white/20 bg-gray-900/50 shadow-md ring-1 ring-black/5 backdrop-blur-sm text-gray-100 w-22 h-full rounded-sm  flex justify-center items-center`}>
      

      {/* Altitude band */}
      <div className="h-fit flex flex-col justify-center items-center">

        <small className='text-[10px] text-xs text-center font-light'>Height in meters</small>

        {/* Max altitude */}
        <small className='text-[10px] text-white'>{altitudes[0]}</small>
   
        {altitudes.map((alt: number, i: number) => (
            <Tooltip
              key={alt}
              position='right'
              text={formatBigNumber(alt)}
              display_condition={true}
            >
              <div  className="w-full h-full flex items-start justify-center">
                  <button
                    aria-label={`Set altitude to ${alt} meters`}
                    onClick={() => onChangeAltitude(i)}
                    className={`${
                      i === currentIndex ? 'bg-blue-800' : 'bg-gray-300'
                    } w-3 h-1 hover:w-5  relative cursor-pointer  hover:bg-blue-800`}
                  >
                  </button>
              </div>
            </Tooltip>
        ))}


        {/* Min altitude */}   
          <div className="flex items-center justify-center gap-0.5">
            <Tooltip
              position='right'
              text="Radar altitude: 1616m"
              display_condition={true}
            >

              <img 
                aria-label='Radar altitude indicator'
                src={radarIcon} className='w-5 h-5 hover:bg-gray-400 p-0.5 rounded-sm' alt="radar_icon" />  
            </Tooltip>
          </div>

      </div>


    </div>
  )
}

export default memo(AltitudeSlider);
