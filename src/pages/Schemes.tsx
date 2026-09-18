import React, { useState } from 'react';
import { Card, Button, Notice } from '../components';
import { useLanguage } from '../hooks/useLanguage';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { schemes } from '../data/schemes';

const categories = ['All', 'Subsidy', 'Insurance', 'Credit', 'Equipment'];

export function Schemes() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('All');

  const filteredSchemes = filter === 'All' 
    ? schemes || [] 
    : (schemes || []).filter((s: any) => s.category === filter);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t('schemes.title') || 'Government Schemes'}
        </h1>
        <p className="mt-1 text-base text-ink-muted">
          {t('schemes.subtitle') || 'Explore official agricultural schemes and subsidies'}
        </p>
      </div>

      <Notice 
        type="info" 
        icon={<ShieldCheck className="h-5 w-5 text-brand" />}
        message="Official government source content only." 
      />

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === c ? 'bg-brand text-surface' : 'bg-canvas text-ink border border-line'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme: any, idx: number) => (
          <Card key={idx} className="p-5 flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-ink">{scheme.title}</h3>
              <span className="px-2 py-1 bg-brand-soft text-brand text-xs font-bold rounded">
                {scheme.category}
              </span>
            </div>
            <p className="text-sm text-ink-muted mb-4 flex-grow">
              {scheme.description}
            </p>
            <a href={scheme.url || '#'} target="_blank" rel="noreferrer" className="mt-auto block">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                Visit Official Portal <ExternalLink size={16} />
              </Button>
            </a>
          </Card>
        ))}
        {filteredSchemes.length === 0 && (
          <div className="col-span-full text-center py-8 text-ink-muted">
            No schemes found for this category.
          </div>
        )}
      </div>
    </div>
  );
}
