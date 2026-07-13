"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/prototype/NavBar";

interface Ref { id: number; authors: string; title: string; journal: string; year: string; volume: string; issue: string; pages: string; }
const refs: Ref[] = [
  { id: 1, authors: "Vaswani A, Shazeer N, Parmar N, et al", title: "Attention is all you need", journal: "Advances in Neural Information Processing Systems", year: "2017", volume: "30", issue: "", pages: "5998-6008" },
  { id: 2, authors: "Devlin J, Chang M W, Lee K, et al", title: "BERT: pre-training of deep bidirectional transformers for language understanding", journal: "Proceedings of NAACL-HLT", year: "2019", volume: "", issue: "", pages: "4171-4186" },
  { id: 3, authors: "Brown T, Mann B, Ryder N, et al", title: "Language models are few-shot learners", journal: "Advances in Neural Information Processing Systems", year: "2020", volume: "33", issue: "", pages: "1877-1901" },
  { id: 4, authors: "Lewis P, Perez E, Piktus A, et al", title: "Retrieval-augmented generation for knowledge-intensive NLP tasks", journal: "Advances in Neural Information Processing Systems", year: "2020", volume: "33", issue: "", pages: "9459-9474" },
  { id: 5, authors: "Ouyang L, Wu J, Jiang X, et al", title: "Training language models to follow instructions with human feedback", journal: "arXiv preprint arXiv:2203.02155", year: "2022", volume: "", issue: "", pages: "" },
];

type Fmt = "gbt" | "apa" | "mla" | "ieee";
const labels: Record<Fmt, string> = { gbt: "GB/T 7714", apa: "APA 7th", mla: "MLA 9th", ieee: "IEEE" };
function fmt(r: Ref, f: Fmt): string {
  if (f === "gbt") return r.authors + ". " + r.title + "[J]. " + r.journal + ", " + r.year + (r.volume ? ", " + r.volume + (r.issue ? "(" + r.issue + ")" : "") + (r.pages ? ": " + r.pages : "") : "") + ".";
  if (f === "apa") return r.authors + " (" + r.year + "). " + r.title + ". " + r.journal + (r.volume ? ", " + r.volume : "") + (r.pages ? ", " + r.pages : "") + ".";
  if (f === "mla") return r.authors + '. "' + r.title + '." ' + r.journal + (r.volume ? ", vol. " + r.volume : "") + (r.year ? " (" + r.year + ")" : "") + (r.pages ? ": " + r.pages : "") + ".";
  return "[" + r.id + "] " + r.authors + ', "' + r.title + '," ' + r.journal + ", vol. " + (r.volume || "-") + ", no. " + (r.issue || "-") + (r.pages ? ", pp. " + r.pages : "") + ", " + r.year + ".";
}

export default function ReferencePage() {
  const [f, setF] = useState<Fmt>("gbt");
  const [cp, setCp] = useState<number | null>(null);
  const copy = async (t: string, id: number) => { await navigator.clipboard.writeText(t); setCp(id); setTimeout(() => setCp(null), 2000); };

  return (
    <div className="min-h-screen bg-[#0C111F]"><NavBar />
      <div className="pt-24 pb-16"><div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">参考文献<span className="bg-gradient-to-r from-rose-400 to-pink-300 bg-clip-text text-transparent">自动格式化</span></h1>
          <p className="text-gray-500">符合 GB/T 7714 国标格式，支持多引用格式一键切换</p>
        </motion.div>
        <div className="rounded-2xl bg-[#161b2b]/80 border border-white/[0.06] p-5 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">引用格式</span>
            <div className="flex gap-2">{(Object.entries(labels) as [Fmt, string][]).map(([k, l]) => (
              <button key={k} onClick={() => setF(k)} className={"px-4 py-2 rounded-lg text-sm font-medium transition-all " + (f === k ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" : "text-gray-500 hover:text-gray-300 bg-white/[0.04] border border-white/[0.06]")}>{l}</button>
            ))}</div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex justify-end">
            <button onClick={() => navigator.clipboard.writeText(refs.map(r => fmt(r, f)).join("\n"))} className="px-4 py-2 text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-xl hover:bg-rose-400/20 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>复制全部
            </button>
          </div>
        </div>
        <div className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-4 mb-6">
          <h3 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>校对完成：发现 3 个问题，已全部自动修复</h3>
          <div className="space-y-1.5">
            {[{ n: "作者格式", d: "第 3 条记录作者间缺少中文逗号" }, { n: "卷号缺失", d: "第 2 条记录缺少卷号信息" }, { n: "页码范围", d: "第 5 条记录为预印本，无页码范围" }].map(i => (
              <div key={i.n} className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-emerald-500/5">
                <div className="flex items-center gap-3"><span className="text-emerald-400 text-xs font-medium">{i.n}</span><span className="text-gray-500">{i.d}</span></div><span className="text-emerald-400 text-xs">已自动修复</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {refs.map((r, i) => {
            const txt = fmt(r, f);
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-5 hover:border-rose-500/30 transition-all">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 text-sm font-mono">{r.id}</span>
                  <div className="flex-1 min-w-0"><p className="text-gray-300 text-sm leading-relaxed font-mono text-[13px]">{txt}</p></div>
                  <button onClick={() => copy(txt, r.id)} className="flex-shrink-0 p-2 rounded-lg text-gray-600 hover:text-rose-400 hover:bg-rose-400/10 opacity-0 group-hover:opacity-100 transition-all">
                    {cp === r.id ? <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div></div>
    </div>
  );
}