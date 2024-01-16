import {
  AircraftFormSchema,
  AircraftSchema,
  FlightFormSchema,
} from "@/util/types";
import {
  ActionIcon,
  Button,
  CloseButton,
  Container,
  Fieldset,
  Group,
  Loader,
  Modal,
  NumberInput,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { HourInput, ZeroHourInput } from "./hour-input";
import TimeInput from "./time-input";
import { ZeroIntInput } from "./int-input";
import ListInput from "./list-input";
import { IconPencil, IconPlaneTilt, IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import AircraftForm from "./aircraft-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/util/api";
import { useAircraft } from "@/util/hooks";
import { useEffect, useState } from "react";
import ImageUpload from "./image-upload";
import ImageListInput from "./image-list-input";

export default function FlightForm({
  onSubmit,
  isPending,
  isError,
  error,
  initialValues,
  mah,
  submitButtonLabel,
  withCancelButton,
  cancelFunc,
  autofillHobbs = false,
}: {
  onSubmit: (values: FlightFormSchema) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  initialValues?: FlightFormSchema | null;
  mah?: string;
  submitButtonLabel?: string;
  withCancelButton?: boolean;
  cancelFunc?: () => void;
  autofillHobbs?: boolean;
}) {
  const validate_time = (value: number | null) => {
    if (value === null) return;
    if (value > 2359) return "Time must be between 0000 and 2359";
    if (value % 100 > 59) return "Minutes must not exceed 59";
  };

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

      existing_images: [],
      images: [],
    },
    validate: {
      aircraft: (value) =>
        value?.length ?? 0 > 0 ? null : "Please select an aircraft",
      time_start: (value) => validate_time(value),
      time_off: (value) => validate_time(value),
      time_down: (value) => validate_time(value),
      time_stop: (value) => validate_time(value),
    },
  });
  const [aircraftOpened, { open: openAircraft, close: closeAircraft }] =
    useDisclosure(false);

  const client = useApi();
  const queryClient = useQueryClient();

  const addAircraft = useMutation({
    mutationFn: async (values: AircraftFormSchema) => {
      const newAircraft = values;
      if (newAircraft) {
        const res = await client.post("/aircraft", newAircraft);
        return res.data;
      }
      throw new Error("Aircraft creation failed");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["aircraft-list"] });
      close();
    },
  });

  const [aircraft, setAircraft] = useState<string | null>(
    initialValues?.aircraft ?? ""
  );

  const [hobbsTouched, setHobbsTouched] = useState(false);

  const getHobbs = useQuery({
    queryKey: ["hobbs", aircraft],
    queryFn: async () =>
      await client.get(`/aircraft/tail/${aircraft}`).then((res) => res.data),
    enabled: !!aircraft && aircraft !== "",
  });

  const getAircraft = useAircraft();

  useEffect(() => {
    if (autofillHobbs && getHobbs.isFetched && getHobbs.data && !hobbsTouched) {
      form.setFieldValue(
        "hobbs_start",
        getHobbs.data.hobbs ?? form.getTransformedValues()["hobbs_start"]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getHobbs.data]);

  return (
    <>
      <Modal
        opened={aircraftOpened}
        onClose={closeAircraft}
        title="New Aircraft"
        centered
      >
        <AircraftForm
          onSubmit={addAircraft.mutate}
          isError={addAircraft.isError}
          error={addAircraft.error}
          isPending={addAircraft.isPending}
          submitButtonLabel="Add"
          withCancelButton
          cancelFunc={closeAircraft}
        />
      </Modal>
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <ScrollArea.Autosize mah={mah}>
          <Container>
            {/* Date and Aircraft */}

            <Fieldset>
              <Group justify="center" grow>
                <DatePickerInput
                  label="Date"
                  {...form.getInputProps("date")}
                  withAsterisk
                />
                <Select
                  label={
                    <Group gap="0">
                      <Text size="sm" fw={700} span>
                        Aircraft
                      </Text>
                      <Text
                        pl="0.3rem"
                        style={{ color: "var(--mantine-color-error)" }}
                        span
                      >
                        *
                      </Text>

                      <Tooltip label="Add Aircraft">
                        <ActionIcon
                          variant="transparent"
                          onClick={openAircraft}
                        >
                          <IconPlus size="1rem" />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  }
                  data={
                    getAircraft.isFetched
                      ? getAircraft.data?.map((item: AircraftSchema) => ({
                          value: item.tail_no,
                          label: item.tail_no,
                        }))
                      : initialValues
                      ? [
                          {
                            value: initialValues?.aircraft,
                            label: initialValues?.aircraft,
                          },
                        ]
                      : null
                  }
                  allowDeselect={false}
                  value={aircraft}
                  {...form.getInputProps("aircraft")}
                  onChange={(_value, option) => {
                    form.setFieldValue("aircraft", option.label);
                    setAircraft(option.label);
                    queryClient.invalidateQueries({
                      queryKey: ["hobbs", aircraft],
                    });
                  }}
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
                <NumberInput
                  label={
                    <Group gap="0">
                      <Text size="sm" fw={700} span>
                        Hobbs Start
                      </Text>

                      <Tooltip
                        label={
                          getHobbs.isFetched &&
                          getHobbs.data &&
                          getHobbs.data.hobbs ===
                            form.getTransformedValues()["hobbs_start"]
                            ? "Using aircraft time"
                            : "Use Aircraft Time"
                        }
                      >
                        <ActionIcon
                          variant="transparent"
                          disabled={
                            !(
                              getHobbs.isFetched &&
                              getHobbs.data &&
                              getHobbs.data.hobbs !==
                                form.getTransformedValues()["hobbs_start"]
                            )
                          }
                          style={
                            !(
                              getHobbs.isFetched &&
                              getHobbs.data &&
                              getHobbs.data.hobbs !==
                                form.getTransformedValues()["hobbs_start"]
                            )
                              ? { backgroundColor: "transparent" }
                              : {}
                          }
                          onClick={() =>
                            form.setFieldValue(
                              "hobbs_start",
                              getHobbs.data?.hobbs ?? 0.0
                            )
                          }
                        >
                          <IconPlaneTilt size="1rem" />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  }
                  decimalScale={1}
                  step={0.1}
                  min={0}
                  fixedDecimalScale
                  leftSection={
                    <CloseButton
                      aria-label="Clear input"
                      onClick={() => form.setFieldValue("hobbs_start", "")}
                      style={{
                        display:
                          ["", null].indexOf(
                            form.getTransformedValues()["hobbs_start"] as
                              | string
                              | null
                          ) > -1
                            ? "none"
                            : undefined,
                      }}
                    />
                  }
                  {...form.getInputProps("hobbs_start")}
                  onChange={(e) => {
                    form.setFieldValue("hobbs_start", e);
                    setHobbsTouched(true);
                  }}
                />
                <HourInput form={form} field="hobbs_end" label="Hobbs End" />
              </Group>
            </Fieldset>

            {/* Start/Stop */}

            <Fieldset legend="Start/Stop" mt="md">
              <Group justify="center" grow>
                <TimeInput
                  form={form}
                  field="time_start"
                  label="Start Time"
                  allowLeadingZeros
                />
                <TimeInput
                  form={form}
                  field="time_off"
                  label="Time Off"
                  allowLeadingZeros
                />
              </Group>
              <Group justify="center" grow mt="md">
                <TimeInput
                  form={form}
                  field="time_down"
                  label="Time Down"
                  allowLeadingZeros
                />
                <TimeInput
                  form={form}
                  field="time_stop"
                  label="Stop Time"
                  allowLeadingZeros
                />
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
                <ZeroIntInput
                  form={form}
                  field="landings_night"
                  label="Night"
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
              {initialValues?.existing_images?.length ?? 0 > 0 ? (
                <ImageListInput
                  form={form}
                  field="existing_images"
                  mt="md"
                  label="Existing Images"
                  // canAdd={false}
                />
              ) : null}
              <ImageUpload
                form={form}
                mt="md"
                field="images"
                label="Images"
                placeholder="Upload Images"
              />
            </Fieldset>
          </Container>
        </ScrollArea.Autosize>

        <Group justify="flex-end" mt="md">
          {isPending ? (
            <Loader />
          ) : isError ? (
            <Text c="red" fw={700}>
              {error?.message}
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
    </>
  );
}
