import { test, expect } from "@playwright/test";

test.describe("Otorisasi per peran (docs/13 #5)", () => {
  test("wisatawan tanpa login diarahkan ke /masuk saat akses panel admin", async ({ page }) => {
    await page.goto("/admin/produk-jasa");
    await expect(page).toHaveURL(/\/masuk/);
  });

  test("wisatawan tanpa login diarahkan ke /masuk saat akses panel mitra", async ({ page }) => {
    await page.goto("/mitra/produk");
    await expect(page).toHaveURL(/\/masuk/);
  });

  test("katalog publik bisa diakses tanpa login", async ({ page }) => {
    await page.goto("/katalog");
    await expect(page).toHaveURL(/\/katalog/);
    await expect(page.getByRole("heading", { name: /Katalog Bammbo Rafting/i })).toBeVisible();
  });
});
