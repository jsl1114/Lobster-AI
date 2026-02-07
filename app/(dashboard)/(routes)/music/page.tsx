import { checkSubscription } from "@/lib/subscription";
import { ProGate } from "@/components/pro-gate";
import { MusicClient } from "./music-client";

const MusicPage = async () => {
  const isPro = await checkSubscription();

  if (!isPro) {
    return (
      <ProGate
        title="Music Generation"
        description="Let Lobster compose some music for you"
        icon="music"
        iconColor="text-emerald-400"
        bgColor="bg-emerald-400/10"
      />
    );
  }

  return <MusicClient />;
};
export default MusicPage;
