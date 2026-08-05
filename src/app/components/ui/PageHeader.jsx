export default function PageHeader({
  title,
  description,
  breadcrumb,
  action,
  icon,
  iconClassName = "",
  className = "",
}) {
  return (
    <section
      className={`rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] ${className}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-4">
          {icon ? (
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)] ${iconClassName}`}>
              {icon}
            </div>
          ) : null}
          <div>
            {breadcrumb ? (
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                {breadcrumb}
              </p>
            ) : null}
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}
