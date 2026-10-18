import React from "react";
import styles from "./BrandLogo.module.css";

interface BrandLogoProps {
  variant?: "full" | "icon";
  showMotto?: boolean;
}

export function BrandLogo({
  variant = "full",
  showMotto = true,
}: BrandLogoProps) {
  return (
    <div className={styles.logoWrapper}>
      {variant === "full" ? (
        <img
          src="/brand/ecocampus-logo.png"
          alt="EcoCampus"
          className={styles.logoImage}
        />
      ) : (
        <img
          src="/brand/ecocampus-icon.png"
          alt="EcoCampus"
          className={styles.logoCompact}
        />
      )}

      {showMotto && (
        <p className={styles.mottoBanner} aria-label="LEARN. GROW. ACHIEVE.">
          LEARN. GROW. ACHIEVE.
        </p>
      )}
    </div>
  );
}