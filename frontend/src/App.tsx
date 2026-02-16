import { useEffect, useMemo, useState } from 'react';
import AuthPanel from './components/AuthPanel';
import FeatureBoard, { Feature } from './components/FeatureBoard';
import { apiFetch } from './api/client';

type Session = {
  token: string;
  user: { id: number; email: string; name: string; role: string };
};

const SESSION_KEY = 'hww.session';

export default function App() {
  const [session, setSession] = useState<Session | null>(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as Session;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  });
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('请先登录/注册后管理功能开关');

  const helloText = useMemo(() => {
    if (!session) return message;
    return `${session.user.name}（${session.user.role}） - ${message}`;
  }, [message, session]);

  const loadFeatures = async (token: string) => {
    setLoading(true);
    try {
      const data = await apiFetch<Feature[]>('/api/features', {}, token);
      setFeatures(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.token) return;

    loadFeatures(session.token).catch((error) => {
      setMessage(error.message);
      if (error.message.includes('token')) {
        localStorage.removeItem(SESSION_KEY);
        setSession(null);
      }
    });
  }, [session?.token]);

  const handleAuth = async (payload: { email: string; name?: string; password: string }, mode: 'login' | 'register') => {
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const result = await apiFetch<Session>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setSession(result);
      localStorage.setItem(SESSION_KEY, JSON.stringify(result));
      setMessage('登录成功，可以开始管理功能开关。');
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const createFeature = async (payload: { title: string; description: string; enabled: boolean }) => {
    if (!session) return;
    try {
      await apiFetch('/api/features', { method: 'POST', body: JSON.stringify(payload) }, session.token);
      await loadFeatures(session.token);
      setMessage('功能创建成功。');
    } catch (error) {
      setMessage((error as Error).message);
      throw error;
    }
  };

  const toggleFeature = async (id: number) => {
    if (!session) return;
    try {
      await apiFetch(`/api/features/${id}/toggle`, { method: 'PATCH' }, session.token);
      await loadFeatures(session.token);
      setMessage('功能状态已更新。');
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <main>
      <header>
        <h1>升级版互联网应用原型（前后端联动版）</h1>
        <p>{helloText}</p>
        {session && (
          <button
            className="link"
            onClick={() => {
              localStorage.removeItem(SESSION_KEY);
              setSession(null);
              setFeatures([]);
              setMessage('你已退出登录。');
            }}
          >
            退出登录
          </button>
        )}
      </header>
      {!session ? (
        <AuthPanel onSubmit={handleAuth} />
      ) : (
        <FeatureBoard features={features} loading={loading} onCreate={createFeature} onToggle={toggleFeature} />
      )}
    </main>
  );
}
