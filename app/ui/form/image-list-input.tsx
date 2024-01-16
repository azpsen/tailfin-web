import { Button, Card, Group, Text } from "@mantine/core";
import SecureImage from "../display/secure-img";
import { randomId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";
import { FlightFormSchema } from "@/util/types";

export default function ImageListInput({
  label,
  form,
  field,
  mt = "sm",
  h = "100px",
}: {
  label: string;
  form: UseFormReturnType<
    FlightFormSchema,
    (values: FlightFormSchema) => FlightFormSchema
  >;
  field: string;
  mt?: string;
  w?: string;
  h?: string;
}) {
  const field_key = field as keyof typeof form.getTransformedValues;

  return (
    <>
      {/* <Grid> */}
      <Text size="sm" fw={700} mt={mt} mb="xs">
        {label}
      </Text>
      <Group display="flex" gap="xs" style={{ flexWrap: "wrap" }}>
        {(form.getTransformedValues()[field_key] as string[]).map((id) => (
          // <Grid.Col key={randomId()}>
          <Card key={randomId()} padding="md" shadow="md" withBorder>
            {/* <Card.Section> */}
            <SecureImage id={id} h={h} />
            {/* </Card.Section> */}
            <Button
              mt="md"
              leftSection={<IconTrash />}
              onClick={() =>
                form.setFieldValue(
                  field,
                  (form.getTransformedValues()[field_key] as string[]).filter(
                    (i) => i !== id
                  )
                )
              }
            >
              Remove
            </Button>
          </Card>
          // </Grid.Col>
        ))}
      </Group>
    </>
    // </Grid>
    // <PillsInput label={label}>
    //   <Pill.Group>
    //     {imageIds.map((id: string) => (
    //       <Pill
    //         radius="sm"
    //         key={id}
    //         withRemoveButton
    //         onRemove={() => setImageIds(imageIds.filter((i) => i !== id))}
    //       >
    //         <SecureImage id={id} h="20px" />
    //       </Pill>
    //     ))}
    //   </Pill.Group>
    // </PillsInput>
  );
}
