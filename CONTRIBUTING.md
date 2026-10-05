# Contributing

Use a branch and pull request for focused changes. Describe the concrete behavior before and after the change, and include the checks you ran.

Run `pnpm typecheck`, `pnpm test` and `pnpm build`. Keep public reads, wallet ownership checks and locked failure states intact. Add a behavioral regression test when changing access arithmetic, request encoding, response contracts or market processing.

Do not commit credentials, wallet material, local execution profiles or generated build output. Keep the pinned lockfile and third-party license notices. Do not describe contracts, privacy mechanisms or payment execution as implemented unless the source actually provides them.
