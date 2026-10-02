import { useState, type FormEvent } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

import { useRouter } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Hero() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');

  const startGeneration = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length < 3) return;
    router.push(`/generate?prompt=${encodeURIComponent(trimmedPrompt)}`);
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="w-full overflow-hidden pt-10 md:pt-20 lg:pt-32"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h1
          id="hero-title"
          className="text-left text-2xl font-bold tracking-tight md:text-4xl lg:text-6xl"
        >
          {m['landing.hero.headline']()}
        </h1>

        <p className="text-muted-foreground max-w-xl py-8 text-left text-base md:text-lg">
          {m['landing.hero.subheadline']()}
        </p>
        <div className="w-full max-w-[620px]">
          <form onSubmit={startGeneration}>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor="research-figure-brief">
                {m['landing.hero.prompt_label']()}
              </label>
              <Input
                id="research-figure-brief"
                aria-label={m['landing.hero.prompt_label']()}
                className="border-border bg-card placeholder:text-muted-foreground hover:border-foreground/25 focus-visible:border-primary h-[62px] rounded-[18px] px-6 text-base shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-px hover:shadow-[0_16px_30px_rgba(15,23,42,0.12)] focus-visible:-translate-y-px focus-visible:shadow-[0_18px_34px_rgba(15,23,42,0.14)] focus-visible:ring-0 dark:shadow-black/25"
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={m['landing.hero.prompt_placeholder']()}
                required
                value={prompt}
              />
              <Button
                className="h-[62px] w-full shrink-0 rounded-[18px] px-8 text-base font-semibold shadow-[0_14px_28px_rgba(15,23,42,0.2)] transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-px hover:shadow-[0_18px_32px_rgba(15,23,42,0.24)] active:translate-y-0 sm:w-auto"
                disabled={prompt.trim().length < 3}
                type="submit"
              >
                {m['landing.hero.prompt_submit']()}
              </Button>
            </div>
          </form>

          <p className="text-muted-foreground mt-6 inline-flex items-center gap-2 text-sm font-medium">
            <Sparkles className="text-primary size-4" aria-hidden="true" />
            {m['landing.hero.prompt_hint']()}
          </p>
        </div>
        <LandingImages />
      </div>
    </section>
  );
}

export function LandingImages() {
  return (
    <div className="relative mt-20 min-h-40 w-full pt-20 perspective-distant sm:min-h-80 md:mt-24 md:min-h-100 lg:min-h-200">
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="shadow-2xl perspective-[4000px]"
      >
        <img
          src="/imgs/hero/therapeutic-response.png"
          alt="AI-generated therapeutic response scientific figure"
          height={1080}
          width={1920}
          className={cn(
            'absolute inset-0 rounded-lg mask-r-from-20% mask-b-from-20% shadow-xl'
          )}
          style={{
            transform: 'rotateY(20deg) rotateX(40deg) rotateZ(-20deg)',
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="translate-x-20 -translate-y-10 perspective-[4000px] md:-translate-y-20 lg:-translate-y-40"
      >
        <img
          src="/imgs/hero/mechanism-analysis.png"
          alt="AI-generated mechanism analysis scientific figure"
          height={1080}
          width={1920}
          className={cn(
            'absolute inset-0 -translate-x-10 rounded-lg mask-r-from-50% mask-b-from-50% shadow-xl'
          )}
          style={{
            transform: 'rotateY(20deg) rotateX(40deg) rotateZ(-20deg)',
          }}
        />
      </motion.div>
    </div>
  );
}
