import { ChevronRight } from 'lucide-react';
import React, { type ReactNode } from 'react';

type NavContentProps = {
    isNav_minimized: boolean;
    icon?: React.JSX.Element;
    title: string;
    badge?:  ReactNode;
    subMenues?: string[];
    showSubMenu: boolean;
}

/**
 * Responsible for rendering the content of a navbar button
 * @param badge: optionnal parameters to display a badge that is displayed on top of the navbutton
 * @param isNav_minimized: track the state of the sidebar
 * @param title: title of the sidebar menu
 * @param icon: icon to represent the sidebar menu
 * @param showSubMenu: display or hide the submenues
 * @param subMenues: optional list of menues that can be attached to a nav, if present, submenues scrolls to a specific tag in the same page 
 * @returns React.JSX.Element
 */
const NavContent = (
    {
        badge,
        isNav_minimized,
        title,
        icon,
        subMenues,
        showSubMenu
    }: NavContentProps
) => {
  return (
    <>
        <div className={`${isNav_minimized ? '' : 'w-full'} flex relative items-center justify-between`}>

            {/* Menu icon + title */}
            <div className="flex gap-2 items-start">

            {icon}

            <h1 
                className={`${isNav_minimized ? 'hidden' : '' } font-normal text-start text-nowrap`}
            >
                {title}
            </h1>

            </div>

            {/* Badge if have some */}
            {
                badge && (
                    <small className={`${isNav_minimized ? 'absolute -top-4 -right-2' : ''} p-1 h-6 flex items-center justify-center text-center bg-red-500 text-white rounded-sm`}>{badge}</small>
                )
            }
        
        </div>
        {
          (subMenues && !isNav_minimized) && (
            // Animated arrow
            <ChevronRight className={`${showSubMenu ? 'rotate-90' : ''} transition-transform duration-200 ease-in-out`}/>
          )
        }
    </>
  )
}

export default NavContent;
