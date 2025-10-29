import {  Bell, FlipHorizontal, HelpCircle, Home, LayoutDashboard, Settings, SidebarIcon } from "lucide-react";
import logo_svg from "../../../../assets/dark_logo.svg"
import { useTheme } from "../../../hooks/useTheme";
import { useRef } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";
import avatar from '../../../../assets/avatar.jpg';
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import type { MenuNames } from "../../buttons/navbtn/MenuTypes";
import { setActiveButton, setMinimized, toggleMinimize } from "./sidebarSlice";
import NavButton from "../../buttons/navbtn/NavButton";
import NavAccountBtn from "../../buttons/navbtn/NavAccountBtn";



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

  return (
    <div ref={sidebarRef} id="sidebar" role="menubar" aria-label="sidebar" className={`
                    ${main.background} 
                    fixed z-60 h-screen lg:flex lg:sticky lg:flex-col max-h-screen p-2 shadow-[2px] 
                    ${isMinimized ? 'lg:w-[60px] hidden' : 'lg:w-[300px]'} 
                    transition-all duration-200 ease-out drop-shadow-xs antialiased
        `}
    >

        {/* AppLogo */}
        <div className={`mb-2 flex ${isMinimized ? 'items-start justify-center' : 'justify-between items-center'}  gap-1 p-1 w-full`}>

            <div className="flex justify-start items-center">
                <img src={logo_svg} className="w-10 h-10" alt="appicon" />
                <h1 className={`text-xl font-semibold ${isMinimized ? 'hidden' : navs.text} transition-opacity duration-100 ease-in-out tracking-wider`}>BioAppRadar</h1>
            </div>

            {/* Toggle minimize sidebar */}
            <button aria-label="toggle-minimize-sidebar" aria-controls="sidebar" onClick={handleToggleSidebar} className={`${topbar.contents.toggler_hover} ${topbar.contents.togller_color}  rounded-sm p-1 cursor-ew-resize focus-visible:outline-2 outline-offset-1 outline-blue-800`}>
                <SidebarIcon />
            </button>

        </div>


        {/* allow user to maximize/minimize by clicking on the edge of the sidebar ;) */}
        <button aria-label="toggle_minimize-sidebar" aria-controls="sidebar" onClick={handleToggleSidebar} className={`${sidebar.main.toggler_side_bg} ${sidebar.main.toogler_hover} h-full absolute w-0.5 hover:w-1 right-0 bottom-0 z-5 cursor-ew-resize focus-visible:outline-1 outline-blue-400`}/>

        
        {/* Menu group 1 */}
        <div className={`w-full  ${isMinimized ? '-translate-y-4' : 'translate-y-0'} tansistion-transform duration-300 ease-in-out`}>


                <NavButton 
                    handleActivate={handleActiveButton}
                    title="Overview Dashboard"
                    menu_to="overview_dash"
                    active={activeButton}
                    icon={<Home width={30} />}
                    isNav_minimized={isMinimized}
                    ariaLabel="Overview Dashboard NavLink"
                    ariaControls="Overview Dashboard page"
                    tooltipText="Overview Dashboard"
                />

                <NavButton 
                    handleActivate={handleActiveButton}
                    title="Forecast dashboard"
                    menu_to="forecast_dash"
                    active={activeButton}
                    icon={<LayoutDashboard width={30}/>}
                    isNav_minimized={isMinimized}
                    ariaLabel="Forecast dashboard NavLink"
                    ariaControls="Forecast dashboard page"
                    tooltipText="Forecast Dashboard"
                />


                <NavButton 
                    handleActivate={handleActiveButton}
                    title="Vertical transect"
                    menu_to="v_transect"
                    active={activeButton}
                    icon={<FlipHorizontal width={30}/>}
                    isNav_minimized={isMinimized}
                    ariaLabel="Vertical transect NavLink"
                    ariaControls="Vertical transect page"
                    tooltipText="Vertical transect"
                />

        </div>

        <div className={`${main.section_line} w-full lg:h-1.5 h-0.5`}/>

        {/* Menu group 2 */}
        <div className="w-full lg:h-full flex flex-col">
            <div className="w-full mt-auto">


            </div>

        </div>

        <div className={`${main.section_line} w-full lg:h-1.5 h-0.5`}/>

        {/* Notification center */}
        <NavButton 
            handleActivate={handleActiveButton}
            title="Notifications"
            menu_to="notification_center"
            active={activeButton}
            icon={<Bell width={30}/>}
            isNav_minimized={isMinimized}
            ariaLabel="Notification center NavLink"
            ariaControls="Notification center page"
            tooltipText="Notification center"
            badge={12}
        />

        {/* User menu */}
        <NavAccountBtn
            avatarUrl={avatar}
            isNavMinimized={isMinimized}
            title="Jhon Doe"
            subtitle="jhondoe@gmail.com"
        />


    </div>
  )
}

export default Sidebar;
