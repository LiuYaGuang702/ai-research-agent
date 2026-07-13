"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/prototype/NavBar";

const papers = [
  { id: 1, title: "Large Language Models for Code Generation: A Survey", authors: "Zhang, Y. et al.", year: 2025, journal: "ACM Computing Surveys", innovation: "首次系统性地综述了LLM在代码生成领域的方法分类体系，提出六维评估框架", conclusion: "检索增强和迭代优化是未来两大核心方向，跨语言泛化是最大挑战", keywords: ["Survey", "Code Generation", "LLM"] },
  { id: 2, title: "Self-Refine: Iterative Refinement with LLMs for Code Synthesis", authors: "Madaan, A. et al.", year: 2024, journal: "NeurIPS 2024", innovation: "提出SELF-REFINE迭代自反馈机制，首次实现无需外部监督的代码自改进", conclusion: "在HumanEval上提升15%，证明LLM可通过自反馈持续改进代码质量", keywords: ["Self-Refine", "Iterative", "Feedback"] },
  { id: 3, title: "CodeLlama: Open Foundation Models for Code", authors: "Roziere, B. et al.", year: 2024, journal: "Meta AI", innovation: "发布开源代码大模型Code Llama系列，支持代码补全、填空和指令跟随", conclusion: "在HumanEval和MBPP上达到当时开源SOTA，代码补全准确率67.8%", keywords: ["CodeLlama", "Open Source", "Foundation Model"] },
  { id: 4, title: "Improving Code Generation with Retrieval-Augmented Prompting", authors: "Liu, H. et al.", year: 2025, journal: "ICML 2025", innovation: "首次将检索增强生成(RAG)应用于代码生成提示工程，动态注入相关代码片段", conclusion: "在复杂API调用场景下提升23%，检索增强对长尾API尤为有效", keywords: ["RAG", "Prompting", "API"] },
  { id: 5, title: "Repository-Level Code Generation with Context-Aware LLMs", authors: "Shi, J. et al.", year: 2025, journal: "ACL 2025", innovation: "提出跨文件上下文感知方法，首次实现仓库级代码生成的实用化", conclusion: "在50个真实仓库上测试，生成代码可编译率从43%提升至71%", keywords: ["Repository", "Context", "Cross-file"] },
  { id: 6, title: "Evaluating LLMs for Test Case Generation", authors: "Chen, B. et al.", year: 2025, journal: "IEEE TSE", innovation: "构建首个LLM测试生成评估基准TestGenBench，覆盖7种语言8种测试类型", conclusion: "GPT-4在单元测试生成上覆盖率最高(82%)，但在集成测试上仅达51%", keywords: ["Testing", "Benchmark", "Evaluation"] },
];

const clusterTags = [
  { name: "基础模型与方法", color: "from-violet-400 to-indigo-400", papers: [1, 3] },
  { name: "迭代优化", color: "from-cyan-400 to-teal-400", papers: [2] },
  { name: "检索增强", color: "from-amber-400 to-orange-400", papers: [4] },
  { name: "上下文扩展", color: "from-rose-400 to-pink-400", papers: [5] },
  { name: "评估与测试", color: "from-emerald-400 to-green-400", papers: [6] },
];

const dynamicOutline = {
  title: "基于大语言模型的代码生成技术研究综述",
  generatedAt: "2026-07-13",
  sections: [
    { title: "1. 引言", subs: ["研究背景与动机", "代码自动化的历史演进", "LLM时代的范式转换", "本文组织结构"] },
    { title: "2. 基础模型与方法", subs: ["代码语言模型架构", "CodeLlama等开源模型", "预训练与微调策略", "多语言支持能力"], cluster: "基础模型与方法" },
    { title: "3. 迭代优化技术", subs: ["Self-Refine自反馈机制", "多轮改进策略", "执行反馈驱动", "收敛性分析"], cluster: "迭代优化" },
    { title: "4. 检索增强方法", subs: ["RAG在代码生成中的应用", "动态注入策略", "API调用场景优化", "长尾分布处理"], cluster: "检索增强" },
    { title: "5. 仓库级代码生成", subs: ["跨文件上下文建模", "依赖关系图分析", "增量生成策略", "可编译性优化"], cluster: "上下文扩展" },
    { title: "6. 评估方法与基准", subs: ["HumanEval与MBPP", "TestGenBench评估框架", "覆盖率vs正确性", "集成测试挑战"], cluster: "评估与测试" },
    { title: "7. 挑战与展望", subs: ["跨语言泛化", "代码安全与可靠性", "推理成本优化", "人机协作新范式"] },
  ]
};

