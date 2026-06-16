import { describe, it, expect } from "vitest";
import { TOOLS, getToolConfig, TOOL_SLUGS } from "@/tools/tools.config";

describe("tools.config", () => {
  it("exports 6 tool configs", () => {
    expect(TOOLS).toHaveLength(6);
  });

  it("every tool has required fields", () => {
    for (const t of TOOLS) {
      expect(t.slug, `${t.slug} missing slug`).toBeTruthy();
      expect(t.h1, `${t.slug} missing h1`).toBeTruthy();
      expect(t.metaDescription, `${t.slug} missing metaDescription`).toBeTruthy();
      expect(t.faq, `${t.slug} missing faq`).toHaveLength(4);
      expect(t.related, `${t.slug} missing related`).toHaveLength(4);
      expect(t.uniqueContent, `${t.slug} missing uniqueContent`).toBeTruthy();
    }
  });

  it("all related slugs are valid tool slugs or guide slugs", () => {
    const valid = new Set([...TOOL_SLUGS, "what-is-heic", "what-is-avif"]);
    for (const t of TOOLS) {
      for (const rel of t.related) {
        expect(valid.has(rel), `${t.slug} has unknown related: ${rel}`).toBe(true);
      }
    }
  });

  it("outputFormat is a valid OutputFormat", () => {
    const valid = new Set(["jpeg", "png", "webp", "avif"]);
    for (const t of TOOLS) {
      expect(valid.has(t.outputFormat), `${t.slug} invalid outputFormat: ${t.outputFormat}`).toBe(true);
    }
  });

  it("getToolConfig returns config by slug", () => {
    const cfg = getToolConfig("heic-to-jpg");
    expect(cfg?.slug).toBe("heic-to-jpg");
    expect(cfg?.outputFormat).toBe("jpeg");
  });

  it("getToolConfig returns undefined for unknown slug", () => {
    expect(getToolConfig("not-a-tool")).toBeUndefined();
  });

  it("TOOL_SLUGS matches TOOLS array", () => {
    expect(TOOL_SLUGS).toEqual(TOOLS.map((t) => t.slug));
  });
});
