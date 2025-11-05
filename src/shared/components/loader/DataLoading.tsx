import type { ReactNode } from 'react';
import loader from '../../../assets/loader.gif';
import GlassHeader from '../cards/GlassHeader';


type Props = {
  children?: ReactNode;
}

const DataLoading = ({children}: Props) => {
  return (
    <div className="relative w-full h-full rounded-sm p-1 z-25 bg-gray-500/50 left-0 top-0">

        <GlassHeader className='absolute w-full top-0 p-1 flex justify-between items-center'>
          <span className='h-6 w-30 animate-pulse  bg-gray-400/45 rounded-sm'/>
          <div className="flex gap-3">
            {children}
          </div>
        </GlassHeader>

        <div className="top-0 relative w-full h-full flex items-center justify-center">
          <div className="  
              rounded-sm 
              border-white/20 bg-gray-900/50 shadow-md ring-2 ring-black/5 p-2
              backdrop-blur-sm
              flex flex-col
              items-center
              justify-center
              "
          >
              <img src={loader} className='w-8' alt="loader" />
              <p className='font-semibold text-xs tracking-wider text-gray-300'>LOADING DATA</p>
              
          </div>
        </div>


    </div>
  )
}

export default DataLoading;