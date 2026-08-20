import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, Exercise, WorkoutPlan, WorkoutSession, ExerciseSession, BodyMeasurement } from '../types';
import { allExercises } from '../data/exercises';

const PLANS_STORAGE_KEY = 'fitforge_workout_plans';
const SESSIONS_STORAGE_KEY = 'fitforge_sessions';
const MEASUREMENTS_STORAGE_KEY = 'fitforge_measurements';
const AUTH_STORAGE_KEY = 'fitforge_current_user';
const USERS_STORAGE_KEY = 'fitforge_users';

interface RegisteredUser extends User {
  password: string;
}

interface AddToPlanOptions {
  sets?: number;
  reps?: number;
  restSeconds?: number;
  weight?: number;
  notes?: string;
}

interface AppContextType {
  // User
  currentUser: User | null;
  isAuthenticated: boolean;
  registerUser: (name: string, email: string, password: string) => { success: boolean; error?: string; user?: User };
  loginUser: (email: string, password: string) => { success: boolean; error?: string; user?: User };
  logoutUser: () => void;
  
  // Exercises
  exercises: Exercise[];
  getExerciseById: (id: string) => Exercise | undefined;
  
  // Workout Plans
  workoutPlans: WorkoutPlan[];
  addWorkoutPlan: (plan: WorkoutPlan) => void;
  updateWorkoutPlan: (plan: WorkoutPlan) => void;
  deleteWorkoutPlan: (id: string) => void;
  activePlan: WorkoutPlan | null;
  setActivePlan: (plan: WorkoutPlan | null) => void;
  addToPlan: (exercise: Exercise, options?: AddToPlanOptions) => void;
  
  // Workout Sessions
  sessions: WorkoutSession[];
  addSession: (session: WorkoutSession) => void;
  updateSession: (session: WorkoutSession) => void;
  deleteSession: (id: string) => void;
  currentSession: WorkoutSession | null;
  setCurrentSession: (session: WorkoutSession | null) => void;
  startSession: (planId?: string, dayId?: string) => WorkoutSession;
  endSession: (exercises?: ExerciseSession[], notes?: string) => void;
  
  // Body Measurements
  measurements: BodyMeasurement[];
  addMeasurement: (measurement: BodyMeasurement) => void;
  latestMeasurement: BodyMeasurement | null;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export { AppContext };

function hydratePlan(raw: unknown): WorkoutPlan | null {
  try {
    const plan = raw as WorkoutPlan;
    if (!plan || typeof plan !== 'object' || !Array.isArray(plan.days)) return null;
    return {
      ...plan,
      createdAt: new Date(plan.createdAt),
      updatedAt: new Date(plan.updatedAt),
      days: plan.days.map(day => ({
        ...day,
        exercises: (day.exercises || []).map((ex, index) => ({
          ...ex,
          order: ex.order ?? index,
          exercise: allExercises.find(e => e.id === ex.exerciseId) || ex.exercise,
        })),
      })),
    };
  } catch {
    return null;
  }
}

function loadPlans(): WorkoutPlan[] {
  try {
    const raw = localStorage.getItem(PLANS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    return parsed.map(hydratePlan).filter((p): p is WorkoutPlan => p !== null);
  } catch {
    return [];
  }
}

const mockMeasurements: BodyMeasurement[] = [
  { id: 'm1', userId: '1', date: new Date(2026, 0, 1), weight: 185, bodyFatPercentage: 18, chest: 42, waist: 34, hips: 38, arms: { right: 14 }, thighs: { right: 23 }, shoulders: 48 },
  { id: 'm2', userId: '1', date: new Date(2026, 1, 1), weight: 183, bodyFatPercentage: 17.5, chest: 42.5, waist: 33.5, hips: 37.5, arms: { right: 14.2 }, thighs: { right: 23.2 }, shoulders: 48.5 },
  { id: 'm3', userId: '1', date: new Date(2026, 2, 1), weight: 181, bodyFatPercentage: 16.8, chest: 43, waist: 33, hips: 37, arms: { right: 14.5 }, thighs: { right: 23.5 }, shoulders: 49 },
  { id: 'm4', userId: '1', date: new Date(2026, 3, 1), weight: 180, bodyFatPercentage: 16.2, chest: 43.5, waist: 32.5, hips: 36.5, arms: { right: 14.8 }, thighs: { right: 23.8 }, shoulders: 49.5 },
  { id: 'm5', userId: '1', date: new Date(2026, 4, 1), weight: 179, bodyFatPercentage: 15.5, chest: 44, waist: 32, hips: 36, arms: { right: 15 }, thighs: { right: 24 }, shoulders: 50 },
  { id: 'm6', userId: '1', date: new Date(2026, 5, 1), weight: 178, bodyFatPercentage: 15, chest: 44.5, waist: 31.5, hips: 35.5, arms: { right: 15.2 }, thighs: { right: 24.2 }, shoulders: 50.5 },
  { id: 'm7', userId: '1', date: new Date(2026, 6, 1), weight: 177, bodyFatPercentage: 14.5, chest: 45, waist: 31, hips: 35, arms: { right: 15.5 }, thighs: { right: 24.5 }, shoulders: 51 },
];

function loadSessions(): WorkoutSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WorkoutSession[];
    return parsed.map(s => ({
      ...s,
      startTime: new Date(s.startTime),
      endTime: s.endTime ? new Date(s.endTime) : undefined,
      exercises: (s.exercises || []).map(es => ({
        ...es,
        exercise: es.exerciseId ? allExercises.find(e => e.id === es.exerciseId) || es.exercise : es.exercise,
      })),
    }));
  } catch {
    return [];
  }
}

