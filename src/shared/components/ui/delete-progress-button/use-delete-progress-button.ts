import { useEffect, useRef, useState } from "react";

export const DELETION_TIME_MS = 500;

type UseDeleteProgressButtonProps = {
  onDelete: () => void;
  pressDuration?: number;
};

export const useDeleteProgressButton = ({
  onDelete,
  pressDuration = DELETION_TIME_MS,
}: UseDeleteProgressButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const deleteAnimationRef = useRef<number | null>(null);
  const deletePressStartTimeRef = useRef<number | null>(null);

  const cleanupDeleteAnimation = () => {
    if (deleteAnimationRef.current) {
      cancelAnimationFrame(deleteAnimationRef.current);
      deleteAnimationRef.current = null;
    }
    deletePressStartTimeRef.current = null;
    setIsDeleting(false);
    setDeleteProgress(0);
  };

  const handleDeletePress = () => {
    setIsDeleting(true);
    deletePressStartTimeRef.current = Date.now();

    const animateDeleteProgress = () => {
      if (!deletePressStartTimeRef.current) return;

      const elapsed = Date.now() - deletePressStartTimeRef.current;
      const progress = Math.min(elapsed / pressDuration, 1);
      const progressPercentage = progress * 100;
      setDeleteProgress(progressPercentage);

      if (progress < 1) {
        deleteAnimationRef.current = requestAnimationFrame(
          animateDeleteProgress,
        );
      } else {
        // We only pass id to the mutation since that's what the action expects
        onDelete();
        cleanupDeleteAnimation();
      }
    };

    deleteAnimationRef.current = requestAnimationFrame(animateDeleteProgress);
  };

  const handleDeleteRelease = () => {
    cleanupDeleteAnimation();
  };

  useEffect(() => {
    return cleanupDeleteAnimation;
  }, []);

  return {
    isDeleting,
    deleteProgress,
    handleDeletePress,
    handleDeleteRelease,
  };
};
