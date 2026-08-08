import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { tDynamic } from '@/core/i18n/dynamic';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';

/**
 * Shared with the homepage FAQPage JSON-LD (`src/routes/index.tsx`) so the
 * structured data and the visible accordion never drift apart — Google flags
 * FAQ markup that doesn't appear on the page.
 */
export const FAQ_KEYS = [
  'submit',
  'tool',
  'formats',
  'sketch',
  'style',
  'accuracy',
  'editing',
  'rights',
] as const;

export function FAQ() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="px-4 py-12 sm:py-16">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-8 md:px-8 md:py-12">
        <h2 className="text-center text-4xl font-medium tracking-tight text-neutral-600 md:text-5xl dark:text-neutral-50">
          {m['landing.faq.title']()}
        </h2>
        <p className="mx-auto max-w-lg text-center text-base text-neutral-600 dark:text-neutral-50">
          {m['landing.faq.description']()}
        </p>
        <div className="mx-auto mt-6 w-full max-w-3xl">
          {FAQ_KEYS.map((key) => (
            <FAQItem
              key={key}
              id={key}
              question={tDynamic(`landing.faq.${key}.question`)}
              answer={tDynamic(`landing.faq.${key}.answer`)}
              open={open}
              setOpen={setOpen}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQItem = ({
  id,
  question,
  answer,
  setOpen,
  open,
}: {
  id: string;
  question: string;
  answer: string;
  open: string | null;
  setOpen: (open: string | null) => void;
}) => {
  const isOpen = open === id;

  return (
    <div
      className="mb-4 w-full cursor-pointer rounded-lg bg-white p-4 shadow-[0_4px_24px_rgba(30,38,47,0.08)] dark:bg-neutral-900"
      onClick={() => {
        if (isOpen) {
          setOpen(null);
        } else {
          setOpen(id);
        }
      }}
    >
      <div className="flex items-start">
        <div className="relative mt-1 mr-4 h-6 w-6 shrink-0">
          <ChevronUp
            className={cn(
              'absolute inset-0 h-6 w-6 transform text-neutral-700 transition-all duration-200 dark:text-neutral-200',
              isOpen && 'scale-0 rotate-90'
            )}
          />
          <ChevronDown
            className={cn(
              'absolute inset-0 h-6 w-6 scale-0 rotate-90 transform text-neutral-700 transition-all duration-200 dark:text-neutral-200',
              isOpen && 'scale-100 rotate-0'
            )}
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-200">
            {question}
          </h3>
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="overflow-hidden text-neutral-500 dark:text-neutral-400"
              >
                {answer.split('').map((char, index) => (
                  <motion.span
                    initial={{ opacity: 0, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.2,
                      ease: 'easeOut',
                      delay: index * 0.005,
                    }}
                    key={index}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
