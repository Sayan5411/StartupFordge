import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from '@/context/AuthContext';
import { AppShell, RequireAuth } from '@/components/Shell';
import {
  Landing, AuthPage, Dashboard, Opportunities, NewOpportunity, OpportunityDetail,
  Applications, Projects, Workspace, Community, Startups, StartupDetail,
  Mentors, Learn, Notifications, Profile,
} from '@/pages/all';

const Shell = (el) => <RequireAuth><AppShell>{el}</AppShell></RequireAuth>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/app" element={Shell(<Dashboard />)} />
          <Route path="/app/opportunities" element={Shell(<Opportunities />)} />
          <Route path="/app/opportunities/new" element={Shell(<NewOpportunity />)} />
          <Route path="/app/opportunities/:id" element={Shell(<OpportunityDetail />)} />
          <Route path="/app/applications" element={Shell(<Applications />)} />
          <Route path="/app/projects" element={Shell(<Projects />)} />
          <Route path="/app/projects/:id" element={Shell(<Workspace />)} />
          <Route path="/app/community" element={Shell(<Community />)} />
          <Route path="/app/startups" element={Shell(<Startups />)} />
          <Route path="/app/startups/:id" element={Shell(<StartupDetail />)} />
          <Route path="/app/mentors" element={Shell(<Mentors />)} />
          <Route path="/app/learn" element={Shell(<Learn />)} />
          <Route path="/app/notifications" element={Shell(<Notifications />)} />
          <Route path="/app/profile" element={Shell(<Profile />)} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
