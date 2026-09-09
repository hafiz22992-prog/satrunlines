import {
  Armchair,
  ArrowLeft,
  BatteryCharging,
  CalendarDays,
  Clock3,
  MapPin,
  Snowflake,
  Wifi,
} from "lucide-react";
import { Link } from "react-router";

type TripCardTrip = {
  _id: string;
  companyId: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime?: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  days?: string[];
};

type TripCardProps = {
  trip: TripCardTrip;
  companyName?: string;
  /** Optional presentation metadata. These are intentionally optional so existing Convex trip records keep working. */
  busNumber?: string;
  vip?: boolean;
  departureStation?: string;
  arrivalStation?: string;
};

function formatTime(value?: string) {
  if (!value) return "—";
  const [hoursText, minutes = "00"] = value.split(":");
  const hours = Number(hoursText);
  if (!Number.isFinite(hours)) return value;
  const suffix = hours >= 12 ? "م" : "ص";
  const hour12 = hours % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${minutes} ${suffix}`;
}

function durationBetween(departure?: string, arrival?: string) {
  if (!departure || !arrival) return "المدة حسب جدول الرحلة";
  const [dh, dm] = departure.split(":").map(Number);
  const [ah, am] = arrival.split(":").map(Number);
  if ([dh, dm, ah, am].some((n) => !Number.isFinite(n))) return "المدة حسب جدول الرحلة";

  let minutes = ah * 60 + am - (dh * 60 + dm);
  if (minutes < 0) minutes += 24 * 60;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours} ساعة و ${mins} دقيقة` : `${hours} ساعة`;
}

function arabicNumber(value: number | string) {
  return String(value).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
}

export function TripCard({
  trip,
  companyName,
  busNumber,
  vip = true,
  departureStation,
  arrivalStation,
}: TripCardProps) {
  const departureLabel = departureStation
    ? `${trip.from} (${departureStation})`
    : trip.from;
  const arrivalLabel = arrivalStation ? `${trip.to} (${arrivalStation})` : trip.to;
  const seats = trip.availableSeats;
  const soldOut = seats <= 0;

  return (
    <article className="group overflow-hidden rounded-[24px] border border-[#dce5ef] bg-white shadow-[0_10px_30px_rgba(11,43,85,.07)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(11,43,85,.12)]">
      <div className="relative p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[150px_minmax(0,1fr)_220px] lg:items-stretch">
          <div className="order-1 rounded-[20px] bg-[#f5f8fc] p-4 text-center ring-1 ring-inset ring-[#dce5ef] lg:flex lg:flex-col lg:items-center lg:justify-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#0b2b55] text-white shadow-lg shadow-[#0b2b55]/15">
              <MapPin className="size-6" strokeWidth={2.5} />
            </div>
            <p className="mt-3 text-[11px] font-black text-[#6b7b8f]">نقطة المغادرة</p>
            <p className="mt-1 text-xl font-black leading-tight text-[#0b2b55] sm:text-2xl">
              {trip.from}
            </p>
            {departureStation && (
              <p className="mt-1 text-[11px] font-bold text-slate-500">{departureStation}</p>
            )}
          </div>

          <div className="order-2 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {vip && (
                    <span className="rounded-full bg-[#3974b9] px-2.5 py-1 text-[10px] font-black tracking-wide text-white shadow-sm">
                      VIP
                    </span>
                  )}
                  {busNumber && (
                    <span className="text-xs font-bold text-slate-500">
                      حافلة رقم: {busNumber}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs font-bold text-slate-400">{companyName ?? "شركة نقل مستقلة"}</p>
              </div>

              <div className="rounded-xl bg-[#f6f8fb] px-3 py-2 text-right">
                <p className="text-[10px] font-bold text-slate-400">المقاعد المتاحة</p>
                <p className="mt-0.5 text-sm font-black text-[#0b2b55]">
                  {arabicNumber(seats)} / {arabicNumber(trip.totalSeats)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-right">
                <p className="text-[10px] font-black text-slate-400">الانطلاق</p>
                <p className="mt-1 text-base font-black text-[#0b2b55]">{formatTime(trip.departureTime)}</p>
                <p className="mt-1 truncate text-xs font-bold text-slate-600" title={departureLabel}>
                  {departureLabel}
                </p>
              </div>

              <div className="hidden items-center gap-2 text-[#3974b9] sm:flex" aria-hidden="true">
                <span className="h-px w-10 bg-[#c7d5e5]" />
                <ArrowLeft className="size-5" />
                <span className="h-px w-10 bg-[#c7d5e5]" />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-right">
                <p className="text-[10px] font-black text-slate-400">الوصول</p>
                <p className="mt-1 text-base font-black text-[#0b2b55]">{formatTime(trip.arrivalTime)}</p>
                <p className="mt-1 truncate text-xs font-bold text-slate-600" title={arrivalLabel}>
                  {arrivalLabel}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-4 text-[#3974b9]" />
                {durationBetween(trip.departureTime, trip.arrivalTime)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4 text-[#3974b9]" />
                {trip.days?.join("، ") || "حسب الجدول"}
              </span>
            </div>
          </div>

          <div className="order-3 flex flex-col justify-between rounded-[20px] bg-[#f8fbff] p-4 ring-1 ring-inset ring-[#dce5ef]">
            <div>
              <p className="text-[11px] font-bold text-slate-400">سعر التذكرة</p>
              <div className="mt-1 flex items-end gap-1">
                <strong className="text-2xl font-black text-[#3974b9]">{arabicNumber(trip.price)}</strong>
                <span className="pb-1 text-xs font-black text-[#3974b9]">ر.س</span>
              </div>
              <p className="mt-1 text-[10px] font-bold text-slate-400">للمسافر الواحد</p>
            </div>

            <Link
              to={`/customer/booking?from=${encodeURIComponent(trip.from)}&to=${encodeURIComponent(trip.to)}&tripId=${encodeURIComponent(trip._id)}`}
              aria-disabled={soldOut}
              className={`mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition ${
                soldOut
                  ? "pointer-events-none bg-slate-200 text-slate-400"
                  : "bg-[#3974b9] text-white shadow-lg shadow-[#3974b9]/20 hover:bg-[#2d639f]"
              }`}
            >
              {soldOut ? "مكتملة المقاعد" : "اختر الرحلة"}
              {!soldOut && <ArrowLeft className="size-4" />}
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5" title="Wi-Fi">
            <Wifi className="size-4 text-[#3974b9]" />
            Wi-Fi
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5" title="تكييف">
            <Snowflake className="size-4 text-[#3974b9]" />
            AC
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5" title="شحن الأجهزة">
            <BatteryCharging className="size-4 text-[#3974b9]" />
            شحن
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5" title="مقاعد مريحة">
            <Armchair className="size-4 text-[#3974b9]" />
            مقاعد مريحة
          </span>
        </div>
      </div>
    </article>
  );
}
