import { test, expect } from "@playwright/test";

const baseURL = "https://www.navigator.ba/";

test.describe("Navigator.ba Smoke Tests", () => {
  test("TC001 - Verify Homepage Load", async ({ page }) => {
    const response = await page.goto(baseURL);
    await expect(page).toHaveURL("https://www.navigator.ba/#/categories");
    expect(response?.status()).toBe(200); // Check that page loaded successfully with status 200
  });

  test("TC002 - Verify Map Display", async ({ page }) => {
    await page.goto(baseURL);
    const mapElement = page.locator(".leaflet-container");
    await expect(mapElement).toBeVisible(); // Ensure map container is rendered
  });

  test("TC003 - Verify Map Zoom", async ({ page }) => {
    await page.goto(baseURL);
    const zoomInButton = page.locator(".leaflet-control-zoom-in");
    const zoomOutButton = page.locator(".leaflet-control-zoom-out");

    await zoomInButton.click(); // Simulate zoom in
    await zoomOutButton.click(); // Simulate zoom out
    await expect(zoomInButton).toBeEnabled();
    await expect(zoomOutButton).toBeEnabled();
  });

  test("TC004 - Verify Map Dragging", async ({ page }) => {
    await page.goto(baseURL);

    const map = page.locator(".leaflet-container");
    await expect(map).toBeVisible();

    const box = await map.boundingBox(); // Get map container coordinates
    if (box) {
      // Simulate mouse drag across the map
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        box.x + box.width / 2 + 100,
        box.y + box.height / 2
      );
      await page.mouse.up();
    }
    await expect(map).toBeVisible(); // Confirm map is still visible after drag
  });

  test("TC005 - Test Geolocation Permission Granted", async ({ browser }) => {
    // Create new browser context with geolocation permission
    const contextWithGeo = await browser.newContext({
      permissions: ["geolocation"],
      geolocation: { latitude: 43.8563, longitude: 18.4131 },
      locale: "en-US",
    });

    const pageWithGeo = await contextWithGeo.newPage();
    await pageWithGeo.goto(baseURL);

    const locateMeButton = pageWithGeo.locator(
      ".leaflet-control-focusonuser-button"
    );
    await expect(locateMeButton).toBeVisible();
    await locateMeButton.click(); // Click locate me button
  });

  test("TC007 - Search Valid Location", async ({ page }) => {
    await page.goto(baseURL);

    const searchInput = page.locator(
      'input[type="search"], input[id^="ember"]'
    );
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Mrvica");
    await searchInput.press("Enter"); // Submit search

    const searchResultsList = page.locator(
      "ul.menu_content_list.search-results"
    );
    await expect(searchResultsList).toBeVisible();

    const desiredResult = searchResultsList
      .locator("li .name", { hasText: "Mrvica" })
      .first();
    await expect(desiredResult).toBeVisible();
    await desiredResult.click(); // Click on the desired search result

    const popupContent = page.locator(".leaflet-popup-content, .popup-content");
    await expect(popupContent).toBeVisible();
    await expect(popupContent).toContainText("Mrvica"); // Verify the result popup shows correct name
  });

  test("TC009 - Filter by Category", async ({ page }) => {
    await page.goto(baseURL);

    const foodCategoryButton = page.locator(
      "ul.menu_content_list.categories li.food a"
    );
    await expect(foodCategoryButton).toBeVisible();
    await foodCategoryButton.click(); // Filter by food category

    const foodPlacesList = page.locator("ul.menu_content_list > li.place.food");
    await expect(foodPlacesList.first()).toBeVisible();

    const count = await foodPlacesList.count();
    for (let i = 0; i < count; i++) {
      const singlePlace = foodPlacesList.nth(i);
      const className = await singlePlace.getAttribute("class");
      expect(className).toContain("food"); // Verify each listed place belongs to 'food' category
    }
  });

  test("TC010 - View Place Details", async ({ page }) => {
    await page.goto(baseURL);

    const foodCategoryButton = page.locator(
      "ul.menu_content_list.categories li.food a"
    );
    await expect(foodCategoryButton).toBeVisible();
    await foodCategoryButton.click();

    const foodPlacesList = page.locator("ul.menu_content_list > li.place.food");
    await expect(foodPlacesList.first()).toBeVisible();

    const firstFoodPlace = foodPlacesList.first().locator(".name");
    await firstFoodPlace.click(); // Open first food place details

    const placeDetailsPanel = page.locator(
      ".place_details, .left-menu-pane.place_details"
    );
    await expect(placeDetailsPanel).toBeVisible();

    // Check basic details are displayed
    const placeName = placeDetailsPanel.locator(".header-bar .name");
    await expect(placeName).toBeVisible();
    await expect(await placeName.textContent()).not.toBeNull();
    await expect(await placeName.textContent()).not.toBe("");

    const placeCategory = placeDetailsPanel.locator(
      ".profile-image-link .categories"
    );
    await expect(placeCategory).toBeVisible();
    await expect(await placeCategory.textContent()).not.toBeNull();

    const address = placeDetailsPanel.locator(".address, .place-info .address");
    await expect(address).toBeVisible();

    const phone = placeDetailsPanel.locator(".phone, .place-info .phone");
    await expect(phone).toBeVisible();

    const email = placeDetailsPanel.locator(".email, .place-info .email");
    if (await email.isVisible()) {
      await expect(email).toBeVisible(); // Check email only if visible
    }

    const openingHours = placeDetailsPanel.locator(
      ".opening-hours, .place-info .hours"
    );
    if (await openingHours.isVisible()) {
      await expect(openingHours).toBeVisible(); // Same for opening hours
    }

    const websiteLink = placeDetailsPanel.locator(
      ".website a, .place-info a[href*='http']"
    );
    if (await websiteLink.isVisible()) {
      await expect(websiteLink).toHaveAttribute("href", /http/); // Validate website link format
    }
  });

  test("TC020 - Create Place with Valid Data", async ({ page }) => {
    await page.goto(baseURL);

    const createPlaceButton = page.locator('a[href="#/create-place"]');
    await expect(createPlaceButton).toBeVisible();
    await createPlaceButton.click(); // Navigate to 'Create Place' form

    // Fill fields
    await page.fill('input[name="poi[name]"]', "Test Place Name");
    await page.fill('input[name="poi[city_name]"]', "Sarajevo");
    await page.fill('input[name="poi[zip_code]"]', "71000");
    await page.fill('input[name="poi[street_name]"]', "Titova");
    await page.fill('input[name="poi[house_number]"]', "5A");
    await page.fill(
      'textarea[name="poi[description]"]',
      "This is a test place created by automated test."
    );

    // Select a category
    const addCategoryButton = page.locator(
      'div.category-selector-container button.btn.btn-small[type="button"]'
    );
    await expect(addCategoryButton).toBeVisible();
    await addCategoryButton.click();

    const categoryDropdown = page.locator(
      ".category-selector-view .span3 select"
    );
    await expect(categoryDropdown).toBeVisible();
    const options = await categoryDropdown.locator("option").all();
    if (options.length > 1) {
      const firstValidOption = await options[1].getAttribute("value");
      await categoryDropdown.selectOption(firstValidOption); // Select the first available category
    }

    // Fill additional details
    await page.fill("#working_hours_0_0", "08:00");
    await page.fill("#working_hours_0_1", "16:00");
    await page.fill("#poi_phone", "033222333");
    await page.fill("#poi_web", "http://testplace.ba");
    await page.fill("#poi_email", "info@testplace.ba");

    const submitButton = page.locator(".submit-container button.btn-success");
    await expect(submitButton).toBeVisible();

    // Wait for the POST request confirming creation
    const [response] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/places/") &&
          response.request().method() === "POST"
      ),
      submitButton.click(),
    ]);

    expect(response.ok()).toBeTruthy(); // Check if place creation succeeded
  });

  test("TC029 - Language Selection", async ({ page }) => {
    await page.goto(baseURL);

    // Switch to English
    await page.locator('ul.navigation.languages a[data-ga-label="en"]').click();
    await expect(
      page.locator('input[placeholder="Search street or place"]')
    ).toBeVisible();
    await expect(
      page.locator("ul.navigation.left >> text=Create Place")
    ).toBeVisible();
    await expect(
      page.locator(
        "ul.navigation.left >> text=Suggest features - Report a problem"
      )
    ).toBeVisible();

    // Switch back to Bosnian
    await page.locator('ul.navigation.languages a[data-ga-label="bs"]').click();
    await expect(
      page.locator('input[placeholder="Traži ulicu ili objekat"]')
    ).toBeVisible();
    await expect(
      page.locator("ul.navigation.left >> text=Kreiraj objekat")
    ).toBeVisible();
    await expect(
      page.locator(
        "ul.navigation.left >> text=Predloži ideju - Pošalji komentar"
      )
    ).toBeVisible();
  });

  test("TC031 - Mobile Responsiveness", async ({ browser }) => {
    // Launch page with mobile viewport (iPhone 11 dimensions)
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)...",
    });
    const page = await context.newPage();
    await page.goto(baseURL);

    const mapButton = page.locator("#mapBtnMenu");
    await mapButton.click(); // Open map in mobile layout

    const map = page.locator(".leaflet-container");
    await expect(map).toBeVisible();
  });

  test("TC032 - Browser Compatibility", async ({ page }) => {
    await page.goto(baseURL);

    const map = page.locator(".leaflet-container");
    await expect(map).toBeVisible(); // Map should load in default browser configuration
  });
});
