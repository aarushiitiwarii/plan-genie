import React, { useEffect } from "react";
import styles from "./Sparkles.module.css";

function randomBetween(a, b) {
  return Math.random() * (b - a) + a;
}

export default function Sparkles({ count = 30, trigger, onEnd }) {
  useEffect(() => {
    if (!trigger) return;
    const timeout = setTimeout(() => {
      onEnd();
    }, 1200); // Sparkles last 1.2s
    return () => clearTimeout(timeout);
  }, [trigger, onEnd]);

  if (!trigger) return null;

  return (
    <div className={styles.sparkleContainer}>
      {Array.from({ length: count }).map((_, i) => {
        const left = randomBetween(5, 95);
        const top = randomBetween(10, 90);
        const size = randomBetween(8, 22);
        const delay = randomBetween(0, 0.5);
        return (
          <span
            key={i}
            className={styles.sparkle}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}