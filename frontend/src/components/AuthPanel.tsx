import { useState } from 'react';

type Props = {
  onSubmit: (payload: { email: string; name?: string; password: string }, mode: 'login' | 'register') => Promise<void>;
};

export default function AuthPanel({ onSubmit }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await onSubmit({ email: email.trim(), name: name.trim(), password }, mode);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <h2>{mode === 'login' ? '登录' : '注册'}账号</h2>
      {mode === 'register' && (
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="昵称" />
      )}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="邮箱" />
      <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="密码" />
      <button disabled={submitting} onClick={submit}>{submitting ? '提交中...' : '提交'}</button>
      <button className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        切换到{mode === 'login' ? '注册' : '登录'}
      </button>
    </section>
  );
}
