export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 bg-slate-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}
