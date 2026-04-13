import { DemoPanel } from '@/components/DemoPanel';
import { FeatureCard } from '@/components/FeatureCard';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { PricingCard } from '@/components/PricingCard';
import { SectionTitle } from '@/components/SectionTitle';
import { StepCard } from '@/components/StepCard';

const steps = [
  {
    step: 'Step 01',
    title: 'Add your background',
    description: 'Enter your experience, education, and skills.'
  },
  {
    step: 'Step 02',
    title: 'Paste a job description',
    description: 'Let the AI understand the role and what matters.'
  },
  {
    step: 'Step 03',
    title: 'Get tailored documents instantly',
    description: 'Receive a custom CV, cover letter, and match insights.'
  }
];

const features = [
  {
    title: 'AI CV Builder',
    description: 'Generate a clear, professional base CV tailored to your background.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 6h10M7 12h10M7 18h6" />
      </svg>
    )
  },
  {
    title: 'Job Match Scoring',
    description: 'Understand how aligned your profile is with every opportunity.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v18M3 12h18" />
      </svg>
    )
  },
  {
    title: 'Tailored Applications',
    description: 'Create role-specific CV versions in seconds, not hours.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m4 12 5 5 11-11" />
      </svg>
    )
  },
  {
    title: 'Cover Letter Generator',
    description: 'Produce compelling, concise letters with a consistent tone.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 5h16v14H4z" />
        <path d="m4 8 8 6 8-6" />
      </svg>
    )
  }
];

const pricing = [
  {
    name: 'Free',
    price: '$0',
    description: 'For first-time users',
    features: ['1 tailored CV', 'Basic match insights', 'Limited cover letter generation']
  },
  {
    name: 'Pro',
    price: '$19',
    description: 'For active job seekers',
    highlighted: true,
    features: [
      'Unlimited tailored CVs',
      'Unlimited cover letters',
      'Full match insights',
      'Saved application versions'
    ]
  },
  {
    name: 'Career+',
    price: '$39',
    description: 'For accelerated growth',
    features: ['Everything in Pro', 'Advanced optimization tips', 'Priority support']
  }
];

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="How it works"
          title="A simple workflow that removes application friction"
          description="From profile to role-specific documents in three clear steps."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Features"
          title="Built to help you move faster and apply smarter"
          description="Everything you need to create premium applications with less effort."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section id="demo" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Demo Preview"
          title="See how TailorCV aligns your story with the role"
          description="A product-style preview of profile context, role input, and live suggestions."
        />
        <div className="mt-10">
          <DemoPanel />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Trust"
          title="Built for modern job seekers"
          description="Designed to save time. Tailored for better applications."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {['Built for modern job seekers', 'Designed to save time', 'Tailored for better applications'].map(
            (item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
                {item}
              </div>
            )
          )}
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Pricing"
          title="Choose the plan that fits your job search pace"
          description="Start free, upgrade when you want full application power."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricing.map((tier) => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>
      </section>

      <section id="final-cta" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-soft sm:p-16">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Stop rewriting every application from scratch.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">Let AI help you apply faster and better.</p>
          <a
            href="#"
            className="mt-8 inline-flex rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Get Started
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
