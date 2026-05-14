import { Heading } from '@ogcio/design-system-react';

export function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
      <Heading as="h1" size="lg">
        ListLens
      </Heading>
    </header>
  );
}
