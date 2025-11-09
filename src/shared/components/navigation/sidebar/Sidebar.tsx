import {  Bell, CalendarClock, FlipHorizontal,  Home, SidebarIcon } from "lucide-react";
import logo_svg from "../../../../assets/dark_logo.webp"
import { useTheme } from "../../../hooks/useTheme";
import React, { useEffect, useRef } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import type { MenuNames } from "../../buttons/navbtn/MenuTypes";
import { setActiveButton, setMinimized, toggleMinimize } from "./sidebarSlice";
import NavButton from "../../buttons/navbtn/NavButton";


const iconSize = "w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4";

const Sidebar = () => {
    const sidebarRef = useRef<HTMLDivElement | null>(null);
   
    // Hook calls
    const themes = useTheme();
    const dispatch = useAppDispatch();
    const { activeButton, isMinimized } = useAppSelector(state => state.sidebar);
    const { width } = useAppSelector(state => state.windowsize); // getting the actual window width

    const { theme } = themes;
    const { sidebar, topbar } = theme;
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
    <div ref={sidebarRef} id="sidebar" role="menubar" aria-label="sidebar" className={`
                    ${main.background} 
                    fixed z-60 h-screen lg:flex lg:sticky lg:flex-col max-h-screen p-2 shadow-[2px] 
                    ${isMinimized ? 'lg:w-[60px] hidden' : 'lg:w-[260px]'} 
                    transition-all duration-200 ease-out drop-shadow-xs antialiased 
                    text-xs md:text-sm lg:text-sm 
        `}
    >

        {/* AppLogo */}
        <div className={`mb-2 flex ${isMinimized ? 'items-start justify-center' : 'justify-between items-center'}  gap-1 p-1 w-full`}>

            <div className="flex justify-center gap-2 items-center">
                <img src={logo_svg} className={`${isMinimized ? 'hidden' : ''} w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-6 lg:h-6`} alt="appicon"  />
                <h1 className={`text-sm sm:text-sm md:text-base lg:text-lg ${isMinimized ? 'hidden' : navs.text}`}>BioAppRadar</h1>
            </div>

            {/* Toggle minimize sidebar */}
            <button aria-label="toggle-minimize-sidebar" aria-controls="sidebar" onClick={handleToggleSidebar} className={`${topbar.contents.toggler_hover} ${topbar.contents.togller_color}  rounded-sm p-1 cursor-ew-resize focus-visible:outline-2 outline-offset-1 outline-blue-800`}>
                <SidebarIcon className={iconSize} />
            </button>

        </div>


        {/* allow user to maximize/minimize by clicking on the edge of the sidebar ;) */}
        <button aria-label="toggle_minimize-sidebar" aria-controls="sidebar" onClick={handleToggleSidebar} className={`${sidebar.main.toggler_side_bg} ${sidebar.main.toogler_hover} h-full absolute w-0.5 hover:w-1 right-0 bottom-0 z-5 cursor-ew-resize focus-visible:outline-1 outline-blue-400`}/>

        
        {/* Menu group 1 */}
        <div className={`w-full  ${isMinimized ? '-translate-y-4' : 'translate-y-0'} tansistion-transform duration-300 ease-in-out`}>


                <NavButton 
                    handleActivate={handleActiveButton}
                    title="Overview Dashboard"
                    menu_to=""
                    active={activeButton}
                    icon={<Home  className={iconSize}/>}
                    isNav_minimized={isMinimized}
                    ariaLabel="Overview Dashboard NavLink"
                    ariaControls="Overview Dashboard page"
                    tooltipText="Overview Dashboard"
                />

                <NavButton 
                    handleActivate={handleActiveButton}
                    title="Cross Section"
                    menu_to="cross_section"
                    active={activeButton}
                    icon={<FlipHorizontal className={iconSize}/>}
                    isNav_minimized={isMinimized}
                    ariaLabel="Vertical transect NavLink"
                    ariaControls="Vertical transect page"
                    tooltipText="Cross section"
                />
                
                <NavButton 
                    handleActivate={handleActiveButton}
                    title="Historical Explorer"
                    menu_to="history_explorer"
                    active={activeButton}
                    icon={<CalendarClock className={iconSize}/>}
                    isNav_minimized={isMinimized}
                    ariaLabel="Historical explorer NavLink"
                    ariaControls="Historical explorer page"
                    tooltipText="Historical Explorer"
                />



        </div>

        <div className={`${main.section_line} w-full h-0.5`}/>


        {/* Notification center */}
        <NavButton 
            handleActivate={handleActiveButton}
            title="Notifications"
            menu_to="notification_center"
            active={activeButton}
            icon={<Bell className={iconSize}/>}
            isNav_minimized={isMinimized}
            ariaLabel="Notification center NavLink"
            ariaControls="Notification center page"
            tooltipText="Notification center"
            badge={12}
        />

    </div>
  )
}

export default React.memo(Sidebar);
