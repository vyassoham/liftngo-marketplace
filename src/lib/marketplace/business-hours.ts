export const MARKETPLACE_TIME_ZONE = 'Asia/Kolkata';

export interface StoreAvailabilitySource {
  status: string;
  businessHours?: Record<string, unknown> | null;
  temporarilyClosedUntil?: string | Date | null;
  timeZone?: string;
}

export interface StoreAvailability {
  isOpen: boolean;
  canOrder: boolean;
  reason: 'open' | 'scheduled-closed' | 'temporarily-closed' | 'paused' | 'unpublished';
  statusLabel: string;
  nextOpenAt: string | null;
  nextOpenLabel: string | null;
  closesAt: string | null;
  closesLabel: string | null;
}

interface ClockRange {
  start: number;
  end: number;
}

interface LocalDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_SHORT_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const ALL_DAY_KEYS = ['all', 'daily', 'everyday', 'every-day'];

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replaceAll('_', '-');
}

function parseClock(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const meridiem = match[3]?.toLowerCase();

  if (minute < 0 || minute > 59) return null;
  if (meridiem) {
    if (hour < 1 || hour > 12) return null;
    if (hour === 12) hour = 0;
    if (meridiem === 'pm') hour += 12;
  } else if (hour < 0 || hour > 24 || (hour === 24 && minute !== 0)) {
    return null;
  }

  return hour * 60 + minute;
}

function parseRange(value: string): ClockRange | null {
  const match = value.trim().match(/^(.+?)\s*(?:-|–|—|to)\s*(.+)$/i);
  if (!match) return null;
  const start = parseClock(match[1]);
  const end = parseClock(match[2]);
  if (start === null || end === null || start === end) return null;
  return { start, end };
}

function parseRanges(value: unknown): ClockRange[] {
  if (Array.isArray(value)) return value.flatMap(parseRanges);

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (!normalized || ['closed', 'off', 'unavailable'].includes(normalized)) return [];
    if (['24h', '24 hours', 'open 24 hours', 'open'].includes(normalized)) {
      return [{ start: 0, end: 1440 }];
    }
    return value
      .split(/[,;]/)
      .map(parseRange)
      .filter((range): range is ClockRange => Boolean(range));
  }

  if (!value || typeof value !== 'object') return [];
  const record = value as Record<string, unknown>;
  if (record.closed === true || record.isClosed === true || record.is_closed === true) return [];

  const nested = record.shifts ?? record.intervals ?? record.ranges;
  if (nested !== undefined) return parseRanges(nested);

  const open = record.open ?? record.opens ?? record.openAt ?? record.open_at;
  const close = record.close ?? record.closes ?? record.closeAt ?? record.close_at;
  const start = parseClock(open);
  const end = parseClock(close);
  return start !== null && end !== null && start !== end ? [{ start, end }] : [];
}

function scheduleForDay(
  businessHours: Record<string, unknown>,
  weekday: number,
): { configured: boolean; ranges: ClockRange[] } {
  const normalized = new Map(
    Object.entries(businessHours).map(([key, value]) => [normalizeKey(key), value]),
  );
  const candidates = [DAY_NAMES[weekday], DAY_SHORT_NAMES[weekday], String(weekday), ...ALL_DAY_KEYS];
  const selectedKey = candidates.find((key) => normalized.has(key));
  if (!selectedKey) return { configured: false, ranges: [] };
  return { configured: true, ranges: parseRanges(normalized.get(selectedKey)) };
}

function localParts(date: Date, timeZone: string): LocalDateParts {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
  };
}

function calendarDay(parts: LocalDateParts, offset: number) {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + offset));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    weekday: date.getUTCDay(),
  };
}

function timeZoneOffset(date: Date, timeZone: string): number {
  const parts = localParts(date, timeZone);
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute) -
    Math.floor(date.getTime() / 60000) * 60000;
}

function localDateToUtc(
  year: number,
  month: number,
  day: number,
  minutes: number,
  timeZone: string,
): Date {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  let result = new Date(guess - timeZoneOffset(new Date(guess), timeZone));
  result = new Date(guess - timeZoneOffset(result, timeZone));
  return result;
}

