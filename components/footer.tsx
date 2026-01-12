import { Facebook, Twitter, Instagram, Mail } from "lucide-react"
import { type Language, getTranslation } from "@/lib/constants/translations"

interface FooterProps {
  language: Language
}

export function Footer({ language }: FooterProps) {
  return (
    <footer className="border-t border-black/10 bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-sm mb-4 tracking-wide">{language === "uz" ? "BIZ HAQIDA" : "О НАС"}</h3>
            <p className="text-sm text-black/60 leading-relaxed">
              {language === "uz"
                ? "Bugungi dunyo voqealari haqida eng yangi xabarlarga ega bo'ling."
                : "Будьте в курсе событий современного мира."}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-sm mb-4 tracking-wide">{language === "uz" ? "HAVOLALAR" : "ССЫЛКИ"}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-black/60 hover:text-black">
                  {language === "uz" ? "Bosh Sahifa" : "Главная"}
                </a>
              </li>
              <li>
                <a href="#" className="text-black/60 hover:text-black">
                  {language === "uz" ? "Gazetalar" : "Газеты"}
                </a>
              </li>
              <li>
                <a href="#" className="text-black/60 hover:text-black">
                  {language === "uz" ? "Aloqa" : "Контакты"}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-sm mb-4 tracking-wide">{language === "uz" ? "HUQUQ" : "ЮРИДИЧЕСКИЕ"}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-black/60 hover:text-black">
                  {language === "uz" ? "Foydalanish Shartlari" : "Условия использования"}
                </a>
              </li>
              <li>
                <a href="#" className="text-black/60 hover:text-black">
                  {language === "uz" ? "Maxfiylik Siyosati" : "Политика конфиденциальности"}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-sm mb-4 tracking-wide">{getTranslation("footer.follow", language)}</h3>
            <div className="flex gap-4">
              <a href="#" className="text-black/60 hover:text-black">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-black/60 hover:text-black">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-black/60 hover:text-black">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-black/60 hover:text-black">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-black/10 pt-8 text-center text-xs text-black/60">
          {getTranslation("footer.copyright", language)}
        </div>
      </div>
    </footer>
  )
}
