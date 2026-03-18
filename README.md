# n8n-nodes-clickfunnel

Community n8n node for [ClickFunnels 2.0](https://www.clickfunnels.com/) — automate your funnels, contacts, orders, products, courses, and more using the official ClickFunnels public API.

> **52 resources · 200+ operations · Webhook triggers · AI Agent ready**

[![npm version](https://img.shields.io/npm/v/n8n-nodes-clickfunnel.svg)](https://www.npmjs.com/package/n8n-nodes-clickfunnel)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Features

- **Full API Coverage** — Every resource from the ClickFunnels 2.0 API
- **Contacts & CRM** — Create, update, upsert, tag, and manage contacts
- **Orders & E-Commerce** — Orders, invoices, transactions, fulfillments, restocks
- **Products** — Full catalog management with prices, variants, collections, and tags
- **Funnels & Pages** — Access funnel and page data with tagging
- **Courses** — Courses, sections, lessons, enrollments, and completions
- **Forms** — Forms, field sets, fields, options, submissions, and answers
- **Sales Pipeline** — Pipelines, stages, opportunities, and notes
- **Shipping** — Profiles, zones, rates, packages, location groups, and rate names
- **Stores & Themes** — Store management, themes, and styles
- **Platform** — Teams, users, workspaces, sites, images
- **Webhooks** — Real-time event triggers for 28+ event types
- **Security Hardened** — SSRF protection, input validation, retry with exponential backoff, HMAC webhook verification

## Installation

### In n8n (Community Nodes)

1. Go to **Settings → Community Nodes**
2. Select **Install a community node**
3. Enter `n8n-nodes-clickfunnel`
4. Agree to the risks and click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-clickfunnel
```

## Authentication

This node uses the ClickFunnels API v2 with **Bearer Token** authentication.

1. Log in to your ClickFunnels workspace
2. Navigate to **Settings → API Access Tokens**
3. Generate a new API token
4. In n8n, create a new **ClickFunnels API** credential with:
   - Your workspace **Subdomain** (e.g., `myworkspace`)
   - Your **Access Token**

## Resources

| Resource | Operations |
|----------|-----------|
| **Contacts & CRM** | |
| Contact | Create, Get, Get Many, Update, Delete, Upsert, Redact |
| Contact Applied Tag | Create, Get, Get Many, Delete |
| Contact Tag | Create, Get, Get Many, Update, Delete |
| **Orders & E-Commerce** | |
| Order | Create, Get, Get Many, Update |
| Order Applied Tag | Create, Get, Get Many, Delete |
| Order Invoice | Create, Get, Get Many, Update |
| Order Restock | Get, Get Many |
| Order Tag | Create, Get, Get Many, Update, Delete |
| Order Transaction | Get, Get Many |
| **Fulfillment** | |
| Fulfillment | Create, Get, Get Many, Update, Delete, Cancel |
| Fulfillment Location | Create, Get, Get Many, Update, Delete |
| **Products** | |
| Product | Create, Get, Get Many, Update, Archive, Unarchive |
| Product Collection | Create, Get, Get Many, Update |
| Product Price | Create, Get, Get Many, Update |
| Product Tag | Create, Get, Get Many, Update, Delete |
| Product Variant | Create, Get, Get Many, Update |
| **Funnels & Pages** | |
| Funnel | Get, Get Many, Update |
| Funnel Tag | Create, Get, Get Many, Update, Delete |
| Page | Get, Get Many, Update |
| **Courses** | |
| Course | Get, Get Many |
| Course Enrollment | Create, Get, Get Many, Update |
| Course Lesson | Get, Get Many, Update |
| Course Section | Get, Get Many, Update |
| Lesson Completion | Create, Get, Get Many, Delete |
| **Forms** | |
| Form | Create, Get, Get Many, Update, Delete |
| Form Field | Create, Get, Get Many, Update, Delete |
| Form Field Option | Create, Get, Get Many, Update, Delete |
| Form Field Set | Create, Get, Get Many, Update, Delete |
| Form Submission | Create, Get, Get Many, Update, Delete |
| Form Submission Answer | Create, Get, Get Many, Update, Delete |
| Form Submission (Legacy) | Get, Get Many |
| **Sales Pipeline** | |
| Sales Pipeline | Create, Get, Get Many, Update |
| Pipeline Stage | Create, Get, Get Many, Update, Delete |
| Sales Opportunity | Create, Get, Get Many, Update, Delete |
| Opportunity Note | Create, Get, Get Many, Update, Delete |
| **Shipping** | |
| Shipping Location Group | Get, Get Many |
| Shipping Package | Create, Get, Get Many, Update, Delete |
| Shipping Profile | Create, Get, Get Many, Update, Delete |
| Shipping Rate | Create, Get, Get Many, Update, Delete |
| Shipping Rate Name | Create, Get, Get Many, Update, Delete |
| Shipping Zone | Create, Get, Get Many, Update, Delete |
| **Stores & Content** | |
| Image | Create, Get, Get Many, Update, Delete |
| Store | Create, Get, Get Many, Update, Delete |
| Style | Get Many |
| Theme | Get, Get Many, Update, Set Default |
| **Platform** | |
| Scheduled Event | Get Many |
| Site | Get, Update |
| Team | Get, Get Many, Update |
| User | Get, Get Current, Get Many |
| Workspace | Get, Get Many, Update |
| **Webhooks** | |
| Webhook Endpoint | Create, Get, Get Many, Update, Delete |
| Webhook Event | Get, Get Many |

## Trigger Node

The **ClickFunnels Trigger** node listens for real-time webhook events including:

- Contact created/updated/deleted/identified
- Order created/updated
- Purchase created/updated
- Subscription created/updated/cancelled/upgraded/downgraded
- Course enrollment created/updated
- Form submission created
- Fulfillment created/updated
- One-time order created/updated
- And more...

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode
npm run dev
```

## Links

- **Homepage:** [next8n.com](https://next8n.com)
- **npm:** [npmjs.com/package/n8n-nodes-clickfunnel](https://www.npmjs.com/package/n8n-nodes-clickfunnel)
- **GitHub:** [github.com/mjmirza/n8n-nodes-clickfunnel](https://github.com/mjmirza/n8n-nodes-clickfunnel)
- **ClickFunnels API:** [developers.myclickfunnels.com](https://developers.myclickfunnels.com/)

## Legal Notice

This is an independent, community-built integration that uses the publicly available [ClickFunnels API](https://developers.myclickfunnels.com/).

"ClickFunnels" and the ClickFunnels logo are trademarks of Etison LLC. This project is **not** affiliated with, endorsed by, or sponsored by Etison LLC or ClickFunnels in any way. All product names, logos, and brands are property of their respective owners.

The ClickFunnels name and logo are used solely for the purpose of describing this integration's functionality and compatibility with the ClickFunnels platform. This constitutes nominative fair use.

This software is provided by the community, for the community, under the MIT License.

## License

[MIT](LICENSE) — see LICENSE file for the full legal notice.
