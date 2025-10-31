import { useEffect, useState, useRef } from "react";
import { Play, Pause, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Tooltip from "../popups/tooltip/Tooltip";

type TimelineProps = {
  frames: string[];
  currentIndex: number;
  onFrameChange: (index: number) => void;
  animSpeed?: number; // en ms
};


/**
 * Custom Timeline that displays frames with buttons.
 * @param frames: List of frames ids
 * @param animSpeed: Animation sequence speed in ms
 * @returns React.JSX.Element
 */
const TimelineSlider = ({ frames, currentIndex, onFrameChange, animSpeed = 900 }: TimelineProps) => {
  const [speed, setSpeed] = useState(animSpeed);

  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentFrame = frames[currentIndex] ?? frames[0] ?? null;

  // Gestion de l’animation
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        onFrameChange((currentIndex + 1) % frames.length);
      }, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, frames.length, onFrameChange, currentIndex]);

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

  const handleIncrAnimSpeed = () => {
    if (speed >= 2000 ) {
      return;
    }

    setSpeed((prev) => prev + 100);

    console.log('INCREASING SPEED ', animSpeed)

  }

  const handleDecrAnimSpeed = () => {
    if (speed <= 100) return;
    setSpeed((prev) => prev - 100);
  }

  return (
    <div className="z-5 absolute bottom-0 left-0 w-full">
      <div className="relative w-full p-1">


        {/* Timeline controls */}
        <div className="flex pb-6 w-full justify-start items-center 2xl:gap-2 gap-1 mt-2 isolate border-white/20 bg-gray-900/45 shadow-md ring-1 ring-black/5 backdrop-blur-sm p-2 rounded-b-sm">

           {/* Timestamp indicator */}
           {currentFrame ? (
              <>
                <h2 className="lg:text-xl text-gray-50 font-semibold tracking-wide">
                  {currentFrame.split(" ")[0]}
                </h2>
                <small className="text-normal text-gray-200 font-semibold tracking-wider">
                  {currentFrame.split(" ")[1]}
                </small>
              </>
            ) : (
              <span className="text-gray-400">No time selected</span>
            )}


          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-gray-800 hover:bg-gray-700 rounded-sm text-gray-300 p-2"
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          {/* Frame jump btns + speed*/}
          <div className="flex items-center justify-center bg-gray-800 rounded-sm">
            {/* Back to one past frame */}
            <Tooltip
              position="top"
              text="Step back"
              display_condition={true}
            >
              <button onClick={handleStepBackward} className="p-2 rounded-l-sm hover:bg-gray-700 text-gray-300">
                <ChevronLeft className=" rounded-sm"/>
              </button>

            </Tooltip>

            {/* Step forward to next frame */}
            <Tooltip
              position="top"
              text="Step forward"
              display_condition={true}
            >
              <button onClick={handleStepForward} className="p-2 rounded-r-sm hover:bg-gray-700 text-gray-300">
                <ChevronRight className=" rounded-sm"/>
              </button>
            </Tooltip>

          </div>

          {/* Frames */}
          <div className="flex justify-start items-center 2xl:gap-1">
            {frames.map((frame, i) => (
              <Tooltip key={frame} position="top" text={frame} display_condition={true}>

                <button
                  
                  onClick={() => {
                    onFrameChange(i);
                    setIsPlaying(false); 
                  }}
                  className={`${
                    currentIndex === i ? "bg-blue-800" : "bg-gray-300"
                    } hover:bg-blue-700 h-4 2xl:w-4 xl:w-2 w-1 cursor-pointer 2xl:rounded-xs`}
                />
              </Tooltip>
            ))}
          </div>

          
          {/* Speed */}
          <div className="flex items-center bg-gray-800 text-gray-300 rounded-sm">
              <button onClick={handleDecrAnimSpeed} className="rounded-l-sm hover:bg-gray-700 p-2">
                <Minus/>
              </button>

              <span className="tracking-wider p-2 border-x-2 border-gray-600">
                {speed}ms
              </span>

              <button onClick={handleIncrAnimSpeed} className="rounded-r-sm hover:bg-gray-700 p-2">
                <Plus/>
              </button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default TimelineSlider;
