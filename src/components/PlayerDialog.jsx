'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

const PlayerDialog = ({ isOpen, onClose, imgSrc, station }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {!imgSrc ? (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        ) : (
          <img src={imgSrc} alt={station?.title} className="w-full rounded-lg object-cover" />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;
