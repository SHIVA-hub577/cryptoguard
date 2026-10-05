import { useEffect, useState } from 'react';
import { roadmapData, WeekRoadmap } from '../data/learnRoadmapData';

const STORAGE_KEY = 'cryptoguard_learn_progress_v2';

export interface LearnProgressState {
  completedTopics: string[];
  completedVideos: string[];
  completedArticles: string[];
  lastVisitedWeek: number;
}

const DEFAULT_STATE: LearnProgressState = {
  completedTopics: [],
  completedVideos: [],
  completedArticles: [],
  lastVisitedWeek: 1,
};

export function getStoredProgress(): LearnProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      completedTopics: Array.isArray(parsed.completedTopics) ? parsed.completedTopics : [],
      completedVideos: Array.isArray(parsed.completedVideos) ? parsed.completedVideos : [],
      completedArticles: Array.isArray(parsed.completedArticles) ? parsed.completedArticles : [],
      lastVisitedWeek: typeof parsed.lastVisitedWeek === 'number' ? parsed.lastVisitedWeek : 1,
    };
  } catch (e) {
    console.error('Failed to load learn progress from localStorage', e);
    return DEFAULT_STATE;
  }
}

export function saveStoredProgress(state: LearnProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('cryptoguard_learn_progress_updated'));
  } catch (e) {
    console.error('Failed to save learn progress to localStorage', e);
  }
}

export function calculateProgressStats(progress: LearnProgressState) {
  let totalTopics = 0;
  let completedTopicsCount = 0;

  roadmapData.forEach((w) => {
    w.topics.forEach((t) => {
      totalTopics += 1;
      if (progress.completedTopics.includes(t.id)) {
        completedTopicsCount += 1;
      }
    });
  });

  const overallPercent = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;

  const weekStats = roadmapData.map((week) => {
    const weekTotal = week.topics.length;
    const weekDone = week.topics.filter((t) => progress.completedTopics.includes(t.id)).length;
    const weekPercent = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;
    return {
      weekNumber: week.weekNumber,
      total: weekTotal,
      completed: weekDone,
      percent: weekPercent,
      isCompleted: weekDone === weekTotal && weekTotal > 0,
    };
  });

  return {
    totalTopics,
    completedTopicsCount,
    overallPercent,
    weekStats,
  };
}

export function useLearnProgress() {
  const [progress, setProgress] = useState<LearnProgressState>(getStoredProgress);

  useEffect(() => {
    const handleUpdate = () => {
      setProgress(getStoredProgress());
    };
    window.addEventListener('cryptoguard_learn_progress_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cryptoguard_learn_progress_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const toggleTopic = (topicId: string) => {
    const current = getStoredProgress();
    const exists = current.completedTopics.includes(topicId);
    const updated: LearnProgressState = {
      ...current,
      completedTopics: exists
        ? current.completedTopics.filter((id) => id !== topicId)
        : [...current.completedTopics, topicId],
    };
    saveStoredProgress(updated);
    setProgress(updated);
  };

  const toggleVideo = (videoId: string) => {
    const current = getStoredProgress();
    const exists = current.completedVideos.includes(videoId);
    const updated: LearnProgressState = {
      ...current,
      completedVideos: exists
        ? current.completedVideos.filter((id) => id !== videoId)
        : [...current.completedVideos, videoId],
    };
    saveStoredProgress(updated);
    setProgress(updated);
  };

  const toggleArticle = (articleId: string) => {
    const current = getStoredProgress();
    const exists = current.completedArticles.includes(articleId);
    const updated: LearnProgressState = {
      ...current,
      completedArticles: exists
        ? current.completedArticles.filter((id) => id !== articleId)
        : [...current.completedArticles, articleId],
    };
    saveStoredProgress(updated);
    setProgress(updated);
  };

  const markWeekComplete = (weekNumber: number) => {
    const current = getStoredProgress();
    const week = roadmapData.find((w) => w.weekNumber === weekNumber);
    if (!week) return;

    const topicIds = week.topics.map((t) => t.id);
    const videoIds = week.videos.map((v) => v.id);
    const articleIds = week.articles.map((a) => a.id);

    const mergedTopics = Array.from(new Set([...current.completedTopics, ...topicIds]));
    const mergedVideos = Array.from(new Set([...current.completedVideos, ...videoIds]));
    const mergedArticles = Array.from(new Set([...current.completedArticles, ...articleIds]));

    const updated: LearnProgressState = {
      ...current,
      completedTopics: mergedTopics,
      completedVideos: mergedVideos,
      completedArticles: mergedArticles,
    };
    saveStoredProgress(updated);
    setProgress(updated);
  };

  const setLastVisitedWeek = (weekNumber: number) => {
    const current = getStoredProgress();
    const updated: LearnProgressState = {
      ...current,
      lastVisitedWeek: weekNumber,
    };
    saveStoredProgress(updated);
    setProgress(updated);
  };

  const resetProgress = () => {
    const reset = { ...DEFAULT_STATE };
    saveStoredProgress(reset);
    setProgress(reset);
  };

  const stats = calculateProgressStats(progress);

  return {
    progress,
    stats,
    toggleTopic,
    toggleVideo,
    toggleArticle,
    markWeekComplete,
    setLastVisitedWeek,
    resetProgress,
  };
}
