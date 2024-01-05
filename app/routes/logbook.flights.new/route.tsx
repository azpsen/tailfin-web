import {
  Button,
  CloseButton,
  Container,
  Fieldset,
  Group,
  NumberInput,
  ScrollAreaAutosize,
  Stack,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { IconPencil } from "@tabler/icons-react";
import TimeInput from "@/ui/form/time-input";
import { FlightFormSchema, flightCreateHelper } from "@/util/types";
import { HourInput, ZeroHourInput } from "@/ui/form/hour-input";
import { ZeroIntInput } from "@/ui/form/int-input";
import ListInput from "@/ui/form/list-input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/util/api";
import { useNavigate } from "@remix-run/react";
import { useAuth } from "@/util/auth";
import { AxiosError } from "axios";

export default function NewFlight() {
  const form = useForm<FlightFormSchema>({
    initialValues: {
      date: dayjs(),
      aircraft: "",
      waypoint_from: "",
      waypoint_to: "",
      route: "",

      hobbs_start: null,
      hobbs_end: null,
      tach_start: null,
      tach_end: null,

      time_start: null,
      time_off: null,
      time_down: null,
      time_stop: null,

      time_total: 0.0,
      time_pic: 0.0,
      time_sic: 0.0,
      time_night: 0.0,
      time_solo: 0.0,

      time_xc: 0.0,
      dist_xc: 0.0,

      takeoffs_day: 0,
      landings_day: 0,
      takeoffs_night: 0,
      landings_night: 0,

      time_instrument: 0.0,
      time_sim_instrument: 0.0,
      holds_instrument: 0,

      dual_given: 0.0,
      dual_recvd: 0.0,
      time_sim: 0.0,
      time_ground: 0.0,

      tags: [],

      pax: [],
      crew: [],

      comments: "",
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const client = useApi();

  const { clearUser } = useAuth();

  const createFlight = useMutation({
    mutationFn: async (values: FlightFormSchema) => {
      const newFlight = flightCreateHelper(values);
      const res = await client.post("/flights", newFlight);
      return res.data;
    },
    retry: (failureCount, error: AxiosError) => {
      return !error || error.response?.status !== 401;
    },
    onError: (error: AxiosError) => {
      console.log(error);
      if (error.response?.status === 401) {
        clearUser();
        navigate("/login");
      }
    },
    onSuccess: async (data: { id: string }) => {
      await queryClient.invalidateQueries({ queryKey: ["flights-list"] });
      navigate(`/logbook/flights/${data.id}`);
    },
  });

  return (
    <Container>
      <Stack>
        <Title order={2}>New Flight</Title>

        <form onSubmit={form.onSubmit((values) => createFlight.mutate(values))}>
          <ScrollAreaAutosize mah="calc(100vh - 95px - 110px)">
            <Container>
              {/* Date and Aircraft */}

              <Fieldset>
                <Group justify="center" grow>
                  <DatePickerInput
                    label="Date"
                    {...form.getInputProps("date")}
                  />
                  <TextInput
                    label="Aircraft"
                    {...form.getInputProps("aircraft")}
                  />
                </Group>
              </Fieldset>

              {/* Route */}

              <Fieldset legend="Route" mt="lg">
                <Group justify="center" grow>
                  <TextInput
                    label="Waypoint From"
                    {...form.getInputProps("waypoint_from")}
                  />
                  <TextInput
                    label="Waypoint To"
                    {...form.getInputProps("waypoint_to")}
                  />
                </Group>
                <TextInput
                  label="Route"
                  {...form.getInputProps("route")}
                  mt="md"
                />
              </Fieldset>

              {/* Times */}

              <Fieldset legend="Times" mt="md">
                <Group justify="center" grow>
                  <HourInput
                    form={form}
                    field="hobbs_start"
                    label="Hobbs Start"
                  />
                  <HourInput form={form} field="hobbs_end" label="Hobbs End" />
                </Group>
                <Group justify="center" grow mt="md">
                  <HourInput
                    form={form}
                    field="tach_start"
                    label="Tach Start"
                  />
                  <HourInput form={form} field="tach_end" label="Tach End" />
                </Group>
              </Fieldset>

              {/* Start/Stop */}

              <Fieldset legend="Start/Stop" mt="md">
                <Group justify="center" grow>
                  <TimeInput
                    form={form}
                    field="time_start"
                    label="Start Time"
                  />
                  <TimeInput form={form} field="time_stop" label="Stop Time" />
                </Group>
                <Group justify="center" grow mt="md">
                  <TimeInput form={form} field="time_off" label="Time Off" />
                  <TimeInput form={form} field="time_down" label="Time Down" />
                </Group>
              </Fieldset>

              {/* Hours */}

              <Fieldset legend="Hours" mt="md">
                <Group justify="center" grow>
                  <ZeroHourInput
                    form={form}
                    field="time_total"
                    label="Time Total"
                  />
                  <ZeroHourInput
                    form={form}
                    field="time_pic"
                    label="Time PIC"
                  />
                  <ZeroHourInput
                    form={form}
                    field="time_sic"
                    label="Time SIC"
                  />
                </Group>
                <Group justify="center" grow mt="md">
                  <ZeroHourInput
                    form={form}
                    field="time_night"
                    label="Time Night"
                  />
                  <ZeroHourInput
                    form={form}
                    field="time_solo"
                    label="Time Solo"
                  />
                </Group>
              </Fieldset>

              {/* Cross-Country */}

              <Fieldset legend="Cross-Country" mt="md">
                <Group justify="center" grow>
                  <ZeroHourInput
                    form={form}
                    field="time_xc"
                    label="Time Cross-Country"
                  />
                  <NumberInput
                    label="Distance Cross-Country"
                    decimalScale={2}
                    min={0}
                    fixedDecimalScale
                    leftSection={
                      <CloseButton
                        aria-label="Clear input"
                        onClick={() => form.setFieldValue("dist_xc", 0)}
                        style={{
                          display:
                            form.getTransformedValues().dist_xc == 0
                              ? "none"
                              : undefined,
                        }}
                      />
                    }
                    {...form.getInputProps("dist_xc")}
                  />
                </Group>
              </Fieldset>

              {/* Takeoffs and Landings */}

              <Fieldset legend="Takeoffs and Landings" mt="md">
                <Group justify="center" grow>
                  <ZeroIntInput
                    form={form}
                    field="takeoffs_day"
                    label="Day Takeoffs"
                  />
                  <ZeroIntInput
                    form={form}
                    field="landings_day"
                    label="Day Landings"
                  />
                </Group>
                <Group justify="center" grow mt="md">
                  <ZeroIntInput
                    form={form}
                    field="takeoffs_night"
                    label="Night Takeoffs"
                  />
                  <ZeroIntInput
                    form={form}
                    field="landings_night"
                    label="Night Landings"
                  />
                </Group>
              </Fieldset>

              {/* Instrument */}

              <Fieldset legend="Instrument" mt="md">
                <Group justify="center" grow>
                  <ZeroHourInput
                    form={form}
                    field="time_instrument"
                    label="Time Instrument"
                  />
                  <ZeroHourInput
                    form={form}
                    field="time_sim_instrument"
                    label="Time Sim Instrument"
                  />
                  <ZeroIntInput
                    form={form}
                    field="holds_instrument"
                    label="Instrument Holds"
                  />
                </Group>
              </Fieldset>

              {/* Instruction */}

              <Fieldset legend="Instruction" mt="md">
                <Group justify="center" grow>
                  <ZeroHourInput
                    form={form}
                    field="dual_given"
                    label="Dual Given"
                  />
                  <ZeroHourInput
                    form={form}
                    field="dual_recvd"
                    label="Dual Received"
                  />
                  <ZeroHourInput
                    form={form}
                    field="time_sim"
                    label="Sim Time"
                  />
                  <ZeroHourInput
                    form={form}
                    field="time_ground"
                    label="Ground Time"
                  />
                </Group>
              </Fieldset>

              {/* About the Flight */}

              <Fieldset legend="About" mt="md">
                <ListInput form={form} field="tags" label="Tags" />
                <Group justify="center" grow mt="md">
                  <ListInput form={form} field="pax" label="Pax" />
                  <ListInput form={form} field="crew" label="Crew" />
                </Group>
                <Textarea
                  label="Comments"
                  mt="md"
                  autosize
                  minRows={4}
                  {...form.getInputProps("comments")}
                />
              </Fieldset>
            </Container>
          </ScrollAreaAutosize>

          <Group justify="flex-end" mt="md">
            <Button type="submit" leftSection={<IconPencil />}>
              Create
            </Button>
          </Group>
        </form>
      </Stack>
    </Container>
  );
}
