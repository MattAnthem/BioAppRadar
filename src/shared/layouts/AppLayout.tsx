import { Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import Sidebar from '../components/navigation/sidebar/Sidebar';
import TopBar from '../components/navigation/topbar/TopBar';

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

        {/* Pages */}
        <Outlet />

      </div>
    </div>
  )
}

export default AppLayout;
