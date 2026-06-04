import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { companyService } from '../services/company.service';

type Role = 'employer' | 'employee';

export default function RegisterPage() {
  const { register, isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>('employee');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) return null;

  if (isAuthenticated && user) {
    if (user.role === 'employer') return <Navigate to="/employer/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/catalogue" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      let cId = companyId;

      if (role === 'employer') {
        const company = await companyService.create({ name: companyName });
        cId = company.id;
      }

      await register({
        first_name: firstName,
        name: firstName,
        email,
        password,
        role,
        company_id: cId || undefined,
      });

      // Navigate directly — avoids race condition with React state commit
      if (role === 'employer') {
        navigate('/employer/dashboard', { replace: true });
      } else {
        navigate('/catalogue', { replace: true });
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(axiosErr.response?.data?.error ?? 'Erreur lors de la création du compte.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">PRIM'O</div>
        <h1 className="auth-title">Créer un compte</h1>
        <p className="auth-subtitle">Rejoignez la plateforme</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="role">
              Je suis
            </label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="employee">Employé</option>
              <option value="employer">Employeur</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="firstName">
              Prénom
            </label>
            <input
              id="firstName"
              className="form-input"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jean"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              required
              minLength={8}
            />
          </div>

          {role === 'employer' ? (
            <div className="form-group">
              <label className="form-label" htmlFor="companyName">
                Nom de l'entreprise
              </label>
              <input
                id="companyName"
                className="form-input"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ma Société SAS"
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label" htmlFor="companyId">
                ID de votre entreprise
              </label>
              <input
                id="companyId"
                className="form-input"
                type="text"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                placeholder="Fourni par votre employeur"
              />
            </div>
          )}

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? 'Création…' : 'Créer le compte'}
          </button>
        </form>

        <p className="auth-footer">
          Déjà un compte ?{' '}
          <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
