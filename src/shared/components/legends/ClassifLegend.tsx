import {memo} from 'react';

type ClassifLegendProps = {
    classColor0?: string;
    classColor1?: string;
    class0Name?: string;
    class1Name?: string;
    height?: string | number;
}

/**
 * @param classColor0 Color for class 0 
 * @param classColor1 Color for class 1 
 * @param class0Name Name for class 0 
 * @param class1Name Name for class 1
 * @param height Height value
 * @returns React.JSX Element
 */
const ClassifLegend = ({
    classColor0,
    classColor1,
    class0Name,
    class1Name,
    height
}:ClassifLegendProps) => {
  return (
    <div className='space-y-0'>
        {/* Class 0 */}
        <div className="flex justify-start items-center gap-1 text-[clamp(0.8em,0.8vw,1em)]">
            <div className='lg:w-3 lg:h-3 w-2 h-2  rounded-full border border-gray-400' style={{backgroundColor: classColor0}}/>
            <small className='text-white tracking-wide'>{class0Name}</small>
        </div>

        {/* Class 1 */}
        <div className="flex justify-start items-center gap-1 text-[clamp(0.8em,0.8vw,1em)]">
            <div className='lg:w-3 lg:h-3 w-2 h-2  rounded-full border border-gray-400' style={{backgroundColor: classColor1}}/>
            <small className='text-white tracking-wide'>{class1Name}</small>
        </div>
        <div className="flex justify-start items-start text-[clamp(0.7em,0.7vw,1em)]">
            <small className='text-white tracking-wide'>Height: {height}</small>
        </div>
    </div>
  )
}

export default memo(ClassifLegend);
