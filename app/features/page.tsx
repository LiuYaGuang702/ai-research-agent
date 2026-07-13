"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "@/components/prototype/NavBar";
import WorkflowSteps from "@/components/prototype/WorkflowSteps";

const features = [
  { title: "文献检索与递归筛选", desc: "多源学术数据库并行检索，LLM递归评估相关性，自动扩展关键词迭代搜索，直至获得精准文献池", icon: "\u{1F4DA}", href: "/literature", color: "from-teal-400 to-cyan-400", stats: "已处理 12,847 篇论文" },
  { title: "文献信息抽取与综述", desc: "自动提取标题、作者、创新点、结论等关键信息，基于结构化逻辑生成综述大纲与初稿框架", icon: "\u270D\uFE0F", href: "/review", color: "from-violet-400 to-purple-400", stats: "已生成 856 篇综述" },
  { title: "实验数据统计与可视化", desc: "上传 CSV/Excel 自动完成基础统计、异常值标记、趋势分析，生成可视化图表与报告", icon: "\u{1F4CA}", href: "/data-analysis", color: "from-amber-400 to-orange-400", stats: "已分析 3,421 组数据" },
  { title: "参考文献自动格式化", desc: "GB/T 7714 国标格式自动排版、校对纠错，支持 APA/MLA/IEEE 等多格式一键切换", icon: "\u{1F4DD}", href: "/reference", color: "from-rose-400 to-pink-400", stats: "已格式化 23,509 条文献" },
];

const wfSteps = [
  { id: "1", label: "文献检索", description: "ArXiv / Semantic Scholar 多源并行检索", status: "completed" as const },
  { id: "2", label: "递归筛选", description: "LLM 评估相关性 · 第 3/5 轮迭代", status: "running" as const, progress: 65 },
  { id: "3", label: "信息抽取", description: "等待文献池确认后自动抽取关键信息", status: "pending" as const },
  { id: "4", label: "综述生成", description: "等待信息抽取完成后生成综述框架", status: "pending" as const },
];

const interruptSteps = [
  { id: "i1", label: "文献检索完成", description: "已检索 47 篇候选文献，等待确认", status: "completed" as const },
  { id: "i2", label: "人工审核筛选", description: "用户手动排除 5 篇低相关文献，补充 2 个新关键词", status: "waiting" as const },
  { id: "i3", label: "续跑：增量检索", description: "基于补充关键词继续检索 12 篇新文献", status: "pending" as const },
  { id: "i4", label: "生成最终文献池", description: "合并筛选，输出 54 篇高相关文献", status: "pending" as const },
];

const suggs = ["基于大语言模型的代码生成研究方向综述", "量子机器学习在药物发现中的应用", "联邦学习在医疗隐私保护中的最新进展", "Transformer 模型在时间序列预测中的改进方法"];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showInterrupt, setShowInterrupt] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleSearch = () => {
    if (query.trim()) {
      router.push("/literature?q=" + encodeURIComponent(query));
    } else {
      router.push("/literature");
    }
  };

  return (
    <div className="min-h-screen bg-[#0C111F]">
      <NavBar />
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-violet-500/5 rounded-full blur-[96px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-gray-400 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />基于通用智能体的 AI 科研辅助系统
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            <span className="bg-gradient-to-r from-teal-200 via-cyan-300 to-blue-400 bg-clip-text text-transparent">AI 科研智能体</span><br/>释放你的研究潜力
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">融合通用智能体工作流与 RAG 增强技术，实现文献检索、综述生成、数据分析、参考文献格式化的全流程自动化</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition" />
              <div className="relative flex items-center bg-[#1a1f2e] border border-white/[0.1] rounded-2xl overflow-hidden">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="输入研究方向或关键词，开始科研探索..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 px-6 py-4 text-lg outline-none"
                />
                <button onClick={handleSearch} className="mx-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-teal-500/25 transition-all">开始研究</button>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap justify-center gap-2 mt-6">
            {suggs.map((s) => <button key={s} onClick={() => { setQuery(s); router.push("/literature?q=" + encodeURIComponent(s)); }} className="px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-500 text-sm hover:bg-white/[0.08] hover:text-gray-300 transition-all">{s}</button>)}
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white mb-3">四大核心功能</h2><p className="text-gray-500">覆盖科研全流程，替代重复性事务工作</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={f.href} className="block group h-full">
                  <div className="relative h-full p-6 rounded-2xl bg-[#161b2b]/80 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-0.5">
                    <div className={"absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r " + f.color + " opacity-0 group-hover:opacity-100 transition-opacity"} />
                    <div className="flex items-start gap-4">
                      <div className={"w-12 h-12 rounded-xl bg-gradient-to-br " + f.color + " flex items-center justify-center text-2xl flex-shrink-0"}>{f.icon}</div>
                      <div className="flex-1 min-w-0"><h3 className="text-white font-semibold text-lg mb-1.5">{f.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between"><span className="text-gray-600 text-xs">{f.stats}</span><span className="text-gray-500 text-sm group-hover:text-cyan-400 transition-colors">进入功能 →</span></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow + Interrupt - side by side on desktop */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10"><h2 className="text-2xl font-bold text-white mb-2">智能体工作流</h2><p className="text-gray-500">通用智能体流程编排 · 任务递归执行 · 断点续跑</p></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-6">
              <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />自动化执行流程
              </h3>
              <WorkflowSteps steps={wfSteps} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />断点续跑与人工干预
                </h3>
                <button onClick={() => setShowInterrupt(!showInterrupt)} className="text-xs text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg hover:bg-amber-400/20 transition-all">{showInterrupt ? "收起" : "模拟干预"}</button>
              </div>
              {!showInterrupt ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-4xl mb-3">🛑</div>
                  <p className="text-gray-400 text-sm mb-1">任务暂停中，等待人工审核</p>
                  <p className="text-gray-600 text-xs">点击上方按钮模拟人工干预流程</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <WorkflowSteps steps={interruptSteps} />
                  <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <div className="text-amber-400 text-sm mt-0.5">👤</div>
                      <div>
                        <p className="text-amber-200 text-sm font-medium">人工干预输入</p>
                        <div className="mt-2 space-y-1.5 text-xs text-gray-400">
                          <div className="flex items-center gap-2"><span className="text-rose-400">✕</span> 排除文献: "An Empirical Study of Code Review Bots" (相关性: 0.43)</div>
                          <div className="flex items-center gap-2"><span className="text-rose-400">✕</span> 排除文献: "Static Analysis Tools for Python" (相关性: 0.38)</div>
                          <div className="flex items-center gap-2"><span className="text-emerald-400">+</span> 补充关键词: "Neural Code Synthesis, Program Repair"</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}