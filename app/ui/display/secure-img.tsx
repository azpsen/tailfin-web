import { useApi } from "@/util/api";
import { Center, Image, Loader, Modal } from "@mantine/core";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import ErrorDisplay from "../error-display";
import { useDisclosure } from "@mantine/hooks";

function blobToBase64(blob: Blob): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsBinaryString(blob);
    reader.onloadend = function () {
      if (typeof reader.result === "string") {
        const base64 = btoa(reader.result);
        resolve(base64);
      } else {
        resolve(null);
      }
    };
  });
}

function useFetchImageAsBase64(
  img_id: string
): UseQueryResult<{ blob: string | null; type: string }> {
  const client = useApi();

  return useQuery({
    queryKey: ["image", img_id],
    queryFn: async (): Promise<{
      blob: string;
      type: string;
    }> => {
      const response = await client.get(`/img/${img_id}`, {
        responseType: "arraybuffer",
      });

      const blob = (await blobToBase64(new Blob([response.data]))) as string;
      const type = (response.headers["content-type"] as string) ?? "image/jpeg";

      return { blob, type };
    },
  });
}

export default function SecureImage({
  id,
  radius = "sm",
  clickable = true,
}: {
  id: string;
  radius?: string;
  clickable?: boolean;
}) {
  const { isLoading, error, data } = useFetchImageAsBase64(id);

  const [opened, { open, close }] = useDisclosure(false);

  if (isLoading)
    return (
      <Center h="100%">
        <Loader />
      </Center>
    );

  if (error) return <ErrorDisplay error="Failed to load image" />;

  return (
    <>
      {clickable ? (
        <Modal
          title="Image"
          opened={opened}
          onClose={close}
          centered
          size="auto"
        >
          <Image src={`data:${data?.type};base64,${data?.blob}`} />
        </Modal>
      ) : null}
      <Image
        src={`data:${data?.type};base64,${data?.blob}`}
        radius={radius}
        onClick={() => {
          if (clickable) {
            open();
          }
        }}
      />
    </>
  );
}
