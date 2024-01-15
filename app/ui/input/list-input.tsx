import { Pill, PillsInput } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";

export default function ListInput({
  label,
  value,
  setValue,
  canAdd = true,
}: {
  label: string;
  value: string[];
  setValue: Dispatch<SetStateAction<string[]>>;
  canAdd?: boolean;
}) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const newItem = inputValue.trim();
      if (newItem && value.indexOf(newItem) == -1) {
        setValue([...value, newItem]);
        setInputValue("");
      }
    } else if (event.key === "Backspace") {
      const newItem = inputValue.trim();
      if (newItem === "") {
        setValue(value.slice(0, -1));
      }
    }
  };

  return (
    <PillsInput label={label} description="Press enter or comma to add item">
      <Pill.Group>
        {value.map((item: string) => (
          <Pill
            radius="sm"
            key={item}
            withRemoveButton
            onRemove={() =>
              setValue(value.filter((value: string) => value !== item))
            }
          >
            {item}
          </Pill>
        ))}
        {canAdd ? (
          <PillsInput.Field
            value={inputValue}
            onChange={(event) => setInputValue(event.currentTarget.value)}
            onKeyDown={handleKeyDown}
          />
        ) : null}
      </Pill.Group>
    </PillsInput>
  );
}
