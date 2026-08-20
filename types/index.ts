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
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  days: WorkoutDay[];
}

export interface WorkoutDay {
  id: string;
  workoutPlanId: string;
  dayOfWeek: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  exercises: WorkoutPlanExercise[];
}

export interface WorkoutPlanExercise {
  id: string;
  workoutDayId: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds: number;
  order: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  exercise?: Exercise;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutPlanId?: string;
  workoutDayId?: string;
  name?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  notes?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
  exercises: ExerciseSession[];
}

export interface ExerciseSession {
  id: string;
  workoutSessionId: string;
  exerciseId: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  exercise?: Exercise;
  sets: SetLog[];
}

export interface SetLog {
  id: string;
  exerciseSessionId: string;
  setNumber: number;
  reps: number;
  weight: number;
  rpe?: number;
  isCompleted: boolean;
  restSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  bodyFatPercentage?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  armLeft?: number;
  armRight?: number;
  thighLeft?: number;
  thighRight?: number;
  calfLeft?: number;
  calfRight?: number;
  shoulders?: number;
  neck?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseFilters {
  muscleGroups?: MuscleGroup[];
  types?: ExerciseType[];
  equipment?: Equipment[];
  difficulty?: Difficulty;
  search?: string;
}

export interface PlannedItem {
  id: string;
  exercise: Exercise;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds: number;
  notes?: string;
}