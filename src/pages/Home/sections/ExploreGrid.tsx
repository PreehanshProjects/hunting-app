import { Link } from 'react-router-dom'
import { Rabbit, BookOpen, Shield, Map as MapIcon, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ExploreGrid() {
  const { t } = useTranslation()

  const gridItems = [
    { title: t('explore.wildlife_title'), path: '/wildlife', icon: Rabbit, size: 'large', image: '/rusa/lesbains39-fauna-6883291_1920.jpg', desc: t('explore.wildlife_desc') },
    { title: t('explore.guide_title'), path: '/guide', icon: BookOpen, size: 'medium', image: '/common/various-travel-objects-grass.jpg', desc: t('explore.guide_desc') },
    { title: t('explore.law_title'), path: '/law', icon: Shield, size: 'medium', image: '/common/Dogs-with-Hunting-Vests.jpg', desc: t('explore.law_desc') },
    { title: t('explore.zones_title'), path: '/zones', icon: MapIcon, size: 'small', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop', desc: t('explore.zones_desc') },
    { title: t('explore.dashboard_title'), path: '/dashboard', icon: User, size: 'small', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop', desc: t('explore.dashboard_desc') },
  ]

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[800px]">
          {gridItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={cn(
                'group relative overflow-hidden rounded-3xl border border-white/5',
                item.size === 'large' ? 'md:col-span-2 md:row-span-2' : '',
                item.size === 'medium' ? 'md:col-span-2 md:row-span-1' : '',
                item.size === 'small' ? 'md:col-span-1 md:row-span-1' : ''
              )}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent opacity-80" />
              <div className="absolute inset-0 bg-forest-900/20 group-hover:bg-transparent transition-colors duration-500" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <item.icon className="w-8 h-8 text-forest-400 mb-4 transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" />
                <h3 className="text-2xl md:text-3xl font-display font-bold italic mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm max-w-xs transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                  {item.desc}
                </p>
              </div>

              <div className="absolute inset-0 border-2 border-forest-500/0 group-hover:border-forest-500/50 rounded-3xl transition-colors duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
