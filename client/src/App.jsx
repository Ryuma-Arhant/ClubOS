import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login           from './pages/Login';
import SuperAdminDash  from './pages/SuperAdminDash';
import ClubAdminDash   from './pages/ClubAdminDash';
import CoAdminDash     from './pages/CoAdminDash';
import StudentDash     from './pages/StudentDash';
import Chat            from './pages/Chat';
import Gallery         from './pages/Gallery';
import Events          from './pages/Events';
import CreateEvent     from './pages/CreateEvent';
import EditEvent       from './pages/EditEvent';

const ROLE_ROUTES = {
  'Super Admin': '/superadmin',
  'Club Admin':  '/clubadmin',
  'Co-Admin':    '/coadmin',
  'Student':     '/student',
};

function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROLE_ROUTES[user.role] || '/'} replace />;
  }
  return children;
}

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Login />;
  return <Navigate to={ROLE_ROUTES[user.role] || '/'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/superadmin" element={
          <Protected roles={['Super Admin']}><SuperAdminDash /></Protected>
        } />
        <Route path="/clubadmin" element={
          <Protected roles={['Club Admin']}><ClubAdminDash /></Protected>
        } />
        <Route path="/coadmin" element={
          <Protected roles={['Co-Admin']}><CoAdminDash /></Protected>
        } />
        <Route path="/student" element={
          <Protected roles={['Student']}><StudentDash /></Protected>
        } />
        <Route path="/chat" element={
          <Protected><Chat /></Protected>
        } />
        <Route path="/gallery" element={
          <Protected><Gallery /></Protected>
        } />
        <Route path="/events" element={
          <Protected><Events /></Protected>
        } />
        <Route path="/events/create" element={
          <Protected roles={['Super Admin','Club Admin','Co-Admin']}><CreateEvent /></Protected>
        } />
        <Route path="/events/:id/edit" element={
          <Protected roles={['Super Admin','Club Admin','Co-Admin']}><EditEvent /></Protected>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
