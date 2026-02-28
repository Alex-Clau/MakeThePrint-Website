import { type ReactNode } from "react";
import { Navigation } from "@/components/navigation";
import { cn } from "@/lib/utils";

const maxWidthClasses = {
  "7xl": "max-w-7xl",
  "4xl": "max-w-4xl",
  "3xl": "max-w-3xl",
} as const;

const paddingClasses = {
  default: "px-4 sm:px-6 lg:px-8 py-6 sm:py-8",
  tight: "px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8",
  relaxed: "px-4 sm:px-6 lg:px-8 py-8 sm:py-12",
} as const;

export interface PageLayoutProps {
  children: ReactNode;
  /** Optional page title (e.g. <h1>). Omit for pages that render their own header. */
  title?: ReactNode;
  /** Max width of the content area. Default "7xl". */
  maxWidth?: keyof typeof maxWidthClasses;
  /** Padding variant. Default "default". Use "tight" for cart/products, "relaxed" for content pages. */
  padding?: keyof typeof paddingClasses;
  /** Extra class for the title wrapper (e.g. for accent color). */
  titleClassName?: string;
  /** Extra class for the inner content wrapper. */
  contentClassName?: string;
  /** Extra class for the main element (e.g. relative z-10 bg-background). */
  mainClassName?: string;
}

export function PageLayout({
  children,
  title,
  maxWidth = "7xl",
  padding = "default",
  titleClassName,
  contentClassName,
  mainClassName,
}: PageLayoutProps) {
  return (
    <main className={cn("min-h-screen flex flex-col", mainClassName)}>
      <Navigation />
      <div
        className={cn(
          "flex-1 mx-auto w-full",
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
          contentClassName
        )}
      >
        {title != null && (
          <div className={cn("mb-6 sm:mb-8", titleClassName)}>
            {typeof title === "string" ? (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                {title}
              </h1>
            ) : (
              title
            )}
          </div>
        )}
        {children}
      </div>
    </main>
  );
}
