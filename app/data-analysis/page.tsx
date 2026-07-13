"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/prototype/NavBar";

const stats = {
  rows: 100, cols: 8,
  desc: { Temperature: { mean: 36.8, std: 0.4, min: 35.2, max: 38.5 }, Pressure: { mean: 101.3, std: 5.2, min: 88.7, max: 112.4 }, FlowRate: { mean: 45.6, std: 12.3, min: 12.1, max: 78.9 }, Humidity: { mean: 62.4, std: 8.1, min: 41.2, max: 85.3 } },
  anomalies: [{ row: 23, col: "Pressure", value: 134.2, reason: "Z-score > 3.5" }, { row: 47, col: "FlowRate", value: 8.5, reason: "低于 Q1 - 1.5xIQR" }, { row: 78, col: "Pressure", value: 72.3, reason: "低于 Q1 - 1.5xIQR" }, { row: 52, col: "Temperature", value: 39.8, reason: "Z-score > 3.0" }],
  trends: "Temperature: 整体稳定，略有上升趋势 (+0.02/样本)\nPressure: 周期性波动，无明显趋势\nFlowRate: 前 30 个样本后出现显著下降",
};

export default function DataAnalysisPage() {
  const [has, setHas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const loadDemo = () => { setLoading(true); setTimeout(() => { setLoading(false); setHas(true); setFileName("experiment_data_demo.csv"); }, 1200); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) { setFileName(file.name); setLoading(true); setTimeout(() => { setLoading(false); setHas(true); }, 1500); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setFileName(file.name); setLoading(true); setTimeout(() => { setLoading(false); setHas(true); }, 1500); }
  };

  return (
    <div className="min-h-screen bg-[#0C111F]">
      <NavBar />
      <div className="pt-24 pb-16"><div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">实验数据统计与<span className="bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">可视化</span></h1>
          <p className="text-gray-500">上传实验数据，自动完成基础统计、异常值标记与趋势分析</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-[#161b2b]/80 border border-white/[0.06] p-6">
              <h2 className="text-white font-semibold mb-4">数据上传</h2>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={"relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all group " + (dragOver ? "border-amber-400/50 bg-amber-400/5 scale-[1.02]" : "border-white/[0.1] hover:border-amber-400/30 hover:bg-amber-400/[0.02]")}
              >
                <input ref={fileRef} type="file" accept=".csv,.xlsx,.txt" onChange={handleFileSelect} className="hidden" />
                <div className={"text-5xl mb-3 transition-transform duration-300 " + (dragOver ? "scale-110" : "group-hover:scale-105")}>
                  {dragOver ? "📥" : fileName ? "📄" : "📤"}
                </div>
                {fileName ? (
                  <div>
                    <p className="text-amber-400 text-sm font-medium">{fileName}</p>
                    <p className="text-gray-600 text-xs mt-1">点击更换文件</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-300 text-sm font-medium mb-1">拖拽文件到此处</p>
                    <p className="text-gray-600 text-xs">或点击选择文件</p>
                    <div className="flex items-center gap-2 mt-4 justify-center">
                      <span className="px-2 py-1 bg-white/[0.04] border border-white/[0.08] text-gray-500 rounded-lg text-[10px]">CSV</span>
                      <span className="px-2 py-1 bg-white/[0.04] border border-white/[0.08] text-gray-500 rounded-lg text-[10px]">Excel</span>
                      <span className="px-2 py-1 bg-white/[0.04] border border-white/[0.08] text-gray-500 rounded-lg text-[10px]">TXT</span>
                    </div>
                  </div>
                )}
                {dragOver && <div className="absolute inset-0 rounded-xl border-2 border-amber-400/40 bg-amber-400/[0.02]" />}
              </div>
              {loading && <div className="mt-4 flex items-center gap-3 text-amber-400 text-sm animate-pulse"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>正在分析数据...</div>}
            </div>
            {!has && !loading && <div className="mt-4 rounded-xl bg-[#161b2b]/40 border border-white/[0.06] p-4"><p className="text-gray-500 text-xs">💡 提示：点击下方加载示例数据预览</p><button onClick={loadDemo} className="mt-2 w-full text-xs text-amber-400 bg-amber-400/10 px-3 py-2 rounded-lg hover:bg-amber-400/20 transition-all">加载示例数据</button></div>}
          </div>
          <div className="lg:col-span-2">
            {!has ? (
              <div className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-12 text-center"><div className="text-5xl mb-4">📊</div><h3 className="text-white font-semibold text-lg mb-2">上传数据开始分析</h3><p className="text-gray-500 text-sm">支持 CSV、Excel 格式，自动完成描述性统计、异常值检测与趋势分析</p></div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[{ l: "样本数", v: stats.rows, c: "from-amber-400 to-orange-400", e: "n" }, { l: "变量数", v: stats.cols, c: "from-orange-400 to-red-400", e: "k" }, { l: "异常值", v: stats.anomalies.length, c: "from-rose-400 to-pink-400", e: "!" }, { l: "相关性", v: "6对", c: "from-amber-400 to-yellow-400", e: "r" }].map(s => (
                    <div key={s.l} className="rounded-xl bg-[#161b2b]/80 border border-white/[0.06] p-4">
                      <div className={"inline-flex w-8 h-8 rounded-lg bg-gradient-to-br " + s.c + " items-center justify-center text-white text-xs font-bold mb-2"}>{s.e}</div>
                      <div className="text-2xl font-bold text-white">{s.v}</div>
                      <div className="text-gray-500 text-sm">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>描述性统计</h3>
                  <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-gray-500 border-b border-white/[0.06]"><th className="text-left py-2 px-3">变量</th><th className="text-right py-2 px-3">均值</th><th className="text-right py-2 px-3">标准差</th><th className="text-right py-2 px-3">最小值</th><th className="text-right py-2 px-3">最大值</th></tr></thead>
                    <tbody>{Object.entries(stats.desc).map(([n, s], i) => (<tr key={n} className={"text-gray-300 border-b border-white/[0.04]" + (i % 2 === 0 ? " bg-white/[0.02]" : "")}><td className="py-2.5 px-3 font-medium">{n}</td><td className="text-right py-2.5 px-3">{s.mean.toFixed(1)}</td><td className="text-right py-2.5 px-3">{s.std.toFixed(1)}</td><td className="text-right py-2.5 px-3">{s.min.toFixed(1)}</td><td className="text-right py-2.5 px-3">{s.max.toFixed(1)}</td></tr>))}</tbody></table></div>
                </div>
                <div className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.965-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>异常值检测</h3>
                  <div className="space-y-2">{stats.anomalies.map(a => (<div key={a.row + "-" + a.col} className="flex items-center justify-between bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3"><div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-xs font-bold">!</span><span className="text-gray-300 text-sm">第 {a.row} 行 · <span className="text-rose-400 font-medium">{a.col}</span> = {a.value}</span></div><span className="text-gray-500 text-xs">{a.reason}</span></div>))}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-5"><h3 className="text-white font-semibold mb-3 flex items-center gap-2"><svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>趋势分析</h3><div className="space-y-2">{stats.trends.split("\n").map((l, i) => <p key={i} className="text-gray-400 text-sm">{l}</p>)}</div></div>
                  <div className="rounded-2xl bg-[#161b2b]/60 border border-white/[0.06] p-5"><h3 className="text-white font-semibold mb-3 flex items-center gap-2"><svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>可视化建议</h3><div className="flex flex-wrap gap-2">{["箱线图", "散点图矩阵", "时序折线图", "相关性热力图"].map(c => <span key={c} className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] text-gray-400 text-xs rounded-xl hover:bg-cyan-400/10 hover:border-cyan-400/30 hover:text-cyan-400 cursor-pointer transition-all">{c}</span>)}</div><p className="text-gray-500 text-xs mt-3 pt-3 border-t border-white/[0.06]">💡 点击图表类型自动生成可视化</p></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div></div>
    </div>
  );
}