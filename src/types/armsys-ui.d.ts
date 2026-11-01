/*! Armsys UI 2 — TypeScript declarations */

export type AuiTone = 'accent' | 'success' | 'info' | 'warning' | 'danger' | 'purple' | 'pink' | 'orange' | 'yellow' | 'teal' | 'neutral';
export type AuiPlacement = 'bottom-start' | 'bottom-end' | 'bottom-center' | 'top-start' | 'top-end' | 'top-center' | 'right-start' | 'right-end' | 'left-start' | 'left-end';
export type AuiToastPosition = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-center';
export type ElementRef = string | Element;

export interface ArmsysUIConfig {
  /** Initialise on DOMContentLoaded. Default true. */
  autoInit?: boolean;
  /** Initialise markup added later (Vue, Electron, HTMX, Blazor). Default true. */
  observe?: boolean;
  /** Inject the SVG icon sprite (#aui-i-*). Default true. */
  sprite?: boolean;
  /** Lazy-load highlight.js for <pre><code class="language-*">. Default true. */
  highlight?: boolean;
  highlightUrl?: string;
  /** Template with {lang}, used for languages missing from the core bundle (e.g. dart). */
  highlightLanguageUrl?: string;
  /** Menus and modals present as bottom sheets at or below this width (px). Default 640. */
  sheetBreakpoint?: number;
  toastPosition?: AuiToastPosition;
  /** Default 4500 ms. 0 = sticky. */
  toastTimeout?: number;
  /** Command palette hotkey, e.g. 'mod+k' (mod = Ctrl or Cmd). */
  commandHotkey?: string;
  storagePrefix?: string;
}

export interface ToastOptions {
  title?: string;
  message?: string;
  variant?: AuiTone;
  /** Icon name from the sprite (without the aui-i- prefix). */
  icon?: string;
  position?: AuiToastPosition;
  /** ms; 0 keeps it until dismissed. */
  timeout?: number | null;
  loading?: boolean;
  progress?: boolean;
  action?: { label: string; onClick?: () => void };
}
export interface ToastElement extends HTMLDivElement {
  /** Replace the toast with new options (used by toast.promise). */
  update(options: ToastOptions): ToastElement;
}
export interface ToastFn {
  (options: ToastOptions | string): ToastElement;
  promise<T>(promise: Promise<T>, messages: { loading?: string; success?: string | ((value: T) => string); error?: string | ((err: unknown) => string); position?: AuiToastPosition }): Promise<T>;
}

export interface DialogOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: AuiTone;
  /** Icon name, or false for none. */
  icon?: string | false;
  className?: string;
}
export interface PromptOptions extends DialogOptions {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  required?: boolean;
}

export interface ArmsysUIApi {
  readonly version: string;
  readonly config: Required<ArmsysUIConfig>;
  readonly icons: Record<string, string>;
  addIcons(map: Record<string, string>): void;
  /** Returns `<svg class="aui-icon"><use href="#aui-i-name"/></svg>` markup. */
  icon(name: string, className?: string): string;
  /** Initialise behaviours inside a root (defaults to document). Safe to call repeatedly. */
  init(root?: Element | Document): void;

  openModal(ref: ElementRef, options?: { returnFocus?: HTMLElement }): HTMLDialogElement | null;
  closeModal(ref?: ElementRef, value?: string): void;
  open: ArmsysUIApi['openModal'];
  close: ArmsysUIApi['closeModal'];
  confirm(options: DialogOptions | string): Promise<boolean>;
  prompt(options: PromptOptions | string): Promise<string | null>;
  alert(options: DialogOptions | string): Promise<void>;
  openCommand(ref?: ElementRef): void;

  openDropdown(ref: ElementRef): void;
  closeDropdown(ref: ElementRef): void;
  closeAll(): void;
  /** Position a floating element next to an anchor (flip + shift). */
  position(anchor: Element | { x: number; y: number }, floating: HTMLElement, placement?: AuiPlacement, offset?: number): { side: string; align: string; left: number; top: number };

  toast: ToastFn;
  dismiss(el: Element, instant?: boolean): void;

  selectTab(tab: Element, focus?: boolean): void;
  copy(text: string): Promise<void>;
  setTheme(theme: 'light' | 'dark' | 'system', scope?: Element): void;
  getTheme(): 'light' | 'dark';
  /** Rebuild an enhanced <select data-aui-select> after changing its options. */
  refreshSelect(ref: ElementRef): void;
  highlight(ref?: ElementRef): Promise<void>;
  addTag(ref: ElementRef, value: string): void;

  /* Workbench (3.0) */
  /** Close a tab-strip tab (fires cancelable `aui:tab-close`). */
  closeTab(ref: ElementRef): void;
  treeSelect(ref: ElementRef): void;
  treeToggle(ref: ElementRef, open?: boolean): void;
  openDatepicker(ref: ElementRef): void;
  closeDatepicker(refocus?: boolean): void;
  /** Set a `[data-aui-calendar]` value (ISO string or Date, null clears). */
  setDate(ref: ElementRef, value: string | Date | null): void;
  formatDate(date: Date | null, format?: string): string;
  parseDate(value: string, format?: string): Date | null;
  /** Trigger a composer send (fires cancelable `aui:send`). */
  send(ref: ElementRef): void;
  scrollChat(ref: ElementRef, smooth?: boolean): void;
}

