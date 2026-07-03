"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { ONE_YEAR_SECONDS, setSharedCookie, THEME_COOKIE } from "@/lib/shared-cookie";

export function ColorModeSwitcher() {
  const { setTheme } = useTheme();

  const changeTheme = (value: "light" | "dark") => {
    setTheme(value);
    setSharedCookie(THEME_COOKIE, value, ONE_YEAR_SECONDS);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => changeTheme("dark")}
        className="dark:hidden"
      >
        <Moon />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => changeTheme("light")}
        className="hidden dark:flex"
      >
        <Sun />
      </Button>
    </>
  );
}
