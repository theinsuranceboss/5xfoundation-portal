"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getSiteContent } from "@/lib/supabase";

function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function GlobalStyles() {
  const pathname = usePathname();
  const [content, setContent] = useState<any>({
    themeFontFamily: "Inter",
    themeHeadingCase: "uppercase",
    themeFontSize: "16",
    themeHeadingScale: "1.0",
    themeTextColor: "#4B5563",
    themeHeadingColor: "#000000",
    themeBrandColor: "#00A3FF",
    themeBoxShadowEnabled: "true",
    themeBoxShadowColor: "#00A3FF",
    titleColor: "",
    titleAlign: "inherit",
    descColor: "",
    descFontSize: "16",
    descAlign: "inherit",
  });

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    async function loadStyles() {
      // 1. Load from cache immediately
      const savedContent = localStorage.getItem("siteContent");
      if (savedContent) {
        try {
          setContent((prev: any) => ({ ...prev, ...JSON.parse(savedContent) }));
        } catch (e) {
          console.error("Failed to parse cached styles", e);
        }
      }

      // 2. Fetch fresh from database
      try {
        const dbContent = await getSiteContent("siteContent");
        if (dbContent) {
          const parsed = JSON.parse(dbContent);
          setContent((prev: any) => ({ ...prev, ...parsed }));
          localStorage.setItem("siteContent", dbContent);
        }
      } catch (err) {
        console.error("Failed to load styles from Supabase:", err);
      }
    }

    loadStyles();

    // Set up a listener for site content updates to reload styles instantly inside admin
    const handleStyleUpdate = () => {
      const saved = localStorage.getItem("siteContent");
      if (saved) {
        try {
          setContent((prev: any) => ({ ...prev, ...JSON.parse(saved) }));
        } catch (e) {}
      }
    };
    window.addEventListener("storage", handleStyleUpdate);
    window.addEventListener("siteContentUpdated", handleStyleUpdate);

    return () => {
      window.removeEventListener("storage", handleStyleUpdate);
      window.removeEventListener("siteContentUpdated", handleStyleUpdate);
    };
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const titleColor = content.titleColor || content.themeHeadingColor || "#000000";
  const descColor = content.descColor || content.themeTextColor || "#4B5563";
  const descFontSize = content.descFontSize || content.themeFontSize || "16";
  const titleAlign = content.titleAlign || "inherit";
  const descAlign = content.descAlign || "inherit";
  const titleScale = content.themeHeadingScale || "1.0";

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Outfit:wght@400;500;700;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Roboto:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500;1,700;1,900&display=swap');
      :root {
        --font-primary: ${content.themeFontFamily || 'Inter'}, sans-serif !important;
        --heading-case: ${content.themeHeadingCase || 'uppercase'} !important;
        --site-weight: 500 !important;
        --heading-weight: 900 !important;
        --card-shadow: ${content.themeBoxShadowEnabled === 'false' ? 'none' : `0 8px 30px -4px ${hexToRgba(content.themeBoxShadowColor || '#00A3FF', 0.25)}`} !important;
        --card-shadow-hover: ${content.themeBoxShadowEnabled === 'false' ? 'none' : `0 15px 35px -2px ${hexToRgba(content.themeBoxShadowColor || '#00A3FF', 0.35)}`} !important;
      }
      body {
        font-family: var(--font-primary) !important;
        font-size: ${descFontSize}px !important;
        color: ${descColor} !important;
      }
      h1, h2, h3, h4, h5, h6, .custom-title, .title-custom {
        text-transform: var(--heading-case) !important;
        color: ${titleColor};
      }
      ${titleAlign !== 'inherit' ? `
        h1, h2, h3, h4, h5, h6, .custom-title, .title-custom {
          text-align: ${titleAlign};
        }
      ` : ''}
      p, .custom-desc, .desc-custom, .text-gray-500 {
        color: ${descColor};
      }
      ${descAlign !== 'inherit' ? `
        p, .custom-desc, .desc-custom, .text-gray-500 {
          text-align: ${descAlign};
        }
      ` : ''}
      .text-gray-500, p, .custom-desc, .desc-custom {
        font-size: ${descFontSize}px;
      }
      .text-brand-blue {
        color: ${content.themeBrandColor || '#00A3FF'} !important;
      }
      .bg-brand-blue {
        background-color: ${content.themeBrandColor || '#00A3FF'} !important;
      }
      .border-brand-blue {
        border-color: ${content.themeBrandColor || '#00A3FF'} !important;
      }
      .hover\\:bg-brand-blue:hover {
        background-color: ${content.themeBrandColor || '#00A3FF'} !important;
      }
      .hover\\:border-brand-blue:hover {
        border-color: ${content.themeBrandColor || '#00A3FF'} !important;
      }
      .text-6xl { font-size: calc(3.75rem * ${titleScale}) !important; }
      .text-7xl { font-size: calc(4.5rem * ${titleScale}) !important; }
      .text-8xl { font-size: calc(6rem * ${titleScale}) !important; }
      .product-card-shadow {
        box-shadow: var(--card-shadow) !important;
        transition: box-shadow 0.3s ease, transform 0.3s ease !important;
      }
      .group:hover .product-card-shadow {
        box-shadow: var(--card-shadow-hover) !important;
      }
    ` }} />
  );
}
