"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import NavBar from "@/components/prototype/NavBar";

interface Message { role: "user" | "ai"; content: string; type?: "file"; fileName?: string; }

const welcomeMsg = "你好！我是 AI 科研智能体，可以帮你检索文献、分析实验数据、生成综述、格式化参考文献。请输入你的研究问题或上传文件。";

const demoResponses: Record<string, string> = {
  "论文": "好的，我来帮你检索相关文献。请稍等..."+"\n\n正在多源检索 ArXiv、Semantic Scholar...\n\n为你找到了以下相关论文方向：\n\n1. **Large Language Models for Code Generation: A Survey** - ACM Computing Surveys, 2025\n2. **Self-Refine: Iterative Refinement** - NeurIPS 2024\n3. **CodeLlama: Open Foundation Models** - Meta AI, 2024\n\n点击左侧「文献检索」可以进行深度递归筛选。",
  "数据": "我看到你提到了数据分析。你可以直接上传 CSV/Excel 文件，或者点击左侧「数据分析」功能，我会自动完成：\n\n- 📊 描述性统计（均值、标准差、分布）\n- ⚠️ 异常值检测\n- 📈 趋势分析\n- 🎨 可视化图表建议",
  "综述": "好的，我来帮你生成相关领域的文献综述框架。\n\n**建议综述大纲：**\n\n1. 引言与背景\n2. 相关研究工作\n3. 核心技术方法分类\n4. 实验对比与分析\n5. 挑战与未来方向\n6. 结论\n\n点击左侧「综述生成」可以查看完整的大纲和初稿生成。",
  "格式": "参考文献格式化支持以下格式：\n\n- ✅ GB/T 7714（中国国标）\n- ✅ APA 7th\n- ✅ MLA 9th\n- ✅ IEEE\n\n点击左侧「参考文献」功能可以批量格式化和校对。",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{ role: "ai", content: welcomeMsg }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const sendMsg = (text: string) => {
    if (!text.trim()) return;
    const newMsgs: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setInput("");
    setIsTyping(true);

    // Simulate AI response based on keywords
    setTimeout(() => {
      let reply = "这是一个很好的问题。作为 AI 科研智能体，我可以帮你：\n\n- 📚 检索相关文献并进行递归筛选\n- ✍️ 抽取文献信息并生成综述\n- 📊 分析实验数据并生成可视化\n- 📝 格式化参考文献\n\n请告诉我你想深入了解哪个方向？";
      const t = text.toLowerCase();
      if (t.includes("论文") || t.includes("文献") || t.includes("检索")) reply = demoResponses["论文"];
      else if (t.includes("数据") || t.includes("分析") || t.includes("统计")) reply = demoResponses["数据"];
      else if (t.includes("综述") || t.includes("大纲") || t.includes("框架")) reply = demoResponses["综述"];
      else if (t.includes("格式") || t.includes("引用") || t.includes("参考")) reply = demoResponses["格式"];
      
      setMessages([...newMsgs, { role: "ai", content: reply }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const file = files[0];
    setUploadedFiles([...uploadedFiles, { name: file.name, size: (file.size / 1024).toFixed(1) + " KB" }]);
    setMessages([...messages, { role: "user", content: "上传了文件：" + file.name, type: "file", fileName: file.name }]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", content: "已收到文件 **" + file.name + "**，正在分析中..."+"\n\n请点击左侧「数据分析」功能查看完整的统计结果和可视化图表。\n\n或者告诉我你想对这个文件做什么分析？例如：\n- 查看描述性统计\n- 检测异常值\n- 趋势分析\n- 生成可视化建议" }]);
      setIsTyping(false);
    }, 2000);
  };

  const suggestions = ["帮我检索关于LLM代码生成的最新论文", "分析一下我上传的实验数据", "生成一篇文献综述的框架", "把这段参考文献改成国标格式"];

  return (
    <div className="min-h-screen bg-[#0C111F] flex flex-col">
      <NavBar />
      <div className="flex-1 flex flex-col pt-16">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            {messages.length <= 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-2xl mx-auto mb-4">AI</div>
                <h2 className="text-xl font-bold text-white mb-2">AI 科研智能体</h2>
                <p className="text-gray-500 text-sm max-w-md mx-auto">融合通用智能体工作流，实现科研辅助全流程自动化</p>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={"flex gap-3 " + (msg.role === "user" ? "justify-end" : "")}
                >
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">AI</div>
                  )}
                  <div className={"max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed " + (msg.role === "user" ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-br-md" : "bg-[#161b2b]/80 border border-white/[0.06] text-gray-300 rounded-bl-md")}>
                    {msg.type === "file" && (
                      <div className="flex items-center gap-2 mb-2 text-xs opacity-75">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        {msg.fileName}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap [&_strong]:text-teal-300 [&_strong]:font-semibold" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">你</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AI</div>
                <div className="bg-[#161b2b]/80 border border-white/[0.06] rounded-2xl rounded-bl-md px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick suggestions */}
        {messages.length <= 1 && (
          <div className="max-w-3xl mx-auto px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => sendMsg(s)} className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 text-sm hover:bg-white/[0.08] hover:text-gray-200 hover:border-white/[0.12] transition-all">{s}</button>
              ))}
            </div>
          </div>
        )}

        {/* Uploaded files bar */}
        {uploadedFiles.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 pb-2">
            {uploadedFiles.map((f, i) => (
              <div key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs mr-2 mb-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {f.name} ({f.size})
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-white/[0.06] bg-[#0C111F]/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-end gap-3">
              {/* File upload */}
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.txt,.pdf" onChange={handleFileUpload} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="flex-shrink-0 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all" title="上传文件">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              </button>

              {/* Text input */}
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(input); } }}
                  placeholder="输入你的研究问题..."
                  rows={1}
                  className="w-full bg-[#1a1f2e] border border-white/[0.1] rounded-2xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-cyan-500/50 resize-none transition-colors"
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = Math.min(el.scrollHeight, 120) + "px";
                  }}
                />
              </div>

              {/* Send button */}
              <button
                onClick={() => sendMsg(input)}
                disabled={!input.trim()}
                className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
            <p className="text-gray-600 text-xs text-center mt-2">AI 科研智能体 · 按 Enter 发送，Shift+Enter 换行</p>
          </div>
        </div>
      </div>
    </div>
  );
}