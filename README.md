# SocialWallet DApp

A minimal fullstack DApp using **Alchemy Account Kit** for:
- 📧 Email magic-link login
- 🔐 Google / Facebook social login (OAuth popup)
- 🦊 External wallet connect (MetaMask, WalletConnect, Coinbase Wallet…)
- ⚡ ERC-4337 Smart Account (gasless UX)
- 📱 Mobile-first responsive UI

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

> **Note on viem version:** Account Kit 4.x requires `viem ^2.21`. If you hit a peer-deps conflict run:
> ```bash
> npm install --legacy-peer-deps
> ```

### 2. Add your Alchemy API key

1. Go to [dashboard.alchemy.com](https://dashboard.alchemy.com)
2. Create a new app → choose **Ethereum Sepolia** as the network
3. Copy the API key
4. Rename `.env.local` and paste your key:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_key_here
```

### 3. Enable Account Kit auth in Alchemy Dashboard

In your Alchemy app dashboard:
- Navigate to **Account Kit** → **Auth**
- Enable **Email**, **Google**, **Facebook**, and **External Wallets**
- Add `http://localhost:3000` to **Allowed Origins**

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your browser or scan the local IP on your phone.

---

## Testing on Mobile

```bash
# Find your local IP
ipconfig getifaddr en0    # macOS
ip addr show              # Linux

# Open on phone:
http://192.168.x.x:3000
```

Or use **ngrok** for HTTPS (required for some OAuth flows):
```bash
npx ngrok http 3000
# Add the ngrok URL to Alchemy allowed origins
```

---

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout + viewport meta tags
│   ├── page.tsx            # Home page
│   ├── providers.tsx       # AlchemyAccountProvider wrapper
│   └── globals.css         # Global styles + animations
├── components/
│   └── WalletUI.tsx        # Landing page + connected dashboard
├── lib/
│   └── alchemy-config.ts   # Account Kit config (auth sections, chain)
├── next.config.js
├── .env.local              # ← Add your API key here
└── README.md
```

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `@account-kit/react` | Hooks + pre-built Auth UI modal |
| `@account-kit/infra` | Alchemy transport + chain configs |
| `@account-kit/smart-contracts` | Smart account types |
| `viem` | Ethereum primitives |
| `@tanstack/react-query` | Async state management |

---

## Customisation

**Add more chains** – edit `lib/alchemy-config.ts`:
```ts
import { base, mainnet } from "@account-kit/infra";
chain: base,  // switch to Base
```

**Add more auth providers** – edit the `sections` array in `uiConfig`:
```ts
{ type: "social", authProviderId: "apple", mode: "popup" }
```

**Switch to a different smart account type** in `WalletUI.tsx`:
```ts
useSmartAccountClient({ type: "LightAccount" })
```
