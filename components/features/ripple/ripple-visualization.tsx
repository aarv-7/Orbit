"use client";

import { motion } from "framer-motion";
import { rippleMilestones } from "@/lib/orbit/carbon-data";

export function RippleVisualization({ totalKg }: { totalKg: number }) {
  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[420px] place-items-center overflow-hidden rounded-lg border border-border bg-card">
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border border-primary/35"
          initial={{ width: 80, height: 80, opacity: 0.75 }}
          animate={{ width: 380, height: 380, opacity: 0 }}
          transition={{
            repeat: Infinity,
            duration: 4.5,
            delay: index * 1.1,
            ease: "easeOut"
          }}
        />
      ))}
      <div className="absolute inset-8 rounded-full border border-accent/20" />
      <div className="absolute inset-20 rounded-full border border-cyan-400/20" />
      <motion.div
        className="relative grid size-44 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow"
        initial={{ scale: 0.9 }}
        animate={{ scale: [0.96, 1, 0.96] }}
        transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
      >
        <div className="text-center">
          <div className="font-display text-5xl font-semibold">{Math.round(totalKg)}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-normal">kg CO2e</div>
        </div>
      </motion.div>
      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2">
        {rippleMilestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`h-1.5 rounded-full ${milestone.reached ? "bg-primary" : "bg-muted"}`}
            title={milestone.label}
          />
        ))}
      </div>
    </div>
  );
}
