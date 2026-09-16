export const note = (r, text) => {
  r.journal.unshift({
    week: r.week,
    text,
  });
  r.journal = r.journal.slice(0, 100);
  r.notice = text;
};
