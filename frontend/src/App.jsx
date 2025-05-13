import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider } from './context/AppContextProvider';
import AboutPage from './pages/AboutPage';
import RootLayoutPage from './pages/RootLayoutPage';
import UserInputPage from './pages/UserInputPage';
import LoadingPage from './pages/LoadingPage';
import FortunePage from './pages/FortunePage';
import UserInfoInputPage from './pages/UserInfoInputPage';
import UserProfile from './pages/UserProfile/UserProfile';
import SignUpPage from './pages/SignUpPage';
import GalleryPage from './pages/GalleryPage';
import AuthRoute from './authroute/AuthRoute';

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayoutPage />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="home" element={<UserInputPage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route
              path="user-info-input"
              element={
                <AuthRoute>
                  <UserInfoInputPage />
                </AuthRoute>
              }
            />
            <Route
              path="fortune"
              element={
                <AuthRoute>
                  <FortunePage />
                </AuthRoute>
              }
            />
            <Route
              path="profile"
              element={
                <AuthRoute>
                  <UserProfile />
                </AuthRoute>
              }
            />
            <Route
              path="gallery"
              element={
                <AuthRoute>
                  <GalleryPage />
                </AuthRoute>
              }
            />

            <Route path="sign-up" element={<SignUpPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;
