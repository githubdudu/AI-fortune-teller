import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider } from './context/AppContextProvider';
import AboutPage from './pages/AboutPage';
import RootLayoutPage from './pages/RootLayoutPage';
import UserInputPage from './pages/UserInputPage';
import LoadingPage from './pages/LoadingPage';
import FortunePage from './pages/FortunePage';
import UserInfoInputPage from './pages/UserInfoInputPage';
import UserProfile from './pages/UserProfile/UserProfile';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayoutPage />}>
            <Route path="/" element={<Navigate to="/user-input" />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="user-input" element={<UserInputPage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="fortune" element={<FortunePage />} />
            <Route path="user-info-input" element={<UserInfoInputPage />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="sign-up" element={<SignUpPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;
