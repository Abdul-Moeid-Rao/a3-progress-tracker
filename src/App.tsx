import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { useApp } from './contexts/useApp';
import Layout from './components/layout/Layout';
import NotFound from './pages/NotFound';

// Pages (code-split to keep the initial bundle lean)
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ExerciseLibrary = lazy(() => import('./pages/ExerciseLibrary'));
const ExerciseDetail = lazy(() => import('./pages/ExerciseDetail'));
const WorkoutPlanner = lazy(() => import('./pages/WorkoutPlanner'));
const ActiveSession = lazy(() => import('./pages/ActiveSession'));
const WorkoutHistory = lazy(() => import('./pages/WorkoutHistory'));
const ProgressTracker = lazy(() => import('./pages/ProgressTracker'));
const BodyMeasurements = lazy(() => import('./pages/BodyMeasurements'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <AppProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes - No Layout */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Main App Routes - With Layout */}
            <Route path="/dashboard" element={<RequireAuth><Layout /></RequireAuth>}>
              <Route index element={<Dashboard />} />
              <Route path="exercises" element={<ExerciseLibrary />} />
              <Route path="exercises/:id" element={<ExerciseDetail />} />
              <Route path="planner" element={<WorkoutPlanner />} />
              <Route path="session" element={<ActiveSession />} />
              <Route path="history" element={<WorkoutHistory />} />
              <Route path="progress" element={<ProgressTracker />} />
              <Route path="measurements" element={<BodyMeasurements />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AppProvider>
  );
}

export default App;
