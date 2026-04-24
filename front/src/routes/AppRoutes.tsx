import { useEffect, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import Login from '../pages/Login.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Equipments from '../pages/Equipments.jsx'
import Users from '../pages/Users.jsx'
import PlaceholderPage from '../pages/PlaceholderPage.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import { useAuthStore } from '../store/authStore'

const queryClient = new QueryClient()

function AppBootstrap({ children }: { children: ReactNode }) {
  const fetchUser = useAuthStore((state: { fetchUser: () => Promise<unknown> }) => state.fetchUser)

  useEffect(() => {
    fetchUser().catch(() => undefined)
  }, [fetchUser])

  return children
}

export default function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppBootstrap>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipments"
              element={
                <ProtectedRoute allowedRoles={['admin', 'it_referent']}>
                  <MainLayout>
                    <Equipments />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/actions"
              element={
                <ProtectedRoute allowedRoles={['admin', 'quality_manager']}>
                  <MainLayout>
                    <PlaceholderPage title="Actions" description="Action management is ready for integration." />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/incidents"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PlaceholderPage title="Incidents" description="Incident management is ready for integration." />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ideas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PlaceholderPage title="Ideas" description="Innovation workflow page ready for backend data." />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/audits"
              element={
                <ProtectedRoute allowedRoles={['admin', 'quality_manager']}>
                  <MainLayout>
                    <PlaceholderPage title="5S Audits" description="Audit management page ready for live API data." />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MainLayout>
                    <Users />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppBootstrap>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '14px',
            background: 'rgba(15, 23, 42, 0.96)',
            color: '#f8fafc',
          },
        }}
      />
    </QueryClientProvider>
  )
}