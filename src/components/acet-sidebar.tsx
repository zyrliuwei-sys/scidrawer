'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type MouseEventHandler,
} from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error('useSidebar must be used within <Sidebar>.');
  }
  return ctx;
}

const OPEN_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

export function Sidebar({
  open: openProp,
  setOpen: setOpenProp,
  defaultOpen = true,
  children,
  className,
}: {
  open?: boolean;
  setOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const [openState, setOpenState] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;
  const setOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      if (isControlled) {
        setOpenProp?.(value);
        return;
      }
      setOpenState((prev) =>
        typeof value === 'function' ? value(prev) : value
      );
    },
    [isControlled, setOpenProp]
  );
  const toggle = useCallback(() => setOpen((prev) => !prev), [setOpen]);

  const value = useMemo(
    () => ({ open, setOpen, toggle }),
    [open, setOpen, toggle]
  );

  return (
    <SidebarContext.Provider value={value}>
      {/* `shrink-0` so flex parents don't collapse main to 0 when the
          sidebar's inner content is narrower than its container. Width is
          driven by the motion-animated inner div, not by `w-full`. */}
      <div className={cn('flex h-full shrink-0 flex-row', className)}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function SidebarBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, toggle } = useSidebar();
  return (
    <motion.div
      initial={false}
      animate={{ width: open ? OPEN_WIDTH : COLLAPSED_WIDTH }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'relative flex h-full min-h-[100dvh] shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white',
        className
      )}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        className={cn(
          'absolute top-6 z-20 flex size-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50',
          open ? 'right-3' : 'left-1/2 -translate-x-1/2'
        )}
      >
        {open ? (
          <PanelLeftClose className="size-3.5" />
        ) : (
          <PanelLeftOpen className="size-3.5" />
        )}
      </button>
      <div className="flex h-full flex-col py-4">{children}</div>
    </motion.div>
  );
}

export function SidebarLink({
  link,
  active = false,
  onClick,
}: {
  link: {
    label: string;
    href: string;
    icon: React.ReactNode;
  };
  active?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const { open } = useSidebar();
  return (
    <a
      href={link.href}
      onClick={onClick}
      className={cn(
        'group mx-2 flex h-10 items-center gap-3 overflow-hidden rounded-md px-3 text-sm transition-colors',
        active
          ? 'bg-slate-900 text-white'
          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      <span className="flex size-5 shrink-0 items-center justify-center">
        {link.icon}
      </span>
      <AnimatePresence initial={false}>
        {open && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap"
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
}

// Convenience subcomponents used by the Aceternity demo — kept here so the
// shape the user pasted stays close to one-to-one.
export function SidebarLogo({
  logo,
  icon,
  href = '/',
}: {
  logo: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
}) {
  const { open } = useSidebar();
  return (
    <a
      href={href}
      className="mx-2 mb-4 flex h-10 items-center gap-2 overflow-hidden rounded-md px-3"
    >
      {icon && (
        <span className="flex size-7 shrink-0 items-center justify-center">
          {icon}
        </span>
      )}
      {open && logo && (
        <span className="text-sm font-semibold tracking-tight whitespace-nowrap text-slate-900">
          {logo}
        </span>
      )}
    </a>
  );
}
