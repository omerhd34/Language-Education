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
    <article className="border-t border-zinc-200 py-6 first:border-t-0 first:pt-0 dark:border-zinc-800">
      {date && dateLabel ? (
        <time
          dateTime={date}
          className="mb-2 block text-xs font-medium tracking-wide text-teal-700 dark:text-teal-400"
        >
          {dateLabel}
        </time>
      ) : null}
      <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {body}
      </p>
    </article>
  );
}
