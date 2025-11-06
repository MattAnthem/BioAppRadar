import { Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import Sidebar from '../components/navigation/sidebar/Sidebar';
import TopBar from '../components/navigation/topbar/TopBar';
import { Suspense } from 'react';
import loadWebp from '../../assets/loader.webp';

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
            <div className='w-full h-full flex items-center justify-center'>
              <div className="flex flex-col items-center justify-center">
                <img className='w-8 h-8' src={loadWebp} alt="loading" />
                <p className='text-blue-700 tracking-wide'>Loading page...</p>
              </div>
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
