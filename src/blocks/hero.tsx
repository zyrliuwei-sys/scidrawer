import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';

import { Link, useRouter } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { Button } from '@/components/ui/button';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { Textarea } from '@/components/ui/textarea';

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
          className="text-center text-2xl font-bold tracking-tight md:text-left md:text-4xl lg:text-6xl"
        >
          {m['landing.hero.headline']()}
        </h1>

        <p className="text-muted-foreground max-w-xl py-8 text-center text-base md:text-left md:text-lg">
          {m['landing.hero.subheadline']()}
        </p>
        <form
          className="border-border/80 bg-background/90 mb-6 w-full max-w-2xl rounded-2xl border p-2 shadow-[0_16px_45px_-26px_rgba(15,23,42,0.45)] backdrop-blur-sm"
          onSubmit={startGeneration}
        >
          <label className="sr-only" htmlFor="research-figure-brief">
            {m['landing.hero.prompt_label']()}
          </label>
          <Textarea
            id="research-figure-brief"
            className="min-h-20 resize-none border-0 bg-transparent px-3 py-2.5 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0"
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={m['landing.hero.prompt_placeholder']()}
            required
            value={prompt}
          />
          <div className="border-border/70 flex flex-col gap-2 border-t px-1 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground px-2 text-xs">
              {m['landing.hero.prompt_hint']()}
            </p>
            <Button
              className="h-9 px-4"
              disabled={prompt.trim().length < 3}
              type="submit"
            >
              {m['landing.hero.prompt_submit']()}
            </Button>
          </div>
        </form>

        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <HoverBorderGradient
            as={Link}
            href="/generate"
            containerClassName="rounded-sm"
            className="bg-foreground text-background rounded-sm px-4 py-2 text-sm font-medium"
          >
            {m['landing.hero.cta']()}
          </HoverBorderGradient>
          <Link
            href="/#features"
            className="text-foreground rounded-sm bg-transparent px-4 py-2"
          >
            {m['landing.hero.secondary']()}
          </Link>
        </div>
        <LandingImages />
      </div>
    </section>
  );
}

export function LandingImages() {
  return (
    <div className="relative min-h-40 w-full pt-20 perspective-distant sm:min-h-80 md:min-h-100 lg:min-h-200">
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
