import { CreditCardIcon, LogOut, Sparkles, SquareUserRound } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';

type UserPopupProps = {
    username?: string;
    avatarUrl?: string;
    email?: string;
    onLogout?: () => void;
    className?: string;
}

const UserPopup = ({ username, email, onLogout, avatarUrl, className } : UserPopupProps) => {

    const themes = useTheme();
    const { bg, border, btn_hover, text_primary, text_secondary, separator_border } = themes.theme.userPopup;

  return (
    <div className={`${className} ${bg} ${border} z-40 absolute left-full ml-0.5 bottom-0 w-60 rounded-sm shadow-lg border flex flex-col`}>

        {/* Overview */}
        <div className={`${separator_border} w-full p-2.5 border-b flex gap-2`}>

            {/* avatar */}
            <img src={avatarUrl} className={`w-11 h-11 rounded-lg`} alt="avatar" />

            <div className={`flex flex-col`}>
                <h5 className={`${text_primary}`}>{username}</h5>
                <p className={`${text_secondary} text-sm`}>{email}</p>
            </div>

        </div>

        {/* Upgrade btn */}
        <div className={`${separator_border} w-full p-1 border-b`}>
            <button className={`${btn_hover} w-full p-2 flex text-sm items-center justify-start gap-2 rounded-sm`}>
                <Sparkles width={18} height={18} className={`${text_secondary}`}/>
                Upgrade to pro
            </button>
        </div>

        {/* account buttons */}
        <div className="w-full p-1">

            <button className={`${btn_hover} w-full p-2 flex text-sm items-center justify-start gap-2 rounded-sm`}>
                <SquareUserRound width={18} height={18} className={`${text_secondary}`}/>
                Account
            </button>

            <button className={`${btn_hover} w-full p-2 flex text-sm items-center justify-start gap-2 rounded-sm`}>
                <CreditCardIcon width={18} height={18} className={`${text_secondary}`}/>
                Billing
            </button>

        </div>

        {/* Logout btn */}
        <div className={`${separator_border} w-full p-1 border-t`}>
            <button onClick={onLogout} className={`${btn_hover} w-full p-2 flex text-sm items-center justify-start gap-2 rounded-sm`}>
                <LogOut width={18} height={18} className={`${text_secondary}`}/>
                Logout
            </button>
        </div>


    </div>
  )
}

export default UserPopup;
