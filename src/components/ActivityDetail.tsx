import { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Users,
  Calendar,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Edit3,
} from 'lucide-react';
import type { ActivityWithRegistrations, Registration } from '@shared/types';
import {
  formatDateTime,
  getStatusText,
  getStatusClass,
} from '@/utils/format';
import { useActivityStore } from '@/store/useActivityStore';

interface Props {
  activity: ActivityWithRegistrations;
  onClose: () => void;
}

export default function ActivityDetail({ activity, onClose }: Props) {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState(useActivityStore.getState().userPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const { registerForActivity, cancelRegistration, setUserPhone: storeSetUserPhone } = useActivityStore();

  const myRegistration = activity.registrations.find((r) => r.userPhone === userPhone);
  const isFull = activity.remainingSlots === 0;
  const isEnded = activity.status === 'ended';
  const canRegister = !isFull && !isEnded && !myRegistration;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) {
      setError('请填写姓名和手机号');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      storeSetUserPhone(userPhone);
      await registerForActivity(activity.id, userName.trim(), userPhone.trim());
      setSuccess(true);
      setShowRegisterForm(false);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!myRegistration) return;
    setLoading(true);
    setError(null);
    try {
      await cancelRegistration(activity.id, myRegistration.id);
      setShowCancelConfirm(false);
      setCancelSuccess(true);
      setTimeout(() => setCancelSuccess(false), 2000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const refreshed = useActivityStore((s) => s.activities).find(
    (a) => a.id === activity.id
  ) || activity;

  const isFullNow = refreshed.remainingSlots === 0;
  const myRegistrationNow = refreshed.registrations.find((r) => r.userPhone === userPhone);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl animate-scale-in overflow-hidden flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-volunteer-400 via-volunteer-500 to-teal-500 shrink-0">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-50 h-50 rounded-full bg-white/20 blur-2xl" />
          </div>
          <button
            onClick={() => {
              onClose();
              window.location.href = `/edit/${refreshed.id}`;
            }}
            className="absolute top-4 right-16 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            title="编辑活动"
          >
            <Edit3 className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute top-4 left-4">
            <span className={`status-badge ${getStatusClass(refreshed.status)} backdrop-blur-sm`}>
              {getStatusText(refreshed.status)}
            </span>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-sm">
              {refreshed.title}
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-up">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              <span className="text-green-700 font-medium">报名成功！</span>
            </div>
          )}

          {cancelSuccess && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-slide-up">
              <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
              <span className="text-blue-700 font-medium">已取消报名，名额已释放</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-up">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-volunteer-100 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-volunteer-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">开始时间</p>
                <p className="font-medium text-gray-800">{formatDateTime(refreshed.startTime)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">结束时间</p>
                <p className="font-medium text-gray-800">{formatDateTime(refreshed.endTime)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">活动地点</p>
                <p className="font-medium text-gray-800">{refreshed.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">报名人数</p>
                <p className="font-medium text-gray-800">
                  {refreshed.registrations.length} / {refreshed.maxParticipants} 人
                  <span className="text-sm ml-2 text-green-600">
                    (剩 {refreshed.remainingSlots} 名额)
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">活动说明</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {refreshed.description || '暂无活动说明'}
            </p>
          </div>

          {!showRegisterForm && !showCancelConfirm ? (
            <div className="flex gap-3 pt-2">
              {myRegistrationNow ? (
                <button onClick={() => setShowCancelConfirm(true)} disabled={loading || isEnded} className="btn-danger flex-1">
                  取消报名
                </button>
              ) : (
                <button
                  onClick={() => setShowRegisterForm(true)}
                  disabled={!canRegister || isFullNow}
                  className="btn-primary flex-1"
                >
                  {isEnded
                    ? '活动已结束'
                    : isFullNow
                    ? '名额已满'
                    : '立即报名'}
                </button>
              )}
              <button onClick={onClose} className="btn-secondary">
                关闭
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-gray-700">填写报名信息</h3>
              <div>
                <label className="label">姓名</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="请输入您的姓名"
                    className="input-field pl-11"
                  />
                </div>
              </div>
              <div>
                <label className="label">手机号</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="请输入手机号（用于识别您的报名）"
                    className="input-field pl-11"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? '提交中...' : '确认报名'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterForm(false);
                    setError(null);
                  }}
                  className="btn-secondary"
                >
                  取消
                </button>
              </div>
            </form>
          )}

          {showCancelConfirm && (
            <div className="space-y-4 pt-2 animate-slide-up">
              <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-800 mb-1">确认取消报名？</h3>
                  <p className="text-sm text-orange-700">取消后您的名额将被释放，如需再次参与需要重新报名。</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCancel} disabled={loading} className="btn-danger flex-1">
                  {loading ? '处理中...' : '确认取消'}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={loading}
                  className="btn-secondary flex-1"
                >
                  我再想想
                </button>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-500" />
              报名名单 ({refreshed.registrations.length} 人)
            </h3>
            {refreshed.registrations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                暂无报名者，快来成为第一个吧！
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {refreshed.registrations.map((reg: Registration, idx: number) => (
                  <div
                    key={reg.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl animate-slide-up"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-volunteer-400 to-teal-400 flex items-center justify-center text-white font-medium text-sm shrink-0">
                      {reg.userName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">
                        {reg.userName}
                        {reg.userPhone === userPhone && (
                          <span className="ml-2 text-xs text-volunteer-600 font-normal">(我)</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{reg.userPhone}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDateTime(reg.registeredAt).split(' ')[1]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
