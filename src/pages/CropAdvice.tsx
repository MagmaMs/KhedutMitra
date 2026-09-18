import React, { useState } from 'react';
import { Card, Button, Input, Notice, Skeleton } from '../components';
import { useLanguage } from '../hooks/useLanguage';
import { Leaf, Droplets, Bug, Sprout, HeartPulse, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const topics = [
  { id: 'rotation', icon: Calendar, label: 'Crop Rotation' },
  { id: 'irrigation', icon: Droplets, label: 'Irrigation' },
  { id: 'pest', icon: Bug, label: 'Pest Control' },
  { id: 'fertilizer', icon: Sprout, label: 'Fertilizer' },
  { id: 'care', icon: HeartPulse, label: 'Crop Care' },
  { id: 'seasonal', icon: Leaf, label: 'Seasonal' },
];

export function CropAdvice() {
  const { t } = useLanguage();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAsk = (topic?: string) => {
    setLoading(true);
    setResult(null);
    
    // Demo adapter
    setTimeout(() => {
      setResult({
        recommendation: "Apply Neem oil extract (5%) evenly on the affected leaves.",
        why: "Neem acts as a natural pest repellent without harming beneficial insects.",
        actions: ["Mix 5ml Neem oil with 1L water", "Spray early morning or late evening", "Repeat after 7 days"],
        cautions: ["Do not spray during strong sunlight to avoid leaf burn."],
        sources: ["Indian Agricultural Research Institute (IARI) guidelines"]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t('cropAdvice.title') || 'AI Crop Advice'}
        </h1>
        <p className="mt-1 text-base text-ink-muted">
          {t('cropAdvice.subtitle') || 'Get expert guidance for your farming needs'}
        </p>
      </div>

      <Notice type="warning" message="Demo: AI advisor not connected. Showing sample response." />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {topics.map((topic) => (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={topic.id}>
            <Card 
              className="p-4 text-center cursor-pointer hover:border-brand transition-colors"
              onClick={() => handleAsk(topic.id)}
            >
              <topic.icon className="mx-auto mb-2 text-brand" size={24} />
              <p className="text-sm font-medium text-ink">{topic.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex gap-2">
          <Input 
            className="flex-1"
            placeholder={t('cropAdvice.askPlaceholder') || 'Ask a custom question...'}
            value={question}
            onChange={(e: any) => setQuestion(e.target.value)}
          />
          <Button onClick={() => handleAsk()}>Ask</Button>
        </div>
      </Card>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {result && !loading && (
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-ink">Recommendation</h3>
            <p className="text-ink-muted">{result.recommendation}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Why?</h3>
            <p className="text-ink-muted">{result.why}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Actions</h3>
            <ul className="list-disc pl-5 text-ink-muted">
              {result.actions.map((act: string, idx: number) => <li key={idx}>{act}</li>)}
            </ul>
          </div>
          <Notice type="error" message={result.cautions.join(' ')} />
          <div className="text-xs text-ink-muted italic">
            Sources: {result.sources.join(', ')}
          </div>
        </Card>
      )}
      
      <p className="text-sm text-center text-ink-muted mt-4">
        {t('cropAdvice.disclaimer') || 'AI-generated guidance — verify with local agricultural experts'}
      </p>
    </div>
  );
}
