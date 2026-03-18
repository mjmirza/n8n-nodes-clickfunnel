<p align="center">
  <img src="https://raw.githubusercontent.com/mjmirza/n8n-nodes-clickfunnel/main/assets/clickfunnels-logo.svg" alt="ClickFunnels" width="80" />
</p>

<h1 align="center">n8n-nodes-clickfunnel</h1>

<p align="center">
  <strong>The most complete ClickFunnels integration for n8n. Period.</strong><br/>
  Built, maintained, and owned by <a href="https://next8n.com">next8n</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/n8n-nodes-clickfunnel"><img src="https://img.shields.io/npm/v/n8n-nodes-clickfunnel?style=for-the-badge&color=CB3837&label=npm" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/n8n-nodes-clickfunnel"><img src="https://img.shields.io/npm/dt/n8n-nodes-clickfunnel?style=for-the-badge&color=blue&label=downloads" alt="npm downloads" /></a>
  <a href="https://github.com/mjmirza/n8n-nodes-clickfunnel/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Resources-52-F71835?style=for-the-badge" alt="52 Resources" />
  <img src="https://img.shields.io/badge/Operations-200+-F71835?style=for-the-badge" alt="200+ Operations" />
  <img src="https://img.shields.io/badge/Tests-63_Passed-brightgreen?style=for-the-badge" alt="63 Tests Passed" />
  <img src="https://img.shields.io/badge/API-Full_Coverage-F71835?style=for-the-badge" alt="Full API Coverage" />
  <img src="https://img.shields.io/badge/Webhooks-28+_Events-080436?style=for-the-badge" alt="28+ Webhook Events" />
  <img src="https://img.shields.io/badge/Security-Enterprise_Hardened-080436?style=for-the-badge" alt="Enterprise Hardened" />
  <img src="https://img.shields.io/badge/SSRF-Protected-080436?style=for-the-badge" alt="SSRF Protected" />
  <img src="https://img.shields.io/badge/HMAC-Webhook_Verified-080436?style=for-the-badge" alt="HMAC Verified" />
  <img src="https://img.shields.io/badge/n8n-Community_Node-FF6D5A?style=for-the-badge" alt="n8n Community Node" />
  <img src="https://img.shields.io/badge/AI_Agent-Compatible-98C1D9?style=for-the-badge" alt="AI Agent Compatible" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Maintained-Active-brightgreen?style=for-the-badge" alt="Actively Maintained" />
</p>

---

## You're automating ClickFunnels manually. And it's costing you hours.

Every time a new contact comes in, an order is placed, or a subscription changes — you're either doing it by hand, paying for Zapier, or duct-taping webhooks to custom scripts that break every time ClickFunnels updates something.

Your clients want their funnels connected to their CRM, their fulfillment, their email sequences, their dashboards. They want it **now**, not in two sprints.

**This node connects everything in 2 minutes.**

Drop it into any n8n workflow. 52 resources. 200+ operations. Every single endpoint from the ClickFunnels 2.0 API — contacts, orders, products, funnels, courses, forms, fulfillments, shipping, sales pipeline, webhooks. All of it.

No other ClickFunnels node comes close.

<p align="center">
  <a href="https://next8n.com"><img src="https://img.shields.io/badge/Need_Help_Setting_Up%3F-Book_a_Free_Call-F71835?style=for-the-badge&logoColor=white" alt="Book a consultation" /></a>
</p>

---

## How it works

```
[ClickFunnels] <--> [n8n-nodes-clickfunnel] <--> [Your CRM / Email / Sheets / Slack / Anything]
```

**Trigger: New contact comes in**
```json
{
  "event": "contact.created",
  "data": {
    "email": "sarah@example.com",
    "first_name": "Sarah",
    "last_name": "Johnson",
    "tags": ["webinar-signup", "premium-lead"]
  }
}
```

**Action: Automatically sync everywhere**
```
ClickFunnels Trigger → Google Sheets (log lead) → HubSpot (create contact) → Slack (notify sales)
```

