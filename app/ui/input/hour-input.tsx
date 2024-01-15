import { CloseButton, NumberInput } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

function HourInput({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number | string | null;
  setValue: Dispatch<SetStateAction<string | number | null>>;
}) {
  return (
    <NumberInput
      label={label}
      decimalScale={1}
      step={0.1}
      min={0}
      fixedDecimalScale
      leftSection={
        <CloseButton
          aria-label="Clear input"
          onClick={() => setValue("")}
          style={{
            display: Number.isFinite(value) ? undefined : undefined,
          }}
        />
      }
      onChange={(value) =>
        setValue(Number.isFinite(value) ? (value as number) : 0)
      }
    />
  );
}

function ZeroHourInput({
  label,
  value,
  setValue,
  error = null,
}: {
  label: string;
  value: number | null;
  setValue: Dispatch<SetStateAction<number | null>>;
  error?: string | null;
}) {
  return (
    <NumberInput
      label={label}
      decimalScale={1}
      step={0.1}
      min={0}
      fixedDecimalScale
      error={error}
      leftSection={
        <CloseButton
          aria-label="Clear input"
          onClick={() => setValue(0)}
          style={{
            display: !value || value === 0 ? "none" : undefined,
          }}
        />
      }
      onChange={(value) =>
        setValue(Number.isFinite(value) ? (value as number) : 0)
      }
    />
  );
}

export { HourInput, ZeroHourInput };
