'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { InviteToken } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';

interface Props {
  invite: InviteToken;
}

function deriveStatus(invite: InviteToken): 'Pending' | 'Used' | 'Expired' {
  if (invite.status === 'Used') return 'Used';
  if (new Date(invite.expiresAt) < new Date()) return 'Expired';
  return 'Pending';
}

export function InviteRow({ invite }: Props) {
  const t = useTranslations('users.invites');
  const [copied, setCopied] = useState(false);

  const status = deriveStatus(invite);

  const handleCopy = async () => {
    const url = `${window.location.origin}/invite/${invite.token}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusBadge = {
    Pending: (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        {t('inviteStatus.Pending')}
      </span>
    ),
    Used: (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
        {t('inviteStatus.Used')}
      </span>
    ),
    Expired: (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
        {t('inviteStatus.Expired')}
      </span>
    ),
  }[status];

  return (
    <tr className={`border-b last:border-0 ${status !== 'Pending' ? 'opacity-60' : 'hover:bg-muted/30'}`}>
      <td className="px-4 py-3">{statusBadge}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {new Date(invite.expiresAt).toLocaleString()}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {new Date(invite.createdAt).toLocaleString()}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {invite.usedAt ? new Date(invite.usedAt).toLocaleString() : '—'}
      </td>
      <td className="px-4 py-3 text-right">
        {status === 'Pending' && (
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {t('copyLink')}
          </Button>
        )}
      </td>
    </tr>
  );
}