const draftContent: Record<string, string> = {
  "1": "近年来，大语言模型在自然语言处理领域的突破性进展，推动了代码生成技术的快速发展。传统代码自动生成方法依赖模板匹配和规则系统，局限性明显。以GPT-4、CodeLlama为代表的大模型通过海量代码-文本对预训练，展现出强大的代码理解和生成能力，成为软件工程领域的研究热点。",
  "2": "本章对现有代码生成大模型进行了系统性梳理。CodeLlama系列作为代表性开源模型，采用Transformer架构并在代码语料上进行专门预训练，在HumanEval基准上达到了67.8%的准确率。研究进一步表明，针对特定编程语言的微调策略能够显著提升模型在目标语言上的表现，多语言联合训练则有助于提升跨语言泛化能力。",
  "3": "迭代优化是提升代码生成质量的核心技术。Madaan等人提出的SELF-REFINE框架通过自我反馈机制实现了无需外部监督的代码迭代改进，在HumanEval上提升了15%的性能。该方法的核心在于将代码执行结果（如错误信息、测试通过率）作为反馈信号，引导模型进行定向修正。",
  "4": "检索增强生成(RAG)技术为代码生成带来了新思路。Liu等人首次将RAG应用于代码生成提示工程，通过动态检索相关代码片段注入提示，在复杂API调用场景下取得了23%的性能提升。这一方法对长尾API尤为有效，为解决LLM对罕见API的知识盲区提供了可行路径。",
  "5": "仓库级代码生成是当前研究的前沿方向。Shi等人提出的跨文件上下文感知方法利用依赖关系图进行全局建模，使生成代码的可编译率从43%提升至71%。增量生成策略在保持代码一致性的同时降低了计算开销，为大规模代码库的自动化维护奠定了基础。",
  "6": "本章对现有评估体系进行了全面分析。HumanEval和MBPP作为主流基准，主要评估函数级代码生成的正确性。Chen等人提出的TestGenBench首次系统性地覆盖了单元测试、集成测试等多种测试类型的生成评估，揭示了大模型在不同测试场景下的能力差异。",
  "7": "尽管取得了显著进展，代码生成技术仍面临多重挑战。跨语言泛化需要更有效的表示学习方法；代码安全与可靠性需要在生成过程中引入形式化验证；推理成本的优化是实际部署的关键瓶颈；人机协作新范式的探索则代表了该领域的长期发展方向。",
};

