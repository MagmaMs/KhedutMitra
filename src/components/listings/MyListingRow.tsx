import { useState } from 'react';
import { CalendarIcon, CheckIcon, PencilIcon, UndoIcon, XIcon } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';
import { StatusChip } from '../StatusChip';
import { useLanguage } from '../../contexts/LanguageContext';
import { findCrop } from '../../data/crops';
import { formatDate, formatNumber, formatRupees } from '../../utils/format';
import type { Listing } from '../../types';

interface MyListingRowProps {
  listing: Listing;
  onMarkSold: (id: string) => void;
  onWithdraw: (id: string) => void;
  onRelist: (id: string) => void;
  onSavePrice: (id: string, price: number) => void;
}

export function MyListingRow({ listing, onMarkSold, onWithdraw, onRelist, onSavePrice }: MyListingRowProps) {
  const { t, tl } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [draftPrice, setDraftPrice] = useState(String(listing.pricePerKg));
  const [error, setError] = useState<string | null>(null);

  const crop = findCrop(listing.cropId);
  const cropName = crop ? tl(crop.name) : listing.cropId;
  const statusLabel = t(`listing.${listing.status}`);

  function handleSave() {
    const value = Number(draftPrice);
    if (!Number.isFinite(value) || value <= 0) {
      setError(t('validation.price'));
      return;
    }
    setError(null);
    setEditing(false);
    onSavePrice(listing.id, value);
  }

  return (
    <li className="rounded-lg border border-line bg-surface p-4 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold leading-tight tracking-tight text-ink">{cropName}</h3>
          <p className="km-num mt-0.5 text-sm font-semibold text-ink-muted">
            {formatNumber(listing.quantityKg)} {t('common.kg')}
          </p>
        </div>
        <StatusChip status={listing.status} label={statusLabel} />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{t('listing.price')}</dt>
          <dd className="km-num mt-0.5 text-base font-bold text-ink">
            {formatRupees(listing.pricePerKg)}
            <span className="ml-1 text-xs font-medium text-ink-muted">{t('common.perKg')}</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{t('listing.total')}</dt>
          <dd className="km-num mt-0.5 text-base font-bold text-ink">
            {formatRupees(listing.quantityKg * listing.pricePerKg)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{t('listing.created')}</dt>
          <dd className="km-num mt-0.5 flex items-center gap-1 text-sm font-semibold text-ink">
            <CalendarIcon className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
            {formatDate(listing.createdAt)}
          </dd>
        </div>
      </dl>

      {editing ?
      <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-line pt-3">
          <div className="w-40">
            <Input
            label={t('sell.priceLabel')}
            type="number"
            inputMode="decimal"
            min={1}
            value={draftPrice}
            error={error ?? undefined}
            onChange={(event) => setDraftPrice(event.target.value)} />
          
          </div>
          <Button onClick={handleSave}>
            <CheckIcon className="h-4 w-4" aria-hidden="true" />
            {t('action.save')}
          </Button>
          <Button
          variant="secondary"
          onClick={() => {
            setEditing(false);
            setError(null);
            setDraftPrice(String(listing.pricePerKg));
          }}>
          
            <XIcon className="h-4 w-4" aria-hidden="true" />
            {t('action.cancel')}
          </Button>
        </div> :

      <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
          {listing.status === 'active' ?
        <>
              <Button variant="secondary" onClick={() => onMarkSold(listing.id)}>
                <CheckIcon className="h-4 w-4" aria-hidden="true" />
                {t('action.markSold')}
              </Button>
              <Button variant="secondary" onClick={() => setEditing(true)}>
                <PencilIcon className="h-4 w-4" aria-hidden="true" />
                {t('action.editPrice')}
              </Button>
              <Button variant="danger" onClick={() => onWithdraw(listing.id)}>
                {t('action.withdraw')}
              </Button>
            </> :

        <Button variant="secondary" onClick={() => onRelist(listing.id)}>
              <UndoIcon className="h-4 w-4" aria-hidden="true" />
              {t('action.relist')}
            </Button>
        }
        </div>
      }
    </li>);

}