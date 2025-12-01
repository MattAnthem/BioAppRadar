import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setToDarkTheme, setToLightTheme } from '../../../features/theme/themeSlice';
import { toggleMinimize } from '../sidebar/sidebarSlice';
import React from 'react';
import OptionPopover from '../../popups/option/OptionPopover';
import { useRwandaClock } from '../../../hooks/dates/useRwandaClock';


const TopBar = () => {

    const themes = useTheme();
    const { topbar } = themes.theme;

    const dispatch = useAppDispatch();

    const { isDarkMode } = useAppSelector(state => state.theme);

    const rwandaClock = useRwandaClock();

    const setThemeDark = () => { 
        dispatch(setToDarkTheme());
    }

    const setThemeLight = () => {
        dispatch(setToLightTheme());
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

        {/* Rwanda Clock Display */}
        <div className="px-1 block items-center">
          <div className={`font-mono w-[19ch] ${topbar.contents.icon_color}`}>
              {rwandaClock}
          </div>
        </div>

        <OptionPopover
            hoverText='Themes'
            customIcon={
              isDarkMode ? <Moon className={`w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 ${topbar.contents.icon_color}`}/> 
                          : <Sun className={`w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 ${topbar.contents.icon_color}`}/>}
            isSimpleSelect
        >

            <div className='flex flex-col gap-2 p-2'>
                <button 
                    aria-label='Change theme to light'
                    onClick={setThemeLight} 
                    className={`w-full text-left px-3 py-1 rounded-sm ${!isDarkMode ? topbar.contents.popover.active_bg : ''} ${topbar.contents.popover.text} ${topbar.contents.popover.option_hover} ${!isDarkMode ? 'font-semibold underline' : ''}`}
                >
                    Light Theme
                </button>
                <button 
                    aria-label='Change theme to dark'
                    onClick={setThemeDark} 
                    className={`w-full text-left px-3 py-1 rounded-sm ${isDarkMode ? topbar.contents.popover.active_bg : ''} ${topbar.contents.popover.text} ${topbar.contents.popover.option_hover} ${isDarkMode ? 'font-semibold underline' : ''}`}
                >
                    Dark Theme
                </button>
            </div>

        </OptionPopover>

      </div>
    </div>
  )
}

export default React.memo(TopBar);
