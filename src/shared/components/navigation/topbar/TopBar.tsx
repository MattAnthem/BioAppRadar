import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { toggleTheme } from '../../../features/theme/themeSlice';
import { toggleMinimize } from '../sidebar/sidebarSlice';
import SwitchBtn from '../../buttons/switchbtn/SwitchBtn';
import React from 'react';


const TopBar = () => {

    const themes = useTheme();
    const { topbar } = themes.theme;

    const dispatch = useAppDispatch();

    const { isDarkMode } = useAppSelector(state => state.theme);

    const handleSwitch = () => {
        dispatch(toggleTheme());
    }
    
    const handleToggleSidebar = () => {
        dispatch(toggleMinimize())
    }

  return (
    <div aria-label='topbar' className={`${topbar.main.bg} ${topbar.main.border} z-50 w-full flex justify-center items-center gap-3 absolute px-4 h-10 py-1 border-b drop-shadow-sm`}>

      {/* Left Controls */}
      {/* Menu toggler button for smaller screen */}
      <button aria-label='Minimize sidebar' aria-labelledby='collapse sidebar' name='toggle_sidebar' onClick={handleToggleSidebar} className={`${topbar.contents.toggler_hover} ${topbar.contents.icon_color} lg:hidden rounded-sm p-1`}>
        <Menu className='w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4'/>
      </button>
      
      {/* Right controls */}
      <div className="flex relative w-full justify-end items-center gap-2 opacity-100">

        <Sun className={`w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 ${topbar.contents.icon_color}`}/>

        {/* Switch button */}
        <SwitchBtn 
            handler_func={handleSwitch}
            isActive={isDarkMode}
            height={15}
            width={30}
            ariaLabel={`Change application theme to ${isDarkMode ? 'light mode' : 'dark mode'}`}
        />
        
        <Moon className={`w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 ${topbar.contents.icon_color}`}/>

      </div>
    </div>
  )
}

export default React.memo(TopBar);
