import Image from 'next/image';

export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white" aria-live="polite" aria-busy="true">
      <div className="loading-pulse">
        <Image
          src="/logo.png"
          alt="Loading Liftngo"
          width={120}
          height={34}
          className="h-8 w-auto object-contain"
          priority
        />
      </div>
    </div>
  );
}
