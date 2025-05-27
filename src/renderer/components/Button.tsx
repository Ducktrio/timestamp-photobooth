import { ReactNode } from "react";
interface ButtonProps {
  className?: string;
  type?: ButtonType;
  variant?: ButtonVariant;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

type ButtonType = "primary" | "secondary" | "tertiary" | "danger";
type ButtonVariant = "fill" | "outline";

const styles: Record<ButtonType, Record<ButtonVariant, string>> = {
  primary: {
    outline:
      "text-primary border-2 border-primary active:bg-primary active:text-on-primary active:shadow-none",
    fill: "bg-primary text-on-primary active:bg-primary-container active:text-on-primary-container",
  },
  secondary: {
    outline: "",
    fill: "",
  },

  tertiary: {
    outline: "",
    fill: "",
  },

  danger: {
    outline:
      "text-error border-2 border-error active:bg-error-container active:text-on-error-container",
    fill: "bg-error text-on-error border border-error",
  },
};

export default function Button({
  className,
  type = "primary",
  variant = "outline",
  children,
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <>
      <button
        className={`p-8 text-4xl rounded-full transition-all ${styles[type][variant]} ${className} ${disabled ? "border-1 border-surface bg-surface-container-low shadow-inset" : ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  );
}
