// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Location Page: Malviya Nagar', () => {
  test('displays correct marketplace content and filters appropriately', async ({ page }) => {
    // 1. Open the page (this also tests the redirect if we go to /malviya-nagar, but let's test the direct route)
    await page.goto('/locations/malviya-nagar');
    
    // 2. Confirm successful load and title
    // Note: The title might be 'Malviya Nagar Marketplace' or customized via DB
    await expect(page).toHaveTitle(/Malviya Nagar/i);
    
    // 3. Confirm heading contains Malviya Nagar
    const heading = page.locator('h1');
    await expect(heading).toContainText('Malviya Nagar');
    
    // 4. Confirm no raw errors
    await expect(page.locator('text=Internal Server Error')).toHaveCount(0);
    
    // 5. Check breadcrumbs
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs).toContainText('Malviya Nagar');
    
    // 6. Verify Category Strip
    // Depending on DB state, the category strip might not render if there are 0 active stores,
    // so we handle conditionally or mock the DB for the test. 
    // Assuming DB has seed data:
    const storeCards = page.locator('[data-testid="store-card"]');
    const storeCount = await storeCards.count();

    if (storeCount > 0) {
      // 7. Verify Store Grid links
      const firstStoreCard = storeCards.first();
      await expect(firstStoreCard).toBeVisible();
      const href = await firstStoreCard.getAttribute('href');
      expect(href).toMatch(/\/store\/.+/);

      // Verify open status badge exists
      await expect(firstStoreCard.locator('text=Open').or(firstStoreCard.locator('text=Closed'))).toBeVisible();
    } else {
      // 8. Verify Empty State if no stores
      await expect(page.locator('text=No stores found')).toBeVisible();
    }
    
    // 9. Verify Trust Strip
    await expect(page.locator('text=Verified Local Brands')).toBeVisible();
    await expect(page.locator('text=Fast & Safe Delivery')).toBeVisible();
    
    // 10. Check Mobile layout (no horizontal overflow)
    await page.setViewportSize({ width: 390, height: 844 });
    const boundingBox = await page.evaluate(() => {
      return {
        width: document.documentElement.scrollWidth,
        windowWidth: window.innerWidth
      };
    });
    expect(boundingBox.width).toBeLessThanOrEqual(boundingBox.windowWidth);
  });
});
