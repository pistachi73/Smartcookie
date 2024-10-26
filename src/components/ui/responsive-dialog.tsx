import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useDeviceType } from "../device-only/device-only-provider";

const ResponsiveDialogContext = React.createContext<{
  isMobile?: boolean;
}>({});

const useResponsiveDialog = () => {
  const context = React.useContext(ResponsiveDialogContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <ResponsiveDialog  />");
  }

  return context;
};

type RootCommonProps =
  | React.ComponentPropsWithoutRef<typeof Drawer>
  | React.ComponentPropsWithoutRef<typeof Dialog>;

type RootProps = RootCommonProps & {
  direction?: "top" | "right" | "bottom" | "left";
};

export const ResponsiveDialog = ({ ...props }: RootProps) => {
  const { isMobile } = useDeviceType();

  const Root = isMobile ? Drawer : Dialog;

  return (
    <ResponsiveDialogContext.Provider value={{ isMobile }}>
      <Root {...props} />
    </ResponsiveDialogContext.Provider>
  );
};
ResponsiveDialog.displayName = "ResponsiveDialog";

type TriggerProps =
  | React.ComponentPropsWithoutRef<typeof DrawerTrigger>
  | React.ComponentPropsWithoutRef<typeof DialogTrigger>;

export const ResponsiveDialogTrigger = React.forwardRef<
  React.ElementRef<typeof DrawerTrigger | typeof DialogTrigger>,
  TriggerProps
>(({ className, ...props }, ref) => {
  const { isMobile } = useResponsiveDialog();
  const Trigger = isMobile ? DrawerTrigger : DialogTrigger;
  return <Trigger ref={ref} className={className} {...props} />;
});

ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";

type ResponsiveDialogContentProps = Omit<
  | React.ComponentPropsWithoutRef<typeof DialogContent>
  | React.ComponentPropsWithoutRef<typeof DrawerContent>,
  "onAnimationEnd"
> & {
  hideClose?: boolean;
};

export const ResponsiveDialogContent = React.forwardRef<
  React.ElementRef<typeof DrawerContent | typeof DialogContent>,
  ResponsiveDialogContentProps
>(({ hideClose, className, ...props }, ref) => {
  const { isMobile } = useResponsiveDialog();

  const Content = isMobile ? DrawerContent : DialogContent;

  const contentProps = {
    className: isMobile ? cn("w-full max-h-[95%]", className) : className,
    ...(isMobile ? {} : {}),
    ...props,
  };

  return <Content ref={ref} {...contentProps} />;
});
ResponsiveDialogContent.displayName = "ResponsiveDialogContent";

type ResponsiveDialogHeaderProps =
  | React.ComponentPropsWithoutRef<typeof DialogHeader>
  | React.ComponentPropsWithoutRef<typeof DrawerHeader>;

export const ResponsiveDialogHeader = ({
  className,
  ...props
}: ResponsiveDialogHeaderProps) => {
  const { isMobile } = useResponsiveDialog();
  const Header = isMobile ? DrawerHeader : DialogHeader;

  return <Header className={className} {...props} />;
};

ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader";

type ResponsiveDialogFooterProps =
  | React.ComponentPropsWithoutRef<typeof DialogFooter>
  | React.ComponentPropsWithoutRef<typeof DrawerFooter>;

export const ResponsiveDialogFooter = ({
  className,
  ...props
}: ResponsiveDialogFooterProps) => {
  const { isMobile } = useResponsiveDialog();
  const Footer = isMobile ? DrawerFooter : DialogFooter;

  return <Footer className={className} {...props} />;
};

ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";

type ResponsiveDialogTitleProps =
  | React.ComponentPropsWithoutRef<typeof DialogTitle>
  | React.ComponentPropsWithoutRef<typeof DrawerTitle>;

export const ResponsiveDialogTitle = React.forwardRef<
  React.ElementRef<typeof DrawerTitle | typeof DialogTitle>,
  ResponsiveDialogTitleProps
>(({ className, ...props }, ref) => {
  const { isMobile } = useResponsiveDialog();
  const Title = isMobile ? DrawerTitle : DialogTitle;

  return <Title ref={ref} className={className} {...props} />;
});
ResponsiveDialogTitle.displayName = "ResponsiveDialogTitle";

type ResponsiveDialogDescriptionProps =
  | React.ComponentPropsWithoutRef<typeof DialogDescription>
  | React.ComponentPropsWithoutRef<typeof DrawerDescription>;

export const ResponsiveDialogDescription = React.forwardRef<
  React.ElementRef<typeof DrawerDescription | typeof DialogDescription>,
  ResponsiveDialogDescriptionProps
>(({ className, ...props }, ref) => {
  const { isMobile } = useResponsiveDialog();
  const Description = isMobile ? DrawerDescription : DialogDescription;

  return <Description ref={ref} className={className} {...props} />;
});
ResponsiveDialogDescription.displayName = "ResponsiveDialogDescription";
