/* Honeycomb: deterministic, synthetic research scenarios. No live model, identity
 * issuer, company, IRS system or property database is connected. */
(() => {
  'use strict';
  const D = window.DEMO_DATA;
  const $ = (q) => document.querySelector(q);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = (n) => '$' + Number(n).toLocaleString('en-US', {maximumFractionDigits:1}) + 'm';
  const pct = (n) => (100*n).toFixed(1).replace('.0','') + '%';
  const icons = {
    investor:'<path d="M4 17 9 12l4 3 7-10M15 5h5v5"/><path d="M4 4v16h16"/>',
    tax:'<path d="m3 9 9-6 9 6M4 10h16M6 10v8m6-8v8m6-8v8M3 21h18M4 18h16"/>',
    auditor:'<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 6 6M7 10l2 2 4-4"/>',
    management:'<path d="M4 8h16v12H4zM8 8V4h8v4M4 12h16m-10 0v3h4v-3"/>',
    regulator:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>'
  };
  function icon(id){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[id]+'</svg>';}
  const S = {role:null,view:'ask',last:null,question:'',book:100,price:140,cost:5,version:1,sourceFlags:{},tour:-1,ledgerResult:null,busy:false};
  const viewNames = {ask:'Ask & explore',sources:'Source network',permissions:'Roles & access',ledger:'Evidence trail',research:'Research notebook'};
  let toastTimer;
  let ledger;
  const role = () => D.roles.find((r)=>r.id===S.role);
  const allow = (id) => !!(role() && role().access.includes(id));
  const sourceAllowed = (id) => id==='tax-return' ? allow('tax-return') : id==='assurance' ? allow('assurance') : true;
  const sourceById = (id) => {
    const src = D.sources.find((s)=>s.id===id);
    if(!src) return null;
    return Object.assign({},src,{version:id==='company-data' ? 'FY2025 / release '+S.version+'.0' : src.version,description:id==='company-data'?'Synthetic company-issued data links Hundred Acre Tower to a '+money(S.book)+' carrying amount in release '+S.version+'.0. The credential and signature result are simulated.':src.description});
  };
  const credential = (id) => window.validateCredential(sourceById(id),Object.assign({now:Date.parse(D.referenceDate+'T12:00:00Z')},S.sourceFlags[id]||{}));
  function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{$('#toast').hidden=true;},4200);}
  async function log(action,detail){
    try{if(ledger){await ledger.ready;await ledger.append(action,detail,S.role||'visitor');}}
    catch(e){if(e.code!=='CRYPTO_UNAVAILABLE') console.error('Local evidence record could not be appended.',e);}
  }
  function openDialog(kicker,html){
    $('#dialog-kicker').textContent=kicker;$('#dialog-body').innerHTML=html;
    if(!$('#detail-dialog').open) $('#detail-dialog').showModal();
    $('#detail-dialog').scrollTop=0;
  }
  function closeDialog(){if($('#detail-dialog').open) $('#detail-dialog').close();}
  function badge(id){const c=credential(id);return '<span class="badge '+(c.accepted?'':'bad')+'">'+(c.accepted?'✓ Scenario checks pass':'! Source excluded')+'</span>';}
  function note(text,kind){return '<div class="note '+(kind||'')+'">'+text+'</div>';}
  function sourceMini(id){
    if(!sourceAllowed(id))return '';
    const s=sourceById(id),c=credential(id);
    return '<div class="source-mini"><span class="source-dot" aria-hidden="true">'+(id==='property-market'?'⌁':'◇')+'</span><div><b>'+esc(s.name)+'</b><p>'+esc(s.agent)+'</p><button data-source="'+id+'">Inspect source & mandate <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button><span class="source-state '+(c.accepted?'':'bad')+'">'+(c.accepted?'✓ Simulated identity, mandate & payload checks':'! '+esc(c.status))+'</span></div></div>';
  }
  function sourcePanel(ids){
    return '<div class="panel"><div class="panel-heading"><h3>The evidence behind it</h3><small>SIMULATED</small></div>'+ids.map(sourceMini).join('')+note('A verified source identifies the provider. It does not prove that a financial claim or valuation is correct.')+'<button class="button small secondary source-action" data-view="sources">Explore the source network <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button></div>';
  }
  function pathRow(labels){return '<div class="agent-path">'+labels.map((x,i)=>(i?'<span>→</span>':'')+'<b>'+esc(x)+'</b>').join('')+'</div>';}
  function answerTop(title,summary){
    return '<div class="answer-question"><span aria-hidden="true"><svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 3v8h10m-4-4 4 4-4 4"/></svg></span>'+esc(S.question)+'</div><div class="answer-header"><div><span class="eyebrow">YOUR QUESTION, CONNECTED TO EVIDENCE</span><h2>'+title+'</h2></div><span class="scenario-badge">SYNTHETIC SCENARIO</span></div><p class="answer-summary">'+summary+'</p>';
  }
  function answerFooter(){
    return '<div class="answer-footer"><span>Company facts · external observations · platform estimates are separately attributed.</span><button class="text-link" data-action="export">Download evidence pack ↓</button></div>';
  }
  function renderRoles(){
    $('#role-grid').innerHTML=D.roles.map((r)=>'<button class="role-card" data-role="'+r.id+'"><span class="role-icon">'+icon(r.id)+'</span><span class="role-arrow" aria-hidden="true"><svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></span><b>'+esc(r.title)+'</b><p>'+esc(r.subtitle)+'</p><span class="role-scope">'+(r.id==='investor'?'PUBLIC EVIDENCE':'SCOPED DEMO ACCESS')+'</span></button>').join('');
  }
  async function selectRole(id,options){
    if(!D.roles.some((r)=>r.id===id))return;
    S.role=id;S.last=null;S.question='';S.price=140;S.cost=5;closeDialog();$('#welcome').hidden=true;$('#workspace').hidden=false;
    $('#current-role').textContent=role().shortTitle;$('#role-icon').innerHTML=icon(id);
    $('#role-description').textContent=role().focus;$('#current-scope').textContent=role().scope;
    $('#question').value='';$('#question').placeholder=role().suggestions[0];
    $('#suggestions').innerHTML=role().suggestions.map((q)=>'<button type="button" class="suggestion" data-question="'+esc(q)+'">'+esc(q)+'</button>').join('');
    showView('ask');renderEmpty();await log('Perspective selected',{role:role().title,scope:role().scope});
    if(!(options&&options.noScroll))window.scrollTo({top:0,behavior:'smooth'});
  }
  function home(toRoles){
    closeDialog();S.role=null;$('#workspace').hidden=true;$('#welcome').hidden=false;
    if(toRoles)$('#role-picker').scrollIntoView({behavior:'smooth',block:'start'});else window.scrollTo({top:0,behavior:'smooth'});
  }
  function showView(view){
    if(!S.role){if(view==='research')showResearch();return;}
    S.view=view;
    document.querySelectorAll('.desk-view').forEach((el)=>{el.hidden=el.id!=='view-'+view;});
    document.querySelectorAll('[data-view]').forEach((el)=>el.classList.toggle('active',el.classList.contains('desk-link')&&el.dataset.view===view));
    $('#view-name').textContent=viewNames[view]||view;
    if(view==='sources')renderSources();
    if(view==='permissions')renderPermissions();
    if(view==='ledger')renderLedger();
    if(view==='research')$('#view-research').innerHTML=researchHTML();
  }
  function renderEmpty(){
    const title = S.role==='tax'?'A lower tax bill. A better question.':S.role==='auditor'?'Every conclusion needs a trail.':S.role==='management'?'Explore the decision before making it.':S.role==='regulator'?'See who stands behind each claim.':'There may be more to the story.';
    $('#answer-area').innerHTML='<div class="empty-answer fade-in"><div><span class="eyebrow">BEGIN WITH CURIOSITY</span><h2>'+title+'</h2><p>Your agent brings together the evidence permitted for your role. Choose an example above, or ask it in your own words.</p><button class="button small secondary" data-question="'+esc(role().suggestions[0])+'">Explore a first question <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button></div><div class="empty-illustration"><div class="mini-evidence"><span>▤</span>Company statements</div><div class="mini-evidence"><span>⌁</span>The outside world</div><div class="mini-evidence"><span>✦</span>One question. Connected evidence.</div></div></div>';
  }
  function classify(q){
    const t=q.toLowerCase();
    if(/tax[- ]?return|報稅表|報稅明細|納稅申報/.test(t))return allow('tax-return')?'tax':'denied-tax';
    if(/forecast|confidential|internal plan|內部預|機密|預測|預算/.test(t))return allow('internal-forecast')?'planning':'denied-forecast';
    if(/subledger|asset register|asset breakdown|internal asset|carrying amount to|資產明細|明細帳/.test(t))return allow('asset-subledger')?'subledger':'denied-register';
    if(/tax|稅/.test(t))return 'tax';
    if(/source|evidence|assur|vlei|credential|authority|which claims|company statements|platform estimates|來源|驗證|授權|確信/.test(t))return 'sources';
    if(/asset|tower|building|sale|sell|sold|selling|value|valuation|price|資產|大樓|估|賣|出售|價格|不動產/.test(t))return 'asset';
    if(/blockchain|ledger|hash|chain|區塊|雜湊/.test(t))return 'ledger';
    return 'unknown';
  }
  async function ask(q){
    if(!S.role||S.busy)return;
    q=String(q||$('#question').value||'').trim();if(!q){$('#question').focus();return;}
    S.question=q;S.last=classify(q);S.busy=true;$('#ask-button').disabled=true;showView('ask');$('#question').value=q;
    await log('Question received',{question:q,scenario:S.last});
    if(S.last.indexOf('denied-')===0){await log('Access denied',{requested:S.last.replace('denied-',''),reason:'Outside selected role mandate'});renderDenied(S.last);}
    else if(S.last==='asset'||S.last==='subledger'||S.last==='planning'){
      await log('Source checks evaluated',{company:credential('company-data').accepted,external:credential('property-market').accepted,simulation:true});
      renderAsset();
      await log('Asset answer created',{version:S.version,usesMarketSource:credential('property-market').accepted,kind:'Scenario estimate'});
    }else if(S.last==='tax'){
      await log('Tax scope checked',{returnDetailAllowed:allow('tax-return'),case:allow('tax-return')?'MKG-25-TAX':null});renderTax();
    }else if(S.last==='sources'){renderSourceAnswer();}
    else if(S.last==='ledger'){showView('ledger');}
    else{renderUnknown();}
    S.busy=false;$('#ask-button').disabled=false;
  }
  function metric(label,value,sub,featured,action){
    return '<div class="metric-card '+(featured?'featured':'')+'"><div class="metric-label">'+label+(action?'<button class="metric-info" data-action="'+action+'" aria-label="Explain '+esc(label)+'">i</button>':'')+'</div><div class="metric-value">'+value+'</div><small>'+sub+'</small></div>';
  }
  function renderAsset(){
    const validCompany=credential('company-data').accepted,validMarket=credential('property-market').accepted;
    if(!validCompany||!validMarket){
      $('#answer-area').innerHTML=answerTop('A source needs attention.','The agent has <strong>paused the valuation</strong> because '+(!validCompany?'the company':'the external property provider')+' failed a simulated trust check. It will not quietly reuse that source.')+
      '<div class="answer-grid"><div class="panel"><span class="lock-icon">◇</span><h3>Evidence first, calculation second.</h3><p class="answer-summary">Review the source card to see whether its mandate was revoked or its payload was altered. Restore the demo source to continue the scenario.</p>'+note('This is a simulated source-admission decision. A production implementation must enforce the credential and policy checks server-side.','warning')+'<button class="button secondary stack-gap" data-view="sources">Review source status <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button></div>'+sourcePanel(['company-data','property-market'])+'</div>'+answerFooter();return;
    }
    const gain=S.price-S.cost-S.book,low=130-S.cost-S.book,high=150-S.cost-S.book;
    let html=answerTop('Hidden value? Start with the building.','The scenario indicates a market value of <strong>$130–150m</strong> for Hundred Acre Tower, compared with a <strong>'+money(S.book)+' carrying amount</strong>. That is a potential value gap—not evidence of an accounting error or a mispriced stock.');
    html+='<div class="metric-grid">'+metric('Company carrying amount',money(S.book),'Company data · release '+S.version+'.0',false,'book-detail')+metric('Estimated market range','$130–150m','External observations · illustrative',false,'comparables')+metric('Potential pretax disposal gain',money(low)+'–'+money(high).replace('$',''),'After '+money(S.cost)+' selling costs',true,'calculation')+'</div>';
    html+='<div class="answer-grid"><div><div class="panel"><div class="panel-heading"><h3>One asset, two measurement bases</h3><small>USD MILLIONS</small></div><div class="value-chart"><div class="value-row"><span>Carrying value</span><div class="value-track"><div class="value-fill" style="width:'+(S.book/160*100)+'%"></div></div><b>'+S.book+'</b></div><div class="value-row"><span>Market midpoint</span><div class="value-track"><div class="value-fill estimated" style="width:87.5%"></div></div><b>140</b></div></div><div class="legend"><span>Company-provided fact</span><span>Platform estimate using external observations</span></div><button class="calc-link" data-action="calculation">How is the disposal gain calculated? <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button>'+note('<strong>Accounting treatment:</strong> an ordinary US GAAP building-sale gain usually enters earnings, not OCI. This estimate has not been booked.')+'</div>';
    html+='<div class="panel"><div class="panel-heading"><h3>Try a different sale scenario</h3><small>ASSUMPTIONS YOU CAN CHANGE</small></div><div class="range-controls"><div class="range-field"><label for="sale-price">Assumed sale price <output id="sale-price-output">'+money(S.price)+'</output></label><input id="sale-price" type="range" min="100" max="180" step="1" value="'+S.price+'"></div><div class="range-field"><label for="sale-cost">Assumed selling costs <output id="sale-cost-output">'+money(S.cost)+'</output></label><input id="sale-cost" type="range" min="0" max="15" step="1" value="'+S.cost+'"></div></div><div class="scenario-result"><div><b id="scenario-gain">'+money(gain)+'</b><br><small>Estimated pretax disposal gain</small></div><div><small id="scenario-formula">'+money(S.price)+' − '+money(S.cost)+' − '+money(S.book)+'</small><br><small id="scenario-cash">Cash before tax & debt: '+money(S.price-S.cost)+'</small></div></div>'+note('100% ownership; the carrying amount is held constant across the demo dates. Tax basis, taxes, debt repayment and intervening asset changes are not modeled.')+'</div>';
    if(allow('asset-subledger')){
      html+='<div class="panel"><div class="panel-heading"><h3>Internal asset register</h3><span class="badge gold">Scoped '+(S.role==='auditor'?'audit':'company')+' access</span></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Component</th><th class="number">USD m</th><th>Demo reference</th></tr></thead><tbody><tr><td>Land</td><td class="number">40</td><td>FA-LAND-01</td></tr><tr><td>Building</td><td class="number">90</td><td>FA-BLDG-01</td></tr><tr><td>Capitalized improvements</td><td class="number">'+(10+S.book-100)+'</td><td>FA-IMP-01</td></tr><tr><td>Accumulated depreciation</td><td class="number">(40)</td><td>FA-DEP-01</td></tr><tr class="highlight-row"><td>Carrying amount</td><td class="number">'+S.book+'</td><td>Release '+S.version+'.0</td></tr></tbody></table></div>'+note('Synthetic internal records. An auditor would still test ownership, existence, capitalization, depreciation and the supporting evidence.')+'</div>';
    }
    if(allow('internal-forecast')){
      html+='<div class="panel"><div class="panel-heading"><h3>Company planning & correction</h3><span class="badge gold">Management mandate</span></div><p class="answer-summary">The internal planning case assumes a $146m sale price. It is a confidential synthetic scenario, separate from the external market estimate.</p><div class="inline-actions"><button class="button small secondary" data-action="planning-case">Use internal planning case</button><button class="button small soft" data-action="correction" '+(S.version>1?'disabled':'')+'>'+(S.version>1?'Correction published · v2.0':'Publish demo correction: +$4m')+'</button></div>'+note('The correction adds $4m of capitalized improvements. A new version is appended; the previous version remains in the evidence trail. No real accounts are changed.')+'</div>';
    }
    html+='</div><div>'+sourcePanel(['company-data','property-market'])+'<div class="panel"><div class="panel-heading"><h3>Property observations</h3><small>3 DEMO COMPARABLES</small></div>'+D.asset.comparables.map((c)=>'<div class="bridge-row"><div>'+esc(c.name)+'<small>'+esc(c.date)+' · adjusted indication</small></div><b>'+money(c.adjustedIndication)+'</b></div>').join('')+'<button class="calc-link" data-action="comparables">Inspect comparability & limitations <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button></div></div></div>';
    html+=pathRow(['Find company asset','Discover market source','Check both source mandates','Apply accounting calculation'])+answerFooter();
    $('#answer-area').innerHTML='<div class="fade-in">'+html+'</div>';
  }
  function updateScenario(){
    $('#sale-price-output').textContent=money(S.price);$('#sale-cost-output').textContent=money(S.cost);
    $('#scenario-gain').textContent=money(S.price-S.cost-S.book);$('#scenario-formula').textContent=money(S.price)+' − '+money(S.cost)+' − '+money(S.book);$('#scenario-cash').textContent='Cash before tax & debt: '+money(S.price-S.cost);
  }
  function taxTable(){
    return '<div class="table-scroll"><table class="data-table"><thead><tr><th>Company</th><th class="number">Pretax income</th><th class="number">Cash tax</th><th class="number">Book tax rate</th></tr></thead><tbody>'+D.tax.companies.map((c,i)=>'<tr class="'+(i===0?'highlight-row':'')+'"><td>'+esc(c.name)+'</td><td class="number">'+money(c.pretaxIncome)+'</td><td class="number">'+money(c.cashTax)+'</td><td class="number">'+pct(c.bookETR)+'</td></tr>').join('')+'</tbody></table></div>';
  }
  function taxHistory(){
    return '<div class="history-bars">'+D.tax.history.map((y)=>'<div class="history-year"><i style="height:'+y.pretaxIncome+'%"><span>'+y.pretaxIncome+'</span></i><i class="tax-bar" style="height:'+y.cashTax+'%"><span>'+y.cashTax+'</span></i><small>'+y.year+'</small></div>').join('')+'</div><div class="legend"><span>Pretax income</span><span>Cash income tax paid</span></div>';
  }
  function renderTax(){
    const failedSources=['company-data','peer-filings'].filter((id)=>!credential(id).accepted);
    if(failedSources.length){
      $('#answer-area').innerHTML=answerTop('The comparison needs its evidence.','The agent has <strong>paused the tax comparison</strong> because a company or peer-data source failed a simulated trust check. The source must be restored before its figures are used.')+'<div class="answer-grid"><div class="panel"><h3>Review the source before drawing a conclusion.</h3><p class="answer-summary">A revoked mandate or altered response excludes that source from dependent calculations, even when the figures were available earlier.</p>'+note('The source-admission decision is simulated. A production verifier and authorization service must enforce these checks on the server.','warning')+'<button class="button secondary stack-gap" data-view="sources">Review source status</button></div>'+sourcePanel(['company-data','peer-filings'])+'</div>'+answerFooter();
      return;
    }
    const privateAccess=allow('tax-return'),returnValid=privateAccess&&credential('tax-return').accepted;
    let html=answerTop('More profit. Less cash tax. Why?','Miklos & Co. reports <strong>$100m of pretax income</strong> and <strong>$8m of cash tax</strong>. The selected peers pay more cash tax, but all three have a 20% book effective tax rate in this synthetic example. A difference is a starting point for investigation.');
    html+='<div class="metric-grid">'+metric('Pretax book income','$100m','Public synthetic disclosure',false,'tax-metrics')+metric('Cash income tax paid','$8m','8% of pretax income',false,'tax-metrics')+metric('Total book tax expense','$20m','$8m current + $12m deferred',true,'tax-metrics')+'</div><div class="answer-grid"><div><div class="panel"><div class="panel-heading"><h3>Across companies</h3><small>FY2025 · ALL SYNTHETIC</small></div>'+taxTable()+note('Peer comparisons must align business model, tax jurisdiction, reporting period and tax-group perimeter. Lower cash tax alone does not establish underreporting.')+'</div><div class="panel"><div class="panel-heading"><h3>Across years</h3><small>MIKLOS & CO. · USD m</small></div>'+taxHistory()+'</div>';
    if(returnValid){
      html+='<div class="panel"><div class="panel-heading"><h3>The assigned-case reconciliation</h3><span class="badge gold">IRS case MKG-25-TAX · mock data</span></div><div class="bridge-row"><span>Book pretax income</span><b>$100m</b></div><div class="bridge-row"><span>Additional tax depreciation<small>A temporary difference in this toy model</small></span><b>− $60m</b></div><div class="bridge-row total"><span>Illustrative taxable income</span><b>$40m</b></div><div class="bridge-row"><span>Current tax at the demo 20% rate</span><b>$8m</b></div><div class="bridge-row"><span>Deferred tax on the temporary difference</span><b>$12m</b></div><div class="bridge-row total"><span>Total book tax expense</span><b>$20m</b></div>'+note('<strong>Supported explanation:</strong> in this simplified case, the $12m timing effect explains the difference between current and total book tax. No unexplained residual is modeled. This is not a real compliance finding.','success')+note('<strong>Modeling boundary:</strong> 20% is an illustrative rate, not the US statutory corporate rate. Cash tax is assumed to equal current tax expense here; actual payments, refunds and settlement timing need a separate reconciliation.','warning')+'</div>';
    }else{
      html+='<div class="locked-panel stack-gap"><span class="lock-icon">◇</span><h3>'+(privateAccess?'The return source is unavailable.':'Return detail stays within its mandate.')+'</h3><p>'+(privateAccess?'The simulated source check failed. This answer retains the public comparison but excludes the mock return reconciliation.':'You can compare public tax disclosures. The mock tax-return reconciliation requires an assigned IRS case; a different role does not automatically inherit access.')+'</p><button class="button small secondary" data-question="Show the company tax return detail">Test access to return detail <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button></div>';
    }
    html+='</div><div>'+sourcePanel(privateAccess?['company-data','peer-filings','tax-return']:['company-data','peer-filings'])+'<div class="panel"><h3>What the agent separates</h3><ol class="reconciliation-list"><li>Book income versus taxable income</li><li>Current versus deferred tax expense</li><li>Expense versus cash paid</li><li>Explained differences versus evidence still needed</li></ol></div></div></div>'+pathRow(['Match peers & periods','Compare public disclosures',privateAccess?'Use authorized mock return':'Respect return restriction','Explain differences'])+answerFooter();
    $('#answer-area').innerHTML='<div class="fade-in">'+html+'</div>';
  }
  function renderDenied(kind){
    const isTax=kind==='denied-tax',isRegister=kind==='denied-register';
    const label=isTax?'tax-return detail':isRegister?'internal asset register':'internal planning forecasts';
    $('#answer-area').innerHTML=answerTop('That evidence is outside this mandate.','Your <strong>'+esc(role().title)+'</strong> perspective does not include '+label+'. The agent records the denied request and offers a permitted path.')+'<div class="answer-grid"><div class="panel"><span class="lock-icon">◇</span><h3>Access decision: denied in this scenario</h3><p class="answer-summary">Identity establishes who is asking. The authorization policy determines which data may be provided for this purpose.</p>'+note('The blockchain concept records the decision and evidence references. The authorization service must enforce access; a blockchain does not make confidential data safe by itself.','warning')+'<div class="inline-actions stack-gap"><button class="button small primary" data-question="'+(isTax?'Why does Miklos & Co. pay less tax than its peers?':'Does Miklos & Co. have undervalued assets?')+'">Explore the public alternative <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button><button class="button small secondary" data-view="permissions">Review role permissions</button></div></div><div class="panel"><h3>A useful boundary</h3><p class="answer-summary">A denied request should explain its scope without revealing the restricted contents. This browser prototype demonstrates that interaction using synthetic records.</p><button class="calc-link" data-view="ledger">See the recorded access decision <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button></div></div>';
  }
  function renderSourceAnswer(){
    $('#answer-area').innerHTML=answerTop('Know the source. Then examine the claim.','The company agent, external property agent, and platform analysis agent have distinct responsibilities. vLEI anchors organizational identity; scoped delegation and a signed payload connect that organization to the specific data response.')+sourcePanel(['company-data','property-market','peer-filings'])+note('All vLEI identities, mandates and signature-check outcomes in this site are simulated. A provider identity check is not an audit opinion or a guarantee of economic truth.','warning')+answerFooter();
  }
  function renderUnknown(){
    $('#answer-area').innerHTML=answerTop('Let’s stay within this demonstration.','This prototype uses deterministic scenarios rather than a live language model. It can demonstrate property valuation, tax differences, source verification, and role-specific evidence.')+'<div class="panel"><h3>Try one of these questions</h3><div class="suggestion-row">'+role().suggestions.map((q)=>'<button class="suggestion" data-question="'+esc(q)+'">'+esc(q)+'</button>').join('')+'</div>'+note('You can ask these scenarios in English or Chinese. An unsupported question will not receive an invented financial answer.')+'</div>';
  }
  function renderSources(){
    $('#view-sources').innerHTML='<div class="view-heading"><div><span class="eyebrow">EVERY PROVIDER HAS ITS OWN RESPONSIBILITY</span><h2>A network of accountable sources.</h2><p>The external discovery agent locates candidate evidence. The platform separately evaluates the provider identity, mandate and response.</p></div><span class="scenario-badge">vLEI CHECKS ARE SIMULATED</span></div><div class="source-network">'+D.sources.filter((s)=>sourceAllowed(s.id)).map((s)=>'<article class="provider-card '+(credential(s.id).accepted?'':'blocked')+'"><div class="provider-top"><span class="provider-icon" aria-hidden="true">'+(s.id==='property-market'?'⌁':'◇')+'</span>'+badge(s.id)+'</div><h3>'+esc(s.name)+'</h3><p>'+esc(s.org)+'<br>'+esc(s.agent)+'</p><div class="provider-meta"><span>'+esc(s.kind)+'</span><span>'+esc(sourceById(s.id).version)+'</span></div><button class="button small secondary" data-source="'+s.id+'">Inspect identity & authority <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button></article>').join('')+'</div>'+note('<strong>External sources do not inherit the company’s identity.</strong> A property provider needs its own organizational credential and scoped agent mandate. Real SEC and NYC links are reference examples; those institutions have not issued credentials for this prototype.','warning');
  }
  function openSource(id){
    if(!sourceById(id))return;
    if(!sourceAllowed(id)){toast('This source is outside your current demo mandate.');return;}
    const s=sourceById(id),c=credential(id),flags=S.sourceFlags[id]||{};
    const payload = id==='company-data'?'Subject: Miklos & Co. / Hundred Acre Tower. Carrying amount '+money(S.book)+', reporting date 2025-12-31, release '+S.version+'.0.':id==='property-market'?'Three synthetic adjusted indications: $130m, $140m and $150m. Market reference date 2026-11-10.':id==='tax-return'?'Mock assigned case MKG-25-TAX. Book $100m − additional tax depreciation $60m = taxable income $40m.':s.description;
    openDialog('SOURCE & AUTHORITY · SIMULATED', '<h2>'+esc(s.name)+'</h2><p>'+esc(s.description)+'</p>'+badge(id)+'<dl><dt>Organization</dt><dd>'+esc(s.org)+'</dd><dt>Organization ID</dt><dd>'+esc(s.organizationId)+' · not a registered LEI</dd><dt>Agent</dt><dd>'+esc(s.agent)+'</dd><dt>Mandate</dt><dd>'+esc(s.scope)+'</dd><dt>Version</dt><dd>'+esc(s.version)+'</dd><dt>Valid until</dt><dd>'+esc(s.validUntil)+' · scenario date '+D.referenceDate+'</dd></dl><div class="proof-chain"><div class="proof-node"><b>1. Organizational identity</b><small>Demo vLEI issuer → legal entity credential</small></div><div class="proof-node"><b>2. Scoped agent mandate</b><small>Authorized company mechanism → agent identity and signing key</small></div><div class="proof-node"><b>3. Exact data response</b><small>Signed content, reporting period, version and original evidence references</small></div></div><h3>The response used by this scenario</h3><div class="formula">'+esc(payload)+'</div><div class="check-list">'+c.checkList.map((x)=>'<div class="check-row '+(x.passed?'':'failed')+'"><span>'+(x.passed?'✓':'!')+'</span><div><b>'+esc(x.label)+'</b><p>'+esc(x.explanation)+'</p></div></div>').join('')+'</div>'+note('These are simulated outcomes, not cryptographic vLEI verification. A production verifier would validate issuer chains, agent-key binding, mandate scope, revocation and payload signatures.','warning')+'<div class="dialog-actions"><button class="button small '+(flags.revoked?'soft':'danger')+'" data-toggle-revoke="'+id+'">'+(flags.revoked?'Restore demo mandate':'Simulate mandate revocation')+'</button><button class="button small secondary" data-toggle-tamper="'+id+'">'+(flags.tampered?'Restore demo payload':'Simulate altered payload')+'</button></div><h3>Assurance boundary</h3><p>'+esc(s.assurance)+'</p><a class="text-link" href="'+esc(s.url)+'" target="_blank" rel="noopener">Read the real reference source <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></a>');
    log('Source inspected',{source:id,scenarioAccepted:c.accepted});
  }
  async function toggleSource(id,field){
    S.sourceFlags[id]=Object.assign({},S.sourceFlags[id]||{});
    S.sourceFlags[id][field]=!S.sourceFlags[id][field];
    await log(field==='revoked'?'Agent mandate changed':'Payload integrity scenario changed',{source:id,[field]:S.sourceFlags[id][field]});
    renderSources();if(['asset','subledger','planning'].includes(S.last))renderAsset();if(S.last==='tax')renderTax();
    openSource(id);
    toast(S.sourceFlags[id][field]?'Source excluded from dependent analysis.':'Demo source restored.');
  }
  function renderPermissions(){
    $('#view-permissions').innerHTML='<div class="view-heading"><div><span class="eyebrow">IDENTITY + PURPOSE + SCOPE</span><h2>Different perspectives. Explicit boundaries.</h2><p>Authorization is checked for the data and task, not granted simply because an agent presents an identity.</p></div></div><div class="panel"><div class="table-scroll"><table class="data-table permission-table"><thead><tr><th>Information scope</th>'+D.roles.map((r)=>'<th class="'+(r.id===S.role?'current-col':'')+'">'+esc(r.shortTitle)+'</th>').join('')+'</tr></thead><tbody>'+D.permissions.map((p)=>'<tr><td>'+esc(p.label)+'</td>'+D.roles.map((r)=>'<td class="'+(r.id===S.role?'current-col':'')+'"><span class="'+(p.roles.includes(r.id)?'access-yes':'access-no')+'" aria-label="'+(p.roles.includes(r.id)?'Allowed':'Restricted')+'">'+(p.roles.includes(r.id)?'✓':'—')+'</span></td>').join('')+'</tr>').join('')+'</tbody></table></div>'+note('All permissions are role simulations in this browser. No confidential records are present. A production service must enforce access on the server and verify the user, organization, purpose and case or engagement.','warning')+'</div><div class="panel stack-gap"><h3>Try the boundary</h3><div class="permissions-challenge"><p>Request tax-return detail from your current perspective.</p><button class="button small primary" data-question="Show the company tax return detail">Request tax-return detail <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button></div><div class="permissions-challenge"><p>Request the company’s internal disposal forecast.</p><button class="button small secondary" data-question="Show the internal planning forecast">Request internal forecast <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button></div></div><div class="research-grid stack-gap"><div class="research-chapter"><span class="chapter-number">01</span><h3>Authorization makes the decision.</h3><p>The policy service evaluates identity, delegated authority, purpose, data scope, expiration and revocation before releasing information.</p></div><div class="research-chapter"><span class="chapter-number">02</span><h3>The evidence trail preserves the record.</h3><p>A permissioned blockchain could anchor hashes and decisions. Sensitive tax returns and financial records stay in controlled off-chain storage.</p></div></div>';
  }
  function renderLedger(){
    if(!ledger)return;
    const records=ledger.exportRecords();
    const result=S.ledgerResult;
    $('#view-ledger').innerHTML='<div class="view-heading"><div><span class="eyebrow">CORRECTABLE INFORMATION. TRACEABLE HISTORY.</span><h2>Leave a trail worth following.</h2><p>Each local record links to the preceding hash. Verify the chain, then alter a copy and watch the mismatch appear.</p></div><span class="scenario-badge">LOCAL HASH-CHAIN DEMO</span></div><div class="panel"><div class="panel-heading"><h3>'+records.length+' evidence events</h3><small>'+(ledger.available?'SHA-256 · WEB CRYPTO':'CRYPTO UNAVAILABLE')+'</small></div><div class="ledger-controls"><button class="button small primary" data-action="verify-ledger">Verify chain</button><button class="button small secondary" data-action="tamper-ledger">Alter a copy & verify</button><button class="button small secondary" data-action="export">Download evidence pack ↓</button></div>'+note('This browser computes real SHA-256 hashes. It is not a deployed blockchain, distributed consensus, independent timestamp service or production authorization system.','warning')+(result?'<div class="ledger-result '+(result.ok?'':'bad')+'"><b>'+(result.ok?'✓ Chain consistency verified':result.available===false?'! Verification unavailable':result.originalUnchanged?'! Alteration detected in the test copy':'! Chain consistency check failed')+'</b><br>'+esc(result.message)+(result.originalUnchanged?'<br>The original local history is unchanged.':'')+'</div>':'')+'<div id="ledger-events">'+records.slice().reverse().map((r)=>'<div class="ledger-record"><span class="record-index">'+String(r.index).padStart(2,'0')+'</span><div class="record-body"><b>'+esc(r.action)+'</b><small>'+esc(r.role)+' · '+new Date(r.timestamp).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'})+'</small><p>'+esc(JSON.stringify(r.detail))+'</p><div class="record-hash">HASH '+esc(r.hash)+'<br>PREV '+esc(r.prevHash)+'</div></div></div>').join('')+'</div></div><div class="research-grid stack-gap"><div class="research-chapter"><h3>What goes on a production ledger?</h3><p>Evidence commitments, version references, credential-status checkpoints and access-decision records. Confidential source documents remain off-chain.</p></div><div class="research-chapter"><h3>What remains outside its guarantee?</h3><p>Economic truth, fair-value accuracy and access enforcement. A local history rewritten in full needs an independently retained anchor to expose the rewrite.</p></div></div>';
  }
  function researchHTML(){
    return '<div class="research-intro"><span class="eyebrow">THE RESEARCH NOTEBOOK</span><h2>From a company’s report<br>to a user’s question.</h2><p>Connect evidence across companies, years and external sources. Make each provider’s identity, authority and contribution visible, while preserving legitimate differences in access.</p></div><div class="research-grid"><article class="research-chapter"><span class="chapter-number">01 / INFORMATION ECONOMICS</span><h3>Reduce the cost of understanding.</h3><p>Finding, matching and checking fragmented information consumes time. An integrated question-first workflow may lower information acquisition and verification costs.</p><div class="hypothesis"><b>Test:</b> task time, matching errors and unsupported conclusions.</div></article><article class="research-chapter"><span class="chapter-number">02 / ADVERSE SELECTION</span><h3>Make information asymmetry smaller.</h3><p>When decision makers cannot distinguish information quality, uncertainty can affect counterparties and choices. Attributable evidence and comparable information may reduce conditions associated with adverse selection.</p><div class="hypothesis"><b>Hypothesis, not a finding:</b> improved decisions and causal effects need empirical validation.</div></article><article class="research-chapter"><span class="chapter-number">03 / ACCOUNTABLE AGENTS</span><h3>Identify the company behind the source.</h3><p>Company and external-provider agents each need their own vLEI-anchored organizational identity, scoped mandate and data-response proof. A source’s identity is distinct from the truth of its claims.</p><div class="hypothesis"><b>Test:</b> source misattribution, revoked mandates and user understanding of assurance.</div></article><article class="research-chapter"><span class="chapter-number">04 / PRACTICAL VALUE</span><h3>Support investment, audit and management.</h3><p>Investors compare value. Auditors trace evidence. Managers explore decisions. Tax and regulatory users inspect information within their particular mandates.</p><div class="hypothesis"><b>Test:</b> decision quality, reproducibility and appropriate disclosure.</div></article></div><div class="panel stack-gap"><div class="panel-heading"><h3>Architecture: different jobs for different mechanisms</h3><small>PROPOSED PRODUCTION DESIGN</small></div><div class="architecture-grid"><div class="architecture-stage"><b>Data & semantics</b>XBRL, original filings, asset links, comparable periods and external observations.</div><div class="architecture-stage"><b>Identity & permission</b>vLEI organizational anchors, agent-key binding, scoped delegation and server-enforced authorization.</div><div class="architecture-stage"><b>Evidence & reasoning</b>Explicit calculations, provenance and version history; optional permissioned ledger commitments.</div></div>'+note('The user experience can change without replacing XBRL. New agent-delegation and evidence rules must be specified, implemented and evaluated.')+'</div><div class="panel stack-gap"><h3>What this prototype demonstrates</h3><div class="table-scroll"><table class="data-table"><thead><tr><th>Working here</th><th>Proposed for production</th></tr></thead><tbody><tr><td>Role-dependent synthetic scenarios</td><td>Authenticated, server-enforced entitlements</td></tr><tr><td>Deterministic question routing and calculations</td><td>Agent orchestration over permitted data APIs</td></tr><tr><td>Simulated vLEI and mandate checks</td><td>Real credentials, key binding and signature verification</td></tr><tr><td>Real local SHA-256 chain consistency</td><td>Distributed ledger with independent anchors and governance</td></tr><tr><td>Fictional financial and market observations</td><td>Licensed, linked and validated company / market sources</td></tr></tbody></table></div></div><div class="panel stack-gap"><h3>A study that can test the proposition</h3><p class="answer-summary">Give participants the same underlying evidence. Compare conventional cross-source research with the integrated workflow. Measure completion time, asset / period mismatches, unsupported conclusions and reproducibility. Access tests should include revoked mandates and incorrect source bindings.</p>'+note('No efficiency percentages or reductions in adverse selection have been established by this demonstration. Results should be reported only after a suitable study.','warning')+'</div><div class="panel stack-gap"><h3>References & design foundations</h3><p class="subtle">These real reference pages explain standards and potential data sources. They do not authenticate the fictional records on this website.</p><div class="reference-list">'+D.references.map((r)=>'<a href="'+esc(r.url)+'" target="_blank" rel="noopener">'+esc(r.title)+'<span><svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></span></a>').join('')+'</div></div>';
  }
  function showResearch(){if(S.role)showView('research');else openDialog('RESEARCH DIRECTION',researchHTML());}
  function about(){
    openDialog('ACADEMIC DEMONSTRATION','<h2>A clear boundary makes a stronger demo.</h2><p>Honeycomb demonstrates Ya-Wen Cheng’s question-first financial information ecosystem. Miklos & Co., its assets, peers, providers and financial records are fictional.</p><ul class="boundary-list">'+D.research.limitations.map((x)=>'<li>'+esc(x)+'</li>').join('')+'</ul><h3>What is actually computed?</h3><p>The sale scenario, tax arithmetic and SHA-256 local-chain consistency checks run in your browser. Credential outcomes and access decisions are scenario logic, not live verification or production security.</p><h3>What does the artwork mean?</h3><p>The woodland imagery expresses the creator’s personal visual preference. This academic prototype is not affiliated with Disney or the Winnie the Pooh rights holders.</p><button class="button small primary" data-action="close-dialog">Continue exploring</button>');
  }
  function calculation(){
    openDialog('HOW IS THIS CALCULATED?','<h2>From sale price to disposal gain.</h2><p>All figures below are illustrative USD millions. The assumed sale is a straightforward asset disposal with 100% ownership.</p><div class="formula">Sale price − selling costs − carrying amount<br>'+money(S.price)+' − '+money(S.cost)+' − '+money(S.book)+' = <b>'+money(S.price-S.cost-S.book)+'</b></div><dl><dt>Sale-price input</dt><dd>'+money(S.price)+' · scenario assumption</dd><dt>External range</dt><dd>$130–150m · synthetic adjusted observations</dd><dt>Carrying amount</dt><dd>'+money(S.book)+' · company release '+S.version+'.0</dd><dt>Cash proceeds</dt><dd>'+money(S.price-S.cost)+' before tax and debt repayment</dd><dt>Result status</dt><dd>Platform estimate; not recognized earnings or an independent appraisal</dd></dl>'+note('An ordinary US GAAP building-sale gain normally enters earnings, not OCI. The model holds carrying value constant after 2025-12-31 and excludes intervening depreciation, taxes, financing and unusual sale terms.','warning')+'<a class="text-link" href="https://storage.fasb.org/ASU_2017-05.pdf" target="_blank" rel="noopener">FASB nonfinancial asset derecognition guidance <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></a>');
  }
  function bookDetail(){
    let html='<h2>The number and its provenance.</h2><p>The company agent supplies a carrying amount of <b>'+money(S.book)+'</b> for Hundred Acre Tower. Source date: 2025-12-31; version '+S.version+'.0. It is a fictional approved disclosure.</p>'+note('Carrying amount and market value use different measurement bases. A market estimate above carrying amount does not by itself establish a financial-statement error.');
    if(allow('asset-subledger'))html+='<div class="formula">Land 40 + building 90 + improvements '+(10+S.book-100)+' − accumulated depreciation 40 = '+S.book+'</div>';
    else html+='<p>Your current role sees the public carrying amount. The internal asset register requires a management or assigned audit mandate.</p>';
    html+='<button class="button small secondary" data-source="company-data">Inspect company source <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button>';
    openDialog('COMPANY-PROVIDED FACT · SYNTHETIC',html);
  }
  function comparables(){
    openDialog('EXTERNAL EVIDENCE · SYNTHETIC','<h2>Which properties are comparable?</h2><p>The market agent supplies three fictional observations. Their adjusted indications are used to illustrate a $130–150m range, with a $140m midpoint; this is not a trained or validated valuation model.</p><div class="table-scroll"><table class="data-table"><thead><tr><th>Observation</th><th>Adjusted indication</th><th>Indicative $ / sq ft</th></tr></thead><tbody>'+D.asset.comparables.map((c)=>'<tr><td>'+esc(c.name)+'</td><td>'+money(c.adjustedIndication)+'</td><td>$'+c.pricePerSqFt.toFixed(2)+'</td></tr>').join('')+'</tbody></table></div><h3>What a real matching process must check</h3><ul><li>Exact parcel, ownership and legal entity.</li><li>Transaction date, use, floor area and condition.</li><li>Leases, occupancy, income and transaction terms.</li><li>Why a comparable was selected or excluded.</li></ul>'+note('A nearby address or government tax assessment is not automatically a comparable market price. This demo assumes 600,000 sq ft for the subject and uses adjusted indications.','warning')+'<button class="button small secondary" data-source="property-market">Inspect the external agent’s mandate <svg class="inline-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 14 14 4M4 4h10v10"/></svg></button>');
  }
  function taxMetrics(){
    openDialog('KEEP THE TAX MEASURES DISTINCT','<h2>A cash payment is not a tax expense.</h2><div class="formula">Total book tax = current tax + deferred tax<br>$20m = $8m + $12m<br>Book effective tax rate = $20m / $100m = 20%</div><p>Cash paid is a separate measure affected by payment, refund and settlement timing. This illustration assumes cash tax equals current expense for FY2025.</p>'+note('The 20% rate is only a toy-model assumption. It is not the US statutory corporate rate, a tax calculation for a real company, or evidence of compliance.','warning')+'<p>The additional return-level reconciliation is available only to the assigned IRS demo role.</p>');
  }
  async function correction(){
    if(!allow('internal-forecast')){toast('This correction requires the management mandate.');return;}
    if(S.version>1)return;
    await log('Company correction approved',{oldVersion:'1.0',newVersion:'2.0',change:'Add $4m capitalized improvements',previousRecordRetained:true});
    S.book=104;S.version=2;renderAsset();toast('Release 2.0 published in the demo. Earlier evidence is retained.');
  }
  async function verifyLedger(tamper){
    await ledger.ready;
    S.ledgerResult=tamper?await ledger.tamperAndVerify():await ledger.verify();
    renderLedger();
  }
  async function exportPack(){
    if(!S.role){toast('Choose a perspective before exporting an analysis.');return;}
    await log('Evidence pack exported',{scenario:S.last||S.view,role:S.role});
    const assetSourcesAccepted=credential('company-data').accepted&&credential('property-market').accepted;
    const taxSourcesAccepted=credential('company-data').accepted&&credential('peer-filings').accepted;
    const pack={title:'Honeycomb research demonstration',disclosure:D.disclosure,exportedAt:new Date().toISOString(),role:role().title,scope:role().scope,question:S.question,
      company:{name:D.company.displayName,period:D.company.period},
      scenario:{kind:S.last||S.view,assetAnalysisStatus:assetSourcesAccepted?'synthetic sources accepted':'blocked by source check',book:credential('company-data').accepted?S.book:null,assumedSalePrice:S.price,sellingCosts:S.cost,pretaxGain:assetSourcesAccepted?S.price-S.cost-S.book:null,version:S.version},
      sourceChecks:D.sources.filter((s)=>sourceAllowed(s.id)).map((s)=>({id:s.id,provider:s.org,scope:s.scope,version:sourceById(s.id).version,check:credential(s.id)})),
      references:D.references,localHashChain:ledger?ledger.exportRecords():[],boundaries:D.research.limitations};
    if(S.last==='tax'&&taxSourcesAccepted)pack.publicTaxComparison=D.tax.companies;
    if(S.last==='tax'&&taxSourcesAccepted&&allow('tax-return')&&credential('tax-return').accepted)pack.mockTaxReconciliation=D.tax.reconciliation;
    if(allow('asset-subledger')&&credential('company-data').accepted)pack.syntheticAssetRegister={land:40,buildings:90,improvements:10+S.book-100,accumulatedDepreciation:40,carryingAmount:S.book};
    const blob=new Blob([JSON.stringify(pack,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='honeycomb-'+S.role+'-evidence.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Evidence pack downloaded with simulation labels and permitted scenario detail.');
  }
  const tour=[
    {title:'Choose a perspective',text:'Begin with the user’s role. The data scope changes with the task and mandate.'},
    {title:'Ask about a hidden asset',text:'An investor moves from company figures to a specific building, market observations and a reproducible calculation.'},
    {title:'Verify both sides of the evidence',text:'Inspect the company agent and external property agent separately. Try revoking the external mandate.'},
    {title:'Try the disclosure boundary',text:'An investor requests return detail. The agent refuses the restricted request and offers public alternatives.'},
    {title:'Switch to the assigned IRS case',text:'The authorized scenario reveals the book–tax bridge. Lower cash tax alone is not an underreporting finding.'},
    {title:'Verify a record, then test alteration',text:'Run the SHA-256 check and alter a copy. The original history remains unchanged; no blockchain is deployed here.'},
    {title:'Connect the demo to the research',text:'Lower acquisition and verification costs are testable hypotheses. Explain the study design and remaining limits.'}
  ];
  async function applyTourStep(){
    closeDialog();const step=tour[S.tour];
    $('#tour-bar').hidden=false;document.body.classList.add('tour-active');
    $('#tour-number').textContent=String(S.tour+1).padStart(2,'0')+' / 07';$('#tour-fill').style.width=((S.tour+1)/7*100)+'%';
    $('#tour-title').textContent=step.title;$('#tour-text').textContent=step.text;$('#tour-next').textContent=S.tour===6?'Finish tour ✓':'Next chapter →';
    if(S.tour===0){home(false);}
    if(S.tour===1){await selectRole('investor',{noScroll:true});await ask('Does Miklos & Co. have undervalued assets?');}
    if(S.tour===2){if(S.role!=='investor')await selectRole('investor',{noScroll:true});showView('sources');}
    if(S.tour===3){if(S.role!=='investor')await selectRole('investor',{noScroll:true});await ask('Show the company tax return detail');}
    if(S.tour===4){await selectRole('tax',{noScroll:true});await ask('Why does Miklos & Co. earn more but pay less tax?');}
    if(S.tour===5){showView('ledger');await verifyLedger(false);}
    if(S.tour===6){showView('research');}
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function endTour(){S.tour=-1;$('#tour-bar').hidden=true;document.body.classList.remove('tour-active');}
  document.addEventListener('click',async(e)=>{
    const target=e.target.closest('button,a');if(!target)return;
    if(target.dataset.role){await selectRole(target.dataset.role);return;}
    if(target.dataset.question){await ask(target.dataset.question);return;}
    if(target.dataset.source){openSource(target.dataset.source);return;}
    if(target.dataset.toggleRevoke){await toggleSource(target.dataset.toggleRevoke,'revoked');return;}
    if(target.dataset.toggleTamper){await toggleSource(target.dataset.toggleTamper,'tampered');return;}
    if(target.dataset.view){closeDialog();showView(target.dataset.view);return;}
    const action=target.dataset.action;if(!action)return;e.preventDefault();
    if(action==='home'){endTour();home(false);}
    if(action==='change-role')home(true);
    if(action==='research')showResearch();
    if(action==='about')about();
    if(action==='permissions')showView('permissions');
    if(action==='close-dialog')closeDialog();
    if(action==='calculation')calculation();
    if(action==='book-detail')bookDetail();
    if(action==='comparables')comparables();
    if(action==='tax-metrics')taxMetrics();
    if(action==='correction')await correction();
    if(action==='planning-case'){S.price=146;renderAsset();await log('Internal planning case selected',{scenario:'Synthetic company disposal plan'});}
    if(action==='verify-ledger')await verifyLedger(false);
    if(action==='tamper-ledger')await verifyLedger(true);
    if(action==='export')await exportPack();
    if(action==='tour'){S.tour=0;await applyTourStep();}
    if(action==='tour-prev'){S.tour=Math.max(0,S.tour-1);await applyTourStep();}
    if(action==='tour-next'){if(S.tour===6)endTour();else{S.tour++;await applyTourStep();}}
    if(action==='tour-end')endTour();
  });
  $('#question-form').addEventListener('submit',(e)=>{e.preventDefault();ask();});
  document.addEventListener('input',(e)=>{
    if(e.target.id==='sale-price'){S.price=Number(e.target.value);updateScenario();}
    if(e.target.id==='sale-cost'){S.cost=Number(e.target.value);updateScenario();}
  });
  document.addEventListener('change',(e)=>{
    if(e.target.id==='sale-price'||e.target.id==='sale-cost'){
      log('Scenario assumption changed',{salePrice:S.price,sellingCosts:S.cost,version:S.version});
      /* Re-render after interaction to keep headline ranges and evidence export aligned. */
      renderAsset();
    }
  });
  $('#detail-dialog').addEventListener('click',(e)=>{if(e.target===$('#detail-dialog')){const b=e.target.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)closeDialog();}});
  renderRoles();
  ledger=window.createDemoLedger({onChange:()=>{S.ledgerResult=null;if(S.view==='ledger'&&S.role)renderLedger();}});
  ledger.ready.catch(()=>{});
})();
