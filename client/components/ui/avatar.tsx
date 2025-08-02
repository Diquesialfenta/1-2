import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  className?: string;
  fallbackClassName?: string;
}

export function Avatar({
  src,
  alt,
  fallback,
  className,
  fallbackClassName,
}: AvatarProps) {
  return (
    <div className={cn("relative", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn("object-cover w-full h-full", className)}
          onLoad={(e) => {
            const target = e.target as HTMLElement;
            target.style.display = "block";
            const fallbackElement = target.nextElementSibling as HTMLElement;
            if (fallbackElement) fallbackElement.style.display = "none";
          }}
          onError={(e) => {
            console.log(`Error loading avatar: ${src}`);
            const target = e.target as HTMLElement;
            target.style.display = "none";
            const fallbackElement = target.nextElementSibling as HTMLElement;
            if (fallbackElement) fallbackElement.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center text-xs font-bold",
          src ? "hidden" : "",
          fallbackClassName,
        )}
      >
        {fallback}
      </div>
    </div>
  );
}
