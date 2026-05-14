import {
  DrawerBody,
  DrawerWrapper,
  Icon,
  IconButton,
} from '@ogcio/design-system-react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <IconButton
        type="button"
        variant="flat"
        appearance="dark"
        size="md"
        ariaLabel="Open lists menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Icon icon="menu" size="md" ariaHidden />
      </IconButton>
      <DrawerWrapper
        isOpen={open}
        onClose={close}
        position="left"
        closeButtonLabel="Close menu"
      >
        <DrawerBody>
          <Sidebar onNavigate={close} />
        </DrawerBody>
      </DrawerWrapper>
    </>
  );
}
