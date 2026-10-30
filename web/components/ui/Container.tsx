type ContainerSize = "page" | "app";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  size?: ContainerSize;
  as?: "div" | "section" | "header" | "footer" | "main" | "nav";
};

const sizeClasses: Record<ContainerSize, string> = {
  page: "max-w-360",
  app: "max-w-400",
};

export function Container({
  children,
  className = "",
  size = "page",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full ${sizeClasses[size]} px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </Tag>
  );
}
