import { ActionIcon, CloseButton, NumberInput, Tooltip } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";

export default function TimeInput({
  label,
  value,
  setValue,
  allowLeadingZeros = false,
  error = "",
}: {
  label: string;
  value: number | string | undefined;
  setValue: Dispatch<SetStateAction<number | string | undefined>>;
  allowLeadingZeros?: boolean;
  error?: string | null;
}) {
  return (
    <NumberInput
      label={label}
      allowDecimal={false}
      min={0}
      max={2359}
      allowLeadingZeros={allowLeadingZeros}
      error={error}
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
      rightSection={
        <Tooltip label="Now">
          <ActionIcon
            variant="transparent"
            mr="sm"
            onClick={() => {
              setValue(dayjs().format("HHmm"));
            }}
          >
            <IconClock style={{ width: "70%", height: "70%" }} />
          </ActionIcon>
        </Tooltip>
      }
      onChange={setValue}
    />
  );
}
