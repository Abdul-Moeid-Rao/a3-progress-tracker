// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

// Exercise Types
export type MuscleGroup = 
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' 
  | 'legs' | 'quadriceps' | 'hamstrings' | 'glutes' | 'calves'
  | 'abs' | 'forearms' | 'traps' | 'lats';

export type ExerciseType = 'compound' | 'isolation' | 'cardio' | 'bodyweight';

export type Equipment = 
  | 'barbell' | 'dumbbell' | 'kettlebell' | 'cable' | 'machine'
  | 'bodyweight' | 'bands' | 'foam roller' | 'medicine ball'
  | 'bench' | 'rack';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: MuscleGroup[];
  type: ExerciseType;
  equipment: Equipment[];
  difficulty: Difficulty;
  instructions: string[];
  tips?: string[];
  videoUrl?: string;
  imageUrl?: string;
}

// Workout Plan Types
export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  days: WorkoutDay[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface WorkoutDay {
  id: string;
  dayOfWeek: number; // 0-6 (Sun-Sat)
  name: string;
  exercises: PlannedExercise[];
}

export interface PlannedExercise {
  id: string;
  exerciseId: string;
  exercise?: Exercise;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds: number;
  order: number;
  notes?: string;
}

// Workout Session Types
export interface WorkoutSession {
  id: string;
  userId: string;
  name?: string;
  workoutPlanId?: string;
  workoutDayId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  notes?: string;
  rating?: number; // 1-5
  exercises: ExerciseSession[];
}

export interface ExerciseSession {
  id: string;
  exerciseId: string;
  exercise?: Exercise;
  sets: SetLog[];
  notes?: string;
}

export interface SetLog {
  id: string;
  setNumber: number;
  reps: number;
  weight: number;
  rpe?: number; // Rate of perceived exertion 1-10
  isCompleted: boolean;
  restSeconds?: number;
}

// Body Measurement Types
export interface BodyMeasurement {
  id: string;
  userId: string;
  date: Date;
  weight?: number; // in kg or lbs
  bodyFatPercentage?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: { left?: number; right?: number };
  thighs?: { left?: number; right?: number };
  calves?: { left?: number; right?: number };
  shoulders?: number;
  neck?: number;
  notes?: string;
}

// Progress Types
export interface ExerciseProgress {
  exerciseId: string;
  exerciseName: string;
  dataPoints: ProgressDataPoint[];
}

export interface ProgressDataPoint {
  date: Date;
  maxWeight: number;
  totalVolume: number;
  bestSet?: SetLog;
}

// Filter Types
export interface ExerciseFilters {
  muscleGroups?: MuscleGroup[];
  types?: ExerciseType[];
  equipment?: Equipment[];
  difficulty?: Difficulty;
  search?: string;
}
