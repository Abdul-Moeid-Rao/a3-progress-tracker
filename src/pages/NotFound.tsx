import { Link } from 'react-router-dom';
import { Dumbbell, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative inline-flex items-center justify-center w-24 h-24 bg-navy-900 rounded-2xl border border-navy-700 shadow-2xl">
            <Dumbbell className="w-12 h-12 text-cyan-400" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 mb-4">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-2xl font-space font-semibold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off. Don't worry, even the best athletes miss a rep sometimes.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link 
            to="/"
            className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 px-6 py-3"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link 
            to="/dashboard/exercises"
            className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-2 px-6 py-3"
          >
            <Search className="w-5 h-5" />
            Browse Exercises
          </Link>
        </div>

        {/* Suggested Links */}
        <div className="mt-12 pt-8 border-t border-navy-700">
          <p className="text-sm text-gray-500 mb-4">Popular pages you might be looking for:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'Workout Planner', path: '/dashboard/planner' },
              { label: 'Exercise Library', path: '/dashboard/exercises' },
              { label: 'Progress Tracker', path: '/dashboard/progress' },
              { label: 'Settings', path: '/dashboard/settings' },
            ].map((page) => (
              <Link
                key={page.label}
                to={page.path}
                className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-gray-400 hover:text-white rounded-lg text-sm transition-colors"
              >
                {page.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
