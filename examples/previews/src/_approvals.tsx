import type { ApprovalKey } from "@twentyfirstmedia/ui-core";

/** Stands in for an app's passkey step-up and API call: resolves after a short pause. */
export function fakeDecision(key: ApprovalKey, ms = 1200): Promise<ApprovalKey> {
  return new Promise((resolve) => setTimeout(() => resolve(key), ms));
}
