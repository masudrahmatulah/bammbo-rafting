import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@bammborafting.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "GantiSegera123!";

async function login(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/masuk");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Kata Sandi").fill(password);
  await page.getByRole("button", { name: /Masuk/i }).click();
  await page.waitForURL("/");
}

test.describe("Pendaftaran & verifikasi mitra (docs/13 #4)", () => {
  test("mitra PENDING tidak tampil, setelah admin approve produk muncul di katalog", async ({ page, browser }) => {
    test.setTimeout(60_000);
    const unique = Date.now();
    const mitraEmail = `mitra.e2e.${unique}@example.com`;
    const namaUsaha = `E2E Rafting ${unique}`;
    const namaProduk = `Rafting E2E ${unique}`;

    // 1. Daftar mitra baru -> status PENDING
    await page.goto("/daftar-mitra");
    await page.getByLabel("Jenis Mitra").selectOption("jasa");
    await page.getByLabel("Nama Usaha").fill(namaUsaha);
    await page.getByLabel("Nama Penanggung Jawab").fill("Penanggung Jawab E2E");
    await page.getByLabel("Email").fill(mitraEmail);
    await page.getByLabel("No. KTP/NIB").fill("1234567890123456");
    await page.getByLabel("No. Rekening").fill("1122334455");
    await page.getByLabel("Kata Sandi").fill("RahasiaE2E123!");
    await page.getByRole("button", { name: /Daftar Mitra/i }).click();
    await expect(page.getByText(/Pendaftaran diterima/i)).toBeVisible({ timeout: 15_000 });

    // 2. Login sebagai admin, approve mitra
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto("/admin/mitra");
    const row = page.locator("tr", { hasText: namaUsaha });
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: "Setujui" }).click();
    await expect(page.locator("tr", { hasText: namaUsaha })).toHaveCount(0);

    // 3. Login sebagai mitra yang baru diapprove (context terpisah agar cookie tidak bentrok dengan sesi admin)
    const mitraContext = await browser.newContext();
    const mitraPage = await mitraContext.newPage();
    await login(mitraPage, mitraEmail, "RahasiaE2E123!");
    await mitraPage.goto("/mitra/produk");
    await mitraPage.getByPlaceholder("Nama produk").fill(namaProduk);
    await mitraPage.getByPlaceholder("Harga per orang").fill("150000");
    await mitraPage.getByPlaceholder("Kapasitas per hari").fill("20");
    await mitraPage.getByRole("button", { name: /Tambah Produk/i }).click();
    await expect(mitraPage.getByText(namaProduk)).toBeVisible();

    // 4. Produk muncul di katalog publik
    const publicContext = await browser.newContext();
    const publicPage = await publicContext.newPage();
    await publicPage.goto("/katalog");
    await expect(publicPage.getByText(namaProduk)).toBeVisible();

    await mitraContext.close();
    await publicContext.close();
  });
});
