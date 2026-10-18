"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CorpMemberLoanRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/loans");
  }, [router]);
  return null;
}