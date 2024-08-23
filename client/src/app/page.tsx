import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-wavy-gradient flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Stride</h1>
      <p>Get started by generating your custom training plan.</p>
      <Link href="/generate">Generate Training Plan</Link>
    </main>
  );
}
