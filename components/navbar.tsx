'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, LogOut, ChevronDown, Newspaper } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageToggle } from './LanguageToggle';
import { normalizeExternalUrl } from '@/lib/utils';

interface NavbarProps {
  language?: 'uz' | 'ru';
  onLanguageChange?: (lang: 'uz' | 'ru') => void;
}

export function Navbar({}: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="border-b border-black/10 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          {language === 'uz' ? 'YANGILIKLAR' : 'НОВОСТИ'}
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 mx-6">
          <Link
            href="/newspapers"
            className="text-sm font-medium hover:text-black/60 transition-colors flex items-center gap-2"
          >
            <Newspaper size={18} />
            {language === 'uz' ? 'Gazetalar' : 'Газеты'}
          </Link>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4 relative">
          {searchOpen ? (
            <input
              autoFocus
              type="text"
              placeholder={language === 'uz' ? 'Qidirish...' : 'Поиск...'}
              className="w-full px-3 py-2 text-sm border-b border-black/20 focus:outline-none"
              onBlur={() => setSearchOpen(false)}
            />
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-sm text-black/60 hover:text-black"
            >
              <Search size={18} />
            </button>
          )}
        </div>

        {/* Right - Auth and Language */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                onBlur={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 rounded-full border border-black/10 px-2 py-1 hover:bg-black/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-black/5 flex items-center justify-center text-sm font-semibold">
                  {normalizeExternalUrl(user?.avatar || '') ? (
                    <img
                      src={normalizeExternalUrl(user?.avatar || '')}
                      alt={user?.fullName || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {(user?.fullName || 'U').slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium max-w-[140px] truncate">
                  {user?.fullName}
                </span>
                <ChevronDown size={16} className="text-black/60" />
              </button>

              {userMenuOpen ? (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-black/10 bg-white shadow-lg overflow-hidden">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/5"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={16} />
                    {language === 'uz' ? 'Profil' : 'Профиль'}
                  </Link>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-black/5"
                  >
                    <LogOut size={16} />
                    {language === 'uz' ? 'Chiqish' : 'Выход'}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1 text-sm font-medium border border-black/20 px-3 py-2 hover:bg-black/5 transition-colors"
            >
              <User size={16} />
              {language === 'uz' ? 'Kirish' : 'Войти'}
            </Link>
          )}

          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
}
