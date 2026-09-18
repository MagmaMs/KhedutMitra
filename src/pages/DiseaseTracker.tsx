import React, { useState } from 'react';
import { Card, Button, Notice, ErrorState } from '../components';
import { useLanguage } from '../hooks/useLanguage';
import { Upload, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function DiseaseTracker() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const { aiApi } = await import('../api/features');
      const response = await aiApi.analyzeDisease(formData);
      setResult(response);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t('diseaseTracker.title') || 'Disease Tracker'}
        </h1>
        <p className="mt-1 text-base text-ink-muted">
          {t('diseaseTracker.subtitle') || 'Upload a photo of your crop to detect diseases'}
        </p>
      </div>

      <Notice tone="info" message="AI disease analysis powered by remote models." />

      {!preview ? (
        <Card className="border-2 border-dashed border-line p-8 text-center hover:border-brand transition-colors">
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
            <Camera className="h-12 w-12 text-ink-muted mb-4" />
            <p className="text-lg font-medium text-ink">Tap to capture or upload</p>
            <p className="text-sm text-ink-muted mt-2">JPEG, PNG, WebP (Max 10MB)</p>
          </label>
        </Card>
      ) : (
        <Card className="p-4 overflow-hidden relative">
          <img src={preview} alt="Crop preview" className="w-full h-64 object-cover rounded-lg mb-4" />
          <div className="flex gap-4">
            <Button className="flex-1" onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </Button>
            <Button variant="secondary" onClick={() => { setPreview(null); setFile(null); setResult(null); setError(null); }}>
              Clear
            </Button>
          </div>
        </Card>
      )}

      {error && <ErrorState title="Analysis Error" body={error} />}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-ink">{result.diagnosis}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.severity === 'High' ? 'bg-danger-soft text-danger' : 'bg-brand-soft text-brand'}`}>
                {result.severity} Severity
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="text-brand h-5 w-5" />
              <span className="text-sm font-medium text-ink">{result.confidence}% Confidence</span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-ink">Explanation</h3>
                <p className="text-ink-muted">{result.explanation}</p>
              </div>
              
              <div>
                <h3 className="font-bold text-ink">Recommendations</h3>
                <ul className="list-disc pl-5 text-ink-muted">
                  {result.recommendations.map((r: string, i: number) => <li key={i}>{r}</li>)}
                </ul>
              </div>

              <Notice tone="info" message={`Prevention: ${result.prevention.join(', ')}`} />
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
