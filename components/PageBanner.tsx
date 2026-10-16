export default function PageBanner({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-banner">
      <div className="shell relative z-10">
        <p className="eyebrow text-org mb-4">{eyebrow}</p>
        <h1 className="d">{title}</h1>
        <p className="text-white/65 mt-4 max-w-xl text-sm md:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}
