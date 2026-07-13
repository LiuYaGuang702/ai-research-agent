"use client";
import { motion } from "framer-motion";

export type StepStatus = "pending" | "running" | "completed" | "error" | "waiting";
export interface WorkflowStep { id: string; label: string; description: string; status: StepStatus; progress?: number; }
interface Props { steps: WorkflowStep[]; title?: string; }

const cfg: Record<StepStatus, { icon: string; color: string; bg: string }> = {
  pending:    { icon: "○", color: "text-gray-500", bg: "bg-gray-500/20" },
  running:    { icon: "◉", color: "text-cyan-400", bg: "bg-cyan-400/20" },
  completed:  { icon: "●", color: "text-teal-400", bg: "bg-teal-400/20" },
  error:      { icon: "✕", color: "text-red-400", bg: "bg-red-400/20" },
  waiting:    { icon: "⊡", color: "text-amber-400", bg: "bg-amber-400/20" },
};

export default function WorkflowSteps({ steps, title }: Props) {
  return (
    <div className="w-full">
      {title && <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>{title}</h3>}
      <div className="relative">
        <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-white/[0.08]" />
        <div className="space-y-0">
          {steps.map((step, idx) => {
            const c = cfg[step.status];
            const running = step.status === "running";
            return (
              <motion.div key={step.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="relative flex gap-4 py-3">
                <div className="relative z-10 flex-shrink-0 flex items-start pt-0.5">
                  <motion.div animate={running ? { scale: [1, 1.3, 1] } : {}} transition={running ? { duration: 1.5, repeat: Infinity } : {}} className={"w-10 h-10 rounded-xl " + c.bg + " border border-white/[0.06] flex items-center justify-center text-sm " + c.color}>{c.icon}</motion.div>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{step.label}</span>
                    {step.status === "running" && <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">进行中</span>}
                    {step.status === "completed" && <span className="text-xs text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full">完成</span>}
                    {step.status === "waiting" && <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">等待人工</span>}
                    {step.status === "error" && <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">异常</span>}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">{step.description}</p>
                  {running && step.progress !== undefined && (
                    <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: step.progress + "%" }} className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}