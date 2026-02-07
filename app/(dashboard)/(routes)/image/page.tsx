import { checkSubscription } from "@/lib/subscription";
import { ProGate } from "@/components/pro-gate";
import { ImageClient } from "./image-client";

const ImagePage = async () => {
  const isPro = await checkSubscription();

  if (!isPro) {
    return (
      <ProGate
        title="Image Generation"
        description="Turn your prompt into an image!"
        icon="images"
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
    );
  }

  return <ImageClient />;
};
export default ImagePage;
