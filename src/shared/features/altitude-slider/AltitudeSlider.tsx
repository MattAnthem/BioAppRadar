import { ArrowLeft } from 'lucide-react';
import Tooltip from '../../components/popups/tooltip/Tooltip';
import { formatBigNumber } from '../../utils/number_format'


type Position = "left" | "right"

type AltitudeSliderProps = {
    className?: string;
    position: Position;
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
    position, 
    className,
    altitudes, 
    currentIndex, 
    onChangeAltitude 
  }: AltitudeSliderProps
) => {

    const position_classes: Record<Position, string> = {
        right: "right-2 lg:bottom-[18%] bottom-[25%]",
        left: "left-2 lg:bottom-[13%] bottom-[25%]"
    }

  return (
    <div className={`${position_classes[position]} ${className} absolute z-10 isolate border-white/20 bg-gray-900/50 shadow-md ring-1 ring-black/5 backdrop-blur-sm text-gray-100 w-22 max-h-[65vh] lg:h-[full] h-[35vh]  rounded-sm p-2 flex justify-start items-center`}>
      
      {/* Legend Title */}
      <div className="w-full h-full flex justify-center items-center relative">
        <div className="absolute text-sm left-0 top-[50%] w-full tracking-widest -rotate-90 ">Altitude(m)</div>
      </div>

      {/* Altitude band */}
      <div className="h-fit py-2 w-50 flex flex-col justify-center items-center ">

        {/* Max altitude */}
        <small>{formatBigNumber(altitudes[0])}</small>
   
        {altitudes.map((alt: number, i: number) => (
            <Tooltip
              key={alt}
              position='right'
              text={formatBigNumber(alt)}
              display_condition={true}
            >
            <div  className="w-full  flex items-start justify-center">
                <button
                  onClick={() => onChangeAltitude(i)}
                  className={`${
                    i === currentIndex ? 'bg-blue-800' : 'bg-gray-300'
                  } w-4  h-[4.5px] relative cursor-pointer hover:bg-blue-800`}
                >
                  {
                    (i === currentIndex) && (
                      <ArrowLeft width={20} height={20} className='absolute text-red-500 bottom-[0.1px] left-full'/>
                    )
                  }
                </button>
            </div>
            </Tooltip>
        ))}

        {/* Max altitude */}
                
        <small>{altitudes[altitudes.length - 1]}</small>

        {/* current altitude */}
        <small className='font-semibold tracking-wide text-blue-950'>{altitudes[currentIndex]}m</small>

      </div>


    </div>
  )
}

export default AltitudeSlider;
