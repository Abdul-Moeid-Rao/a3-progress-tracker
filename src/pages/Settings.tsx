import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Moon, 
  ChevronRight,
  LogOut,
  Camera,
  Calendar,
  Trophy
} from 'lucide-react';
import { useApp } from '../contexts/useApp';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ElementType;
  items: {
    id: string;
    label: string;
    description?: string;
    type: 'toggle' | 'select' | 'link';
    value?: boolean | string;
    options?: string[];
  }[];
}

export default function Settings() {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useApp();
  const [settings, setSettings] = useState<Record<string, boolean | string>>({
    darkMode: true,
    notifications: true,
    workoutReminders: true,
    restTimerSound: true,
    metricUnits: false,
    language: 'English',
    twoFactor: false,
    profileVisibility: 'Public',
  });

  const handleToggle = (id: string) => {
    setSettings(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelect = (id: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const settingSections: SettingSection[] = [
    {
      id: 'account',
      title: 'Account',
      icon: User,
      items: [
        { id: 'profile', label: 'Edit Profile', type: 'link' },
        { id: 'email', label: 'Email Preferences', type: 'link' },
        { id: 'twoFactor', label: 'Two-Factor Authentication', description: 'Secure your account', type: 'toggle', value: settings.twoFactor as boolean },
        { id: 'profileVisibility', label: 'Profile Visibility', type: 'select', value: settings.profileVisibility as string, options: ['Public', 'Friends Only', 'Private'] },
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        { id: 'notifications', label: 'Push Notifications', description: 'Receive push notifications', type: 'toggle', value: settings.notifications as boolean },
        { id: 'workoutReminders', label: 'Workout Reminders', description: 'Remind me to workout', type: 'toggle', value: settings.workoutReminders as boolean },
        { id: 'restTimerSound', label: 'Rest Timer Sound', description: 'Play sound when rest is over', type: 'toggle', value: settings.restTimerSound as boolean },
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Moon,
      items: [
        { id: 'darkMode', label: 'Dark Mode', description: 'Use dark theme', type: 'toggle', value: settings.darkMode as boolean },
        { id: 'language', label: 'Language', type: 'select', value: settings.language as string, options: ['English', 'Spanish', 'French', 'German'] },
        { id: 'metricUnits', label: 'Use Metric Units', description: 'Display weights in kg', type: 'toggle', value: settings.metricUnits as boolean },
      ]
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-space font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account preferences and settings</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-navy-800 border border-navy-700 rounded-full flex items-center justify-center hover:bg-navy-700 transition-colors">
              <Camera className="w-3 h-3 text-gray-400" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-space font-bold text-white">{currentUser?.name}</h2>
            <p className="text-gray-400">{currentUser?.email}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {currentUser ? new Date(currentUser.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : ''}
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                12 PRs
              </span>
            </div>
          </div>
          <button className="btn-secondary hidden sm:flex items-center gap-2">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {settingSections.map(section => (
          <div key={section.id} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
                <section.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="font-space font-semibold text-white">{section.title}</h3>
            </div>
            <div className="space-y-1">
              {section.items.map(item => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-navy-700/50 last:border-0">
                  <div>
                    <p className="text-sm text-white">{item.label}</p>
                    {item.description && (
                      <p className="text-xs text-gray-500">{item.description}</p>
                    )}
                  </div>
                  {item.type === 'toggle' && (
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        (item.value as boolean) ? 'bg-cyan-500' : 'bg-navy-700'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          (item.value as boolean) ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  )}
                  {item.type === 'select' && (
                    <select
                      value={item.value as string}
                      onChange={(e) => handleSelect(item.id, e.target.value)}
                      className="px-3 py-1.5 bg-navy-800 border border-navy-700 rounded text-sm text-white focus:outline-none focus:border-cyan-500"
                    >
                      {item.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  {item.type === 'link' && (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sign Out */}
      <div className="mt-6">
        <button
          onClick={() => {
            logoutUser();
            navigate('/login');
          }}
          className="w-full card p-4 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
