import { ChevronsUpDown } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';

type AvatarNavBtnProps = {
    isNavMinimized: boolean;
    avatarUrl: string;
    title: string;
    subtitle?: string; 
    onClick?: () => void;
}

/**
 * A navigation button with a image and text that triggers a pop-over menu
 * Follows the responsivness of the sidebar
 * 
 * @param avatarUrl : avatar URL 
 * @param isNavMinimized : track the state of the sidebar
 * @param title : title of this button
 * @param subtitle 
 * @param avatarUrl : callback function to handle the click event
 * @returns React.JSX.Element
 */
const AvatarNavBtn = (
  {
    avatarUrl,
    isNavMinimized,
    title,
    subtitle,
    onClick
  }: AvatarNavBtnProps
) => {

  const themes = useTheme();
  const { bg_hover, text, subnav_text } = themes.theme.sidebar.navs;

  return (
    <button onClick={onClick} className={`w-full ${isNavMinimized ? '' : 'p-2'} ${bg_hover}  flex justify-start items-center gap-2 rounded-sm cursor-default my-2`}>

        {/* avatar */}
        <img src={avatarUrl} className={`w-11 h-11 rounded-lg`} alt="avatar" />

        {/* Username + email */}
        <div className={`${isNavMinimized ? 'hidden' : 'text-start flex flex-col'}`}>
            <h5 className={`${text}`}>{title}</h5>
            <p className={`${subnav_text} text-sm`}>{subtitle}</p>
        </div>

        {/* control icon */}
        <ChevronsUpDown className="ml-2 text-gray-600"/>
    </button>
  )
}

export default AvatarNavBtn;
