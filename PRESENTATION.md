# Honeycomb: professor demonstration

**Presenter:** Ya-Wen Cheng  
**Website:** https://yawencheng-0606.github.io/honeycomb/  
**Length:** approximately 6–8 minutes

Open the website and choose **Guided demo**. Its seven chapters follow the sequence below. The website is in English; the short Chinese notes are presenter reminders. Refresh before presenting to reset source toggles, corrections and the local evidence trail.

## 1. Start with the research question — 45 seconds

**Screen:** Welcome / choose a perspective.

> “My research starts with the user's question. Instead of asking people to search separate financial reports and external databases, I want an integrated platform to connect relevant evidence and make its source and authority visible.”

> “The same company produces different questions for an investor, an auditor, management and a tax authority. Their permitted evidence also differs.”

**提醒：** 先說「問題導向」與跨來源整合。所有公司、數字和身分憑證均為示範資料。角色選擇不是正式登入。

## 2. Follow an investor's asset question — 90 seconds

**Action:** Next chapter, or select **Investor** and ask:

**Does Miklos & Co. have undervalued assets?**

> “The platform connects the company's reported carrying amount to a specific property, then to external market observations. The user can inspect the sources and reproduce the calculation.”

Point to the values:

| Input or output | Illustrative amount |
| --- | --- |
| Hundred Acre Tower carrying amount | $100m |
| External market indication | $130–150m |
| Midpoint sale-price assumption | $140m |
| Selling costs | $5m |
| Midpoint pretax disposal gain | $35m |
| Cash proceeds before tax and debt repayment | $135m |

Move the sale-price or selling-cost slider once. Open **How is the disposal gain calculated?** if useful, then close it before continuing.

> “The default estimate is 140 minus 5 minus 100, or a $35 million pretax disposal gain. In this ordinary US GAAP building-sale scenario, the gain would normally enter earnings, not OCI. An estimate is not a booked gain.”

**提醒：** 不要把市價高於帳面說成會計錯誤，也不要直接說公司股票被低估。這是簡化資產出售情境，未計稅及債務償還。

## 3. Inspect both source agents — 75 seconds

**Screen:** Source network.

Open the **External property observations** card using **Inspect identity & authority**. Show the separate provider, **Woodland Property Exchange**, and **Woodland Market Discovery Agent**.

> “Authenticating the company does not authenticate an external property provider. Both need an accountable organizational identity, an agent mandate and evidence binding the exact response to that mandate.”

Select **Simulate mandate revocation**. Note the failed mandate check. Close the panel and return to **Ask & explore**, then ask the asset question again to show that the dependent calculation pauses. Return to that provider and select **Restore demo mandate** before continuing.

> “vLEI is an organizational identity anchor in the proposed design. The agent's scoped delegation and the exact payload must also be checked. A valid source identity does not prove that a valuation is economically correct.”

**提醒：** 這裡是模擬驗證，不是真正 vLEI 驗簽。外部來源不能沿用公司的信任身分。示範撤銷後記得恢復，避免後面估值保持暫停。

## 4. Demonstrate the disclosure boundary — 40 seconds

**Screen:** Guided demo chapter “Try the disclosure boundary.”

As an investor, ask:

**Show the company tax return detail**

The agent displays an access denial and offers a public-information alternative.

> “Knowing who a user is does not automatically authorize every request. Access must depend on the data, the purpose and the applicable mandate. A real authorization service would enforce that boundary.”

**提醒：** Blockchain 可記錄存取決策和證據參照；授權服務才是實際執行權限的地方。本網站全部資料是虛構，前端控制不是安全機制。

## 5. Switch to the assigned IRS case — 75 seconds

**Action:** Next chapter, or change perspective to **IRS analyst** and ask:

**Why does Miklos & Co. earn more but pay less tax?**

Show the peer comparison first, then the authorized book–tax reconciliation.

> “Miklos has $100 million of book pretax income, $8 million of current tax and $12 million of deferred tax expense. Total book tax expense is $20 million. The toy return bridge includes $60 million of additional tax depreciation, leaving $40 million of illustrative taxable income.”

> “The demonstration uses a 20% modeling assumption. It is not the US statutory corporate tax rate. Cash paid is a separate measure; it equals current expense here only because the example assumes that.”

> “Lower cash tax than peers is a question to investigate, not proof of underreporting. The platform's value is to connect the relevant evidence and explain what remains unresolved.”

**提醒：** 強調 current tax、deferred tax、total tax expense 和 cash tax 不同。不能因繳稅較少就判斷逃漏稅。

## 6. Verify and alter an evidence record — 60 seconds

**Screen:** Evidence trail.

Select **Verify chain**, then **Alter a copy & verify**. Point out that the original local history remains unchanged. Optionally select **Download evidence pack** to export the scenario and permitted detail.

> “This part actually computes SHA-256 hashes in the browser. Altering a record in a copy breaks its link to the recorded hash. That illustrates one property of an evidence trail.”

> “This is a local chain, not a deployed blockchain. It does not supply distributed consensus or independent timestamping. A rewritten entire history would need an independently retained anchor to expose the rewrite. Confidential records would stay off-chain in the proposed system.”

**提醒：** 清楚區分真實運算的 SHA-256 與尚未部署的 blockchain。不要說區塊鏈保證經濟事實正確。

## 7. End with a testable research design — 60 seconds

**Screen:** Research notebook.

> “My proposition is that connecting attributable evidence can reduce information acquisition and verification costs and improve investment, audit and management workflows. It may reduce conditions associated with adverse selection, but that effect still needs empirical testing.”

> “A study could give participants the same evidence and compare conventional research with this integrated workflow. I would measure completion time, entity or period mismatches, unsupported conclusions, reproducibility and understanding of assurance.”

> “The architecture can preserve XBRL facts and taxonomy semantics. The research contribution concerns how information is connected, accessed, verified and presented for a user's question.”

**討論問題：** “Which part would make the strongest initial research contribution: cross-source decision support, agent accountability, or the experimental evaluation of information costs?”

## Optional branches if the professor asks

| Question | Show |
| --- | --- |
| What can an auditor inspect? | Change perspective to **External auditor**; select the asset-register reconciliation question. |
| What can management do? | Choose **Company management**; explore the internal planning case or publish the synthetic $4m correction. The carrying amount becomes $104m while earlier evidence remains in the trail. |
| Is every source equally assured? | Inspect a source card's **Assurance boundary** and distinguish company facts, external observations and platform estimates. |
| Is there a live model or database? | Open **Research prototype** / **Demo boundaries**. Question routing is deterministic; external records and credential results are simulated. |
| Why not just improve XBRL? | Explain that the design can build on XBRL. It adds relationships, source accountability, scoped agent authority and the question-first workflow. |

## Presentation checklist

- Open the live website once before the meeting and allow the artwork to load.
- Refresh to begin with the default $100m carrying amount, $140m price and $5m costs.
- Use the suggested questions or Guided demo for predictable coverage.
- Restore any revoked mandate or altered payload after demonstrating it.
- Say “synthetic example,” “proposed production design,” and “hypothesis” where appropriate.
- Keep the local option available: from the repository, run `python -m http.server 8000` and open `http://localhost:8000/`.
