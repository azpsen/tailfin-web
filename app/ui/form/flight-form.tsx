import { FlightFormSchema } from "@/util/types";
import {
  Button,
  CloseButton,
  Container,
  Fieldset,
  Group,
  NumberInput,
  ScrollArea,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { HourInput, ZeroHourInput } from "./hour-input";
import TimeInput from "./time-input";
import { ZeroIntInput } from "./int-input";
import ListInput from "./list-input";
import { IconPencil } from "@tabler/icons-react";
import { AxiosError } from "axios";

export default function FlightForm({
  onSubmit,
  isError,
  error,
  initialValues,
  mah,
  submitButtonLabel,
  withCancelButton,
  cancelFunc,
}: {
  onSubmit: (values: FlightFormSchema) => void;
  isError: boolean;
  error: Error | null;
  initialValues?: FlightFormSchema | null;
  mah?: string;
  submitButtonLabel?: string;
  withCancelButton?: boolean;
  cancelFunc?: () => void;
}) {
  const form = useForm<FlightFormSchema>({
    initialValues: initialValues ?? {
      date: dayjs(),
      aircraft: "",
      waypoint_from: "",
      waypoint_to: "",
      route: "",

      hobbs_start: null,
      hobbs_end: null,

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

      landings_day: 0,
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

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <ScrollArea.Autosize mah={mah}>
        <Container>
          {/* Date and Aircraft */}

          <Fieldset>
            <Group justify="center" grow>
              <DatePickerInput label="Date" {...form.getInputProps("date")} />
              <TextInput label="Aircraft" {...form.getInputProps("aircraft")} />
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
            <TextInput label="Route" {...form.getInputProps("route")} mt="md" />
          </Fieldset>

          {/* Times */}

          <Fieldset legend="Times" mt="md">
            <Group justify="center" grow>
              <HourInput form={form} field="hobbs_start" label="Hobbs Start" />
              <HourInput form={form} field="hobbs_end" label="Hobbs End" />
            </Group>
          </Fieldset>

          {/* Start/Stop */}

          <Fieldset legend="Start/Stop" mt="md">
            <Group justify="center" grow>
              <TimeInput form={form} field="time_start" label="Start Time" />
              <TimeInput form={form} field="time_off" label="Time Off" />
            </Group>
            <Group justify="center" grow mt="md">
              <TimeInput form={form} field="time_down" label="Time Down" />
              <TimeInput form={form} field="time_stop" label="Stop Time" />
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
              <ZeroHourInput form={form} field="time_pic" label="Time PIC" />
              <ZeroHourInput form={form} field="time_sic" label="Time SIC" />
            </Group>
            <Group justify="center" grow mt="md">
              <ZeroHourInput
                form={form}
                field="time_night"
                label="Time Night"
              />
              <ZeroHourInput form={form} field="time_solo" label="Time Solo" />
            </Group>
          </Fieldset>

          {/* Cross-Country */}

          <Fieldset legend="Cross-Country" mt="md">
            <Group justify="center" grow>
              <ZeroHourInput form={form} field="time_xc" label="Hours" />
              <NumberInput
                label="Distance"
                decimalScale={1}
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

          {/* Landings */}

          <Fieldset legend="Landings" mt="md">
            <Group justify="center" grow>
              <ZeroIntInput form={form} field="landings_day" label="Day" />
              <ZeroIntInput form={form} field="landings_night" label="Night" />
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
              <ZeroHourInput form={form} field="time_sim" label="Sim Time" />
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
      </ScrollArea.Autosize>

      <Group justify="flex-end" mt="md">
        {isError ? (
          <Text c="red" fw={700}>
            {error instanceof AxiosError
              ? error.response?.data.detail
              : error?.message}
          </Text>
        ) : null}
        {withCancelButton ? (
          <Button onClick={cancelFunc} color="gray">
            Cancel
          </Button>
        ) : null}
        <Button type="submit" leftSection={<IconPencil />}>
          {submitButtonLabel ?? "Create"}
        </Button>
      </Group>
    </form>
  );
}
