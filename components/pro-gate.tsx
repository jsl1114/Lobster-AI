"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Lock, Zap, Images, VideoIcon, Music4 } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const iconMap = {
  images: Images,
  video: VideoIcon,
  music: Music4,
} as const;

interface ProGateProps {
  title: string;
  description: string;
  icon: keyof typeof iconMap;
  iconColor: string;
  bgColor: string;
}

export const ProGate = ({
  title,
  description,
  icon,
  iconColor,
  bgColor,
}: ProGateProps) => {
  const Icon = iconMap[icon];
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClose = () => {
    router.push("/dashboard");
  };

  const onUpgrade = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 lg:px-8 flex items-center gap-x-3 mb-8 mt-4">
        <div className={cn("p-2 w-fit rounded-md", bgColor)}>
          <Icon className={cn("w-10 h-10", iconColor)} />
        </div>
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 lg:px-8">
        <Dialog open={true} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                <div className={cn("p-3 w-fit rounded-full", bgColor)}>
                  <Lock className={cn("w-8 h-8", iconColor)} />
                </div>
                <div className="flex items-center gap-x-2 font-bold text-xl">
                  {title} is&nbsp;
                  <Badge variant="premium" className="uppercase text-sm py-1">
                    Pro
                  </Badge>
                  &nbsp;Only
                </div>
              </DialogTitle>
              <DialogDescription className="text-center pt-2 text-zinc-600 dark:text-zinc-400 space-y-3">
                <p>
                  {title} is an exclusive feature available only to Lobster Pro
                  subscribers. Upgrade your plan to unlock unlimited access.
                </p>
                <div className="flex flex-col items-center gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-x-1">
                    ✓ Unlimited {title.toLowerCase()}
                  </span>
                  <span className="flex items-center gap-x-1">
                    ✓ Priority processing
                  </span>
                  <span className="flex items-center gap-x-1">
                    ✓ Access to latest models
                  </span>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button
                variant="premium"
                size="lg"
                className="w-full font-bold"
                onClick={onUpgrade}
                disabled={loading}
              >
                <Zap className="w-4 h-4 mr-2 fill-white" />
                Upgrade to Pro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
