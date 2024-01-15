import { Carousel } from "@mantine/carousel";
import classes from "./img-log-item.module.css";
import { randomId, useDisclosure } from "@mantine/hooks";
import SecureImage from "../secure-img";
import {
  ActionIcon,
  Button,
  Group,
  Loader,
  Modal,
  Stack,
  Tooltip,
  Text,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import ListInput from "@/ui/input/list-input";
import ImageUpload from "@/ui/input/image-upload";
import { useState } from "react";
import { useApi } from "@/util/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ImageLogItem({
  imageIds,
  id,
  mah = "",
}: {
  imageIds: string[];
  id: string;
  mah?: string;
}) {
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const [existingImages, setExistingImages] = useState<string[]>(imageIds);
  const [newImages, setNewImages] = useState<File[]>([]);

  const client = useApi();
  const queryClient = useQueryClient();

  const updateValue = useMutation({
    mutationFn: async () => {
      const missing = imageIds.filter(
        (item: string) => existingImages?.indexOf(item) < 0
      );

      for (const img of missing) {
        await client.delete(`/img/${img}`);
      }

      await client
        .patch(`/flights/${id}`, { images: existingImages })
        .then((res) => res.data);

      // Upload images
      if (newImages.length > 0) {
        const imageForm = new FormData();

        for (const img of newImages ?? []) {
          imageForm.append("images", img);
        }

        console.log(imageForm);

        const img_id = await client.post(
          `/flights/${id}/add_images`,
          imageForm,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (!img_id) {
          await queryClient.invalidateQueries({ queryKey: ["flights-list"] });
          throw new Error("Image upload failed");
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [id] });
      queryClient.invalidateQueries({ queryKey: ["flights-list"] });
      closeEdit();
    },
  });

  return (
    <>
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title={`Edit Images`}
        centered
      >
        <Stack>
          <ListInput
            label="Existing Images"
            value={existingImages}
            setValue={setExistingImages}
            canAdd={false}
          />
          <ImageUpload
            value={newImages}
            setValue={setNewImages}
            label="Add Images"
            mt="md"
            placeholder="Images"
          />

          <Group justify="flex-end">
            {updateValue.isPending ? <Loader /> : null}
            {updateValue.isError ? (
              <Text c="red">{updateValue.error?.message}</Text>
            ) : null}
            <Button
              onClick={() => {
                updateValue.mutate();
              }}
              leftSection={<IconPencil />}
            >
              Update
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Stack>
        <Group justify="flex-end" py="0" my="0">
          <Tooltip label="Edit Images">
            <ActionIcon variant="transparent" onClick={openEdit}>
              <IconPencil />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Carousel
          style={{ maxHeight: mah }}
          withIndicators
          slideGap="sm"
          slideSize={{ base: "100%", sm: "80%" }}
          classNames={classes}
        >
          {imageIds.map((img) => (
            <Carousel.Slide key={randomId()}>
              <SecureImage key={randomId()} id={img} h="700px" radius="lg" />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Stack>
    </>
  );
}
