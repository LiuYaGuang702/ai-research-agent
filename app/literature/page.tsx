"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/prototype/NavBar";

interface Paper {
  id: string; title: string; authors: string; year: number; abstract: string;
  url: string; relevance: number; round: number;
}

const KEYWORD_EXPANSION: Record<string, string[]> = {
  "language model": ["LLM","GPT","transformer","BERT","pretrained","generative"],
  "code generation": ["program synthesis","code completion","neural code","code repair"],
  "machine learning": ["deep learning","neural network","reinforcement learning","supervised","unsupervised"],
  "computer vision": ["image recognition","object detection","CNN","visual transformer","segmentation"],
  "nlp": ["natural language","text classification","sentiment analysis","NER"],
  "quantum": ["qubit","quantum computing","quantum circuit","quantum annealing"],
  "drug": ["molecule","drug discovery","molecular dynamics","protein docking"],
};

function expandKeywords(keywords: string[]): string[] {
  const expanded = new Set<string>(keywords);
  for (const kw of keywords) {
    const lower = kw.toLowerCase();
    for (const [key, values] of Object.entries(KEYWORD_EXPANSION)) {
      if (lower.includes(key) || key.includes(lower)) {
        for (const v of values) expanded.add(v);
      }
    }
    expanded.add(kw);
    expanded.add(kw.toLowerCase());
  }
  return Array.from(expanded).slice(0, 20);
}

async function fetchPapers(query: string, maxResults: number = 30): Promise<Paper[]> {
  const cleanQuery = query.trim().replace(/\s*,\s*/g, " ");
  const encoded = encodeURIComponent(cleanQuery);
  const url = "https://api.semanticscholar.org/graph/v1/paper/search?query=" + encoded + "&limit=" + maxResults + "&fields=title,authors,year,abstract,url,externalIds";
  try {
    const resp = await fetch(url);
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data.data || []).map((item: any, idx: number) => ({
      id: item.paperId || String(idx),
      title: item.title || "",
      authors: (item.authors || []).map((a: any) => a.name).slice(0, 5).join(", "),
      year: item.year || 2024,
      abstract: item.abstract || "",
      url: item.url || ("https://www.semanticscholar.org/paper/" + item.paperId),
      relevance: 0.5, round: 1
    }));
  } catch { return []; }
}

function scoreRelevance(paper: Paper, keywords: string[]): number {
  const text = (paper.title + " " + paper.abstract).toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    const lower = kw.toLowerCase().replace(/[.*+?^=()|[\]\\]/g, "\\=<>");
    const count = (text.match(new RegExp(lower, "gi")) || []).length;
    const titleCount = (paper.title.toLowerCase().match(new RegExp(lower, "gi")) || []).length;
    score += count + titleCount * 2;
  }
  return score;
}

