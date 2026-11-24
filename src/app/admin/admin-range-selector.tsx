"use client";

type AdminRangeSelectorProps = {
  range: string;
};

export default function AdminRangeSelector({ range }: AdminRangeSelectorProps) {
  return (
    <form action="/admin" className="flex items-center gap-2">
      <label htmlFor="admin-range" className="text-xs text-[#8a837c]">
        Range
      </label>
      <select
        id="admin-range"
        name="range"
        defaultValue={range}
        className="rounded-xl border border-[#e9e1da] bg-white px-3 py-2 text-xs font-semibold"
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        <option value="today">Today</option>
        <option value="7d">7 days</option>
        <option value="30d">30 days</option>
        <option value="90d">90 days</option>
      </select>
    </form>
  );
}
