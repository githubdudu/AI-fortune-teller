import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { AppContextProvider } from './context/AppContextProvider';
import AboutPage from './pages/AboutPage';
import ImageGenerationPage from './pages/ImageGenerationPage';
import RootLayoutPage from './pages/RootLayoutPage';
import UserInputPage from './pages/UserInputPage';

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayoutPage />}>
            <Route path="/" element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="user-input" element={<UserInputPage />} />
          </Route>
          {/* Remove this at the end */}
          <Route path="/image-generation" element={<ImageGenerationPage />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;
