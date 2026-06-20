import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import CreateActivity from '@/pages/CreateActivity';
import EditActivity from '@/pages/EditActivity';
import Header from '@/components/Header';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateActivity />} />
            <Route path="/edit/:id" element={<EditActivity />} />
          </Routes>
        </main>
        <footer className="py-6 text-center text-sm text-gray-500">
          <p>© 2026 志愿活动报名管理系统 · 用爱传递温暖</p>
        </footer>
      </div>
    </Router>
  );
}
