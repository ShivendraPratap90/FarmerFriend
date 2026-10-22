import React, { useState, useEffect } from 'react';
import {
  CalendarDays, Plus, CheckCircle2, Circle, Clock, Filter,
  Trash2, AlertTriangle, Sprout, Droplets, FlaskConical,
  Bug, Scissors, ChevronRight, Sparkles, Check, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { taskService } from '../services/mockServices';
import { DEMO_TASKS } from '../data/demoData';
import { Modal } from '../components/common/Modal';

const SEASONS_DATA = [
  {
    name: 'Rabi Season (Winter)',
    months: 'October – March',
    status: 'Active Season',
    statusColor: 'badge-green',
    description: 'Sown in winter after monsoon rains, harvested in spring. Crucial period for wheat, mustard, and pulses.',
    majorCrops: ['Wheat', 'Mustard', 'Barley', 'Gram (Chickpea)', 'Potato', 'Peas'],
    keyActivities: [
      'Field preparation and deep plowing in October',
      'Seed treatment with fungicide before sowing',
      'Timely first irrigation (CRI stage for wheat at 20-25 days)',
      'Weed management at 30-35 days',
      'Aphid monitoring in mustard during flowering'
    ],
  },
  {
    name: 'Kharif Season (Monsoon)',
    months: 'June – October',
    status: 'Upcoming Planning',
    statusColor: 'badge-blue',
    description: 'Sown at the onset of South-West monsoon, harvested in autumn. Heavily dependent on rainfall timing.',
    majorCrops: ['Paddy (Rice)', 'Maize', 'Cotton', 'Soybean', 'Groundnut', 'Bajra', 'Jowar'],
    keyActivities: [
      'Nursery preparation for paddy in May-June',
      'Transplanting 20-25 day old seedlings',
      'Maintaining water level in paddy fields',
      'Stem borer and leaf folder pest vigilance',
      'Drainage management during excess rainfall'
    ],
  },
  {
    name: 'Zaid Season (Summer)',
    months: 'March – June',
    status: 'Inter-crop Season',
    statusColor: 'badge-yellow',
    description: 'Short summer season between Rabi and Kharif. Grown under assured irrigation for quick-turnaround crops.',
    majorCrops: ['Watermelon', 'Muskmelon', 'Cucumber', 'Bitter Gourd', 'Fodder Crops', 'Moong Dal'],
    keyActivities: [
      'Pre-sowing irrigation and mulching',
      'Frequent light irrigation to prevent heat stress',
      'Quick vegetative crop management',
      'Harvesting before early monsoon arrivals'
    ],
  },
];

const CATEGORY_ICONS = {
  irrigation: { icon: Droplets, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30' },
  fertilization: { icon: FlaskConical, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
  'pest-control': { icon: Bug, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/30' },
  weeding: { icon: Scissors, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30' },
  'soil-testing': { icon: Sprout, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30' },
  general: { icon: CalendarDays, color: 'text-gray-500 bg-gray-50 dark:bg-gray-800' },
};

const PRIORITY_BADGES = {
  high: 'badge-red',
  medium: 'badge-yellow',
  low: 'badge-green',
};

export const FarmCalendarPage = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'seasons'
  const [activeSeasonIdx, setActiveSeasonIdx] = useState(0);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'completed'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load tasks
  const [tasks, setTasks] = useState(() => {
    const saved = taskService.getTasks();
    if (saved && saved.length > 0) return saved;
    return DEMO_TASKS;
  });

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    crop: 'Wheat',
    date: new Date().toISOString().split('T')[0],
    category: 'irrigation',
    priority: 'medium',
  });

  // Save tasks on change
  useEffect(() => {
    taskService.saveTasks(tasks);
  }, [tasks]);

  const handleToggleTask = (id) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const updated = !t.completed;
          showToast(updated ? 'Task marked as completed!' : 'Task moved back to pending', 'info');
          return { ...t, completed: updated };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task removed from calendar', 'info');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      showToast('Please enter a task title', 'error');
      return;
    }

    const created = {
      id: 'task-' + Date.now(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewTask({
      title: '',
      description: '',
      crop: 'Wheat',
      date: new Date().toISOString().split('T')[0],
      category: 'irrigation',
      priority: 'medium',
    });
    showToast('New task added successfully', 'success');
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'pending' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  // Calculate task statistics
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const highPriorityPending = tasks.filter(t => !t.completed && t.priority === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-400">
              <CalendarDays size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Farm Calendar & Tasks
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Schedule seasonal field activities, set irrigation alarms, and track crop milestones
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Main View Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 flex">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'tasks'
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Task Manager
            </button>
            <button
              onClick={() => setActiveTab('seasons')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'seasons'
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Indian Crop Seasons
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary text-sm whitespace-nowrap"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Activities</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{totalCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Recorded for 2025-26</p>
        </div>
        <div className="card p-4 border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Pending Actions</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Needs farmer attention</p>
        </div>
        <div className="card p-4 border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">High Priority</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{highPriorityPending}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Critical stage alerts</p>
        </div>
        <div className="card p-4 border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completedCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{totalCount ? Math.round((completedCount/totalCount)*100) : 0}% done</p>
        </div>
      </div>

      {/* TAB CONTENT: Task Manager */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="card p-4 border border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                <Filter size={14} /> Filter:
              </span>
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-medium">
                {['all', 'pending', 'completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                      filterStatus === status
                        ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow-sm font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="input py-1 px-3 text-xs rounded-xl w-auto"
              >
                <option value="all">All Categories</option>
                <option value="irrigation">Irrigation</option>
                <option value="fertilization">Fertilization</option>
                <option value="pest-control">Pest Control</option>
                <option value="weeding">Weeding</option>
                <option value="soil-testing">Soil Testing</option>
              </select>
            </div>

            <span className="text-xs text-gray-400">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </span>
          </div>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <div className="card p-12 text-center border border-gray-100 dark:border-gray-800">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">No tasks found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                No farming activities match your current filter. You can add a new field task anytime.
              </p>
              <button
                onClick={() => { setFilterCategory('all'); setFilterStatus('all'); }}
                className="mt-4 btn-secondary text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map(task => {
                const catInfo = CATEGORY_ICONS[task.category] || CATEGORY_ICONS.general;
                const CatIcon = catInfo.icon;
                const isOverdue = !task.completed && new Date(task.date) < new Date(new Date().setHours(0,0,0,0));

                return (
                  <div
                    key={task.id}
                    className={`card p-4 transition-all border ${
                      task.completed
                        ? 'opacity-60 bg-gray-50/70 dark:bg-gray-900/40 border-gray-200/60 dark:border-gray-800'
                        : isOverdue
                        ? 'border-red-200 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/10'
                        : 'border-gray-200/80 dark:border-gray-800 hover:shadow-card-hover'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="mt-0.5 text-gray-400 hover:text-primary-600 transition-colors flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 size={22} className="text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                        ) : (
                          <Circle size={22} />
                        )}
                      </button>

                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${catInfo.color}`}>
                        <CatIcon size={18} />
                      </div>

                      {/* Task info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className={`font-semibold text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {task.title}
                          </h4>
                          <span className={PRIORITY_BADGES[task.priority] || 'badge-green'}>
                            {task.priority}
                          </span>
                          <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                            {task.crop}
                          </span>
                          {isOverdue && (
                            <span className="badge bg-red-100 text-red-700 flex items-center gap-1">
                              <AlertTriangle size={10} /> Overdue
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> Target: {task.date}
                          </span>
                          <span className="capitalize">{task.category.replace('-', ' ')}</span>
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Indian Crop Seasons Guide */}
      {activeTab === 'seasons' && (
        <div className="space-y-6">
          {/* Season Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SEASONS_DATA.map((season, idx) => (
              <div
                key={season.name}
                onClick={() => setActiveSeasonIdx(idx)}
                className={`card p-5 cursor-pointer transition-all border ${
                  activeSeasonIdx === idx
                    ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-900 bg-primary-50/20 dark:bg-primary-950/20'
                    : 'border-gray-200/80 dark:border-gray-800 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={season.statusColor}>{season.status}</span>
                  <span className="text-xs font-semibold text-gray-400">{season.months}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{season.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{season.description}</p>
              </div>
            ))}
          </div>

          {/* Detailed Season Breakdown */}
          {SEASONS_DATA[activeSeasonIdx] && (
            <div className="card p-6 border border-gray-200/80 dark:border-gray-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {SEASONS_DATA[activeSeasonIdx].name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Calendar Span: {SEASONS_DATA[activeSeasonIdx].months}
                  </p>
                </div>
                <span className={SEASONS_DATA[activeSeasonIdx].statusColor}>
                  {SEASONS_DATA[activeSeasonIdx].status}
                </span>
              </div>

              {/* Major Crops */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                  <Sprout size={16} className="text-primary-600" />
                  Suitable Crops For This Window:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {SEASONS_DATA[activeSeasonIdx].majorCrops.map(crop => (
                    <span
                      key={crop}
                      className="px-3 py-1 rounded-xl text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step by Step Activities */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-primary-600" />
                  Recommended Operational Checklist:
                </h4>
                <div className="space-y-2.5">
                  {SEASONS_DATA[activeSeasonIdx].keyActivities.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800"
                    >
                      <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{act}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Farm Task"
        size="md"
        footer={
          <>
            <button onClick={() => setIsAddModalOpen(false)} className="btn-secondary text-sm">
              Cancel
            </button>
            <button onClick={handleAddTask} className="btn-primary text-sm">
              Save to Calendar
            </button>
          </>
        }
      >
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="label">Task Title *</label>
            <input
              type="text"
              required
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="e.g. First irrigation for wheat crop"
              className="input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Crop / Plot</label>
              <select
                value={newTask.crop}
                onChange={e => setNewTask({ ...newTask, crop: e.target.value })}
                className="input"
              >
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice (Paddy)</option>
                <option value="Mustard">Mustard</option>
                <option value="Potato">Potato</option>
                <option value="Maize">Maize</option>
                <option value="Gram">Gram</option>
                <option value="General">General / Whole Farm</option>
              </select>
            </div>

            <div>
              <label className="label">Due Date *</label>
              <input
                type="date"
                required
                value={newTask.date}
                onChange={e => setNewTask({ ...newTask, date: e.target.value })}
                className="input"
              >
              </input>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select
                value={newTask.category}
                onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                className="input"
              >
                <option value="irrigation">Irrigation</option>
                <option value="fertilization">Fertilization / Manure</option>
                <option value="pest-control">Pest & Disease Control</option>
                <option value="weeding">Weeding & Hoeing</option>
                <option value="soil-testing">Soil Testing</option>
                <option value="harvesting">Harvesting</option>
              </select>
            </div>

            <div>
              <label className="label">Priority</label>
              <select
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                className="input"
              >
                <option value="high">High (Immediate)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="low">Low (Flexible)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Description & Field Notes</label>
            <textarea
              rows={3}
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="e.g. Apply 45kg Urea per acre after first weeding cycle"
              className="input resize-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FarmCalendarPage;