function loadMeasurements(): BodyMeasurement[] {
  try {
    const raw = localStorage.getItem(MEASUREMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MEASUREMENTS_STORAGE_KEY, JSON.stringify(mockMeasurements));
      return mockMeasurements;
    }
    const parsed = JSON.parse(raw) as BodyMeasurement[];
    if (parsed.length === 0) return mockMeasurements;
    return parsed.map(m => ({ ...m, date: new Date(m.date) }));
  } catch {
    return mockMeasurements;
  }
}

function loadCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as User;
    if (!user || !user.id || !user.email) return null;
    return { ...user, createdAt: new Date(user.createdAt) };
  } catch {
    return null;
  }
}

function loadRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RegisteredUser[];
    return parsed.map(u => ({ ...u, createdAt: new Date(u.createdAt) }));
  } catch {
    return [];
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(loadCurrentUser);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(loadRegisteredUsers);
  const isAuthenticated = !!currentUser;

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // storage unavailable - ignore
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));
    } catch {
      // storage unavailable - ignore
    }
  }, [registeredUsers]);

  const registerUser = useCallback((name: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (registeredUsers.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false as const, error: 'An account with this email already exists. Please sign in.' };
    }
    const user: User = {
      id: Date.now().toString(),
      email: normalizedEmail,
      name: name.trim(),
      createdAt: new Date(),
    };
    setRegisteredUsers(prev => [...prev, { ...user, password }]);
    setCurrentUser(user);
    return { success: true as const, user };
  }, [registeredUsers]);

  const loginUser = useCallback((email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!account) {
      return { success: false as const, error: 'No account found with this email. Please sign up first.' };
    }
    if (account.password !== password) {
      return { success: false as const, error: 'Incorrect email or password.' };
    }
    const { password: _ignored, ...user } = account;
    setCurrentUser(user);
    return { success: true as const, user };
  }, [registeredUsers]);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // Exercises
  const exercises = allExercises;
  const getExerciseById = useCallback((id: string) => {
    return allExercises.find(e => e.id === id);
  }, []);

  // Workout Plans (persisted to localStorage)
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(loadPlans);
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(workoutPlans));
    } catch {
      // storage unavailable - ignore
    }
  }, [workoutPlans]);

  const addWorkoutPlan = useCallback((plan: WorkoutPlan) => {
    setWorkoutPlans(prev => [...prev, plan]);
  }, []);
  
  const updateWorkoutPlan = useCallback((plan: WorkoutPlan) => {
    setWorkoutPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
    setActivePlan(plan);
  }, []);
  
  const deleteWorkoutPlan = useCallback((id: string) => {
    setWorkoutPlans(prev => prev.filter(p => p.id !== id));
    setActivePlan(prev => prev?.id === id ? null : prev);
  }, []);

  const addToPlan = useCallback((exercise: Exercise, options?: AddToPlanOptions) => {
    const sets = options?.sets ?? 3;
    const reps = options?.reps ?? 10;
    const restSeconds = options?.restSeconds ?? 60;

    setActivePlan(prev => {
      if (!prev) return prev;
      const updated: WorkoutPlan = {
        ...prev,
        days: prev.days.map((day, index) => {
          if (index !== 0) return day;
          return {
            ...day,
            exercises: [
              ...day.exercises,
              {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                exerciseId: exercise.id,
                exercise,
                sets,
                reps,
                weight: options?.weight,
                restSeconds,
                order: day.exercises.length,
                notes: options?.notes,
              },
            ],
          };
        }),
        updatedAt: new Date(),
      };
      setWorkoutPlans(prevPlans =>
        prevPlans.some(p => p.id === updated.id)
          ? prevPlans.map(p => p.id === updated.id ? updated : p)
          : [...prevPlans, updated]
      );
      return updated;
    });
  }, []);

  // Workout Sessions
  const [sessions, setSessions] = useState<WorkoutSession[]>(loadSessions);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // storage unavailable - ignore
    }
  }, [sessions]);
  
  const startSession = useCallback((planId?: string, dayId?: string): WorkoutSession => {
    const newSession: WorkoutSession = {
      id: Date.now().toString(),
      userId: currentUser?.id || '',
      workoutPlanId: planId,
      workoutDayId: dayId,
      startTime: new Date(),
      exercises: [],
    };
    setCurrentSession(newSession);
    return newSession;
  }, [currentUser]);
  
  const endSession = useCallback((exercises?: ExerciseSession[], notes?: string) => {
    if (currentSession) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - currentSession.startTime.getTime()) / 1000);
      const completedSession: WorkoutSession = {
        ...currentSession,
        exercises: exercises ?? currentSession.exercises ?? [],
        endTime,
        duration,
        notes,
      };
      setSessions(prev => [...prev, completedSession]);
      setCurrentSession(null);
    }
  }, [currentSession]);
  
  const addSession = useCallback((session: WorkoutSession) => {
    setSessions(prev => [...prev, session]);
  }, []);

  const updateSession = useCallback((session: WorkoutSession) => {
    setSessions(prev => prev.map(s => (s.id === session.id ? session : s)));
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  // Body Measurements
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(loadMeasurements);

  useEffect(() => {
    try {
      localStorage.setItem(MEASUREMENTS_STORAGE_KEY, JSON.stringify(measurements));
    } catch {
      // storage unavailable - ignore
    }
  }, [measurements]);
  
  const addMeasurement = useCallback((measurement: BodyMeasurement) => {
    setMeasurements(prev => [...prev, measurement]);
  }, []);
  
  const latestMeasurement = measurements.length > 0 
    ? measurements[measurements.length - 1] 
    : null;

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const value: AppContextType = {
    currentUser,
    isAuthenticated,
    registerUser,
    loginUser,
    logoutUser,
    exercises,
    getExerciseById,
    workoutPlans,
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    activePlan,
    setActivePlan,
    addToPlan,
    sessions,
    addSession,
    updateSession,
    deleteSession,
    currentSession,
    setCurrentSession,
    startSession,
    endSession,
    measurements,
    addMeasurement,
    latestMeasurement,
    sidebarOpen,
    setSidebarOpen,
    currentPage,
    setCurrentPage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
