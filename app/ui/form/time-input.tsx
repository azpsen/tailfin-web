import { FlightFormSchema } from "@/util/types";
import { ActionIcon, CloseButton, NumberInput, Tooltip } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconClock } from "@tabler/icons-react";
import dayjs from "dayjs";

export default function TimeInput({
  form,
  label,
  field,
}: {
  form: UseFormReturnType<FlightFormSchema>;
  field: string;
  label: string;
}) {
  const field_key = field as keyof typeof form.getTransformedValues;

  return (
    <NumberInput
      label={label}
      allowDecimal={false}
      min={0}
      max={2359}
      leftSection={
        <CloseButton
          aria-label="Clear input"
          onClick={() => form.setFieldValue(field, "")}
          style={{
            display:
              ["", null].indexOf(form.getTransformedValues()[field_key]) > -1
                ? "none"
                : undefined,
          }}
        />
      }
      rightSection={
        <Tooltip label="Now">
          <ActionIcon
            variant="transparent"
            mr="sm"
            onClick={() => {
              form.setFieldValue(field, dayjs().format("HHmm"));
            }}
          >
            <IconClock style={{ width: "70%", height: "70%" }} />
          </ActionIcon>
        </Tooltip>
      }
      {...form.getInputProps(field)}
    />
  );
}
