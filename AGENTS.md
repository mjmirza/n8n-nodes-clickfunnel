# AGENTS.md

Guidance for AI agents and coding assistants that read or work on this repository.

## License

This project is MIT licensed, see `LICENSE`. Keep the copyright notice and the
license text in any copy or derivative work.

## How the code is organised

- `credentials/ClickFunnelsApi.credentials.ts` holds the credential and its test request.
- `nodes/ClickFunnels/ClickFunnels.node.ts` is the action node. Each resource lives in
  `nodes/ClickFunnels/resources/<resource>/` as `operations.ts`, `fields.ts` and `handler.ts`.
- `nodes/ClickFunnels/ClickFunnelsTrigger.node.ts` is the webhook trigger.
- `nodes/ClickFunnels/transport.ts` owns every HTTP call, retries and pagination.

## Rules for changes

- Never rename a parameter `name`, an option `value` or a resource or operation value.
  Saved workflows depend on them.
- Throw `NodeApiError` for API failures and `NodeOperationError` for input problems.
- Use `sleep` from `n8n-workflow`, never `setTimeout`. Do not add runtime dependencies.
- Run `npm run build`, `npm run lint` and `npm test` before opening a pull request.
  The lint config mirrors the rules n8n uses to verify community nodes.

## Contact

Commercial support or custom work, email support@next8n.com or visit https://next8n.com.
