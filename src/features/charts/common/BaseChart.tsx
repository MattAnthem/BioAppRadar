import { Suspense, lazy } from "react";
import { Fullscreen, Settings2, Unplug } from "lucide-react";
import loader from '../../../assets/loader.webp';

const SectionCard = lazy(() => import("../../../shared/components/cards/SectionCard"));


export type BaseChartProps<TData> = {
    className?: string;
    title: string;
    data: TData | undefined;
    isLoading: boolean;
    selectedHeight?: number;
    error: Error | null;
    PopupComponent: React.ComponentType;
    ModalComponent: React.ComponentType;
    time?: string;

    ChartComponent: React.ComponentType<{data: TData, selectedHeight?: number}>;
}

function BaseChart<TData>({
    ChartComponent,
    ModalComponent,
    PopupComponent,
    data,
    error,
    isLoading,
    title,
    className,
    selectedHeight,
    time
}: Readonly<BaseChartProps<TData>>){
    return (
        <SectionCard className={`${className} lg:w-full lg:h-full h-[60vh] flex flex-col justify-center items-center`}>
  
          {/* Heading */}
          <div className="py-1 px-2 relative w-full flex items-center justify-between">
              <h1 className='tracking-wider text-[clamp(0.8em,0.8vw,1em)] font-[600]'>{title}</h1>

                <div className="z-10 flex justify-center gap-1.5">

                    {/* Species selection */}
                    <Suspense fallback={
                      <div className=" p-1 rounded-sm">
                        <Settings2 width={15} height={15} />
                      </div>}
                    >
                      <PopupComponent/>
                    </Suspense>

                    {/* Modal chart */}
                    <Suspense fallback={
                      <div className=" p-1 rounded-sm">
                        <Fullscreen width={15} height={15}/>
                      </div> }
                    >
                      <ModalComponent/>
                    </Suspense>

                </div>
                
          </div>

          {/* Chart */}
          <div className="w-full h-full  grid px-2 pb-2">
            {
              (data && !error && !isLoading) && (
                <ChartComponent
                  data={data}
                  selectedHeight={selectedHeight}
                />
              )
            }
            {
                (isLoading) && (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <img src={loader} alt="loading-vp" width={25} height={25}  />
                        <small>Updating data...</small>
                    </div>
                )
            }
            {         
              error && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Unplug width={25} height={25} className='text-red-500'/>
                </div> 
            )}
          </div>

          {time && (
            <small className="font-semibold">{time?.split(' ')[0] ?? ' '} <span className="font-normal">{`${time?.split(' ')[1] ?? ' '}`}</span> </small>
          )}

    </SectionCard>
    )
}

export default BaseChart;
