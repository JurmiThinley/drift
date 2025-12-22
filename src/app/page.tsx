import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Map, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  // Redirect logged-in users to dashboard
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-display text-2xl text-drift-400">drift</span>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-drift-400/10 text-drift-400 text-sm mb-8">
          <Sparkles className="w-4 h-4" />
          Your AI companion for life transitions
        </div>
        
        <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6 leading-tight">
          Navigate change<br />
          <span className="text-drift-400">with confidence</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Whether you're changing careers, moving cities, or starting a new chapter — 
          Drift guides you through life's biggest transitions with AI-powered support.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="gap-2 text-lg px-8">
              Start your journey
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="text-lg px-8">
              I have an account
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl text-foreground text-center mb-12">
          Everything you need to thrive
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass rounded-2xl p-8 border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-drift-400/20 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-drift-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">AI Companion</h3>
            <p className="text-muted-foreground">
              Talk through your feelings and get personalized support from an AI that understands your journey.
            </p>
          </div>
          
          <div className="glass rounded-2xl p-8 border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-sage-300/20 flex items-center justify-center mb-4">
              <Map className="w-6 h-6 text-sage-300" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Personal Roadmap</h3>
            <p className="text-muted-foreground">
              Get a customized action plan with phases and tasks tailored to your specific transition.
            </p>
          </div>
          
          <div className="glass rounded-2xl p-8 border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Daily Check-ins</h3>
            <p className="text-muted-foreground">
              Track your mood and build healthy habits with daily reflection and streak tracking.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="glass rounded-3xl p-12 border border-white/10">
          <h2 className="font-display text-3xl text-foreground mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of people navigating life's biggest changes with Drift.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Get started free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 Drift. Your companion through change.</p>
        </div>
      </footer>
    </main>
  );
}