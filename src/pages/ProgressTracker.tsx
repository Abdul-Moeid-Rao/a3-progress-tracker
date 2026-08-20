import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, TrendingUp, Calendar, Dumbbell, ChevronRight, Activity, Plus, X, Scale, Medal, Pencil, Trash2 } from 'lucide-react';
import { startOfWeek, format } from 'date-fns';
import type { Exercise, WorkoutSession, ExerciseSession } from '../types';
import { allExercises } from '../data/exercises';
import { useApp } from '../contexts/useApp';

interface LiftedSet {
  exerciseId: string;
  weight: number;
  reps: number;
  sets: number;
}

interface ProgressSession {
  id: string;
  date: Date;
  name: string;
  duration: number;
  exercises: LiftedSet[];
  volume: number;
  calories: number;
}

const LIFT_DEFS: Record<string, { start: number; increment: number; reps: number; sets: number }> = {
  '1': { start: 135, increment: 5, reps: 5, sets: 4 }, // Bench Press
  '13': { start: 95, increment: 5, reps: 8, sets: 3 }, // Overhead Press
  '15': { start: 65, increment: 5, reps: 10, sets: 3 }, // Barbell Curls
  '5': { start: 275, increment: 10, reps: 5, sets: 1 }, // Deadlift
  '6': { start: 0, increment: 0, reps: 8, sets: 3 }, // Pull-Ups
  '9': { start: 225, increment: 10, reps: 5, sets: 5 }, // Barbell Squat
  '10': { start: 155, increment: 5, reps: 10, sets: 3 }, // Romanian Deadlift
};

const ROUTINES: { name: string; lifts: string[] }[] = [
  { name: 'Push Day', lifts: ['1', '13', '15'] },
  { name: 'Pull Day', lifts: ['5', '6', '15'] },
  { name: 'Leg Day', lifts: ['9', '10'] },
];

function buildSessions(): ProgressSession[] {
  const state = Object.entries(LIFT_DEFS).reduce<Record<string, { weight: number; count: number }>>((acc, [id, def]) => {
    acc[id] = { weight: def.start, count: 0 };
    return acc;
  }, {});

  const today = new Date();
  const sessions: ProgressSession[] = [];
  let idx = 0;

  for (let cycle = 0; cycle < 11; cycle++) {
    ROUTINES.forEach((routine, routineIdx) => {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() - (ROUTINES.length * 11 - idx) * 7);

      const entries: LiftedSet[] = routine.lifts.map(id => {
        const st = state[id];
        st.count += 1;
        const def = LIFT_DEFS[id];
        if (def.increment > 0 && st.count % 3 === 0) st.weight += def.increment;
        return { exerciseId: id, weight: st.weight, reps: def.reps, sets: def.sets };
      });

      const volume = entries.reduce((acc, e) => acc + e.weight * e.reps * e.sets, 0);

      sessions.push({
        id: `s-${idx}`,
        date: dayDate,
        name: routine.name,
        duration: 52 + routineIdx * 9 + (cycle % 3) * 4,
        exercises: entries,
        volume,
        calories: Math.round(340 + volume / 210),
      });
      idx += 1;
    });
  }

  return sessions.sort((a, b) => a.date.getTime() - b.date.getTime());
}

const baselineSessions = buildSessions();

const PALETTE = ['#00E5FF', '#7C3AED', '#22C55E', '#F59E0B', '#EC4899', '#06B6D4', '#8B5CF6'];

const RANGE_DAYS: Record<string, number> = { '1m': 30, '3m': 90, '6m': 180, '1y': 365 };
const RANGE_LABELS: Record<string, string> = {
  '1m': 'Last Month',
  '3m': 'Last 3 Months',
  '6m': 'Last 6 Months',
  '1y': 'Last Year',
};

interface LogRow {
  exerciseId: string;
  weight: string;
  reps: string;
  sets: string;
}

interface LogLift {
  exerciseId: string;
  weight: number;
  reps: number;
  sets: number;
}

const DEFAULT_LOG_ROW: LogRow = { exerciseId: '1', weight: '', reps: '', sets: '' };

