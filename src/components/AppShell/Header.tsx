import {
  HeaderLogo,
  HeaderNext,
  HeaderTitle,
} from '@ogcio/design-system-react';
import { LogoHarpWhite } from '@ogcio/design-system-react/logos';

export function Header() {
  return (
    <HeaderNext variant="default" aria-label="UX ToDo site header">
      <HeaderLogo>
        <LogoHarpWhite aria-label="Rialtas na hÉireann / Government of Ireland" />
      </HeaderLogo>
      <HeaderTitle>UX ToDo</HeaderTitle>
    </HeaderNext>
  );
}
