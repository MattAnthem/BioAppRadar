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
        right: "right-2 bottom-[20%]",
        left: "left-2 bottom-[20%]"
    }

  return (
    <div className={`${position_classes[position]} ${className} absolute z-10 isolate border-white/20 bg-gray-900/50 shadow-md ring-1 ring-black/5 backdrop-blur-sm text-gray-100 w-22 max-h-[50vh] lg:h-[45vh] h-[35vh] rounded-sm p-2 flex justify-start items-center`}>
      
      {/* Legend Title */}
      <div className="w-full h-full flex justify-center items-center relative">
        <div className="absolute text-sm left-0 top-[50%] w-full tracking-widest -rotate-90 ">Altitude(Km)</div>
      </div>

      {/* Altitude band */}
      <div className="h-full py-2 w-50 flex flex-col justify-center items-center gap-0.5">
   
        {
          altitudes.map((alt: number, i: number) => (
          
            <div key={alt} className="w-full h-full flex items-start justify-center">

              <button onClick={() => onChangeAltitude(i)} className={`${i === currentIndex ? 'bg-blue-800': 'bg-gray-300'} w-4 h-full  cursor-pointer hover:bg-blue-800`}></button>
              <p className='w-6 text-sm text-white border-t border-gray-300 px-1'> {formatBigNumber(alt)}</p>

            </div>

          ))
        }


      </div>


    </div>
  )
}

export default AltitudeSlider;
