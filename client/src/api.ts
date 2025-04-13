import {
  createTRPCClient,
  splitLink,
  httpSubscriptionLink,
  httpBatchStreamLink,
} from "@trpc/client";
import type { AppRouter } from "../server/index.ts";
import { transformer } from "../shared/src/transformer.ts";

const URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000"
    : "https://skibidiparlortrpc.onrender.com";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: httpSubscriptionLink({
        url: URL,
        transformer,
      }),
      false: httpBatchStreamLink({
        url: URL,
        transformer,
      }),
    }),
  ],
});
