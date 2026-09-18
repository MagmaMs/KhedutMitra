import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, CheckCircle2Icon, SproutIcon, StoreIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { findState, states } from '../data/locations';
import { cn } from '../utils/cn';
import type { Role } from '../types';

interface FormErrors {
  name?: string;
  phone?: string;
  password?: string;
  state?: string;
  district?: string;
}

export function Signup() {
  const { t } = useTranslation();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>('farmer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [stateId, setStateId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const districtOptions = useMemo(() => {
    const region = findState(stateId);
    return (region?.districts ?? []).map((district) => ({ value: district.id, label: district.name }));
  }, [stateId]);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (name.trim().length < 2) next.name = t('validation.name');
    if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, '').slice(-10))) next.phone = t('validation.phone');
    if (password.length < 6) next.password = t('validation.password');
    if (!stateId) next.state = t('validation.state');
    if (!districtId) next.district = t('validation.district');
    return next;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setGeneralError('');
    const error = await signup({ name, phone, password, role, state: stateId, district: districtId });
    setSubmitting(false);

    if (error) {
      setGeneralError(error);
      return;
    }
    navigate(role === 'farmer' ? '/home' : '/marketplace');
  }

  const roleOptions: Array<{ id: Role; icon: typeof SproutIcon; titleKey: string; bodyKey: string }> = [
    { id: 'farmer', icon: SproutIcon, titleKey: 'auth.farmer', bodyKey: 'auth.farmerDesc' },
    { id: 'buyer', icon: StoreIcon, titleKey: 'auth.buyer', bodyKey: 'auth.buyerDesc' }
  ];

  return (
    <div className="mx-auto w-full max-w-xl py-4 sm:py-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t('auth.signupTitle')}</h1>
      <p className="mt-1.5 text-base text-ink-muted">{t('app.tagline')}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">{t('auth.roleQuestion')}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {roleOptions.map((option) => {
              const selected = role === option.id;
              return (
                <label
                  key={option.id}
                  className={cn(
                    'relative flex cursor-pointer flex-col rounded-lg border bg-surface p-4 shadow-card',
                    'transition-[border-color] duration-150 ease-out-soft',
                    selected ? 'border-brand ring-1 ring-brand' : 'border-line hover:border-ink-muted/50'
                  )}>

                  <input
                    type="radio"
                    name="role"
                    value={option.id}
                    checked={selected}
                    onChange={() => setRole(option.id)}
                    className="sr-only" />

                  <span className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft">
                      <option.icon className="h-5 w-5 text-brand-deep" aria-hidden="true" />
                    </span>
                    {selected ?
                    <CheckCircle2Icon className="h-5 w-5 text-brand" aria-hidden="true" /> :
                    null}
                  </span>
                  <span className="mt-3 text-lg font-bold tracking-tight text-ink">{t(option.titleKey)}</span>
                  <span className="mt-1 text-sm text-ink-muted">{t(option.bodyKey)}</span>
                </label>);
            })}
          </div>
        </fieldset>

        <Card className="space-y-4">
          <Input
            label={t('auth.name')}
            autoComplete="name"
            value={name}
            error={errors.name}
            onChange={(event) => setName(event.target.value)} />

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
            autoComplete="new-password"
            value={password}
            error={errors.password}
            onChange={(event) => setPassword(event.target.value)} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label={t('auth.state')}
              placeholder={t('auth.state')}
              value={stateId}
              error={errors.state}
              options={states.map((state) => ({ value: state.id, label: state.name }))}
              onChange={(event) => {
                setStateId(event.target.value);
                setDistrictId('');
              }} />

            <Select
              label={t('auth.district')}
              placeholder={stateId ? t('auth.district') : t('auth.selectStateFirst')}
              value={districtId}
              error={errors.district}
              disabled={!stateId}
              options={districtOptions}
              onChange={(event) => setDistrictId(event.target.value)} />
          </div>
        </Card>

        {generalError ?
        <p className="text-sm font-semibold text-danger" role="alert">{generalError}</p> :
        null}

        {submitted && Object.keys(errors).length > 0 ?
        <p className="flex items-center gap-2 text-sm font-semibold text-danger" role="alert">
            <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
            {t('validation.fixErrors')}
          </p> :
        null}

        <Button type="submit" size="lg" fullWidth disabled={submitting}>
          {submitting ? t('common.loading') : t('action.signup')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="font-bold text-brand-deep underline underline-offset-2">
          {t('action.login')}
        </Link>
      </p>
    </div>);
}