import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  X,
  Dumbbell,
  Target,
  Zap,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { allExercises } from '../data/exercises';
import type { Exercise, MuscleGroup, ExerciseType, Equipment, Difficulty } from '../types';

const muscleGroups: MuscleGroup[] = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 
  'legs', 'quadriceps', 'hamstrings', 'glutes', 'calves',
  'abs', 'forearms', 'traps', 'lats'
];

const equipmentTypes: Equipment[] = [
  'barbell', 'dumbbell', 'kettlebell', 'cable', 'machine',
  'bodyweight', 'bands', 'foam roller', 'medicine ball',
  'bench', 'rack'
];

const exerciseTypes: ExerciseType[] = ['compound', 'isolation', 'cardio', 'bodyweight'];
const difficultyLevels: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

export default function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ExerciseType[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return allExercises.filter(exercise => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = exercise.name.toLowerCase().includes(query);
        const matchesMuscle = exercise.muscleGroups.some(m => m.toLowerCase().includes(query));
        if (!matchesName && !matchesMuscle) return false;
      }

      // Muscle groups
      if (selectedMuscles.length > 0) {
        const hasMuscle = selectedMuscles.some(m => exercise.muscleGroups.includes(m));
        if (!hasMuscle) return false;
      }

      // Equipment
      if (selectedEquipment.length > 0) {
        const hasEquipment = selectedEquipment.some(e => exercise.equipment.includes(e));
        if (!hasEquipment) return false;
      }

      // Exercise type
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(exercise.type)) return false;
      }

      // Difficulty
      if (selectedDifficulty) {
        if (exercise.difficulty !== selectedDifficulty) return false;
      }

      return true;
    });
  }, [searchQuery, selectedMuscles, selectedEquipment, selectedTypes, selectedDifficulty]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMuscles([]);
    setSelectedEquipment([]);
    setSelectedTypes([]);
    setSelectedDifficulty(null);
  };

  // Toggle filter helpers
  const toggleMuscle = (muscle: MuscleGroup) => {
    setSelectedMuscles(prev => 
      prev.includes(muscle) 
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
  };

  const toggleEquipment = (equipment: Equipment) => {
    setSelectedEquipment(prev => 
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  const toggleType = (type: ExerciseType) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const activeFiltersCount = selectedMuscles.length + selectedEquipment.length + selectedTypes.length + (selectedDifficulty ? 1 : 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-space font-bold text-white">Exercise Library</h1>
          <p className="text-gray-400 mt-1">Browse {allExercises.length}+ exercises with detailed instructions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-primary flex items-center gap-2">
            <Target className="w-4 h-4" />
            Find Exercise
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search exercises by name or muscle group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                : 'bg-navy-800 border-navy-700 text-gray-400 hover:text-white'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-cyan-500 text-navy-950 text-xs font-bold rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* View Mode */}
          <div className="flex items-center bg-navy-800 rounded-lg border border-navy-700 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="card mb-6 animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white">Filter Exercises</h4>
            {activeFiltersCount > 0 && (
              <button 
                onClick={clearFilters}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Muscle Groups */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Muscle Groups</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {muscleGroups.map(muscle => (
                  <label key={muscle} className="flex items-center gap-2 cursor-pointer hover:bg-navy-800/50 p-1 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedMuscles.includes(muscle)}
                      onChange={() => toggleMuscle(muscle)}
                      className="w-4 h-4 rounded border-navy-600 bg-navy-800 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-300 capitalize">{muscle}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Equipment</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {equipmentTypes.map(equipment => (
                  <label key={equipment} className="flex items-center gap-2 cursor-pointer hover:bg-navy-800/50 p-1 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedEquipment.includes(equipment)}
                      onChange={() => toggleEquipment(equipment)}
                      className="w-4 h-4 rounded border-navy-600 bg-navy-800 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-300 capitalize">{equipment}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Exercise Type */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Exercise Type</label>
              <div className="space-y-2">
                {exerciseTypes.map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-navy-800/50 p-1 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="w-4 h-4 rounded border-navy-600 bg-navy-800 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-300 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Difficulty</label>
              <div className="space-y-2">
                {difficultyLevels.map(diff => (
                  <label key={diff} className="flex items-center gap-2 cursor-pointer hover:bg-navy-800/50 p-1 rounded transition-colors">
                    <input
                      type="radio"
                      name="difficulty"
                      checked={selectedDifficulty === diff}
                      onChange={() => setSelectedDifficulty(diff)}
                      className="w-4 h-4 border-navy-600 bg-navy-800 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className={`text-sm capitalize ${
                      diff === 'beginner' ? 'text-green-400' :
                      diff === 'intermediate' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {diff}
                    </span>
                  </label>
                ))}
                {selectedDifficulty && (
                  <button 
                    onClick={() => setSelectedDifficulty(null)}
                    className="text-xs text-gray-500 hover:text-white mt-2"
                  >
                    Clear selection
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400">
          Showing <span className="text-white font-semibold">{filteredExercises.length}</span> exercises
          {(searchQuery || activeFiltersCount > 0) && (
            <span> with applied filters</span>
          )}
        </p>
        {(searchQuery || activeFiltersCount > 0) && (
          <button 
            onClick={clearFilters}
            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Exercise Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredExercises.map(exercise => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredExercises.map(exercise => (
            <ExerciseListItem key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredExercises.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 bg-navy-800 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No exercises found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your filters or search query</p>
          <button onClick={clearFilters} className="btn-primary">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

// Exercise Card Component
function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const difficultyColor = {
    beginner: 'text-green-400 bg-green-400/10',
    intermediate: 'text-yellow-400 bg-yellow-400/10',
    advanced: 'text-red-400 bg-red-400/10'
  }[exercise.difficulty];

  const typeIcon = {
    compound: <BarChart3 className="w-3 h-3" />,
    isolation: <Target className="w-3 h-3" />,
    cardio: <Zap className="w-3 h-3" />,
    bodyweight: <Dumbbell className="w-3 h-3" />
  }[exercise.type];

  return (
    <Link to={`/dashboard/exercises/${exercise.id}`} className="group">
      <div className="card-hover h-full flex flex-col">
        {/* Image Placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-navy-800 to-navy-900 rounded-lg mb-3 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Dumbbell className="w-12 h-12 text-navy-700" />
          </div>
          <div className="absolute top-2 right-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColor}`}>
              {exercise.difficulty}
            </span>
          </div>
          <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-space font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {exercise.name}
          </h3>
          
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              {typeIcon}
              <span className="capitalize">{exercise.type}</span>
            </span>
            <span>•</span>
            <span className="capitalize">{exercise.muscleGroups[0]}</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {exercise.equipment.slice(0, 2).map(eq => (
              <span key={eq} className="text-xs px-2 py-0.5 bg-navy-800 text-gray-400 rounded">
                {eq}
              </span>
            ))}
            {exercise.equipment.length > 2 && (
              <span className="text-xs px-2 py-0.5 bg-navy-800 text-gray-400 rounded">
                +{exercise.equipment.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Exercise List Item Component
function ExerciseListItem({ exercise }: { exercise: Exercise }) {
  const difficultyColor = {
    beginner: 'text-green-400 border-green-400/30',
    intermediate: 'text-yellow-400 border-yellow-400/30',
    advanced: 'text-red-400 border-red-400/30'
  }[exercise.difficulty];

  return (
    <Link to={`/dashboard/exercises/${exercise.id}`} className="group">
      <div className="card-hover flex items-center gap-4 p-3">
        {/* Icon */}
        <div className="w-14 h-14 bg-gradient-to-br from-navy-800 to-navy-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <Dumbbell className="w-7 h-7 text-navy-600" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-space font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
            {exercise.name}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
            <span className="capitalize">{exercise.type}</span>
            <span>•</span>
            <span className="capitalize">{exercise.muscleGroups.join(', ')}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="hidden sm:flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium border rounded ${difficultyColor}`}>
            {exercise.difficulty}
          </span>
          {exercise.equipment.slice(0, 1).map(eq => (
            <span key={eq} className="px-2 py-1 text-xs bg-navy-800 text-gray-400 rounded">
              {eq}
            </span>
          ))}
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors" />
      </div>
    </Link>
  );
}
