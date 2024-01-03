type Flight = {
  id: string;
  user: string;

  date: string;
  aircraft: string | null;
  waypoint_from: string | null;
  waypoint_to: string | null;
  route: string | null;

  hobbs_start: number | null;
  hobbs_end: number | null;
  tach_start: number | null;
  tach_end: number | null;

  time_start: number | null;
  time_off: number | null;
  time_down: number | null;
  time_stop: number | null;

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

export { type Flight };
