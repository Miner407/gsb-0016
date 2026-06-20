import { Heart, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg border-b border-white/50 shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-volunteer-400 to-volunteer-600 flex items-center justify-center shadow-lg shadow-volunteer-500/30 group-hover:scale-110 transition-transform duration-300">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-teal-700 leading-tight">志愿活动</h1>
            <p className="text-xs text-gray-500">报名管理系统</p>
          </div>
        </Link>

        {location.pathname !== '/create' && (
          <Link to="/create" className="btn-primary py-2.5 px-5 text-sm">
            <Plus className="w-4 h-4" />
            <span>发布活动</span>
          </Link>
        )}
      </div>
    </header>
  );
}
