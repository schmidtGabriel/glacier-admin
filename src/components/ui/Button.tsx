import React, { type ButtonHTMLAttributes } from "react";
import { Loading } from "./Loading";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-400",
    outline:
      "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-gray-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400",
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const loadingStyle = isLoading ? "opacity-80 cursor-not-allowed" : "";
  const disabledStyle = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyle}
        ${loadingStyle}
        ${disabledStyle}
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loading />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
