import {
  createTRPCClient,
  splitLink,
  httpSubscriptionLink,
  httpBatchStreamLink,
} from "@trpc/client";
import type { AppRouter } from "../../server/index.ts";
import { transformer } from "../../shared/src/transformer.ts";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: httpSubscriptionLink({
        url: "http://localhost:3000",
        transformer,
      }),
      false: httpBatchStreamLink({
        url: "http://localhost:3000",
        transformer,
      }),
    }),
  ],
});
