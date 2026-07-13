"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/prototype/NavBar";
import WorkflowSteps from "@/components/prototype/WorkflowSteps";

const papers = [
  { id: 1, title: "Large Language Models for Code Generation: A Survey", authors: "Zhang, Y. et al.", journal: "ACM Computing Surveys", year: 2025, citations: 342, relevance: 0.95, round: 1, abstract: "Comprehensive survey of LLMs applied to code generation, covering prompt engineering, fine-tuning and evaluation." },
  { id: 2, title: "Self-Refine: Iterative Refinement with LLMs for Code Synthesis", authors: "Madaan, A. et al.", journal: "NeurIPS 2024", year: 2024, citations: 523, relevance: 0.88, round: 2, abstract: "Iterative self-feedback mechanism enabling LLMs to improve code quality without external supervision." },
  { id: 3, title: "CodeLlama: Open Foundation Models for Code", authors: "Roziere, B. et al.", journal: "Meta AI Technical Report", year: 2024, citations: 891, relevance: 0.91, round: 1, abstract: "Code Llama family of LLMs for code based on Llama 2, supporting completion, infilling and instruction following." },
  { id: 4, title: "Repository-Level Code Generation with Context-Aware LLMs", authors: "Shi, J. et al.", journal: "ACL 2025", year: 2025, citations: 156, relevance: 0.79, round: 3, abstract: "Repository-level code generation incorporating cross-file context through novel window management." },
  { id: 5, title: "Improving Code Generation with Retrieval-Augmented Prompting", authors: "Liu, H. et al.", journal: "ICML 2025", year: 2025, citations: 187, relevance: 0.82, round: 2, abstract: "Retrieval-augmented prompting significantly improving code generation accuracy for complex APIs." },
  { id: 6, title: "Evaluating LLMs for Test Case Generation", authors: "Chen, B. et al.", journal: "IEEE TSE", year: 2025, citations: 98, relevance: 0.76, round: 3, abstract: "Empirical evaluation of LLMs on test case generation, comparing coverage and bug detection." },
];

