import { FlightFormSchema } from "@/util/types";
import { FileInput, FileInputProps, Pill } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { IconPhoto } from "@tabler/icons-react";

export default function ImageUpload({
  form,
  field,
  label = "",
  placeholder = "",
  mt = "",
}: {
  form: UseFormReturnType<
    FlightFormSchema,
    (values: FlightFormSchema) => FlightFormSchema
  >;
  field: string;
  label?: string;
  placeholder?: string;
  mt?: string;
}) {
  const ValueComponent: FileInputProps["valueComponent"] = ({ value }) => {
    if (value === null) {
      return null;
    }

    if (Array.isArray(value)) {
      return (
        <Pill.Group>
          {value.map((file) => (
            <Pill key={randomId()}>{file.name}</Pill>
          ))}
        </Pill.Group>
      );
    }

    return <Pill>{value.name}</Pill>;
  };

  return (
    <FileInput
      label={label}
      placeholder={placeholder}
      multiple
      mt={mt}
      accept="image/*"
      valueComponent={ValueComponent}
      rightSectionPointerEvents="none"
      rightSection={<IconPhoto />}
      {...form.getInputProps(field)}
    />
  );
}