type Tab = "extract" | "summarize" | "outline" | "draft";

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState<Tab>("extract");
  const [showDraft, setShowDraft] = useState(false);
  const [summariesGenerated, setSummariesGenerated] = useState(false);
  const [selectedPapers, setSelectedPapers] = useState<Set<number>>(new Set(papers.map(p => p.id)));

  const togglePaper = (id: number) => {
    const next = new Set(selectedPapers);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedPapers(next);
  };

  const tabs: { key: Tab; label: string; icon: string; desc: string }[] = [
    { key: "extract", label: "信息抽取", icon: "📋", desc: "从文献中自动提取标题、作者、摘要、创新点、结论等核心信息" },
    { key: "summarize", label: "批量摘要整理", icon: "📝", desc: "将多篇文献的关键信息汇总为结构化摘要整理稿" },
    { key: "outline", label: "综述大纲", icon: "📑", desc: "基于提取的创新点与结论，智能生成文献综述大纲结构" },
    { key: "draft", label: "初稿框架", icon: "📄", desc: "根据大纲自动填充各章节内容框架，形成综述初稿" },
  ];

  return (
    <div className="min-h-screen bg-[#0C111F]">
      <NavBar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-xl">📖</div>
              <h1 className="text-3xl font-bold text-white">文献综述生成</h1>
              <span className="px-2.5 py-0.5 bg-violet-400/10 border border-violet-400/20 rounded-full text-xs text-violet-400">4 步流程</span>
            </div>
            <p className="text-gray-400 max-w-2xl">基于通用智能体结构化逻辑，自动完成文献信息抽取、摘要整理、大纲生成与初稿框架填充，大幅提升文献综述撰写效率</p>
          </motion.div>

          {/* Progress Indicator */}
          <div className="mb-8 grid grid-cols-4 gap-3">
            {tabs.map((tab, i) => {
              const isActive = activeTab === tab.key;
              const isDone = (tab.key === "extract" && activeTab !== "extract") || 
                ((tab.key === "extract" || tab.key === "summarize") && (activeTab === "outline" || activeTab === "draft")) ||
                ((tab.key === "extract" || tab.key === "summarize" || tab.key === "outline") && activeTab === "draft");
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={"relative p-3 rounded-xl text-left transition-all " + (isActive ? "bg-white/[0.08] border-white/[0.12]" : "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]") + " border"}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={"w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold " + (isDone ? "bg-emerald-400/20 text-emerald-400" : isActive ? "bg-violet-400/20 text-violet-400" : "bg-white/[0.06] text-gray-500")}>
                      {isDone ? "✓" : i + 1}
                    </span>
                    <span className={"text-sm font-medium " + (isActive ? "text-white" : "text-gray-500")}>{tab.label}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 pl-8 leading-tight">{tab.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* Tab 1: 信息抽取 */}
            {activeTab === "extract" && (
              <motion.div key="extract" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] overflow-hidden">
                  <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">文献核心信息抽取</h2>
                      <p className="text-gray-500 text-sm mt-0.5">已加载 {papers.length} 篇文献，选择目标文献进行信息抽取</p>
                    </div>
                    <button onClick={() => { setActiveTab("summarize"); }} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">一键抽取全部 →</button>
                  </div>
                  <div className="p-6 space-y-3">
                    {papers.map((paper, i) => (
                      <motion.div key={paper.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className={"rounded-xl border p-5 transition-all cursor-pointer " + (selectedPapers.has(paper.id) ? "bg-white/[0.04] border-violet-400/20" : "bg-white/[0.01] border-white/[0.04] opacity-60")} onClick={() => togglePaper(paper.id)}>
                        <div className="flex items-start gap-4">
                          <div className={"mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all " + (selectedPapers.has(paper.id) ? "bg-violet-400 border-violet-400" : "border-gray-600")}>
                            {selectedPapers.has(paper.id) && <span className="text-white text-[10px]">✓</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded-md text-gray-400">#{paper.id}</span>
                              <span className="text-xs text-gray-600">{paper.year} · {paper.journal}</span>
                            </div>
                            <h3 className="text-white font-medium leading-snug mb-2">{paper.title}</h3>
                            <p className="text-gray-500 text-sm mb-1">作者: {paper.authors}</p>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div className="bg-[#0C111F]/60 rounded-lg p-3 border border-white/[0.04]">
                                <span className="text-[10px] text-violet-400 font-medium uppercase tracking-wider">创新点</span>
                                <p className="text-gray-300 text-sm mt-1 leading-relaxed">{paper.innovation}</p>
                              </div>
                              <div className="bg-[#0C111F]/60 rounded-lg p-3 border border-white/[0.04]">
                                <span className="text-[10px] text-cyan-400 font-medium uppercase tracking-wider">结论</span>
                                <p className="text-gray-300 text-sm mt-1 leading-relaxed">{paper.conclusion}</p>
                              </div>
                            </div>
                            <div className="flex gap-1.5 mt-2.5">
                              {paper.keywords.map(kw => (
                                <span key={kw} className="text-[10px] px-2 py-0.5 bg-gray-400/5 border border-white/[0.04] rounded-full text-gray-500">{kw}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: 批量摘要整理 */}
            {activeTab === "summarize" && (
              <motion.div key="summarize" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] overflow-hidden">
                  <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">批量摘要整理稿</h2>
                      <p className="text-gray-500 text-sm mt-0.5">将 {selectedPapers.size} 篇文献的关键信息汇总为结构化摘要</p>
                    </div>
                    <button onClick={() => { setSummariesGenerated(true); }} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">生成整理稿</button>
                  </div>
                  <div className="p-6">
                    {!summariesGenerated ? (
                      <div className="rounded-2xl bg-[#0C111F]/60 border border-white/[0.04] p-12 text-center">
                        <div className="text-5xl mb-4">📝</div>
                        <h3 className="text-white font-semibold text-lg mb-2">点击生成批量摘要整理稿</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">AI 将自动提取已选文献的核心信息，按聚类主题分组整理，生成结构化摘要文档</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-[#0C111F]/60 rounded-xl border border-white/[0.04] p-4 text-center">
                            <div className="text-2xl font-bold text-violet-400">{selectedPapers.size}</div>
                            <div className="text-gray-500 text-xs mt-1">文献总数</div>
                          </div>
                          <div className="bg-[#0C111F]/60 rounded-xl border border-white/[0.04] p-4 text-center">
                            <div className="text-2xl font-bold text-cyan-400">{clusterTags.length}</div>
                            <div className="text-gray-500 text-xs mt-1">聚类主题</div>
                          </div>
                          <div className="bg-[#0C111F]/60 rounded-xl border border-white/[0.04] p-4 text-center">
                            <div className="text-2xl font-bold text-emerald-400">~4,200</div>
                            <div className="text-gray-500 text-xs mt-1">总字数</div>
                          </div>
                        </div>
                        {clusterTags.map(cluster => {
                          const clusterPapers = papers.filter(p => cluster.papers.includes(p.id) && selectedPapers.has(p.id));
                          if (clusterPapers.length === 0) return null;
                          return (
                            <div key={cluster.name} className="rounded-xl bg-[#0C111F]/60 border border-white/[0.04] p-5">
                              <div className="flex items-center gap-2 mb-4">
                                <span className={"px-2.5 py-0.5 rounded-md text-xs font-medium text-white bg-gradient-to-r " + cluster.color}>{cluster.name}</span>
                                <span className="text-gray-600 text-xs">{clusterPapers.length} 篇文献</span>
                              </div>
                              {clusterPapers.map(p => (
                                <div key={p.id} className="mb-3 last:mb-0 pl-4 border-l-2 border-white/[0.06]">
                                  <h4 className="text-white text-sm font-medium">{p.title}</h4>
                                  <p className="text-gray-500 text-xs mt-0.5">{p.authors} · {p.year}</p>
                                  <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">核心贡献: {p.innovation}。{p.conclusion}</p>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                        <div className="flex gap-2">
                          <button onClick={() => setActiveTab("outline")} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm rounded-xl font-medium">下一步: 生成综述大纲 →</button>
                          <button className="px-4 py-2 bg-white/[0.04] border border-white/[0.08] text-gray-300 text-sm rounded-xl">下载整理稿</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 3: 综述大纲 */}
            {activeTab === "outline" && (
              <motion.div key="outline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] overflow-hidden">
                  <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">综述大纲生成</h2>
                      <p className="text-gray-500 text-sm mt-0.5">基于聚类主题和逻辑关系，智能生成文献综述大纲结构</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 px-3 py-1.5 bg-amber-400/5 border border-amber-400/10 rounded-lg">AI 智能编排</span>
                      <button onClick={() => setActiveTab("draft")} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm rounded-xl font-medium">确认大纲 →</button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-violet-400/5 to-purple-400/5 border border-violet-400/10">
                      <h2 className="text-2xl font-bold text-white mb-2">{dynamicOutline.title}</h2>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>📅 生成于 {dynamicOutline.generatedAt}</span>
                        <span>📚 基于 {papers.length} 篇文献</span>
                        <span>📋 {dynamicOutline.sections.length} 个章节</span>
                        <span>🔗 {clusterTags.length} 个聚类主题</span>
                      </div>
                    </div>
                    {dynamicOutline.sections.map((sec, i) => (
                      <div key={sec.title} className="mb-4 last:mb-0">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-400 text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3 className="text-white font-semibold">{sec.title}</h3>
                              {sec.cluster && (
                                <span className={"px-2 py-0.5 rounded-md text-[10px] font-medium text-white bg-gradient-to-r " + (clusterTags.find(ct => ct.name === sec.cluster)?.color || "from-gray-400 to-gray-500")}>{sec.cluster}</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {sec.subs.map(sub => (
                                <span key={sub} className="text-xs px-2.5 py-1 bg-white/[0.03] border border-white/[0.05] rounded-lg text-gray-400">{sub}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        {i < dynamicOutline.sections.length - 1 && (
                          <div className="ml-4 mt-3 mb-3 w-px h-4 bg-gradient-to-b from-violet-400/20 to-transparent" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 4: 初稿框架 */}
            {activeTab === "draft" && (
              <motion.div key="draft" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {!showDraft ? (
                  <div className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-12 text-center">
                    <div className="text-5xl mb-4">📃</div>
                    <h3 className="text-white font-semibold text-lg mb-2">基于大纲生成综述初稿</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">AI 将根据上文提取的创新点和结论，自动填充 {dynamicOutline.sections.length} 个章节的内容框架</p>
                    <button onClick={() => setShowDraft(true)} className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">生成综述初稿</button>
                    <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-600">
                      <span>📊 基于 {papers.length} 篇文献</span>
                      <span>📝 预计 ~8,500 字</span>
                      <span>🔖 含引用标注</span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-8">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.06]">
                      <div>
                        <h2 className="text-2xl font-bold text-white">{dynamicOutline.title}</h2>
                        <p className="text-gray-500 text-sm mt-1">AI 自动生成初稿 · 含 {papers.length} 篇参考文献</p>
                      </div>
                      <button className="px-4 py-2 text-sm text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-xl hover:bg-cyan-400/20 transition-all">下载完整文档</button>
                    </div>
                    {dynamicOutline.sections.map((sec, i) => {
                      const content = draftContent[String(i + 1)];
                      if (!content) return (
                        <div key={sec.title} className="mb-6">
                          <h3 className="text-lg font-semibold text-white mb-2">{sec.title}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed">{sec.subs.join("、")}等方面构成了本章节的核心讨论内容，将在完整综述中详细展开。</p>
                        </div>
                      );
                      return (
                        <div key={sec.title} className="mb-8">
                          <h3 className="text-lg font-semibold text-white mb-3">{sec.title}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed">{content}</p>
                          {sec.cluster && (
                            <div className="mt-2">
                              {clusterTags.filter(ct => ct.name === sec.cluster).map(ct => (
                                <span key={ct.name} className="text-[10px] text-gray-600">📎 引用: {ct.papers.map(pid => papers.find(p => p.id === pid)?.authors.split(",")[0].trim()).join(", ")} 等</span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-gray-500 text-sm">总字数 ~8,500 字 · 参考文献 {papers.length} 篇 · AI 生成于 {dynamicOutline.generatedAt}</span>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-lg">编辑</button>
                        <button className="px-3 py-1.5 text-xs text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-lg">导出</button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom nav */}
          <div className="mt-8 flex items-center justify-between">
            <button onClick={() => {
              const tabOrder: Tab[] = ["extract", "summarize", "outline", "draft"];
              const idx = tabOrder.indexOf(activeTab);
              if (idx > 0) setActiveTab(tabOrder[idx - 1]);
            }} disabled={activeTab === "extract"} className={"px-4 py-2 rounded-xl text-sm transition-all " + (activeTab === "extract" ? "text-gray-600 cursor-not-allowed" : "text-gray-400 bg-white/[0.04] border border-white/[0.08] hover:text-white")}>
              ← 上一步
            </button>
            <span className="text-xs text-gray-600">{activeTab === "extract" ? "①" : activeTab === "summarize" ? "②" : activeTab === "outline" ? "③" : "④"}/4</span>
            <button onClick={() => {
              const tabOrder: Tab[] = ["extract", "summarize", "outline", "draft"];
              const idx = tabOrder.indexOf(activeTab);
              if (idx < tabOrder.length - 1) setActiveTab(tabOrder[idx + 1]);
            }} disabled={activeTab === "draft"} className={"px-4 py-2 rounded-xl text-sm transition-all " + (activeTab === "draft" ? "text-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-lg hover:shadow-violet-500/25")}>
              下一步 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}