import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"
    
    const variants = {
      default: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 shadow-md hover:shadow-lg shadow-[var(--primary)]/20",
      destructive: "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90 shadow-md hover:shadow-lg shadow-[var(--destructive)]/20",
      outline: "border-2 border-[var(--border)] text-[var(--foreground)] bg-transparent hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5",
      secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80 shadow-sm",
      ghost: "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
    }

    const sizes = {
      default: "h-12 px-6 py-3",
      sm: "h-10 px-4 text-sm",
      lg: "h-14 px-10 text-lg",
      icon: "h-12 w-12",
    }

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`

    return (
      <button
        className={combinedClassName}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
