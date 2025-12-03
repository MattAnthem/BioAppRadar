import { useState, memo, useRef, useCallback } from 'react';
import radarIcon from '../../../assets/radarIcon.webp';
import Tooltip from '../popups/tooltip/Tooltip';

type AltitudeSliderProps = {
    className?: string;
    maxAltitude: number;
    onChangeAltitude?: (alt: number) => void; 
}

const CustomSlider = ({
    maxAltitude, onChangeAltitude, className
}: AltitudeSliderProps) => {
    const [index, setIndex] = useState<number>(0);


    const lastSentAlt = useRef<number | null>(null);


    const handleAltitudeChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        const alt = Number(evt.target.value);
        // Update UI
        setIndex(alt);

    }, [])

    // Call api when slider stops moving
    const handleChangeEnd = useCallback(() => {
      if (lastSentAlt.current === index) return;
      lastSentAlt.current = index;
      onChangeAltitude?.(index);
    }, [index, onChangeAltitude])



  return (
    <div className={`${className} z-10 border-white/20 bg-gray-900/60 shadow-md ring-1 ring-black/5 backdrop-blur-sm text-gray-100 w-22 h-full rounded-sm  flex justify-center items-center`}>
        
      {/* Altitude band */}
      <div className="h-full flex flex-col justify-center items-center py-2">
        <small className='text-[clamp(0.6em,0.7vw,1em)] text-center text-gray-300'>Height in meters</small>
        
        {/* Max altitude */}
        <small className='text-[12px] text-white'>{maxAltitude}</small>
        
        <input
            id='altitude-slider' 
            aria-label='Altitude slider'
            name='altitudes'
            onChange={handleAltitudeChange}
            onMouseUp={handleChangeEnd}
            onTouchEnd={handleChangeEnd}
            type="range" 
            className="
                    cursor-pointer
                    h-full
                    appearance-none 
                    [writing-mode:vertical-rl]
                    rotate-180
                    [&::-webkit-slider-runnable-track]:rounded-[2px]
                    [&::-webkit-slider-runnable-track]:bg-gray-400
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:h-5 
                    [&::-webkit-slider-thumb]:w-5 
                    [&::-webkit-slider-thumb]:rounded-[2px] 
                    [&::-webkit-slider-thumb]:bg-sky-700 
                " 
            min={0}
            step={100}
            max={maxAltitude}
            value={index}
        />

        {/* Current altitude */}
        <small className='text-sky-300 text-[12px] font-semibold'>{index}</small>

        {/* Min altitude */}   
          <div className="flex items-center justify-center gap-0.5">
            <Tooltip
              position='right'
              text="Radar altitude: 1616m"
              display_condition={true}
            >

              <img 
                aria-label='Radar altitude indicator'
                src={radarIcon} className='w-5 h-5 hover:bg-gray-400 m-0.5 rounded-sm' alt="radar_icon" />  
            </Tooltip>
          </div>


      </div>
      

       
    </div>
  )
}

export default memo(CustomSlider);