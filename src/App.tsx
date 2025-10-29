import './App.css';
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css"
import ScrollToHash from './shared/components/navigation/ScrollToHash';
import WindowResize from './shared/hooks/WindowResize';
import AlertFlash from './shared/components/popups/alert/AlertFlash';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './shared/layouts/AppLayout';
import OverviewDashboard from './pages/OverviewDashboard';

function App() {

  return (
    <>
      <ScrollToHash/>
      <WindowResize/>
      <AlertFlash/>
      <Routes>
        
        <Route element={<AppLayout/>}>
          <Route path='/' element={<OverviewDashboard/>} /> 
          <Route path='/overview_dash' element={<OverviewDashboard/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App;
