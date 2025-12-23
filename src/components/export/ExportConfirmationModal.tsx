'use client';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { UsageStatus } from '@/types/usage';

interface ExportConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  usage: UsageStatus;
}

export default function ExportConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  usage,
}: ExportConfirmationModalProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const isLastExport = usage.video_count + 1 >= usage.limit;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Confirm Export">
      <div className="space-y-4">
        {/* Warning Message */}
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <p className="text-sm text-foreground">
            This export will count against your monthly usage limit.
          </p>
        </div>

        {/* Usage Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Credits Used:</span>
            <span className="text-lg font-semibold text-foreground">
              {usage.video_count}/{usage.limit}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Resets:</span>
            <span className="text-sm font-medium text-foreground">
              {formatDate(usage.next_reset_date)}
            </span>
          </div>
        </div>

        {/* Warning if approaching limit */}
        {isLastExport && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">
              This is your last export for this month!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Consider upgrading to Pro for unlimited exports.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="flex-1">
            Confirm Export
          </Button>
        </div>
      </div>
    </Modal>
  );
}
