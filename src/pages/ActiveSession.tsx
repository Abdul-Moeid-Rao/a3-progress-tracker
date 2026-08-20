import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Check, 
  Plus,
  ChevronRight,
  Trophy,
  Clock
} from 'lucide-react';
import { useApp } from '../contexts/useApp';
import { allExercises } from '../data/exercises';
import type { ExerciseSession } from '../types';

interface ActiveSet {
  id: string;
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
  rpe?: number;
}

interface ActiveExercise {
  id: string;
  exercise: typeof allExercises[0];
  sets: ActiveSet[];
  notes?: string;
}

function buildSample(): ActiveExercise[] {
  return [
    {
      id: '1',
      exercise: allExercises[0], // Barbell Bench Press
      sets: [
        { id: '1-1', setNumber: 1, reps: 10, weight: 135, completed: true },
        { id: '1-2', setNumber: 2, reps: 8, weight: 155, completed: true },
        { id: '1-3', setNumber: 3, reps: 0, weight: 175, completed: false },
      ]
    },
    {
      id: '2',
      exercise: allExercises[5], // Pull-Ups
      sets: [
        { id: '2-1', setNumber: 1, reps: 0, weight: 0, completed: false },
        { id: '2-2', setNumber: 2, reps: 0, weight: 0, completed: false },
        { id: '2-3', setNumber: 3, reps: 0, weight: 0, completed: false },
      ]
    },
    {
      id: '3',
      exercise: allExercises[14], // Barbell Curls
      sets: [
        { id: '3-1', setNumber: 1, reps: 0, weight: 0, completed: false },
        { id: '3-2', setNumber: 2, reps: 0, weight: 0, completed: false },
        { id: '3-3', setNumber: 3, reps: 0, weight: 0, completed: false },
      ]
    }
  ];
}

