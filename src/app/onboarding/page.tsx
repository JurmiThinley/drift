export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-display text-4xl text-drift-400 mb-4">Welcome to Drift!</h1>
        <p className="text-muted-foreground mb-8">Onboarding flow coming on Day 2</p>
        <a 
          href="/dashboard" 
          className="inline-flex items-center justify-center rounded-lg bg-drift-400 px-6 py-3 text-midnight-950 font-medium hover:bg-drift-300 transition-colors"
        >
          Go to Dashboard →
        </a>
      </div>
    </main>
  );
}