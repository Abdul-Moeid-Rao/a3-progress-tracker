import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { 
  Plus, 
  Dumbbell, 
  GripVertical, 
  Trash2, 
  Copy, 
  ChevronLeft,
  ChevronRight,
  Save,
  Search,
  X,
  Check,
  Play,
  Settings2,
  ListChecks
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { allExercises } from '../data/exercises';
import type { Exercise, MuscleGroup, WorkoutDay, WorkoutPlan } from '../types';
import { useApp } from '../contexts/useApp';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MUSCLE_FILTERS: { label: string; groups?: MuscleGroup[]; type?: 'cardio' }[] = [
  { label: 'All' },
  { label: 'Chest', groups: ['chest'] },
  { label: 'Back', groups: ['back', 'lats', 'traps'] },
  { label: 'Shoulders', groups: ['shoulders'] },
  { label: 'Legs', groups: ['legs', 'quadriceps', 'hamstrings', 'glutes', 'calves'] },
  { label: 'Arms', groups: ['biceps', 'triceps', 'forearms'] },
  { label: 'Core', groups: ['abs'] },
  { label: 'Cardio', type: 'cardio' },
];

interface PlannedItem {
  id: string;
  exercise: Exercise;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds: number;
  notes?: string;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function WorkoutPlanner() {
  const navigate = useNavigate();
  const { currentUser, activePlan, addWorkoutPlan, updateWorkoutPlan, setActivePlan, startSession } = useApp();

  const [activeDay, setActiveDay] = useState(0);
  const [planName, setPlanName] = useState('My Workout Plan');
  const [planDescription, setPlanDescription] = useState('');
  const [weeklyPlan, setWeeklyPlan] = useState<PlannedItem[][]>(() =>
    DAYS.map(() => [])
  );

  // Library state
  const [librarySearch, setLibrarySearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');

  // Config modal state
  const [modalItem, setModalItem] = useState<PlannedItem | null>(null);
  const [modalSets, setModalSets] = useState(3);
  const [modalReps, setModalReps] = useState(10);
  const [modalRest, setModalRest] = useState(60);
  const [modalWeight, setModalWeight] = useState<string>('');

  const [savedToast, setSavedToast] = useState(false);

  // Load saved plan from context on first render
  useEffect(() => {
    if (activePlan && activePlan.days.length > 0) {
      setPlanName(activePlan.name);
      setPlanDescription(activePlan.description || '');
      const days: PlannedItem[][] = activePlan.days.map(day =>
        [...day.exercises]
          .sort((a, b) => a.order - b.order)
          .map(ex => ({
            id: ex.id,
            exercise: ex.exercise || allExercises.find(e => e.id === ex.exerciseId) || allExercises[0],
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            restSeconds: ex.restSeconds,
            notes: ex.notes,
          }))
      );
      while (days.length < 7) days.push([]);
      setWeeklyPlan(days);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtered exercise library
  const libraryExercises = useMemo(() => {
    let list = allExercises;
    const filter = MUSCLE_FILTERS.find(f => f.label === muscleFilter);
    if (filter?.type === 'cardio') {
      list = list.filter(e => e.type === 'cardio');
    } else if (filter?.groups) {
      list = list.filter(e => e.muscleGroups.some(m => filter.groups!.includes(m)));
    }
    if (librarySearch.trim()) {
      const q = librarySearch.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.muscleGroups.some(m => m.toLowerCase().includes(q)) ||
        e.equipment.some(eq => eq.toLowerCase().includes(q))
      );
    }
    return list;
  }, [librarySearch, muscleFilter]);

  const addToDay = (dayIndex: number, item: PlannedItem, index?: number) => {
    setWeeklyPlan(prev => prev.map((day, i) => {
      if (i !== dayIndex) return day;
      const next = [...day];
      if (index === undefined || index > next.length) next.push(item);
      else next.splice(index, 0, item);
      return next;
    }));
  };

  const removeFromDay = (dayIndex: number, itemId: string) => {
    setWeeklyPlan(prev => prev.map((day, i) =>
      i === dayIndex ? day.filter(it => it.id !== itemId) : day
    ));
  };

  const updateItem = (itemId: string, patch: Partial<PlannedItem>) => {
    setWeeklyPlan(prev => prev.map(day =>
      day.map(it => it.id === itemId ? { ...it, ...patch } : it)
    ));
  };

  // Open config modal for a (new or existing) planned item
  const openConfigModal = (item: PlannedItem) => {
    setModalItem(item);
    setModalSets(item.sets);
    setModalReps(item.reps);
    setModalRest(item.restSeconds);
    setModalWeight(item.weight ? String(item.weight) : '');
  };

  const addFromLibrary = (exercise: Exercise, index?: number) => {
    const item: PlannedItem = {
      id: uid(),
      exercise,
      sets: 3,
      reps: 10,
      restSeconds: 60,
    };
    addToDay(activeDay, item, index);
    openConfigModal(item);
  };

  const duplicateItem = (item: PlannedItem) => {
    addToDay(activeDay, { ...item, id: uid() });
  };

  const applyModal = () => {
    if (!modalItem) return;
    updateItem(modalItem.id, {
      sets: modalSets,
      reps: modalReps,
      restSeconds: modalRest,
      weight: modalWeight ? parseFloat(modalWeight) : undefined,
    });
    setModalItem(null);
  };

  const deleteModalItem = () => {
    if (!modalItem) return;
    removeFromDay(activeDay, modalItem.id);
    setModalItem(null);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    // Drag from library -> plan: add new exercise
    if (source.droppableId === 'library' && destination.droppableId === 'plan') {
      const exercise = libraryExercises[source.index];
      if (!exercise) return;
      addFromLibrary(exercise, destination.index);
      return;
    }

    // Reorder within plan
    if (source.droppableId === 'plan' && destination.droppableId === 'plan') {
      setWeeklyPlan(prev => prev.map((day, i) => {
        if (i !== activeDay) return day;
        const next = [...day];
        const [moved] = next.splice(source.index, 1);
        if (!moved) return day;
        next.splice(destination.index, 0, moved);
        return next;
      }));
    }
  };

  // Current day stats
  const dayItems = weeklyPlan[activeDay];
  const totalExercises = dayItems.length;
  const totalSets = dayItems.reduce((acc, e) => acc + e.sets, 0);
  const estimatedTime = Math.ceil(dayItems.reduce((acc, e) => acc + (e.sets * (e.restSeconds + 60)), 0) / 60);
  const totalVolume = dayItems.reduce((acc, e) => acc + (e.weight || 0) * e.sets * e.reps, 0);

  const handleSave = () => {
    const days: WorkoutDay[] = weeklyPlan.map((items, i) => ({
      id: `day-${i + 1}`,
      dayOfWeek: i,
      name: DAYS[i],
      exercises: items.map((item, order) => ({
        id: item.id,
        exerciseId: item.exercise.id,
        exercise: item.exercise,
        sets: item.sets,
        reps: item.reps,
        weight: item.weight,
        restSeconds: item.restSeconds,
        order,
        notes: item.notes,
      })),
    }));

    if (activePlan) {
      const updated: WorkoutPlan = {
        ...activePlan,
        name: planName || 'My Workout Plan',
        description: planDescription,
        days,
        updatedAt: new Date(),
      };
      updateWorkoutPlan(updated);
    } else {
      const newPlan: WorkoutPlan = {
        id: uid(),
        userId: currentUser?.id || '1',
        name: planName || 'My Workout Plan',
        description: planDescription,
        days,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };
      addWorkoutPlan(newPlan);
      setActivePlan(newPlan);
    }

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleStartWorkout = () => {
    if (dayItems.length > 0) {
      startSession(activePlan?.id, `day-${activeDay + 1}`);
    }
    navigate('/dashboard/session');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-space font-bold text-white">Workout Planner</h1>
          <p className="text-gray-400 mt-1">Design your perfect weekly training split</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Plan
          </button>
          <button
            onClick={handleStartWorkout}
            disabled={dayItems.length === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            Start Workout
          </button>
        </div>
      </div>

      {/* Saved toast */}
      {savedToast && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-navy-950 px-4 py-3 rounded-lg shadow-lg animate-slide-in flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span className="font-semibold">Workout plan saved!</span>
        </div>
      )}

      {/* Plan Info */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1 block">Plan Name</label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="input-field w-full"
              placeholder="e.g., Push Pull Legs"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1 block">Description</label>
            <input
              type="text"
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              className="input-field w-full"
              placeholder="Brief description of your plan"
            />
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveDay(Math.max(0, activeDay - 1))}
          className="p-2 bg-navy-800 text-gray-400 hover:text-white rounded-lg transition-colors flex-shrink-0"
          disabled={activeDay === 0}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {DAYS.map((day, index) => (
          <button
            key={day}
            onClick={() => setActiveDay(index)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex-shrink-0 ${
              activeDay === index
                ? 'bg-cyan-500 text-navy-950'
                : 'bg-navy-800 text-gray-400 hover:text-white hover:bg-navy-700'
            }`}
          >
            {day.slice(0, 3)}
            {weeklyPlan[index].length > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                activeDay === index ? 'bg-navy-950/30' : 'bg-cyan-500/20 text-cyan-400'
              }`}>
                {weeklyPlan[index].length}
              </span>
            )}
          </button>
        ))}

        <button
          onClick={() => setActiveDay(Math.min(DAYS.length - 1, activeDay + 1))}
          className="p-2 bg-navy-800 text-gray-400 hover:text-white rounded-lg transition-colors flex-shrink-0"
          disabled={activeDay === DAYS.length - 1}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-cyan-400">{totalExercises}</p>
          <p className="text-xs text-gray-500">Exercises</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-violet-400">{totalSets}</p>
          <p className="text-xs text-gray-500">Total Sets</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{estimatedTime}</p>
          <p className="text-xs text-gray-500">Minutes</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{(totalVolume / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-500">Volume lbs</p>
        </div>
      </div>

      {/* Two-Column Drag & Drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Exercise Library */}
          <div className="lg:col-span-1">
            <div className="card flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-space font-semibold text-white">Exercise Library</h3>
                <span className="text-xs text-gray-500">{libraryExercises.length} exercises</span>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-navy-800 border border-navy-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
                {librarySearch && (
                  <button
                    onClick={() => setLibrarySearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Muscle chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {MUSCLE_FILTERS.map(filter => (
                  <button
                    key={filter.label}
                    onClick={() => setMuscleFilter(filter.label)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                      muscleFilter === filter.label
                        ? 'bg-cyan-500 text-navy-950'
                        : 'bg-navy-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Scrollable library list */}
              <Droppable droppableId="library" isDropDisabled>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-1.5 overflow-y-auto custom-scrollbar pr-1 max-h-[480px] lg:max-h-[560px] transition-colors rounded-lg ${
                      snapshot.isDraggingOver ? 'bg-navy-800/30' : ''
                    }`}
                  >
                    {libraryExercises.map((exercise, index) => (
                      <Draggable key={exercise.id} draggableId={`lib-${exercise.id}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => addFromLibrary(exercise)}
                            className={`group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${
                              snapshot.isDragging
                                ? 'bg-cyan-500/10 border border-cyan-500/50 shadow-neon-cyan'
                                : 'bg-navy-800/50 hover:bg-navy-800 hover:border-cyan-500/30 border border-transparent'
                            }`}
                          >
                            <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Dumbbell className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{exercise.name}</p>
                              <p className="text-xs text-gray-500 capitalize">
                                {exercise.muscleGroups[0]} • {exercise.type}
                              </p>
                            </div>
                            <Plus className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 flex-shrink-0" />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5">
                <span className="text-cyan-400 font-medium">Drag</span> an exercise to {DAYS[activeDay]}'s plan or
                <span className="text-cyan-400 font-medium"> click</span> to add.
              </p>
            </div>
          </div>

          {/* Today's Plan Drop Zone */}
          <div className="lg:col-span-2">
            <div className="card flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-space font-semibold text-white">{DAYS[activeDay]}'s Plan</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ListChecks className="w-4 h-4" />
                  <span>{totalSets} sets • {estimatedTime} min</span>
                </div>
              </div>

              <Droppable droppableId="plan">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[300px] rounded-lg border-2 border-dashed transition-colors p-2 ${
                      snapshot.isDraggingOver
                        ? 'border-cyan-500/70 bg-cyan-500/5'
                        : dayItems.length === 0
                          ? 'border-navy-700'
                          : 'border-navy-800'
                    }`}
                  >
                    {dayItems.length === 0 ? (
                      <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 mb-4 bg-navy-800 rounded-full flex items-center justify-center">
                          <Dumbbell className="w-8 h-8 text-gray-600" />
                        </div>
                        <h4 className="font-space font-semibold text-white mb-2">No exercises yet</h4>
                        <p className="text-gray-400 text-sm mb-4">
                          Drag exercises from the library or click one to build {DAYS[activeDay]}'s workout
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {dayItems.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`card group transition-all ${
                                  snapshot.isDragging ? 'shadow-neon-cyan rotate-2 scale-[1.02] border-cyan-500/50' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="p-2 text-gray-600 hover:text-cyan-400 cursor-grab active:cursor-grabbing flex-shrink-0"
                                  >
                                    <GripVertical className="w-5 h-5" />
                                  </div>

                                  <div className="w-9 h-9 bg-navy-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Dumbbell className="w-4 h-4 text-cyan-400" />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-space font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                                      {item.exercise.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 flex-wrap">
                                      <span className="text-cyan-400 font-medium">{item.sets} sets</span>
                                      <span>×</span>
                                      <span className="text-violet-400 font-medium">{item.reps} reps</span>
                                      {item.weight ? (
                                        <>
                                          <span>•</span>
                                          <span>{item.weight} lbs</span>
                                        </>
                                      ) : null}
                                      <span>•</span>
                                      <span>{formatRest(item.restSeconds)} rest</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                      onClick={() => openConfigModal(item)}
                                      className="p-2 text-gray-500 hover:text-cyan-400 transition-colors"
                                      title="Edit details"
                                    >
                                      <Settings2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => duplicateItem(item)}
                                      className="p-2 text-gray-500 hover:text-cyan-400 transition-colors"
                                      title="Duplicate"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => removeFromDay(activeDay, item.id)}
                                      className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                      title="Remove"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* Config Modal */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card w-full max-w-lg animate-slide-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-space font-bold text-white">{modalItem.exercise.name}</h2>
                <p className="text-sm text-gray-400 mt-1 capitalize">
                  {modalItem.exercise.muscleGroups.join(', ')} • {modalItem.exercise.type}
                </p>
              </div>
              <button
                onClick={() => setModalItem(null)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Sets */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Sets</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalSets(Math.max(1, modalSets - 1))}
                    className="w-10 h-10 rounded-lg bg-navy-800 text-gray-400 hover:text-white flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={modalSets}
                    onChange={(e) => setModalSets(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 text-center bg-navy-800 border border-navy-700 rounded-lg text-white"
                  />
                  <button
                    onClick={() => setModalSets(modalSets + 1)}
                    className="w-10 h-10 rounded-lg bg-navy-800 text-gray-400 hover:text-white flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Reps */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Reps</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalReps(Math.max(1, modalReps - 1))}
                    className="w-10 h-10 rounded-lg bg-navy-800 text-gray-400 hover:text-white flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={modalReps}
                    onChange={(e) => setModalReps(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 text-center bg-navy-800 border border-navy-700 rounded-lg text-white"
                  />
                  <button
                    onClick={() => setModalReps(modalReps + 1)}
                    className="w-10 h-10 rounded-lg bg-navy-800 text-gray-400 hover:text-white flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Target Weight */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Target Weight (lbs)</label>
                <input
                  type="number"
                  value={modalWeight}
                  onChange={(e) => setModalWeight(e.target.value)}
                  placeholder="Optional"
                  className="w-24 h-10 text-center bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-gray-500"
                />
              </div>

              {/* Rest */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Rest Period</label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 90, 120, 150, 180, 210, 240].map(seconds => (
                    <button
                      key={seconds}
                      onClick={() => setModalRest(seconds)}
                      className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                        modalRest === seconds
                          ? 'bg-cyan-500 text-navy-950'
                          : 'bg-navy-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={deleteModalItem}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-navy-800 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
              <button
                onClick={applyModal}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5"
              >
                <Check className="w-5 h-5" />
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatRest(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}
