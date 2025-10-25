import { db } from '@/lib/db';
import { email } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { Mail, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function AdminEmailsPage() {
  // Get all emails
  const emails = await db
    .select()
    .from(email)
    .orderBy(desc(email.createdAt))
    .limit(100);

  const statusIcons = {
    sent: CheckCircle2,
    failed: XCircle,
    queued: Clock,
  };

  const statusColors = {
    sent: 'text-green-600 bg-green-50',
    failed: 'text-red-600 bg-red-50',
    queued: 'text-yellow-600 bg-yellow-50',
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">Email Logs</h2>
          <p className="text-muted-foreground">
            Last 100 emails sent from the system
          </p>
        </div>
      </div>

      {/* Emails Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {emails.map((emailData) => {
                const StatusIcon = statusIcons[emailData.status];
                const statusColor = statusColors[emailData.status];

                return (
                  <tr key={emailData.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium truncate max-w-xs">
                          {emailData.to}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm truncate max-w-md">{emailData.subject}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-xs capitalize">
                        {emailData.type.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${statusColor}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span className="text-xs font-medium capitalize">{emailData.status}</span>
                      </div>
                      {emailData.status === 'failed' && emailData.error && (
                        <p className="text-xs text-destructive mt-1 truncate max-w-xs">
                          {emailData.error}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium">{formatTimeAgo(emailData.createdAt)}</p>
                        {emailData.sentAt && (
                          <p className="text-xs text-muted-foreground">
                            {formatDate(emailData.sentAt)}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {emails.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No emails found</p>
          </div>
        )}
      </div>
    </div>
  );
}
