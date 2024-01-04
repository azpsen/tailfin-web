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

  time_start: dayjs.Dayjs;
  time_off: dayjs.Dayjs;
  time_down: dayjs.Dayjs;
  time_stop: dayjs.Dayjs;
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

const flightCreateHelper = (values: FlightFormSchema): FlightCreateSchema => {
  return {
    ...values,
    date: values.date.utc().startOf("day").toISOString(),
    hobbs_start: Number(values.hobbs_start),
    hobbs_end: Number(values.hobbs_end),
    tach_start: Number(values.tach_start),
    tach_end: Number(values.tach_end),
    time_start: values.date
      .utc()
      .hour(values.time_start ?? 0 / 100)
      .minute(values.time_start ?? 0 % 100),
    time_off: values.date
      .utc()
      .hour(values.time_off ?? 0 / 100)
      .minute(values.time_off ?? 0 % 100),
    time_down: values.date
      .utc()
      .hour(values.time_down ?? 0 / 100)
      .minute(values.time_down ?? 0 % 100),
    time_stop: values.date
      .utc()
      .hour(values.time_stop ?? 0 / 100)
      .minute(values.time_stop ?? 0 % 100),
  };
};

export {
  flightCreateHelper,
  type FlightFormSchema,
  type FlightCreateSchema,
  type FlightDisplaySchema,
  type FlightConciseSchema,
};
