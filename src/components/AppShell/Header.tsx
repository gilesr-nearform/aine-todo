import {
  HeaderLogo,
  HeaderNext,
  HeaderTitle,
} from '@ogcio/design-system-react';
import { LogoHarpWhite } from '@ogcio/design-system-react/logos';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MobileNav } from '../Sidebar/MobileNav';

export function Header() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <HeaderNext variant="default" aria-label="UX ToDo site header">
      <HeaderLogo>
        <div className="flex items-center gap-2">
          {isMobile ? <MobileNav /> : null}
          <LogoHarpWhite aria-label="Rialtas na hÉireann / Government of Ireland" />
        </div>
      </HeaderLogo>
      <HeaderTitle>UX ToDo</HeaderTitle>
    </HeaderNext>
  );
}
