"use client";

import { Snowfall } from "react-snowfall";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function SnowEffect() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the current theme (handles system theme)
  const currentTheme = theme === "system" ? systemTheme : theme;
  
  // Black snowflakes for light theme, white for dark theme
  const snowflakeColor = currentTheme === "dark" 
    ? "rgba(255, 255, 255, 0.8)" 
    : "rgba(0, 0, 0, 0.8)";

  if (!mounted) {
    return null;
  }

  return (
    <Snowfall
      color={snowflakeColor}
      snowflakeCount={75}
      speed={[0.5, 1.5]}
      wind={[-0.5, 0.5]}
      radius={[0.5, 3.0]}
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

