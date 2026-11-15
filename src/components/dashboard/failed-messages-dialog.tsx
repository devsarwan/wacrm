'use client';

import Link from 'next/link';
import { useFormatter, useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { FailedMessage } from '@/lib/dashboard/overview';

export function FailedMessagesDialog({
  open,
  onOpenChange,
  messages,
  total,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: FailedMessage[];
  total: number;
}) {
  const t = useTranslations('Dashboard.overview.failedDialog');
  const format = useFormatter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        {messages.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            {t('empty')}
          </p>
        ) : (
          <ul className="divide-border -mx-1 max-h-[60vh] divide-y overflow-y-auto">
            {messages.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/inbox?c=${m.conversationId}`}
                  onClick={() => onOpenChange(false)}
                  className="hover:bg-muted/50 focus-visible:ring-ring block rounded-lg px-1 py-2.5 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-foreground truncate text-sm font-medium">
                      {m.contactName || m.contactPhone || t('unknownContact')}
                    </span>
                    <time
                      className="text-muted-foreground shrink-0 text-xs tabular-nums"
                      dateTime={m.at}
                    >
                      {format.dateTime(new Date(m.at), {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                  <p className="text-status-critical mt-0.5 text-xs">
                    {m.errorTitle
                      ? m.errorCode
                        ? t('reasonWithCode', {
                            reason: m.errorTitle,
                            code: m.errorCode,
                          })
                        : m.errorTitle
                      : t('unknownReason')}
                  </p>
                  {m.preview ? (
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                      {m.preview}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {total > messages.length ? (
          <p className="text-muted-foreground text-xs">
            {t('showingLatest', { shown: messages.length, total })}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
