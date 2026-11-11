/* Academic demonstration data. Every organization, financial amount, credential,
 * agent identity and verification result below is fictional or simulated.
 * Public reference links describe real standards; they do not authenticate this demo. */
window.DEMO_DATA = {
  product: 'Honeycomb',
  subtitle: 'Future Financial Reporting',
  disclosure: 'Research prototype · synthetic data · simulated identity and access controls',
  currency: 'USD',
  amountUnit: 'millions',
  referenceDate: '2026-11-10',
  roles: [
    { id: 'investor', title: 'Investor', shortTitle: 'Investor', subtitle: 'Discover value with public evidence.', scope: 'Public information only', access: ['public-financials', 'property-market'], focus: 'Asset value and investment questions', suggestions: ['Does Miklos & Co. have undervalued assets?', 'What happens if Hundred Acre Tower is sold?', 'Show the sources behind this valuation.'] },
    { id: 'tax', title: 'IRS analyst', shortTitle: 'IRS analyst', subtitle: 'Explain tax differences in an assigned case.', scope: 'Simulated assigned case MKG-25-TAX', access: ['public-financials', 'property-market', 'tax-return'], focus: 'Book–tax reconciliation and supported risk flags', suggestions: ['Why does Miklos & Co. earn more but pay less tax?', 'Explain the book–tax reconciliation.', 'Does this difference establish tax underreporting?'] },
    { id: 'auditor', title: 'External auditor', shortTitle: 'Auditor', subtitle: 'Follow the numbers back to evidence.', scope: 'Simulated authorized audit engagement', access: ['public-financials', 'property-market', 'asset-subledger', 'assurance'], focus: 'Asset reconciliation, provenance and assurance scope', suggestions: ['Reconcile the tower carrying amount to the asset register.', 'Which evidence supports these numbers?', 'What has been assured and what is an estimate?'] },
    { id: 'management', title: 'Company management', shortTitle: 'Management', subtitle: 'Compare decisions using approved internal detail.', scope: 'Simulated corporate finance mandate', access: ['public-financials', 'property-market', 'asset-subledger', 'internal-forecast'], focus: 'Disposal scenarios and internal planning', suggestions: ['Compare sale-price scenarios for Hundred Acre Tower.', 'Show the internal asset breakdown.', 'How does a higher selling cost change the result?'] },
    { id: 'regulator', title: 'Financial regulator', shortTitle: 'Regulator', subtitle: 'Inspect disclosure consistency and provenance.', scope: 'Simulated disclosure-review mandate', access: ['public-financials', 'property-market', 'assurance'], focus: 'Disclosure consistency and source accountability', suggestions: ['Which claims are company statements versus platform estimates?', 'Review the source and authorization trail.', 'What does a verified source actually prove?'] }
  ],
  company: {
    id: 'miklos', name: 'Miklos & Co.', displayName: 'Miklos & Co. (fictional)',
    description: 'A fictional US operating company created solely for this research demonstration.',
    period: 'FY2025', periodEnd: '2025-12-31', accountingBasis: 'US GAAP, simplified illustration',
    organizationId: 'DEMO-ORG-MIKLOS', agent: 'Miklos Corporate Data Agent',
    revenue: 480, pretaxIncome: 100, totalTaxExpense: 20, netIncome: 80,
    assets: 650, debt: 220, fictional: true
  },
  asset: {
    id: 'hundred-acre-tower', name: 'Hundred Acre Tower',
    location: 'New York City · fictional property', address: 'Demonstration location; no real parcel claimed',
    type: 'Owner-occupied office property', ownership: 1, areaSqFt: 600000,
    bookDate: '2025-12-31', valuationDate: '2026-11-10',
    land: 40, buildings: 90, improvements: 10, accumulatedDepreciation: 40,
    carryingAmount: 100, valuationLow: 130, valuationMid: 140, valuationHigh: 150,
    sellingCosts: 5, gainLow: 25, gainMid: 35, gainHigh: 45,
    cashLow: 125, cashMid: 135, cashHigh: 145,
    sourceIds: ['company-data', 'property-market'],
    formula: 'Estimated sale price − selling costs − carrying amount at disposal',
    cashFormula: 'Estimated sale price − selling costs, before tax and debt repayment',
    accountingNote: 'An ordinary US GAAP building disposal gain usually enters earnings, not OCI. A market estimate is not an already recognized gain.',
    assumptions: ['100% ownership and a straightforward asset sale.', 'The illustrative carrying amount is held constant through the scenario date; no intervening depreciation, additions or impairment are modeled.', 'Selling costs are fixed at $5m unless the user changes the scenario.', 'Tax effects and debt repayment are excluded; tax basis and transaction terms would be required.', 'Nearby transactions are illustrative valuation evidence, not an independent appraisal.'],
    limitations: ['All property observations are fictional.', 'Market value above carrying amount does not establish an accounting error or undervaluation of the company’s shares.', 'A production system must confirm ownership, parcel identity, dates, leases, condition and comparability.'],
    comparables: [
      { id: 'comp-1', name: 'Willow Office Center', date: '2026-06-18', areaSqFt: 600000, adjustedIndication: 130, pricePerSqFt: 216.67, note: 'Fictional observation; adjusted to the subject property.' },
      { id: 'comp-2', name: 'Clover Business House', date: '2026-08-07', areaSqFt: 600000, adjustedIndication: 140, pricePerSqFt: 233.33, note: 'Fictional observation; adjusted to the subject property.' },
      { id: 'comp-3', name: 'Oak Meadow Offices', date: '2026-09-22', areaSqFt: 600000, adjustedIndication: 150, pricePerSqFt: 250.00, note: 'Fictional observation; adjusted to the subject property.' }
    ]
  },
  tax: {
    period: 'FY2025', scope: 'Simplified domestic corporate comparison',
    demoRate: 0.20,
    rateNote: '20% is an illustrative modeling assumption, not the US statutory corporate tax rate.',
    cashNote: 'For this simplified FY2025 illustration, cash tax paid equals current tax expense. Actual payment, refund and settlement timing must be reconciled separately.',
    companies: [
      { id: 'miklos', name: 'Miklos & Co.', pretaxIncome: 100, currentTax: 8, deferredTax: 12, totalTax: 20, cashTax: 8, bookETR: 0.20, cashToPretax: 0.08 },
      { id: 'willow', name: 'Willow Industries', pretaxIncome: 80, currentTax: 16, deferredTax: 0, totalTax: 16, cashTax: 16, bookETR: 0.20, cashToPretax: 0.20 },
      { id: 'clover', name: 'Clover Manufacturing', pretaxIncome: 95, currentTax: 17, deferredTax: 2, totalTax: 19, cashTax: 17, bookETR: 0.20, cashToPretax: 17 / 95 }
    ],
    history: [
      { year: 2023, pretaxIncome: 80, totalTax: 16, cashTax: 15 },
      { year: 2024, pretaxIncome: 90, totalTax: 18, cashTax: 13 },
      { year: 2025, pretaxIncome: 100, totalTax: 20, cashTax: 8 }
    ],
    reconciliation: {
      bookPretaxIncome: 100, additionalTaxDepreciation: 60, taxableIncome: 40,
      currentTax: 8, deferredTax: 12, totalTax: 20, unexplainedInToyModel: 0,
      steps: [
        { label: 'Book pretax income', value: 100 },
        { label: 'Additional tax depreciation (temporary difference)', value: -60 },
        { label: 'Illustrative taxable income', value: 40 },
        { label: 'Current tax at the illustrative 20% rate', value: 8 },
        { label: 'Deferred tax expense on the $60m temporary difference', value: 12 }
      ]
    },
    conclusion: 'In this toy model, a documented timing difference explains the lower current tax. Lower cash tax than peers does not establish underreporting.',
    limitations: ['All companies, returns and figures are synthetic.', 'Peer selection must align industry, jurisdiction, period and tax-group perimeter.', 'The demonstration excludes credits, permanent differences, foreign operations and actual tax-law limitations.', 'A real tax finding requires authorized return data, supporting evidence and appropriate human review.']
  },
  sources: [
    {
      id: 'company-data', name: 'Company financial & asset records', org: 'Miklos & Co. (fictional)',
      agent: 'Miklos Corporate Data Agent', organizationId: 'DEMO-ORG-MIKLOS',
      scope: 'Provide approved public FY2025 financial and property disclosures',
      description: 'Synthetic company-issued data links Hundred Acre Tower to a $100m carrying amount. The credential and signature result are simulated.',
      version: 'FY2025 / release 1.0', assurance: 'Source identity is simulated; no real company certification or audit opinion.',
      url: 'https://www.sec.gov/search-filings/edgar-application-programming-interfaces', status: 'simulated', kind: 'Company-provided fact',
      validUntil: '2027-12-31', issuedBy: 'Demo organizational credential issuer', credentialId: 'SIM-CRED-MIKLOS-01', mandateId: 'SIM-MANDATE-PUBLIC-25'
    },
    {
      id: 'property-market', name: 'External property observations', org: 'Woodland Property Exchange (fictional)',
      agent: 'Woodland Market Discovery Agent', organizationId: 'DEMO-ORG-WOODLAND',
      scope: 'Supply licensed or public property observations with source records',
      description: 'Three synthetic comparable indications illustrate external-agent discovery. Their provider is separately identified; company authentication does not authenticate market data.',
      version: 'Market snapshot / 2026-11-10', assurance: 'Simulated provider identity; observations are not an appraisal or assured fair value.',
      url: 'https://www.nyc.gov/site/finance/property/property-rolling-sales-data.page', status: 'simulated', kind: 'External observation',
      validUntil: '2027-12-31', issuedBy: 'Demo organizational credential issuer', credentialId: 'SIM-CRED-WOODLAND-01', mandateId: 'SIM-MANDATE-MARKET-26'
    },
    {
      id: 'peer-filings', name: 'Peer-company financial disclosures', org: 'Public Filing Index (fictional service)',
      agent: 'Peer Comparison Agent', organizationId: 'DEMO-ORG-FILING-INDEX',
      scope: 'Retrieve and normalize public filings for comparable periods',
      description: 'Synthetic Miklos, Willow and Clover values demonstrate a comparison across companies and years. Real filing extraction would retain document and fact references.',
      version: 'Peer set / FY2025', assurance: 'Platform extraction is distinct from a company-signed statement; all values here are synthetic.',
      url: 'https://www.sec.gov/search-filings/edgar-application-programming-interfaces', status: 'simulated', kind: 'Public filing comparison',
      validUntil: '2027-12-31', issuedBy: 'Demo platform registry', credentialId: 'SIM-CRED-PEERS-01', mandateId: 'SIM-MANDATE-FILINGS'
    },
    {
      id: 'tax-return', name: 'Assigned-case book–tax reconciliation', org: 'Demo tax-administration environment',
      agent: 'Assigned-Case Tax Agent', organizationId: 'DEMO-ORG-TAX',
      scope: 'Read mock return data for assigned case MKG-25-TAX only',
      description: 'A synthetic reconciliation shows book income of $100m, $60m of additional tax depreciation, and $40m of taxable income. No actual IRS records are connected.',
      version: 'Mock return / FY2025 / v1', assurance: 'A role selection is not real IRS authentication, case authorization or a compliance finding.',
      url: 'https://www.irs.gov/instructions/i1120sm3', status: 'simulated', kind: 'Restricted synthetic record',
      validUntil: '2027-12-31', issuedBy: 'Demo agency credential issuer', credentialId: 'SIM-CRED-TAX-01', mandateId: 'SIM-MANDATE-MKG-25-TAX'
    },
    {
      id: 'assurance', name: 'Evidence and assurance scope', org: 'Cedar Assurance (fictional)',
      agent: 'Engagement Evidence Agent', organizationId: 'DEMO-ORG-CEDAR',
      scope: 'Read synthetic evidence and engagement scope within the assigned mandate',
      description: 'Demonstrates the distinction between company statements, source verification and an independently scoped assurance engagement.',
      version: 'Demo engagement / FY2025', assurance: 'No real audit opinion is issued. Market estimates and platform calculations do not inherit assurance from source figures.',
      url: 'https://www.gleif.org/en/organizational-identity/lei-vlei/the-verifiable-lei-vlei', status: 'simulated', kind: 'Assurance-scope illustration',
      validUntil: '2027-12-31', issuedBy: 'Demo engagement registry', credentialId: 'SIM-CRED-ASSURANCE-01', mandateId: 'SIM-MANDATE-AUDIT-25'
    }
  ],
  permissions: [
    { id: 'public-financials', label: 'Public financial statements', description: 'Published company information and peer comparisons.', roles: ['investor', 'tax', 'auditor', 'management', 'regulator'] },
    { id: 'property-market', label: 'External property observations', description: 'Public or appropriately licensed market records.', roles: ['investor', 'tax', 'auditor', 'management', 'regulator'] },
    { id: 'tax-return', label: 'Mock tax-return detail', description: 'Assigned tax case only; regulator or auditor status alone is insufficient.', roles: ['tax'] },
    { id: 'asset-subledger', label: 'Internal asset register', description: 'Approved company access or assigned audit engagement.', roles: ['auditor', 'management'] },
    { id: 'internal-forecast', label: 'Internal disposal planning', description: 'Corporate planning mandate; not public disclosure.', roles: ['management'] },
    { id: 'assurance', label: 'Engagement evidence detail', description: 'Assigned audit or disclosure-review mandate.', roles: ['auditor', 'regulator'] }
  ],
  research: {
    claim: 'A question-first financial information platform connects company, period and external evidence while preserving source attribution and scoped access.',
    hypotheses: ['Integrated evidence may reduce information acquisition and verification costs.', 'Verifiable organizational attribution may reduce uncertainty about who provided information.', 'Better-supported comparison may reduce conditions associated with adverse selection; this is a hypothesis, not a demonstrated effect.', 'Role-appropriate access may improve audit, investment and management workflows without requiring universal disclosure.'],
    metrics: ['Task completion time', 'Company / asset / period matching errors', 'Unsupported conclusion rate', 'Calculation reproducibility', 'Unauthorized disclosure attempts blocked by production controls', 'User understanding of provenance versus financial assurance'],
    limitations: ['This is a deterministic interactive prototype, not a live LLM or financial database.', 'Role gating is a browser demonstration, not production security.', 'vLEI credentials and verification outcomes are simulated.', 'A locally computed hash chain illustrates tamper evidence; it is not a deployed blockchain.', 'A signature authenticates a source and exact payload; it does not prove the underlying economic claim.', 'Identity does not grant access by itself. A production authorization service must enforce purpose, scope, validity and revocation.']
  },
  references: [
    { id: 'sec', title: 'SEC · EDGAR data APIs', url: 'https://www.sec.gov/search-filings/edgar-application-programming-interfaces' },
    { id: 'acris', title: 'NYC · ACRIS property records', url: 'https://www.nyc.gov/site/finance/property/acris.page' },
    { id: 'sales', title: 'NYC · Rolling property sales', url: 'https://www.nyc.gov/site/finance/property/property-rolling-sales-data.page' },
    { id: 'vlei', title: 'GLEIF · Verifiable LEI', url: 'https://www.gleif.org/en/organizational-identity/lei-vlei/the-verifiable-lei-vlei' },
    { id: 'agent-authority', title: 'GLEIF · Agent identity and action-specific authority', url: 'https://www.gleif.org/en/newsroom/blog/how-yourdata-is-exploring-execution-trust-for-ai-agents-with-the-vlei' },
    { id: 'm3', title: 'IRS · Schedule M-3 reconciliation', url: 'https://www.irs.gov/instructions/i1120sm3' },
    { id: 'irs-access', title: 'IRS · Access for tax-administration duties', url: 'https://www.irs.gov/irm/part11/irm_11-003-022' },
    { id: 'sale-accounting', title: 'FASB · Nonfinancial asset derecognition', url: 'https://storage.fasb.org/ASU_2017-05.pdf' }
  ]
};
