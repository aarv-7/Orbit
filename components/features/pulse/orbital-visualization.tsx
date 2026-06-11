"use client";

import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { momentumSnapshot } from "@/lib/orbit/carbon-data";

const orbiters = [
  { size: 9, duration: 11, delay: 0, color: "bg-orbit-mint" },
  { size: 7, duration: 16, delay: 2, color: "bg-orbit-violet" },
  { size: 6, duration: 22, delay: 4, color: "bg-orbit-cyan" }
];

export function OrbitalVisualization() {
  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[360px] place-items-center">
      <div className="absolute inset-4 rounded-full border border-primary/25" />
      <div className="absolute inset-14 rounded-full border border-accent/25" />
      <div className="absolute inset-24 rounded-full border border-cyan-400/20" />

      {orbiters.map((orbiter, index) => (
        <motion.div
          key={index}
          className="absolute inset-4 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: orbiter.duration,
            ease: "linear",
            delay: orbiter.delay
          }}
        >
          <div
            className={`${orbiter.color} rounded-full shadow-glow`}
            style={{ width: orbiter.size, height: orbiter.size, marginLeft: `${44 + index * 18}%` }}
          />
        </motion.div>
      ))}

      <motion.div
        className="grid size-44 place-items-center rounded-full border border-primary/30 bg-card/86 text-center shadow-glow backdrop-blur-xl"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <div>
          <div className="mx-auto mb-2 flex size-9 items-center justify-center rounded-md bg-primary/15 text-primary">
            <ArrowDownRight className="size-5" />
          </div>
          <div className="font-display text-5xl font-semibold">{momentumSnapshot.score}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            Momentum
          </div>
          <div className="mt-2 text-sm text-primary">{momentumSnapshot.trendPercent}% improving</div>
        </div>
      </motion.div>
    </div>
  );
}
