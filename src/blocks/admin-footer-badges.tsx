import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parseFooterBadgeMarkup } from '@/features/footer-badges/markup';
import {
  MAX_FOOTER_BADGES,
  type FooterBadge,
} from '@/features/footer-badges/types';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { apiGet, apiPost } from '@/lib/api-client';
import { m } from '@/paraglide/messages.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const queryKey = ['admin-footer-badges'];

export function AdminFooterBadges() {
  const queryClient = useQueryClient();
  const {
    data: badges = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => apiGet<FooterBadge[]>('/api/admin/footer-badges'),
    retry: false,
  });

  const saveMutation = useMutation({
    mutationFn: (nextBadges: FooterBadge[]) =>
      apiPost<FooterBadge[]>('/api/admin/footer-badges', {
        badges: nextBadges,
      }),
    onSuccess: (savedBadges) => {
      queryClient.setQueryData(queryKey, savedBadges);
      queryClient.invalidateQueries({ queryKey: ['public-config'] });
      toast.success(m['admin.footer_badges.saved']());
    },
    onError: () => toast.error(m['admin.footer_badges.save_error']()),
  });

  const form = useForm({
    defaultValues: { markup: '' },
    validators: {
      onSubmit: z.object({
        markup: z.string().refine((value) => {
          try {
            const parsed = parseFooterBadgeMarkup(value);
            return badges.length + parsed.length <= MAX_FOOTER_BADGES;
          } catch {
            return false;
          }
        }, m['admin.footer_badges.invalid_code']()),
      }),
    },
    onSubmit: async ({ value }) => {
      if (isLoading || isError || saveMutation.isPending) return;
      try {
        await saveMutation.mutateAsync([
          ...badges,
          ...parseFooterBadgeMarkup(value.markup),
        ]);
        form.reset();
      } catch {
        // The mutation reports errors and keeps the draft available for retry.
      }
    },
  });

  function removeBadge(index: number) {
    saveMutation.mutate(badges.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {m['admin.footer_badges.title']()}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {m['admin.footer_badges.description']()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{m['admin.footer_badges.add_title']()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <form.Field name="markup">
              {(field) => {
                const inputError = field.state.meta.errors.length > 0;
                return (
                  <div className="space-y-2">
                    <label
                      htmlFor="footer-badge-markup"
                      className="text-sm font-medium"
                    >
                      {m['admin.footer_badges.code_label']()}
                    </label>
                    <Textarea
                      id="footer-badge-markup"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                      placeholder={m['admin.footer_badges.code_placeholder']()}
                      rows={6}
                      maxLength={20_000}
                      aria-invalid={inputError}
                      aria-describedby="footer-badge-help"
                      className="font-mono text-xs"
                      disabled={saveMutation.isPending || isLoading || isError}
                    />
                    <p
                      id="footer-badge-help"
                      className={
                        inputError
                          ? 'text-destructive text-sm'
                          : 'text-muted-foreground text-sm'
                      }
                    >
                      {inputError
                        ? m['admin.footer_badges.invalid_code']()
                        : m['admin.footer_badges.code_help']({
                            max: MAX_FOOTER_BADGES,
                          })}
                    </p>
                  </div>
                );
              }}
            </form.Field>
            <Button
              type="submit"
              disabled={saveMutation.isPending || isLoading || isError}
            >
              <Plus data-icon="inline-start" />
              {m['admin.footer_badges.add_button']()}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{m['admin.footer_badges.current_title']()}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">
              {m['admin.footer_badges.loading']()}
            </p>
          ) : isError ? (
            <div role="alert" className="space-y-3">
              <p className="text-destructive text-sm">
                {m['admin.footer_badges.load_error']()}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void refetch()}
              >
                {m['admin.footer_badges.retry']()}
              </Button>
            </div>
          ) : badges.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              {m['admin.footer_badges.empty']()}
            </p>
          ) : (
            <ul className="space-y-3">
              {badges.map((badge, index) => (
                <li
                  key={`${index}:${badge.href}:${badge.src}`}
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-2">
                    <div className="bg-foreground flex min-h-16 w-fit max-w-full items-center rounded-md p-3">
                      <img
                        src={badge.src}
                        alt={badge.alt}
                        width={badge.width ?? 250}
                        height={badge.height}
                        className="h-auto max-h-16 max-w-full"
                      />
                    </div>
                    <p className="text-muted-foreground truncate text-xs">
                      {badge.href}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={saveMutation.isPending || isError}
                    onClick={() => removeBadge(index)}
                    aria-label={m['admin.footer_badges.remove']()}
                  >
                    <Trash2 data-icon="inline-start" />
                    {m['admin.footer_badges.remove']()}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
