"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type CatalogSearchBarProps = {
  placeholder: string;
  clearLabel: string;
  /** Shown as aria-label / title on the inline loading spinner. */
  loadingLabel?: string;
  paramName?: string;
  /** Typing applies search after this delay. Pass `0` to disable debounced submit (Enter/clear still work). */
  autoSubmitDebounceMs?: number;
  showLoadingState?: boolean;
  className?: string;
};

const DEFAULT_DEBOUNCE_MS = 350;

export function CatalogSearchBar({
  placeholder,
  clearLabel,
  loadingLabel,
  paramName = "search",
  autoSubmitDebounceMs = DEFAULT_DEBOUNCE_MS,
  showLoadingState = true,
  className,
}: CatalogSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentValue = searchParams.get(paramName) ?? "";
  const [value, setValue] = useState(currentValue);
  const autoSubmitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  const canClear = useMemo(
    () => currentValue.length > 0 || value.length > 0,
    [currentValue, value]
  );

  const clearPendingAutoSubmit = useCallback(() => {
    if (!autoSubmitTimeoutRef.current) return;
    clearTimeout(autoSubmitTimeoutRef.current);
    autoSubmitTimeoutRef.current = null;
  }, []);

  const applyQuery = useCallback((nextValue: string) => {
    const p = new URLSearchParams(searchParams.toString());
    const trimmed = nextValue.trim();
    if (trimmed.length > 0) {
      p.set(paramName, trimmed);
      p.set("page", "1");
    } else {
      p.delete(paramName);
      p.delete("page");
    }
    const q = p.toString();
    if (q === searchParams.toString()) {
      return;
    }
    startTransition(() => {
      router.push(q ? `${pathname}?${q}` : pathname);
    });
  }, [paramName, pathname, router, searchParams, startTransition]);

  useEffect(() => {
    if (autoSubmitDebounceMs <= 0) {
      return;
    }
    const trimmedCurrent = currentValue.trim();
    const trimmedNext = value.trim();
    if (trimmedCurrent === trimmedNext) {
      clearPendingAutoSubmit();
      return;
    }

    clearPendingAutoSubmit();
    autoSubmitTimeoutRef.current = setTimeout(() => {
      applyQuery(value);
    }, autoSubmitDebounceMs);

    return clearPendingAutoSubmit;
  }, [applyQuery, autoSubmitDebounceMs, clearPendingAutoSubmit, currentValue, value]);

  useEffect(() => clearPendingAutoSubmit, [clearPendingAutoSubmit]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearPendingAutoSubmit();
    applyQuery(value);
  };

  const onClear = () => {
    setValue("");
    clearPendingAutoSubmit();
    applyQuery("");
  };

  return (
    <form onSubmit={onSubmit} className={className ?? "w-full"}>
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="pl-9 pr-9"
          />
          {showLoadingState && isPending ? (
            <div
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground"
              aria-live="polite"
              aria-label={loadingLabel}
              title={loadingLabel}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : canClear ? (
            <button
              type="button"
              onClick={onClear}
              aria-label={clearLabel}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
      <button type="submit" className="sr-only" aria-hidden="true" tabIndex={-1} />
    </form>
  );
}
