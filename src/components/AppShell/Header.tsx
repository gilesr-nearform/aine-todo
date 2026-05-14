import {
  HeaderLogo,
  HeaderMenuItemButton,
  HeaderNext,
  HeaderPrimaryMenu,
  HeaderTitle,
} from '@ogcio/design-system-react';
import { LogoWhite } from '@ogcio/design-system-react/logos';

import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useT } from '../../i18n/I18nContext';
import { MobileNav } from '../Sidebar/MobileNav';
import { ThemeIcon, useThemeToggle } from './ThemeToggle';

export function Header() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const t = useT();
  const themeToggle = useThemeToggle();

  return (
    <HeaderNext variant="default" aria-label={t('header.siteAria')}>
      <HeaderLogo>
        <div className="flex items-center gap-3">
          {isMobile ? <MobileNav /> : null}
          <LogoWhite label={`${t('branding.ga')}, ${t('branding.en')}`} />
        </div>
      </HeaderLogo>
      <HeaderTitle>{t('header.title')}</HeaderTitle>
      <HeaderPrimaryMenu aria-label={t('header.siteAria')}>
        <HeaderMenuItemButton
          type="button"
          showItemMode="always"
          onClick={themeToggle.toggle}
          aria-label={themeToggle.label}
          aria-pressed={themeToggle.isDark}
          title={themeToggle.label}
        >
          <ThemeIcon isDark={themeToggle.isDark} />
        </HeaderMenuItemButton>
      </HeaderPrimaryMenu>
    </HeaderNext>
  );
}