/** Custom events (all bubble, prefixed `aui:`). */
export interface ArmsysUIEventMap {
  'aui:open': CustomEvent<{ trigger?: Element }>;
  'aui:opened': CustomEvent;
  'aui:close': CustomEvent<{ value?: string }>;
  'aui:closed': CustomEvent<{ value?: string }>;
  'aui:dropdown-open': CustomEvent;
  'aui:dropdown-opened': CustomEvent;
  'aui:dropdown-closed': CustomEvent;
  'aui:select': CustomEvent<{ value: string | null; text: string }>;
  'aui:menu-check': CustomEvent<{ checked: boolean; value: string | null }>;
  'aui:complete': CustomEvent<{ value: string }>;
  'aui:change': CustomEvent<{ value: unknown }>;
  'aui:files': CustomEvent<{ files: File[] }>;
  'aui:tab': CustomEvent<{ tab: string }>;
  'aui:choice': CustomEvent<{ group: string; value: string }>;
  'aui:copied': CustomEvent<{ text: string }>;
  'aui:selection': CustomEvent<{ count: number; rows: HTMLTableRowElement[] }>;
  'aui:sort': CustomEvent<{ column: number; direction: 'ascending' | 'descending' }>;
  'aui:theme': CustomEvent<{ theme: 'light' | 'dark'; preference: string }>;
  'aui:sidebar': CustomEvent<{ collapsed: boolean }>;
  'aui:nav-open': CustomEvent;
  'aui:nav-close': CustomEvent;
  'aui:tab-close': CustomEvent<{ tab: string | null }>;
  'aui:tab-closed': CustomEvent<{ tab: string | null }>;
  'aui:tab-add': CustomEvent;
  'aui:tree-select': CustomEvent<{ item: HTMLLIElement; value: string | null }>;
  'aui:tree-toggle': CustomEvent<{ item: HTMLLIElement; expanded: boolean }>;
  'aui:tree-activate': CustomEvent<{ item: HTMLLIElement; value: string | null }>;
  'aui:resize': CustomEvent<{ pane: HTMLElement; size: number | null }>;
  'aui:date': CustomEvent<{ value: string; date: Date | null }>;
  'aui:send': CustomEvent<{ text: string; input: HTMLTextAreaElement | HTMLInputElement }>;
  'aui:send-empty': CustomEvent;
  'aui:convo': CustomEvent<{ value: string | null }>;
  'aui:toggle': CustomEvent<{ pressed: boolean }>;
  'aui:rail': CustomEvent<{ value: string | null }>;
  'aui:original': CustomEvent<{ shown: boolean }>;
  'aui:chat-option': CustomEvent<{ option: string; on: boolean }>;
}

declare const ArmsysUI: ArmsysUIApi;
export default ArmsysUI;
export { ArmsysUI };
export const init: ArmsysUIApi['init'];
export const openModal: ArmsysUIApi['openModal'];
export const closeModal: ArmsysUIApi['closeModal'];
export const confirm: ArmsysUIApi['confirm'];
export const prompt: ArmsysUIApi['prompt'];
export const alert: ArmsysUIApi['alert'];
export const toast: ArmsysUIApi['toast'];
export const setTheme: ArmsysUIApi['setTheme'];
export const getTheme: ArmsysUIApi['getTheme'];
export const openCommand: ArmsysUIApi['openCommand'];
export const openDropdown: ArmsysUIApi['openDropdown'];
export const closeDropdown: ArmsysUIApi['closeDropdown'];
export const closeAll: ArmsysUIApi['closeAll'];
export const selectTab: ArmsysUIApi['selectTab'];
export const copy: ArmsysUIApi['copy'];
export const refreshSelect: ArmsysUIApi['refreshSelect'];
export const highlight: ArmsysUIApi['highlight'];
export const addIcons: ArmsysUIApi['addIcons'];
export const icon: ArmsysUIApi['icon'];
export const position: ArmsysUIApi['position'];

declare global {
  interface Window { ArmsysUI: ArmsysUIApi; ArmsysUIConfig?: ArmsysUIConfig; }
  interface HTMLElementEventMap extends ArmsysUIEventMap {}
}
export const closeTab: ArmsysUIApi['closeTab'];
export const treeSelect: ArmsysUIApi['treeSelect'];
export const treeToggle: ArmsysUIApi['treeToggle'];
export const openDatepicker: ArmsysUIApi['openDatepicker'];
export const closeDatepicker: ArmsysUIApi['closeDatepicker'];
export const setDate: ArmsysUIApi['setDate'];
export const formatDate: ArmsysUIApi['formatDate'];
export const parseDate: ArmsysUIApi['parseDate'];
export const send: ArmsysUIApi['send'];
export const scrollChat: ArmsysUIApi['scrollChat'];
