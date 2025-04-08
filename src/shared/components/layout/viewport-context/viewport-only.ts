"use client";

import type { ReactNode } from "react";
import type { Viewport } from "./types";
import { useViewport } from "./viewport-context";

type Props = {
  children?: ReactNode;
  renderIf?: ReactNode;
  renderOr?: ReactNode;
  is?: Viewport;
  up?: Viewport;
  down?: Viewport;
  between?: [Viewport, Viewport];
};

const ViewportOnly = ({
  children = null,
  renderIf = null,
  renderOr = null,
  is: isViewport,
  up: upViewport,
  down: downViewport,
  between: betweenViewports,
}: Props) => {
  const { is, up, down, between } = useViewport();

  if (isViewport) {
    return is(isViewport) ? renderIf || children : renderOr;
  }

  if (upViewport) {
    return up(upViewport) ? renderIf || children : renderOr;
  }

  if (downViewport) {
    return down(downViewport) ? renderIf || children : renderOr;
  }

  if (betweenViewports) {
    return between(betweenViewports) ? renderIf || children : renderOr;
  }

  return null;
};

export default ViewportOnly;
