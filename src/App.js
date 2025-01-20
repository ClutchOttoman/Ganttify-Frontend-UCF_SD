import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import './index.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import AboutUsPage from './pages/AboutUsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EditEmailPage from './pages/EditEmailPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import DashboardChartsPage from './pages/DashboardChartsPage';
import DashboardAccountPage from './pages/DashboardAccountPage';
import ViewChartPage from './pages/ViewChartPage';
import AcceptInvitePage from './pages/AcceptInvitePage';
import RecentlyDeletedPage from './pages/RecentlyDeletedPage';
import RegisterTokenPage from './pages/RegisterTokenPage';
import VerifyEmailTokenPage from './pages/VerifyEmailTokenPage';
import ConfirmDeletePage from './pages/ConfirmDeletePage';


function App() {
  return (
    <BrowserRouter>
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
        </Routes>
    </BrowserRouter>
  );
}


export default App;
