import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Users, FileText, AlertCircle, Edit3 } from 'lucide-react';
import { useActivityStore } from '@/store/useActivityStore';
import type { Activity } from '@shared/types';
import { toLocalInputValue } from '@/utils/format';

export default function EditActivity() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activities, updateActivity } = useActivityStore();

  const activity = activities.find((a) => a.id === id);

  const [form, setForm] = useState<Omit<Activity, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
    maxParticipants: 10,
    status: 'recruiting',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (activity && !initialized) {
      setForm({
        title: activity.title,
        description: activity.description,
        location: activity.location,
        startTime: toLocalInputValue(activity.startTime),
        endTime: toLocalInputValue(activity.endTime),
        maxParticipants: activity.maxParticipants,
        status: activity.status,
      });
      setInitialized(true);
    }
  }, [activity, initialized]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.location.trim()) {
      setError('请填写活动名称和地点');
      return;
    }
    if (new Date(form.startTime) >= new Date(form.endTime)) {
      setError('结束时间必须晚于开始时间');
      return;
    }
    if (form.maxParticipants < 1) {
      setError('人数上限至少为 1');
      return;
    }
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const data = {
        ...form,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };
      await updateActivity(id, data);
      navigate(`/?highlight=${id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!activity) {
    return (
      <div className="container max-w-3xl py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">活动不存在</h2>
        <p className="text-gray-500 mb-6">您要编辑的活动可能已被删除</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          返回活动列表
        </button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8 md:py-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回活动列表</span>
      </button>

      <div className="card p-6 md:p-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 items-center justify-center mb-4 shadow-lg shadow-teal-500/30">
            <Edit3 className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">编辑志愿活动</h2>
          <p className="text-gray-500">修改活动信息，更新活动状态</p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
            当前已有 <span className="font-semibold">{activity.registrations.length}</span> 人报名，
            人数上限不能低于此数字
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6 animate-slide-up">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">活动名称 *</label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="例如：社区公园环保清洁"
                className="input-field pl-12 text-lg"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">开始时间 *</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) => update('startTime', e.target.value)}
                  className="input-field pl-12"
                />
              </div>
            </div>
            <div>
              <label className="label">结束时间 *</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => update('endTime', e.target.value)}
                  className="input-field pl-12"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">活动地点 *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  placeholder="例如：中央公园东门"
                  className="input-field pl-12"
                />
              </div>
            </div>
            <div>
              <label className="label">人数上限 *</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min={activity.registrations.length}
                  value={form.maxParticipants}
                  onChange={(e) => update('maxParticipants', Number(e.target.value))}
                  className="input-field pl-12"
                />
                {activity.registrations.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1.5">
                    最少 {activity.registrations.length} 人（当前已报名人数）
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="label">活动状态</label>
            <div className="flex gap-3">
              {[
                { value: 'recruiting', label: '招募中', desc: '可以继续报名' },
                { value: 'full', label: '已满员', desc: '停止接受新报名' },
                { value: 'ended', label: '已结束', desc: '活动已完成' },
              ].map((s) => (
                <label
                  key={s.value}
                  className={`flex-1 cursor-pointer flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    form.status === s.value
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s.value}
                    checked={form.status === s.value}
                    onChange={(e) => update('status', e.target.value as Activity['status'])}
                    className="sr-only"
                  />
                  <span className="font-medium">{s.label}</span>
                  <span className="text-xs opacity-70">{s.desc}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label">活动说明</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="详细描述活动内容、注意事项、需要准备的物品等..."
              rows={5}
              className="input-field resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="btn-primary flex-1 text-base py-3.5">
              {loading ? '保存中...' : '保存修改'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary text-base py-3.5"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
