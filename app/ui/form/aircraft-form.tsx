import { useApi } from "@/util/api";
import { AircraftFormSchema } from "@/util/types";
import {
  Button,
  Container,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPencil, IconX } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";

export default function AircraftForm({
  onSubmit,
  isError,
  error,
  isPending,
  initialValues,
  submitButtonLabel,
  withCancelButton,
  cancelFunc,
}: {
  onSubmit: (values: AircraftFormSchema) => void;
  isError: boolean;
  error: Error | null;
  isPending: boolean;
  initialValues?: AircraftFormSchema | null;
  mah?: string;
  submitButtonLabel?: string;
  withCancelButton?: boolean;
  cancelFunc?: () => void;
}) {
  const newForm = useForm<AircraftFormSchema>({
    initialValues: initialValues ?? {
      tail_no: "",
      make: "",
      model: "",
      aircraft_category: "",
      aircraft_class: "",
      hobbs: 0.0,
    },
    validate: {
      tail_no: (value) =>
        value === null || value.trim() === ""
          ? "Please enter a tail number"
          : null,
      make: (value) =>
        value === null || value.trim() === "" ? "Please enter a make" : null,
      model: (value) =>
        value === null || value.trim() === "" ? "Please enter a model" : null,
      aircraft_category: (value) =>
        value === null || value.trim() === ""
          ? "Please select a category"
          : null,
      aircraft_class: (value) =>
        value === null || value.trim() === "" ? "Please select a class" : null,
    },
  });

  const client = useApi();
  const queryClient = useQueryClient();

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      await client.get(`/aircraft/categories`).then((res) => res.data),
  });

  const [category, setCategory] = useState("");
  const [classSelection, setClassSelection] = useState("");

  const classes = useQuery({
    queryKey: ["classes", category],
    queryFn: async () =>
      await client
        .get(`/aircraft/class?category=${category}`)
        .then((res) => res.data),
    enabled: !!category,
  });

  return (
    <form onSubmit={newForm.onSubmit((values) => onSubmit(values))}>
      <Container>
        <Stack>
          <TextInput
            label="Tail Number"
            withAsterisk
            {...newForm.getInputProps("tail_no")}
          />
          <TextInput
            label="Make"
            {...newForm.getInputProps("make")}
            withAsterisk
          />
          <TextInput
            label="Model"
            {...newForm.getInputProps("model")}
            withAsterisk
          />
          <Select
            {...newForm.getInputProps("aircraft_category")}
            label="Category"
            placeholder="Pick a value"
            name="aircraft_category"
            withAsterisk
            data={
              categories.isFetched && !categories.isError
                ? categories.data.categories
                : []
            }
            onChange={(_value, option) => {
              setCategory(option.value);
              setClassSelection("");
              queryClient.invalidateQueries({
                queryKey: ["classes", option.value],
              });
              newForm.setFieldValue("aircraft_category", option.value);
            }}
          />
          <Select
            label="Class"
            placeholder="Pick a value"
            withAsterisk
            data={
              classes.isFetched && !classes.isError && classes.data
                ? classes.data.classes
                : []
            }
            value={classSelection}
            {...newForm.getInputProps("aircraft_class")}
          />
          <NumberInput
            label="Hobbs"
            min={0.0}
            suffix=" hrs"
            decimalScale={1}
            fixedDecimalScale
            {...newForm.getInputProps("hobbs")}
          />
          <Group justify="flex-end">
            {isError ? (
              <Text c="red">
                {error instanceof AxiosError
                  ? error?.response?.data?.detail ?? "Error adding aircraft"
                  : error?.message}
              </Text>
            ) : isPending ? (
              <Text c="yellow">Adding aircraft...</Text>
            ) : null}
            {withCancelButton ? (
              <Button leftSection={<IconX />} color="gray" onClick={cancelFunc}>
                Cancel
              </Button>
            ) : null}
            <Button
              type="submit"
              leftSection={<IconPencil />}
              onClick={() => null}
            >
              {submitButtonLabel ?? "Submit"}
            </Button>
          </Group>
        </Stack>
      </Container>
    </form>
  );
}
