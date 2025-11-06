import { Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import Sidebar from '../components/navigation/sidebar/Sidebar';
import TopBar from '../components/navigation/topbar/TopBar';
import { Suspense } from 'react';

/**
 * The Dashboard Main Layout, Responsible for placing the Sidebar, Topbar and the pages in their correct position
 */
const AppLayout = () => {

  const themes = useTheme();
  const { mainBg } = themes.theme;

  return (
    <div className={`${mainBg} w-full h-full flex`}>

      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-col relative w-full"> 

        {/* Topbar */}
        <TopBar/>

        <Suspense 
          fallback={
            <div className='w-full h-full'>
              Loading BioAappRadar ...
            </div>
          }
        >
          {/* Pages */}
          <Outlet />
        </Suspense>

      </div>
    </div>
  )
}

export default AppLayout;
