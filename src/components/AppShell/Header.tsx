import {
  HeaderLogo,
  HeaderMenuItemButton,
  HeaderNext,
  HeaderPrimaryMenu,
  HeaderTitle,
  DrawerBody,
  DrawerWrapper,
  Icon,
} from '@ogcio/design-system-react';
import { LogoWhite } from '@ogcio/design-system-react/logos';
import { useState } from 'react';

import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useT } from '../../i18n/I18nContext';
import { Sidebar } from '../Sidebar/Sidebar';

// The mobile nav trigger lives on the right of the green bar inside
// gov.ie's HeaderPrimaryMenu. The Drawer renders as a sibling of HeaderNext
// (Gov.ie's HeaderPrimaryMenu strictly filters children by component identity,
// so a Fragment containing both the menu button and the drawer wouldn't
// survive the filter — keep them split.)
export function Header() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const t = useT();
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);

  return (
    <>
      <HeaderNext variant="default" aria-label={t('header.siteAria')}>
        <HeaderLogo>
          <LogoWhite label={`${t('branding.ga')}, ${t('branding.en')}`} />
        </HeaderLogo>
        <HeaderTitle>{t('header.title')}</HeaderTitle>
        {isMobile ? (
          <HeaderPrimaryMenu aria-label={t('sidebar.aria')}>
            <HeaderMenuItemButton
              type="button"
              showItemMode="always"
              onClick={() => setNavOpen(true)}
              aria-label={t('sidebar.openMenu')}
              aria-expanded={navOpen}
              title={t('sidebar.openMenu')}
            >
              <Icon icon="menu" size="md" ariaHidden />
            </HeaderMenuItemButton>
          </HeaderPrimaryMenu>
        ) : null}
      </HeaderNext>
      {isMobile ? (
        <DrawerWrapper
          isOpen={navOpen}
          onClose={closeNav}
          position="right"
          closeButtonLabel={t('sidebar.closeMenu')}
        >
          <DrawerBody>
            <Sidebar onNavigate={closeNav} />
          </DrawerBody>
        </DrawerWrapper>
      ) : null}
    </>
  );
}
