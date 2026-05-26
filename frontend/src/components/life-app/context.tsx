'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DEFAULT_FAMILY } from './data';

export type TabId = 'home' | 'board' | 'shop' | 'services' | 'productivity' | 'circles' | 'album';
export type SheetKind = 'chat' | 'search' | 'notifications' | 'profile' | 'rewards' | 'pay' | 'sign' | '2fa' | 'access-log';
export type StackKind = 'event-detail' | 'circle-detail' | 'personal-info' | 'chat-thread' | 'my-people' | 'subscriptions' | 'finance' | 'sharehouse';

interface TodoItem { id: number; text: string; priority: string | null; done: boolean; }
interface Todos { home: TodoItem[]; work: TodoItem[]; shopping: TodoItem[]; }

interface AppState {
  onboarded: boolean;
  tab: TabId;
  stack: { kind: StackKind; props: Record<string, unknown> }[];
  sheet: { kind: SheetKind; props: Record<string, unknown> } | null;
  family: typeof DEFAULT_FAMILY;
  rewards: number;
  paid: boolean;
  signed: boolean;
  todos: Todos;
  activeList: 'home' | 'work' | 'shopping';
}

interface AppCtxValue extends AppState {
  setBy: (patch: Partial<AppState> | ((s: AppState) => AppState)) => void;
  pushScreen: (kind: StackKind, props?: Record<string, unknown>) => void;
  popScreen: () => void;
  openSheet: (kind: SheetKind, props?: Record<string, unknown>) => void;
  closeSheet: () => void;
  setTab: (tab: TabId) => void;
  completeOnboarding: () => void;
  restartOnboarding: () => void;
  toggleTodo: (list: string, id: number) => void;
  addTodo: (list: string, text: string) => void;
}

const AppCtx = createContext<AppCtxValue | null>(null);

function makeInitial(): AppState {
  let onboarded = true;
  try { onboarded = localStorage.getItem('life_onboarded') === '1'; } catch (e) { void e; }
  return {
    onboarded,
    tab: 'home',
    stack: [],
    sheet: null,
    family: DEFAULT_FAMILY,
    rewards: 1247,
    paid: false,
    signed: false,
    todos: {
      home: [
        { id: 1, text: 'Pick up dry cleaning',           priority: 'high', done: false },
        { id: 2, text: 'Submit school permission forms', priority: 'high', done: false },
        { id: 3, text: 'Buy groceries for the week',     priority: null,   done: true  },
        { id: 4, text: 'Schedule car maintenance',       priority: null,   done: false },
        { id: 5, text: 'Return library books',           priority: null,   done: true  },
      ],
      work: [
        { id: 11, text: 'Q3 budget review',            priority: 'high', done: false },
        { id: 12, text: 'Reply to board email',         priority: null,   done: false },
        { id: 13, text: 'Prep slides for Friday demo',  priority: 'high', done: false },
      ],
      shopping: [
        { id: 21, text: 'Milk, bread, eggs',            priority: null,   done: false },
        { id: 22, text: "Sarah's ballet shoes",         priority: 'high', done: false },
        { id: 23, text: 'Birthday card for Margaret',   priority: null,   done: false },
      ],
    },
    activeList: 'home',
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(makeInitial);

  const setBy = useCallback((patch: Partial<AppState> | ((s: AppState) => AppState)) => {
    setState(s => typeof patch === 'function' ? patch(s) : ({ ...s, ...patch }));
  }, []);

  const pushScreen = (kind: StackKind, props: Record<string, unknown> = {}) =>
    setBy(s => ({ ...s, stack: [...s.stack, { kind, props }] }));
  const popScreen  = () => setBy(s => ({ ...s, stack: s.stack.slice(0, -1) }));
  const openSheet  = (kind: SheetKind, props: Record<string, unknown> = {}) =>
    setBy({ sheet: { kind, props } } as Partial<AppState>);
  const closeSheet = () => setBy({ sheet: null } as Partial<AppState>);
  const setTab     = (tab: TabId) => setBy({ tab, stack: [] } as Partial<AppState>);

  const completeOnboarding = () => {
    try { localStorage.setItem('life_onboarded', '1'); } catch (e) { void e; }
    setBy({ onboarded: true } as Partial<AppState>);
  };
  const restartOnboarding = () => {
    try { localStorage.removeItem('life_onboarded'); } catch (e) { void e; }
    setBy({ onboarded: false } as Partial<AppState>);
  };

  const toggleTodo = (list: string, id: number) => setBy(s => ({
    ...s,
    todos: {
      ...s.todos,
      [list]: (s.todos as unknown as Record<string, TodoItem[]>)[list].map((t: TodoItem) =>
        t.id === id ? { ...t, done: !t.done } : t
      ),
    },
  }));

  const addTodo = (list: string, text: string) => setBy(s => ({
    ...s,
    todos: {
      ...s.todos,
      [list]: [...(s.todos as unknown as Record<string, TodoItem[]>)[list], { id: Date.now(), text, priority: null, done: false }],
    },
  }));

  const value: AppCtxValue = {
    ...state, setBy,
    pushScreen, popScreen, openSheet, closeSheet, setTab,
    completeOnboarding, restartOnboarding,
    toggleTodo, addTodo,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
