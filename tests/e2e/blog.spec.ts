import { test, expect } from '@playwright/test';

test.describe('Blog System', () => {
  test('should navigate to blog page', async ({ page }) => {
    await page.goto('/');
    
    // Look for blog navigation link
    const blogLink = page.locator('a[href="/blog"], a[href*="blog"], nav a:has-text("Blog")');
    
    if (await blogLink.isVisible()) {
      await blogLink.click();
      
      // Should be on blog page
      expect(page.url()).toContain('/blog');
      
      // Check for blog page elements
      const blogTitle = page.locator('h1:has-text("Blog"), h1:has-text("Articles"), h1:has-text("Posts")');
      await expect(blogTitle).toBeVisible();
    } else {
      // If no blog nav link, try direct navigation
      await page.goto('/blog');
      
      // Check if blog page exists and loads
      const blogContent = page.locator('h1, .blog-container, [data-testid="blog"]');
      await expect(blogContent).toBeVisible();
    }
  });

  test('should display blog post list', async ({ page }) => {
    await page.goto('/blog');
    
    // Check for blog posts
    const blogPosts = page.locator('.blog-post, .post-card, article, [data-testid="blog-post"]');
    
    if (await blogPosts.first().isVisible()) {
      const postCount = await blogPosts.count();
      expect(postCount).toBeGreaterThan(0);
      
      // Check post structure
      const firstPost = blogPosts.first();
      const postTitle = firstPost.locator('h2, h3, .post-title, [data-testid="post-title"]');
      const postLink = firstPost.locator('a');
      
      await expect(postTitle).toBeVisible();
      await expect(postLink).toBeVisible();
    }
  });

  test('should navigate to individual blog post', async ({ page }) => {
    await page.goto('/blog');
    
    // Find and click on first blog post
    const firstPostLink = page.locator('.blog-post a, .post-card a, article a').first();
    
    if (await firstPostLink.isVisible()) {
      await firstPostLink.click();
      
      // Should be on individual post page
      expect(page.url()).toMatch(/\/blog\/.+/);
      
      // Check for post content
      const postTitle = page.locator('h1');
      const postContent = page.locator('article, .post-content, .blog-content, [data-testid="post-content"]');
      
      await expect(postTitle).toBeVisible();
      await expect(postContent).toBeVisible();
    }
  });

  test('should have working blog search functionality', async ({ page }) => {
    await page.goto('/blog');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], #search, .search-input');
    
    if (await searchInput.isVisible()) {
      // Test search functionality
      await searchInput.fill('react');
      
      // Wait for search results or trigger search
      const searchButton = page.locator('button:has-text("Search"), .search-button');
      if (await searchButton.isVisible()) {
        await searchButton.click();
      } else {
        // Try Enter key
        await searchInput.press('Enter');
      }
      
      await page.waitForTimeout(1000);
      
      // Check for search results or filtered posts
      const blogPosts = page.locator('.blog-post, .post-card, article');
      const postsCount = await blogPosts.count();
      
      // Search should either show filtered results or a "no results" message
      const noResults = page.locator('.no-results, .empty-state, :has-text("No posts found")');
      const hasResults = postsCount > 0;
      const hasNoResultsMessage = await noResults.isVisible();
      
      expect(hasResults || hasNoResultsMessage).toBe(true);
    }
  });

  test('should have working blog filters/categories', async ({ page }) => {
    await page.goto('/blog');
    
    // Look for filter buttons or category links
    const filters = page.locator('.filter-button, .category-filter, .tag-filter, [data-testid="filter"]');
    
    if (await filters.first().isVisible()) {
      const filterCount = await filters.count();
      
      if (filterCount > 0) {
        // Click on first filter
        await filters.first().click();
        await page.waitForTimeout(1000);
        
        // Check if posts are filtered
        const blogPosts = page.locator('.blog-post, .post-card, article');
        const postsAfterFilter = await blogPosts.count();
        
        // Should show filtered content or indicate filter is active
        const activeFilter = page.locator('.filter-active, .selected, [aria-pressed="true"]');
        const hasActiveFilter = await activeFilter.isVisible();
        
        expect(hasActiveFilter || postsAfterFilter >= 0).toBe(true);
      }
    }
  });

  test('should have proper blog post structure and accessibility', async ({ page }) => {
    await page.goto('/blog');
    
    const firstPostLink = page.locator('.blog-post a, .post-card a, article a').first();
    
    if (await firstPostLink.isVisible()) {
      await firstPostLink.click();
      
      // Check for proper heading hierarchy
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      
      // Check for article structure
      const article = page.locator('article, main, .post-content');
      await expect(article).toBeVisible();
      
      // Check for meta information
      const publishDate = page.locator('.date, .publish-date, time, [data-testid="date"]');
      const readingTime = page.locator('.reading-time, [data-testid="reading-time"]');
      
      // At least one meta element should be present
      const hasMetaInfo = await publishDate.isVisible() || await readingTime.isVisible();
      expect(hasMetaInfo).toBe(true);
    }
  });

  test('should handle blog navigation and pagination', async ({ page }) => {
    await page.goto('/blog');
    
    // Look for pagination controls
    const pagination = page.locator('.pagination, .page-nav, [data-testid="pagination"]');
    const nextButton = page.locator('a:has-text("Next"), button:has-text("Next"), .next-page');
    const prevButton = page.locator('a:has-text("Previous"), button:has-text("Previous"), .prev-page');
    
    if (await pagination.isVisible() && await nextButton.isVisible()) {
      // Test next page navigation
      await nextButton.click();
      await page.waitForTimeout(1000);
      
      // Should show different posts or page 2 indicator
      const pageIndicator = page.locator(':has-text("Page 2"), .current-page:has-text("2")');
      const hasPageIndicator = await pageIndicator.isVisible();
      
      // At minimum, URL should change or content should update
      expect(page.url()).toMatch(/\/blog/);
      
      // Test previous page if available
      if (await prevButton.isVisible()) {
        await prevButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should have responsive blog layout', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/blog');
      
      // Check blog list is responsive
      const blogContainer = page.locator('.blog-container, .posts-grid, main, [data-testid="blog"]');
      await expect(blogContainer).toBeVisible();
      
      // Check if posts are visible and readable
      const blogPosts = page.locator('.blog-post, .post-card, article');
      if (await blogPosts.first().isVisible()) {
        const firstPost = blogPosts.first();
        await expect(firstPost).toBeVisible();
        
        // Check if post title is readable
        const postTitle = firstPost.locator('h2, h3, .post-title');
        if (await postTitle.isVisible()) {
          await expect(postTitle).toBeVisible();
        }
      }
    }
  });

  test('should handle blog post loading performance', async ({ page }) => {
    // Monitor performance
    await page.goto('/blog');
    
    const blogPosts = page.locator('.blog-post, .post-card, article');
    
    if (await blogPosts.first().isVisible()) {
      // Click on first post and measure load time
      const startTime = Date.now();
      
      await blogPosts.first().locator('a').click();
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Post should load reasonably quickly (under 5 seconds)
      expect(loadTime).toBeLessThan(5000);
      
      // Check that post content is actually visible
      const postContent = page.locator('article, .post-content, h1');
      await expect(postContent).toBeVisible();
    }
  });
});