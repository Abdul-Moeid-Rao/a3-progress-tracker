import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Dumbbell, 
  Target, 
  Info,
  Play,
  Plus,
  Check,
  ChevronRight,
  Share2,
  Bookmark,
  Star,
  Calendar
} from 'lucide-react';
import { allExercises } from '../data/exercises';
import { useApp } from '../contexts/useApp';
import { useState } from 'react';

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToPlan } = useApp();
  const [activeTab, setActiveTab] = useState<'instructions' | 'muscles' | 'tips'>('instructions');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);

  const exercise = allExercises.find(e => e.id === id);

  if (!exercise) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-navy-800 rounded-full flex items-center justify-center">
            <Dumbbell className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-space font-bold text-white mb-2">Exercise Not Found</h2>
          <p className="text-gray-400 mb-4">The exercise you're looking for doesn't exist.</p>
          <Link to="/dashboard/exercises" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToPlan = () => {
    addToPlan(exercise, { sets: 3, reps: 10, restSeconds: 60 });
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  const difficultyColor = {
    beginner: 'text-green-400 bg-green-400/10 border-green-400/30',
    intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    advanced: 'text-red-400 bg-red-400/10 border-red-400/30'
  }[exercise.difficulty];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/dashboard" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/dashboard/exercises" className="hover:text-white transition-colors">Exercises</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white">{exercise.name}</span>
      </nav>

      {/* Added Toast */}
      {showAddedToast && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-navy-950 px-4 py-3 rounded-lg shadow-lg animate-slide-in flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span className="font-semibold">Added to workout plan!</span>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Video/Image Placeholder */}
              <div className="sm:w-64 flex-shrink-0">
                <div className="aspect-video bg-gradient-to-br from-navy-800 to-navy-900 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                  <Dumbbell className="w-16 h-16 text-navy-700" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center">
                      <Play className="w-6 h-6 text-navy-950 ml-1" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">Video demonstration</p>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-space font-bold text-white">{exercise.name}</h1>
                    <p className="text-gray-400 mt-1">{exercise.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-navy-800 text-gray-400 hover:text-white'}`}
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 bg-navy-800 text-gray-400 hover:text-white rounded-lg transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className={`px-3 py-1 text-sm font-medium border rounded-full ${difficultyColor}`}>
                    {exercise.difficulty}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 rounded-full capitalize">
                    {exercise.type}
                  </span>
                  {exercise.muscleGroups.slice(0, 2).map(muscle => (
                    <span key={muscle} className="px-3 py-1 text-sm font-medium text-violet-400 bg-violet-400/10 border border-violet-400/30 rounded-full capitalize">
                      {muscle}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-5">
                  <button 
                    onClick={handleAddToPlan}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Plan
                  </button>
                  <Link to="/dashboard/planner" className="btn-secondary flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Go to Planner
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="card">
            {/* Tab Navigation */}
            <div className="flex border-b border-navy-700 mb-4">
              {[
                { id: 'instructions', label: 'Instructions', icon: Info },
                { id: 'muscles', label: 'Muscles Worked', icon: Target },
                { id: 'tips', label: 'Pro Tips', icon: Star },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-cyan-400 border-cyan-500'
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === 'instructions' && (
                <div className="space-y-4">
                  <h3 className="font-space font-semibold text-white">How to perform {exercise.name}</h3>
                  <ol className="space-y-3">
                    {exercise.instructions.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </span>
                        <p className="text-gray-300 pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {activeTab === 'muscles' && (
                <div className="space-y-4">
                  <h3 className="font-space font-semibold text-white">Primary and Secondary Muscles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-navy-800/50 rounded-lg">
                      <h4 className="text-sm font-medium text-cyan-400 mb-2">Primary Muscles</h4>
                      <div className="flex flex-wrap gap-2">
                        {exercise.muscleGroups.slice(0, 2).map(muscle => (
                          <span key={muscle} className="px-2 py-1 bg-navy-700 text-gray-300 text-sm rounded capitalize">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-navy-800/50 rounded-lg">
                      <h4 className="text-sm font-medium text-violet-400 mb-2">Secondary Muscles</h4>
                      <div className="flex flex-wrap gap-2">
                        {exercise.muscleGroups.slice(2).map(muscle => (
                          <span key={muscle} className="px-2 py-1 bg-navy-700 text-gray-300 text-sm rounded capitalize">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tips' && (
                <div className="space-y-4">
                  <h3 className="font-space font-semibold text-white">Pro Tips for {exercise.name}</h3>
                  <div className="space-y-3">
                    {exercise.tips?.map((tip, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-navy-800/50 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                        <p className="text-gray-300">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Related */}
        <div className="space-y-6">
          {/* Equipment Needed */}
          <div className="card">
            <h3 className="font-space font-semibold text-white mb-4">Equipment Needed</h3>
            <div className="space-y-2">
              {exercise.equipment.map(eq => (
                <div key={eq} className="flex items-center gap-3 p-2 bg-navy-800/50 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-gray-300 capitalize">{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="font-space font-semibold text-white mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-navy-800/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-cyan-400">4.8</p>
                <p className="text-xs text-gray-500">Avg Rating</p>
              </div>
              <div className="p-3 bg-navy-800/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-violet-400">12K</p>
                <p className="text-xs text-gray-500">Times Logged</p>
              </div>
              <div className="p-3 bg-navy-800/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-400">{exercise.muscleGroups.length}</p>
                <p className="text-xs text-gray-500">Muscle Groups</p>
              </div>
              <div className="p-3 bg-navy-800/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-400">{exercise.instructions.length}</p>
                <p className="text-xs text-gray-500">Steps</p>
              </div>
            </div>
          </div>

          {/* Related Exercises */}
          <div className="card">
            <h3 className="font-space font-semibold text-white mb-4">Similar Exercises</h3>
            <div className="space-y-2">
              {allExercises
                .filter(e => 
                  e.id !== exercise.id && 
                  e.muscleGroups.some(m => exercise.muscleGroups.includes(m))
                )
                .slice(0, 4)
                .map(related => (
                  <Link 
                    key={related.id} 
                    to={`/dashboard/exercises/${related.id}`}
                    className="flex items-center gap-3 p-2 hover:bg-navy-800/50 rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white group-hover:text-cyan-400 transition-colors truncate">
                        {related.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{related.type} • {related.muscleGroups[0]}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
