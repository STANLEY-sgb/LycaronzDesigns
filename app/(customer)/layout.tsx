/**
 * Customer-facing pages layout.
 * Adds bottom padding on mobile so fixed bottom navigation
 * never covers page content, forms, or CTAs.
 */
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      // On mobile: extra space below content to clear the fixed bottom nav (60px) + safe area
      // On tablet/desktop: no extra padding (bottom nav hidden)
      className="pb-[calc(3.75rem+env(safe-area-inset-bottom))] md:pb-0"
    >
      {children}
    </div>
  );
}
