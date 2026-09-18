import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircleIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { useAuth } from '../contexts/AuthContext';
import { useListings } from '../contexts/ListingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { crops } from '../data/crops';
import { findDistrict, findState } from '../data/locations';
import { formatNumber, formatRupees } from '../utils/format';

interface FormErrors {
  cropId?: string;
  quantity?: string;
  price?: string;
}

export function Sell() {
  const { t, tl } = useLanguage();
  const { user } = useAuth();
  const { addListing } = useListings();
  const navigate = useNavigate();

  const [cropId, setCropId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [publishError, setPublishError] = useState(false);

  const quantityValue = Number(quantity);
  const priceValue = Number(price);
  const total =
  Number.isFinite(quantityValue) && Number.isFinite(priceValue) && quantityValue > 0 && priceValue > 0 ?
  quantityValue * priceValue :
  0;

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!cropId) next.cropId = t('validation.selectCrop');
    if (!Number.isFinite(quantityValue) || quantityValue <= 0) next.quantity = t('validation.quantity');
    if (!Number.isFinite(priceValue) || priceValue <= 0) next.price = t('validation.price');
    return next;
  }

  function handleBlur(field: keyof FormErrors) {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validate());
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    setTouched({ cropId: true, quantity: true, price: true });
    if (Object.keys(next).length > 0) return;

    setPublishError(false);
    setSubmitting(true);

    window.setTimeout(() => {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        setSubmitting(false);
        setPublishError(true);
        return;
      }
      const region = findState(user?.state ?? '');
      const district = findDistrict(user?.state ?? '', user?.district ?? '');
      addListing({
        cropId,
        quantityKg: quantityValue,
        pricePerKg: priceValue,
        farmerName: user?.name ?? 'Farmer',
        farmerPhone: user?.phone ?? '',
        village: district?.name ?? '',
        district: district?.name ?? '',
        state: region?.name ?? ''
      });
      setSubmitting(false);
      navigate('/sell/success');
    }, 600);
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{t('sell.title')}</h1>
        <p className="mt-1 text-base text-ink-muted">{t('sell.subtitle')}</p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <Card className="space-y-4">
          <Select
            label={t('sell.cropLabel')}
            placeholder={t('market.searchCrop')}
            value={cropId}
            error={touched.cropId ? errors.cropId : undefined}
            options={crops.map((crop) => ({ value: crop.id, label: tl(crop.name) }))}
            onChange={(event) => {
              setCropId(event.target.value);
              setErrors((current) => ({ ...current, cropId: undefined }));
            }}
            onBlur={() => handleBlur('cropId')} />
          
          <Input
            label={t('sell.quantityLabel')}
            type="number"
            inputMode="decimal"
            min={1}
            placeholder="0"
            suffix={t('common.kg')}
            value={quantity}
            error={touched.quantity ? errors.quantity : undefined}
            onChange={(event) => setQuantity(event.target.value)}
            onBlur={() => handleBlur('quantity')} />
          
          <Input
            label={t('sell.priceLabel')}
            type="number"
            inputMode="decimal"
            min={1}
            placeholder="0"
            suffix="₹"
            value={price}
            error={touched.price ? errors.price : undefined}
            onChange={(event) => setPrice(event.target.value)}
            onBlur={() => handleBlur('price')} />
          
        </Card>

        <Card className="bg-brand-soft/60">
          <p className="text-sm font-semibold text-ink-muted">{t('sell.estimated')}</p>
          <p className="km-num mt-1 text-3xl font-extrabold leading-none tracking-tight text-brand-deep">
            {total > 0 ? formatRupees(total) : '—'}
          </p>
          <p className="km-num mt-2 text-sm text-ink-muted">
            {total > 0 ?
            `${formatNumber(quantityValue)} ${t('common.kg')} × ${formatRupees(priceValue)}` :
            t('sell.estimatedHelp')}
          </p>
        </Card>

        {publishError ?
        <div className="rounded-lg border border-danger/40 bg-danger-soft p-4" role="alert">
            <p className="flex items-center gap-2 text-sm font-bold text-danger">
              <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
              {t('sell.errorTitle')}
            </p>
            <p className="mt-1 text-sm text-ink">{t('sell.errorBody')}</p>
          </div> :
        null}

        <Button type="submit" size="lg" fullWidth disabled={submitting}>
          {submitting ? t('common.loading') : t('action.publish')}
        </Button>
      </form>
    </div>);

}