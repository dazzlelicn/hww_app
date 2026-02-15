import { useState } from 'react';

export type Feature = {
  id: number;
  title: string;
  description: string;
  enabled: boolean;
};

type Props = {
  features: Feature[];
  loading: boolean;
  onCreate: (payload: { title: string; description: string; enabled: boolean }) => Promise<void>;
  onToggle: (id: number) => Promise<void>;
};

export default function FeatureBoard({ features, loading, onCreate, onToggle }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(false);

  return (
    <section className="panel">
      <h2>功能管理面板</h2>
      <div className="create-row">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="功能名称" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="功能描述" />
        <label>
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> 默认开启
        </label>
        <button
          onClick={async () => {
            await onCreate({ title, description, enabled });
            setTitle('');
            setDescription('');
            setEnabled(false);
          }}
        >
          新建功能
        </button>
      </div>
      {loading && <p>加载中...</p>}
      {!loading && features.length === 0 && <p>暂无功能，先创建一个吧。</p>}
      <ul>
        {features.map((feature) => (
          <li key={feature.id} className="feature-item">
            <div>
              <strong>{feature.title}</strong>
              <p>{feature.description}</p>
            </div>
            <button onClick={() => onToggle(feature.id)}>{feature.enabled ? '已启用' : '已禁用'}</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
