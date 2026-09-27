const { test, expect } = require("@playwright/test");
const JSZip = require("jszip");

const routes = [
  "merge-pdf","split-pdf","rotate-pdf","image-to-pdf","pdf-to-jpg","resize-image","compress-image","convert-image",
  "delete-pages-from-pdf","extract-pages-from-pdf","jpg-to-pdf","png-to-pdf","add-pages-to-pdf","reorder-pdf",
  "watermark-pdf","number-pdf-pages","pdf-metadata","crop-image","rotate-image","flip-image","jpg-to-png",
  "png-to-jpg","jpg-to-webp","png-to-webp","webp-to-jpg","webp-to-png","image-to-base64","base64-to-image",
  "add-blank-pages-to-pdf","image-to-html","image-to-markdown","image-to-css"
];

test("all 32 tool pages load with English UI", async ({ page }) => {
  for (const route of routes) {
    await page.goto("http://127.0.0.1:3000/pdf-tools/" + route + "/", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("body")).not.toContainText("選擇文件");
    await expect(page.locator("body")).not.toContainText("未選擇任何文件");
    await expect(page.locator("body")).not.toContainText("选择文件");
    await expect(page.locator("body")).not.toContainText("未选择任何文件");
    const picker = page.locator(".filePickerButton").first();
    if (await picker.count()) await expect(picker).toContainText(/Choose file/i);
  }
});

function makePdf() {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    "<< /Length 44 >>\\nstream\\nBT /F1 24 Tf 40 100 Td (Smoke Test) Tj ET\\nendstream",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];
  let pdf = "%PDF-1.4\\n";
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf, "binary"));
    pdf += (i + 1) + " 0 obj\\n" + objects[i] + "\\nendobj\\n";
  }
  const xref = Buffer.byteLength(pdf, "binary");
  pdf += "xref\\n0 6\\n0000000000 65535 f \\n";
  for (let i = 1; i <= 5; i++) pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \\n";
  pdf += "trailer\\n<< /Size 6 /Root 1 0 R >>\\nstartxref\\n" + xref + "\\n%%EOF";
  return Buffer.from(pdf, "binary");
}

test("PDF to JPG converts a real one-page PDF and downloads a valid ZIP", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/pdf-tools/pdf-to-jpg/", { waitUntil: "domcontentloaded" });
  const input = page.locator('input[type="file"]').first();
  await expect(input).toBeAttached();
  await input.setInputFiles({
    name: "smoke-test.pdf",
    mimeType: "application/pdf",
    buffer: makePdf()
  });
  await expect(page.locator(".filePickerName")).toContainText("smoke-test.pdf");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Convert to JPG" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  const zip = await JSZip.loadAsync(require("fs").readFileSync(path));
  const names = Object.keys(zip.files);
  expect(names).toEqual(["page-1.jpg"]);
  const jpg = await zip.file("page-1.jpg").async("nodebuffer");
  expect(jpg.subarray(0, 3).toString("hex")).toBe("ffd8ff");
  await expect(page.locator(".notice")).toContainText("converted 1 page(s)");
});