export default function ActiveSession() {
  const { endSession, currentSession, activePlan, startSession } = useApp();
  const [isActive, setIsActive] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [restDuration, setRestDuration] = useState(90);
  const [isResting, setIsResting] = useState(false);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState<ActiveExercise[]>([]);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Build the workout from the active plan session, or fall back to a sample
  useEffect(() => {
    const session = currentSession ?? startSession();
    const day = session.workoutDayId && activePlan
      ? activePlan.days.find(d => d.id === session.workoutDayId)
      : undefined;

    if (day && day.exercises.length > 0) {
      setExercises(day.exercises.map(pe => ({
        id: pe.id,
        exercise: pe.exercise || allExercises.find(e => e.id === pe.exerciseId) || allExercises[0],
        sets: Array.from({ length: pe.sets }, (_, sIdx) => ({
          id: `${pe.id}-set-${sIdx + 1}`,
          setNumber: sIdx + 1,
          reps: pe.reps,
          weight: pe.weight ?? 0,
          completed: false,
        })),
      })));
    } else {
      setExercises(buildSample());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Rest timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRest = (seconds: number) => {
    setRestDuration(seconds);
    setRestTimer(seconds);
    setIsResting(true);
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  const completeSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    const set = newExercises[exerciseIndex].sets[setIndex];
    set.completed = !set.completed;
    setExercises(newExercises);

    if (set.completed) {
      startRest(90); // Start 90 second rest
    }
  };

  const updateSetValue = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
    newExercises[exerciseIndex].sets.push({
      id: `${exerciseIndex}-${Date.now()}`,
      setNumber: newExercises[exerciseIndex].sets.length + 1,
      reps: lastSet?.reps || 10,
      weight: lastSet?.weight || 0,
      completed: false
    });
    setExercises(newExercises);
  };

  const finishWorkout = () => {
    setShowCompleteModal(true);
  };

  const handleSaveWorkout = () => {
    const sessionExercises: ExerciseSession[] = exercises.map(ex => ({
      id: ex.id,
      exerciseId: ex.exercise.id,
      exercise: ex.exercise,
      notes: ex.notes,
      sets: ex.sets.map(s => ({
        id: s.id,
        setNumber: s.setNumber,
        reps: s.reps,
        weight: s.weight,
        rpe: s.rpe,
        isCompleted: s.completed,
      })),
    }));
    endSession(sessionExercises);
    setShowCompleteModal(false);
  };

  const activeExercise = exercises[activeExerciseIndex];
  const completedSets = exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-navy-900/95 backdrop-blur-md border-b border-navy-700">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-space font-bold text-white">Active Workout</h1>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-navy-800 rounded-full">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-mono text-cyan-400">{formatTime(elapsedTime)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`p-2 rounded-lg transition-colors ${
                isActive ? 'bg-navy-800 text-gray-400 hover:text-white' : 'bg-cyan-500 text-navy-950'
              }`}
              title={isActive ? 'Pause timer' : 'Resume timer'}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-400">Progress:</span>
              <span className="text-sm font-semibold text-white">{completedSets}/{totalSets} sets</span>
            </div>
            <button 
              onClick={finishWorkout}
              className="btn-primary flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Finish
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Timer */}
      <div className="sm:hidden bg-navy-800/50 px-4 py-2 flex items-center justify-center gap-2">
        <Clock className="w-4 h-4 text-cyan-400" />
        <span className="font-mono text-lg text-cyan-400">{formatTime(elapsedTime)}</span>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Exercise Navigator */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {exercises.map((ex, index) => (
              <button
                key={ex.id}
                onClick={() => setActiveExerciseIndex(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeExerciseIndex === index
                    ? 'bg-cyan-500 text-navy-950'
                    : 'bg-navy-800 text-gray-400 hover:text-white'
                }`}
              >
                {ex.exercise.name}
              </button>
            ))}
          </div>

          {/* Active Exercise Card */}
          {activeExercise && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-space font-bold text-white">{activeExercise.exercise.name}</h2>
                  <p className="text-gray-400 mt-1">{activeExercise.exercise.muscleGroups.join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Progress</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {activeExercise.sets.filter(s => s.completed).length}/{activeExercise.sets.length}
                  </p>
                </div>
              </div>

              {/* Sets */}
              <div className="space-y-2">
                {activeExercise.sets.map((set, setIndex) => (
                  <div 
                    key={set.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      set.completed 
                        ? 'bg-green-500/10 border border-green-500/30' 
                        : 'bg-navy-800/50 hover:bg-navy-800'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      set.completed ? 'bg-green-500 text-navy-950' : 'bg-navy-700 text-gray-400'
                    }`}>
                      {set.completed ? <Check className="w-5 h-5" /> : set.setNumber}
                    </div>

                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Weight</label>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateSetValue(activeExerciseIndex, setIndex, 'weight', Math.max(0, set.weight - 5))}
                            className="w-6 h-6 rounded bg-navy-700 text-gray-400 hover:text-white flex items-center justify-center"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => updateSetValue(activeExerciseIndex, setIndex, 'weight', parseInt(e.target.value) || 0)}
                            className="w-16 text-center bg-transparent border-b border-navy-600 focus:border-cyan-500 text-white font-mono"
                          />
                          <button 
                            onClick={() => updateSetValue(activeExerciseIndex, setIndex, 'weight', set.weight + 5)}
                            className="w-6 h-6 rounded bg-navy-700 text-gray-400 hover:text-white flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Reps</label>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateSetValue(activeExerciseIndex, setIndex, 'reps', Math.max(0, set.reps - 1))}
                            className="w-6 h-6 rounded bg-navy-700 text-gray-400 hover:text-white flex items-center justify-center"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSetValue(activeExerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                            className="w-12 text-center bg-transparent border-b border-navy-600 focus:border-cyan-500 text-white font-mono"
                          />
                          <button 
                            onClick={() => updateSetValue(activeExerciseIndex, setIndex, 'reps', set.reps + 1)}
                            className="w-6 h-6 rounded bg-navy-700 text-gray-400 hover:text-white flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block mb-1">RPE</label>
                        <select 
                          value={set.rpe || ''}
                          onChange={(e) => {
                            const newExercises = [...exercises];
                            newExercises[activeExerciseIndex].sets[setIndex].rpe = e.target.value ? parseInt(e.target.value) : undefined;
                            setExercises(newExercises);
                          }}
                          className="w-16 bg-navy-700 border border-navy-600 rounded px-2 py-1 text-sm text-white"
                        >
                          <option value="">-</option>
                          {[6, 7, 8, 9, 10].map(rpe => (
                            <option key={rpe} value={rpe}>{rpe}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => completeSet(activeExerciseIndex, setIndex)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        set.completed
                          ? 'bg-green-500 text-navy-950'
                          : 'bg-navy-700 text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-400'
                      }`}
                    >
                      {set.completed ? <Check className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Set Button */}
              <button 
                onClick={() => addSet(activeExerciseIndex)}
                className="w-full py-3 border-2 border-dashed border-navy-700 rounded-lg text-gray-500 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Set
              </button>
            </div>
          )}

          {/* Exercise Notes */}
          <div className="card">
            <h3 className="font-space font-semibold text-white mb-3">Workout Notes</h3>
            <textarea
              placeholder="How did the workout feel? Any observations?"
              className="w-full h-24 bg-navy-800 border border-navy-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Rest Timer Overlay */}
      {isResting && restTimer > 0 && (
        <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4">
          <div className="card flex items-center gap-4 animate-slide-in shadow-neon-cyan">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#1E293B" strokeWidth="5" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - restTimer / restDuration)}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold text-white">
                {formatTime(restTimer)}
              </span>
            </div>
            <div>
              <p className="font-space font-semibold text-white">Rest Timer</p>
              <p className="text-sm text-gray-400">Get ready for your next set</p>
            </div>
            <button onClick={skipRest} className="btn-secondary flex items-center gap-2">
              <Play className="w-4 h-4" />
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Complete Workout Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card w-full max-w-md">
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-space font-bold text-white mb-2">Workout Complete!</h2>
              <p className="text-gray-400">Great job crushing your workout today</p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-6 bg-navy-800/30">
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">{formatTime(elapsedTime)}</p>
                <p className="text-xs text-gray-500">Duration</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-400">{completedSets}</p>
                <p className="text-xs text-gray-500">Sets Done</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{exercises.length}</p>
                <p className="text-xs text-gray-500">Exercises</p>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <button 
                onClick={handleSaveWorkout}
                className="w-full btn-primary py-3"
              >
                Save Workout
              </button>
              <button 
                onClick={() => setShowCompleteModal(false)}
                className="w-full btn-secondary py-3"
              >
                Continue Working Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
