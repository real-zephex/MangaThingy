export default function ReaderLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-brand-start/30 border-t-brand-start rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">
          Loading chapter...
        </p>
      </div>
    </div>
  );
}
