import { Routes, HashRouter, Route } from 'react-router-dom';
import './App.css';
import { DataProvider } from './contexts/DataContext';
import { PopupProvider } from './contexts/PopupContext';
import { PhaseProvider } from './contexts/PhaseContext';
import { AppInitiators } from './helpers/AppInitiators';
import WelcomePage from './pages/WelcomePage';
import PhaseOnePage from './pages/PhaseOnePage';
import { Popup } from './components/Popup';
import * as AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
AOS.init({
  duration: 1500,
  mirror: true,
  anchorPlacement: 'top',
});

export default function App() {
  return (
    <DataProvider>
      <PopupProvider>
        <Popup />
        <HashRouter>
          <PhaseProvider>
            <AppInitiators>
              <Routes>
                <Route path="/" element={<WelcomePage />}></Route>
                <Route path="/phase1" element={<PhaseOnePage />}></Route>
              </Routes>
            </AppInitiators>
          </PhaseProvider>
        </HashRouter>
      </PopupProvider>
    </DataProvider>
  );
}
