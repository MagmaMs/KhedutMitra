import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HomeIcon, IndianRupeeIcon, PlusCircleIcon, ClipboardListIcon, UserIcon, StoreIcon, SproutIcon, BoxIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import { LanguageToggle } from "./LanguageToggle";
import { Button } from "./Button";
import { cn } from "../utils/cn";
interface NavItem {
  to: string;
  labelKey: string;
  Icon: BoxIcon;
}
const farmerNav: NavItem[] = [{
  to: '/home',
  labelKey: 'nav.home',
  Icon: HomeIcon
}, {
  to: '/prices',
  labelKey: 'nav.prices',
  Icon: IndianRupeeIcon
}, {
  to: '/sell',
  labelKey: 'nav.sell',
  Icon: PlusCircleIcon
}, {
  to: '/listings',
  labelKey: 'nav.listings',
  Icon: ClipboardListIcon
}, {
  to: '/profile',
  labelKey: 'nav.profile',
  Icon: UserIcon
}];
const buyerNav: NavItem[] = [{
  to: '/marketplace',
  labelKey: 'nav.marketplace',
  Icon: StoreIcon
}, {
  to: '/profile',
  labelKey: 'nav.profile',
  Icon: UserIcon
}];
export function AppShell({
  children


}: {children: React.ReactNode;}) {
  const {
    isAuthenticated,
    activeRole
  } = useAuth();
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();
  const items = !isAuthenticated ? [] : activeRole === 'farmer' ? farmerNav : buyerNav;
  return <div className="flex min-h-full w-full flex-col bg-canvas">
      <header className="sticky top-0 z-40 border-b border-brand-deep/20 bg-brand-deep">
        <div className="mx-auto flex h-14 w-full max-w-content items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <button type="button" onClick={() => navigate(isAuthenticated ? activeRole === 'farmer' ? '/home' : '/marketplace' : '/')} className="flex items-center gap-2 text-white">
            <SproutIcon className="h-5 w-5 text-white" aria-hidden="true" />
            <span className="text-base font-extrabold tracking-tight">{t('app.name')}</span>
          </button>

          {items.length > 0 ? <nav aria-label="Main" className="hidden md:block">
              <ul className="flex items-center gap-1">
                {items.map((item) => <li key={item.to}>
                    <NavLink to={item.to} className={({
                isActive
              }) => cn('flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-semibold', 'transition-[background-color,color] duration-150 ease-out-soft', isActive ? 'bg-white text-brand-deep' : 'text-white/85 hover:bg-white/10 hover:text-white')}>
                      <item.Icon className="h-4 w-4" aria-hidden="true" />
                      {t(item.labelKey)}
                    </NavLink>
                  </li>)}
              </ul>
            </nav> : null}

          <div className="flex items-center gap-2">
            <LanguageToggle />
            {!isAuthenticated ? <Button variant="secondary" className="hidden min-h-[36px] px-3 text-sm sm:inline-flex" onClick={() => navigate('/login')}>
                {t('action.login')}
              </Button> : null}
          </div>
        </div>
      </header>

      <main className={cn('mx-auto w-full max-w-content flex-1 px-4 py-5 sm:px-6 sm:py-7', items.length > 0 && 'pb-24 md:pb-10')}>
        {children}
      </main>

      {items.length > 0 ? <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface md:hidden">
          <ul className={cn('mx-auto grid max-w-lg', items.length === 5 ? 'grid-cols-5' : 'grid-cols-2')}>
            {items.map((item) => <li key={item.to}>
                <NavLink to={item.to} className={({
            isActive
          }) => cn('flex min-h-[60px] flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold leading-tight', 'transition-colors duration-150 ease-out-soft', isActive ? 'text-brand-deep' : 'text-ink-muted')}>
                  {({
              isActive
            }) => <>
                      <span className={cn('flex h-7 w-12 items-center justify-center rounded-md transition-colors duration-150 ease-out-soft', isActive && 'bg-brand-soft')}>
                        <item.Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="text-center">{t(item.labelKey)}</span>
                    </>}
                </NavLink>
              </li>)}
          </ul>
        </nav> : null}
    </div>;
}