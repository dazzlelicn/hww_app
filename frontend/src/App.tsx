import { useEffect, useState } from 'react';
import AuthPanel from './components/AuthPanel';
import FeatureBoard, { Feature } from './components/FeatureBoard';
import { apiFetch } from './api/client';

type Session = {
  token: string;
  user: { id: number; email: string; name: string; role: string };
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [message, setMessage] = useState('请先登录/注册后管理功能开关');

  const loadFeatures = async (token: string) => {
    const data = await apiFetch<Feature[]>('/api/features', {}, token);
    setFeatures(data);
  };

  useEffect(() => {
    if (session?.token) {
      loadFeatures(session.token).catch((error) => setMessage(error.message));
    }
  }, [session?.token]);

  const handleAuth = async (payload: { email: string; name?: string; password: string }, mode: 'login' | 'register') => {
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const result = await apiFetch<Session>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setSession(result);
      setMessage(`欢迎回来，${result.user.name}`);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const createFeature = async (payload: { title: string; description: string; enabled: boolean }) => {
    if (!session) return;
    await apiFetch('/api/features', { method: 'POST', body: JSON.stringify(payload) }, session.token);
    await loadFeatures(session.token);
  };

  const toggleFeature = async (id: number) => {
    if (!session) return;
    await apiFetch(`/api/features/${id}/toggle`, { method: 'PATCH' }, session.token);
    await loadFeatures(session.token);
  };

  return (
    <main>
      <header>
        <h1>升级版互联网应用原型（前后端联动版）</h1>
        <p>{message}</p>
      </header>
      {!session ? (
        <AuthPanel onSubmit={handleAuth} />
      ) : (
        <FeatureBoard features={features} onCreate={createFeature} onToggle={toggleFeature} />
      )}
    </main>
  );
}
