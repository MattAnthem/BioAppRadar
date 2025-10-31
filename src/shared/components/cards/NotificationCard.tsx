import { useRef, useState } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside';
import { AlertCircle, AlertTriangle, Ellipsis, Info, Map, Paperclip, Trash2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

type NotificationCardProps = {
    title: string;
    text?: string;
    notifType: NotifType;
    // actionHandler?: () => void; 
}

type NotifType = "info" | 'danger' | 'alert';

/**
 * Notification card element
 * @param title 
 * @param text 
 * @param notifType 
 * @returns 
 */
const NotificationCard = (
    {
        title,
        text,
        notifType,
        // actionHandler
    }: NotificationCardProps
) => {

    const [showActions, setShowActions] = useState(false);

    const notifActionsRef = useRef<HTMLDivElement | null>(null);

    const handleShowNotifAction = () => {
        setShowActions(prev => !prev);
    }

    useClickOutside(notifActionsRef, () => {
        if (showActions) {
            setShowActions(false);
        }
    });

    const notifTypeIcons: Record<NotifType, {icon: React.JSX.Element; slidebar: string}> = {
        info : {
            icon: <Info className='text-sky-500' />,
            slidebar: 'bg-sky-300'
        },
        danger: {
            icon: <AlertTriangle className='text-red-500' />,
            slidebar: 'bg-red-300'
        },
        alert: {
            icon: <AlertCircle className='text-yellow-500' />,
            slidebar: 'bg-yellow-300'
        }
    }

    // Theme 
    const themes = useTheme();

    const { background, border, element_hover } = themes.theme.cards;

  return (
    <div className={`${background} ${border} relative group border-b-1  w-full p-2 flex items-center justify-between gap-2 cursor-default rounded-sm`}>
      
        <div className="flex gap-2">

            {/* Icon */}
            <div className="p-2">
                { notifTypeIcons[notifType].icon}
            </div>

            {/* Content */}
            <div className="flex flex-col">
                <h1 className="font-bold">{ title }</h1>
                <p>{ text }</p>
                <div className={`${notifTypeIcons[notifType].slidebar} absolute group-hover:w-full left-0 -bottom-0.5 h-1 w-0 transition-all duration-300 ease-out`}/>
            </div>
        </div>

        {/* Actions */}
        <div ref={notifActionsRef} className='relative'>
            <button  onClick={handleShowNotifAction} className={`${element_hover} p-2 rounded-sm`}>
              <Ellipsis/>
            </button>

              <div  className={`
                    ${background} 
                    absolute z-30 flex flex-col gap-2 top-full mt-1 p-2 right-0 w-[200px] shadow-md rounded-sm border
                                    
                    ${showActions ? 
                      "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                    }  
                    transition-all duration-200 ease-out
                    origin-top-right
                `}
              >
                <button className={`${element_hover} flex p-2 items-center rounded-sm gap-2 hover:bg-gray-200`}>
                  <Map/>
                  <p>See the map</p>
                </button>
                <button className={`${element_hover} flex p-2 items-center rounded-sm gap-2 hover:bg-gray-200`}>
                  <Paperclip/>
                  <p>View reports</p>
                </button>
                <button className={`${element_hover} flex p-2 items-center rounded-sm gap-2 hover:bg-gray-200`}>
                  <Trash2/>
                  <p>Delete</p>
                </button>
              </div>
        </div>

    </div>
  )
}

export default NotificationCard;
