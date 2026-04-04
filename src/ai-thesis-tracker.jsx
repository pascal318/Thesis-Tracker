import { useState, useMemo } from "react";

const CORE_QUESTIONS = [
  {
    id: 1, rank: 1, type: "core", category: "Value Chain",
    question: "Does value accrue to the model layer or the application layer?",
    outcomeA: { label: "Application layer wins", description: "Models commoditize as open-source closes the gap and providers compete on price; value migrates to companies that own workflows, customer relationships, and proprietary data." },
    outcomeB: { label: "Model layer wins", description: "Frontier capability remains concentrated among 2-3 providers who capture disproportionate value; the application layer is thin and substitutable, and model companies dominate the economics of AI." },
    probabilityA: 65, importance: 9.8, timeHorizon: "3-5 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 62 }, { week: "2026-W09", probabilityA: 65 }],
    rationale: "Application-layer companies are scaling rapidly: Harvey reached $190M ARR at $8B+ valuation, Glean doubled ARR to $200M in nine months, and Sierra raised at $10B+. Meanwhile, API pricing collapsed 40-60% after DeepSeek, compressing model-layer margins. However, Claude Code hit $1B ARR in just six months and Anthropic reached 300K+ business customers, showing the model layer can capture application-level value when it owns the interface.",
    signals: [
      { date: "2026-02", text: "OpenAI testing ads in ChatGPT while Anthropic runs Super Bowl ads against ad-based AI models shows competitive divergence at the application layer, suggesting value concentration battles at the frontier model/consumer interface.", delta: 1 },
      { date: "2025-09", text: "AWS and Anthropic multi-gigawatt Trainium expansion shows hyperscalers co-investing with foundation model labs, blurring infrastructure and model layer boundaries and concentrating value at both.", delta: 3 },
      { date: "2026-03", text: "Anthropic's Claude reaches No. 1 in App Store following Pentagon dispute publicity, suggesting brand/model-layer value accrual directly to foundation model providers at consumer level.", delta: 2 },
      { date: "2026-03", text: "Apple reportedly asking Google to provision Gemini-powered servers for upgraded Siri, indicating model-layer providers (Google) capturing infrastructure and model value while Apple retains device/UX layer.", delta: 2 },
      { date: "2025-07", text: "Meta paying ~$14.7B for 49% of Scale AI signals that high-quality training data and labeling infrastructure commands significant value, accruing to data/model layer rather than applications.", delta: 4 },
      { date: "2026-03", text: "Cursor at $2B ARR with 3-month revenue doubling suggests strong value accrual at the application layer for AI-native coding tools.", delta: 4 },
      { date: "2026-02", text: "Harvey reportedly raising at $11B valuation, up from $8B just months prior", delta: +4 },
      { date: "2026-02", text: "Anthropic launches enterprise plugins for Excel, PowerPoint, Slack—moving into vertical apps", delta: -3 },
      { date: "2025-12", text: "Harvey confirms $8B valuation; ARR reached $190M with 90%+ retention", delta: +5 },
      { date: "2025-12", text: "Glean doubled ARR from $100M to $200M in nine months at $7.2B valuation", delta: +4 },
      { date: "2025-09", text: "Sierra raised $350M at $10B+ valuation for customer service AI agents", delta: +5 },
      { date: "2025-08", text: "Anthropic reached 300K+ business customers, up from <1K two years prior", delta: -3 },
      { date: "2025-06", text: "Claude Code reached $1B annualized run rate in just six months after launch", delta: -4 },
      { date: "2025-06", text: "Harvey raised Series E at $5B valuation, co-led by Kleiner Perkins and Coatue", delta: +4 },
      { date: "2025-05", text: "API costs across industry dropped 40-60% following DeepSeek release", delta: +5 },
      { date: "2025-02", text: "OpenAI revenue growth outpacing vertical AI startups; model-layer economics still strong", delta: -3 },
      { date: "2025-01", text: "DeepSeek R1 released as open-source, forcing model providers to reconsider pricing", delta: +6 },
      { date: "2024-12", text: "Model API pricing declining ~40% annually, compressing model-layer margins", delta: +5 },
    ],
    tags: ["value-chain", "foundation-models", "enterprise-ai"],
  },
  {
    id: 2, rank: 2, type: "core", category: "Macro",
    question: "Will AI compress or expand total enterprise software TAM?",
    outcomeA: { label: "TAM expands", description: "AI creates enough new categories, infrastructure demand, and usage-based growth to more than offset seat-based compression; enterprise software remains a structurally growing asset class." },
    outcomeB: { label: "TAM compresses", description: "AI enables smaller teams to replace larger ones, shrinking per-seat revenue faster than new categories emerge; the total addressable market for enterprise software structurally declines." },
    probabilityA: 52, importance: 9.7, timeHorizon: "3-5 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 55 }, { week: "2026-W09", probabilityA: 52 }],
    rationale: "Hyperscaler AI capex is approaching $700B in 2026 (up 60% from 2025), and Databricks crossed $5.4B ARR growing 65% YoY, demonstrating massive new spend categories. Datadog guided $4.1B for 2026. But Apollo Global slashed its SaaS exposure from 20% to 10%, and 56% of AI leaders now use hybrid pricing that replaces pure seat-based models. Both forces are real—the question is whether new AI-driven categories grow faster than seat compression erodes legacy revenue.",
    signals: [
      { date: "2026-03", text: "VCs report they are no longer investing in AI SaaS companies with certain characteristics, signaling a market correction in AI SaaS valuations and TAM assumptions.", delta: -2 },
      { date: "2026-03", text: "TechCrunch piece on 'SaaSpocalypse' argues AI is displacing traditional SaaS, suggesting AI compresses rather than expands the traditional enterprise software TAM.", delta: -4 },
      { date: "2026-02", text: "Hyperscaler AI capex approaching $700B in 2026, up 60% from 2025 levels", delta: +6 },
      { date: "2026-02", text: "Apollo Global slashed software exposure from 20% to 10% in private credit funds", delta: -5 },
      { date: "2025-12", text: "Databricks crossed $5.4B ARR, growing 65% YoY; $1.4B in AI-specific revenue", delta: +5 },
      { date: "2025-12", text: "Datadog reported $3.43B full-year 2025 revenue; guided $4.06-4.10B for 2026", delta: +4 },
      { date: "2025-12", text: "Grafana Labs ARR surpassed $400M entering 2026", delta: +3 },
      { date: "2025-10", text: "56% of AI leaders now use hybrid pricing models replacing pure seat-based", delta: -3 },
      { date: "2025-06", text: "75% of hyperscaler capex ($450B) now directly tied to AI infrastructure", delta: +5 },
      { date: "2025-02", text: "Multiple SaaS companies report AI-driven seat consolidation at customer accounts", delta: -5 },
      { date: "2025-01", text: "DeepSeek demonstrated efficiency gains raising questions about spend levels", delta: -4 },
      { date: "2024-12", text: "Gartner estimates AI will create $180B in net-new enterprise software spend by 2028", delta: +3 },
    ],
    tags: ["macro", "tam", "saas", "enterprise-software"],
  },
  {
    id: 3, rank: 3, type: "core", category: "Value Chain",
    question: "Do vertical AI applications build durable moats, or do improving foundation models absorb their value?",
    outcomeA: { label: "Vertical moats hold", description: "Companies that embed deeply into workflows with proprietary data flywheels and compliance infrastructure build compounding advantages that persist across model generations." },
    outcomeB: { label: "Models absorb", description: "Each foundation model generation narrows the gap between general-purpose and specialized; a sophisticated prompt on the latest frontier model replicates 80%+ of what vertical AI apps offer, making them features not platforms." },
    probabilityA: 55, importance: 9.5, timeHorizon: "2-4 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 52 }, { week: "2026-W09", probabilityA: 55 }],
    rationale: "Harvey's trajectory from $3B to $11B valuation in 12 months, with $190M ARR and 90%+ retention, is the strongest evidence for durable vertical moats. Glean doubling ARR to $200M and Sierra reaching $10B+ reinforce this. But Anthropic launching vertical plugins for finance, HR, and engineering signals that model companies are moving directly into verticals. The open-source MMLU gap narrowed from 17.5 to just 0.3 points in one year, compressing the capability advantage vertical companies can build on top of proprietary models.",
    signals: [
      { date: "2025-08", text: "OpenAI's GPT-5 targeting mass-market users with ad monetization and SuperApp features suggests foundation models are absorbing application-layer value rather than leaving it to vertical apps.", delta: 4 },
      { date: "2026-03", text: "Cursor's rapid revenue growth to $2B ARR suggests vertical AI coding applications are building durable user bases despite improving foundation models.", delta: 3 },
      { date: "2026-02", text: "Harvey reportedly raising at $11B valuation, quadrupling in 12 months", delta: +6 },
      { date: "2026-02", text: "Anthropic launches vertical plugins for finance, HR, engineering, design", delta: -5 },
      { date: "2025-12", text: "Harvey confirms $8B valuation with $190M ARR and 90%+ retention", delta: +5 },
      { date: "2025-12", text: "Glean doubled ARR from $100M to $200M in nine months", delta: +4 },
      { date: "2025-09", text: "Sierra raised $350M at $10B+, demonstrating deep customer service moats", delta: +5 },
      { date: "2025-06", text: "Open-source MMLU gap narrowed from 17.5 to 0.3 percentage points in one year", delta: -6 },
      { date: "2025-02", text: "GPT-5 significantly closes gap on specialized legal and medical benchmarks", delta: -6 },
      { date: "2025-01", text: "Harvey reports 90%+ retention and expanding use cases within accounts", delta: +5 },
      { date: "2024-12", text: "Several vertical AI startups pivot after foundation model improvements undercut differentiation", delta: -4 },
    ],
    tags: ["vertical-ai", "moats", "foundation-models"],
  },
  {
    id: 4, rank: 4, type: "core", category: "Pricing",
    question: "Will consumption-based pricing structurally outperform seat-based pricing in the AI era?",
    outcomeA: { label: "Consumption wins", description: "AI agents drive usage independent of headcount, and consumption-based companies see outsized revenue growth while seat-based companies face structural headwinds from workforce reduction." },
    outcomeB: { label: "Seat-based persists", description: "AI drives seat expansion (more users, not fewer) and enterprises prefer the revenue predictability of seat-based models; consumption pricing remains volatile and niche." },
    probabilityA: 72, importance: 9.2, timeHorizon: "2-4 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 72 }],
    rationale: "High conviction and strengthening. Databricks consumption growth hit 65% YoY with $1.4B in AI revenue. Salesforce Agentforce reached 12,000 customers, marking Salesforce's own shift toward agentic consumption pricing. Apollo Global betting against per-seat SaaS by halving its exposure. Industry consensus is solidifying: seats are being replaced by tokens, credits, and compute units. Figma introduced AI credit pricing alongside traditional seats. The hybrid model is the transition mechanism, not the end state.",
    signals: [
      { date: "2026-02", text: "AI redefining pricing units: seats being replaced by tokens, credits, compute units, AI actions", delta: +5 },
      { date: "2026-01", text: "56% of AI leaders now use hybrid pricing combining subscriptions with usage-based fees", delta: +4 },
      { date: "2025-12", text: "Databricks consumption growth at 65% YoY; $1.4B in AI-specific revenue", delta: +6 },
      { date: "2025-12", text: "Salesforce Agentforce reached 12,000 customers, shifting toward consumption model", delta: +5 },
      { date: "2025-10", text: "Apollo Global slashed SaaS exposure from 20% to 10%, betting against per-seat models", delta: +4 },
      { date: "2025-06", text: "Snowflake consumption model driving $3.8B ARR", delta: +4 },
      { date: "2025-02", text: "Multiple SaaS companies announce hybrid pricing transitions", delta: +3 },
      { date: "2025-01", text: "Figma introduced AI credit pricing model alongside traditional seats", delta: +3 },
      { date: "2024-12", text: "Some seat-based companies report AI driving seat expansion (more users, not fewer)", delta: -3 },
    ],
    tags: ["pricing", "business-models", "saas", "consumption"],
  },
  {
    id: 5, rank: 5, type: "core", category: "Value Chain",
    question: "Will open-source models commoditize the model layer for enterprise use cases?",
    outcomeA: { label: "Commoditization", description: "Open-source reaches 90th percentile quality for 80%+ of enterprise tasks within 18 months, collapsing pricing power for closed-source providers and shifting value to applications and infrastructure." },
    outcomeB: { label: "Closed-source premium holds", description: "Frontier models maintain a wide enough capability gap in reasoning, safety, and reliability that enterprises continue paying premium prices; open-source remains a tier below for production workloads." },
    probabilityA: 68, importance: 9.0, timeHorizon: "1-3 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 68 }],
    rationale: "Open-source now controls 50%+ of the LLM market. The MMLU benchmark gap between open and closed models collapsed from 17.5 to 0.3 points in a single year. DeepSeek forced API costs down 40-60% across the industry, and fine-tuning open-source eliminates recurring fees, cutting costs by up to 80%. Model downloads shifted from US-dominant to China-dominant by summer 2025. Enterprise production adoption remains the holdout, but the barrier is trust and support, not capability.",
    signals: [
      { date: "2025-09", text: "Huawei Ascend ramp suggests non-US AI compute supply is growing, potentially enabling independent open-source model training outside US export controls.", delta: 2 },
      { date: "2026-03", text: "Alibaba Qwen continued major model releases before leadership change, sustaining non-US open-weight frontier model competition that pressures model-layer pricing.", delta: 2 },
      { date: "2025-07", text: "Meta's massive Scale AI investment and noted lag behind frontier labs suggests open-source model quality still trails closed frontier models, limiting near-term commoditization.", delta: -3 },
      { date: "2026-02", text: "Gemini distillation attack at 100,000+ prompts demonstrates frontier model capabilities can be replicated at low cost via distillation, reinforcing open-source/low-cost model commoditization pressure on proprietary model providers.", delta: 3 },
      { date: "2026-03", text: "Anthropic extends Claude memory to free-tier users and adds cross-chatbot data import, competing on features rather than raw model capability, suggesting application-layer differentiation over pure model strength.", delta: -2 },
      { date: "2026-01", text: "Open-source AI now controls 50%+ of the LLM market", delta: +6 },
      { date: "2025-12", text: "MMLU benchmark gap narrowed from 17.5 to 0.3 percentage points in one year", delta: +7 },
      { date: "2025-09", text: "Total model downloads shifted from USA-dominant to China-dominant", delta: +4 },
      { date: "2025-06", text: "DeepSeek forced API costs across industry to drop 40-60%", delta: +6 },
      { date: "2025-06", text: "Fine-tuning open-source models eliminates recurring fees, reducing costs by up to 80%", delta: +5 },
      { date: "2025-02", text: "DeepSeek R1 matches GPT-4 on key benchmarks at a fraction of training cost", delta: +8 },
      { date: "2025-02", text: "Meta Llama 4 shows competitive reasoning; enterprise pilots expanding", delta: +5 },
      { date: "2025-01", text: "Enterprise production adoption of open-source still under 20% for critical workloads", delta: -4 },
      { date: "2024-12", text: "Enterprise adoption limited by trust and support gaps, not capability gaps", delta: -3 },
    ],
    tags: ["open-source", "foundation-models", "commoditization"],
  },
  {
    id: 6, rank: 6, type: "core", category: "Infrastructure",
    question: "Does AI infrastructure spend sustain at current growth rates, or are we in a capex bubble?",
    outcomeA: { label: "Spend sustains", description: "Enterprise AI revenue materializes fast enough to justify current hyperscaler capex; the infrastructure ecosystem has years of runway and current growth rates hold." },
    outcomeB: { label: "Capex correction", description: "ROI scrutiny reveals that AI infrastructure spend is 12-18 months ahead of revenue realization; a 20-30% growth deceleration hits within 18-24 months, resetting valuations across the infrastructure ecosystem." },
    probabilityA: 45, importance: 8.8, timeHorizon: "1-3 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 42 }, { week: "2026-W09", probabilityA: 45 }],
    rationale: "Hyperscaler capex is approaching $700B in 2026 with no signs of slowing—Amazon alone targeting $200B. But the financial strain is mounting: Amazon faces negative FCF of $17B, Microsoft FCF projected to slide 28%, and hyperscalers are increasingly relying on debt financing. NVIDIA backstopped CoreWeave with $2B, suggesting the ecosystem requires external support. DeepSeek's efficiency breakthrough raised fundamental questions about whether this level of spend is necessary per unit of intelligence.",
    signals: [
      { date: "2026-02", text: "OpenAI deploying custom plate-sized chips to sidestep Nvidia for GPT-5.3-Codex-Spark, achieving 15x faster coding inference—signals hyperscaler shift to custom silicon reducing Nvidia GPU dependency and potentially moderating infrastructure spend concentration.", delta: -2 },
      { date: "2025-09", text: "Huawei Ascend production ramp is constrained by HBM bottlenecks, with TSMC continued production noted, indicating geopolitical complexity but sustained overall global AI compute investment.", delta: 3 },
      { date: "2026-02", text: "Major AI infrastructure deals from Meta, Oracle, Microsoft, Google, and OpenAI documented at billion-dollar scale, confirming sustained hyperscaler capex commitment to AI infrastructure.", delta: 4 },
      { date: "2025-08", text: "Semianalysis H100 vs GB200 NVL72 TCO benchmarks show Blackwell complexity in reliability and cost, suggesting frontier training capex remains high but efficiency gains are non-trivial.", delta: 2 },
      { date: "2025-09", text: "Nvidia's Rubin CPX accelerator is purpose-built for the prefill inference phase, indicating continued infrastructure investment and hardware specialization for inference workloads.", delta: 5 },
      { date: "2025-08", text: "HBM4 roadmap analysis shows continued memory wall scaling challenges requiring significant R&D and capex investment, supporting sustained AI infrastructure spend.", delta: 4 },
      { date: "2025-09", text: "AWS is expanding multi-gigawatt Trainium infrastructure alongside Anthropic, signaling massive continued hyperscaler AI capex investment despite earlier cloud capacity struggles.", delta: 6 },
      { date: "2026-02", text: "Nvidia's reported $100 billion OpenAI investment failed to materialize, shaking market confidence in the scale of AI infrastructure commitments.", delta: -3 },
      { date: "2025-09", text: "xAI's Colossus 2 is the world's first gigawatt-scale datacenter, built on top of Colossus 1's ~200K H100/H200s and ~30K GB200 NVL72, signaling continued hyper-scale AI infrastructure investment.", delta: 6 },
      { date: "2025-07", text: "Meta's purchase of 49% of Scale AI at ~$30B valuation, funded by $100B annual cashflow, demonstrates hyperscalers are committing massive capital to AI data and training infrastructure.", delta: 5 },
      { date: "2026-03", text: "Nvidia investing $4B into photonics companies (Lumentum and Coherent, $2B each) to advance data center optical interconnects, signaling continued aggressive AI infrastructure capex expansion.", delta: 3 },
      { date: "2026-02", text: "Hyperscaler capex approaching $700B in 2026, up 60% from 2025 levels", delta: +6 },
      { date: "2026-02", text: "Amazon expects $200B capex in 2026; facing negative FCF of ~$17B", delta: -4 },
      { date: "2026-01", text: "NVIDIA invests $2B in CoreWeave to expand AI infrastructure capacity", delta: +3 },
      { date: "2025-12", text: "Hyperscalers increasingly leaning on debt markets to fund AI capex", delta: -5 },
      { date: "2025-12", text: "Microsoft free cash flow projected to slide 28% in 2026 due to AI spending", delta: -4 },
      { date: "2025-11", text: "Big Tech aggregate AI investment reached $400B in 2025", delta: +4 },
      { date: "2025-06", text: "75% of hyperscaler capex ($450B) now directly tied to AI infrastructure", delta: +3 },
      { date: "2025-01", text: "DeepSeek demonstrates dramatically lower training costs, raising efficiency questions", delta: -6 },
      { date: "2024-12", text: "NVIDIA data center revenue exceeds expectations; inference demand surging", delta: +3 },
    ],
    tags: ["infrastructure", "capex", "hyperscalers", "gpu"],
  },
  {
    id: 7, rank: 7, type: "core", category: "Enterprise",
    question: "Will AI agents move from copilot to autonomous in enterprise settings within 3 years?",
    outcomeA: { label: "Fast transition", description: "Within 3 years, agents handle 40%+ of enterprise workflows autonomously; the entire software stack begins re-architecting around agent-native workflows, and products built for human operators face obsolescence." },
    outcomeB: { label: "Slow transition", description: "Enterprise trust, compliance, and liability concerns keep humans in the loop for the vast majority of workflows through 2028; the copilot paradigm persists and current software products adapt incrementally." },
    probabilityA: 61, importance: 8.8, timeHorizon: "2-4 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 58 }, { week: "2026-W09", probabilityA: 61 }],
    rationale: "The shift is accelerating faster than expected. Salesforce Agentforce reached 12,000 customers and is moving toward agents that initiate actions without human prompts. 93% of IT leaders plan to deploy autonomous agents within two years. Reddit deflected 46% of support cases and cut resolution times by 84% using agents. However, Klarna's experience is instructive: after going all-in on AI, they added human agents back for complex issues. The 80/20 problem persists—production demands 99%+ reliability, and that last stretch takes 100x more work.",
    signals: [
      { date: "2025-07", text: "Robotics autonomy analysis shows modern AI converts robot roadblocks into data problems, with clear levels-of-autonomy framework suggesting a credible path from assisted to autonomous operation.", delta: 3 },
      { date: "2026-03", text: "Google Gemini on Pixel phones can now autonomously order groceries and book rides, marking consumer-facing agentic task execution reaching mass-market rollout.", delta: 4 },
      { date: "2026-02", text: "Claude Opus 4.6 and OpenAI Frontier actively pitch enterprise AI agent supervision as the next paradigm, with vendors framing humans as managers rather than operators.", delta: 4 },
      { date: "2026-03", text: "14.ai autonomously handles customer support tasks end-to-end at startups, signaling movement from copilot toward autonomous agent deployment in enterprise/SMB settings.", delta: 3 },
      { date: "2026-02", text: "16 Claude AI agents collaboratively compiled a Linux kernel for $20,000 but required deep human oversight, demonstrating early multi-agent capability with significant autonomy limitations.", delta: 2 },
      { date: "2026-02", text: "Salesforce Agentforce moving toward agents initiating actions without human prompts", delta: +5 },
      { date: "2026-02", text: "Anthropic launches enterprise agent plugins for finance, engineering, and HR", delta: +5 },
      { date: "2026-01", text: "40% of enterprise apps projected to run AI agents by 2026", delta: +5 },
      { date: "2025-12", text: "Salesforce Agentforce reached 12,000 customers; targeting 1B agents by end of 2025", delta: +4 },
      { date: "2025-12", text: "93% of IT leaders plan to deploy autonomous agents within two years", delta: +5 },
      { date: "2025-10", text: "Reddit deflected 46% of support cases, cut resolution times by 84% with agents", delta: +5 },
      { date: "2025-09", text: "AI agent market projected at $7.84B in 2025, growing to $52.62B by 2030 (46% CAGR)", delta: +4 },
      { date: "2025-06", text: "Klarna integrated human agents back for complex issues after going AI-only", delta: -2 },
      { date: "2025-06", text: "Production demands 99%+ reliability; last stretch from 80% takes 100x more work", delta: -3 },
      { date: "2025-02", text: "Enterprise surveys show <5% of companies have deployed autonomous agents in production", delta: -3 },
      { date: "2024-12", text: "Klarna reports AI handling 2/3 of customer service interactions without escalation", delta: +6 },
    ],
    tags: ["agents", "autonomy", "enterprise", "copilot"],
  },
  {
    id: 8, rank: 8, type: "core", category: "Macro",
    question: "Will AI reduce knowledge-worker headcount by more than 15% within 5 years?",
    outcomeA: { label: "Significant displacement", description: "AI eliminates 15%+ of knowledge worker roles, concentrated in support, content, back-office, and entry-level professional functions; every per-seat and per-employee SaaS product faces structural revenue headwinds." },
    outcomeB: { label: "Minimal displacement", description: "AI augments rather than replaces; productivity gains are absorbed into higher output rather than fewer workers; headcount remains broadly stable and seat-based SaaS is unaffected." },
    probabilityA: 68, importance: 8.5, timeHorizon: "3-5 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 65 }, { week: "2026-W09", probabilityA: 68 }],
    rationale: "55,000 job cuts were directly attributed to AI in 2025, with 25,000+ already in early 2026. Big Tech entry-level hiring dropped 50%+ over three years. Employment in marketing, graphic design, admin, and call centers has fallen below trend. Anthropic CEO Dario Amodei predicts AI could eliminate half of entry-level white-collar jobs within 5 years. However, companies are laying off for AI capabilities that don't yet exist, and Forrester predicts half of AI layoffs will be quietly rehired. WEF projects a net gain of 78M jobs by 2030.",
    signals: [
      { date: "2025-07", text: "AI-enabled robotics autonomy roadmap suggests physical labor automation is accelerating alongside knowledge-worker AI, broadening potential headcount displacement beyond white-collar roles.", delta: 3 },
      { date: "2026-03", text: "14.ai is replacing customer support teams at startups, demonstrating AI directly eliminating knowledge-worker roles in a defined function.", delta: 3 },
      { date: "2026-01", text: "Companies laying off workers for AI capabilities that don't yet fully exist", delta: +3 },
      { date: "2026-01", text: "25,000+ employees already impacted by AI-driven layoffs in early 2026", delta: +4 },
      { date: "2025-12", text: "55,000 job cuts directly attributed to AI in 2025 (4.5% of total layoffs)", delta: +4 },
      { date: "2025-12", text: "Big Tech entry-level hiring dropped 50%+ over three years", delta: +5 },
      { date: "2025-12", text: "Anthropic CEO predicts AI could eliminate half of entry-level white-collar jobs in 5 years", delta: +5 },
      { date: "2025-10", text: "Employment in marketing, graphic design, admin, call centers fallen below trend", delta: +4 },
      { date: "2025-06", text: "Forrester predicts half of AI-attributed layoffs will be quietly rehired, often offshore", delta: -3 },
      { date: "2025-01", text: "WEF projects 92M jobs displaced by 2030 but 170M new created (net +78M)", delta: -4 },
      { date: "2025-01", text: "McKinsey revises upward estimate of AI-automatable tasks to 45% of knowledge work", delta: +4 },
      { date: "2024-12", text: "Overall unemployment remains low; displaced workers finding adjacent roles", delta: -3 },
    ],
    tags: ["employment", "macro", "demand", "headcount"],
  },
  {
    id: 9, rank: 9, type: "core", category: "Enterprise",
    question: "Will AI-native companies displace incumbents, or will incumbents successfully integrate AI to defend their positions?",
    outcomeA: { label: "Incumbents defend", description: "Distribution, data access, and enterprise trust give incumbents enough time to integrate AI; AI-native challengers struggle with enterprise sales cycles and incumbents retain market share." },
    outcomeB: { label: "AI-native wins", description: "The architectural leap from human-operated UIs to agent-native workflows is too large for incumbents to bridge; AI-native companies that rebuild categories from scratch capture the majority of new and replacement spending." },
    probabilityA: 52, importance: 8.5, timeHorizon: "3-5 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 50 }, { week: "2026-W09", probabilityA: 52 }],
    rationale: "Genuinely even and getting more nuanced. Salesforce and ServiceNow are aggressively pushing agentic offerings—Salesforce rebranded around Agentforce with 12,000 customers. Their default 'good enough' AI keeps enterprises on-platform. But incumbents' AI is often assistive rather than agentic, and ServiceNow's Now Assist increases license costs 50-60%. Meanwhile Harvey ($11B), Sierra ($10B+), and Glean ($7.2B) prove AI-native can win at scale. The pattern emerging: incumbents defend existing accounts while AI-natives win greenfield.",
    signals: [
      { date: "2026-02", text: "Broadcom's aggressive VMware repricing continues to drive customers to actively reduce VMware footprint, with survey confirming incumbent vendor consolidation strategy sacrifices customer base—creating displacement opportunity for AI-native alternatives.", delta: 3 },
      { date: "2026-03", text: "Investor sentiment shifting away from certain AI SaaS archetypes suggests incumbents or differentiated AI-native players may be consolidating advantage as hype-driven entrants lose funding.", delta: -1 },
      { date: "2026-03", text: "AI-native startup 14.ai displacing human customer support teams at startups, indicating AI-native companies encroaching on traditional BPO/support incumbent territory.", delta: 2 },
      { date: "2026-03", text: "ChatGPT uninstalls surged 295% after DoD deal announcement while Claude downloads grew, showing consumer brand fragility and competitive redistribution among AI incumbents.", delta: 2 },
      { date: "2026-03", text: "Cursor surpassed $2B in annualized revenue with run rate doubling in 3 months, signaling AI-native coding tools gaining rapid enterprise traction over incumbents.", delta: 4 },
      { date: "2026-02", text: "Salesforce and ServiceNow both pushing agentic AI offerings, legitimizing category", delta: -4 },
      { date: "2026-02", text: "Anthropic launches enterprise plugins, competing with both incumbents and startups", delta: +3 },
      { date: "2025-12", text: "Salesforce Agentforce reached 12,000 customers; company rebranded around agents", delta: -5 },
      { date: "2025-12", text: "ServiceNow Now Assist is assistive not agentic; increases license cost 50-60%", delta: +3 },
      { date: "2025-09", text: "Incumbents' default 'good enough' AI keeps enterprises on-platform without switching", delta: -4 },
      { date: "2025-06", text: "AI-native startups hit 80% easily but production 99%+ takes 100x more work", delta: -3 },
      { date: "2025-06", text: "Harvey at $5B, Sierra at $10B+ demonstrate AI-native can scale rapidly", delta: +5 },
      { date: "2025-01", text: "AI-native startups winning greenfield deals at companies without incumbent lock-in", delta: +5 },
      { date: "2024-12", text: "Enterprise AI startups report elongating sales cycles as incumbents add features", delta: -3 },
    ],
    tags: ["incumbents", "disruption", "ai-native", "competitive"],
  },
  {
    id: 10, rank: 10, type: "core", category: "Demand Shifts",
    question: "Will AI agents increasingly make enterprise purchasing decisions, inverting traditional go-to-market advantages?",
    outcomeA: { label: "Agent GTM era arrives", description: "AI agents influence 30%+ of software evaluation and procurement; API quality, machine-readable pricing, and measurable benchmarks become the primary competitive advantages; brand and sales relationships erode." },
    outcomeB: { label: "Human GTM persists", description: "Enterprise purchasing remains relationship-driven and committee-based; agents assist with research but humans make the decisions; traditional sales-led and brand-driven GTM retains its value." },
    probabilityA: 43, importance: 8.2, timeHorizon: "3-5 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 40 }, { week: "2026-W09", probabilityA: 43 }],
    rationale: "Stripe launched its Agentic Commerce Suite, the first major infrastructure move for AI-agent transactions. They also introduced USDC payments for AI agents on Base blockchain, and stablecoin volumes grew 4x in 2025. But Stripe's own co-founders say agentic commerce is 'overhyped too early' and the industry is at 'levels 1 and 2' of development. Enterprise procurement still requires human approval chains. The infrastructure is being built, but autonomous purchasing is years from mainstream.",
    signals: [
      { date: "2026-02", text: "AI vendors repositioning humans as agent supervisors signals early infrastructure shift toward agent-driven workflows that could eventually extend to procurement decisions.", delta: 2 },
      { date: "2026-03", text: "Google Gemini executing transactional tasks (grocery orders, ride bookings) on Pixel devices signals early real-world AI agent commerce bypassing traditional user-initiated purchasing flows.", delta: 3 },
      { date: "2026-02", text: "Stripe launches Agentic Commerce Suite for AI agent-driven transactions", delta: +6 },
      { date: "2026-02", text: "Stripe co-founders note agentic commerce 'overhyped too early'; industry at levels 1-2", delta: -3 },
      { date: "2025-12", text: "Stablecoin transaction volumes on Stripe/Bridge increased 4x in 2025", delta: +4 },
      { date: "2025-12", text: "Stripe introduces USDC payment system for AI agents on Base blockchain", delta: +5 },
      { date: "2025-06", text: "Google brings 60 allies for AI payment battle vs Stripe building own rails", delta: +3 },
      { date: "2025-02", text: "Early agent-to-agent procurement pilots emerging at large technology companies", delta: +3 },
      { date: "2025-01", text: "Enterprise procurement still requires human approval chains; agent role limited to research", delta: -2 },
      { date: "2024-12", text: "Stripe, Shopify investing heavily in agent-friendly commerce and evaluation APIs", delta: +4 },
    ],
    tags: ["agents", "procurement", "gtm", "distribution"],
  },
];

