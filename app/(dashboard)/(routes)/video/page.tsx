import { checkSubscription } from "@/lib/subscription";
import { ProGate } from "@/components/pro-gate";
import { VideoClient } from "./video-client";

const VideoPage = async () => {
  const isPro = await checkSubscription();

  if (!isPro) {
    return (
      <ProGate
        title="Video Generation"
        description="Turn your prompt into video"
        icon="video"
        iconColor="text-orange-500"
        bgColor="bg-orange-500/10"
      />
    );
  }

  return <VideoClient />;
};
export default VideoPage;