No code. No Zapier. No monthly per-zap pricing. Just n8n + this node.

---

## What you get — the full ClickFunnels 2.0 API

Other nodes cover 5–10 resources. We cover **all 52**.

### Contacts & CRM
| Resource | What you can do |
|----------|----------------|
| Contact | Create, Get, Get Many, Update, Delete, Upsert, GDPR Redact |
| Contact Tag | Full CRUD — organize your audience at scale |
| Contact Applied Tag | Apply and remove tags per contact |

### Orders & E-Commerce
| Resource | What you can do |
|----------|----------------|
| Order | Create external orders, sync, update |
| Order Invoice | Create, fetch, update invoices |
| Order Transaction | Pull payment transaction data |
| Order Tag | Tag orders for segmentation |
| Order Applied Tag | Apply tags to individual orders |
| Order Restock | Track restocks |
| Fulfillment | Create, update, cancel fulfillments |
| Fulfillment Location | Manage warehouse locations |

### Products
| Resource | What you can do |
|----------|----------------|
| Product | Full CRUD + Archive/Unarchive |
| Product Price | Manage pricing tiers |
| Product Variant | SKUs, weights, dimensions |
| Product Collection | Organize product catalogs |
| Product Tag | Tag products for filtering |

### Funnels & Pages
| Resource | What you can do |
|----------|----------------|
| Funnel | Read and update funnel data |
| Funnel Tag | Organize funnels with tags |
| Page | Access and update pages within funnels |

### Courses & Learning
| Resource | What you can do |
|----------|----------------|
| Course | List and fetch course data |
| Course Section | Manage sections within courses |
| Course Lesson | Manage individual lessons |
| Course Enrollment | Enroll students, track progress |
| Lesson Completion | Mark lessons complete, track completions |

### Forms & Submissions
| Resource | What you can do |
|----------|----------------|
| Form | Full CRUD on forms |
| Form Field Set | Manage field groups |
| Form Field | Individual field management |
| Form Field Option | Dropdown/select options |
| Form Submission | Capture and manage submissions |
| Form Submission Answer | Individual answer data |
| Form Submission (Legacy) | Backward-compatible access |

### Sales Pipeline
| Resource | What you can do |
|----------|----------------|
| Sales Pipeline | Create and manage pipelines |
| Pipeline Stage | Define deal stages |
| Sales Opportunity | Track deals through stages |
| Opportunity Note | Add notes to opportunities |

### Shipping
| Resource | What you can do |
|----------|----------------|
| Shipping Profile | Manage shipping configurations |
| Shipping Zone | Define shipping regions |
| Shipping Rate | Set rates per zone |
| Shipping Rate Name | Name your rate tiers |
| Shipping Package | Package dimensions and weight |
| Shipping Location Group | Group locations |

### Stores, Themes & Platform
| Resource | What you can do |
|----------|----------------|
| Store | Create and manage stores |
| Theme | Manage themes, set defaults |
| Style | List available styles |
| Image | Upload and manage images |
| Site | Get and update site settings |
| Team | Manage team data |
| User | User data + "Get Current" for auth flows |
| Workspace | Workspace management |
| Scheduled Event | Appointment data |

### Webhooks
| Resource | What you can do |
|----------|----------------|
| Webhook Endpoint | Register, update, delete webhook endpoints |
| Webhook Event | List available event types |

---

## Real-time triggers — 28+ webhook events

The **ClickFunnels Trigger** node fires instantly when things happen:

| Category | Events |
|----------|--------|
| **Contacts** | Created, Updated, Deleted, Identified |
| **Orders** | Created, Updated |
| **One-Time Orders** | Created, Updated |
| **Invoices** | Created, Updated |
| **Subscriptions** | Created, Updated, Cancelled, Uncancelled, Upgraded, Downgraded |
| **Purchases** | Created, Updated |
| **Products** | Created, Updated |
| **Courses** | Enrollment Created/Updated, Lesson Completed |
| **Forms** | Submission Created |
| **Funnels** | Created, Updated |
| **Fulfillments** | Created, Updated |

---