function toLocalDateInput(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toWorkoutSession(partial: {
  id: string;
  userId: string;
  name: string;
  date: Date;
  durationMinutes: number;
  lifts: LogLift[];
}): WorkoutSession {
  const now = Date.now();
  const exercises: ExerciseSession[] = partial.lifts.map((l, idx) => ({
    id: `lg-es-${now}-${idx}`,
    exerciseId: l.exerciseId,
    sets: Array.from({ length: l.sets }, (_, i) => ({
      id: `lg-set-${now}-${idx}-${i}`,
      setNumber: i + 1,
      reps: l.reps,
      weight: l.weight,
      isCompleted: true,
    })),
  }));
  return {
    id: partial.id,
    userId: partial.userId,
    name: partial.name,
    startTime: partial.date,
    duration: partial.durationMinutes * 60,
    exercises,
  };
}

function toProgressSession(s: WorkoutSession): ProgressSession {
  const exercises: LiftedSet[] = s.exercises.map(es => {
    const completed = es.sets.filter(st => st.isCompleted);
    let weight = 0;
    let reps = 0;
    completed.forEach(st => {
      if (st.weight > weight) {
        weight = st.weight;
        reps = st.reps;
      }
    });
    return { exerciseId: es.exerciseId, weight, reps, sets: completed.length };
  });
  const volume = exercises.reduce((acc, e) => acc + e.weight * e.reps * e.sets, 0);
  return {
    id: s.id,
    date: s.startTime,
    name: s.name || 'Logged Workout',
    duration: Math.floor((s.duration ?? 0) / 60),
    exercises,
    volume,
    calories: Math.round(340 + volume / 210),
  };
}

export default function ProgressTracker() {
  const { sessions: userSessions, measurements, addSession, updateSession, deleteSession, currentUser } = useApp();
  const [selectedExercise, setSelectedExercise] = useState('1');
  const [timeRange, setTimeRange] = useState('3m');

  // Log Workout modal state
  const [showLogModal, setShowLogModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [editingSession, setEditingSession] = useState<WorkoutSession | null>(null);
  const [logForm, setLogForm] = useState({ name: '', date: toLocalDateInput(new Date()), duration: '60' });
  const [logRows, setLogRows] = useState<LogRow[]>([{ ...DEFAULT_LOG_ROW }]);

  const userSessionIds = useMemo(() => new Set(userSessions.map(s => s.id)), [userSessions]);

  // Merge the baseline history with real sessions from the app context
  const sessions = useMemo<ProgressSession[]>(() => {
    return [...baselineSessions, ...userSessions.map(toProgressSession)].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [userSessions]);

  const filteredSessions = useMemo(() => {
    const days = RANGE_DAYS[timeRange];
    const cutoff = new Date(Date.now() - days * 86400000);
    return sessions.filter(s => s.date >= cutoff);
  }, [sessions, timeRange]);

  const exerciseOptions = useMemo(() => {
    const ids = [...new Set(sessions.flatMap(s => s.exercises.map(e => e.exerciseId)))];
    return ids.map(id => {
      const ex = allExercises.find(e => e.id === id);
      return { id, name: ex?.name || id };
    });
  }, [sessions]);

  const selectedColor = useMemo(() => {
    const index = exerciseOptions.findIndex(e => e.id === selectedExercise);
    return PALETTE[Math.max(0, index) % PALETTE.length];
  }, [exerciseOptions, selectedExercise]);

  // Strength chart data for the selected lift
  const strengthData = useMemo(() => {
    return filteredSessions
      .filter(s => s.exercises.some(e => e.exerciseId === selectedExercise))
      .map(s => {
        const entry = s.exercises.find(e => e.exerciseId === selectedExercise)!;
        return {
          date: format(s.date, 'MMM d'),
          weight: entry.weight,
        };
      });
  }, [filteredSessions, selectedExercise]);

  // Weekly volume data
  const volumeData = useMemo(() => {
    const weeks: Record<string, number> = {};
    filteredSessions.forEach(s => {
      const key = format(startOfWeek(s.date, { weekStartsOn: 1 }), 'MMM d');
      weeks[key] = (weeks[key] || 0) + s.volume;
    });
    return Object.entries(weeks).map(([week, volume]) => ({ week, volume }));
  }, [filteredSessions]);

  // Stats
  const stats = useMemo(() => {
    // PR count: any time a lift beats its previous best
    const maxes: Record<string, number> = {};
    let prCount = 0;
    sessions.forEach(s => {
      s.exercises.forEach(e => {
        if (e.weight > 0) {
          if (!(e.exerciseId in maxes)) {
            maxes[e.exerciseId] = e.weight;
          } else if (e.weight > maxes[e.exerciseId]) {
            maxes[e.exerciseId] = e.weight;
            prCount += 1;
          }
        }
      });
    });

    // Strength increase for the selected lift
    const liftPoints = strengthData;
    let strengthIncrease = 0;
    if (liftPoints.length >= 2) {
      const first = liftPoints[0].weight;
      const last = liftPoints[liftPoints.length - 1].weight;
      if (first > 0) strengthIncrease = Math.round(((last - first) / first) * 100);
    }

    const totalVolume = filteredSessions.reduce((acc, s) => acc + s.volume, 0);
    const weekSpan = Math.max(1, Math.ceil(filteredSessions.length / 7));
    const avgVolume = Math.round(totalVolume / weekSpan / 100) / 10;

    return { prCount, strengthIncrease, workouts: filteredSessions.length, avgVolume };
  }, [sessions, filteredSessions, strengthData]);

  // Personal records across all time
  const records = useMemo(() => {
    const map: Record<string, { exercise: Exercise; bestWeight: number; bestE1RM: number; bestVolume: number; bestDate: Date }> = {};
    sessions.forEach(s => {
      s.exercises.forEach(e => {
        const ex = allExercises.find(x => x.id === e.exerciseId);
        if (!ex) return;
        const e1rm = e.reps > 1 ? e.weight * (1 + e.reps / 30) : e.weight;
        const vol = e.weight * e.reps * e.sets;
        const prev = map[e.exerciseId];
        if (!prev) {
          map[e.exerciseId] = { exercise: ex, bestWeight: e.weight, bestE1RM: e1rm, bestVolume: vol, bestDate: s.date };
        } else {
          if (e.weight > prev.bestWeight) prev.bestWeight = e.weight;
          if (e1rm > prev.bestE1RM) prev.bestE1RM = e1rm;
          if (vol > prev.bestVolume) prev.bestVolume = vol;
        }
      });
    });
    return Object.values(map)
      .filter(r => r.bestWeight > 0)
      .sort((a, b) => b.bestWeight - a.bestWeight);
  }, [sessions]);

  // Body composition
  const sortedMeasurements = useMemo(() =>
    [...measurements].sort((a, b) => a.date.getTime() - b.date.getTime()),
  [measurements]);

  const latestMeasurement = sortedMeasurements[sortedMeasurements.length - 1];

  const weightData = useMemo(() =>
    sortedMeasurements.map(m => ({ date: format(m.date, 'MMM d'), weight: m.weight ?? 0 })),
  [sortedMeasurements]);

  const recentWorkouts = useMemo(() =>
    [...sessions].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5),
  [sessions]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const statCards = [
    { label: 'Total PRs', value: String(stats.prCount), icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Strength Increase', value: `+${stats.strengthIncrease}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Workouts Completed', value: String(stats.workouts), icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Avg Volume/Week', value: `${stats.avgVolume.toFixed(1)}K`, icon: Dumbbell, color: 'text-violet-400', bg: 'bg-violet-400/10' },
  ];

  const updateLogRow = (index: number, key: keyof LogRow, value: string) => {
    setLogRows(prev => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };

  const openLogModal = () => {
    setEditingSession(null);
    setLogForm({ name: '', date: toLocalDateInput(new Date()), duration: '60' });
    setLogRows([{ ...DEFAULT_LOG_ROW }]);
    setShowLogModal(true);
  };

  const handleEdit = (progress: ProgressSession) => {
    const original = userSessions.find(s => s.id === progress.id);
    if (!original) return;
    setEditingSession(original);
    setLogForm({
      name: original.name || '',
      date: toLocalDateInput(original.startTime),
      duration: String(Math.floor((original.duration ?? 0) / 60) || 60),
    });
    setLogRows(
      original.exercises.map(es => {
        const completed = es.sets.filter(st => st.isCompleted);
        const best = completed.reduce<{ weight: number; reps: number } | null>((acc, st) => {
          if (!acc || st.weight > acc.weight) return { weight: st.weight, reps: st.reps };
          return acc;
        }, null);
        return {
          exerciseId: es.exerciseId,
          weight: best ? String(best.weight) : '',
          reps: best ? String(best.reps) : '',
          sets: String(Math.max(1, completed.length)),
        };
      })
    );
    setShowLogModal(true);
  };

  const handleDelete = (id: string) => {
    deleteSession(id);
  };

  const handleSaveLog = () => {
    const lifts: LogLift[] = logRows
      .filter(r => r.exerciseId && Number(r.weight) > 0 && Number(r.reps) > 0)
      .map(r => ({ exerciseId: r.exerciseId, weight: Number(r.weight), reps: Number(r.reps), sets: Number(r.sets) || 1 }));

    if (lifts.length === 0 || !logForm.name.trim()) return;

    const isEditing = editingSession !== null;
    const common = {
      name: logForm.name.trim(),
      date: new Date(`${logForm.date}T12:00:00`),
      durationMinutes: Number(logForm.duration) || 0,
      lifts,
    };

    if (isEditing) {
      updateSession(toWorkoutSession({
        id: editingSession.id,
        userId: editingSession.userId,
        ...common,
      }));
    } else {
      addSession(toWorkoutSession({
        id: `lg-${Date.now()}`,
        userId: currentUser?.id || '',
        ...common,
      }));
    }

    setEditingSession(null);
    setLogForm({ name: '', date: toLocalDateInput(new Date()), duration: '60' });
    setLogRows([{ ...DEFAULT_LOG_ROW }]);
    setShowLogModal(false);
    setToastMessage(isEditing ? 'Workout updated!' : 'Workout saved!');
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-space font-bold text-white">Progress Tracker</h1>
          <p className="text-gray-400 mt-1">Monitor your strength gains and workout consistency</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            {Object.entries(RANGE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            onClick={openLogModal}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Log Workout
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-navy-950 px-4 py-3 rounded-lg shadow-lg animate-slide-in flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-4">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-space font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strength Progress Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="font-space font-semibold text-white">Strength Progress</h3>
              <p className="text-sm text-gray-400">Weight lifted over time (lbs)</p>
            </div>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="px-3 py-1.5 bg-navy-800 border border-navy-700 rounded text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              {exerciseOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={strengthData}>
                <defs>
                  <linearGradient id={`colorStrength-${selectedExercise}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedColor} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={selectedColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  domain={['dataMin - 10', 'dataMax + 10']}
                  tickFormatter={(value) => `${Number(value)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${Number(value)} lbs`, 'Max weight']}
                  labelFormatter={(label) => String(label)}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke={selectedColor}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#colorStrength-${selectedExercise})`}
                  dot={{ fill: selectedColor, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-space font-semibold text-white">Weekly Volume</h3>
              <p className="text-sm text-gray-400">Total weight lifted per week</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Activity className="w-4 h-4 text-violet-400" />
              <span>lbs/week</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="week" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `${(Number(value) / 1000).toFixed(1)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${Number(value).toLocaleString()} lbs`, 'Volume']}
                  labelFormatter={(label) => String(label)}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#7C3AED"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Records + Body Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Personal Records Table */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-space font-semibold text-white">Personal Records</h3>
              <p className="text-sm text-gray-400">Your all-time best lifts</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Medal className="w-4 h-4 text-yellow-400" />
              <span>{records.length} lifts</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="pb-3 font-medium">Exercise</th>
                  <th className="pb-3 font-medium">Best Weight</th>
                  <th className="pb-3 font-medium">Est. 1RM</th>
                  <th className="pb-3 font-medium">Best Volume</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {records.map((record, index) => (
                  <tr key={record.exercise.id} className="group">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        {index < 3 ? (
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                            index === 1 ? 'bg-gray-400/20 text-gray-300' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {index + 1}
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-gray-500 bg-navy-800">
                            {index + 1}
                          </span>
                        )}
                        <span className="text-sm font-medium text-white">{record.exercise.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-sm font-semibold text-cyan-400">{record.bestWeight}</span>
                      <span className="text-xs text-gray-500 ml-1">lbs</span>
                    </td>
                    <td className="py-3 text-sm text-white">{Math.round(record.bestE1RM)} lbs</td>
                    <td className="py-3 text-sm text-white">{record.bestVolume.toLocaleString()} lbs</td>
                    <td className="py-3 text-sm text-gray-400">
                      {record.bestDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Body Composition */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-space font-semibold text-white">Body Composition</h3>
              <p className="text-sm text-gray-400">Weight trend over time</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>lbs</span>
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  domain={['dataMin - 3', 'dataMax + 3']}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${Number(value)} lbs`, 'Weight']}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#00E5FF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWeight)"
                  dot={{ fill: '#00E5FF', r: 2.5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {latestMeasurement && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-navy-800/50 rounded-lg">
                <p className="text-xs text-gray-500">Weight</p>
                <p className="text-lg font-bold text-white">{latestMeasurement.weight ?? '—'} <span className="text-xs font-normal text-gray-500">lbs</span></p>
              </div>
              <div className="p-3 bg-navy-800/50 rounded-lg">
                <p className="text-xs text-gray-500">Body Fat</p>
                <p className="text-lg font-bold text-white">{latestMeasurement.bodyFatPercentage ?? '—'} <span className="text-xs font-normal text-gray-500">%</span></p>
              </div>
              <div className="p-3 bg-navy-800/50 rounded-lg">
                <p className="text-xs text-gray-500">Waist</p>
                <p className="text-lg font-bold text-white">{latestMeasurement.waist ?? '—'} <span className="text-xs font-normal text-gray-500">in</span></p>
              </div>
              <div className="p-3 bg-navy-800/50 rounded-lg">
                <p className="text-xs text-gray-500">Chest</p>
                <p className="text-lg font-bold text-white">{latestMeasurement.chest ?? '—'} <span className="text-xs font-normal text-gray-500">in</span></p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Workouts List */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-space font-semibold text-white">Recent Workouts</h2>
          {userSessions.length > 0 && (
            <span className="text-xs text-gray-500">{userSessions.length} logged workout{userSessions.length > 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="space-y-3">
          {recentWorkouts.map(workout => (
            <div key={workout.id} className="card card-hover">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-14 text-center p-2 bg-navy-800 rounded-lg">
                  <p className="text-xs text-cyan-400 font-semibold">
                    {workout.date.toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                  <p className="text-lg font-bold text-white">{workout.date.getDate()}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-space font-semibold text-white">{workout.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-400 flex-wrap">
                    <span>{formatDuration(workout.duration)}</span>
                    <span>•</span>
                    <span>{workout.exercises.length} exercises</span>
                    <span>•</span>
                    <span>{workout.exercises.reduce((a, e) => a + e.sets, 0)} sets</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-sm flex-shrink-0">
                  <div className="text-right">
                    <p className="font-semibold text-white">{(workout.volume / 1000).toFixed(1)}K</p>
                    <p className="text-gray-500 text-xs">lbs</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{workout.calories}</p>
                    <p className="text-gray-500 text-xs">kcal</p>
                  </div>
                </div>
                {userSessionIds.has(workout.id) && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(workout)}
                      className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                      title="Edit workout"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete workout"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Workout Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-navy-700">
              <div>
                <h2 className="text-xl font-space font-bold text-white">{editingSession ? 'Edit Workout' : 'Log Workout'}</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {editingSession ? 'Update the details of this training session' : 'Record a completed training session'}
                </p>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Session details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="text-sm text-gray-400 mb-1 block">Workout Name</label>
                  <input
                    type="text"
                    value={logForm.name}
                    onChange={(e) => setLogForm(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field w-full"
                    placeholder="Push Day"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Date</label>
                  <input
                    type="date"
                    value={logForm.date}
                    onChange={(e) => setLogForm(prev => ({ ...prev, date: e.target.value }))}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Duration (min)</label>
                  <input
                    type="number"
                    value={logForm.duration}
                    onChange={(e) => setLogForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="input-field w-full"
                    placeholder="60"
                  />
                </div>
              </div>

              {/* Exercise rows */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">Exercises</label>
                  <button
                    onClick={() => setLogRows(prev => [...prev, { ...DEFAULT_LOG_ROW }])}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add exercise
                  </button>
                </div>
                <div className="space-y-3">
                  {logRows.map((row, index) => (
                    <div key={index} className="flex items-center gap-2 bg-navy-800/50 rounded-lg p-2.5">
                      <select
                        value={row.exerciseId}
                        onChange={(e) => updateLogRow(index, 'exerciseId', e.target.value)}
                        className="flex-1 min-w-0 bg-navy-800 border border-navy-700 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        {allExercises.map(ex => (
                          <option key={ex.id} value={ex.id}>{ex.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={row.weight}
                        onChange={(e) => updateLogRow(index, 'weight', e.target.value)}
                        className="w-16 text-center bg-navy-800 border border-navy-700 rounded-lg px-1 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                        placeholder="lbs"
                        title="Weight (lbs)"
                      />
                      <input
                        type="number"
                        value={row.reps}
                        onChange={(e) => updateLogRow(index, 'reps', e.target.value)}
                        className="w-14 text-center bg-navy-800 border border-navy-700 rounded-lg px-1 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                        placeholder="reps"
                        title="Reps"
                      />
                      <input
                        type="number"
                        value={row.sets}
                        onChange={(e) => updateLogRow(index, 'sets', e.target.value)}
                        className="w-14 text-center bg-navy-800 border border-navy-700 rounded-lg px-1 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                        placeholder="sets"
                        title="Sets"
                      />
                      <button
                        onClick={() => setLogRows(prev => prev.filter((_, i) => i !== index))}
                        disabled={logRows.length === 1}
                        className="p-2 text-gray-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                        title="Remove exercise"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-navy-700">
              <button
                onClick={() => setShowLogModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLog}
                className="flex-1 btn-primary"
              >
                {editingSession ? 'Update Workout' : 'Save Workout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
