import Link from 'next/link';
import { ArrowRight, Sparkles, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-drift-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-sage-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-light text-drift-400">drift</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get started
              </Button>
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="px-6 pt-20 pb-32 max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-drift-400 mb-4">
            Your transition companion
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-foreground mb-6">
            Navigate life's changes with{' '}
            <span className="gradient-text">confidence</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Whether you're changing careers, moving cities, or starting a new chapter,
            Drift provides personalized AI guidance to help you through every step.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start your journey
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign in
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="AI-Powered Guidance"
              description="Get personalized support from an AI companion that understands your unique situation and adapts to your needs."
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6" />}
              title="Emotional Support"
              description="Daily check-ins and empathetic conversations help you process emotions while staying on track."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Community Wisdom"
              description="Learn from anonymized insights of others who've navigated similar transitions successfully."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12">
            <h2 className="font-display text-3xl font-light text-foreground mb-4">
              Ready to begin?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands navigating their transitions with Drift.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Create free account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-border">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="font-display text-lg text-muted-foreground">drift</span>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Drift. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-drift-400/20 flex items-center justify-center text-drift-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
