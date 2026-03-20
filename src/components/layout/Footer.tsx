import { Trees, Github, Instagram, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-forest-950 border-t border-forest-900 py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-forest-600 rounded flex items-center justify-center">
              <Trees className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold italic uppercase">Rusa</span>
          </Link>
          <p className="text-white/50 max-w-sm leading-relaxed">
            {t('footer.tagline')}
          </p>
          <div className="flex gap-4 mt-8">
            <a href="#" className="w-10 h-10 rounded-full border border-forest-900 flex items-center justify-center text-white/50 hover:text-forest-400 hover:border-forest-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-forest-900 flex items-center justify-center text-white/50 hover:text-forest-400 hover:border-forest-400 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-forest-900 flex items-center justify-center text-white/50 hover:text-forest-400 hover:border-forest-400 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{t('footer.explore')}</h4>
          <ul className="space-y-4">
            <li><Link to="/wildlife" className="text-white/50 hover:text-white transition-colors">{t('footer.wildlife')}</Link></li>
            <li><Link to="/guide" className="text-white/50 hover:text-white transition-colors">{t('footer.guide')}</Link></li>
            <li><Link to="/law" className="text-white/50 hover:text-white transition-colors">{t('footer.law')}</Link></li>
            <li><Link to="/zones" className="text-white/50 hover:text-white transition-colors">{t('footer.zones')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{t('footer.authority')}</h4>
          <p className="text-white/30 text-xs leading-loose">
            {t('footer.authority_text')}<br />
            <span className="text-white/50">{t('footer.authority_act')}</span><br />
            {t('footer.authority_country')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-forest-900/50 flex flex-col md:flex-row justify-between gap-4 text-[10px] uppercase tracking-widest text-white/30">
        <p>{t('footer.copyright')}</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('footer.ethical')}</a>
        </div>
      </div>
    </footer>
  )
}
