'use client';

import { useState, useEffect, use } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { newspapersAPI } from '@/lib/api';
import { Newspaper } from '@/lib/interfaces';
import { useLanguage } from '@/hooks/useLanguage';
import { normalizeExternalUrl } from '@/lib/utils';
import { format } from 'date-fns';
import { uz, ru } from 'date-fns/locale';
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function NewspaperViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { language } = useLanguage();
  // Unwrap params using React.use()
  const { id } = use(params);
  
  const [newspaper, setNewspaper] = useState<Newspaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState<string | null>(null);

  const dateLocale = language === 'uz' ? uz : ru;

  useEffect(() => {
    const fetchNewspaper = async () => {
      try {
        setLoading(true);
        const response = await newspapersAPI.getById(parseInt(id));
        setNewspaper(response.data);
      } catch (err) {
        console.error('Error fetching newspaper:', err);
        setError('Failed to load newspaper');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewspaper();
    }
  }, [id]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar language={language} onLanguageChange={() => {}} />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </main>
        <Footer language={language} />
      </div>
    );
  }

  if (error || !newspaper) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar language={language} onLanguageChange={() => {}} />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-red-600">{error || 'Newspaper not found'}</p>
          <Button onClick={() => window.history.back()}>
            {language === 'uz' ? 'Ortga qaytish' : 'Назад'}
          </Button>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  const pdfUrl = normalizeExternalUrl(newspaper.pdfUrl);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar language={language} onLanguageChange={() => {}} />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{newspaper.title}</h1>
              <p className="text-gray-500">
                {format(new Date(newspaper.issueDate), 'MMMM d, yyyy', {
                  locale: dateLocale,
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={zoomOut}
                disabled={scale <= 0.5}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="min-w-[3rem] text-center text-sm font-medium">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={zoomIn}
                disabled={scale >= 3.0}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                className="ml-2 bg-red-600 hover:bg-red-700"
                asChild
              >
                <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  {language === 'uz' ? 'Yuklab olish' : 'Скачать'}
                </a>
              </Button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 min-h-[600px] flex flex-col items-center">
            <div className="w-full flex justify-center overflow-auto">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="h-96 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                }
                error={
                  <div className="h-96 flex items-center justify-center text-red-500">
                    Failed to load PDF file. Please try downloading it instead.
                  </div>
                }
                className="max-w-full"
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                />
              </Document>
            </div>

            {/* Pagination Controls */}
            {numPages && (
              <div className="mt-6 flex items-center gap-4 sticky bottom-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-gray-200">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previousPage}
                  disabled={pageNumber <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <p className="text-sm font-medium">
                  Page {pageNumber} of {numPages}
                </p>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextPage}
                  disabled={pageNumber >= numPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
