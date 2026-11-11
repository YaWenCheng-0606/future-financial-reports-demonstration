# Honeycomb — Future Financial Reporting

An interactive research demonstration by **Ya-Wen Cheng**, Accounting & Information Systems.

**[Open the website](https://yawencheng-0606.github.io/honeycomb/)** · **[Presentation guide](PRESENTATION.md)** · [Source repository](https://github.com/YaWenCheng-0606/future-financial-reports-demonstration)

Honeycomb starts with a user's question and connects company information to asset-level evidence, comparable companies, earlier periods and external observations. The woodland design reflects the creator's preference for Winnie the Pooh imagery. The demonstration uses the fictional **Miklos & Co.** and synthetic records throughout.

## Research purpose

The proposed platform could lower the cost of finding, matching and verifying financial information. Its research questions concern investment, audit and management efficiency, source accountability, and conditions associated with adverse selection. These are **hypotheses to evaluate**, not demonstrated causal effects or quantified benefits.

A suitable study would give participants the same underlying evidence and compare conventional cross-source research with an integrated workflow. Measures could include completion time, entity or period mismatches, unsupported conclusions, reproducibility and understanding of source assurance.

## Explore the prototype

Start with **Guided demo** for a seven-chapter presentation, or choose a perspective:

| Perspective | Additional information in this demonstration |
| --- | --- |
| Investor | Public financial information and external property observations |
| IRS analyst | Public information plus a synthetic return reconciliation for assigned case MKG-25-TAX |
| External auditor | Public information, an internal asset register and an assurance-scope illustration |
| Company management | Public information, an internal asset register, planning assumptions and a version correction |
| Financial regulator | Public information and an assurance-scope illustration |

Role selection is **not a login**. These browser controls demonstrate a proposed policy interaction and do not secure confidential data. All shipped records are synthetic and inspectable in the source. Production access must be authenticated and enforced on a server for the specific user, organization, purpose, case or engagement.

### Asset question

Ask: **“Does Miklos & Co. have undervalued assets?”**

Hundred Acre Tower has an illustrative carrying amount of **$100 million**. External observations indicate **$130–150 million**, with a **$140 million** midpoint. At **$5 million** in selling costs, the midpoint scenario is:

```text
Pretax disposal gain = 140 − 5 − 100 = $35 million
Cash proceeds before tax and debt repayment = 140 − 5 = $135 million
```

The sale-price and selling-cost sliders recalculate the scenario. Under the simplified ordinary US GAAP asset-sale assumption, a recognized disposal gain would normally enter **earnings, not OCI**. A market estimate is not an already recognized gain. A gap between market value and carrying amount does not establish a financial-statement error or undervaluation of the company's shares. The model holds carrying amount constant after the reporting date and excludes intervening depreciation, taxes, financing and unusual transaction terms.

### Tax question

Ask: **“Why does Miklos & Co. earn more but pay less tax?”**

The public comparison distinguishes pretax income, current tax expense, deferred tax expense, total tax expense and cash payments. The assigned IRS perspective can inspect the synthetic bridge:

```text
Book pretax income                         $100m
Additional tax depreciation                 −60m
Illustrative taxable income                  40m
Current tax at the illustrative 20% rate       8m
Deferred tax expense                         12m
Total book tax expense                       20m
```

**20% is a toy-model assumption, not the US statutory corporate tax rate.** Cash paid equals current expense only by assumption in this example. The timing difference explains the lower current tax in the toy model; a lower cash payment than peers does not establish underreporting.

## Sources, agent authority and evidence

**Source network** separates the company agent from the external property-provider agent. Each provider has its own simulated organizational identity, scoped agent mandate and exact data-response checks. Revoking a demo mandate or altering a demo payload changes source admission and pauses dependent calculations. Restore the source to continue.

The proposed identity chain is an organizational credential, an explicit binding of agent identity and signing key to a scoped mandate, and verification of the exact returned payload. A production implementation must specify and validate these mechanisms. **This prototype does not issue or cryptographically verify vLEI credentials.** Its `DEMO-ORG-*` identifiers are not registered LEIs. Source identity, authorization, data integrity and assurance of an economic claim are distinct questions.

**Evidence trail** computes a real local SHA-256 hash chain using Web Crypto. **Verify chain** checks consistency; **Alter a copy & verify** demonstrates detection of a modified copy while retaining the original local history. Evidence packs can be downloaded as JSON with simulation labels and permitted scenario detail.

This is **not a deployed blockchain**, distributed consensus system, independent timestamp service or production access-control mechanism. A local history rewritten in full would require an independently retained anchor to expose the rewrite. A production permissioned ledger could retain evidence commitments, version references and access-decision records, while confidential documents remain in controlled off-chain storage. Authorization services enforce access; ledger records alone do not enforce it.

## What works here, and what remains proposed

| Working in the browser | Proposed production capability |
| --- | --- |
| Deterministic English / Chinese scenario routing | Live agent orchestration over permitted data APIs |
| Synthetic cross-company, cross-year and property examples | Licensed and validated company and external records |
| Role-dependent presentation and denial interactions | Authenticated, server-enforced entitlements |
| Simulated credential, mandate and payload checks | Real issuer-chain, agent-key, revocation and signature verification |
| Explicit financial calculations | Reviewed accounting and valuation methods for specific cases |
| Local SHA-256 chain consistency and JSON export | Independently anchored evidence history with governance |

There is **no live LLM, financial database, property discovery service, IRS connection, real vLEI verification or blockchain network** connected to this website. Real reference links explain standards and possible data sources; they do not authenticate the fictional providers or records.

## XBRL compatibility and architecture direction

The question-first experience can build on XBRL rather than replace it. A future implementation can preserve filing facts, taxonomy concepts, dimensions, units and periods, then connect them to legal entities, assets and external observations. A linked object or evidence layer would organize identifiers, source references, versions and relationships; it is not a claim that XBRL lacks structured facts or dimensions.

The proposed architecture separates three jobs: **data and semantics**, **identity and authorization**, and **evidence and reasoning**. Implementing live connectors, entity/asset matching, agent delegation, server policy and independent evidence anchoring remains research and engineering work.

## Run locally

No package installation or build is required. From this repository directory:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`. Use localhost or HTTPS so the browser can expose Web Crypto. Refreshing resets the in-memory demonstration, including source toggles, corrections and evidence history. Google Fonts are optional; system-font fallbacks are provided.

## Files

- `index.html` — page structure and navigation.
- `styles.css` — responsive woodland visual design.
- `data.js` — synthetic data, permissions and real reference links.
- `app.js` — scenario routing, calculations, role views and guided tour.
- `trust.js` — local hash-chain implementation and explicitly simulated credential checks.
- `assets/` — artwork and icon assets.
- `PRESENTATION.md` — a six-to-eight-minute professor demonstration.

The live copy is hosted in the `/honeycomb/` directory of the creator's GitHub Pages repository. This repository is the canonical project source. The academic demonstration is not affiliated with Disney or the Winnie the Pooh rights holders.
