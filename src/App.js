import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { DarkModeProvider } from "./components/DarkModeContext"; // Ensure correct path
import { HighContrastModeProvider } from "./components/HighContrastModeContext"; // Ensure correct path
import NavBar from "./components/NavBar";
import './index.css';

import AboutUsPage from './pages/AboutUsPage';
import AcceptInvitePage from './pages/AcceptInvitePage';
import CardPage from './pages/CardPage';
import ConfirmDeletePage from './pages/ConfirmDeletePage';
import ConfirmRestorePage from './pages/ConfirmRestorePage';
import DashboardAccountPage from './pages/DashboardAccountPage';
import DashboardChartsPage from './pages/DashboardChartsPage';
import DashboardPage from './pages/DashboardPage';
import EditEmailPage from './pages/EditEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RecentlyDeletedPage from './pages/RecentlyDeletedPage';
import RegisterPage from './pages/RegisterPage';
import RegisterTokenPage from './pages/RegisterTokenPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UISettingsPage from "./pages/UISettingsPage";
import VerifyEmailPage from './pages/VerifyEmailPage';
import VerifyEmailTokenPage from './pages/VerifyEmailTokenPage';
import ViewChartPage from './pages/ViewChartPage';

function App() {
  //Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    return savedMode ? JSON.parse(savedMode) : false; // default to light mode if no saved value
  });

  useEffect(() => {
    // Apply dark mode class immediately when the app loads
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]); // This will run once on mount



//High Contrast
  const [isHighContrastMode, setIsHighContrastMode] = useState(() => {
    const savedMode = localStorage.getItem('isHighContrastMode');
    return savedMode ? JSON.parse(savedMode) : false; // default to light mode if no saved value
  });

  useEffect(() => {
    // Apply dark mode class immediately when the app loads
    if (isHighContrastMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrastMode]); // This will run once on mount



  return (
    <HighContrastModeProvider>
    <DarkModeProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/cards" element={<CardPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:id/:token" element={<ResetPasswordPage />} />
          <Route path="/verify-email/:email/:token" element={<VerifyEmailPage />} />
          <Route path="/edit-email/:email/:token" element={<EditEmailPage />} />
          <Route path="/dashboard/charts" element={<DashboardChartsPage/>}/>
          <Route path="/dashboard/account" element={<DashboardAccountPage/>}/>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="/dashboard/recently-deleted" element={<RecentlyDeletedPage/>}/>
          <Route path="/viewchart/:id" element={<ViewChartPage/>}/>
          <Route path="/accept-invite/:token" element={<AcceptInvitePage />} />
          <Route path="/register/:token" element={<RegisterTokenPage />} />
          <Route path="/verify-invite/:token" element={<VerifyEmailTokenPage />} />
          <Route path="/confirm-delete/:userId/:token" element={<ConfirmDeletePage />} />
          <Route path="/restore-account/:userId/:token" element={<ConfirmRestorePage />} />
          <Route path="/ui-settings" element={<UISettingsPage />} />
        </Routes>
    </BrowserRouter>
    </DarkModeProvider>
    </HighContrastModeProvider>
  );
}


export default App;
