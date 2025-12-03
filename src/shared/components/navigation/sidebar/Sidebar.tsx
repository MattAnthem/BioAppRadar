import {  Bell, CalendarClock, FlipHorizontal,  Home, SidebarIcon } from "lucide-react";
import logo_svg from "../../../../assets/BioAppRadar.webp"
import { useTheme } from "../../../hooks/useTheme";
import React, { useEffect, useRef } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import type { MenuNames } from "../../buttons/navbtn/MenuTypes";
import { setActiveButton, setMinimized, toggleMinimize } from "./sidebarSlice";
import NavButton from "../../buttons/navbtn/NavButton";
import mtorwlogo from "../../../../assets/mtorw.webp";
import pasetlogo from "../../../../assets/paset.webp";
import rsiflogo from "../../../../assets/rsif.webp";


const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const Sidebar = () => {
    const sidebarRef = useRef<HTMLDivElement | null>(null);
   
    // Hook calls
    const themes = useTheme();
    const dispatch = useAppDispatch();
    const { activeButton, isMinimized } = useAppSelector(state => state.sidebar);
    const { width } = useAppSelector(state => state.windowsize); // getting the actual window width

    const { theme } = themes;
    const { sidebar } = theme;
    const { main, navs } = sidebar;


    const handleActiveButton = (menu: MenuNames) => {
        if (width <= 1024) {
            dispatch(setMinimized(true));
            dispatch(setActiveButton(menu));
        }
        dispatch(setActiveButton(menu));
    }

    const handleToggleSidebar = () => {
        dispatch(toggleMinimize());
    }

    // Autohide sidebar when user clicks outside of it on smaller screen
    useClickOutside(sidebarRef, () => {
        if (width < 1024) {
            dispatch(setMinimized(true));
        }
    });

    useEffect(() => {
        const currentPath = location.pathname.replace('/', '') as MenuNames;
        const pathKey = currentPath === '' ? '' : currentPath;

        if (activeButton !== pathKey) {
            dispatch(setActiveButton(pathKey));
        }
    }, [dispatch, activeButton])

  return (
    <div ref={sidebarRef} id="sidebar" aria-label="sidebar" className={`
                    ${main.background} 
                    fixed z-60 h-screen lg:flex lg:sticky lg:flex-col max-h-screen p-2 shadow-[2px] 
                    ${isMinimized ? 'lg:w-[60px] hidden' : 'lg:w-[260px]'} 
                    transition-all duration-200 ease-out drop-shadow-xs antialiased 
                    text-[clamp(0.675rem, 0.5vw + 0.5rem, 1rem)]
        `}
    >

        {/* AppLogo */}
        <div className={`mb-2 flex ${isMinimized ? 'items-start justify-center mb-4' : 'justify-between items-center'}  gap-1  w-full`}>

            <div className={`w-full ${sidebar.main.logos} flex justify-center items-center p-1 rounded-sm`}>
                <img aria-label="BioAppRadar logo" src={logo_svg} className={`${isMinimized ? 'hidden' : ''} h-11`} alt="BioAppRadar logo"  />
                <h1 className={`text-lg font-semibold text-[#1C2B33]! ${isMinimized ? 'hidden' : navs.text} transition-opacity duration-100 ease-in-out tracking-wider`}>BioAppRadar</h1>


                {/* Toggle minimize sidebar */}
                <button aria-label="toggle-minimize-sidebar" aria-controls="sidebar" onClick={handleToggleSidebar} className={` ${isMinimized ? '' : 'ml-2'} hover:bg-gray-300 rounded-sm p-1 cursor-ew-resize focus-visible:outline-2 outline-offset-1 outline-blue-800`}>
                    <SidebarIcon className={`w-4 h-4`} />
                </button>
            </div>

        </div>


        {/* allow user to maximize/minimize by clicking on the edge of the sidebar ;) */}
        <button aria-label="toggle-minimize-sidebar" aria-controls="sidebar" onClick={handleToggleSidebar} className={`${sidebar.main.toggler_side_bg} ${sidebar.main.toogler_hover} h-full absolute w-0.5 hover:w-1 right-0 bottom-0 z-5 cursor-ew-resize focus-visible:outline-1 outline-blue-400`}/>

        
        {/* Menu group 1 */}
        <div className={`w-full  ${isMinimized ? '-translate-y-4' : 'translate-y-0'} tansistion-transform duration-300 ease-in-out`}>


                <NavButton 
                    handleActivate={handleActiveButton}
                    title="Overview dashboard"
                    menu_to=""
                    active={activeButton}
                    icon={<Home  className={iconSize}/>}
                    isNav_minimized={isMinimized}
                    ariaLabel="Navigate to Overview Dashboard page"
                    tooltipText="Overview Dashboard"
                />

                <NavButton 
                    handleActivate={handleActiveButton}
                    title="Cross section"
                    menu_to="cross_section"
                    active={activeButton}
                    icon={<FlipHorizontal className={iconSize}/>}
                    isNav_minimized={isMinimized}
                    ariaLabel="Navigate to Vertical transect page"
                    tooltipText="Cross section"
                />
                
                <NavButton 
                    handleActivate={handleActiveButton}
                    title="Historical explorer"
                    menu_to="history_explorer"
                    active={activeButton}
                    icon={<CalendarClock className={iconSize}/>}
                    isNav_minimized={isMinimized}
                    ariaLabel="Navigate to Historical explorer page"
                    tooltipText="Historical Explorer"
                />



        </div>

        <div className={`${main.section_line} w-full mb-1 h-0.5`}/>


        {/* Notification center */}
        <NavButton 
            handleActivate={handleActiveButton}
            title="Notifications"
            menu_to="notification_center"
            active={activeButton}
            icon={<Bell className={iconSize}/>}
            isNav_minimized={isMinimized}
            ariaLabel="Navigate to Notification center page"
            tooltipText="Notification center"
            badge={12}
        />

        {/* Logos */}
        <div className="h-full w-full flex flex-col items-end justify-end gap-2">
        <div className={`${main.section_line} w-full h-0.5`}/>

            <div className={`${sidebar.main.logos} flex flex-col justify-center items-center p-2 gap-2 w-full`}>
                
                    <div className={`${isMinimized ? 'hidden' : ''} w-full  p-1 rounded-sm flex justify-center`}>
                        <img src={mtorwlogo} alt="mtorw-logo" className={`w-30 `} />
                    </div>
                
                    <div className={`${isMinimized ? 'hidden' : ''} w-full p-1 rounded-sm flex justify-center`}>
                        <img src={pasetlogo} alt="paset-logo" className={`w-30`} />
                    </div>
                
                    <div className={`${isMinimized ? 'hidden' : ''} w-full p-1 rounded-sm flex justify-center`}>
                        <img src={rsiflogo} alt="rsif-logo" className={` w-30`} />
                    </div>
                
            </div>

        </div>

    </div>
  )
}

export default React.memo(Sidebar);
