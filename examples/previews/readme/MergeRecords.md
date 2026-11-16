# MergeRecords

Two or more duplicates side by side: for every field that differs, pick which value to keep, then
merge.

- Rows that differ are marked; the kept value is highlighted. `value` and `onChange` hold the
  choice per field, `onMerge` gets it.
