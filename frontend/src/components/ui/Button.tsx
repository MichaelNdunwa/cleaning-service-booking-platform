import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "primary-outline-hover";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
    primary:
        "bg-brand-accent text-white border-2 border-transparent shadow-sm hover:bg-brand-accent-hover hover:shadow-md active:scale-[0.98]",
    secondary:
        "bg-brand-primary text-white border-2 border-transparent shadow-sm hover:bg-brand-primary-light hover:shadow-md active:scale-[0.98]",
    outline:
        "border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white active:scale-[0.98]",
    ghost: "text-neutral-600 border-2 border-transparent hover:bg-neutral-100 hover:text-brand-primary",
    "primary-outline-hover":
        "bg-brand-accent text-white border-2 border-transparent shadow-sm hover:!bg-transparent hover:!text-[#3B82F6] hover:!border-[#3B82F6] hover:shadow-md active:scale-[0.98]",
};

const sizeStyles: Record<Size, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
};

interface ButtonBaseProps {
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
}

type ButtonAsButton = ButtonBaseProps &
    ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: never;
    };

type ButtonAsLink = ButtonBaseProps &
    AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
    };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
    variant = "primary",
    size = "md",
    fullWidth = false,
    className = "",
    children,
    ...props
}: ButtonProps) {
    const baseClasses = `inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`;

    if ("href" in props && props.href) {
        const { href, ...rest } = props as ButtonAsLink;
        return (
            <Link href={href} className={baseClasses} {...rest}>
                {children}
            </Link>
        );
    }

    return (
        <button className={baseClasses} {...(props as ButtonAsButton)}>
            {children}
        </button>
    );
}
