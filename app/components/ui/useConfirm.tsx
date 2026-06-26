"use client";

import { useCallback, useRef, useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmLabel?: string;
  tone?: "primary" | "danger";
}

/**
 * Promise-based replacement for window.confirm(). Usage:
 *
 *   const { confirm, dialog } = useConfirm();
 *   ...
 *   if (await confirm({ title: "Delete this customer?", tone: "danger" })) { ... }
 *   ...
 *   return <>{dialog}{...rest of page}</>
 */
export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(value: boolean) => void>();

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    resolver.current?.(true);
    setOptions(null);
  };

  const handleCancel = () => {
    resolver.current?.(false);
    setOptions(null);
  };

  const dialog = (
    <ConfirmDialog
      open={!!options}
      title={options?.title}
      description={options?.description}
      confirmLabel={options?.confirmLabel}
      tone={options?.tone}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, dialog };
}
