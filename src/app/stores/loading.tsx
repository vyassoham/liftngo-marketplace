function CardSkeleton() {
  return <div className="animate-pulse"><div className="aspect-[1.45] rounded-2xl bg-stone-200" /><div className="mt-3 h-4 w-3/4 rounded bg-stone-200" /><div className="mt-2 h-3 w-1/2 rounded bg-stone-100" /></div>;
}

export default function StoresLoading() {
  return (
    <main className="min-h-screen bg-[#fffdf9] px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-64 rounded-[2rem] bg-stone-200" />
        <div className="mt-10 h-7 w-56 rounded bg-stone-200" />
        <div className="mt-5 flex gap-4 overflow-hidden">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-20 w-24 shrink-0 rounded-2xl bg-stone-100" />)}</div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} />)}</div>
      </div>
    </main>
  );
}
