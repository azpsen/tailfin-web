import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

type FlightBaseSchema = {
  aircraft: string | null;
  waypoint_from: string | null;
  waypoint_to: string | null;
  route: string | null;

  hobbs_start: number | null;
  hobbs_end: number | null;
  tach_start: number | null;
  tach_end: number | null;

  time_total: number;
  time_pic: number;
  time_sic: number;
  time_night: number;
  time_solo: number;

  time_xc: number;
  dist_xc: number;

  takeoffs_day: number;
  landings_day: number;
  takeoffs_night: number;
  landings_night: number;

  time_instrument: number;
  time_sim_instrument: number;
  holds_instrument: number;

  dual_given: number;
  dual_recvd: number;
  time_sim: number;
  time_ground: number;

  tags: string[];

  pax: string[];
  crew: string[];

  comments: string;
};

type FlightFormSchema = FlightBaseSchema & {
  date: dayjs.Dayjs;

  time_start: number | null;
  time_off: number | null;
  time_down: number | null;
  time_stop: number | null;
};

type FlightCreateSchema = FlightBaseSchema & {
  date: string;

  time_start: string;
  time_off: string;
  time_down: string;
  time_stop: string;
};

type FlightDisplaySchema = FlightBaseSchema & {
  id: string;
  user: string;
  date: dayjs.Dayjs;

  time_start: number | null;
  time_off: number | null;
  time_down: number | null;
  time_stop: number | null;
};

type FlightConciseSchema = {
  user: string;
  id: string;

  date: string;
  aircraft: string;
  waypoint_from: string;
  waypoint_to: string;

  time_total: number;

  comments: string;
};

const flightCreateHelper = (
  values: FlightFormSchema
): FlightCreateSchema | void => {
  const date = dayjs(values.date);
  try {
    const newFlight = {
      ...values,
      date: date.utc().startOf("day").toISOString(),
      hobbs_start: values.hobbs_start ? Number(values.hobbs_start) : null,
      hobbs_end: values.hobbs_end ? Number(values.hobbs_end) : null,
      tach_start: values.tach_start ? Number(values.tach_start) : null,
      tach_end: values.tach_end ? Number(values.tach_end) : null,
      time_start: date
        .utc()
        .hour(Math.floor((values.time_start ?? 0) / 100))
        .minute(Math.floor((values.time_start ?? 0) % 100))
        .second(0)
        .millisecond(0)
        .toISOString(),
      time_off: date
        .utc()
        .hour(Math.floor((values.time_off ?? 0) / 100))
        .minute(Math.floor((values.time_off ?? 0) % 100))
        .second(0)
        .millisecond(0)
        .toISOString(),
      time_down: date
        .utc()
        .hour(Math.floor((values.time_down ?? 0) / 100))
        .minute(Math.floor((values.time_down ?? 0) % 100))
        .second(0)
        .millisecond(0)
        .toISOString(),
      time_stop: date
        .utc()
        .hour(Math.floor((values.time_stop ?? 0) / 100))
        .minute(Math.floor((values.time_stop ?? 0) % 100))
        .second(0)
        .millisecond(0)
        .toISOString(),
    };
    return newFlight;
  } catch (err) {
    console.log(err);
  }
};

const flightEditHelper = (
  values: FlightCreateSchema
): FlightFormSchema | void => {
  try {
    const flight = {
      ...values,
      date: dayjs(values.date),
      time_start: Number(
        `${dayjs(values.time_start).hour()}${dayjs(values.time_start).minute()}`
      ),
      time_off: Number(
        `${dayjs(values.time_off).hour()}${dayjs(values.time_off).minute()}`
      ),
      time_down: Number(
        `${dayjs(values.time_down).hour()}${dayjs(values.time_down).minute()}`
      ),
      time_stop: Number(
        `${dayjs(values.time_stop).hour()}${dayjs(values.time_stop).minute()}`
      ),
    };
    return flight;
  } catch (err) {
    console.log(err);
  }
};

export {
  flightEditHelper,
  flightCreateHelper,
  type FlightFormSchema,
  type FlightCreateSchema,
  type FlightDisplaySchema,
  type FlightConciseSchema,
};
