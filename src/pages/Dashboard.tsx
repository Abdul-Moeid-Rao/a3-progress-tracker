import { useEffect, useState } from 'react';
import { 
  Dumbbell, 
  Flame, 
  TrendingUp, 
  Clock, 
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { useApp } from '../contexts/useApp';

// Sample data for charts
const weeklyVolumeData = [
  { day: 'Mon', volume: 12000 },
  { day: 'Tue', volume: 8500 },
  { day: 'Wed', volume: 0 },
  { day: 'Thu', volume: 15000 },
  { day: 'Fri', volume: 11000 },
  { day: 'Sat', volume: 18000 },
  { day: 'Sun', volume: 5000 },
];

const strengthProgressData = [
  { month: 'Jan', bench: 185, squat: 225, deadlift: 275 },
  { month: 'Feb', bench: 190, squat: 235, deadlift: 285 },
  { month: 'Mar', bench: 195, squat: 245, deadlift: 295 },
  { month: 'Apr', bench: 200, squat: 255, deadlift: 305 },
  { month: 'May', bench: 205, squat: 265, deadlift: 315 },
  { month: 'Jun', bench: 210, squat: 275, deadlift: 325 },
];

const bodyWeightData = [
  { date: 'Jan 1', weight: 185 },
  { date: 'Jan 15', weight: 184.2 },
  { date: 'Feb 1', weight: 183.5 },
  { date: 'Feb 15', weight: 182.8 },
  { date: 'Mar 1', weight: 182 },
  { date: 'Mar 15', weight: 181.5 },
  { date: 'Apr 1', weight: 180.8 },
];

// Quick stats component
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  trend 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
  change?: string; 
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="card-hover p-5">
      <div className="flex items-start justify-between">
        <div className="p-3 bg-cyan-500/10 rounded-xl">
          <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-green-400' : 
            trend === 'down' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-space font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { currentUser } = useApp();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-space font-bold text-white">
            {greeting}, {currentUser?.name?.split(' ')[0] || 'Lifter'}!
          </h1>
          <p className="text-gray-400 mt-1">Ready to crush your goals today?</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card px-4 py-2 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-lg font-bold text-white">12</p>
              <p className="text-xs text-gray-400">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Dumbbell}
          label="Total Workouts"
          value="156"
          change="+8 this month"
          trend="up"
        />
        <StatCard 
          icon={Flame}
          label="Calories Burned"
          value="45.2K"
          change="+12% vs last month"
          trend="up"
        />
        <StatCard 
          icon={TrendingUp}
          label="Strength Score"
          value="847"
          change="+23 points"
          trend="up"
        />
        <StatCard 
          icon={Clock}
          label="Time Trained"
          value="127h"
          change="+14h this month"
          trend="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Volume Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-space font-semibold text-white">Weekly Volume</h3>
                <p className="text-sm text-gray-400">Total weight lifted per day</p>
              </div>
              <select className="input-field text-sm py-1 px-2">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#64748B" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#64748B" 
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0F172A', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#94A3B8' }}
                    formatter={(value) => [`${Number(value).toLocaleString()} lbs`, 'Volume']}
                  />
                  <Bar 
                    dataKey="volume" 
                    fill="#00E5FF" 
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strength Progress Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-space font-semibold text-white">Strength Progress</h3>
                <p className="text-sm text-gray-400">Big 3 lifts over time (lbs)</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Bench
                </span>
                <span className="flex items-center gap-1 text-violet-400">
                  <span className="w-2 h-2 rounded-full bg-violet-400" /> Squat
                </span>
                <span className="flex items-center gap-1 text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-400" /> Deadlift
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={strengthProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0F172A', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="bench" stroke="#00E5FF" strokeWidth={2} dot={{ fill: '#00E5FF' }} />
                  <Line type="monotone" dataKey="squat" stroke="#7C3AED" strokeWidth={2} dot={{ fill: '#7C3AED' }} />
                  <Line type="monotone" dataKey="deadlift" stroke="#22C55E" strokeWidth={2} dot={{ fill: '#22C55E' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="font-space font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full btn-primary flex items-center justify-center gap-2 py-3">
                <Dumbbell className="w-5 h-5" />
                Start Workout
              </button>
              <button className="w-full btn-secondary flex items-center justify-center gap-2 py-3">
                <Calendar className="w-5 h-5" />
                View Schedule
              </button>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="card">
            <h3 className="font-space font-semibold text-white mb-4">This Week</h3>
            <div className="space-y-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const workouts = ['Push Day', 'Pull Day', 'Rest', 'Leg Day', 'Upper Body', 'Rest', 'Rest'];
                const completed = idx < 2;
                const isToday = idx === 2;
                return (
                  <div key={day} className={`flex items-center justify-between p-2 rounded-lg ${isToday ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-navy-800/30'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                        completed ? 'bg-green-500/20 text-green-400' :
                        isToday ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-navy-700 text-gray-400'
                      }`}>
                        {completed ? '✓' : day[0]}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isToday ? 'text-cyan-400' : 'text-white'}`}>{day}</p>
                        <p className="text-xs text-gray-500">{workouts[idx]}</p>
                      </div>
                    </div>
                    {isToday && (
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">Today</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Body Weight Progress */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-space font-semibold text-white">Body Weight</h3>
              <span className="text-sm text-green-400">-4.2 lbs</span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bodyWeightData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#00E5FF" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
