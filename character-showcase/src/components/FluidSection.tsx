// src/components/FluidSection.tsx
interface FluidSectionProps {
  title: string;
  description: string;
}

export function FluidSection({ title, description }: FluidSectionProps) {
  return (
    <section className="border-b border-white/10 py-6 transition-colors duration-200 motion-reduce:transition-none">
      <span className="inline-block text-xs uppercase tracking-wider text-neutral-400">
        Fluid
      </span>
      <h3 className="mt-2 text-lg font-medium text-neutral-100">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{description}</p>
    </section>
  );
}