export default function LiteraturePage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [round, setRound] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [sel, setSel] = useState<number[]>([]);
  const [filterLog, setFilterLog] = useState<string[]>([]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) { setQuery(q); handleSearch(q); }
  }, []);

  const toggle = (id: number) => setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleSearch = (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setRound(0);
    setFilterLog([]);
    setSel([]);
    // Simulate recursive search rounds
    let r = 1;
    const logs = [
      "第 1 轮：ArXiv + Semantic Scholar 并行检索，获得 127 篇候选",
      "关键词匹配 + 时间过滤 → 保留 68 篇",
      "第 2 轮：LLM 评估摘要相关性 → 保留 42 篇",
      "提取新关键词：Neural Code Synthesis, Program Repair → 增量检索 31 篇",
      "第 3 轮：LLM 深度评估全文中相关段落 → 保留 18 篇",
      "第 4 轮（收敛）：无新增高相关文献，输出最终文献池 6 篇",
    ];
    const interval = setInterval(() => {
      if (r <= 5) {
        setRound(r);
        setFilterLog(logs.slice(0, r * 2 - (r > 2 ? r - 2 : 0)));
        r++;
      } else {
        setRound(5);
        setFilterLog(logs);
        setIsSearching(false);
        clearInterval(interval);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0C111F]">
      <NavBar />
      <div className="pt-24 pb-16"><div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">文献检索与<span className="bg-gradient-to-r from-teal-200 to-cyan-300 bg-clip-text text-transparent">递归筛选</span></h1>
          <p className="text-gray-500">基于通用智能体工作流，实现多源学术文献的自动化检索与智能筛选</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl bg-[#161b2b]/80 border border-white/[0.06] p-6">
              <h2 className="text-white font-semibold mb-4">研究设定</h2>
              <div className="space-y-4">
                <div><label className="text-gray-400 text-sm block mb-1.5">研究方向 / 关键词</label><input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} className="w-full bg-[#1a1f2e] border border-white/[0.1] rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500/50" /></div>
                <div><label className="text-gray-400 text-sm block mb-1.5">期刊范围</label><select className="w-full bg-[#1a1f2e] border border-white/[0.1] rounded-xl px-4 py-3 text-white outline-none"><option>不限</option><option>CCF 推荐期刊/会议</option><option>SCI/EI 收录</option><option>顶级会议</option></select></div>
                <div><label className="text-gray-400 text-sm block mb-1.5">时间范围</label><div className="flex gap-2"><select className="flex-1 bg-[#1a1f2e] border border-white/[0.1] rounded-xl px-4 py-3 text-white">{["2024","2025","2026"].map(y=><option key={y}>{y}</option>)}</select><span className="text-gray-500 flex items-center">-</span><select className="flex-1 bg-[#1a1f2e] border border-white/[0.1] rounded-xl px-4 py-3 text-white">{["2024","2025","2026"].map(y=><option key={y}>{y}</option>)}</select></div></div>
                <button onClick={() => handleSearch()} disabled={isSearching} className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/25 transition-all disabled:opacity-50">{isSearching ? "递归筛选中..." : "开始检索"}</button>
              </div>
            </motion.div>
            {/* Filter progress log */}
            {round > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-[#161b2b]/80 border border-white/[0.06] p-5">
                <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2"><svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>递归筛选日志</h3>
                <div className="space-y-1.5">
                  {filterLog.map((log, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-2 py-1">
                      <span className={"flex-shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full "+(i < filterLog.length - 1 ? "bg-teal-400" : isSearching ? "bg-cyan-400 animate-pulse" : "bg-teal-400")} />
                      <span className="text-gray-500 text-xs">{log}</span>
                    </motion.div>
                  ))}
                </div>
                {/* Round indicators */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-gray-600 text-xs">迭代轮次:</span>
                  {[1,2,3,4,5].map(r => (
                    <div key={r} className={"w-6 h-6 rounded-lg flex items-center justify-center text-xs font-medium transition-all "+(r <= round ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" : "bg-white/[0.04] text-gray-600 border border-white/[0.06]")}>{r}</div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          <div className="lg:col-span-2">
            {round === 0 ? (
              <div className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-12 text-center"><div className="text-5xl mb-4">📚</div><h3 className="text-white font-semibold text-lg mb-2">设置检索条件开始搜索</h3><p className="text-gray-500 text-sm">支持 ArXiv、Semantic Scholar、DBLP 等多源学术数据库并行检索</p></div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2 mb-2">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">共检索 <span className="text-white font-semibold">{round < 5 ? "..." : 6}</span> 篇相关文献</span>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-400">已选 <span className="text-cyan-400 font-semibold">{sel.length}</span> 篇</span>
                    {round < 5 && <span className="flex items-center gap-1 text-cyan-400"><svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>筛选中</span>}
                  </div>
                </div>
                <AnimatePresence>
                  {papers.filter(p => p.round <= round).map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }} onClick={() => toggle(p.id)} className={"rounded-2xl border p-5 cursor-pointer transition-all " + (sel.includes(p.id) ? "bg-teal-500/10 border-teal-500/30" : "bg-[#161b2b]/60 border-white/[0.06] hover:border-white/[0.12]")}>
                      <div className="flex items-start gap-4">
                        <div className={"w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-1 " + (sel.includes(p.id) ? "bg-teal-500 border-teal-500" : "border-gray-600")}>{sel.includes(p.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-white font-medium leading-snug">{p.title}</h3>
                            <div className="flex items-center gap-2">
                              <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] text-gray-500 border border-white/[0.08]">R{p.round}</span>
                              <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/15 text-teal-400">{(p.relevance * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                          <p className="text-gray-500 text-sm mt-1">{p.authors} · {p.journal} · {p.year}</p>
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{p.abstract}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-600"><span>引用: {p.citations}</span><span className="text-gray-500">第 {p.round} 轮发现</span></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {round >= 5 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 pt-2 justify-end">
                    <button className="px-5 py-2.5 text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm hover:bg-white/[0.08] transition-all">重新筛选</button>
                    <button className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">进入信息抽取 →</button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div></div>
    </div>
  );
}