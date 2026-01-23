import { useEffect, useMemo, useState } from 'react';
import { editableDefaults } from '../content/editableDefaults';

type ContentMap = Record<string, string>;
type UserInfo = { name: string; email: string; role: string };

const TOKEN_STORAGE_KEY = 'dispulse-admin-token';

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

function AdminEditor() {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [user, setUser] = useState<UserInfo | null>(null);
  const [entries, setEntries] = useState<ContentMap>({});
  const [drafts, setDrafts] = useState<ContentMap>({});
  const [filter, setFilter] = useState('');
  const [status, setStatus] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const mergedDrafts = useMemo(() => ({ ...editableDefaults, ...drafts }), [drafts]);

  useEffect(() => {
    document.body.classList.add('admin-mode');
    document.documentElement.classList.add('admin-mode');
    return () => {
      document.body.classList.remove('admin-mode');
      document.documentElement.classList.remove('admin-mode');
    };
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        const incoming = (data?.entries ?? {}) as ContentMap;
        setEntries(incoming);
        setDrafts({ ...editableDefaults, ...incoming });
      } catch {
        // ignore load failures
      }
    };

    loadContent();
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Invalid session');
        }
        const data = await response.json();
        setUser(data?.user ?? null);
      } catch {
        setUser(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
      }
    };

    verifyToken();
  }, [token]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const nextToken = data?.token as string | undefined;
      if (!nextToken) {
        throw new Error('Missing token');
      }

      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
      setToken(nextToken);
      setUser(data?.user ?? null);
      setLoginPassword('');
    } catch (error) {
      setAuthError('Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const handleSeedDefaults = async () => {
    setStatus('Seeding defaults...');
    try {
      await fetch('/api/content/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: editableDefaults }),
      });
      setStatus('Defaults seeded.');
    } catch {
      setStatus('Failed to seed defaults.');
    }
  };

  const handleSaveKey = async (key: string) => {
    if (!token) {
      setStatus('You must be logged in to save.');
      return;
    }

    setStatus(`Saving ${key}...`);
    try {
      const response = await fetch(`/api/content/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: mergedDrafts[key] ?? '' }),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      setEntries((prev) => ({ ...prev, [key]: mergedDrafts[key] ?? '' }));
      setStatus(`Saved ${key}.`);
    } catch {
      setStatus(`Failed to save ${key}.`);
    }
  };

  const handleSaveAll = async () => {
    if (!token) {
      setStatus('You must be logged in to save.');
      return;
    }

    setLoading(true);
    setStatus('Saving changes...');

    const keys = Object.keys(mergedDrafts);
    for (const key of keys) {
      if ((entries[key] ?? editableDefaults[key] ?? '') === (mergedDrafts[key] ?? '')) {
        continue;
      }

      try {
        const response = await fetch(`/api/content/${encodeURIComponent(key)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ value: mergedDrafts[key] ?? '' }),
        });

        if (response.ok) {
          setEntries((prev) => ({ ...prev, [key]: mergedDrafts[key] ?? '' }));
        }
      } catch {
        setStatus(`Failed to save ${key}.`);
        setLoading(false);
        return;
      }
    }

    setStatus('All changes saved.');
    setLoading(false);
  };

  const handleAddField = () => {
    const trimmedKey = newKey.trim();
    if (!trimmedKey) {
      return;
    }

    setDrafts((prev) => ({
      ...prev,
      [trimmedKey]: newValue,
    }));
    setNewKey('');
    setNewValue('');
  };

  const filteredKeys = Object.keys(mergedDrafts)
    .filter((key) => {
      const term = filter.trim().toLowerCase();
      if (!term) {
        return true;
      }
      const value = mergedDrafts[key] ?? '';
      return key.toLowerCase().includes(term) || value.toLowerCase().includes(term);
    })
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Site Editor</h1>
          <p>Manage live text across the website.</p>
        </div>
        <div className="admin-actions">
          {user && (
            <div className="admin-user">
              <span>{user.name}</span>
              <span className="admin-role">{user.role}</span>
            </div>
          )}
          {user ? (
            <button type="button" onClick={handleLogout} className="admin-btn ghost">
              Logout
            </button>
          ) : null}
        </div>
      </header>

      {!user && (
        <div className="admin-panel">
          <h2>Owner Login</h2>
          <form onSubmit={handleLogin} className="admin-form">
            <label>
              Email
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                required
              />
            </label>
            {authError && <div className="admin-alert">{authError}</div>}
            <button type="submit" className="admin-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      )}

      <section className="admin-panel">
        <div className="admin-toolbar">
          <input
            type="text"
            placeholder="Search keys or text..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
          <div className="admin-toolbar-actions">
            <button type="button" onClick={handleSeedDefaults} className="admin-btn ghost">
              Seed Defaults
            </button>
            <button type="button" onClick={handleSaveAll} className="admin-btn" disabled={!user || loading}>
              Save All
            </button>
          </div>
        </div>

        <div className="admin-add">
          <input
            type="text"
            placeholder="New key"
            value={newKey}
            onChange={(event) => setNewKey(event.target.value)}
          />
          <input
            type="text"
            placeholder="New value"
            value={newValue}
            onChange={(event) => setNewValue(event.target.value)}
          />
          <button type="button" onClick={handleAddField} className="admin-btn ghost">
            Add Field
          </button>
        </div>

        {status && <div className="admin-status">{status}</div>}

        <div className="admin-grid">
          {filteredKeys.map((key) => (
            <div key={key} className="admin-card">
              <div className="admin-card-header">
                <span className="admin-key">{key}</span>
                <button
                  type="button"
                  className="admin-btn ghost"
                  onClick={() => handleSaveKey(key)}
                  disabled={!user || loading}
                >
                  Save
                </button>
              </div>
              <textarea
                value={mergedDrafts[key] ?? ''}
                onChange={(event) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [key]: event.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminEditor;