const SECTOR_QUESTIONS = [
  {
    id: 101, type: "sector", sector: "Data Observability", sectorExamples: "Grafana, Cribl, Datadog",
    question: "Will AI self-healing systems eliminate the need for human-facing observability tooling?",
    outcomeA: { label: "Observability persists", description: "AI increases system complexity faster than it can self-manage; human operators and their dashboards remain essential, and observability TAM expands." },
    outcomeB: { label: "Observability collapses", description: "AI agents autonomously detect, diagnose, and resolve infrastructure issues end-to-end; human-readable dashboards and alerting become unnecessary for 70%+ of operations." },
    probabilityA: 70, importance: 8.5, timeHorizon: "3-5 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 70 }],
    rationale: "Datadog's Q4 revenue surged 29% to $953M with record $1.63B bookings (+37% YoY), and the company guided $4.1B for 2026. Grafana Labs ARR surpassed $400M. The observability TAM is projected to reach $6.93B by 2031. AI workloads are creating more things to observe, not fewer. However, Datadog's own Bits AI SRE Agent can now autonomously investigate outages and execute remediation—the seeds of self-healing are being planted by the observability vendors themselves.",
    signals: [
      { date: "2026-02", text: "Datadog guided $4.06-4.10B revenue for 2026; Q4 revenue surged 29% to $953M", delta: +5 },
      { date: "2026-02", text: "Datadog generated record $1.63B in bookings, up 37% year-over-year", delta: +5 },
      { date: "2025-12", text: "Datadog full-year 2025 revenue reached $3.43B; record $915M in free cash flow", delta: +5 },
      { date: "2025-12", text: "Grafana Labs ARR surpassed $400M entering 2026", delta: +4 },
      { date: "2025-12", text: "Datadog launches Bits AI SRE Agent for autonomous incident investigation and remediation", delta: -3 },
      { date: "2025-06", text: "Observability TAM projected to reach $6.93B by 2031 at 15.6% CAGR", delta: +3 },
      { date: "2025-02", text: "Datadog reports surging AI workload monitoring revenue", delta: +4 },
      { date: "2025-01", text: "AI-driven incident response tools showing early promise in auto-remediation", delta: -3 },
      { date: "2024-12", text: "Enterprise infrastructure complexity increasing faster than tooling can automate", delta: +3 },
    ],
    tags: ["observability", "self-healing", "infrastructure"],
  },
  {
    id: 102, type: "sector", sector: "Data Warehousing & Analytics", sectorExamples: "Databricks, Snowflake",
    question: "Will foundation model platforms become the primary enterprise analytics interface, reducing data platforms to commodity storage?",
    outcomeA: { label: "Data platforms hold value", description: "Databricks and Snowflake remain the analytical engine and system of record; LLMs are a natural language front-end that drives more usage." },
    outcomeB: { label: "Value migrates to model layer", description: "Enterprises feed data into foundation model platforms that become the primary analytical interface, and data platforms are reduced to low-margin storage and ingestion utilities." },
    probabilityA: 65, importance: 9.0, timeHorizon: "3-5 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 65 }],
    rationale: "Databricks is winning the data+AI convergence: $5.4B ARR growing 65% YoY, $1.4B in AI-specific revenue (vs Snowflake still early in Cortex AI), and a $134B valuation. They acquired MosaicML and Neon ($1B), building the AI platform on top of the data platform. Snowflake is more cautious, partnering with OpenAI and Google rather than building its own stack. The data platform is becoming the AI platform, not being displaced by it—but the value is accruing disproportionately to Databricks.",
    signals: [
      { date: "2026-01", text: "Databricks crossed $5.4B ARR, growing 65% YoY with $134B valuation", delta: +6 },
      { date: "2025-12", text: "Databricks $1.4B in AI revenue vs Snowflake still early in Cortex AI adoption", delta: +5 },
      { date: "2025-12", text: "Databricks acquired Neon for $1B to create Lakebase storage layer", delta: +4 },
      { date: "2025-12", text: "Databricks completed $5B equity raise, acquiring MosaicML and building Agent Bricks", delta: +5 },
      { date: "2025-06", text: "Snowflake partnering with OpenAI and Google rather than building own AI stack", delta: -3 },
      { date: "2025-02", text: "Databricks integrates LLM-powered analytics natively; usage increases", delta: +4 },
      { date: "2025-01", text: "OpenAI launches data analysis features that bypass traditional BI tools", delta: -5 },
      { date: "2024-12", text: "Enterprise data governance requirements keep structured warehouses central", delta: +3 },
    ],
    tags: ["data-warehousing", "analytics", "foundation-models"],
  },
  {
    id: 103, type: "sector", sector: "Payroll Software", sectorExamples: "Rippling, Gusto",
    question: "Will AI-driven headcount reduction shrink per-employee payroll TAM faster than any offsetting complexity can compensate?",
    outcomeA: { label: "TAM resilient", description: "Workforce complexity (fractional workers, multi-jurisdiction, contractors) and the irreducible need for payroll processing maintain or grow TAM even as average headcounts decline." },
    outcomeB: { label: "TAM structurally shrinks", description: "AI reduces the number of people being paid by 20%+ over 5 years, and per-employee pricing means payroll revenue contracts proportionally with no viable offset." },
    probabilityA: 55, importance: 8.0, timeHorizon: "3-5 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 55 }],
    rationale: "Payroll vendors are growing despite headcount fears. Rippling reached $570M ARR growing 30%+ YoY, and Deel hit $1B run rate with 75% growth. Multi-product expansion and global contractor complexity are adding revenue per customer. But Big Tech entry-level hiring dropped 50%+ over three years, and AI-driven layoffs directly reduce per-employee billing. The near-term trajectory favors resilience through complexity; the longer-term risk is structural if AI meaningfully reduces total employment.",
    signals: [
      { date: "2026-01", text: "Companies laying off workers for AI capabilities that don't yet exist", delta: -3 },
      { date: "2025-12", text: "Rippling reached $570M ARR, growing 30%+ YoY via multi-product expansion", delta: +3 },
      { date: "2025-12", text: "Deel hit $1B revenue run rate with 75% YoY growth, profitable since Q3 2023", delta: +3 },
      { date: "2025-12", text: "Big Tech entry-level hiring dropped 50%+ over three years", delta: -4 },
      { date: "2025-06", text: "AI-driven automation, same-day deposits, global contractor support now standard", delta: +2 },
      { date: "2025-06", text: "Global HR payroll market being revolutionized by AI-powered innovations", delta: +3 },
      { date: "2025-02", text: "Rippling reports growing revenue per customer from multi-product expansion", delta: +3 },
      { date: "2025-01", text: "Multiple enterprises announce AI-driven headcount reduction targets", delta: -4 },
      { date: "2024-12", text: "Contractor and fractional worker payroll growing faster than FTE payroll", delta: +2 },
    ],
    tags: ["payroll", "employment", "tam"],
  },
  {
    id: 104, type: "sector", sector: "Payments Infrastructure", sectorExamples: "Stripe",
    question: "Will AI agents transacting autonomously create a massive new payments volume layer, or will agent commerce route through new rails that bypass traditional processors?",
    outcomeA: { label: "Stripe captures agent commerce", description: "Agent-driven transactions flow through existing payment infrastructure; Stripe's API-native architecture is perfectly positioned and volume grows dramatically." },
    outcomeB: { label: "New rails emerge", description: "Agent-to-agent commerce develops its own payment protocols, authentication, and settlement systems that bypass traditional processors entirely." },
    probabilityA: 71, importance: 8.5, timeHorizon: "3-5 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 68 }, { week: "2026-W09", probabilityA: 71 }],
    rationale: "Stripe is actively building both traditional and crypto-native agent payment infrastructure. The Agentic Commerce Suite launched for AI agent transactions, and they introduced USDC payments for agents on Base blockchain—hedging both outcomes. Stablecoin volumes on Stripe/Bridge grew 4x in 2025. The key insight: Stripe is building the new rails itself rather than waiting for them to emerge elsewhere. Google assembling 60 allies for AI payments suggests the competitive landscape is broader than Stripe alone.",
    signals: [
      { date: "2026-03", text: "Gemini on Pixel ordering groceries and rides demonstrates consumer AI agents routing commerce transactions, raising questions about payment rail displacement.", delta: 3 },
      { date: "2026-02", text: "Stripe launches Agentic Commerce Suite for selling on and through AI agents", delta: +6 },
      { date: "2026-02", text: "Stripe co-founders say agentic commerce 'overhyped too early'; at levels 1-2", delta: -2 },
      { date: "2025-12", text: "Stablecoin transaction volumes on Stripe/Bridge increased 4x in 2025", delta: +3 },
      { date: "2025-12", text: "Stripe introduces USDC payment system for AI agents on Base blockchain", delta: +4 },
      { date: "2025-06", text: "Google brings 60 allies for AI payment battle vs Stripe building own rails", delta: -3 },
      { date: "2025-02", text: "Early agent-to-agent commerce pilots using existing Stripe APIs", delta: +4 },
      { date: "2025-01", text: "Crypto-native agent payment protocols emerging in DeFi ecosystem", delta: -3 },
      { date: "2024-12", text: "Stripe invests heavily in agent-friendly commerce infrastructure", delta: +3 },
    ],
    tags: ["payments", "agents", "commerce"],
  },
  {
    id: 105, type: "sector", sector: "Enterprise AI Applications", sectorExamples: "Harvey, Glean, Sierra",
    question: "Will each new foundation model generation reset vertical AI competitive advantages, preventing durable moats from forming?",
    outcomeA: { label: "Moats compound", description: "Vertical AI companies that embed into workflows and build proprietary data flywheels become more defensible with each model generation." },
    outcomeB: { label: "Moats reset", description: "Every major model upgrade narrows the gap between general-purpose and specialized; these companies are on a treadmill, perpetually re-investing to maintain parity." },
    probabilityA: 48, importance: 9.5, timeHorizon: "2-4 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 48 }],
    rationale: "Harvey's trajectory from $3B to $11B in 12 months with $190M ARR and 90%+ retention is the strongest evidence for compounding moats. Glean doubling to $200M ARR reinforces this. But Anthropic directly launching vertical plugins for finance, HR, and engineering signals that model companies are moving into verticals. The open-source MMLU gap narrowing to 0.3 points means the foundation capability advantage is shrinking. The question is whether workflow depth and data flywheels can outrun model-layer commoditization.",
    signals: [
      { date: "2026-02", text: "Harvey raising at $11B, quadrupling in 12 months—suggests compounding moats", delta: +5 },
      { date: "2026-02", text: "Anthropic launches vertical plugins for finance, HR, engineering—direct competition", delta: -5 },
      { date: "2025-12", text: "Harvey confirms $190M ARR with 90%+ retention and expanding use cases", delta: +5 },
      { date: "2025-12", text: "Glean doubled ARR from $100M to $200M in nine months", delta: +4 },
      { date: "2025-06", text: "Open-source MMLU gap narrowed from 17.5 to 0.3 percentage points", delta: -5 },
      { date: "2025-02", text: "GPT-5 significantly closes gap on specialized legal and medical benchmarks", delta: -6 },
      { date: "2025-01", text: "Harvey reports expanding use cases within accounts—depth of moat increasing", delta: +5 },
      { date: "2024-12", text: "Several vertical AI startups pivot after model improvements undercut differentiation", delta: -4 },
    ],
    tags: ["enterprise-ai", "vertical-ai", "moats"],
  },
  {
    id: 106, type: "sector", sector: "Enterprise AI Applications", sectorExamples: "Harvey, Glean, Sierra",
    question: "Will foundation model companies move down-stack into enterprise verticals, directly competing with their own customers?",
    outcomeA: { label: "Model companies stay horizontal", description: "OpenAI, Anthropic, and Google focus on the platform/API layer and leave vertical applications to specialists." },
    outcomeB: { label: "Model companies go vertical", description: "Foundation model providers launch their own legal AI, sales AI, and support AI, leveraging model advantage and distribution to undercut vertical startups." },
    probabilityA: 49, importance: 9.0, timeHorizon: "2-4 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 45 }, { week: "2026-W09", probabilityA: 49 }],
    rationale: "The evidence now clearly shows model companies going vertical. Anthropic launched enterprise plugins for finance, HR, engineering, and design—directly competing with vertical startups. OpenAI launched its Frontier platform for enterprise agents. Google has Gemini-powered vertical solutions for healthcare and legal. Claude Code reaching $1B ARR in six months shows model companies can capture application-layer value directly. Anthropic is increasingly described as 'an enterprise company with a consumer product,' not just an API provider.",
    signals: [
      { date: "2026-03", text: "OpenAI's direct Pentagon contract bypasses application-layer intermediaries, indicating foundation model companies competing directly in enterprise verticals rather than enabling partners.", delta: 3 },
      { date: "2026-03", text: "Google supplying Gemini models and servers to power Apple's Siri shows foundation model companies expanding into infrastructure provisioning for device OEMs, encroaching on downstream value.", delta: 3 },
      { date: "2025-08", text: "OpenAI's GPT-5 SuperApp strategy with ad monetization signals foundation model companies moving into consumer and enterprise application layers, competing with their own customers.", delta: 5 },
      { date: "2026-02", text: "Anthropic launches vertical plugins for finance, HR, engineering, and design", delta: -6 },
      { date: "2026-02", text: "OpenAI launches Frontier platform enabling enterprise agent building", delta: -4 },
      { date: "2026-02", text: "Anthropic described as 'enterprise company with consumer product'—not just API provider", delta: -3 },
      { date: "2025-12", text: "Google launches Gemini-powered vertical solutions for healthcare and legal", delta: -5 },
      { date: "2025-08", text: "Anthropic reached 300K+ business customers, up from <1K two years prior", delta: -3 },
      { date: "2025-06", text: "Claude Code reached $1B ARR in 6 months—direct competition with dev tools", delta: -4 },
      { date: "2025-02", text: "OpenAI expands ChatGPT Enterprise with domain-specific features", delta: -4 },
      { date: "2025-01", text: "Anthropic publicly commits to platform strategy, encouraging ecosystem", delta: +5 },
    ],
    tags: ["enterprise-ai", "foundation-models", "platform-risk"],
  },
  {
    id: 107, type: "sector", sector: "Enterprise AI Applications", sectorExamples: "Harvey, Glean, Sierra",
    question: "Can enterprise AI companies maintain software-like gross margins (75%+) at scale?",
    outcomeA: { label: "Software margins hold", description: "Inference cost declines and open-source models keep COGS low; these companies deserve SaaS multiples." },
    outcomeB: { label: "Margins compress", description: "Human-in-the-loop validation, domain experts, and custom deployment push margins to 50-60%; these companies should be valued as services businesses." },
    probabilityA: 48, importance: 8.5, timeHorizon: "2-4 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 50 }, { week: "2026-W09", probabilityA: 48 }],
    rationale: "AI API pricing fell 60-80% across major providers between early 2025 and early 2026, and open-source fine-tuning cuts costs by up to 80%—both dramatically reducing COGS. Harvey and Glean report improving gross margins as usage scales. Anthropic's standardized enterprise plugin model suggests delivery at software margins is achievable. But enterprise AI companies still report significant professional services revenue alongside software, indicating human involvement remains structurally necessary for complex deployments.",
    signals: [
      { date: "2025-08", text: "GB200 NVL72 training shows higher TCO complexity vs H100, indicating AI infrastructure cost pressures that may compress gross margins for model-layer companies relying on owned compute.", delta: -2 },
      { date: "2026-01", text: "AI API pricing fell 60-80% across major providers, sharply reducing COGS for AI apps", delta: +5 },
      { date: "2025-12", text: "Harvey reports improving margins alongside rapid revenue growth to $190M ARR", delta: +4 },
      { date: "2025-12", text: "Open-source fine-tuning eliminates recurring API fees, reducing costs by up to 80%", delta: +5 },
      { date: "2025-06", text: "Anthropic enterprise plugin model suggests standardized delivery at software margins", delta: +3 },
      { date: "2025-02", text: "Inference costs declining 50% annually; open-source models reducing COGS further", delta: +5 },
      { date: "2025-01", text: "Enterprise AI companies report significant professional services revenue alongside software", delta: -4 },
      { date: "2024-12", text: "Harvey, Glean report improving gross margins as usage scales", delta: +3 },
    ],
    tags: ["enterprise-ai", "margins", "valuation"],
  },
  {
    id: 108, type: "sector", sector: "Core Foundation Models", sectorExamples: "OpenAI, Anthropic",
    question: "Will open-source models close the frontier capability gap enough to commoditize the model layer entirely?",
    outcomeA: { label: "Frontier premium persists", description: "Closed-source models maintain a meaningful capability gap that enterprises pay premium prices for; 60%+ margins are sustainable." },
    outcomeB: { label: "Commoditization", description: "Open-source reaches 95th percentile quality for enterprise use cases; API pricing collapses and margins compress to 30-40%." },
    probabilityA: 45, importance: 9.5, timeHorizon: "2-4 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 45 }],
    rationale: "Open-source now controls 50%+ of the LLM market, and the MMLU gap collapsed from 17.5 to 0.3 points in a single year—the capability gap has essentially vanished on standard benchmarks. Model downloads shifted from US to China-dominant. DeepSeek forced 40-60% API price drops. But Claude Opus 4 and GPT-5 maintain meaningful reasoning advantages on complex tasks, and enterprise adoption of open-source remains limited by trust, support, and compliance requirements rather than raw capability.",
    signals: [
      { date: "2026-03", text: "Alibaba's Qwen tech lead departure after major model launch signals ongoing competitive frontier model development outside US, supporting open-source/commoditization trajectory.", delta: 2 },
      { date: "2025-07", text: "Meta described as falling behind foundation labs in model performance despite unlimited resources, suggesting frontier capability gap is widening rather than closing for open-source.", delta: -4 },
      { date: "2026-02", text: "Attackers used model distillation to clone Gemini with 100,000+ prompts at a fraction of development cost, demonstrating that frontier model capabilities can be approximated cheaply—supporting commoditization thesis.", delta: 3 },
      { date: "2026-02", text: "Claude Opus 4 and GPT-5 maintain reasoning advantages on complex enterprise tasks", delta: +5 },
      { date: "2026-01", text: "Open-source AI now controls 50%+ of the LLM market", delta: -6 },
      { date: "2025-12", text: "MMLU benchmark gap collapsed from 17.5 to 0.3 points in one year", delta: -7 },
      { date: "2025-09", text: "Total model downloads shifted from USA-dominant to China-dominant", delta: -4 },
      { date: "2025-06", text: "DeepSeek forced industry API costs to drop 40-60%", delta: -6 },
      { date: "2025-02", text: "DeepSeek R1 matches GPT-4 on key benchmarks at fraction of cost", delta: -6 },
      { date: "2025-01", text: "Anthropic and OpenAI release models with significant reasoning leaps over open-source", delta: +5 },
      { date: "2024-12", text: "Enterprise open-source adoption limited by trust and support gaps, not capability", delta: +3 },
    ],
    tags: ["foundation-models", "open-source", "commoditization"],
  },
  {
    id: 109, type: "sector", sector: "Core Foundation Models", sectorExamples: "OpenAI, Anthropic",
    question: "Will foundation model companies successfully become application platforms, or are they trapped in the infrastructure layer?",
    outcomeA: { label: "Platform escape", description: "ChatGPT, Claude, and Gemini become enterprise platforms with direct user relationships and application-layer revenue." },
    outcomeB: { label: "API trap", description: "Enterprises treat models as interchangeable infrastructure and build applications on top; model companies capture infrastructure economics only." },
    probabilityA: 58, importance: 9.0, timeHorizon: "3-5 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 55 }, { week: "2026-W09", probabilityA: 58 }],
    rationale: "Strong platform escape signals. Anthropic embedded Claude directly into Excel, PowerPoint, Slack, Gmail, and Google Drive. Claude Code hit $1B ARR in six months. OpenAI launched Frontier for enterprise agents, and Figma added OpenAI integration to ChatGPT. Anthropic reached 300K+ business customers. The model companies are successfully building application-layer relationships. The risk: enterprise surveys still show most companies use 3+ providers interchangeably, undermining any single provider's platform lock-in.",
    signals: [
      { date: "2026-02", text: "OpenAI begins testing ads in ChatGPT, signaling a pivot toward consumer monetization rather than pure enterprise platform expansion.", delta: -2 },
      { date: "2026-03", text: "OpenAI secures Pentagon defense contract with 'technical safeguards,' showing foundation model companies moving into specialized vertical/government application territory.", delta: 3 },
      { date: "2026-03", text: "Anthropic expanding Claude Code with voice mode suggests foundation model companies are actively moving into application-layer tooling, not staying infrastructure-only.", delta: 3 },
      { date: "2026-03", text: "Anthropic adds memory and data-import features to Claude free tier, signaling active push toward application-layer stickiness beyond pure API/infrastructure positioning.", delta: 3 },
      { date: "2025-08", text: "GPT-5 is positioned for ad monetization and SuperApp strategy targeting 700M+ free ChatGPT users, indicating OpenAI is moving aggressively into the application layer.", delta: 6 },
      { date: "2026-03", text: "Anthropic embeds Claude in Excel, PowerPoint, Slack, Gmail, Google Drive, DocuSign", delta: +6 },
      { date: "2026-02", text: "Claude Code reached $1B annualized run rate—platform-layer value capture", delta: +6 },
      { date: "2026-02", text: "OpenAI launches Frontier platform for building enterprise AI agents", delta: +5 },
      { date: "2025-12", text: "OpenAI added integration with Canva, Figma, and other services to ChatGPT", delta: +4 },
      { date: "2025-08", text: "Anthropic reached 300K+ business customers, up from <1K two years prior", delta: +5 },
      { date: "2025-06", text: "Enterprise surveys show most companies use 3+ model providers interchangeably", delta: -4 },
      { date: "2025-02", text: "ChatGPT Enterprise and Claude for Work gaining traction as daily-use tools", delta: +5 },
      { date: "2024-12", text: "OpenAI launches custom GPTs marketplace; early signs of platform lock-in", delta: +3 },
    ],
    tags: ["foundation-models", "platform", "enterprise"],
  },
  {
    id: 110, type: "sector", sector: "Non-Core Foundation Models", sectorExamples: "ElevenLabs, Black Forest Labs",
    question: "Will multimodal foundation models absorb specialized modality capabilities, making standalone voice/image/video model companies unnecessary?",
    outcomeA: { label: "Specialization survives", description: "Dedicated models maintain meaningful quality, latency, and customization advantages that sustain standalone businesses." },
    outcomeB: { label: "Multimodal absorbs", description: "General-purpose models reach 'good enough' across all modalities within 2-3 years; specialized companies lose their reason to exist." },
    probabilityA: 45, importance: 8.5, timeHorizon: "2-3 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 42 }, { week: "2026-W09", probabilityA: 45 }],
    rationale: "ElevenLabs is expanding aggressively beyond voice into multimodal with ElevenAgents (conversational AI that can see, hear, and act) and image/video generation. But the competitive pressure is intense: GPT realtime API competes directly with ElevenLabs on voice, and Adobe Firefly integrated BFL Flux 1.1 alongside Google models as interchangeable commodity options. ElevenLabs' voice quality still leads meaningfully, but the window for building platform value before 'good enough' multimodal arrives is narrowing.",
    signals: [
      { date: "2026-03", text: "Anthropic added voice mode to Claude Code, indicating multimodal/voice capabilities being absorbed into general-purpose coding assistants rather than remaining standalone.", delta: 3 },
      { date: "2026-01", text: "ElevenLabs launches ElevenAgents for multimodal conversational AI that can see and hear", delta: +4 },
      { date: "2025-12", text: "ElevenLabs expanded into image and video generation—moving beyond voice", delta: +3 },
      { date: "2025-10", text: "Adobe Firefly integrates BFL Flux 1.1 alongside Google models as commodity options", delta: -3 },
      { date: "2025-08", text: "GPT realtime API competes directly with ElevenLabs on voice quality and latency", delta: -5 },
      { date: "2025-06", text: "ElevenLabs voice quality still meaningfully ahead of multimodal alternatives", delta: +4 },
      { date: "2025-02", text: "GPT-4o voice and image generation improving rapidly; quality gap narrowing", delta: -5 },
      { date: "2025-01", text: "Enterprise customers prefer specialized APIs for production voice/image workloads", delta: +3 },
    ],
    tags: ["modality-models", "multimodal", "specialization"],
  },
  {
    id: 111, type: "sector", sector: "Non-Core Foundation Models", sectorExamples: "ElevenLabs, Black Forest Labs",
    question: "Can specialized model companies build defensible application-layer businesses, or are they commodity API providers on borrowed time?",
    outcomeA: { label: "Platform escape", description: "ElevenLabs becomes the voice platform, BFL the visual creation platform, owning workflows and customer relationships." },
    outcomeB: { label: "API commodity", description: "They remain API providers accessed through other apps; as multimodal improves, customers switch to the cheaper integrated option." },
    probabilityA: 35, importance: 8.0, timeHorizon: "2-4 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 38 }, { week: "2026-W09", probabilityA: 35 }],
    rationale: "ElevenLabs is making the most credible platform escape attempt: ElevenAgents for multimodal conversational AI, plus image and video generation alongside dubbing and voice design studio. But BFL's Flux 1.1 being integrated into Adobe Firefly as an interchangeable commodity model is the cautionary tale—when you're accessed through someone else's front-end, you're a commodity. The majority of ElevenLabs revenue still comes through API integrations, suggesting the platform transition is incomplete.",
    signals: [
      { date: "2026-03", text: "Anthropic integrating voice directly into Claude Code reduces standalone voice API differentiation, pressuring specialized voice model providers.", delta: -3 },
      { date: "2026-01", text: "ElevenLabs launches ElevenAgents—moving beyond API into full platform", delta: +5 },
      { date: "2025-12", text: "ElevenLabs adds image and video generation capabilities", delta: +4 },
      { date: "2025-10", text: "BFL Flux 1.1 integrated into Adobe Firefly as interchangeable commodity model", delta: -4 },
      { date: "2025-06", text: "Majority of ElevenLabs revenue still comes through API integrations", delta: -3 },
      { date: "2025-02", text: "ElevenLabs launches dubbing and voice design studio; moving beyond API", delta: +5 },
      { date: "2024-12", text: "BFL image generation accessed primarily via Midjourney and other front-ends", delta: -4 },
    ],
    tags: ["modality-models", "platform", "api"],
  },
  {
    id: 112, type: "sector", sector: "Data Storage", sectorExamples: "VAST Data",
    question: "Does AI create a genuine step-change in enterprise storage demand, or does data efficiency mean AI needs less storage than projected?",
    outcomeA: { label: "Step-change demand", description: "AI workloads require orders of magnitude more high-performance storage (training data, embeddings, inference logs, multimodal corpora); storage TAM expands dramatically." },
    outcomeB: { label: "Efficiency prevails", description: "Synthetic data, compression, and smaller models mean the storage explosion doesn't materialize; growth is incremental." },
    probabilityA: 66, importance: 8.0, timeHorizon: "2-4 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 62 }, { week: "2026-W09", probabilityA: 66 }],
    rationale: "Hyperscalers spending $700B with 75% ($450B) on AI infrastructure strongly implies massive storage demand. Databricks acquiring Neon for $1B to build its storage layer confirms data platforms see storage as strategic. Enterprise AI data volumes growing 3-5x annually and multimodal AI driving unstructured data explosion reinforce the step-change thesis. Efficient training methods provide some offset but don't compensate for the proliferation of applications, inference logs, and multimodal corpora.",
    signals: [
      { date: "2025-08", text: "HBM scaling roadmap with KVCache offload and disaggregated prefill/decode architectures suggests AI inference creates substantial new memory and storage demand.", delta: 4 },
      { date: "2026-02", text: "Hyperscalers spending $700B; 75% ($450B) directly on AI infrastructure", delta: +5 },
      { date: "2025-12", text: "Databricks acquired Neon for $1B to build its data storage layer", delta: +4 },
      { date: "2025-06", text: "Enterprise AI data volumes growing 3-5x annually; storage budgets expanding", delta: +5 },
      { date: "2025-01", text: "DeepSeek and efficient training methods reduce data requirements for competitive models", delta: -4 },
      { date: "2024-12", text: "Multimodal AI driving massive increase in unstructured data storage needs", delta: +3 },
    ],
    tags: ["storage", "data", "infrastructure"],
  },
  {
    id: 113, type: "sector", sector: "Data Storage", sectorExamples: "VAST Data",
    question: "Will AI processing move to the edge and on-device, reducing the need for centralized high-performance storage?",
    outcomeA: { label: "Centralized persists", description: "AI training and enterprise inference stay centralized in cloud and on-prem data centers; high-performance storage demand grows." },
    outcomeB: { label: "Processing distributes", description: "Inference moves to edge and on-device; centralized storage requirements grow more slowly than projected." },
    probabilityA: 65, importance: 7.5, timeHorizon: "3-5 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 65 }],
    rationale: "Enterprise AI workloads remain overwhelmingly centralized, and complex agentic workflows require centralized compute and data access. Apple and Qualcomm ship capable on-device AI, but edge inference is limited to simple, latency-sensitive tasks. The trend toward more complex agent workflows that coordinate across systems and data sources structurally favors centralized infrastructure for the foreseeable future.",
    signals: [
      { date: "2026-02", text: "Complex agentic workflows require centralized compute and coordinated data access", delta: +4 },
      { date: "2025-12", text: "Enterprise AI workloads remain overwhelmingly centralized", delta: +4 },
      { date: "2025-06", text: "Apple, Qualcomm shipping on-device AI but limited to simple tasks", delta: -3 },
      { date: "2025-02", text: "Apple, Qualcomm shipping increasingly capable on-device AI; some inference moving to edge", delta: -3 },
      { date: "2025-01", text: "Enterprise AI workloads remain overwhelmingly centralized; edge AI limited to simple tasks", delta: +4 },
      { date: "2024-12", text: "Complex agentic workflows require centralized compute and data access", delta: +3 },
    ],
    tags: ["storage", "edge", "centralization"],
  },
  {
    id: 114, type: "sector", sector: "Design Software", sectorExamples: "Figma, Canva",
    question: "Does AI commoditize the design process itself, making dedicated design tools unnecessary for the majority of use cases?",
    outcomeA: { label: "Design tools thrive", description: "AI democratizes design and expands the user base from 30M professionals to hundreds of millions; the tool is the platform, AI is the feature." },
    outcomeB: { label: "Design tools collapse", description: "AI generates production-quality designs from text prompts without a dedicated tool; users go directly from prompt to output." },
    probabilityA: 58, importance: 8.0, timeHorizon: "2-4 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 58 }],
    rationale: "Design tools are thriving in the AI era. Canva revenue reached $4B in 2025 with 230M users. Figma hit $1.06B revenue (+41% YoY), 13M MAU, and went public—its 250% IPO pop created a $200B valuation roadmap for Canva. Figma Make is used weekly by 30% of enterprise customers spending $100K+. But OpenAI adding Canva and Figma integrations to ChatGPT could shift the interface layer. The current trajectory: AI is expanding the design user base, not replacing the tools.",
    signals: [
      { date: "2026-01", text: "Figma Make (AI design tool) used weekly by 30% of enterprise customers spending >$100K", delta: +5 },
      { date: "2025-12", text: "Canva revenue reached $4B in 2025 driven by AI tools; 230M users", delta: +6 },
      { date: "2025-12", text: "Figma full-year revenue $1.06B, up 41% YoY; 13M MAU, 95% of Fortune 500", delta: +5 },
      { date: "2025-12", text: "Figma IPO with 250% pop; Canva IPO expected 2026 at potentially $200B+", delta: +5 },
      { date: "2025-10", text: "OpenAI added integration with Canva and Figma in ChatGPT", delta: -3 },
      { date: "2025-06", text: "Figma partners with Google Gemini 2.5 Flash and Imagen 4 for AI features", delta: +4 },
      { date: "2025-02", text: "Canva reports record user growth driven by AI-powered design features", delta: +5 },
      { date: "2025-01", text: "AI design generators increasingly used for production marketing assets", delta: -4 },
    ],
    tags: ["design", "commoditization", "creative-tools"],
  },
  {
    id: 115, type: "sector", sector: "GPU Clouds", sectorExamples: "CoreWeave, Crusoe",
    question: "Will inference demand grow large and diverse enough to give GPU clouds a durable business beyond training contracts?",
    outcomeA: { label: "Inference sustains", description: "Inference becomes 80%+ of GPU cloud revenue; demand is diversified across thousands of customers and resilient." },
    outcomeB: { label: "Inference disappoints", description: "Enterprises run inference on cheaper hardware or at hyperscalers; GPU clouds remain dependent on lumpy training contracts from a handful of frontier labs." },
    probabilityA: 54, importance: 8.5, timeHorizon: "2-4 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 50 }, { week: "2026-W09", probabilityA: 54 }],
    rationale: "CoreWeave's Q4 2025 revenue hit $1.6B (+110% YoY), and NVIDIA invested $2B to expand its infrastructure—strong validation of the GPU cloud model. Stock surged 359% in three months post-IPO. H100 pricing remained stable with robust inference demand. But CoreWeave is still heavily concentrated in a few large customers, and AWS/Azure offer aggressive inference pricing that pulls enterprise workloads. The diversification story is progressing but incomplete.",
    signals: [
      { date: "2026-02", text: "Billion-dollar infrastructure projects spanning multiple hyperscalers signal continued large-scale investment in compute capacity supporting both training and inference demand.", delta: 3 },
      { date: "2026-02", text: "OpenAI's custom chip deployment for inference on Codex-Spark achieves 15x speed improvement, indicating inference demand is scaling and driving silicon investment beyond training-only use cases.", delta: 4 },
      { date: "2025-09", text: "Nvidia Rubin CPX is described as a game changer for inference with heavy emphasis on compute FLOPS, signaling growing inference-specific hardware demand beyond training.", delta: 6 },
      { date: "2025-09", text: "xAI's Colossus 2 gigawatt datacenter build underscores sustained demand for large-scale GPU clusters beyond training, supporting durable GPU cloud business cases.", delta: 4 },
      { date: "2026-03", text: "Nvidia's $4B photonics investment targets data center interconnect efficiency, supporting sustained high-throughput inference workloads at scale rather than purely training.", delta: 2 },
      { date: "2026-02", text: "CoreWeave Q4 2025 revenue reached $1.6B, up 110% year-over-year", delta: +6 },
      { date: "2026-01", text: "NVIDIA invests $2B in CoreWeave to expand AI infrastructure to 5GW by 2030", delta: +5 },
      { date: "2025-12", text: "H100 pricing remained within 10% of start-of-year levels; robust inference demand", delta: +4 },
      { date: "2025-06", text: "CoreWeave stock surged 359% in three months post-IPO to $183.58", delta: +4 },
      { date: "2025-06", text: "CoreWeave reports growing inference customer base outside frontier labs", delta: +4 },
      { date: "2025-01", text: "AWS, Azure offering aggressive inference pricing; pulling enterprise workloads", delta: -5 },
      { date: "2024-12", text: "AI agent deployment driving significant new inference demand", delta: +3 },
    ],
    tags: ["gpu-cloud", "inference", "training"],
  },
  {
    id: 116, type: "sector", sector: "GPU Clouds", sectorExamples: "CoreWeave, Crusoe",
    question: "Will hyperscalers squeeze independent GPU clouds to unsustainable margins as GPU supply normalizes?",
    outcomeA: { label: "Independents survive", description: "Specialization and flexibility sustain differentiation and healthy margins even post-shortage." },
    outcomeB: { label: "Commodity squeeze", description: "Once scarcity ends, hyperscaler cost advantages and bundling collapse independent GPU cloud margins to unsustainable levels." },
    probabilityA: 44, importance: 9.0, timeHorizon: "2-3 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 40 }, { week: "2026-W09", probabilityA: 44 }],
    rationale: "CoreWeave's $1.6B Q4 revenue validates the model in the current market, and NVIDIA's $2B investment provides a strategic backstop. But CoreWeave's stock is 51% below its ATH, reflecting market skepticism about durability. The company is increasingly reliant on debt financing, and NVIDIA's support may indicate the ecosystem requires external propping up. As GPU scarcity eases with Blackwell ramping, hyperscaler pricing pressure will intensify. The critical question is whether CoreWeave can diversify before the supply/demand dynamics shift against it.",
    signals: [
      { date: "2025-09", text: "AWS is aggressively expanding proprietary Trainium XPU capacity alongside Anthropic, increasing hyperscaler vertical integration that could squeeze independent GPU clouds.", delta: 4 },
      { date: "2026-02", text: "CoreWeave Q4 revenue $1.6B; validates independent GPU cloud model at scale", delta: +5 },
      { date: "2026-02", text: "CoreWeave stock 51% below ATH ($89 vs $183); market skepticism on durability", delta: -3 },
      { date: "2026-01", text: "NVIDIA backstops CoreWeave with $2B investment—may signal ecosystem needs support", delta: +4 },
      { date: "2025-12", text: "CoreWeave increasingly reliant on debt financing for expansion", delta: -4 },
      { date: "2025-06", text: "NVIDIA production ramp accelerating; GPU scarcity easing", delta: -5 },
      { date: "2025-03", text: "CoreWeave IPO at $40/share; market validates independent GPU cloud model", delta: +4 },
      { date: "2024-12", text: "Hyperscalers offering increasingly competitive GPU instance pricing", delta: -3 },
    ],
    tags: ["gpu-cloud", "hyperscalers", "margins"],
  },
  {
    id: 117, type: "sector", sector: "GPU Clouds", sectorExamples: "CoreWeave, Crusoe",
    question: "Will a GPU oversupply event within 24 months collapse pricing and margins?",
    outcomeA: { label: "Shortage persists", description: "Demand growth from inference at scale outpaces supply expansion; pricing power remains strong through 2027." },
    outcomeB: { label: "Oversupply hits", description: "Supply expansion and efficiency breakthroughs create oversupply; pricing drops 50%+, margins evaporate." },
    probabilityA: 43, importance: 9.0, timeHorizon: "1-2 years",
    probabilityHistory: [{ week: "2025-W10", probabilityA: 45 }, { week: "2026-W09", probabilityA: 43 }],
    rationale: "CoreWeave's $1.6B Q4 revenue (+110% YoY) and H100 pricing stability suggest demand is keeping pace with supply for now. NVIDIA is investing $2B in CoreWeave and planning Rubin/Vera chips for 2026. But NVIDIA Blackwell production is ramping faster than expected, and DeepSeek efficiency gains demonstrate that less compute is needed per unit of intelligence. The balance is precarious—inference demand from agent deployment is growing, but may not be sufficient to absorb rapidly expanding supply if efficiency improvements accelerate.",
    signals: [
      { date: "2025-09", text: "Nvidia's Rubin CPX specialized accelerator launch suggests continued GPU product differentiation and cadence, reducing near-term oversupply risk from commodity GPU homogenization.", delta: -3 },
      { date: "2026-02", text: "Nvidia's $100B OpenAI investment collapse signals potential softening in AI infrastructure mega-deal momentum, a leading indicator of supply/demand recalibration.", delta: -2 },
      { date: "2026-02", text: "CoreWeave Q4 revenue up 110% YoY to $1.6B suggests strong ongoing demand", delta: +4 },
      { date: "2026-01", text: "NVIDIA plans Rubin, Vera CPU, and BlueField storage for 2026 market", delta: -3 },
      { date: "2025-12", text: "H100 pricing remained stable; inference demand robust", delta: +3 },
      { date: "2025-12", text: "Inference demand from AI agent deployment growing faster than training demand", delta: +4 },
      { date: "2025-06", text: "CoreWeave stock surged 359% post-IPO suggesting market sees sustained demand", delta: +3 },
      { date: "2025-01", text: "DeepSeek efficiency gains suggest less compute needed per unit of intelligence", delta: -5 },
      { date: "2025-01", text: "NVIDIA Blackwell production ramping faster than expected", delta: -4 },
    ],
    tags: ["gpu-cloud", "supply-demand", "pricing"],
  },
];

