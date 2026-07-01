# Pingivo

**Multipurpose QR Codes · Privacy First**

Pingivo lets you generate a secure, privacy-first QR code for anything you own — vehicle, bike, luggage, laptop, or personal items. Finders can contact you without ever seeing your phone number; messages and calls are relayed anonymously.

## Highlights

- **Anonymous contact relay:** keeper's phone number is never exposed.
- **Print-ready QR templates:** design, resize and download stickers.
- **Instant notifications and calls:** get alerts when someone calls and messages you.
- **30-second setup** — enter your number, download your QR, stick it on
- **No app needed** — anyone can scan with a regular phone camera or google lens

## Contents

- [**Getting Started**](#getting-started): quick local dev instructions
- [**Environment**](#environment-variables-common): required env vars and descriptions
- [**Development**](#development-tips): commands and tips
- [**Contributing**](#contributing): how to help, areas to work on, and PR workflow

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install & Run (local)

```bash
git clone https://github.com/ARJ544/Pingivo.git
cd pingivo
npm install
cp .env.example .env.local
# update .env.local with real values
npm run dev
```

Open `http://localhost:3000` in your browser.

## Environment Variables (common)

Create a `.env.local` based on `.env.example` and set the following at minimum:

- `NEXT_PUBLIC_FRONTEND_URL` : Frontend URL, e.g. `http://localhost:3000`
- `SUPABASE_URL` : Supabase project URL
- `SUPABASE_ANON_KEY` : Supabase anon/public key (but used in server!)
- `TWILIO_ACCOUNT_SID` : Twilio account SID
- `TWILIO_AUTH_TOKEN` : Twilio auth token
- `NEXT_PUBLIC_TWILIO_NUMBER` : Twilio phone number for outbound calls
- `WHATSAPP_PERMANENT_TOKEN` : Meta Api Permanent token
- `WHATSAPP_PHONE_NUMBER_ID` : Meta Api Phone Number ID
- `WHATSAPP_VERIFY_TOKEN` : Token to verify its authenticity
- `NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER` : Whatsapp phone number for messages
- `KOFI_VERIFICATION_TOKEN` : Token to verify its authenticity
<!-- - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` : (if using Razorpay) -->

> Note: Remove or rotate any unused keys. Keep secrets out of source control.

## Development

### Development tips

- Use `npm run dev` to start Next.js in development mode.
- Use `npm run lint` and `npm run format` (if configured) before committing.
- Check serverless/api routes under `src/app/api/` for webhook and integration endpoints.

### Testing & Build

- `npm run build` — build for production
- `npm run start` — run the built app
- Add or run unit/integration tests as your workflow requires (repository may not include a test runner by default).

## Contributing

We welcome contributions. Below are recommended areas to help and a step-by-step guide to contributing.

### Recommended areas to work on

- **Optimize**: performance improvements, bundle size, image loading, caching
- **Fix bugs**: issues reported in the issue tracker
- **File structure**: reorganize components, pages, or api routes for clarity
- **Folder structure**: standardize folder naming (`app`, `components`, `lib`, `hooks`, `providers`, `types`)
- **Lib & utils**: improve `src/lib/*` helpers and shared utilities
- **Hooks**: add tests, split responsibilities, or add better typings for `src/hooks/*`
- **Components**: add accessibility (a11y), tests, and unit stories where relevant
- **Docs**: expand README, document public components and API routes
- **Payments & webhooks**: validate and harden `src/app/api/payment-webhooks/`

### How to contribute (step-by-step)

1. Fork the repository (or create a branch if you have push access).
2. Create a descriptive branch: `git checkout -b feat/short-descriptive-name` or `fix/issue-123`
3. Install dependencies and run the app locally.

```bash
npm install
cp .env.example .env.local
# update env values
npm run dev
```

4. Make changes in small, focused commits. Use clear commit messages referencing issues when applicable.
5. Run linters and formatters before pushing:

```bash
npm run lint
npm run format
```

6. Push your branch to your fork and open a Pull Request against `main` (or the target branch).

### Pull Request checklist

- Include a clear title and description of the change.
- Reference any related issue(s): `Fixes #123`.
- Explain the motivation and how to test the change locally.
- Run the app locally and include screenshots or recordings for UI changes.
- Ensure no secrets are included and `.env.local` is not committed.

### Branch & commit guidelines

- Branch names: `feat/...`, `fix/...`, `chore/...`, `refactor/...`.
- Keep PRs small and focused.
- Use conventional commits if possible (optional): `feat:`, `fix:`, `chore:`.

### Code review & merging

- Repo owner will review your PR. Address review comments promptly.
- Once approved, a reviewer will merge following the repo's merge strategy.

If you'd like help picking a first issue, open an issue or ask in the project's discussion board.

## License

See the [LICENSE](https://github.com/ARJ544/Pingivo/blob/minimal_ui/LICENSE) file in the repository.

---

© Pingivo. QR Codes for Everything.