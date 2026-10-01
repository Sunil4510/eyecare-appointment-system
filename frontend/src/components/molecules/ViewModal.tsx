/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Modal, Button } from "antd";
import type { FC, ReactNode } from "react";

interface ViewModalProps {
  title: string;
  isVisible: boolean;
  onClose: () => void;
  onButtonClick?: () => void;
  buttonText?: string;
  children: ReactNode;
  className?: { button?: string; modal?: string };
  footer?: ReactNode;
  width?: string | number;
}

export const ViewModal: FC<ViewModalProps> = ({
  title,
  isVisible,
  onClose,
  onButtonClick,
  buttonText,
  children,
  className,
  footer,
  width,
}) => {
  return (
    <>
      {onButtonClick && buttonText && (
        <Button
          className={`${className?.button} bg-transparent`}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      )}
      <Modal
        className={className?.modal}
        centered
        title={title}
        open={isVisible}
        onCancel={onClose}
        width={width}
        styles={{ mask: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
        footer={[footer]}
      >
        {children}
      </Modal>
    </>
  );
};
