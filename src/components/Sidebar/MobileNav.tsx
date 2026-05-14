import {
  DrawerBody,
  DrawerWrapper,
  Icon,
  IconButton,
} from '@ogcio/design-system-react';
import { useState } from 'react';

import { useT } from '../../i18n/I18nContext';
import { Sidebar } from './Sidebar';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const t = useT();

  return (
    <>
      <IconButton
        type="button"
        variant="flat"
        appearance="dark"
        size="md"
        ariaLabel={t('sidebar.openMenu')}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Icon icon="menu" size="md" ariaHidden />
      </IconButton>
      <DrawerWrapper
        isOpen={open}
        onClose={close}
        position="left"
        closeButtonLabel={t('sidebar.closeMenu')}
      >
        <DrawerBody>
          <Sidebar onNavigate={close} />
        </DrawerBody>
      </DrawerWrapper>
    </>
  );
}
