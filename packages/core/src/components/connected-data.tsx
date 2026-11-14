"use client";
import * as React from "react";
import { cx } from "../cx.js";
import { useFormat, useStrings } from "../context.js";
import { CONNECTED_DATA_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { registerIcons, type IconName } from "../icons.js";
import {
  activity,
  battery,
  batteryCharging,
  bedDouble,
  carFront,
  cctv,
  circleDot,
  fan,
  lampCeiling,
  lockOpen,
  mapPin,
  phoneCall,
  phoneIncoming,
  phoneMissed,
  phoneOutgoing,
  plane,
  plug2,
  radar,
  skipBack,
  skipForward,
  thermometer,
  ticket,
  trainFront,
} from "../icon-library.js";
import { Badge, Button, IconButton, TintIcon } from "./foundation.js";
import { Switch } from "./inputs.js";
import { ServiceMark } from "./connectors.js";
import type {
  CallLogProps,
  CallItem,
  DeviceTileProps,
  HoldingsListProps,
  NowPlayingProps,
  ReservationCardProps,
  ScorecardProps,
  ServiceRef,
  VehicleCardProps,
  WorkoutCardProps,
} from "./types.js";

// default icons of these components come from the icon library
registerIcons({
  activity,
  battery,
  batteryCharging,
  bedDouble,
  carFront,
  cctv,
  circleDot,
  fan,
  lampCeiling,
  lockOpen,
  mapPin,
  phoneCall,
  phoneIncoming,
  phoneMissed,
  phoneOutgoing,
  plane,
  plug2,
  radar,
  skipBack,
  skipForward,
  thermometer,
  ticket,
  trainFront,
});

function Source({ s }: { s?: ServiceRef }) {
  if (!s) return null;
  return <ServiceMark name={s.name} icon={s.icon} logo={s.logo} size="sm" />;
}

const DEVICE_ICON: Record<NonNullable<DeviceTileProps["kind"]>, IconName> = {
  switch: "plug2",
  light: "lampCeiling",
  thermostat: "thermometer",
  vacuum: "circleDot",
  purifier: "fan",
  camera: "cctv",
  lock: "lock",
  sensor: "radar",
};

/**
 * A smart-home device: its reading, state and the controls its kind needs (a switch, a
 * thermostat stepper, quick actions), with battery and an offline state.
 */
export function DeviceTile(p: DeviceTileProps) {
  const t = useStrings(CONNECTED_DATA_STRINGS);
  const { formatNumber, formatPercent } = useFormat();
  const kind = p.kind || "switch";
  const step = p.step ?? 0.5;
  const temp = (v: number) => formatNumber(v, { maximumFractionDigits: 1 }) + " °C";
  return (
    <div
      style={p.style}
      className={cx(
        "tf-device",
        "kind-" + kind,
        p.offline ? "is-offline" : p.on ? "is-on" : p.on === false && "is-off",
        p.className,
      )}
    >
      <div className="tf-device-head">
        <span className={cx("tf-device-ico", p.on && !p.offline && "is-on")} aria-hidden>
          <Icon name={p.icon || DEVICE_ICON[kind]} size={18} />
        </span>
        <span className="tf-option-text">
          <b>{p.name}</b>
          {p.room && <small>{p.room}</small>}
        </span>
        <Source s={p.service} />
        {p.onToggle && !p.offline && (
          <Switch
            checked={!!p.on}
            label={p.name}
            onChange={(e) => p.onToggle?.(e.currentTarget.checked)}
          />
        )}
      </div>
      <div className="tf-device-body">
        <span className="tf-device-value">
          {p.offline ? t.deviceOffline : (p.value ?? (p.on ? t.deviceOn : t.deviceOff))}
        </span>
        {p.status && !p.offline && <span className="tf-device-status">{p.status}</span>}
      </div>
      {p.target != null && !p.offline && (
        <div className="tf-device-stepper">
          {p.onTarget && (
            <IconButton
              icon="minus"
              label={t.lowerTarget}
              size="sm"
              variant="soft"
              onClick={() => p.onTarget?.(p.target! - step)}
            />
          )}
          <span aria-live="polite">{t.targetTemp(temp(p.target))}</span>
          {p.onTarget && (
            <IconButton
              icon="plus"
              label={t.raiseTarget}
              size="sm"
              variant="soft"
              onClick={() => p.onTarget?.(p.target! + step)}
            />
          )}
        </div>
      )}
      {(p.battery != null || (p.actions && p.actions.length > 0)) && !p.offline && (
        <div className="tf-device-foot">
          {p.battery != null && (
            <span className={cx("tf-device-battery", p.battery <= 15 && "is-low")}>
              <Icon name="battery" size={14} />
              {t.batteryLevel(formatPercent(p.battery))}
            </span>
          )}
          {p.actions?.map((a) => (
            <Button key={a.label} variant="secondary" size="sm" icon={a.icon} onClick={a.onClick}>
              {a.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

/** An electric car: charge with its limit, range, charging, lock, climate and where it is. */
export function VehicleCard(p: VehicleCardProps) {
  const t = useStrings(CONNECTED_DATA_STRINGS);
  const { formatNumber, formatPercent, formatDate } = useFormat();
  const pct = Math.max(0, Math.min(100, p.battery));
  const state = p.charging;
  return (
    <div style={p.style} className={cx("tf-vehicle", p.className)}>
      <div className="tf-vehicle-head">
        <span className="tf-option-text">
          <b>{p.name}</b>
          {p.model && <small>{p.model}</small>}
        </span>
        <Source s={p.service} />
      </div>
      <div className="tf-vehicle-charge">
        <span className="tf-vehicle-pct">{formatPercent(pct)}</span>
        {p.range != null && (
          <span className="tf-vehicle-range">
            {t.rangeLeft(formatNumber(p.range, { style: "unit", unit: "kilometer" }))}
          </span>
        )}
      </div>
      <div className="tf-vehicle-bar">
        <div
          className={cx("tf-vehicle-fill", state === "charging" && "is-charging")}
          role="progressbar"
          aria-label={t.batteryLevel(formatPercent(pct))}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          style={{ width: pct + "%" }}
        />
        {p.limit != null && (
          <span className="tf-vehicle-limit" style={{ left: p.limit + "%" }} aria-hidden />
        )}
      </div>
      <p className="tf-vehicle-line">
        {state && (
          <span className={cx("tf-vehicle-state", "is-" + state)}>
            <Icon name={state === "charging" ? "batteryCharging" : "battery"} size={14} />
            {t.chargingStates[state]}
            {state === "charging" && p.power != null && (
              <> · {formatNumber(p.power, { maximumFractionDigits: 1 }) + " kW"}</>
            )}
          </span>
        )}
        {state === "charging" && p.until != null && (
          <span>{t.chargedBy(formatDate(p.until, { hour: "numeric", minute: "2-digit" }))}</span>
        )}
        {p.limit != null && <span>{t.chargeLimit(formatPercent(p.limit))}</span>}
      </p>
      {p.location && (
        <p className="tf-vehicle-line">
          <span>
            <Icon name="mapPin" size={14} />
            {p.location}
          </span>
        </p>
      )}
      <div className="tf-vehicle-controls">
        {p.locked != null && (
          <Button
            variant="secondary"
            size="sm"
            icon={p.locked ? "lock" : "lockOpen"}
            aria-pressed={p.locked}
            onClick={p.onLock ? () => p.onLock?.(!p.locked) : undefined}
            disabled={!p.onLock}
          >
            {t.lockAction}
          </Button>
        )}
        {p.climateOn != null && (
          <Button
            variant="secondary"
            size="sm"
            icon="fan"
            aria-pressed={p.climateOn}
            onClick={p.onClimate ? () => p.onClimate?.(!p.climateOn) : undefined}
            disabled={!p.onClimate}
          >
            {t.climateLabel}
          </Button>
        )}
        <span className="tf-vehicle-inside">
          {[
            p.locked != null ? (p.locked ? t.lockedState : t.unlockedState) : null,
            p.climateOn != null ? (p.climateOn ? t.climateOnLabel : t.climateOffLabel) : null,
            p.inside != null
              ? t.insideTemp(formatNumber(p.inside, { maximumFractionDigits: 0 }) + " °C")
              : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </div>
    </div>
  );
}

function clock(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

/** What is playing: cover, title, artist, where it plays, progress and the transport buttons. */
export function NowPlaying(p: NowPlayingProps) {
  const t = useStrings(CONNECTED_DATA_STRINGS);
  const pos = p.position ?? 0;
  const dur = p.duration ?? 0;
  const pct = dur ? Math.min(100, (pos / dur) * 100) : 0;
  return (
    <div style={p.style} className={cx("tf-nowplaying", p.className)}>
      <div className="tf-nowplaying-art" aria-hidden={!p.art}>
        {p.art || <Icon name="play" size={22} />}
      </div>
      <div className="tf-nowplaying-main">
        <div className="tf-nowplaying-head">
          <span className="tf-option-text">
            <b>{p.title}</b>
            {(p.artist || p.album) && (
              <small>{[p.artist, p.album].filter(Boolean).join(" · ")}</small>
            )}
          </span>
          <Source s={p.service} />
        </div>
        {dur > 0 && (
          <div className="tf-nowplaying-progress">
            <div
              className="tf-nowplaying-bar"
              role="progressbar"
              aria-label={p.title}
              aria-valuemin={0}
              aria-valuemax={Math.round(dur)}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={`${clock(pos)} / ${clock(dur)}`}
            >
              <span style={{ width: pct + "%" }} />
            </div>
            <span className="tf-nowplaying-times" aria-hidden>
              <span>{clock(pos)}</span>
              <span>{clock(dur)}</span>
            </span>
          </div>
        )}
        <div className="tf-nowplaying-foot">
          {p.device && <span className="tf-nowplaying-device">{t.playingOn(p.device)}</span>}
          <span className="tf-nowplaying-controls">
            {p.onPrevious && (
              <IconButton
                icon="skipBack"
                label={t.previousTrack}
                size="sm"
                variant="ghost"
                onClick={p.onPrevious}
              />
            )}
            {p.onPlayPause && (
              <IconButton
                icon={p.playing ? "pause" : "play"}
                label={p.playing ? t.pauseAction : t.playAction}
                variant="solid"
                onClick={p.onPlayPause}
              />
            )}
            {p.onNext && (
              <IconButton
                icon="skipForward"
                label={t.nextTrack}
                size="sm"
                variant="ghost"
                onClick={p.onNext}
              />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

const ZONE_FILL = ["sky", "mint", "butter", "lilac", "blush"] as const;

/** One workout: type, when, duration, distance, calories, heart rate and time in each zone. */
export function WorkoutCard(p: WorkoutCardProps) {
  const t = useStrings(CONNECTED_DATA_STRINGS);
  const { formatNumber, formatDate } = useFormat();
  const zones = p.zones || [];
  const zoneTotal = zones.reduce((a, b) => a + b, 0);
  const stats: [string, string][] = [
    [t.durationLabel, t.durationHm(Math.floor(p.duration / 60), Math.round(p.duration % 60))],
  ];
  if (p.distance != null)
    stats.push([
      t.distanceLabel,
      formatNumber(p.distance, { style: "unit", unit: "kilometer", maximumFractionDigits: 1 }),
    ]);
  if (p.calories != null) stats.push([t.caloriesLabel, formatNumber(p.calories) + " kcal"]);
  if (p.heartRate != null) stats.push([t.avgHeartRate, formatNumber(p.heartRate) + " bpm"]);
  return (
    <div style={p.style} className={cx("tf-workout", p.className)}>
      <div className="tf-workout-head">
        <TintIcon icon={p.icon || "activity"} tint="mint" size={36} />
        <span className="tf-option-text">
          <b>{p.type}</b>
          <small>
            {formatDate(p.date, {
              weekday: "short",
              day: "numeric",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
            })}
          </small>
        </span>
        <Source s={p.service} />
      </div>
      <dl className="tf-workout-stats">
        {stats.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {zoneTotal > 0 && (
        <div className="tf-workout-zones">
          <span className="tf-workout-zones-title">{t.heartRateZones}</span>
          <div className="tf-workout-zonebar" aria-hidden>
            {zones.map((m, i) =>
              m > 0 ? (
                <span key={i} className={"tf-sf-" + ZONE_FILL[i % 5]} style={{ flexGrow: m }} />
              ) : null,
            )}
          </div>
          <ul className="tf-workout-legend">
            {zones.map((m, i) => (
              <li key={i}>
                <i className={"tf-sf-" + ZONE_FILL[i % 5]} aria-hidden />
                {t.zoneMinutes(i + 1, Math.round(m))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const DAY = 86400000;
function dayStart(v: Date | string | number): number {
  const d = new Date(v);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}
const CALL_ICON: Record<CallItem["direction"], IconName> = {
  incoming: "phoneIncoming",
  outgoing: "phoneOutgoing",
  missed: "phoneMissed",
};

/** Your calls, newest first by day: who, which direction, how long, what it was about. */
export function CallLog(p: CallLogProps) {
  const t = useStrings(CONNECTED_DATA_STRINGS);
  const { formatDate, locale } = useFormat();
  const now = p.now ?? Date.now();
  const sorted = [...p.calls].sort((a, b) => +new Date(b.at) - +new Date(a.at));
  const groups: { key: number; items: CallItem[] }[] = [];
  for (const c of sorted) {
    const k = dayStart(c.at);
    const last = groups[groups.length - 1];
    if (last && last.key === k) last.items.push(c);
    else groups.push({ key: k, items: [c] });
  }
  const heading = (k: number, sample: CallItem["at"]) => {
    const diff = Math.round((k - dayStart(now)) / DAY);
    if (diff === 0 || diff === -1) {
      try {
        const w = new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(diff, "day");
        return w.charAt(0).toLocaleUpperCase(locale) + w.slice(1);
      } catch {
        /* fall through to the date */
      }
    }
    return formatDate(sample, { weekday: "long", day: "numeric", month: "long" });
  };
  const length = (s: number) =>
    t.durationHm(Math.floor(s / 3600), Math.max(1, Math.round((s % 3600) / 60)));
  return (
    <div style={p.style} className={cx("tf-calls", p.className)}>
      {groups.map((g) => (
        <section key={g.key} className="tf-calls-day" aria-label={heading(g.key, g.items[0]!.at)}>
          <h3 className="tf-agentlog-title" aria-hidden>
            {heading(g.key, g.items[0]!.at)}
          </h3>
          <ul aria-label={p.label || t.calls}>
            {g.items.map((c) => (
              <li key={c.id} className={cx("tf-call", "is-" + c.direction)}>
                <span className="tf-call-ico" aria-hidden>
                  <Icon name={CALL_ICON[c.direction]} size={15} />
                </span>
                <div className="tf-call-main">
                  {p.onOpen ? (
                    <button type="button" className="tf-call-name" onClick={() => p.onOpen?.(c.id)}>
                      {c.name}
                    </button>
                  ) : (
                    <b className="tf-call-name">{c.name}</b>
                  )}
                  <span className="tf-call-meta">
                    {[
                      t.callDirections[c.direction],
                      formatDate(c.at, { hour: "numeric", minute: "2-digit" }),
                      c.direction !== "missed" && c.duration ? length(c.duration) : null,
                      c.number,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                  {c.summary && <p className="tf-call-summary">{c.summary}</p>}
                </div>
                {p.onCall && (
                  <IconButton
                    icon="phoneCall"
                    label={t.callPerson(c.name)}
                    size="sm"
                    variant="soft"
                    onClick={() => p.onCall?.(c.id)}
                  />
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const RES_ICON: Record<ReservationCardProps["kind"], IconName> = {
  stay: "bedDouble",
  flight: "plane",
  train: "trainFront",
  ride: "carFront",
  order: "package",
  event: "ticket",
};
const RES_TINT = {
  stay: "lilac",
  flight: "sky",
  train: "mint",
  ride: "butter",
  order: "butter",
  event: "blush",
} as const;
const RES_TONE = {
  confirmed: "success",
  pending: "neutral",
  cancelled: "danger",
  delayed: "warning",
  onTheWay: "info",
  delivered: "success",
} as const;

/** A booking or order (stay, flight, train, ride, delivery, ticket) with its time, place, code and status. */
export function ReservationCard(p: ReservationCardProps) {
  const t = useStrings(CONNECTED_DATA_STRINGS);
  const { formatDate } = useFormat();
  const day = { weekday: "short", day: "numeric", month: "short" } as const;
  const time = { hour: "numeric", minute: "2-digit" } as const;
  const sameDay = p.end != null && dayStart(p.start) === dayStart(p.end);
  const when =
    p.kind === "stay" && p.end != null
      ? `${formatDate(p.start, day)} – ${formatDate(p.end, day)}`
      : p.end != null
        ? sameDay
          ? `${formatDate(p.start, day)}, ${formatDate(p.start, time)} – ${formatDate(p.end, time)}`
          : `${formatDate(p.start, { ...day, ...time })} – ${formatDate(p.end, { ...day, ...time })}`
        : formatDate(p.start, { ...day, ...time });
  return (
    <div
      style={p.style}
      className={cx("tf-booking", "kind-" + p.kind, p.status && "is-" + p.status, p.className)}
    >
      <div className="tf-booking-head">
        <TintIcon icon={RES_ICON[p.kind]} tint={RES_TINT[p.kind]} size={36} />
        <span className="tf-option-text">
          <b>{p.title}</b>
          {p.subtitle && <small>{p.subtitle}</small>}
        </span>
        <Source s={p.service} />
      </div>
      <p className="tf-booking-when">{when}</p>
      {p.place && (
        <p className="tf-booking-place">
          <Icon name="mapPin" size={14} />
          {p.place}
        </p>
      )}
      {(p.status || p.code) && (
        <div className="tf-booking-foot">
          {p.status && (
            <Badge tone={RES_TONE[p.status]} dot>
              {t.reservationStatus[p.status]}
              {p.statusText && " · " + p.statusText}
            </Badge>
          )}
          {p.code && (
            <span className="tf-booking-code">
              {t.bookingCode} <b>{p.code}</b>
            </span>
          )}
        </div>
      )}
      {p.actions && <div className="tf-booking-actions">{p.actions}</div>}
    </div>
  );
}

function scoreName(diff: number): "eagle" | "birdie" | "par" | "bogey" | "double" {
  return diff <= -2
    ? "eagle"
    : diff === -1
      ? "birdie"
      : diff === 0
        ? "par"
        : diff === 1
          ? "bogey"
          : "double";
}

/**
 * A round of golf as a scorecard: par and strokes per hole with the usual marks (circle for a
 * birdie, square for a bogey), putts, Out, In and the total against par.
 */
export function Scorecard(p: ScorecardProps) {
  const t = useStrings(CONNECTED_DATA_STRINGS);
  const { formatDate } = useFormat();
  const halves = p.holes.length > 9 ? [p.holes.slice(0, 9), p.holes.slice(9)] : [p.holes];
  const sum = (hs: typeof p.holes, k: "par" | "strokes" | "putts") =>
    hs.reduce((a, h) => a + (h[k] ?? 0), 0);
  const played = p.holes.filter((h) => h.strokes != null);
  const strokes = sum(played, "strokes");
  const parPlayed = sum(played, "par");
  const hasPutts = p.holes.some((h) => h.putts != null);
  return (
    <div style={p.style} className={cx("tf-scorecard", p.className)}>
      <div className="tf-scorecard-head">
        <span className="tf-option-text">
          <b>{p.course}</b>
          <small>
            {[
              p.date != null
                ? formatDate(p.date, { day: "numeric", month: "short", year: "numeric" })
                : null,
              p.tee,
            ]
              .filter(Boolean)
              .join(" · ")}
          </small>
        </span>
        <Source s={p.service} />
        <span className="tf-scorecard-total">
          <b>{strokes}</b>
          <small>{t.toPar(strokes - parPlayed)}</small>
        </span>
      </div>
      {halves.map((hs, half) => {
        const first = half * 9;
        return (
          <div key={half} className="tf-scorecard-scroll">
            <table className="tf-scorecard-table">
              <caption className="tf-sidebar-sr">
                {p.course} {half ? t.scoreLabels.in : t.scoreLabels.out}
              </caption>
              <thead>
                <tr>
                  <th scope="row">{t.scoreLabels.hole}</th>
                  {hs.map((_, i) => (
                    <th key={i} scope="col">
                      {first + i + 1}
                    </th>
                  ))}
                  <th scope="col">
                    {half
                      ? t.scoreLabels.in
                      : halves.length > 1
                        ? t.scoreLabels.out
                        : t.scoreLabels.total}
                  </th>
                  {half === 1 && <th scope="col">{t.scoreLabels.total}</th>}
                </tr>
              </thead>
              <tbody>
                <tr className="tf-scorecard-par">
                  <th scope="row">{t.scoreLabels.par}</th>
                  {hs.map((h, i) => (
                    <td key={i}>{h.par}</td>
                  ))}
                  <td>{sum(hs, "par")}</td>
                  {half === 1 && <td>{sum(p.holes, "par")}</td>}
                </tr>
                <tr>
                  <th scope="row">{t.scoreLabels.score}</th>
                  {hs.map((h, i) => {
                    if (h.strokes == null) return <td key={i} />;
                    const n = scoreName(h.strokes - h.par);
                    return (
                      <td key={i}>
                        <span className={cx("tf-score", "is-" + n)} aria-hidden>
                          {h.strokes}
                        </span>
                        <span className="tf-sidebar-sr">
                          {h.strokes}, {t.scoreNames[n]}
                        </span>
                      </td>
                    );
                  })}
                  <td>
                    <b>{sum(hs, "strokes")}</b>
                  </td>
                  {half === 1 && (
                    <td>
                      <b>{strokes}</b>
                    </td>
                  )}
                </tr>
                {hasPutts && (
                  <tr className="tf-scorecard-putts">
                    <th scope="row">{t.scoreLabels.putts}</th>
                    {hs.map((h, i) => (
                      <td key={i}>{h.putts ?? ""}</td>
                    ))}
                    <td>{sum(hs, "putts")}</td>
                    {half === 1 && <td>{sum(p.holes, "putts")}</td>}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      })}
      <ul className="tf-scorecard-legend" aria-hidden>
        {(["eagle", "birdie", "bogey", "double"] as const).map((n) => (
          <li key={n}>
            <span className={cx("tf-score", "is-" + n)}> </span>
            {t.scoreNames[n]}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Positions in a portfolio: value, change over a period in words and colour, and their share. */
export function HoldingsList(p: HoldingsListProps) {
  const t = useStrings(CONNECTED_DATA_STRINGS);
  const { formatMoney, formatPercent } = useFormat();
  return (
    <ul
      style={p.style}
      className={cx("tf-holdings", p.className)}
      aria-label={p.label || t.holdings}
    >
      {p.holdings.map((h) => {
        const dir = h.change == null || h.change === 0 ? "flat" : h.change > 0 ? "up" : "down";
        const body = (
          <>
            <span className="tf-option-text">
              <b>{h.name}</b>
              {h.symbol && <small>{h.symbol}</small>}
            </span>
            <span className="tf-holding-nums">
              <b>{formatMoney(h.value, p.currency, { maximumFractionDigits: 0 })}</b>
              {h.change != null && (
                <small className={cx("tf-holding-change", "is-" + dir)}>
                  {dir !== "flat" && <Icon name="arrowUp" size={11} />}
                  {formatPercent(h.change, { signDisplay: "exceptZero", maximumFractionDigits: 1 })}
                  {p.period && " " + p.period}
                </small>
              )}
            </span>
            {h.weight != null && (
              <span className="tf-holding-weight">
                <span className="tf-holding-bar" aria-hidden>
                  <span style={{ width: Math.min(100, h.weight) + "%" }} />
                </span>
                <small>{t.portfolioShare(formatPercent(h.weight))}</small>
              </span>
            )}
          </>
        );
        return (
          <li key={h.id}>
            {p.onSelect ? (
              <button type="button" className="tf-holding" onClick={() => p.onSelect?.(h.id)}>
                {body}
              </button>
            ) : (
              <div className="tf-holding">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
