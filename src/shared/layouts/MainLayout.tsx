import  { type ReactNode } from 'react';

type LayoutProps = {
    className?: string;
    children: ReactNode;
}

/**
 * Responsive Layout used by the dashboard Pages
 * @param children: Elements of the page
 * @param className: Additional tailwind classes
 * @returns React.JSX.Element
 */
const MainLayout = ({ className, children }: LayoutProps) => {
  return (
    <div className={`${className} w-full h-screen  xl:px-8 px-4 py-14 overflow-y-scroll overflow-x-hidden`}>
      {children}
    </div>
  )
}

export default MainLayout;