function extractNewKeywords(papers: Paper[], existing: string[]): string[] {
  const wordFreq: Record<string, number> = {};
  const existingSet = new Set(existing.map(k => k.toLowerCase()));
  const stopWords = new Set(["the","a","an","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","can","shall","to","of","in","for","on","with","at","by","from","as","into","through","during","before","after","above","below","between","under","and","but","or","not","this","that","these","those","we","they","it","its","our","their","using","based","proposed","novel","new","approach","method","paper","show","results","model","models","data","also","one","two","used","can","first","well","however","present","work"]);
  for (const paper of papers) {
    const words = (paper.title + " " + paper.abstract).toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    for (const word of words) {
      if (!stopWords.has(word) && !existingSet.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    }
  }
  return Object.entries(wordFreq).filter(([,c]) => c >= 3).sort(([,a],[,b]) => b - a).slice(0, 6).map(([w]) => w);
}

export default function LiteraturePage() {
  const [query, setQuery] = useState("");
  const [round, setRound] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [allPapers, setAllPapers] = useState<Paper[]>([]);
  const [filterLog, setFilterLog] = useState<string[]>([]);
  const [lastKeywords, setLastKeywords] = useState<string[]>([]);
  const totalRounds = 3;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("q");
      if (q) { setQuery(q); handleSearchInternal(q); }
    }
  }, []);

  const handleSearch = () => handleSearchInternal(query);

  const handleSearchInternal = async (q: string) => {
    if (!q.trim()) return;
    setIsSearching(true);
    setRound(0);
    setAllPapers([]);
    setFilterLog([]);
    const keywords = q.split(/[,;，；\s]+/).filter(k => k.length > 1);
    setLastKeywords(keywords);
    const allFound: Map<string, Paper> = new Map();

    for (let r = 1; r <= totalRounds; r++) {
      setRound(r);
      if (r === 1) {
        setFilterLog(logs => [...logs, "第 " + r + " 轮：Semantic Scholar 检索 '" + keywords.join(", ") + "'..."]);
        const papers = await fetchPapers(keywords.join(" "), 30);
        setFilterLog(logs => [...logs, "第 " + r + " 轮：获取 " + papers.length + " 篇论文"]);

        for (const p of papers) {
          p.relevance = scoreRelevance(p, keywords) / 10;
          p.round = r;
          if (!allFound.has(p.id)) allFound.set(p.id, p);
        }
      } else {
        const newKws = expandKeywords(keywords);
        setFilterLog(logs => [...logs, "第 " + r + " 轮：扩展关键词 " + newKws.slice(-4).join(", ") + "..."]);
        const papers = await fetchPapers(newKws.join(" "), 20 + r * 10);
        const prevCount = allFound.size;
        for (const p of papers) {
          p.relevance = (scoreRelevance(p, keywords) + scoreRelevance(p, newKws) * 0.5) / 15;
          p.round = r;
          if (!allFound.has(p.id)) allFound.set(p.id, p);
        }
        const newCount = allFound.size - prevCount;
        setFilterLog(logs => [...logs, "第 " + r + " 轮：新增 " + newCount + " 篇 (" + newKws.slice(-3).join(", ") + ")"]);
      }

      const papersArray = Array.from(allFound.values()).sort((a, b) => b.relevance - a.relevance);
      setAllPapers(papersArray);

      if (r < totalRounds) {
        const topPapers = papersArray.slice(0, 15);
        const newKws = extractNewKeywords(topPapers, keywords);
        if (newKws.length > 0) { keywords.push(...newKws.slice(0, 5)); setLastKeywords([...keywords]); }
      } else {
        setFilterLog(logs => [...logs, "第 " + r + " 轮（收敛）：共获得 " + allFound.size + " 篇高相关论文"]);
      }
    }
    setIsSearching(false);
  };

  const filteredPapers = allPapers.filter(p => p.relevance >= 0.15);

  return (
    <div className="min-h-screen bg-[#0C111F]"><NavBar />
      <div className="pt-24 pb-16"><div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">文献检索与<span className="bg-gradient-to-r from-teal-200 to-cyan-300 bg-clip-text text-transparent">递归筛选</span></h1>
          <p className="text-gray-500">接入 Semantic Scholar 真实学术数据库，通用智能体工作流驱动多轮递归检索</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl bg-[#161b2b]/80 border border-white/[0.06] p-6">
              <h2 className="text-white font-semibold mb-4">研究设定</h2>
              <div className="space-y-4">
                <div><label className="text-gray-400 text-sm block mb-1.5">研究方向/关键词 (逗号分隔)</label><input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key==="Enter" && handleSearch()} placeholder="如: large language model, code generation" className="w-full bg-[#1a1f2e] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-cyan-500/50" /></div>
                <div><label className="text-gray-400 text-sm block mb-1.5">关键词参考</label><div className="flex flex-wrap gap-1.5">{["LLM","transformer","GPT","code generation","reinforcement learning","computer vision","drug discovery","quantum computing","BERT","attention"].map(k => (<span key={k} onClick={() => setQuery(q => q ? q + ", " + k : k)} className="px-2 py-1 bg-white/[0.04] border border-white/[0.08] text-gray-500 text-[11px] rounded-lg hover:bg-cyan-400/10 hover:text-cyan-400 hover:border-cyan-400/30 cursor-pointer transition-all">{k}</span>))}</div></div>
                <button onClick={handleSearch} disabled={isSearching} className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/25 transition-all disabled:opacity-50">{isSearching ? "递归检索中..." : "开始检索"}</button>
              </div>
            </div>
            {round > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-[#161b2b]/80 border border-white/[0.06] p-5">
                <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2"><svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>递归筛选日志</h3>
                <div className="space-y-1">{filterLog.map((log,i) => (<motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.05 }} className="flex items-start gap-2 py-1"><span className={"flex-shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full "+(i<filterLog.length-1?"bg-teal-400":isSearching?"bg-cyan-400 animate-pulse":"bg-teal-400")}/><span className="text-gray-500 text-xs leading-relaxed">{log}</span></motion.div>))}</div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.06]"><span className="text-gray-600 text-xs">当前关键词:</span><div className="flex flex-wrap gap-1">{lastKeywords.map(k => <span key={k} className="px-2 py-0.5 bg-teal-500/10 text-teal-400 text-[10px] rounded-full">{k}</span>)}</div></div>
              </motion.div>
            )}
          </div>
          <div className="lg:col-span-2">
            {round === 0 ? (
              <div className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-12 text-center"><div className="text-5xl mb-4">📚</div><h3 className="text-white font-semibold text-lg mb-2">输入关键词开始检索</h3><p className="text-gray-500 text-sm max-w-md mx-auto">接入 Semantic Scholar 真实数据库，通用智能体工作流驱动多轮递归检索和智能筛选</p></div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2 mb-2"><div className="flex items-center gap-4 text-sm"><span className="text-gray-400">共检索 <span className="text-white font-semibold">{filteredPapers.length}</span> 篇相关文献</span>{isSearching && <span className="flex items-center gap-1 text-cyan-400"><svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>筛选中 (第 {round}/{totalRounds} 轮)</span>}</div></div>
                <AnimatePresence>{filteredPapers.map((p,i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.03 }} className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-5 hover:border-cyan-500/30 transition-all cursor-pointer group" onClick={() => window.open(p.url, "_blank")}>
                    <div className="flex items-start gap-4">
                      <span className={"flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold "+(i<3?"bg-teal-500/20 text-teal-400":"bg-white/[0.04] text-gray-500")}>{i+1}</span>
                      <div className="flex-1 min-w-0"><h3 className="text-white font-medium leading-snug group-hover:text-cyan-400 transition-colors">{p.title}</h3><p className="text-gray-500 text-xs mt-1">{p.authors} · {p.year}</p><p className="text-gray-600 text-sm mt-2 line-clamp-3 leading-relaxed">{p.abstract||"暂无摘要"}</p><div className="flex items-center gap-4 mt-3 text-xs"><span className="text-cyan-400/70">semanticscholar.org</span><span className="text-gray-600">第 {p.round} 轮发现</span><span className={"px-2 py-0.5 rounded-full text-xs "+(p.relevance>=0.5?"bg-teal-500/15 text-teal-400":p.relevance>=0.3?"bg-cyan-500/15 text-cyan-400":"bg-gray-500/15 text-gray-400")}>{(p.relevance*100).toFixed(0)}% 相关</span></div></div>
                    </div>
                  </motion.div>
                ))}</AnimatePresence>
                {filteredPapers.length===0&&!isSearching&&<div className="text-center py-8 text-gray-500 text-sm">未找到高相关论文，尝试更具体的关键词</div>}
              </div>
            )}
          </div>
        </div>
      </div></div>
    </div>
  );
}