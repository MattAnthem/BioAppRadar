

type SubnavBtnProps = {
    sub: string;
    handleNavSubmenue: (sub: string) => void;
    className: string;
}

/**
 * Subnav button that can be attached to a Nav button
 * @param className: additional class name to style this component 
 * @param handleNavSubmenue: callback function to handle the navigation from this submenu
 * @param sub: the submenue name
 * @returns React.JSX.Elemet
 */
const SubnavBtn = (
    {
        className,
        handleNavSubmenue,
        sub
    }: SubnavBtnProps
) => {
  return (

        <button 
          aria-label='nav-submenu'
          aria-controls='subnav'
          key={sub} 
          onKeyDown={() => handleNavSubmenue(sub)} 
          onClick={() => handleNavSubmenue(sub)} 
          className={`${className} rounded-sm p-2 cursor-pointer  w-full flex items-start focus-visible:outline-2 outline-offset-1 outline-blue-600`}
        >
          {sub}
        </button>

  )
}

export default SubnavBtn;
