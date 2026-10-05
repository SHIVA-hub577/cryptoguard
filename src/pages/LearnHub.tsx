import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  PlayCircle,
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  Award,
  Sparkles,
  Clock,
  ArrowRight,
  RotateCcw,
  CheckSquare,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Layers,
  TrendingUp,
  ShieldAlert,
  BarChart2,
  Tv,
  Check,
  Flame,
} from 'lucide-react';
import { roadmapData, WeekRoadmap, LearningTopic, LearningVideo, LearningArticle } from '../data/learnRoadmapData';
import { useLearnProgress } from '../utils/learnProgress';

export function LearnHub() {
  const {
    progress,
    stats,
    toggleTopic,
    toggleVideo,
    toggleArticle,
    markWeekComplete,
    setLastVisitedWeek,
    resetProgress,
  } = useLearnProgress();

  const [activeWeekId, setActiveWeekId] = useState<number>(() => {
    return progress.lastVisitedWeek || 1;
  });
  const [activeVideoId, setActiveVideoId] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'incomplete' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'topics' | 'videos' | 'articles'>('all');

  const activeWeek: WeekRoadmap = useMemo(() => {
    return roadmapData.find((w) => w.id === activeWeekId) || roadmapData[0];
  }, [activeWeekId]);

  // Handle active video selection per week
  const currentVideo: LearningVideo = useMemo(() => {
    if (activeVideoId) {
      const found = activeWeek.videos.find((v) => v.id === activeVideoId);
      if (found) return found;
    }
    return activeWeek.videos[0];
  }, [activeWeek, activeVideoId]);

  const handleSelectWeek = (weekId: number) => {
    setActiveWeekId(weekId);
    setLastVisitedWeek(weekId);
    setActiveVideoId(''); // Reset to first video of selected week
  };

  // Filter topics
  const filteredTopics = useMemo(() => {
    return activeWeek.topics.filter((topic) => {
      const isCompleted = progress.completedTopics.includes(topic.id);
      if (filterMode === 'incomplete' && isCompleted) return false;
      if (filterMode === 'completed' && !isCompleted) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          topic.title.toLowerCase().includes(q) ||
          topic.description.toLowerCase().includes(q) ||
          topic.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeWeek, filterMode, searchQuery, progress.completedTopics]);

  // Find next incomplete topic to resume learning
  const nextIncompleteTopic = useMemo(() => {
    for (const week of roadmapData) {
      for (const topic of week.topics) {
        if (!progress.completedTopics.includes(topic.id)) {
          return { week, topic };
        }
      }
    }
    return null;
  }, [progress.completedTopics]);

  const handleResumeNext = () => {
    if (nextIncompleteTopic) {
      handleSelectWeek(nextIncompleteTopic.week.id);
      setExpandedTopicId(nextIncompleteTopic.topic.id);
    }
  };

  const currentWeekStat = stats.weekStats.find((s) => s.weekNumber === activeWeekId) || {
    completed: 0,
    total: activeWeek.topics.length,
    percent: 0,
    isCompleted: false,
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-bg-surface via-bg-elevated to-bg-surface border border-border p-8 lg:p-10 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/15 border border-brand-purple/30 text-brand-glow text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-brand-purple" />
              <span>CryptoGuard Academy • Trading Masterclass</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-white tracking-tight">
              Learn Hub: 5-Week Trading Roadmap
            </h1>
            <p className="text-text-secondary text-sm lg:text-base leading-relaxed">
              From absolute market fundamentals to technical price action, on-chain tokenomics, and institutional risk management. Complete milestones, watch curated video lectures, and build execution discipline.
            </p>
          </div>

          {/* Overall Progress Card */}
          <div className="bg-bg-void/80 backdrop-blur-md border border-border/80 rounded-2xl p-5 lg:min-w-[320px] space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-cyan" />
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Mastery Progress</span>
              </div>
              <span className="font-display font-bold text-xl text-white">{stats.overallPercent}%</span>
            </div>

            {/* Main Progress Bar */}
            <div className="w-full bg-bg-elevated rounded-full h-3 overflow-hidden border border-border/50 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-purple via-brand-glow to-brand-cyan rounded-full transition-all duration-500"
                style={{ width: `${stats.overallPercent}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${stats.overallPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-text-secondary font-mono">
              <span>{stats.completedTopicsCount} of {stats.totalTopics} Topics Completed</span>
              <span className="text-brand-cyan font-bold">
                {stats.overallPercent === 100
                  ? '🏆 Certified Trader!'
                  : stats.overallPercent >= 60
                  ? '⚡ Advanced Trader'
                  : stats.overallPercent >= 20
                  ? '📈 In Training'
                  : '🌱 Beginner'}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-border/40">
              {nextIncompleteTopic ? (
                <button
                  onClick={handleResumeNext}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white text-xs font-semibold transition-all shadow-md hover:shadow-brand-purple/20 cursor-pointer"
                >
                  <span>Resume Next Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex-1 py-2 text-center text-xs font-bold text-success flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> All Topics Completed!
                </div>
              )}
              <button
                onClick={() => setShowResetConfirm(true)}
                title="Reset progress"
                className="p-2 rounded-xl bg-bg-elevated hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-colors border border-border"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Week Selector Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-purple" />
            Curriculum Roadmap
          </h2>
          <span className="text-xs text-text-muted">Click any week to view topics, videos, and articles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {roadmapData.map((week) => {
            const isActive = week.id === activeWeekId;
            const weekStat = stats.weekStats.find((s) => s.weekNumber === week.id);
            const isComplete = weekStat?.isCompleted;

            return (
              <button
                key={week.id}
                onClick={() => handleSelectWeek(week.id)}
                className={`relative text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-bg-elevated border-brand-purple shadow-lg shadow-brand-purple/10 ring-1 ring-brand-purple/50'
                    : 'bg-bg-surface border-border hover:border-brand-purple/40 hover:bg-bg-elevated/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-brand-purple text-white'
                      : 'bg-bg-elevated text-text-secondary'
                  }`}>
                    Week {week.weekNumber}
                  </span>
                  {isComplete ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                      <Check className="w-3 h-3" /> Done
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-text-muted">
                      {weekStat?.completed || 0}/{week.topics.length}
                    </span>
                  )}
                </div>

                <div className="font-display font-semibold text-sm text-white line-clamp-1 mb-1">
                  {week.title}
                </div>
                <div className="text-[11px] text-text-muted line-clamp-1 mb-3">
                  {week.focus}
                </div>

                {/* Week Mini Progress Bar */}
                <div className="w-full bg-bg-void rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isComplete ? 'bg-success' : 'bg-brand-purple'
                    }`}
                    style={{ width: `${weekStat?.percent || 0}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Week Header & Controls */}
      <div className="bg-bg-surface border border-border rounded-3xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-bold uppercase rounded-lg bg-brand-purple/20 text-brand-glow border border-brand-purple/30">
                Week {activeWeek.weekNumber} of 5
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-md ${
                activeWeek.difficulty === 'Beginner'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : activeWeek.difficulty === 'Intermediate'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {activeWeek.difficulty} Level
              </span>
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 7-Day Curriculum
              </span>
            </div>
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-white">
              {activeWeek.title}
            </h2>
            <p className="text-text-secondary text-sm max-w-3xl leading-relaxed">
              {activeWeek.description}
            </p>
          </div>

          {/* Week completion action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={() => markWeekComplete(activeWeek.weekNumber)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                currentWeekStat.isCompleted
                  ? 'bg-success/15 border-success/30 text-success'
                  : 'bg-brand-purple/10 hover:bg-brand-purple/20 border-brand-purple/30 text-brand-glow hover:text-white'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>{currentWeekStat.isCompleted ? 'Week Completed ✓' : 'Mark Week as Completed'}</span>
            </button>
          </div>
        </div>

        {/* Section Tabs (All / Topics / Videos / Articles) + Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-bg-void rounded-xl border border-border self-start">
            {[
              { id: 'all', label: 'All Modules', count: activeWeek.topics.length + activeWeek.videos.length + activeWeek.articles.length },
              { id: 'topics', label: 'Core Topics', count: activeWeek.topics.length },
              { id: 'videos', label: 'Video Lectures', count: activeWeek.videos.length },
              { id: 'articles', label: 'Reading Library', count: activeWeek.articles.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'bg-brand-purple text-white shadow-sm'
                    : 'text-text-secondary hover:text-white hover:bg-bg-elevated'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search & Incomplete Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="w-full bg-bg-void border border-border rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-brand-purple/50"
              />
            </div>

            <div className="flex items-center bg-bg-void rounded-xl border border-border p-1">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                  filterMode === 'all' ? 'bg-bg-elevated text-white font-medium' : 'text-text-muted hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterMode('incomplete')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                  filterMode === 'incomplete' ? 'bg-brand-purple/20 text-brand-glow font-medium' : 'text-text-muted hover:text-white'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterMode('completed')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                  filterMode === 'completed' ? 'bg-success/20 text-success font-medium' : 'text-text-muted hover:text-white'
                }`}
              >
                Done
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* SECTION 1: Embedded YouTube Learning Videos                   */}
        {/* ============================================================= */}
        {(activeSubTab === 'all' || activeSubTab === 'videos') && (
          <div className="space-y-4 pt-4 border-t border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-red-500" />
                <h3 className="font-display font-bold text-lg text-white">
                  Embedded Video Lectures ({activeWeek.videos.length})
                </h3>
              </div>
              <span className="text-xs text-text-muted">Playable directly on this page — no external redirect needed</span>
            </div>

            {/* Video Player & Selection Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-bg-void border border-border rounded-2xl p-4 lg:p-6 shadow-inner">
              {/* Primary Video Player */}
              <div className="lg:col-span-8 space-y-3">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-border/80 shadow-2xl">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?rel=0&modestbranding=1`}
                    title={currentVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div>
                    <h4 className="font-display font-bold text-base text-white">{currentVideo.title}</h4>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Presented by <span className="text-brand-glow font-medium">{currentVideo.channel}</span> • Duration: {currentVideo.duration}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVideo(currentVideo.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                        progress.completedVideos.includes(currentVideo.id)
                          ? 'bg-success/20 text-success border-success/30'
                          : 'bg-bg-elevated hover:bg-bg-elevated/80 text-text-secondary hover:text-white border-border'
                      }`}
                    >
                      {progress.completedVideos.includes(currentVideo.id) ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <span>Watched ✓</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4" />
                          <span>Mark as Watched</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`https://www.youtube.com/watch?v=${currentVideo.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-bg-elevated hover:bg-bg-elevated/80 text-text-muted hover:text-white border border-border transition-colors"
                      title="Open on YouTube"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-text-muted leading-relaxed">
                  {currentVideo.description}
                </p>
              </div>

              {/* Video Playlist Selector */}
              <div className="lg:col-span-4 space-y-3 flex flex-col">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Select Lecture ({activeWeek.videos.length})
                </span>
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {activeWeek.videos.map((vid) => {
                    const isSelected = vid.id === currentVideo.id;
                    const isWatched = progress.completedVideos.includes(vid.id);

                    return (
                      <div
                        key={vid.id}
                        onClick={() => setActiveVideoId(vid.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-brand-purple/15 border-brand-purple ring-1 ring-brand-purple/40'
                            : 'bg-bg-surface border-border hover:border-brand-purple/30 hover:bg-bg-elevated/40'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-bg-elevated flex-shrink-0 border border-border">
                            <img
                              src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                              alt={vid.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <PlayCircle className={`w-5 h-5 ${isSelected ? 'text-brand-cyan' : 'text-white'}`} />
                            </div>
                            <span className="absolute bottom-1 right-1 text-[9px] bg-black/80 text-white font-mono px-1 rounded">
                              {vid.duration}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-white line-clamp-2 leading-tight">
                              {vid.title}
                            </div>
                            <div className="text-[11px] text-text-muted mt-1">{vid.channel}</div>
                            <div className="mt-1 flex items-center gap-1.5">
                              {isWatched ? (
                                <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> Watched
                                </span>
                              ) : (
                                <span className="text-[10px] text-text-muted">Unwatched</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* SECTION 2: Core Trading Topics (Interactive Checklist)        */}
        {/* ============================================================= */}
        {(activeSubTab === 'all' || activeSubTab === 'topics') && (
          <div className="space-y-4 pt-4 border-t border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-brand-cyan" />
                <h3 className="font-display font-bold text-lg text-white">
                  Curriculum Topics & Checkpoints ({filteredTopics.length} shown)
                </h3>
              </div>
              <span className="text-xs text-text-muted">Click checkbox to mark completed • Click topic for key takeaways</span>
            </div>

            <div className="space-y-3">
              {filteredTopics.length === 0 ? (
                <div className="text-center py-8 bg-bg-void rounded-2xl border border-dashed border-border text-text-muted text-xs">
                  No topics match your current filter. Try selecting "All" or clearing the search query.
                </div>
              ) : (
                filteredTopics.map((topic) => {
                  const isCompleted = progress.completedTopics.includes(topic.id);
                  const isExpanded = expandedTopicId === topic.id;

                  return (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isCompleted
                          ? 'bg-bg-surface/50 border-success/30'
                          : 'bg-bg-surface border-border hover:border-brand-purple/40'
                      }`}
                    >
                      {/* Topic Card Bar */}
                      <div className="p-4 lg:p-5 flex items-start gap-4">
                        {/* Interactive Checkbox */}
                        <button
                          onClick={() => toggleTopic(topic.id)}
                          className="mt-0.5 text-text-secondary hover:text-white transition-colors cursor-pointer flex-shrink-0"
                          title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-success fill-success/20" />
                          ) : (
                            <Circle className="w-6 h-6 text-text-muted hover:text-brand-purple" />
                          )}
                        </button>

                        {/* Title & Info */}
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-bg-elevated text-brand-glow border border-border">
                              {topic.category}
                            </span>
                            {isCompleted && (
                              <span className="text-[10px] font-bold text-success bg-success/15 px-2 py-0.5 rounded-full border border-success/30">
                                Completed
                              </span>
                            )}
                          </div>

                          <h4 className={`font-display font-bold text-base text-white ${isCompleted ? 'line-through text-text-muted' : ''}`}>
                            {topic.title}
                          </h4>
                          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                            {topic.description}
                          </p>
                        </div>

                        {/* Expand/Collapse Chevron */}
                        <button
                          onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                          className="p-1.5 text-text-muted hover:text-white rounded-lg hover:bg-bg-elevated transition-colors cursor-pointer"
                        >
                          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Expandable Key Takeaways */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-border/50 bg-bg-void/50 p-4 lg:p-5 space-y-3"
                          >
                            <div className="flex items-center gap-2 text-xs font-bold text-brand-cyan uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5" />
                              Key Tactical Takeaways & Study Guide
                            </div>
                            <ul className="space-y-2">
                              {topic.keyTakeaways.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5 flex-shrink-0" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="pt-2 flex items-center justify-between">
                              <button
                                onClick={() => toggleTopic(topic.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                  isCompleted
                                    ? 'bg-bg-elevated text-text-muted hover:text-white'
                                    : 'bg-brand-purple hover:bg-brand-purple/90 text-white'
                                }`}
                              >
                                {isCompleted ? 'Mark as Incomplete' : 'Mark Topic as Completed ✓'}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* SECTION 3: Curated Articles & Reading Library                */}
        {/* ============================================================= */}
        {(activeSubTab === 'all' || activeSubTab === 'articles') && (
          <div className="space-y-4 pt-4 border-t border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-glow" />
                <h3 className="font-display font-bold text-lg text-white">
                  Curated Articles & Deep Dives ({activeWeek.articles.length})
                </h3>
              </div>
              <span className="text-xs text-text-muted">Click link to read in new tab or check off once read</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeWeek.articles.map((article) => {
                const isRead = progress.completedArticles.includes(article.id);

                return (
                  <div
                    key={article.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                      isRead
                        ? 'bg-bg-surface/50 border-success/30'
                        : 'bg-bg-surface border-border hover:border-brand-purple/40 hover:bg-bg-elevated/30'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-brand-purple/20 text-brand-glow border border-brand-purple/30">
                          {article.source}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-muted flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" /> {article.readTime}
                          </span>
                          <button
                            onClick={() => toggleArticle(article.id)}
                            className="cursor-pointer text-text-secondary hover:text-white"
                            title={isRead ? 'Mark as unread' : 'Mark as read'}
                          >
                            {isRead ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <Circle className="w-4 h-4 text-text-muted" />
                            )}
                          </button>
                        </div>
                      </div>

                      <h4 className="font-display font-bold text-base text-white">
                        {article.title}
                      </h4>

                      <p className="text-xs text-text-secondary leading-relaxed">
                        {article.summary}
                      </p>

                      {/* Key Highlights */}
                      <div className="p-3 rounded-xl bg-bg-void/70 border border-border/60 space-y-1.5">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                          Key Highlights:
                        </span>
                        <ul className="space-y-1">
                          {article.keyPoints.map((pt, i) => (
                            <li key={i} className="text-[11px] text-text-secondary flex items-start gap-1.5 leading-snug">
                              <span className="text-brand-cyan font-bold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-border/50 mt-4">
                      <button
                        onClick={() => toggleArticle(article.id)}
                        className={`text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                          isRead ? 'text-success' : 'text-text-muted hover:text-white'
                        }`}
                      >
                        {isRead ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>{isRead ? 'Read Completed' : 'Mark as Read'}</span>
                      </button>

                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-elevated hover:bg-brand-purple text-xs font-semibold text-white transition-colors border border-border hover:border-brand-purple"
                      >
                        <span>Open Article</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Week Navigation Bottom Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          disabled={activeWeekId <= 1}
          onClick={() => handleSelectWeek(activeWeekId - 1)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-colors cursor-pointer ${
            activeWeekId <= 1
              ? 'opacity-40 cursor-not-allowed bg-bg-surface border-border text-text-muted'
              : 'bg-bg-surface hover:bg-bg-elevated border-border text-white'
          }`}
        >
          ← Previous Week
        </button>

        <span className="text-xs text-text-secondary font-mono">
          Week {activeWeekId} of 5
        </span>

        <button
          disabled={activeWeekId >= 5}
          onClick={() => handleSelectWeek(activeWeekId + 1)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-colors cursor-pointer ${
            activeWeekId >= 5
              ? 'opacity-40 cursor-not-allowed bg-bg-surface border-border text-text-muted'
              : 'bg-brand-purple hover:bg-brand-purple/90 border-brand-purple text-white shadow-md'
          }`}
        >
          <span>Next Week</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Reset Learning Progress?</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              This will uncheck all completed topics, videos, and articles across all 5 weeks. This action cannot be undone.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-bg-elevated hover:bg-bg-elevated/80 text-white text-xs font-semibold border border-border transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
