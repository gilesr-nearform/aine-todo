import {
  HeaderLogo,
  HeaderNext,
  HeaderTitle,
} from '@ogcio/design-system-react';
import { LogoHarpWhite } from '@ogcio/design-system-react/logos';

import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useT } from '../../i18n/I18nContext';
import { MobileNav } from '../Sidebar/MobileNav';

export function Header() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const t = useT();

  return (
    <HeaderNext variant="default" aria-label={t('header.siteAria')}>
      <HeaderLogo>
        <div className="flex items-center gap-2">
          {isMobile ? <MobileNav /> : null}
          <LogoHarpWhite aria-label={`${t('branding.ga')} / ${t('branding.en')}`} />
        </div>
      </HeaderLogo>
      <HeaderTitle>{t('header.title')}</HeaderTitle>
    </HeaderNext>
  );
}
