export function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.08em] text-(--color-accent) mb-4">
      {children}
    </p>
  );
}
