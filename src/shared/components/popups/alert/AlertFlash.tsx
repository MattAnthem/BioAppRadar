import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { hideAlert, type AlertType } from './alertSlice';


/**
 * A global flash alert for the dashboard (Fully handled by Redux)
 * @returns ReactPortal
 */
const AlertFlash = () => {

  const { isShow, alertType, message } = useAppSelector(state => state.alert);

  const dispatch = useAppDispatch();

  const alertColor: Record<AlertType, string> = {
    info: 'border-l-blue-500',
    error: 'border-l-red-500',
    success: 'border-l-green-500'
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(hideAlert())
    }, 4000);
    return () => clearTimeout(timer);
  }, [dispatch, isShow]);

  

  return createPortal(

    <div className={`
                      absolute w-85  rounded-sm bg-zinc-50 shadow-lg border-gray-400 border-l-8 
                      ${alertColor[alertType]}  
                      border bottom-12 right-8 z-50 overflow-hidden
                      flex flex-col items-center justify-center p-4
                      ${isShow ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none hidden'} 
                      transition delay-150 duration-300 ease-out
                  `}
    >

      {/* Some heading elements */}
      <div className="w-full mb-2 flex justify-between">
        <span className='font-semibold tracking-wider'>
          Info
        </span>
        <button onClick={() => dispatch(hideAlert())}>
          <X/>
        </button>
      </div>

      <p className='text-gray-800'>
        {message}
      </p>

    </div>,
    document.body

  )
}

export default AlertFlash;
