# Publishing the review site on GitHub Pages

The review site will be at **https://YOUR-USERNAME.github.io/shivaswarodaya/**. Search engines are asked not to list it while it is in review.

This folder is already prepared so that links and images work under the `/shivaswarodaya/` address. One file, the publishing instructions for GitHub (the "workflow"), is added directly on github.com in Part 2, because Claude is not allowed to create that type of file on your computer.

You need: your GitHub account, and the **GitHub Desktop** app (https://desktop.github.com), signed in to that account.

---

## Part 1 · Put the folder on GitHub (once)

1. Open **GitHub Desktop**.
2. Choose **File → Add local repository…**
3. Click **Choose…** and select this folder: `Ma's Project\shivaswarodaya-site`. Click **Add repository**.
4. GitHub Desktop says the folder is not a Git repository yet. Click **create a repository**.
5. In the form:
   - **Name:** `shivaswarodaya` (all lower case; the web address uses this name)
   - **Description:** Shiva Swarodaya website (review)
   - **Git ignore:** None (the folder already has one)
   - **License:** None
   Click **Create repository**.
6. Click **Publish repository** (top bar).
7. **Untick "Keep this code private"**. (Free GitHub Pages works only from public repositories.)
8. Click **Publish repository**. The files are now on github.com.

## Part 2 · Switch on GitHub Pages and add the workflow (once)

1. In GitHub Desktop choose **Repository → View on GitHub**. The repository opens in your browser.
2. Click **Settings** (top row of the repository), then **Pages** (left menu).
3. Under **Build and deployment → Source**, choose **GitHub Actions**. (It saves straight away.)
4. Click the **Code** tab (top row), then **Add file → Create new file**.
5. In the file name box type exactly: `.github/workflows/deploy.yml`
   (typing the `/` creates the folders automatically).
6. Paste everything in the grey box below into the large text area:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Get the site files
        uses: actions/checkout@v7
      - name: Build the site
        uses: withastro/action@v6
        env:
          # Review address: https://<username>.github.io/<repository>/
          SITE: https://${{ github.repository_owner }}.github.io
          BASE: /${{ github.event.repository.name }}
          # Ask search engines not to list the site while it is in review.
          # Change to 'false' when the site goes live.
          PUBLIC_NOINDEX: 'true'

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Publish to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

7. Click **Commit changes…**, then **Commit changes** again in the pop-up.
8. Click the **Actions** tab. A run called **Deploy to GitHub Pages** has started. Wait about 2 minutes, until it shows a green tick.
9. Go back to **Settings → Pages**. At the top it shows **"Your site is live at https://YOUR-USERNAME.github.io/shivaswarodaya/"**. Click **Visit site**.
10. In **GitHub Desktop**, click **Fetch origin**, then **Pull origin**, so your computer also has the new file.

Send the link to Ma. She does not need a GitHub account; she can open it on her phone or computer and send comments by WhatsApp or email.

## Part 3 · Publishing updates (every time)

When Claude has updated files in the folder:

1. Open **GitHub Desktop**. The changed files are listed on the left.
2. At the bottom left, type a short summary (for example "About page edits").
3. Click **Commit to main**.
4. Click **Push origin** (top bar).
5. About 2 minutes later the site is updated. Refresh the page (on a phone, close and reopen the tab if the old version shows).

## If something goes wrong

- **Page not found (404):** wait 2 minutes and refresh. Check that the address ends in `/shivaswarodaya/`.
- **Site shows but without colours or images:** the repository name must be exactly the name in the address. If you named it differently, use that name in the address.
- **Red cross in the Actions tab:** click the failed run, take a screenshot of the error, and share it with Claude.

## Later: moving to shivaswarodaya.com

When the site is ready to launch, two lines in `.github/workflows/deploy.yml` change (remove the `BASE` line, set `PUBLIC_NOINDEX` to `'false'`); you can edit the file on github.com with the pencil icon. You then add the domain under **Settings → Pages → Custom domain** and create the DNS records GitHub shows at your domain registrar.

Files that stay only on your computer (not uploaded): `preview/`, `Open Website Preview.html`, `preview.bat`.
