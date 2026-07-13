"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/prototype/NavBar";

const papers = [
  { id: 1, title: "Large Language Models for Code Generation: A Survey", authors: "Zhang, Y. et al.", year: 2025, innovation: "系统性综述了 LLM 在代码生成领域的方法分类与性能对比", conclusion: "提出了未来研究方向包括跨语言代码生成与可解释性", tags: ["分类学框架", "性能基准", "未来方向"] },
  { id: 2, title: "Self-Refine: Iterative Refinement with LLMs for Code Synthesis", authors: "Madaan, A. et al.", year: 2024, innovation: "提出迭代自反馈机制，无需外部信号即可改进代码质量", conclusion: "在 HumanEval 等基准上显著优于直接生成方法", tags: ["迭代自反馈", "无需外部监督", "多轮改进"] },
  { id: 3, title: "CodeLlama: Open Foundation Models for Code", authors: "Roziere, B. et al.", year: 2024, innovation: "发布开源代码大模型系列 Code Llama，支持多种代码任务", conclusion: "Code Llama 在代码补全和生成任务上达到当时 SOTA", tags: ["开源模型", "多任务", "代码补全"] },
  { id: 4, title: "Improving Code Generation with Retrieval-Augmented Prompting", authors: "Liu, H. et al.", year: 2025, innovation: "将检索增强技术应用于代码生成提示工程", conclusion: "检索增强方法在复杂 API 调用场景下提升显著", tags: ["检索增强", "提示工程", "API调用"] },
];

const outline = {
  title: "基于大语言模型的代码生成研究综述",
  sections: [
    { title: "1. 引言", subs: ["研究背景与动机", "代码生成的挑战", "本文贡献与组织结构"] },
    { title: "2. 大语言模型基础", subs: ["Transformer 架构", "预训练与微调范式", "代码专用语言模型"] },
    { title: "3. 代码生成方法分类", subs: ["直接生成方法", "检索增强方法", "迭代优化方法", "多智能体协作方法"] },
    { title: "4. 关键技术与创新", subs: ["Prompt 工程", "上下文增强", "自我改进机制", "评估方法"] },
    { title: "5. 实验与分析", subs: ["基准数据集", "性能对比", "消融实验"] },
    { title: "6. 挑战与未来方向", subs: ["代码正确性保证", "长上下文处理", "多语言支持", "安全性考量"] },
    { title: "7. 结论", subs: [] },
  ],
};

export default function ReviewPage() {
  const [tab, setTab] = useState<"extract" | "outline" | "full">("extract");
  const [gen, setGen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0C111F]">
      <NavBar />
      <div className="pt-24 pb-16"><div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">文献信息抽取与<span className="bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">综述生成</span></h1>
          <p className="text-gray-500">自动提取文献核心信息，基于结构化逻辑生成综述大纲与初稿框架</p>
        </motion.div>
        <div className="flex gap-1 mb-6 p-1 bg-white/[0.04] rounded-xl w-fit">
          {[{ k: "extract" as const, l: "信息抽取" }, { k: "outline" as const, l: "综述大纲" }, { k: "full" as const, l: "完整综述" }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} className={"px-5 py-2.5 rounded-lg text-sm font-medium transition-all " + (tab === t.k ? "bg-white/[0.1] text-white" : "text-gray-500 hover:text-gray-300")}>{t.l}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-400" />文献池 ({papers.length} 篇)</h2>
            {papers.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl bg-[#161b2b]/60 border border-white/[0.06] p-4 hover:border-violet-500/30 transition-all cursor-pointer">
                <h3 className="text-white text-sm font-medium leading-snug">{p.title}</h3>
                <p className="text-gray-600 text-xs mt-1">{p.authors} · {p.year}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">{p.tags.map(t => <span key={t} className="px-2 py-0.5 bg-violet-500/10 text-violet-400 text-[10px] rounded-full">{t}</span>)}</div>
              </motion.div>
            ))}
          </div>
          <div className="lg:col-span-2">
            {tab === "extract" && (
              <div className="space-y-4">
                {papers.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-5">
                    <div className="flex items-start justify-between mb-3"><div><h3 className="text-white font-medium">{p.title}</h3><p className="text-gray-600 text-sm">{p.authors} · {p.year}</p></div></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#1a1f2e] rounded-xl p-4 border border-white/[0.04]"><div className="text-cyan-400 text-xs font-medium mb-1.5">创新点</div><p className="text-gray-300 text-sm">{p.innovation}</p></div>
                      <div className="bg-[#1a1f2e] rounded-xl p-4 border border-white/[0.04]"><div className="text-teal-400 text-xs font-medium mb-1.5">结论</div><p className="text-gray-300 text-sm">{p.conclusion}</p></div>
                    </div>
                  </motion.div>
                ))}
                <div className="flex justify-end pt-2"><button onClick={() => setGen(true)} className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">生成综述大纲与初稿</button></div>
              </div>
            )}
            {tab === "outline" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-6">
                <div className="flex items-center justify-between mb-6"><div><h2 className="text-xl font-semibold text-white">{outline.title}</h2><p className="text-gray-500 text-sm mt-1">自动生成 · 共 {outline.sections.length} 章节</p></div><button className="px-4 py-2 text-sm text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-xl hover:bg-cyan-400/20">导出大纲</button></div>
                <div className="space-y-3">
                  {outline.sections.map((s, i) => (
                    <div key={s.title} className="rounded-xl bg-[#1a1f2e] border border-white/[0.04] p-4">
                      <div className="flex items-center gap-3"><span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{i + 1}</span><h3 className="text-white font-medium">{s.title}</h3></div>
                      {s.subs.length > 0 && <div className="ml-10 mt-2 flex flex-wrap gap-2">{s.subs.map(sub => <span key={sub} className="px-3 py-1 bg-white/[0.04] text-gray-400 text-xs rounded-lg border border-white/[0.06]">{sub}</span>)}</div>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {tab === "full" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-8">
                {!gen ? (
                  <div className="text-center py-12">
                    <h3 className="text-white font-semibold mb-2">尚未生成综述</h3>
                    <p className="text-gray-500 text-sm mb-6">请在"信息抽取"页面完成文献抽取后生成综述初稿</p>
                    <button onClick={() => setGen(true)} className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium">生成综述初稿</button>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">{outline.title}</h2>
                    {outline.sections.map(s => (<div key={s.title} className="mb-6"><h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3><p className="text-gray-400 text-sm leading-relaxed">这是 {s.title} 章节的自动生成内容，基于文献池中抽取的创新点和结论，自动组织为逻辑连贯的综述段落，包含引用标注和专业术语。</p></div>))}
                    <div className="mt-8 pt-6 border-t border-white/[0.06] flex justify-between"><span className="text-gray-500 text-sm">总字数: ~8,500 字 · 参考文献: 32 篇</span><button className="px-4 py-2 text-sm text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-xl hover:bg-cyan-400/20">下载完整文档</button></div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div></div>
    </div>
  );
}