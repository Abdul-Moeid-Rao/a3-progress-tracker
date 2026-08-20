import { Link } from 'react-router-dom';
import {
  Dumbbell,
  TrendingUp,
  Calendar,
  LineChart,
  LayoutDashboard,
  ArrowRight,
  Flame,
  Target,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../contexts/useApp';
import heroImg from '../assets/hero.png';

const features = [
  {
    icon: Calendar,
    title: 'Smart Workout Planner',
    description: 'Build structured weekly routines, organize exercises by day, and track your planned volume.',
  },
  {
    icon: LineChart,
    title: 'Progress Tracking',
    description: 'Log every set, rep, and pound lifted. Watch your strength climb over time with detailed charts.',
  },
  {
    icon: BarChart3,
    title: 'Body Measurements',
    description: 'Record your weight and body metrics to see the full picture of your transformation.',
  },
];

const stats = [
  { icon: Dumbbell, value: '50+', label: 'Exercises' },
  { icon: Flame, value: '0', label: 'Effort Required' },
  { icon: TrendingUp, value: '∞', label: 'Progress Potential' },
];

export default function Home() {
  const { isAuthenticated } = useApp();

  return (
    <div className="min-h-screen bg-navy-950 text-gray-100">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-navy-950/80 backdrop-blur-md border-b border-navy-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-cyan-500 rounded-lg">
              <Dumbbell className="w-6 h-6 text-navy-950" />
            </div>
            <div>
              <h1 className="font-space font-bold text-lg text-white leading-tight">FitForge</h1>
              <p className="text-xs text-cyan-400">Progress Tracker</p>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6">
              <Flame className="w-4 h-4" />
              FitForge • Fitness Web Platform
            </span>
            <h2 className="text-4xl sm:text-5xl font-space font-bold text-white leading-tight mb-6">
              Train Smarter.
              <br />
              <span className="neon-text">Track Everything.</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-lg">
              Plan your workouts, log every lift, and watch your progress come to life.
              Your complete fitness companion built for results.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary flex items-center gap-2 px-6 py-3 text-base">
                  <LayoutDashboard className="w-5 h-5" />
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary flex items-center gap-2 px-6 py-3 text-base">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/login" className="btn-secondary flex items-center gap-2 px-6 py-3 text-base">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              {stats.map(stat => (
                <div key={stat.label} className="card-hover p-4 text-center">
                  <stat.icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-space font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-slide-in">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
            <img
              src={heroImg}
              alt="FitForge hero"
              className="relative w-full rounded-2xl border border-navy-700 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-space font-bold text-white mb-3">
            Everything You Need to Progress
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A complete toolkit to plan, perform, and measure your fitness journey.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(feature => (
            <div key={feature.title} className="card-hover p-6">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h4 className="font-space font-semibold text-white text-lg mb-2">{feature.title}</h4>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="card p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-600/10" />
          <div className="relative">
            <Target className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl sm:text-3xl font-space font-bold text-white mb-3">
              Ready to Crush Your Goals?
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Join FitForge and take the guesswork out of training.
              Your progress is waiting.
            </p>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
                <LayoutDashboard className="w-5 h-5" />
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-cyan-500 rounded-lg">
              <Dumbbell className="w-5 h-5 text-navy-950" />
            </div>
            <span className="font-space font-semibold text-white">FitForge</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 Abdul Moeid Rao &amp; Team | All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
