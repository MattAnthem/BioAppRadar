import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { toggleTheme } from '../../../features/theme/themeSlice';
import { toggleMinimize } from '../sidebar/sidebarSlice';
import SwitchBtn from '../../buttons/switchbtn/SwitchBtn';




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
    <div aria-label='topbar' className={`${topbar.main.bg} ${topbar.main.border} z-50 w-full flex justify-center items-center gap-3 absolute px-4 h-13 py-1 border-b drop-shadow-sm`}>

      {/* Left Controls */}
      {/* Menu toggler button for smaller screen */}
      <button aria-labelledby='collapse sidebar' name='toggle_sidebar' onClick={handleToggleSidebar} className={`${topbar.contents.toggler_hover} ${topbar.contents.togller_color} lg:hidden rounded-sm p-1`}>
        <Menu width={30}/>
      </button>
      

      {/* Right controls */}
      <div className="flex relative w-full justify-end items-center gap-3 opacity-100">

        <Sun className={topbar.contents.togller_color} width={30}/>

        {/* Switch button */}
        <SwitchBtn 
            handler_func={handleSwitch}
            isActive={isDarkMode}
            height={20}
            width={40}
            ariaLabel='Toggle theme'
            ariaControls='App theme'
        />
        
        <Moon className={topbar.contents.togller_color} width={30}/>

        {/* Langs */}
        

      </div>
    </div>
  )
}

export default TopBar;
