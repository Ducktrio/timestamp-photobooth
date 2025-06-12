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
import PhaseTwoPage from './pages/PhaseTwoPage';
import PhaseThreePage from './pages/PhaseThreePage';
import PhaseFourPage from './pages/PhaseFourPage';
import PhaseFivePage from './pages/PhaseFivePage';
import PhaseSixPage from './pages/PhaseSixPage';
import PhaseSevenPage from './pages/PhaseSevenPage';
import PhaseEightPage from './pages/PhaseEightPage';
import PhaseNinePage from './pages/PhaseNinePage';
import PhaseTenPage from './pages/PhaseTenPage';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorFallback from './components/ErrorFallback';
AOS.init({
  duration: 1500,
  mirror: true,
  anchorPlacement: 'top',
});

export default function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <DataProvider>
        <PopupProvider>
          <Popup />
          <HashRouter>
            <PhaseProvider>
              <AppInitiators>
                <Routes>
                  <Route path="/" element={<WelcomePage />}></Route>
                  <Route path="/phase1" element={<PhaseOnePage />}></Route>
                  <Route path="/phase2" element={<PhaseTwoPage />}></Route>
                  <Route path="/phase3" element={<PhaseThreePage />}></Route>
                  <Route path="/phase4" element={<PhaseFourPage />}></Route>
                  <Route path="/phase5" element={<PhaseFivePage />}></Route>
                  <Route path="/phase6" element={<PhaseSixPage />}></Route>
                  <Route path="/phase7" element={<PhaseSevenPage />}></Route>
                  <Route path="/phase8" element={<PhaseEightPage />}></Route>
                  <Route path="/phase9" element={<PhaseNinePage />}></Route>
                  <Route path="/phase10" element={<PhaseTenPage />}></Route>
                </Routes>
              </AppInitiators>
            </PhaseProvider>
          </HashRouter>
        </PopupProvider>
      </DataProvider>
    </ErrorBoundary>
  );
}
