export function DemoPanel() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Candidate Profile</p>
          <p className="mt-3 text-sm font-medium text-slate-900">Frontend Engineer · 5 years</p>
          <p className="mt-2 text-sm text-slate-600">React, TypeScript, product collaboration, analytics.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Job Description</p>
          <p className="mt-3 text-sm text-slate-700">Looking for a React engineer with cross-functional communication skills and measurable impact.</p>
        </div>
        <div className="rounded-2xl border border-accent-100 bg-accent-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">Match Score</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">87%</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• Highlight React experience</li>
            <li>• Mention cross-functional work</li>
            <li>• Add measurable outcomes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
