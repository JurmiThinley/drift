import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl text-drift-400 mb-2">
          Welcome back{session.user?.name ? `, ${session.user.name}` : ''}!
        </h1>
        <p className="text-muted-foreground mb-8">
          Your journey dashboard is coming on Day 4
        </p>
        
        <div className="glass rounded-2xl p-6 border border-white/10">
          <p className="text-sm text-muted-foreground mb-2">Signed in as:</p>
          <p className="text-foreground">{session.user?.email}</p>
        </div>
      </div>
    </main>
  );
}