/**
 * UI string catalogue for English + Gaeilge.
 *
 * Known limitation (logged in `docs/stories/10-bilingual-header-i18n.md`):
 * gov.ie component-internal strings (e.g. the search input's "Clear input",
 * the drawer's "Close" button when no `closeButtonLabel` is supplied) are not
 * translated. The gov.ie package ships `initI18n` backed by i18next but does
 * not expose it via the public `exports` field of the package, so wiring it
 * would require a deep import that bypasses the supported entry points.
 *
 * Gaeilge translations are reasonable but not professionally reviewed.
 * Edge cases around séimhiú on proper nouns (e.g. "Cuir tasc le {list}") are
 * handled with sensible defaults rather than full grammatical inflection.
 */

export type Language = 'en' | 'ga';

export const SUPPORTED_LANGUAGES: ReadonlyArray<Language> = ['en', 'ga'];
export const DEFAULT_LANGUAGE: Language = 'en';

export const LANGUAGE_NAMES: Record<Language, { native: string; switchTo: string }> = {
  en: { native: 'English', switchTo: 'Switch to English' },
  ga: { native: 'Gaeilge', switchTo: 'Athraigh go Gaeilge' },
};

const en = {
  // Branding bar
  'branding.aria': 'Government of Ireland bilingual identity',
  'branding.ga': 'Rialtas na hÉireann',
  'branding.en': 'Government of Ireland',

  // Site header
  'header.siteAria': 'UX ToDo site header',
  'header.title': 'UX ToDo',
  'header.themeToLight': 'Switch to light mode',
  'header.themeToDark': 'Switch to dark mode',

  // Sidebar
  'sidebar.aria': 'Lists',
  'sidebar.smart': 'Smart',
  'sidebar.allTasks': 'All tasks',
  'sidebar.completed': 'Completed',
  'sidebar.myLists': 'My lists',
  'sidebar.newListLabel': 'New list name',
  'sidebar.newListPlaceholder': 'New list name',
  'sidebar.addList': 'Add list',
  'sidebar.rename': "Rename '{name}'",
  'sidebar.delete': "Delete '{name}'",
  'sidebar.confirmDeleteTitle': 'Delete this list?',
  'sidebar.confirmDelete':
    "Delete '{name}' and its tasks? Tasks in this list will be permanently removed.",
  'sidebar.renameInputLabel': "Rename list '{name}'",
  'sidebar.save': 'Save',
  'sidebar.cancel': 'Cancel',
  'sidebar.openMenu': 'Open lists menu',
  'sidebar.closeMenu': 'Close menu',

  // List summary + clear
  'summary.progress': '{completed} of {total} completed',
  'summary.clear': 'Clear completed',
  'summary.show': 'Show completed',
  'summary.hide': 'Hide completed',
  'summary.confirmClearTitle': 'Clear completed tasks?',
  'summary.confirmClearList':
    "Clear {count} completed tasks in '{name}'? This can't be undone.",
  'summary.confirmClearAll':
    "Clear {count} completed tasks across all lists? This can't be undone.",

  // Controls
  'controls.searchLabel': 'Search tasks',
  'controls.searchPlaceholder': 'Search',

  // Input bar
  'input.formAria': 'Add a task',
  'input.label': 'Task description',
  'input.placeholderForList': 'Add a task to {list}',
  'input.placeholderGeneric': 'Add a task',
  'input.add': 'Add',

  // Todo item
  'todo.edit': "Edit '{description}'",
  'todo.delete': "Delete '{description}'",
  'todo.moveUp': "Move '{description}' up",
  'todo.moveDown': "Move '{description}' down",
  'todo.createdAtTime': 'added at {time}',
  'todo.createdAtDate': 'added on {date}',

  // Inline editor
  'editor.description': 'Description',
  'editor.notes': 'Notes (optional)',
  'editor.notesPlaceholder': 'Add a note',
  'editor.save': 'Save',
  'editor.cancel': 'Cancel',

  // Undo toast
  'undo.deleted': "Deleted '{description}'",
  'undo.undo': 'Undo',

  // States
  'state.loadingAria': 'Loading your tasks',
  'state.errorTitle': "We couldn't load your tasks",
  'state.errorBody': 'Please check your connection and try again.',
  'state.errorRetry': 'Try again',
  'state.errorRetrying': 'Trying…',
  'state.emptyTitle': 'No tasks yet',
  'state.emptyBody': 'Add your first task using the box below.',
  'state.emptyBodyForList': 'No tasks in {list} yet. Add one below.',
  'state.emptyBodyGeneric': 'No tasks yet. Add one below.',
  'state.noMatches': 'No tasks match your filters.',
  'state.noCompletedYet': 'Nothing completed yet. Tick a task to see it here.',
  'state.resetFilters': 'Reset filters',

  // List title
  'list.allTasksHeading': 'All tasks',
} as const;

