"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function PageClient() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.tenantId) {
      router.replace(`/dashboard/${user.tenantId}`);
    }
  }, [user, router]);

  return null;
}
