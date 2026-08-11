'use client';

// The media picker the editor's image/file fields open. Contract (fixed -
// FieldRenderer imports this blindly):
//   <MediaPicker open accept ('image'|'pdf') onClose onSelect(mediaRecord)>
// Same grid and upload as /admin/media, in select mode: clicking a tile or
// finishing an upload hands the full media record to `onSelect`.

import { Modal } from '../ui.jsx';
import MediaBrowser from './MediaBrowser.jsx';

export default function MediaPicker({ open, accept, onClose, onSelect }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={accept === 'pdf' ? 'Choose a document' : 'Choose an image'}
      size="xl"
    >
      {open && (
        <MediaBrowser
          mode="select"
          accept={accept === 'pdf' ? 'pdf' : 'image'}
          onPick={(media) => onSelect?.(media)}
        />
      )}
    </Modal>
  );
}
