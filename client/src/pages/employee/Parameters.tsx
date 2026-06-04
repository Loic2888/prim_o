import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user.service';

export default function Parameters() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;
    setMsg('');
    setLoading(true);
    try {
      await userService.update(user.id, {
        current_password: currentPassword,
        password: newPassword,
      });
      setMsg('Mot de passe modifié avec succès.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setMsg(axiosErr.response?.data?.error ?? 'Erreur lors du changement de mot de passe.');
    } finally {
      setLoading(false);
    }
  }

  const isError = msg.startsWith('Erreur') || msg.startsWith('Mot de passe') === false && msg.length > 0;

  return (
    <div>
      <div className="page-header">
        <h1>Paramètres</h1>
        <p>Préférences et sécurité</p>
      </div>

      <div style={{ maxWidth: 480 }}>
        <div className="card">
          <h2 style={{ marginBottom: 20, fontSize: '1rem', fontWeight: 600 }}>
            Changer le mot de passe
          </h2>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label" htmlFor="currentPwd">
                Mot de passe actuel
              </label>
              <input
                id="currentPwd"
                className="form-input"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newPwd">
                Nouveau mot de passe
              </label>
              <input
                id="newPwd"
                className="form-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="8 caractères minimum"
              />
            </div>

            {msg && (
              <p className={isError ? 'form-error' : 'form-success'}>{msg}</p>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Modification…' : 'Modifier le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
