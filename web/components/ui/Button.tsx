import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonBase =
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[13px] border-0 font-medium leading-none whitespace-nowrap transition-[background-color,box-shadow,transform,color] duration-150 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

const buttonVariants = cva(buttonBase, {
  variants: {
    variant: {
      default: "glass-button text-[15px] text-foreground",
      outline: "glass-button text-[15px] text-foreground",
      secondary: "glass-button text-[15px] text-foreground",
      ghost:
        "bg-transparent text-[15px] text-foreground shadow-none hover:bg-[var(--glass-btn)] aria-expanded:bg-[var(--glass-btn)]",
      destructive:
        "bg-destructive/10 text-[15px] text-destructive shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--destructive)_25%,transparent)] hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:hover:bg-destructive/30",
      link: "bg-transparent text-[15px] text-primary shadow-none underline-offset-4 hover:bg-transparent hover:underline",
      check:
        "border border-sky-600/35 bg-sky-600 text-[15px] text-white shadow-md hover:bg-sky-700 active:bg-sky-800 disabled:border-sky-600/20 disabled:bg-sky-600/45 disabled:text-white/90 dark:border-sky-400/30 dark:bg-sky-500 dark:hover:bg-sky-400 dark:active:bg-sky-300",
    },
    size: {
      default:
        "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
      xs: "h-6 gap-1 rounded-[10px] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
      sm: "h-9 gap-1.5 rounded-[12px] px-3 in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
      lg: "h-11 gap-2 px-5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
      icon: "size-10",
      "icon-xs":
        "size-6 rounded-[10px] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
      "icon-sm": "size-8 rounded-[12px] in-data-[slot=button-group]:rounded-lg",
      "icon-lg": "size-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
