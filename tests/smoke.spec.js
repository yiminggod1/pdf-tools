const { test, expect } = require("@playwright/test");
const JSZip = require("jszip");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

const routes = [
  "merge-pdf","split-pdf","rotate-pdf","image-to-pdf","pdf-to-jpg","resize-image","compress-image","convert-image",
  "delete-pages-from-pdf","extract-pages-from-pdf","jpg-to-pdf","png-to-pdf","add-pages-to-pdf","reorder-pdf",
  "watermark-pdf","number-pdf-pages","pdf-metadata","crop-image","rotate-image","flip-image","jpg-to-png",
  "png-to-jpg","jpg-to-webp","png-to-webp","webp-to-jpg","webp-to-png","image-to-base64","base64-to-image",
  "add-blank-pages-to-pdf","image-to-html","image-to-markdown","image-to-css"
];

test("all 32 tool pages load with English UI", async ({ page }) => {
  for (const route of routes) {
    await page.goto("http://127.0.0.1:3000/" + route + "/", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("body")).not.toContainText("選擇文件");
    await expect(page.locator("body")).not.toContainText("未選擇任何文件");
    await expect(page.locator("body")).not.toContainText("选择文件");
    await expect(page.locator("body")).not.toContainText("未选择任何文件");
    const picker = page.locator(".filePickerButton").first();
    if (await picker.count()) await expect(picker).toContainText(/Choose file/i);
  }
});

async function makePdf() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([300, 200]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawText("Smoke Test", { x: 40, y: 100, size: 24, font, color: rgb(0, 0, 0) });
  return Buffer.from(await pdf.save());
}

test("PDF to JPG converts a real one-page PDF and downloads a valid ZIP", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/pdf-to-jpg/", { waitUntil: "domcontentloaded" });
  const picker = page.locator(".filePickerButton").first();
  await expect(picker).toBeVisible();
  const chooserPromise = page.waitForEvent("filechooser");
  await picker.click();
  const chooser = await chooserPromise;
  await chooser.setFiles({
    name: "smoke-test.pdf",
    mimeType: "application/pdf",
    buffer: await makePdf()
  });
  await expect(page.getByRole("button", { name: "Convert to JPG" })).toBeEnabled();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Convert to JPG" }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  expect(downloadPath).toBeTruthy();
  const zip = await JSZip.loadAsync(require("fs").readFileSync(downloadPath));
  const names = Object.keys(zip.files);
  expect(names).toEqual(["page-1.jpg"]);
  const jpg = await zip.file("page-1.jpg").async("nodebuffer");
  expect(jpg.subarray(0, 3).toString("hex")).toBe("ffd8ff");
  await expect(page.locator(".notice")).toContainText("converted 1 page(s)");
});
