import { useT } from '../../i18n/I18nContext';

const SKELETON_ROW_WIDTHS = ['w-3/4', 'w-1/2', 'w-2/3'] as const;

function SkeletonRow({ descriptionWidth }: { descriptionWidth: string }) {
  return (
    <li className="flex items-start gap-3 border-b border-gray-200 py-3 last:border-b-0">
      <div className="mt-1 h-5 w-5 shrink-0 rounded bg-gray-200" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className={`h-4 rounded bg-gray-200 ${descriptionWidth}`} />
        <div className="h-3 w-1/4 rounded bg-gray-100" />
      </div>
    </li>
  );
}

export function LoadingState() {
  const t = useT();
  return (
    <div
      className="mx-auto w-full max-w-2xl animate-pulse motion-reduce:animate-none"
      aria-busy="true"
      aria-label={t('state.loadingAria')}
    >
      <ul className="list-none p-0">
        {SKELETON_ROW_WIDTHS.map((width, index) => (
          <SkeletonRow key={index} descriptionWidth={width} />
        ))}
      </ul>
    </div>
  );
}
