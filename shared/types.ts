export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  status: 'recruiting' | 'full' | 'ended';
  createdAt: string;
}

export interface Registration {
  id: string;
  activityId: string;
  userName: string;
  userPhone: string;
  registeredAt: string;
}

export interface ActivityWithRegistrations extends Activity {
  registrations: Registration[];
  remainingSlots: number;
}

export type ActivityStatusFilter = 'all' | 'recruiting' | 'full' | 'ended';
