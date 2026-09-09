import {
  Armchair,
  ArrowLeft,
  BatteryCharging,
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
  if (!departure || !arrival) return "حسب جدول الرحلة";
  const [dh, dm] = departure.split(":").map(Number);
  const [ah, am] = arrival.split(":").map(Number);
  if ([dh, dm, ah, am].some((n) => !Number.isFinite(n))) return "حسب جدول الرحلة";

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
  vip = false,
  departureStation,
  arrivalStation,
}: TripCardProps) {
  const departureLabel = departureStation
    ? `${trip.from} (${departureStation})`
    : trip.from;
  const arrivalLabel = arrivalStation ? `${trip.to} (${arrivalStation})` : trip.to;
  const soldOut = trip.availableSeats <= 0;

  return (
    <article className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
        <div className="flex w-full min-w-[220px] items-center gap-4 rounded-xl border border-blue-100/80 bg-blue-50/60 px-5 py-4 lg:w-auto">
          <div className="flex items-center justify-center rounded-xl bg-blue-600 p-3 text-white shadow-sm">
            <MapPin className="h-6 w-6" strokeWidth={2} />
          </div>
          <div>
            <span className="block text-xs font-medium text-gray-500">نقطة المغادرة</span>
            <span className="text-lg font-bold text-gray-900">{trip.from}</span>
            {departureStation && (
              <span className="mt-0.5 block text-xs font-medium text-gray-500">{departureStation}</span>
            )}
          </div>
        </div>

        <div className="w-full flex-1 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {vip && (
                <span className="rounded-md bg-blue-900 px-2.5 py-1 text-xs font-bold text-white">VIP</span>
              )}
              {busNumber && <span className="text-xs text-gray-500">حافلة رقم: {busNumber}</span>}
              {companyName && <span className="text-xs font-medium text-gray-400">{companyName}</span>}
            </div>
            <span className="hidden rounded-lg bg-gray-50 px-2.5 py-1.5 text-[10px] font-bold text-gray-400 sm:inline-flex">
              {arabicNumber(trip.availableSeats)} مقعد متاح
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-base font-semibold text-gray-800">
            <span>{departureLabel}</span>
            <ArrowLeft className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
            <span>{arrivalLabel}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-blue-600" />
              {formatTime(trip.departureTime)}
            </span>
            <span className="flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4 rotate-180 text-blue-600" />
              {formatTime(trip.arrivalTime)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-blue-600" />
              {durationBetween(trip.departureTime, trip.arrivalTime)}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1 text-gray-400" aria-label="مزايا الرحلة">
            <span title="Wi-Fi" aria-label="Wi-Fi"><Wifi className="h-5 w-5" /></span>
            <span title="تكييف" aria-label="تكييف"><Snowflake className="h-5 w-5" /></span>
            <span title="مقاعد مريحة" aria-label="مقاعد مريحة"><Armchair className="h-5 w-5" /></span>
            <span title="شحن USB" aria-label="شحن USB"><BatteryCharging className="h-5 w-5" /></span>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-3 border-t border-gray-100 pt-4 lg:w-auto lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
          <div className="text-left lg:text-right">
            <span className="text-xl font-bold text-blue-600">{arabicNumber(trip.price)} ر.س</span>
            <span className="block text-[10px] text-gray-400">للمسافر الواحد</span>
          </div>
          <Link
            to={`/customer/booking?from=${encodeURIComponent(trip.from)}&to=${encodeURIComponent(trip.to)}&tripId=${encodeURIComponent(trip._id)}`}
            aria-disabled={soldOut}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${
              soldOut ? "pointer-events-none bg-gray-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {soldOut ? "مكتملة المقاعد" : "اختر الرحلة"}
            {!soldOut && <ArrowLeft className="h-4 w-4" />}
          </Link>
        </div>
      </div>
    </article>
  );
}
