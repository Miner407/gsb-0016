import { MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import type { ActivityWithRegistrations } from '@shared/types';
import { formatDate, formatTime, getStatusText, getStatusClass } from '@/utils/format';

interface Props {
  activity: ActivityWithRegistrations;
  onClick: () => void;
  index: number;
}

export default function ActivityCard({ activity, onClick, index }: Props) {
  const percentage = Math.round(
    (activity.registrations.length / activity.maxParticipants) * 100
  );
  const isFull = activity.remainingSlots === 0;

  return (
    <div
      onClick={onClick}
      className="card cursor-pointer group animate-slide-up hover:-translate-y-1"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative h-32 bg-gradient-to-br from-volunteer-400 via-volunteer-500 to-teal-500 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/30 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/20 blur-xl" />
        </div>
        <div className="absolute top-4 right-4">
          <span className={`status-badge ${getStatusClass(activity.status)} backdrop-blur-sm`}>
            {getStatusText(activity.status)}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-display text-xl font-bold text-white leading-tight line-clamp-2 drop-shadow-sm">
            {activity.title}
          </h3>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-volunteer-500" />
            <span>{formatDate(activity.startTime)}</span>
            <span className="text-gray-400">·</span>
            <span>{formatTime(activity.startTime)} - {formatTime(activity.endTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-volunteer-500" />
            <span className="truncate">{activity.location}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-sm">
              <Users className="w-4 h-4 text-teal-500" />
              <span className="text-gray-600">
                <span className="font-semibold text-teal-600">{activity.registrations.length}</span>
                <span className="text-gray-400"> / {activity.maxParticipants} 人</span>
              </span>
            </div>
            <span className={`text-sm font-medium ${isFull ? 'text-orange-500' : 'text-green-600'}`}>
              {isFull ? '已满员' : `剩 ${activity.remainingSlots} 名额`}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                  : 'bg-gradient-to-r from-volunteer-400 to-teal-400'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-gray-100">
          <span className="text-sm text-teal-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            查看详情
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
