import React, { useState } from 'react';
import { Card, Select, Button, Input } from '../components';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import { Save } from 'lucide-react';
import { crops } from '../data/crops';

const soilTypes = [
  { value: 'alluvial', label: 'Alluvial' },
  { value: 'black-cotton', label: 'Black Cotton' },
  { value: 'red', label: 'Red' },
  { value: 'laterite', label: 'Laterite' },
  { value: 'sandy', label: 'Sandy' },
  { value: 'clayey', label: 'Clayey' },
  { value: 'loamy', label: 'Loamy' },
];

const budgetOptions = [
  { value: 'below-50k', label: 'Below ₹50,000' },
  { value: '50k-1lakh', label: '₹50,000 - ₹1,00,000' },
  { value: '1lakh-3lakh', label: '₹1,00,000 - ₹3,00,000' },
  { value: '3lakh-5lakh', label: '₹3,00,000 - ₹5,00,000' },
  { value: 'above-5lakh', label: 'Above ₹5,00,000' },
];

export function FarmProfile() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    soilType: '',
    currentCrop: '',
    budget: '',
    previousCrop: '',
    irrigation: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    showToast(t('farmProfile.saveSuccess') || 'Farm profile saved successfully!', 'success');
  };

  const cropOptions = crops?.map((c: any) => ({ value: c.id, label: c.name })) || [];

  return (
    <div className="space-y-4 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t('farmProfile.title') || 'Farm Profile'}
        </h1>
        <p className="mt-1 text-base text-ink-muted">
          {t('farmProfile.subtitle') || 'Update your farm details for better recommendations'}
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              {t('farmProfile.soilType') || 'Soil Type'}
            </label>
            <Select
              name="soilType"
              value={formData.soilType}
              onChange={(e: any) => handleSelectChange('soilType', e.target.value)}
              options={soilTypes}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              {t('farmProfile.currentCrop') || 'Current/Main Crop'}
            </label>
            <Select
              name="currentCrop"
              value={formData.currentCrop}
              onChange={(e: any) => handleSelectChange('currentCrop', e.target.value)}
              options={cropOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              {t('farmProfile.budget') || 'Farming Budget'}
            </label>
            <Select
              name="budget"
              value={formData.budget}
              onChange={(e: any) => handleSelectChange('budget', e.target.value)}
              options={budgetOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              {t('farmProfile.previousCrop') || 'Previous Crop (Optional)'}
            </label>
            <Select
              name="previousCrop"
              value={formData.previousCrop}
              onChange={(e: any) => handleSelectChange('previousCrop', e.target.value)}
              options={cropOptions}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="irrigation"
              name="irrigation"
              checked={formData.irrigation}
              onChange={handleChange}
              className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
            />
            <label htmlFor="irrigation" className="ml-2 block text-sm text-ink">
              {t('farmProfile.irrigationAvailable') || 'Irrigation Available'}
            </label>
          </div>

          <Button onClick={handleSave} className="w-full sm:w-auto" icon={<Save size={18} />}>
            {t('farmProfile.save') || 'Save Profile'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
