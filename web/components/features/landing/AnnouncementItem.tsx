type AnnouncementItemProps = {
  title: string;
  body: string;
  date?: string;
  dateLabel?: string;
};

export function AnnouncementItem({
  title,
  body,
  date,
  dateLabel,
}: AnnouncementItemProps) {
  return (
    <article className="border-t border-border py-6 first:border-t-0 first:pt-0">
      {date && dateLabel ? (
        <time
          dateTime={date}
          className="mb-2 block text-xs font-medium tracking-wide text-brand-800 dark:text-brand-400"
        >
          {dateLabel}
        </time>
      ) : null}
      <h3 className="font-display text-lg font-semibold text-brand-950 dark:text-brand-100">
        {title}
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-600 dark:text-brand-400">
        {body}
      </p>
    </article>
  );
}
