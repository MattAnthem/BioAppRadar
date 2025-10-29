import loader from '../../../assets/loader.gif';
import GlassHeader from '../cards/GlassHeader';

const DataLoading = () => {
  return (
    <div className="relative w-full h-full mt-4 rounded-sm p-1 z-25 bg-gray-500/50 left-0 top-0">

        <GlassHeader className='absolute  top-0 py-2 flex justify-between items-center'>
          <span className='h-6 w-30 animate-pulse  bg-gray-400/45 rounded-sm'/>
          <div className="flex jutify-between gap-2">
            <span className='h-11 w-30 animate-pulse  bg-gray-400/45 rounded-sm'/>
            <span className='h-11 w-30 animate-pulse  bg-gray-400/45 rounded-sm'/>
            <span className='h-11 w-30 animate-pulse  bg-gray-400/45 rounded-sm'/>
          </div>
        </GlassHeader>

        <div className="top-0 relative w-full h-full flex items-center justify-center">
          <div className="  
              rounded-sm 
              border-white/20 bg-gray-900/50 shadow-md ring-2 ring-black/5 p-8
              backdrop-blur-sm
              flex flex-col
              items-center
              justify-center
              "
          >
              <img src={loader} className='w-20' alt="loader" />
              <p className='font-semibold text-xs tracking-wider text-gray-300'>LOADING DATA</p>
              
          </div>
        </div>


    </div>
  )
}

export default DataLoading;