import {
  Button,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalWrapper,
} from '@ogcio/design-system-react';

import { useT } from '../../i18n/I18nContext';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const t = useT();

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onCancel}
      position="center"
      size="sm"
      closeButtonLabel={t('sidebar.cancel')}
    >
      <ModalTitle>{title}</ModalTitle>
      <ModalBody>
        <p className="text-base text-gray-800">{body}</p>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('sidebar.cancel')}
        </Button>
        <Button type="button" variant="primary" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </ModalFooter>
    </ModalWrapper>
  );
}
