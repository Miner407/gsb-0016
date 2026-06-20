import type { Activity, Registration, ActivityWithRegistrations } from '../../shared/types.js';
import { initialActivities, initialRegistrations } from '../data/mockData.js';

class DataStore {
  private activities: Map<string, Activity> = new Map();
  private registrations: Map<string, Registration> = new Map();

  constructor() {
    initialActivities.forEach((a) => this.activities.set(a.id, a));
    initialRegistrations.forEach((r) => this.registrations.set(r.id, r));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private getRegistrationsByActivityId(activityId: string): Registration[] {
    return Array.from(this.registrations.values()).filter((r) => r.activityId === activityId);
  }

  private withRegistrations(activity: Activity): ActivityWithRegistrations {
    const registrations = this.getRegistrationsByActivityId(activity.id);
    return {
      ...activity,
      registrations,
      remainingSlots: Math.max(0, activity.maxParticipants - registrations.length),
    };
  }

  getAllActivities(): ActivityWithRegistrations[] {
    return Array.from(this.activities.values())
      .map((a) => this.withRegistrations(a))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getActivityById(id: string): ActivityWithRegistrations | null {
    const activity = this.activities.get(id);
    return activity ? this.withRegistrations(activity) : null;
  }

  createActivity(data: Omit<Activity, 'id' | 'createdAt'>): ActivityWithRegistrations {
    const activity: Activity = {
      ...data,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };
    this.activities.set(activity.id, activity);
    return this.withRegistrations(activity);
  }

  updateActivity(id: string, data: Partial<Omit<Activity, 'id' | 'createdAt'>>): { success: boolean; data?: ActivityWithRegistrations; error?: string } {
    const existing = this.activities.get(id);
    if (!existing) return { success: false, error: '活动不存在' };
    const registrations = this.getRegistrationsByActivityId(id);
    if (data.maxParticipants !== undefined && data.maxParticipants < registrations.length) {
      return {
        success: false,
        error: `人数上限不能低于已报名人数（${registrations.length} 人）`,
      };
    }
    const updated: Activity = { ...existing, ...data };
    this.activities.set(id, updated);
    return { success: true, data: this.withRegistrations(updated) };
  }

  deleteActivity(id: string): boolean {
    const existed = this.activities.has(id);
    if (existed) {
      this.activities.delete(id);
      Array.from(this.registrations.values())
        .filter((r) => r.activityId === id)
        .forEach((r) => this.registrations.delete(r.id));
    }
    return existed;
  }

  getRegistrations(activityId: string): Registration[] {
    return this.getRegistrationsByActivityId(activityId).sort(
      (a, b) => new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime(),
    );
  }

  registerForActivity(
    activityId: string,
    userName: string,
    userPhone: string,
  ): { success: boolean; data?: Registration; error?: string } {
    const activity = this.activities.get(activityId);
    if (!activity) {
      return { success: false, error: '活动不存在' };
    }
    if (activity.status === 'ended') {
      return { success: false, error: '活动已结束，无法报名' };
    }
    const registrations = this.getRegistrationsByActivityId(activityId);
    const existing = registrations.find((r) => r.userPhone === userPhone);
    if (existing) {
      return { success: false, error: '您已报名该活动' };
    }
    if (registrations.length >= activity.maxParticipants) {
      return { success: false, error: '活动名额已满' };
    }
    const registration: Registration = {
      id: this.generateId(),
      activityId,
      userName,
      userPhone,
      registeredAt: new Date().toISOString(),
    };
    this.registrations.set(registration.id, registration);
    const updatedRegistrations = this.getRegistrationsByActivityId(activityId);
    if (updatedRegistrations.length >= activity.maxParticipants) {
      this.activities.set(activityId, { ...activity, status: 'full' });
    }
    return { success: true, data: registration };
  }

  cancelRegistration(activityId: string, registrationId: string): { success: boolean; error?: string } {
    const registration = this.registrations.get(registrationId);
    if (!registration || registration.activityId !== activityId) {
      return { success: false, error: '报名记录不存在' };
    }
    this.registrations.delete(registrationId);
    const activity = this.activities.get(activityId);
    if (activity && activity.status === 'full') {
      this.activities.set(activityId, { ...activity, status: 'recruiting' });
    }
    return { success: true };
  }
}

export const dataStore = new DataStore();