type Key = keyof typeof en;

const ga: Record<Key, string> = {
  // Branding bar
  'branding.aria': 'Aitheantas dátheangach Rialtas na hÉireann',
  'branding.ga': 'Rialtas na hÉireann',
  'branding.en': 'Government of Ireland',

  // Site header
  'header.siteAria': 'Ceanntásc shuíomh UX ToDo',
  'header.title': 'UX ToDo',
  'header.themeToLight': 'Athraigh go mód éadrom',
  'header.themeToDark': 'Athraigh go mód dorcha',

  // Sidebar
  'sidebar.aria': 'Liostaí',
  'sidebar.smart': 'Cliste',
  'sidebar.allTasks': 'Gach tasc',
  'sidebar.completed': 'Críochnaithe',
  'sidebar.myLists': 'Mo liostaí',
  'sidebar.newListLabel': 'Ainm liosta nua',
  'sidebar.newListPlaceholder': 'Ainm liosta nua',
  'sidebar.addList': 'Cuir liosta leis',
  'sidebar.rename': "Athainmnigh '{name}'",
  'sidebar.delete': "Scrios '{name}'",
  'sidebar.confirmDeleteTitle': 'An scriosfar an liosta seo?',
  'sidebar.confirmDelete':
    "An scriosfar '{name}' agus a chuid tascanna? Scriosfar tascanna an liosta seo go buan.",
  'sidebar.renameInputLabel': "Athainmnigh an liosta '{name}'",
  'sidebar.save': 'Sábháil',
  'sidebar.cancel': 'Cealaigh',
  'sidebar.openMenu': 'Oscail roghchlár na liostaí',
  'sidebar.closeMenu': 'Dún an roghchlár',

  // List summary + clear
  'summary.progress': '{completed} as {total} críochnaithe',
  'summary.clear': 'Glan na cinn chríochnaithe',
  'summary.show': 'Taispeáin na cinn chríochnaithe',
  'summary.hide': 'Folaigh na cinn chríochnaithe',
  'summary.confirmClearTitle': 'An nglanfar na tascanna críochnaithe?',
  'summary.confirmClearList':
    "An nglanfar {count} tasc críochnaithe i '{name}'? Ní féidir é seo a chealú.",
  'summary.confirmClearAll':
    'An nglanfar {count} tasc críochnaithe trasna na liostaí go léir? Ní féidir é seo a chealú.',

  // Controls
  'controls.searchLabel': 'Cuardaigh tascanna',
  'controls.searchPlaceholder': 'Cuardaigh',

  // Input bar
  'input.formAria': 'Cuir tasc leis',
  'input.label': 'Cur síos ar an tasc',
  'input.placeholderForList': 'Cuir tasc le {list}',
  'input.placeholderGeneric': 'Cuir tasc leis',
  'input.add': 'Cuir leis',

  // Todo item
  'todo.edit': "Cuir '{description}' in eagar",
  'todo.delete': "Scrios '{description}'",
  'todo.moveUp': "Bog '{description}' suas",
  'todo.moveDown': "Bog '{description}' síos",
  'todo.createdAtTime': 'curtha leis ag {time}',
  'todo.createdAtDate': 'curtha leis ar {date}',

  // Inline editor
  'editor.description': 'Cur síos',
  'editor.notes': 'Nótaí (roghnach)',
  'editor.notesPlaceholder': 'Cuir nóta leis',
  'editor.save': 'Sábháil',
  'editor.cancel': 'Cealaigh',

  // Undo toast
  'undo.deleted': "Scriosadh '{description}'",
  'undo.undo': 'Cealaigh',

  // States
  'state.loadingAria': 'Do thascanna á luchtú',
  'state.errorTitle': 'Níorbh fhéidir do thascanna a luchtú',
  'state.errorBody': 'Seiceáil do nasc, le do thoil, agus bain triail eile as.',
  'state.errorRetry': 'Bain triail eile as',
  'state.errorRetrying': 'Á thriail…',
  'state.emptyTitle': 'Níl aon tasc fós',
  'state.emptyBody': 'Cuir do chéad tasc leis sa bhosca thíos.',
  'state.emptyBodyForList': 'Níl aon tasc i {list} fós. Cuir ceann leis thíos.',
  'state.emptyBodyGeneric': 'Níl aon tasc fós. Cuir ceann leis thíos.',
  'state.noMatches': 'Níl aon tasc a chomhlíonann do scagairí.',
  'state.noCompletedYet': 'Níl aon rud críochnaithe fós. Cuir tic ar thasc le hé a fheiceáil anseo.',
  'state.resetFilters': 'Athshocraigh na scagairí',

  // List title
  'list.allTasksHeading': 'Gach tasc',
};

export const translations: Record<Language, Record<Key, string>> = { en, ga };

export type TranslationKey = Key;
