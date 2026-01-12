'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ArticleCard } from '@/components/article-card';
import { NewspaperSection } from '@/components/newspaper-section';
import { getArticles } from '@/services/articles';
import { getNewspapers } from '@/services/newspapers';
import { Article, Newspaper } from '@/lib/interfaces';
import { useLanguage } from '@/hooks/useLanguage';

export default function Home() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [newspapers, setNewspapers] = useState<Newspaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesResponse, newspapersResponse] = await Promise.all([
          getArticles({
            limit: '10',
            isPublished: 'true',
            sortBy: 'createdAt',
            sortOrder: 'desc',
          }),
          getNewspapers(),
        ]);

        setArticles(articlesResponse.data);
        setNewspapers(newspapersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 4);
  const categoryArticles = articles.slice(4);

  // Group remaining articles by category
  const articlesByCategory: { [key: string]: Article[] } = {};
  categoryArticles.forEach((article) => {
    const catName =
      language === 'uz'
        ? article.category.nameUz
        : article.category.nameRu || article.category.nameUz;
    if (!articlesByCategory[catName]) {
      articlesByCategory[catName] = [];
    }
    articlesByCategory[catName].push(article);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar language={language} onLanguageChange={() => {}} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar language={language} onLanguageChange={() => {}} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4">
        {/* Hero Section */}
        <section className="py-8 border-b border-black/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Featured Article (Left - 2 columns) */}
            <div className="lg:col-span-2">
              {mainArticle && (
                <ArticleCard
                  article={mainArticle}
                  language={language}
                  featured
                />
              )}
            </div>

            {/* Side Articles (Right - 1 column) */}
            <div className="space-y-6">
              {sideArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  language={language}
                  compact
                />
              ))}
            </div>
          </div>
        </section>

        {/* Category Sections */}
        {Object.entries(articlesByCategory).map(
          ([categoryName, categoryArticles]) => (
            <section
              key={categoryName}
              className="py-8 border-b border-black/10"
            >
              <h2 className="text-2xl font-bold mb-6 tracking-tight uppercase border-l-4 border-red-600 pl-3">
                {categoryName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {categoryArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    language={language}
                  />
                ))}
              </div>
            </section>
          )
        )}

        {/* Newspaper Section */}
        <NewspaperSection newspapers={newspapers} language={language} />
      </main>

      <Footer language={language} />
    </div>
  );
}
