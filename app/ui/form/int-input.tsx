import { FlightFormSchema } from "@/util/types";
import { CloseButton, NumberInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

function IntInput({
  form,
  field,
  label,
}: {
  form: UseFormReturnType<
    FlightFormSchema,
    (values: FlightFormSchema) => FlightFormSchema
  >;
  field: string;
  label: string;
}) {
  const field_key = field as keyof typeof form.getTransformedValues;

  return (
    <NumberInput
      label={label}
      min={0}
      allowDecimal={false}
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
      {...form.getInputProps(field)}
    />
  );
}

function ZeroIntInput({
  form,
  field,
  label,
}: {
  form: UseFormReturnType<
    FlightFormSchema,
    (values: FlightFormSchema) => FlightFormSchema
  >;
  field: string;
  label: string;
}) {
  const field_key = field as keyof typeof form.getTransformedValues;

  return (
    <NumberInput
      label={label}
      min={0}
      allowDecimal={false}
      leftSection={
        <CloseButton
          aria-label="Clear input"
          onClick={() => form.setFieldValue(field, 0)}
          style={{
            display:
              form.getTransformedValues()[field_key] > 0 ? "none" : undefined,
          }}
        />
      }
      {...form.getInputProps(field)}
    />
  );
}

export { IntInput, ZeroIntInput };
