const { test, expect } = require("@playwright/test");

const routes = [
  "merge-pdf","split-pdf","rotate-pdf","image-to-pdf","pdf-to-jpg","pdf-to-png","resize-image","compress-image","convert-image",
  "delete-pages-from-pdf","extract-pages-from-pdf","jpg-to-pdf","png-to-pdf","add-pages-to-pdf","reorder-pdf",
  "watermark-pdf","number-pdf-pages","pdf-metadata","crop-image","rotate-image","flip-image","jpg-to-png",
  "png-to-jpg","jpg-to-webp","png-to-webp","webp-to-jpg","webp-to-png","image-to-base64","base64-to-image",
  "add-blank-pages-to-pdf","image-to-html","image-to-markdown","image-to-css"
];

test("all 33 tool pages load with English UI", async ({ page }) => {
  for (const route of routes) {
    await page.goto("http://127.0.0.1:3000/" + route + "/", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("body")).not.toContainText("選擇文件");
    await expect(page.locator("body")).not.toContainText("未選擇任何文件");
    await expect(page.locator("body")).not.toContainText("选择文件");
    await expect(page.locator("body")).not.toContainText("未选择任何文件");
    const picker = page.locator(".filePickerButton").first();
    if (await picker.count()) await expect(picker).toContainText(/Choose/i);
  }
});
