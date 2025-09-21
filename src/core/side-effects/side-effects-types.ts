export interface SideEffectPayloadMap {
  updateHubLastActivity: { hubId: number; userid: string };
}

export type SideEffectJob<
  K extends keyof SideEffectPayloadMap = keyof SideEffectPayloadMap,
> = {
  id: string;
  type: K;
  payload: SideEffectPayloadMap[K];
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
};

export type JobHandler<K extends keyof SideEffectPayloadMap> = (
  payload: SideEffectPayloadMap[K],
) => Promise<void>;

interface CoalesceSlot<P> {
  timer?: NodeJS.Timeout;
  latestPayload?: P;
  lastExecuted?: Date;
}

export interface CoalesceConfig<K extends keyof SideEffectPayloadMap> {
  windowMs: number;
  keyFn: (payload: SideEffectPayloadMap[K]) => string;
  slots: Map<string, CoalesceSlot<SideEffectPayloadMap[K]>>;
}