const ALL_QUESTIONS = [...CORE_QUESTIONS, ...SECTOR_QUESTIONS];

const INITIAL_TODOS = [
  { id: 1, text: "Buy ubiquinol", done: false },
  { id: 2, text: "Message Juan", done: false },
];

function WeeklyChart({ history }) {
  if (!history || history.length < 2) {
    return (
      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#aaa", fontStyle: "italic" }}>
        No weekly history yet
      </div>
    );
  }
  const w = 120, h = 32, pad = 4;
  const values = history.map(h => h.probabilityA);
  const minV = Math.min(...values) - 2;
  const maxV = Math.max(...values) + 2;
  const range = maxV - minV || 1;
  const pathD = values.map((v, i) => {
    const px = pad + (i / Math.max(values.length - 1, 1)) * (w - 2 * pad);
    const py = h - pad - ((v - minV) / range) * (h - 2 * pad);
    return `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(" ");
  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  const delta = last - prev;
  const color = delta >= 0 ? "#16a34a" : "#dc2626";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width={w} height={h} style={{ display: "block" }}>
        <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        {values.map((v, i) => {
          const px = pad + (i / Math.max(values.length - 1, 1)) * (w - 2 * pad);
          const py = h - pad - ((v - minV) / range) * (h - 2 * pad);
          return <circle key={i} cx={px} cy={py} r={2} fill={color} />;
        })}
      </svg>
      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color, fontWeight: 600 }}>
        {delta > 0 ? "+" : ""}{delta}
      </span>
    </div>
  );
}

function SignalRow({ signal }) {
  const pos = signal.delta > 0;
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "7px 0", borderBottom: "1px solid #eee" }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "#999", minWidth: 52, flexShrink: 0, paddingTop: 1 }}>{signal.date}</span>
      <span style={{ fontSize: 12.5, color: "#555", lineHeight: 1.5, flex: 1, fontFamily: "var(--serif)" }}>{signal.text}</span>
      <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: pos ? "#16a34a" : "#dc2626", minWidth: 28, textAlign: "right", flexShrink: 0, fontWeight: 600 }}>
        {pos ? "+" : ""}{signal.delta}
      </span>
    </div>
  );
}

function OutcomeBlock({ label, description, probability, side }) {
  const isA = side === "A";
  const color = isA ? "#16a34a" : "#dc2626";
  const bgColor = isA ? "#f0fdf4" : "#fef2f2";
  return (
    <div style={{ flex: 1, padding: "14px 16px", background: bgColor, borderRadius: 4, borderWidth: 1, borderStyle: "solid", borderColor: isA ? "#dcfce7" : "#fecaca" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 8.5, color, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
          {label}
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>
          {probability}%
        </div>
      </div>
      <p style={{ fontSize: 12, color: "#666", lineHeight: 1.55, margin: 0, fontFamily: "var(--serif)" }}>{description}</p>
    </div>
  );
}

function QuestionCard({ q, isExpanded, onToggle }) {
  const netDelta = q.signals.reduce((s, sig) => s + sig.delta, 0);
  const spread = q.probabilityA - (100 - q.probabilityA);
  const spreadLabel = spread === 0 ? "Even" : (spread > 0 ? `+${spread}` : `${spread}`);
  const displayCategory = q.type === "core" ? q.category : q.sector;

  return (
    <div style={{
      background: "#fff",
      borderTop: "1px solid #e5e5e5",
      borderRight: "1px solid #e5e5e5",
      borderBottom: "1px solid #e5e5e5",
      borderLeft: "1px solid #e5e5e5",
      borderRadius: 6,
      marginBottom: 12,
      transition: "all 0.2s",
      boxShadow: isExpanded ? "0 2px 12px rgba(0,0,0,0.06)" : "0 1px 3px rgba(0,0,0,0.03)",
    }}>
      <div style={{ padding: "16px 20px", cursor: "pointer" }} onClick={onToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "var(--mono)", fontSize: 8.5,
            color: q.type === "core" ? "#92400e" : "#1e40af",
            textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600,
            background: q.type === "core" ? "#fef3c7" : "#dbeafe",
            padding: "2px 8px", borderRadius: 3,
          }}>{displayCategory}</span>
          {q.type === "sector" && q.sectorExamples && (
            <span style={{ fontFamily: "var(--mono)", fontSize: 8.5, color: "#aaa" }}>{q.sectorExamples}</span>
          )}
          <span style={{ fontFamily: "var(--mono)", fontSize: 8.5, color: "#bbb" }}>{q.timeHorizon}</span>
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 500, color: "#1a1a1a", lineHeight: 1.45, margin: "0 0 14px 0", fontFamily: "var(--serif)" }}>{q.question}</h3>

        <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
          <OutcomeBlock label={q.outcomeA.label} description={q.outcomeA.description} probability={q.probabilityA} side="A" />
          <OutcomeBlock label={q.outcomeB.label} description={q.outcomeB.description} probability={100 - q.probabilityA} side="B" />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: spread > 0 ? "#16a34a" : spread < 0 ? "#dc2626" : "#888" }}>
              Spread: {spreadLabel}
            </div>
            <WeeklyChart history={q.probabilityHistory} />
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#bbb" }}>
            {isExpanded ? "Collapse" : "View signals"}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div style={{ borderTop: "1px solid #e5e5e5", padding: "16px 20px 18px" }} onClick={e => e.stopPropagation()}>
          {q.rationale && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 8.5, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontWeight: 600 }}>
                Summary
              </div>
              <p style={{ fontSize: 13, color: "#444", lineHeight: 1.65, margin: 0, fontFamily: "var(--serif)" }}>
                {q.rationale}
              </p>
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 8.5, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontWeight: 600 }}>
              Recent Signals <span style={{ color: netDelta >= 0 ? "#16a34a" : "#dc2626" }}>(net {netDelta >= 0 ? "+" : ""}{netDelta})</span>
            </div>
            {q.signals.map((s, i) => <SignalRow key={i} signal={s} />)}
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {q.tags.map(t => (
              <span key={t} style={{ fontFamily: "var(--mono)", fontSize: 8.5, color: "#999", borderWidth: 1, borderStyle: "solid", borderColor: "#e5e5e5", padding: "2px 7px", borderRadius: 3, background: "#fafafa" }}>#{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <h2 style={{
      fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: "#999",
      textTransform: "uppercase", letterSpacing: "0.14em",
      margin: "36px 0 16px", paddingBottom: 10,
      borderBottom: "2px solid #e5e5e5",
    }}>{title}</h2>
  );
}

function TodoSection({ todos, onToggle }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e5e5", borderRadius: 6,
      padding: "16px 20px", marginBottom: 24,
    }}>
      {todos.map(todo => (
        <div key={todo.id} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
          borderBottom: "1px solid #f0f0f0",
        }}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => onToggle(todo.id)}
            style={{ accentColor: "#b8860b", width: 16, height: 16, cursor: "pointer" }}
          />
          <span style={{
            fontFamily: "var(--serif)", fontSize: 15,
            textDecoration: todo.done ? "line-through" : "none",
            color: todo.done ? "#aaa" : "#1a1a1a",
          }}>
            {todo.text}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AIThesisTracker() {
  const [questions] = useState(ALL_QUESTIONS);
  const [expandedId, setExpandedId] = useState(null);
  const [todos, setTodos] = useState(INITIAL_TODOS);

  const coreQuestions = useMemo(() => questions.filter(q => q.type === "core"), [questions]);
  const sectorQuestions = useMemo(() => questions.filter(q => q.type === "sector"), [questions]);
  const totalSignals = questions.reduce((s, q) => s + q.signals.length, 0);

  return (
    <div style={{
      "--mono": "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      "--serif": "'Newsreader', 'Georgia', 'Times New Roman', serif",
      minHeight: "100vh", background: "#f9f9f9", color: "#1a1a1a", fontFamily: "var(--serif)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,300;1,6..72,400&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px 60px" }}>
        <header style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 8.5, color: "#b8860b", textTransform: "uppercase", letterSpacing: "0.22em", marginBottom: 12 }}>
            AI Investment Thesis Tracker
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 300, margin: 0, lineHeight: 1.3, color: "#1a1a1a", letterSpacing: "-0.01em" }}>
            Open Questions Defining Artea's<br />Current & Future Investible Universe
          </h1>
        </header>

        <SectionHeader title="To-Do" />
        <TodoSection todos={todos} onToggle={(id) =>
          setTodos(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
        } />

        <SectionHeader title="Core Questions" />
        {coreQuestions.map(q => (
          <QuestionCard key={q.id} q={q} isExpanded={expandedId === q.id}
            onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)} />
        ))}

        <SectionHeader title="Sector-Specific Questions" />
        {sectorQuestions.map(q => (
          <QuestionCard key={q.id} q={q} isExpanded={expandedId === q.id}
            onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)} />
        ))}

        <footer style={{ marginTop: 40, paddingTop: 14, borderTop: "1px solid #e5e5e5", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "#ccc", letterSpacing: "0.06em" }}>
            {questions.length} questions · {totalSignals} signals
          </div>
        </footer>
      </div>
    </div>
  );
}
