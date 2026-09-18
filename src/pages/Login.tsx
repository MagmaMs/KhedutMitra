import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Notice } from '../components/Notice';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

export function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{phone?: string;password?: string;}>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: {phone?: string;password?: string;} = {};
    if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, '').slice(-10))) nextErrors.phone = t('validation.phone');
    if (password.length < 6) nextErrors.password = t('validation.password');
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    login(phone);
    navigate('/home');
  }

  return (
    <div className="mx-auto w-full max-w-md py-4 sm:py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t('auth.loginTitle')}</h1>
      <p className="mt-1.5 text-base text-ink-muted">{t('auth.loginSubtitle')}</p>

      <Card className="mt-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label={t('auth.phone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98250 41233"
            value={phone}
            error={errors.phone}
            onChange={(event) => setPhone(event.target.value)} />
          
          <Input
            label={t('auth.password')}
            type="password"
            autoComplete="current-password"
            value={password}
            error={errors.password}
            onChange={(event) => setPassword(event.target.value)} />
          
          <Button type="submit" size="lg" fullWidth>
            {t('action.login')}
          </Button>
        </form>
      </Card>

      <Notice className="mt-4" message={t('auth.demoNote')} />

      <p className="mt-6 text-center text-sm text-ink-muted">
        {t('auth.noAccount')}{' '}
        <Link to="/signup" className="font-bold text-brand-deep underline underline-offset-2">
          {t('action.signup')}
        </Link>
      </p>
    </div>);

}