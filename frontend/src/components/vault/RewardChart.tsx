"use client";

import { useEffect, useState } from "react";

export default function RewardChart({ reward }: { reward: number }) {
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory((prev) => {
        const next = [...prev, reward];
        return next.slice(-20); // max 20 data point
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [reward]);

  return (
    <div className="p-4 border rounded-xl bg-black text-white">
      <h3 className="font-bold mb-2">📈 Reward Growth</h3>

      <div className="flex items-end gap-1 h-24">
        {history.map((val, i) => (
          <div
            key={i}
            className="bg-green-500 w-2"
            style={{ height: `${Math.min(val / 10, 100)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
