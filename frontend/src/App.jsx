import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { AppContextProvider } from './context/AppContextProvider';
import AboutPage from './pages/AboutPage';
import ImageGenerationPage from './pages/ImageGenerationPage';
import RootLayoutPage from './pages/RootLayoutPage';

import UserInputPage from './pages/UserInputPage';
import LoadingPage from './pages/LoadingPage';
import CardSelectionPage from './pages/CardSelectionPage/CardSelectionPage';
import UserInfoInputPage from './pages/UserInfoInputPage';
import WelcomePage from './pages/WelcomePage';

import ResultsPage from './pages/ResultsPage/ResultsPage';


function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayoutPage />}>
            <Route path="/" element={<WelcomePage />} />
            {/* <Route path="/" element={<Navigate to="/user-input" />} /> */}
            <Route path="about" element={<AboutPage />} />
            <Route path="user-input" element={<UserInputPage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="selection" element={<CardSelectionPage />} />
            <Route path="user-info-input" element={<UserInfoInputPage />} />

            <Route path="results" element={<ResultsPage />} />

          </Route>
          {/* Remove this at the end */}
          <Route path="/image-generation" element={<ImageGenerationPage />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;
