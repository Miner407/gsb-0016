import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Loader2, AlertCircle, Plus } from 'lucide-react';
import { useActivityStore } from '@/store/useActivityStore';
import ActivityFilter from '@/components/ActivityFilter';
import ActivityCard from '@/components/ActivityCard';
import ActivityDetail from '@/components/ActivityDetail';
import type { ActivityWithRegistrations } from '@shared/types';

export default function Home() {
  const { activities, loading, error, filter, fetchActivities } = useActivityStore();
  const [selected, setSelected] = useState<ActivityWithRegistrations | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    const highlightId = searchParams.get('highlight');
    if (highlightId) {
      const activity = activities.find((a) => a.id === highlightId);
      if (activity) {
        setSelected(activity);
        setSearchParams({});
      }
    }
  }, [activities, searchParams, setSearchParams]);

  const filtered =
    filter === 'all' ? activities : activities.filter((a) => a.status === filter);

  return (
    <div className="container py-8 md:py-12">
      <section className="text-center mb-10 md:mb-14 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 mb-6 text-sm text-teal-700">
          <Sparkles className="w-4 h-4 text-volunteer-500" />
          <span>一起参与，让社区更温暖</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-teal-700 mb-4 leading-tight">
          发现身边的
          <span className="text-volunteer-500 relative inline-block">
            志愿活动
            <Heart className="absolute -top-2 -right-5 w-6 h-6 text-volunteer-400 fill-volunteer-400 animate-pulse" />
          </span>
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          浏览各类志愿活动，选择适合你的参与，用行动传递爱与温暖
        </p>
      </section>

      <div className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <ActivityFilter />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-volunteer-500 animate-spin mb-4" />
          <p className="text-gray-500">加载活动中...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <p className="text-red-500 text-lg font-medium mb-2">加载失败</p>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={fetchActivities} className="btn-primary">
            重新加载
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-gray-700 text-lg font-medium mb-2">
            {filter === 'all' ? '暂无活动数据' : `暂无${filter === 'recruiting' ? '招募中' : filter === 'full' ? '已满员' : '已结束'}的活动`}
          </p>
          <p className="text-gray-500 mb-6">
            {filter === 'all' ? '点击右上角「发布活动」创建第一个志愿活动吧' : '试试切换其他筛选条件看看'}
          </p>
          {filter === 'all' && (
            <button onClick={() => navigate('/create')} className="btn-primary">
              <Plus className="w-4 h-4" />
              发布活动
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((activity, idx) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => setSelected(activity)}
              index={idx}
            />
          ))}
        </div>
      )}

      {selected && (
        <ActivityDetail activity={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