function scheduledAvailability(
  businessHours: Record<string, unknown>,
  now: Date,
  timeZone: string,
): { isOpen: boolean; nextOpenAt: Date | null; closesAt: Date | null } {
  if (Object.keys(businessHours).length === 0) {
    return { isOpen: true, nextOpenAt: null, closesAt: null };
  }

  const today = localParts(now, timeZone);
  const nowMinute = today.hour * 60 + today.minute;
  let nextOpenAt: Date | null = null;

  for (let offset = -1; offset <= 14; offset += 1) {
    const date = calendarDay(today, offset);
    const schedule = scheduleForDay(businessHours, date.weekday);
    if (!schedule.configured) continue;

    for (const range of schedule.ranges) {
      const startRelative = offset * 1440 + range.start;
      const overnight = range.end <= range.start;
      const endRelative = offset * 1440 + range.end + (overnight ? 1440 : 0);

      if (startRelative <= nowMinute && nowMinute < endRelative) {
        const closingDay = calendarDay(today, offset + (overnight ? 1 : 0));
        const closesAt =
          range.start === 0 && range.end === 1440
            ? null
            : localDateToUtc(
                closingDay.year,
                closingDay.month,
                closingDay.day,
                range.end,
                timeZone,
              );
        return { isOpen: true, nextOpenAt: null, closesAt };
      }

      if (offset >= 0 && startRelative > nowMinute && !nextOpenAt) {
        nextOpenAt = localDateToUtc(
          date.year,
          date.month,
          date.day,
          range.start,
          timeZone,
        );
      }
    }
  }

  return { isOpen: false, nextOpenAt, closesAt: null };
}

function localDayNumber(date: Date, timeZone: string): number {
  const parts = localParts(date, timeZone);
  return Math.floor(Date.UTC(parts.year, parts.month - 1, parts.day) / 86400000);
}

export function formatNextOpenLabel(
  nextOpenAt: Date,
  now = new Date(),
  timeZone = MARKETPLACE_TIME_ZONE,
): string {
  const dayDifference = localDayNumber(nextOpenAt, timeZone) - localDayNumber(now, timeZone);
  const time = new Intl.DateTimeFormat('en-IN', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(nextOpenAt);

  if (dayDifference === 0) return `Opens today at ${time}`;
  if (dayDifference === 1) return `Opens tomorrow at ${time}`;

  const weekday = new Intl.DateTimeFormat('en-IN', { timeZone, weekday: 'long' }).format(nextOpenAt);
  return `Opens ${weekday} at ${time}`;
}

export function formatClosesLabel(
  closesAt: Date,
  now = new Date(),
  timeZone = MARKETPLACE_TIME_ZONE,
): string {
  const dayDifference = localDayNumber(closesAt, timeZone) - localDayNumber(now, timeZone);
  const time = new Intl.DateTimeFormat('en-IN', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(closesAt);

  if (dayDifference <= 0) return `Closes at ${time}`;
  if (dayDifference === 1) return `Closes tomorrow at ${time}`;
  return `Closes at ${time}`;
}

export function getStoreAvailability(
  source: StoreAvailabilitySource,
  now = new Date(),
): StoreAvailability {
  const timeZone = source.timeZone || MARKETPLACE_TIME_ZONE;
  const status = source.status.toUpperCase();

  if (!['ACTIVE', 'PUBLISHED'].includes(status)) {
    return {
      isOpen: false,
      canOrder: false,
      reason: status === 'PAUSED' ? 'paused' : 'unpublished',
      statusLabel: 'Closed',
      nextOpenAt: null,
      nextOpenLabel: null,
      closesAt: null,
      closesLabel: null,
    };
  }

  const businessHours = source.businessHours ?? {};
  const temporarilyClosedUntil = source.temporarilyClosedUntil
    ? new Date(source.temporarilyClosedUntil)
    : null;

  if (temporarilyClosedUntil && temporarilyClosedUntil.getTime() > now.getTime()) {
    const afterTemporaryClose = new Date(temporarilyClosedUntil.getTime() + 1000);
    const scheduledAfterClose = scheduledAvailability(businessHours, afterTemporaryClose, timeZone);
    const nextOpen = scheduledAfterClose.isOpen
      ? temporarilyClosedUntil
      : scheduledAfterClose.nextOpenAt;
    const nextOpenLabel = nextOpen ? formatNextOpenLabel(nextOpen, now, timeZone) : null;
    return {
      isOpen: false,
      canOrder: false,
      reason: 'temporarily-closed',
      statusLabel: nextOpenLabel ?? 'Temporarily closed',
      nextOpenAt: nextOpen?.toISOString() ?? null,
      nextOpenLabel,
      closesAt: null,
      closesLabel: null,
    };
  }

  const scheduled = scheduledAvailability(businessHours, now, timeZone);
  if (scheduled.isOpen) {
    const closesLabel = scheduled.closesAt
      ? formatClosesLabel(scheduled.closesAt, now, timeZone)
      : null;
    return {
      isOpen: true,
      canOrder: true,
      reason: 'open',
      statusLabel: 'Open now',
      nextOpenAt: null,
      nextOpenLabel: null,
      closesAt: scheduled.closesAt?.toISOString() ?? null,
      closesLabel,
    };
  }

  const nextOpenLabel = scheduled.nextOpenAt
    ? formatNextOpenLabel(scheduled.nextOpenAt, now, timeZone)
    : null;
  return {
    isOpen: false,
    canOrder: false,
    reason: 'scheduled-closed',
    statusLabel: nextOpenLabel ?? 'Closed',
    nextOpenAt: scheduled.nextOpenAt?.toISOString() ?? null,
    nextOpenLabel,
    closesAt: null,
    closesLabel: null,
  };
}
