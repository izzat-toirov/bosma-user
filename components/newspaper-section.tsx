import { useState } from 'react';
import { Download, Link as LinkIcon, FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { Newspaper } from '@/lib/interfaces';
import { useLanguage } from '@/hooks/useLanguage';
import { normalizeExternalUrl } from '@/lib/utils';
import { format } from 'date-fns';
import { uz, ru } from 'date-fns/locale';

interface NewspaperSectionProps {
  newspapers: Newspaper[];
  language: 'uz' | 'ru';
}

export function NewspaperSection({
  newspapers,
  language,
}: NewspaperSectionProps) {
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const dateLocale = language === 'uz' ? uz : ru;

  const handleImageError = (id: number) => {
    setFailedImages((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <section className="py-12 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">
          {language === 'uz' ? 'GAZETALAR' : 'ГАЗЕТЫ'}
        </h2>

        {/* Horizontal Scroll Container */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-6 min-w-min">
            {newspapers.map((paper) => (
              <Link
                key={paper.id}
                href={`/newspapers/${paper.id}`}
                className="flex-shrink-0 w-48 group"
              >
                <div className="relative mb-3 bg-gray-100 aspect-[3/4] overflow-hidden">
                  {failedImages.has(paper.id) ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center border border-gray-200">
                      <FileQuestion className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-xs font-medium">
                        {language === 'uz' ? 'Rasm topilmadi' : 'Нет изображения'}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={normalizeExternalUrl(paper.coverImage)}
                      alt={paper.title}
                      className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                      onError={() => handleImageError(paper.id)}
                    />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all">
                    <div className="bg-white/90 text-black px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      {language === 'uz' ? "O'qish" : 'Читать'}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold leading-tight truncate">
                    {paper.title}
                  </h3>
                  <p className="text-xs text-black/60">
                    {format(new Date(paper.issueDate), 'MMMM yyyy', {
                      locale: dateLocale,
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
