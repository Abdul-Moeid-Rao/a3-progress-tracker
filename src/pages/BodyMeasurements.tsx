import { useMemo, useState } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  Plus
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { BodyMeasurement } from '../types';
import { useApp } from '../contexts/useApp';

interface Measurement {
  id: string;
  date: Date;
  weight: number;
  bodyFat: number;
  chest: number;
  waist: number;
  hips: number;
  arms: number;
  thighs: number;
  shoulders: number;
}

function toDisplay(m: BodyMeasurement): Measurement {
  return {
    id: m.id,
    date: m.date,
    weight: m.weight ?? 0,
    bodyFat: m.bodyFatPercentage ?? 0,
    chest: m.chest ?? 0,
    waist: m.waist ?? 0,
    hips: m.hips ?? 0,
    arms: m.arms?.right ?? m.arms?.left ?? 0,
    thighs: m.thighs?.right ?? m.thighs?.left ?? 0,
    shoulders: m.shoulders ?? 0,
  };
}

const metricConfig = {
  weight: { label: 'Body Weight', unit: 'lbs', color: '#00E5FF' },
  bodyFat: { label: 'Body Fat %', unit: '%', color: '#7C3AED' },
  waist: { label: 'Waist', unit: 'in', color: '#22C55E' },
  chest: { label: 'Chest', unit: 'in', color: '#F59E0B' },
};

const emptyForm = {
  weight: '',
  bodyFat: '',
  chest: '',
  waist: '',
  arms: '',
  thighs: '',
};

type FormKey = keyof typeof emptyForm;

export default function BodyMeasurements() {
  const { measurements: contextMeasurements, addMeasurement, currentUser } = useApp();
  const [selectedMetric, setSelectedMetric] = useState<keyof typeof metricConfig>('weight');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const sorted = useMemo(
    () => contextMeasurements.map(toDisplay).sort((a, b) => a.date.getTime() - b.date.getTime()),
    [contextMeasurements]
  );
  const latestMeasurement = sorted[sorted.length - 1];
  const previousMeasurement = sorted[sorted.length - 2];

  const getChange = (current: number, previous: number | undefined, metric: string) => {
    if (previous === undefined) return { change: 0, isGood: true };
    const change = current - previous;
    const isGood = (metric === 'weight' || metric === 'bodyFat' || metric === 'waist') ? change < 0 : change > 0;
    return { change, isGood };
  };

  const setField = (key: FormKey, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const numeric = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? undefined : Number(v)])
    ) as Record<FormKey, number | undefined>;

    const measurement: BodyMeasurement = {
      id: `m-${Date.now()}`,
      userId: currentUser?.id || '',
      date: new Date(),
      weight: numeric.weight,
      bodyFatPercentage: numeric.bodyFat,
      chest: numeric.chest,
      waist: numeric.waist,
      hips: numeric.waist,
      arms: numeric.arms !== undefined ? { right: numeric.arms } : undefined,
      thighs: numeric.thighs !== undefined ? { right: numeric.thighs } : undefined,
      shoulders: numeric.thighs,
    };

    addMeasurement(measurement);
    setForm({ ...emptyForm });
    setShowAddModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-space font-bold text-white">Body Measurements</h1>
          <p className="text-gray-400 mt-1">Track your body composition and progress</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Measurement
        </button>
      </div>

      {/* Latest Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Weight', value: latestMeasurement.weight, unit: 'lbs', prev: previousMeasurement?.weight, key: 'weight' as const },
          { label: 'Body Fat', value: latestMeasurement.bodyFat, unit: '%', prev: previousMeasurement?.bodyFat, key: 'bodyFat' as const },
          { label: 'Waist', value: latestMeasurement.waist, unit: 'in', prev: previousMeasurement?.waist, key: 'waist' as const },
          { label: 'Chest', value: latestMeasurement.chest, unit: 'in', prev: previousMeasurement?.chest, key: 'chest' as const },
        ].map((stat) => {
          const { change, isGood } = getChange(stat.value, stat.prev, stat.key);
          return (
            <div key={stat.key} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{stat.label}</span>
                <div className={`flex items-center gap-1 text-xs ${isGood ? 'text-green-400' : 'text-red-400'}`}>
                  {isGood ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                  {change === 0 ? '—' : `${Math.abs(change).toFixed(1)} ${stat.unit}`}
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value} <span className="text-sm font-normal text-gray-500">{stat.unit}</span></p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Progress Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-space font-semibold text-white">Measurement Trends</h3>
              <p className="text-sm text-gray-400">Track changes over time</p>
            </div>
            <div className="flex items-center gap-2">
              {Object.entries(metricConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedMetric(key as keyof typeof metricConfig)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedMetric === key
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-navy-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sorted}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metricConfig[selectedMetric].color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={metricConfig[selectedMetric].color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748B" 
                  fontSize={12} 
                  tickLine={false}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${Number(value)} ${metricConfig[selectedMetric].unit}`, metricConfig[selectedMetric].label]}
                  labelFormatter={(label) => new Date(String(label)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                />
                <Area 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke={metricConfig[selectedMetric].color}
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorMetric)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-space font-semibold text-white">Measurement History</h3>
              <p className="text-sm text-gray-400">All recorded measurements</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Weight</th>
                  <th className="pb-3 font-medium">Body Fat</th>
                  <th className="pb-3 font-medium">Waist</th>
                  <th className="pb-3 font-medium">Chest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {[...sorted].reverse().map((measurement, index) => {
                  const next = sorted[sorted.length - index - 2];
                  return (
                    <tr key={measurement.id} className="group">
                      <td className="py-3 text-sm text-white">
                        {measurement.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-white">{measurement.weight}</span>
                        <span className="text-xs text-gray-500 ml-1">lbs</span>
                        {next && (
                          <span className={`ml-2 text-xs ${measurement.weight < next.weight ? 'text-green-400' : 'text-red-400'}`}>
                            {measurement.weight < next.weight ? '↓' : '↑'}
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-white">{measurement.bodyFat}</span>
                        <span className="text-xs text-gray-500 ml-1">%</span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-white">{measurement.waist}</span>
                        <span className="text-xs text-gray-500 ml-1">in</span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-white">{measurement.chest}</span>
                        <span className="text-xs text-gray-500 ml-1">in</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Measurement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-navy-700">
              <h2 className="text-xl font-space font-bold text-white">Add Measurement</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Weight (lbs)</label>
                  <input type="number" value={form.weight} onChange={(e) => setField('weight', e.target.value)} className="input-field w-full" placeholder="180" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Body Fat %</label>
                  <input type="number" value={form.bodyFat} onChange={(e) => setField('bodyFat', e.target.value)} className="input-field w-full" placeholder="15" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Chest (in)</label>
                  <input type="number" value={form.chest} onChange={(e) => setField('chest', e.target.value)} className="input-field w-full" placeholder="42" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Waist (in)</label>
                  <input type="number" value={form.waist} onChange={(e) => setField('waist', e.target.value)} className="input-field w-full" placeholder="32" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Arms (in)</label>
                  <input type="number" value={form.arms} onChange={(e) => setField('arms', e.target.value)} className="input-field w-full" placeholder="15" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Thighs (in)</label>
                  <input type="number" value={form.thighs} onChange={(e) => setField('thighs', e.target.value)} className="input-field w-full" placeholder="24" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-6 border-t border-navy-700">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 btn-primary"
              >
                Save Measurement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
