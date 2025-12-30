import Tooltip from '../../../shared/components/popups/tooltip/Tooltip';
import { memo } from 'react';

type ElevationSliderProps = {
    elevations: number[];
    currentIdx: number;
    handleChange: (elIndex: number) => void;
}

const ElevationSlider = ({ elevations, handleChange, currentIdx }: ElevationSliderProps) => {
  return (
    <div className="z-10 border-white/20 bg-gray-900/50 shadow-md ring-1 ring-black/5 backdrop-blur-sm text-gray-100 w-22 h-full rounded-sm  flex justify-center items-center">

      <div className="h-fit flex flex-col gap-0.5 justify-around items-center">
        <small className='text-[10px] text-sm text-center font-light'>Elevation in degree</small>
        {/* max elevation */}
        <small className='text-[10px] text-white'>{elevations?.[0]}</small>
        

        { elevations?.map((elev: number, i: number) => (
            <Tooltip
              key={elev}
              position='right'
              text={`${elev}°`}
              display_condition={true}
            >
              <div  className="w-full h-full flex items-start justify-center">
                  <button
                      aria-label={`Set elevation to ${elev} degree`}
                      onClick={() => handleChange(i)}
                      className={`${
                      i === currentIdx ? 'bg-blue-800' : 'bg-gray-300'
                    } w-3 h-4 hover:w-5  relative cursor-pointer  hover:bg-blue-800`}

                  >
                  </button>
              </div>
            </Tooltip>
        ))}

        {/* Min elevation */}
        <small className='text-[10px] text-white'>{elevations?.[elevations?.length - 1]}</small>
      </div>

    </div>
  )
}

export default memo(ElevationSlider);
