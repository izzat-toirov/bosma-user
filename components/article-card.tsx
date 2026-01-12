import Link from 'next/link';
import { Article } from '@/lib/interfaces';
import { useLanguage } from '@/hooks/useLanguage';
import { normalizeExternalUrl } from '@/lib/utils';
import { format } from 'date-fns';
import { uz, ru } from 'date-fns/locale';

interface ArticleCardProps {
  article: Article;
  language: 'uz' | 'ru';
  featured?: boolean;
  compact?: boolean;
}

export function ArticleCard({
  article,
  language,
  featured = false,
  compact = false,

}: ArticleCardProps) {
  const FALLBACK_IMAGE_SRC =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#e5e7eb"/><path d="M438 448l120-140 116 136 76-86 172 200H438z" fill="#cbd5e1"/><circle cx="520" cy="260" r="44" fill="#cbd5e1"/></svg>`
    );

  const { getContent } = useLanguage();
  const title = getContent(article.titleUz, article.titleRu || undefined);
  const category = article.category.nameUz;
  const dateLocale = language === 'uz' ? uz : ru;

  if (featured) {
    return (
      <Link href={`/article/${article.slug}`}>
        <article className="border-b border-black/10 pb-8 cursor-pointer group">
          <div className="mb-4 overflow-hidden bg-black/5 aspect-video">
            <img
              src={normalizeExternalUrl(article.thumbnail) || FALLBACK_IMAGE_SRC}
              alt={title}
              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_IMAGE_SRC;
              }}
            />
          </div>
          <div className="space-y-3">
            <p className="text-xs tracking-widest text-black/60 font-medium">
              {category.toUpperCase()}
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-black/60">
              {format(new Date(article.createdAt), 'MMMM d, yyyy', {
                locale: dateLocale,
              })}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  if (compact) {
    <Link href={`/article/${article.slug}`}>
      <article className="cursor-pointer group">
        <div className="mb-4 overflow-hidden bg-black/5 aspect-square">
          <img
            src={normalizeExternalUrl(article.thumbnail) || FALLBACK_IMAGE_SRC}
            alt={title}
            className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE_SRC;
            }}
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs tracking-widest text-black/60 font-medium">
            {category.toUpperCase()}
          </p>
          <h2 className="text-lg font-bold leading-snug group-hover:underline">
            {title}
          </h2>
          <p className="text-xs text-black/60">
            {format(new Date(article.createdAt), 'MMM d', {
              locale: dateLocale,
            })}
          </p>
        </div>
      </article>
    </Link>
  };
}
