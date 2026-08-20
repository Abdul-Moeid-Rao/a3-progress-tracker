import { useState, useMemo } from 'react';
import { 
  Clock, 
  Dumbbell, 
  Flame, 
  ChevronRight, 
  Search,
  Trophy,
  TrendingUp
} from 'lucide-react';
import { startOfWeek } from 'date-fns';
import type { WorkoutSession as StoredSession } from '../types';
import { useApp } from '../contexts/useApp';

interface HistoryEntry {
  id: string;
  date: Date;
  name: string;
  duration: number; // minutes
  exercises: number;
  sets: number;
  volume: number;
  calories: number;
  prs: number;
  rating: number; // 1-5
}

function toHistoryEntry(s: StoredSession): HistoryEntry {
  const completedSets = s.exercises.flatMap(e => e.sets).filter(st => st.isCompleted);
  const volume = completedSets.reduce((acc, st) => acc + st.weight * st.reps, 0);
  return {
    id: s.id,
    date: s.startTime,
    name: s.name || 'Workout Session',
    duration: Math.floor((s.duration ?? 0) / 60),
    exercises: s.exercises.length,
    sets: s.exercises.reduce((acc, e) => acc + e.sets.length, 0),
    volume,
    calories: Math.round(340 + volume / 210),
    prs: 0,
    rating: s.rating ?? 0,
  };
}

export default function WorkoutHistory() {
  const { sessions } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');

  const historyEntries = useMemo(() => sessions.map(toHistoryEntry), [sessions]);

  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const now = new Date();
    return historyEntries
      .filter(workout => {
        if (query && !workout.name.toLowerCase().includes(query)) return false;
        if (selectedTimeRange === 'week') {
          if (workout.date < startOfWeek(now, { weekStartsOn: 1 })) return false;
        } else if (selectedTimeRange === 'month') {
          const start = new Date(now.getFullYear(), now.getMonth(), 1);
          if (workout.date < start) return false;
        } else if (selectedTimeRange === 'year') {
          const start = new Date(now.getFullYear(), 0, 1);
          if (workout.date < start) return false;
        }
        return true;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [historyEntries, searchQuery, selectedTimeRange]);

  const totalWorkouts = filteredHistory.length;
  const totalVolume = filteredHistory.reduce((acc, w) => acc + w.volume, 0);
  const totalDuration = filteredHistory.reduce((acc, w) => acc + w.duration, 0);
  const totalPRs = filteredHistory.reduce((acc, w) => acc + w.prs, 0);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-space font-bold text-white">Workout History</h1>
          <p className="text-gray-400 mt-1">Review your past workouts and track your progress</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalWorkouts}</p>
              <p className="text-xs text-gray-500">Workouts</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{(totalVolume / 1000).toFixed(1)}K</p>
              <p className="text-xs text-gray-500">Volume (lbs)</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{Math.floor(totalDuration / 60)}h</p>
              <p className="text-xs text-gray-500">Duration</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalPRs}</p>
              <p className="text-xs text-gray-500">PRs Set</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workout List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-navy-800 rounded-full flex items-center justify-center">
              <Dumbbell className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-space font-semibold text-white mb-2">No workouts found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="btn-primary"
            >
              Clear Search
            </button>
          </div>
        ) : (
          filteredHistory.map(workout => (
            <div key={workout.id} className="card card-hover">
              <div className="flex items-start gap-4">
                {/* Date Box */}
                <div className="flex-shrink-0 w-16 text-center p-2 bg-navy-800 rounded-lg">
                  <p className="text-xs text-cyan-400 font-semibold uppercase">{workout.date.toLocaleDateString('en-US', { month: 'short' })}</p>
                  <p className="text-xl font-bold text-white">{workout.date.getDate()}</p>
                </div>

                {/* Workout Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-space font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {workout.name}
                      </h3>
                      <p className="text-sm text-gray-400">{formatDate(workout.date)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Flame 
                          key={i} 
                          className={`w-4 h-4 ${i < workout.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(workout.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Dumbbell className="w-4 h-4" />
                      <span>{workout.exercises} exercises</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>{(workout.volume / 1000).toFixed(1)}K lbs</span>
                    </div>
                    {workout.prs > 0 && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Trophy className="w-4 h-4" />
                        <span>{workout.prs} PR{workout.prs > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-600 flex-shrink-0" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
