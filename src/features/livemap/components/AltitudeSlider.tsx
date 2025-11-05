import { formatBigNumber } from '../../../shared/utils/number_format';
import Tooltip from '../../../shared/components/popups/tooltip/Tooltip';


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
        right: "right-2 lg:bottom-[20%] bottom-[25%]",
        left: "left-2 lg:bottom-[13%] bottom-[25%]"
    }

  return (
    <div className={`${position_classes[position]} ${className}  z-10  border-white/20 bg-gray-900/50 shadow-md ring-1 ring-black/5 backdrop-blur-sm text-gray-100 w-22 max-h-[65vh] lg:h-[full] h-[30vh]  rounded-sm p-2 flex justify-center items-center`}>
      

      {/* Altitude band */}
      <div className="h-fit  flex flex-col justify-center items-center">

        {/* Max altitude */}
        <small>{altitudes[0]}m</small>
   
        {altitudes.map((alt: number, i: number) => (
            <Tooltip
              key={alt}
              position='right'
              text={formatBigNumber(alt)}
              display_condition={true}
            >
              <div  className="w-full h-full flex items-start justify-center">
                  <button
                    onClick={() => onChangeAltitude(i)}
                    className={`${
                      i === currentIndex ? 'bg-blue-800' : 'bg-gray-300'
                    } w-3 h-1 hover:w-4 hover:h-4 hover:absolute hover:z-40 relative cursor-pointer  hover:bg-blue-800`}
                  >
                  </button>
              </div>
            </Tooltip>
        ))}

        {/* Min altitude */}     
        <small>{altitudes[altitudes.length - 1]}m</small>

      </div>


    </div>
  )
}

export default AltitudeSlider;
