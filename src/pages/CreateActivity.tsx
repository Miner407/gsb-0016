import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Users, FileText, AlertCircle } from 'lucide-react';
import { useActivityStore } from '@/store/useActivityStore';
import type { Activity } from '@shared/types';
import { toLocalInputValue } from '@/utils/format';

export default function CreateActivity() {
  const navigate = useNavigate();
  const createActivity = useActivityStore((s) => s.createActivity);

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const [form, setForm] = useState<Omit<Activity, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    location: '',
    startTime: toLocalInputValue(oneHourLater.toISOString()),
    endTime: toLocalInputValue(twoHoursLater.toISOString()),
    maxParticipants: 10,
    status: 'recruiting',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    setLoading(true);
    setError(null);
    try {
      const data = {
        ...form,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };
      const created = await createActivity(data);
      navigate(`/?highlight=${created.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-volunteer-400 to-volunteer-600 items-center justify-center mb-4 shadow-lg shadow-volunteer-500/30">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">发布志愿活动</h2>
          <p className="text-gray-500">填写活动信息，号召大家一起参与志愿活动</p>
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
                  min="1"
                  value={form.maxParticipants}
                  onChange={(e) => update('maxParticipants', Number(e.target.value))}
                  className="input-field pl-12"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="label">活动状态</label>
            <div className="flex gap-3">
              {[
                { value: 'recruiting', label: '招募中' },
                { value: 'full', label: '已满员' },
                { value: 'ended', label: '已结束' },
              ].map((s) => (
                <label
                  key={s.value}
                  className={`flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
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
              {loading ? '发布中...' : '发布活动'}
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
