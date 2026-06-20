import { useActivityStore } from '@/store/useActivityStore';
import type { ActivityStatusFilter } from '@shared/types';

const FILTERS: { value: ActivityStatusFilter; label: string }[] = [
  { value: 'all', label: '全部活动' },
  { value: 'recruiting', label: '招募中' },
  { value: 'full', label: '已满员' },
  { value: 'ended', label: '已结束' },
];

export default function ActivityFilter() {
  const { filter, setFilter, activities } = useActivityStore();

  const getCount = (f: ActivityStatusFilter) => {
    if (f === 'all') return activities.length;
    return activities.filter((a) => a.status === f).length;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map((f) => {
        const active = filter === f.value;
        return (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-teal-600 border border-gray-200'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {getCount(f.value)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
