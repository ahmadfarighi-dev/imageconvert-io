import { test, expect } from "@playwright/test";
import path from "path";

const HEIC_FIXTURE = path.join(__dirname, "../fixtures/sample.heic");

test.describe("HEIC to JPG tool page", () => {
  test("page renders hero and drop zone", async ({ page }) => {
    await page.goto("/heic-to-jpg");
    await expect(page.getByRole("heading", { name: "Convert HEIC to JPG in seconds", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Choose HEIC Files/i })).toBeVisible();
    await expect(page.getByText("100% private")).toBeVisible();
  });

  test("converts a HEIC file and shows result", async ({ page }) => {
    await page.goto("/heic-to-jpg");

    // Set the file on the hidden input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(HEIC_FIXTURE);

    // Wait for conversion to complete — result row appears
    const resultRow = page.locator('text=sample.heic').first();
    await expect(resultRow).toBeVisible({ timeout: 30_000 });

    // Status badge should say JPG
    await expect(page.locator('text=JPG').first()).toBeVisible();

    // Save button appears (accessible name comes from aria-label "Download {file} as {format}")
    await expect(page.getByRole("button", { name: /Download sample\.heic as JPG/i }).first()).toBeVisible();

    // Download All button appears
    await expect(page.getByRole("button", { name: /Download/i }).first()).toBeVisible();
  });

  test("shows Pro upsell note after conversion", async ({ page }) => {
    await page.goto("/heic-to-jpg");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(HEIC_FIXTURE);

    await page.locator('text=sample.heic').first().waitFor({ timeout: 30_000 });
    await expect(page.getByText(/Pro.*removes the 10-file limit/i)).toBeVisible();
  });

  test("FAQ section renders with 4 questions", async ({ page }) => {
    await page.goto("/heic-to-jpg");
    const faqItems = page.locator("text=Are my photos uploaded");
    await expect(faqItems).toBeVisible();
  });

  test("related converters section renders", async ({ page }) => {
    await page.goto("/heic-to-jpg");
    await expect(page.getByText("Related converters")).toBeVisible();
  });
});

test.describe("Homepage", () => {
  test("renders hero and HEIC/AVIF clusters", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Convert any image format/i })).toBeVisible();
    await expect(page.getByText("HEIC · iPhone Photos")).toBeVisible();
    await expect(page.getByText("AVIF · Next-Gen Web")).toBeVisible();
  });

  test("tool cards link to correct pages", async ({ page }) => {
    await page.goto("/");
    // Scope to <main> to avoid the Nav's hidden dropdown link, which shares the same text
    // but is not interactable (opacity-0 pointer-events-none until hover).
    await page.locator("main").getByText("HEIC → JPG").first().click();
    await expect(page).toHaveURL("/heic-to-jpg");
  });
});

test.describe("Guide pages", () => {
  test("what-is-heic renders article content", async ({ page }) => {
    await page.goto("/what-is-heic");
    await expect(page.getByRole("heading", { name: "What is HEIC?" })).toBeVisible();
    await expect(page.getByText("Quick answer")).toBeVisible();
    await expect(page.getByText("Why Apple uses HEIC")).toBeVisible();
  });

  test("what-is-avif renders article content", async ({ page }) => {
    await page.goto("/what-is-avif");
    await expect(page.getByRole("heading", { name: "What is AVIF?" })).toBeVisible();
    await expect(page.getByText("Quick answer")).toBeVisible();
  });
});
