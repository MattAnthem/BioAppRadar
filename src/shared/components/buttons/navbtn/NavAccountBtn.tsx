import { useRef } from "react";
import AvatarNavBtn from "./AvatarNavBtn";
import Tooltip from "../../popups/tooltip/Tooltip";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { useClickOutside } from "../../../hooks/useClickOutside";
import UserPopup from "../../popups/userpopup/UserPopup";
import { hideUserPopup, toggleShowUserPopup } from "../../navigation/topbar/topbarSlice";

type NavAccountBtnProps = {
    isNavMinimized: boolean;
    avatarUrl: string;
    title: string;
    subtitle?: string;
}

/**
 * Nav button with a pop-over menu that shows the user account menues 
 * @param isNavMinimized: tracks the state of the sidebar 
 * @param avatarUrl: url of the avatar image
 * @param title: title of the menu
 * @returns React.JSX.Element
 */
const NavAccountBtn = (
    {
        isNavMinimized,
        avatarUrl,
        title,
        subtitle
    }: NavAccountBtnProps
) => {

    const { isShowUserPopup } = useAppSelector(state => state.topbar);
    const popupRef = useRef<HTMLDivElement | null>(null);

    const dispatch = useAppDispatch();

    const handleToggleUserPopup = () => {
        dispatch(toggleShowUserPopup());
    }

    useClickOutside(popupRef,() => {
        if (isShowUserPopup) {
            dispatch(hideUserPopup());
        }
    });

  return (
    <div ref={popupRef}>

        <Tooltip position="right" display_condition={isNavMinimized} text="Account">
            <div className={`w-full relative`}>

                <AvatarNavBtn
                    avatarUrl={avatarUrl}
                    isNavMinimized={isNavMinimized}
                    title={title}
                    subtitle={subtitle}
                    onClick={handleToggleUserPopup}
                />

                <UserPopup 
                    email={subtitle}
                    username={title}
                    avatarUrl={avatarUrl}
                    className={`
                        transition-all duration-75 ease-out
                        origin-bottom-left
                        ${isShowUserPopup ? 
                            "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                        }
                    `}
                />


            </div>
        </Tooltip>

    </div>
  )
}

export default NavAccountBtn;