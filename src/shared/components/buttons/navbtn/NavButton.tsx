import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../hooks/useTheme';
import Tooltip from '../../popups/tooltip/Tooltip';
import SubnavBtn from './SubnavBtn';
import NavContent from './NavContent';
import type { MenuNames } from './MenuTypes';



type NavBtnProps = {
    title: string;
    icon?: React.JSX.Element;
    menu_to: MenuNames;
    handleActivate: (menu: MenuNames) => void;
    isNav_minimized: boolean;
    active: MenuNames;
    subMenues?: string[];
    tooltipText: string;
    badge?: string | number;
    // accessibility
    ariaLabel?: string;
    ariaControls?: string;
}

/**
 * Navigation button attached to the Sidebar Element.
 * 
 * @param title: Nav Title 
 * @param icon: Nav icon 
 * @param menu_to: Navigation link uri 
 * @param handleActivate: Callback function to set the active Nav from the Sidebar
 * @param isNav_minimized: State to track the parent size and modifies the button display
 * @param active: State to track the active Nav
 * @param subMenues: List of submenues
 * @returns React.JSX.Element
 */
const NavButton = (
  { active, 
    handleActivate, 
    isNav_minimized, 
    menu_to, 
    title, 
    icon, 
    subMenues,
    ariaLabel,
    ariaControls,
    tooltipText,
    badge
  }: NavBtnProps
) => {

  const [showSubMenu, setShowSubMenu] = useState(false);
  const {theme} = useTheme();
  const { navs } = theme.sidebar;

  const navigate = useNavigate();

  const handleNavigation = () => {
    if (subMenues && isNav_minimized) {
      navigate("/"+menu_to);
      handleActivate(menu_to);
    }
    if (subMenues) {
      setShowSubMenu(!showSubMenu);
    } else {
      handleActivate(menu_to);
      navigate("/"+menu_to);
    }
    
  }

  // Scrolls to a specifiic section of a page
  const handleNavSubmenu = (sectionId: string) => {
    navigate(menu_to+'#'+sectionId.toLowerCase());
    handleActivate(menu_to);
  }

  return (
    <>
    {/* Wrap the nav with a tooltip to show text when the navbar is minimized */}
    <Tooltip position='right' text={tooltipText} display_condition={isNav_minimized}> 

      {/* The actual Nav button */}
      <button 
          role='menuitem' 
          onKeyUp={() => handleNavigation()}
          aria-label={ariaLabel}
          aria-controls={ariaControls}
          onClick={() => handleNavigation()}
          className={`
                      flex rounded-sm w-full items-start justify-between p-3 my-2 gap-2 cursor-pointer 
                      focus-visible:outline-2 outline-offset-1 outline-blue-800
                      ${
                        (active === menu_to) ? 
                          navs.bg_active + ' ' + navs.text_active
                          :
                          navs.text + ' ' + navs.bg_hover + ' ' + navs.text_hover
                      } 
                      sm:justify-center justify-between
          `}
      >

        <NavContent
          badge={badge}
          isNav_minimized={isNav_minimized}
          showSubMenu={showSubMenu}
          title={title}
          icon={icon}
          subMenues={subMenues}
        />

      </button>
    </Tooltip>
    {/* Show submenus if this NavButton has some */}
    {
      (subMenues && showSubMenu && !isNav_minimized) && (
        <div role='tree' className={`${navs.subnav_border} ml-6 p-1 border-l-1 flex flex-col items-start`}>
          {
            subMenues?.map((sub) => (
              <SubnavBtn
                key={sub}
                className={navs.subnav_hover+ ' '+navs.subnav_text}
                handleNavSubmenue={handleNavSubmenu}
                sub={sub}
              />
            ))
          }
        </div>
      )
      
    }
    </>
  )
}

export default NavButton;
