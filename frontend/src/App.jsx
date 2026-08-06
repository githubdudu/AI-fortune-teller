import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider } from './context/AppContextProvider';
import RootLayoutPage from './pages/RootLayoutPage';
import UserInputPage from './pages/UserInputPage';
import FortunePage from './pages/FortunePage';
import UserInfoInputPage from './pages/UserInfoInputPage';
import UserProfile from './pages/UserProfile/UserProfile';
import SignUpPage from './pages/SignUpPage';
import AuthRoute from './authroute/AuthRoute';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayoutPage />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="home" element={<UserInputPage />} />
            <Route
              path="user-info-input"
              element={
                <AuthRoute>
                  <UserInfoInputPage />
                </AuthRoute>
              }
            />
            <Route
              path="fortune/*"
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
            <Route path="sign-up" element={<SignUpPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;
