"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function A11yAnnouncer() {
  const [announcement, setAnnouncement] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const pageTitle = document.title;
    setAnnouncement(`Navigated to ${pageTitle || pathname}`);
  }, [pathname]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}
