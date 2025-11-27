import { useEffect, useState, useRef, memo } from "react";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import Tooltip from "../../../shared/components/popups/tooltip/Tooltip";

type TimelineProps = {
  frames: string[];
  currentIndex: number;
  onFrameChange: (index: number) => void;
  preloadingFrames: boolean
};


/**
 * Custom Timeline that displays frames with buttons.
 * @param frames: List of frames ids
 * @param animSpeed: Animation sequence speed in ms
 * @returns React.JSX.Element
 */
const TimelineSlider = ({ frames, currentIndex, onFrameChange, preloadingFrames }: TimelineProps) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentFrame = frames[currentIndex] ?? frames[0] ?? null;

  
  useEffect(() => {

    if (preloadingFrames) {
      setIsPlaying(false);
      return;
    };

    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        onFrameChange((currentIndex + 1) % frames.length);
      }, 900);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, frames.length, onFrameChange, currentIndex, preloadingFrames]);

  const handleStepBackward = () => {
    if (currentIndex > 0) {
      onFrameChange(currentIndex - 1);
    }
  }

  const handleStepForward = () => {
    if (currentIndex < frames.length - 1) {
      onFrameChange(currentIndex + 1);
    }
  }


  return (
    <div className="z-5 absolute bottom-0 left-0 w-full">

        {/* Timeline controls */}
        <div className="flex w-full justify-start items-center 2xl:gap-2 gap-1 border-white/20 bg-gray-900/60 shadow-md ring-1 ring-black/5 backdrop-blur-sm p-2 rounded-b-sm">

           {/* Timestamp indicator */}
           {currentFrame ? (
              <div className="lg:flex lg:flex-col hidden">
                <h2 className=" text-gray-50 tracking-wide">
                  {currentFrame.split(" ")[0]}
                </h2>
                <small className="text-normal text-gray-200 tracking-wide">
                  {currentFrame.split(" ")[1]}
                </small>
              </div>
            ) : (
              <span className="text-gray-400">No time selected</span>
            )}


          {/* Play/Pause */}
          <button
            aria-label="Play/Pause animation"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-gray-800 hover:bg-gray-700 rounded-sm text-gray-300 p-1"
          >
            {isPlaying ? <Pause width={20} height={20} /> : <Play width={20} height={20} />}
          </button>

          {/* Frame jump btns + speed*/}
          <div className="lg:flex hidden items-center h-full justify-center bg-gray-800 rounded-sm">
            {/* Back to one past frame */}
            <Tooltip
              position="top"
              text="Step backward"
              display_condition={true}
            >
              <button 
                aria-label="Step backward"
                onClick={handleStepBackward} className="p-1 h-full rounded-l-sm hover:bg-gray-700 text-gray-300">
                <ChevronLeft width={20} height={20} className=" rounded-sm"/>
              </button>

            </Tooltip>

            {/* Step forward to next frame */}
            <Tooltip
              position="top"
              text="Step forward" 
              display_condition={true}
            >
              <button 
                aria-label="Step forward"
                onClick={handleStepForward} className="p-1 h-full rounded-r-sm hover:bg-gray-700 text-gray-300">
                <ChevronRight width={20} height={20} className=" rounded-sm"/>
              </button>
            </Tooltip>

          </div>

          {/* Frames */}
          <div className="flex h-full justify-center items-center lg:gap-1">
            {frames.map((frame, i) => (
              <Tooltip key={frame} position="top" text={frame} display_condition={true}>

                <button
                  aria-label={`Select frame ${frame}`}
                  onClick={() => {
                    onFrameChange(i);
                    setIsPlaying(false); 
                  }}
                  className={`${
                    currentIndex === i ? "bg-blue-800 border-b-3 border-b-blue-950" : "bg-gray-300"
                    } hover:bg-blue-700 h-6 w-6 p-1 cursor-pointer 2xl:rounded-xs`}
                />
              </Tooltip>
            ))}
          </div>



        </div>

    </div>
  );
};

export default memo(TimelineSlider);
