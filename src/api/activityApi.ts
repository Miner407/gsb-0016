import type { Activity, ActivityWithRegistrations, Registration } from '@shared/types';

const BASE = '/api/activities';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || '请求失败');
  }
  return json.data as T;
}

export const activityApi = {
  getAll: () => request<ActivityWithRegistrations[]>(BASE),

  getById: (id: string) => request<ActivityWithRegistrations>(`${BASE}/${id}`),

  create: (data: Omit<Activity, 'id' | 'createdAt'>) =>
    request<ActivityWithRegistrations>(BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Activity>) =>
    request<ActivityWithRegistrations>(`${BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (id: string) => request<null>(`${BASE}/${id}`, { method: 'DELETE' }),

  getRegistrations: (id: string) =>
    request<Registration[]>(`${BASE}/${id}/registrations`),

  register: (id: string, userName: string, userPhone: string) =>
    fetch(`${BASE}/${id}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, userPhone }),
    }).then(async (res) => {
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || '报名失败');
      }
      return json;
    }),

  cancelRegistration: (activityId: string, registrationId: string) =>
    fetch(`${BASE}/${activityId}/register/${registrationId}`, {
      method: 'DELETE',
    }).then(async (res) => {
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || '取消失败');
      }
      return json;
    }),
};
