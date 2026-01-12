'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { NewspaperSection } from '@/components/newspaper-section';
import { newspapersAPI } from '@/lib/api';
import { Newspaper } from '@/lib/interfaces';
import { useLanguage } from '@/hooks/useLanguage';
import { uz, ru } from 'date-fns/locale';

export default function NewspapersPage() {
  const { language } = useLanguage();
  const [newspapers, setNewspapers] = useState<Newspaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNewspapers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: page.toString(),
        limit: '12',
      };

      if (date?.from) {
        params.fromDate = date.from.toISOString();
      }
      if (date?.to) {
        params.toDate = date.to.toISOString();
      }

      const response = await newspapersAPI.getAll(params);
      setNewspapers(response.data.data);
      setTotalPages(response.data.meta.pages);
    } catch (error) {
      console.error('Error fetching newspapers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewspapers();
  }, [page, date]);

  const dateLocale = language === 'uz' ? uz : ru;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar language={language} onLanguageChange={() => {}} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {language === 'uz' ? 'Gazetalar Arxivi' : 'Архив Газет'}
          </h1>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-75 justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y', { locale: dateLocale })}{' '}
                        - {format(date.to, 'LLL dd, y', { locale: dateLocale })}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y', { locale: dateLocale })
                    )
                  ) : (
                    <span>
                      {language === 'uz' ? 'Sana tanlang' : 'Выберите дату'}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            
            {(date?.from || date?.to) && (
                 <Button 
                    variant="ghost" 
                    onClick={() => setDate(undefined)}
                 >
                    {language === 'uz' ? 'Tozalash' : 'Очистить'}
                 </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {newspapers.length > 0 ? (
               <NewspaperSection newspapers={newspapers} language={language} />
            ) : (
                <div className="text-center py-20 text-gray-500">
                    {language === 'uz' ? 'Gazetalar topilmadi' : 'Газеты не найдены'}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  {language === 'uz' ? 'Oldingi' : 'Предыдущая'}
                </Button>
                <span className="flex items-center px-4">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  {language === 'uz' ? 'Keyingi' : 'Следующая'}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer language={language} />
    </div>
  );
}
