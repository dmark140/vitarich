"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// -------- Types --------
export type ConfirmOptions = {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    preventDismiss?: boolean;
};

export type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>;

// -------- Context --------
const ConfirmContext = createContext<ConfirmFn | null>(null);

// -------- Provider --------
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
    type Request = { options: ConfirmOptions | undefined; resolve: (v: boolean) => void };

    const queueRef = useRef<Request[]>([]);
    const [current, setCurrent] = useState<Request | null>(null);
    const [open, setOpen] = useState(false);

    const flushNext = useCallback(() => {
        if (current || queueRef.current.length === 0) return;
        const next = queueRef.current.shift()!;
        setCurrent(next);
        setOpen(true);
    }, [current]);

    const confirm = useCallback<ConfirmFn>((options) => {
        return new Promise<boolean>((resolve) => {
            queueRef.current.push({ options, resolve });
            // Start the queue if idle
            if (!current) {
                flushNext();
            }
        });
    }, [current, flushNext]);

    const resolveAndClose = useCallback((value: boolean) => {
        if (!current) return;
        // Resolve the awaiting promise
        current.resolve(value);
        // Close and clear current, then move to next in queue (if any)
        setOpen(false);
        setCurrent(null);
        // Give React a tick before flushing next (prevents double renders)
        setTimeout(() => flushNext(), 0);
    }, [current, flushNext]);

    const ctxValue = useMemo(() => confirm, [confirm]);

    const opts = current?.options ?? {};
    const {
        title = "Are you absolutely sure?",
        description = "This action cannot be undone. This will permanently add this series on our server.",
        confirmText = "Save",
        cancelText = "No, keep it",
        preventDismiss = false,
    } = opts;

    return (
        <ConfirmContext.Provider value={ctxValue}>
            {children}

            <AlertDialog open={open} onOpenChange={(v: any) => {
                // If the consumer tries to close by clicking outside and preventDismiss is true, keep it open
                if (!v && preventDismiss) return;
                if (!v) resolveAndClose(false);
            }}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        {description ? (
                            <AlertDialogDescription>{description}</AlertDialogDescription>
                        ) : null}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => resolveAndClose(false)}>
                            {cancelText}
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-secondary text-secondary-foreground" onClick={() => resolveAndClose(true)}>
                            {confirmText}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ConfirmContext.Provider>
    );
}

// -------- Hook --------
export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm must be used within a ConfirmProvider");
    return ctx;
}

export function withConfirmProvider<P extends object>(
    Component: React.ComponentType<P>
) {
    return function Wrapped(props: P) {
        return (
            <ConfirmProvider>
                <Component {...(props as P)} />
            </ConfirmProvider>
        );
    };
}

