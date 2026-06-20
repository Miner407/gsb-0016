import { create } from 'zustand';
import type { ActivityWithRegistrations, Activity, ActivityStatusFilter } from '@shared/types';
import { activityApi } from '@/api/activityApi';

interface ActivityState {
  activities: ActivityWithRegistrations[];
  loading: boolean;
  filter: ActivityStatusFilter;
  error: string | null;
  userPhone: string;
  fetchActivities: () => Promise<void>;
  setFilter: (filter: ActivityStatusFilter) => void;
  setUserPhone: (phone: string) => void;
  createActivity: (data: Omit<Activity, 'id' | 'createdAt'>) => Promise<ActivityWithRegistrations>;
  registerForActivity: (id: string, userName: string, userPhone: string) => Promise<void>;
  cancelRegistration: (activityId: string, registrationId: string) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  loading: false,
  filter: 'all',
  error: null,
  userPhone: localStorage.getItem('userPhone') || '',

  setFilter: (filter) => set({ filter }),

  setUserPhone: (phone) => {
    localStorage.setItem('userPhone', phone);
    set({ userPhone: phone });
  },

  fetchActivities: async () => {
    set({ loading: true, error: null });
    try {
      const activities = await activityApi.getAll();
      set({ activities, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  createActivity: async (data) => {
    const newActivity = await activityApi.create(data);
    set({ activities: [newActivity, ...get().activities] });
    return newActivity;
  },

  registerForActivity: async (id, userName, userPhone) => {
    const result = await activityApi.register(id, userName, userPhone);
    if (result.activity) {
      set({
        activities: get().activities.map((a) =>
          a.id === id ? result.activity : a
        ),
      });
    }
  },

  cancelRegistration: async (activityId, registrationId) => {
    const result = await activityApi.cancelRegistration(activityId, registrationId);
    if (result.activity) {
      set({
        activities: get().activities.map((a) =>
          a.id === activityId ? result.activity : a
        ),
      });
    }
  },
}));
