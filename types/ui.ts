import * as React from "react";
import { VariantProps } from "class-variance-authority";

/**
 * Button component props
 * Note: This extends VariantProps in the actual component
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<any> {
  asChild?: boolean;
}

/**
 * Badge component props
 * Note: This extends VariantProps in the actual component
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<any> {}