## Enterprise-grade security. Not an afterthought.

| Feature | Implementation |
|---------|---------------|
| **SSRF Protection** | Strict subdomain validation — requests can only reach `*.myclickfunnels.com` |
| **Input Sanitization** | Every ID validated against injection (path traversal, null bytes, unicode) |
| **Token Security** | Control character rejection, length limits, no token leakage in error messages |
| **Webhook HMAC** | SHA-256 signature verification with timing-safe comparison |
| **Retry Logic** | Exponential backoff with jitter on 429/502/503/504 |
| **Error Handling** | Truncated error messages (no PII leakage), per-item continue-on-fail |
| **URL Validation** | HTTPS-only enforcement for external URLs |

---

## Installation

### From n8n (Recommended)

1. Go to **Settings → Community Nodes**
2. Enter `n8n-nodes-clickfunnel`
3. Click **Install**
4. Done. The **ClickFunnels** node appears in your node palette.

### Manual

```bash
cd ~/.n8n
npm install n8n-nodes-clickfunnel
```

---

## Quick Start (2 minutes)

1. **Install** the node (see above)
2. **Create credentials:** ClickFunnels API → enter your subdomain + access token
3. **Drag "ClickFunnels"** into any workflow
4. **Pick a resource** (Contact, Order, Product, etc.) and an operation (Create, Get, etc.)
5. **Run it.** That's it.

For real-time triggers, use the **ClickFunnels Trigger** node — select your events, activate the workflow, and incoming data flows automatically.

---

## Who this is for

- **n8n consultants** building automation for clients who use ClickFunnels and ask "can you connect this to everything else?"
- **Agencies** delivering funnel-to-fulfillment automation for e-commerce clients
- **Course creators** who need enrollment, completion tracking, and student management automated
- **SaaS founders** using ClickFunnels for landing pages and need order/subscription data flowing into their stack
- **Anyone** tired of manually exporting CSVs from ClickFunnels and importing them somewhere else

---

## We build ClickFunnels automation. For a living.

We've delivered n8n automation for clients across **e-commerce**, **education**, **SaaS**, and **consulting** — all using ClickFunnels as their front-end.

The question always comes up: "Can you connect ClickFunnels to [X]?" The existing nodes covered 5 resources. Our clients needed 52.

**This node exists because we solve this problem every day.**

<p align="center">
  <a href="https://next8n.com"><img src="https://img.shields.io/badge/Need_a_Custom_Integration%3F-Let's_Talk-F71835?style=for-the-badge&logoColor=white" alt="Custom integration" /></a>
</p>

---

## Other nodes by next8n

| Node | What it does |
|------|-------------|
| [n8n-nodes-redactor](https://www.npmjs.com/package/n8n-nodes-redactor) | Redact PII before sending to LLMs — GDPR/HIPAA compliant |
| [n8n-nodes-xentral](https://www.npmjs.com/package/n8n-nodes-xentral) | Full Xentral ERP integration — 30 resources, 196 operations |

---

## Legal Notice

This is an independent, community-built integration that uses the publicly available [ClickFunnels API](https://developers.myclickfunnels.com/).

"ClickFunnels" and the ClickFunnels logo are trademarks of Etison LLC. This project is **not** affiliated with, endorsed by, or sponsored by Etison LLC or ClickFunnels in any way. All product names, logos, and brands are property of their respective owners.

The ClickFunnels name and logo are used solely for the purpose of describing this integration's functionality and compatibility with the ClickFunnels platform. This constitutes nominative fair use.

This software is provided by the community, for the community, under the MIT License.

## License

[MIT](https://github.com/mjmirza/n8n-nodes-clickfunnel/blob/main/LICENSE)

<p align="center">
  <a href="https://next8n.com"><img src="https://img.shields.io/badge/next8n.com-FF6D5A?style=for-the-badge&logoColor=white" alt="next8n" /></a>
  <a href="https://github.com/mjmirza/n8n-nodes-clickfunnel"><img src="https://img.shields.io/badge/GitHub-Source-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
</p>
