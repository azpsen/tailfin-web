import { CloseButton, NumberInput } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

function IntInput({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number | string | undefined;
  setValue: Dispatch<SetStateAction<number | string | undefined>>;
}) {
  return (
    <NumberInput
      label={label}
      min={0}
      allowDecimal={false}
      value={value}
      leftSection={
        <CloseButton
          aria-label="Clear input"
          onClick={() => setValue("")}
          style={{
            display: Number.isFinite(value) ? "none" : undefined,
          }}
        />
      }
      onChange={setValue}
    />
  );
}

function ZeroIntInput({
  label,
  value,
  setValue,
  error = null,
}: {
  label: string;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  error: string | null;
}) {
  return (
    <NumberInput
      label={label}
      min={0}
      allowDecimal={false}
      error={error}
      value={value}
      leftSection={
        <CloseButton
          aria-label="Clear input"
          onClick={() => setValue(0)}
          style={{
            display: !value || value === 0 ? "none" : undefined,
          }}
        />
      }
      onChange={(value) => setValue(Number(value))}
    />
  );
}

export { IntInput, ZeroIntInput };
