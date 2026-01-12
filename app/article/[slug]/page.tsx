'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Share2, Trash2 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { getArticleBySlug } from '@/services/articles';
import { commentsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Article, Comment } from '@/lib/interfaces';
import { normalizeExternalUrl } from '@/lib/utils';
import { format } from 'date-fns';
import { uz, ru } from 'date-fns/locale';
import { useLanguage } from '@/hooks/useLanguage';

export default function ArticlePage() {
  const FALLBACK_IMAGE_SRC =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#e5e7eb"/><path d="M438 448l120-140 116 136 76-86 172 200H438z" fill="#cbd5e1"/><circle cx="520" cy="260" r="44" fill="#cbd5e1"/></svg>`
    );

  const params = useParams();
  const slug = params.slug as string;
  const { language, getContent, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await getArticleBySlug(slug);
        setArticle(response.data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (article) {
      fetchComments();
    }
  }, [article]);

  const fetchComments = async () => {
    if (!article) return;

    try {
      setCommentsLoading(true);
      const response = await commentsAPI.getComments(article.id);
      const payload = response.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];
      setComments(list);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;
    if (!isAuthenticated) {
      alert(
        language === 'uz'
          ? 'Izoh qoldirish uchun tizimga kirish kerak'
          : 'Чтобы оставить комментарий, нужно войти в систему'
      );
      return;
    }

    try {
      setCommentSubmitting(true);

      // Add the comment
      await commentsAPI.addComment(article!.id, newComment);

      // Reset form and fetch comments again
      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(
        language === 'uz'
          ? "Izoh qo'shishda xatolik yuz berdi"
          : 'Произошла ошибка при добавлении комментария'
      );
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar language={language} onLanguageChange={() => {}} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-black/60">Loading...</p>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar language={language} onLanguageChange={() => {}} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-black/60">
            {language === 'uz' ? 'Maqola topilmadi' : 'Статья не найдена'}
          </p>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  const dateLocale = language === 'uz' ? uz : ru;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar language={language} onLanguageChange={() => {}} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-8"
        >
          <ArrowLeft size={16} />
          {language === 'uz' ? 'Orqaga' : 'Назад'}
        </Link>

        {/* Article Header */}
        <article>
          <header className="mb-8 border-b border-black/10 pb-8">
            <p className="text-xs tracking-widest text-black/60 font-medium mb-4">
              {article.category.nameUz.toUpperCase()}
            </p>
            <h1 className="text-5xl font-bold leading-tight tracking-tight mb-4">
              {getContent(article.titleUz, article.titleRu || undefined)}
            </h1>

            {/* Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-black/60">
              <span>
                {language === 'uz' ? 'Chop etilgan' : 'Опубликовано'}{' '}
                {format(new Date(article.createdAt), 'MMMM d, yyyy', {
                  locale: dateLocale,
                })}
              </span>
              <button className="flex items-center gap-2 hover:text-black transition-colors">
                <Share2 size={16} />
                {language === 'uz' ? 'Ulashish' : 'Поделиться'}
              </button>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-8 -mx-4 sm:mx-0">
            {article.thumbnail ? (
              <img
                src={normalizeExternalUrl(article.thumbnail)}
                alt={getContent(article.titleUz, article.titleRu || undefined)}
                className="w-full aspect-video object-cover bg-black/5"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE_SRC;
                }}
              />
            ) : (
              <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                <span>No image</span>
              </div>
            )}
          </div>

          {/* Article Content */}
          <div
            className="prose prose-sm max-w-none text-lg leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: getContent(
                article.contentUz,
                article.contentRu || undefined
              ),
            }}
          />
        </article>

        {/* Comments Section */}
        <section className="mt-16 pt-8 border-t border-black/10">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">
            {language === 'uz' ? 'IZOHlar' : 'КОММЕНТАРИИ'}
          </h2>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  language === 'uz'
                    ? 'Izohingizni yozing...'
                    : 'Напишите свой комментарий...'
                }
                className="w-full p-3 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-25"
                rows={3}
              />
              <button
                type="submit"
                disabled={commentSubmitting}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {commentSubmitting
                  ? language === 'uz'
                    ? 'Joylash...'
                    : 'Отправка...'
                  : language === 'uz'
                  ? 'Izohni joylashtirish'
                  : 'Оставить комментарий'}
              </button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-100 rounded-md">
              <p className="text-gray-700">
                {language === 'uz'
                  ? 'Izoh qoldirish uchun avval tizimga kiring:'
                  : 'Чтобы оставить комментарий, войдите в систему:'}{' '}
                <Link
                  href="/auth/login"
                  className="text-indigo-600 hover:underline"
                >
                  {language === 'uz' ? 'Kirish' : 'Войти'}
                </Link>
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {commentsLoading ? (
              <p>
                {language === 'uz'
                  ? 'Izohlar yuklanmoqda...'
                  : 'Загрузка комментариев...'}
              </p>
            ) : comments.length === 0 ? (
              <p className="text-gray-600">
                {language === 'uz'
                  ? 'Hali izohlar mavjud emas'
                  : 'Пока нет комментариев'}
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className="font-semibold">{comment.user.fullName}</h4>
                      <span className="text-sm text-gray-500">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy', {
                          locale: dateLocale,
                        })}
                      </span>
                    </div>
                    {user?.id === comment.userId && (
                      <button
                        onClick={() => commentsAPI.deleteComment(comment.id).then(fetchComments)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title={
                          language === 'uz'
                            ? "Izohni o'chirish"
                            : 'Удалить комментарий'
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-gray-700">
                    {(comment as any).text ?? (comment as any).content}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Articles (Optional) */}
        <section className="mt-16 pt-8 border-t border-black/10">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">
            {language === 'uz' ? 'BOSHQA XABARLAR' : 'ДРУГИЕ НОВОСТИ'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Related articles would be fetched here */}
          </div>
        </section>
      </main>

      <Footer language={language} />
    </div>
  );
}
