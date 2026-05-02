# DESI Data Share — Project Management Guide

This guide covers the **management page (`/`)** only. For data registration / publishing or recipient-side actions, switch to the "Data sharing (admin)" or "Data sharing (recipient)" tabs at the top of the Help modal.

---

## Table of Contents

1. [What this page does](#1-what-this-page-does)
2. [Login (password)](#2-login-password)
3. [Screen layout](#3-screen-layout)
4. [Creating a new project](#4-creating-a-new-project)
5. [Opening / deleting a project](#5-opening--deleting-a-project)
6. [Pulling the list from the server (works on any PC)](#6-pulling-the-list-from-the-server-works-on-any-pc)
7. [Copying the share URL](#7-copying-the-share-url)
8. [Where data is stored](#8-where-data-is-stored)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. What this page does

- Lists every project you've created (local + server)
- Creates a new project with metadata up front (experiment date, machine, matrix, Google Keep, memo)
- Opens or deletes existing projects
- **Copies the share URL** of a published project in one click
- Pulls the list of published projects from the server (so you can see them from any PC)

Layer registration (HE/IF, MSI) and `Publish to share` happen in the viewer after `Open` (see "Data sharing (admin)").

---

## 2. Login (password)

The management page is gated by an admin password.

- Default is `MSIadomine` (the same value pre-filled in the Publish modal's admin field)
- Once accepted, the unlock state is cached in sessionStorage for **12 h** — no re-prompt
- Closing the tab clears it
- When Supabase is reachable, the password is checked server-side via `list_projects(pw)` (bcrypt)
- When offline, a SHA-256 hash compare is used as a fallback

> This gate is shoulder-surf-level only. Real protection for shared content lives in Supabase (bcrypt).

---

## 3. Screen layout

- **Header**: title + Help button
- **Action row**: `+ 新規プロジェクト` (New project) / `サーバから一覧取得` (Refresh from server)
- **Project list**: each row shows
  - Name + badge (`Local` / `Local + Server` / `Server only`)
  - Experiment date / machine / matrix / Google Keep / first lines of the memo
  - `Open` / `Copy URL` / `Delete`

### Badge meanings

| Badge | Meaning |
| --- | --- |
| **Local** | Only in this browser's IndexedDB (not yet published, or made on another PC, etc.) |
| **Local + Server** | Exists both locally and on the server (you published it from this PC) |
| **Server only** | Only on the server (published from another PC, or local copy was deleted) |

---

## 4. Creating a new project

1. Click `+ 新規プロジェクト`
2. Fill in the metadata form:
   - **Project name** (required)
   - **Experiment date**: `<input type="date">`
   - **Machine**: DESI / TIMS / LTQ / Other
   - **Matrix**: shown only when the machine is non-DESI
   - **Google Keep**: a related note URL (optional)
   - **Memo**: free-form text
3. `Create` redirects to the viewer ready for layer registration

These values appear in the viewer's bottom-right Memo panel automatically.

---

## 5. Opening / deleting a project

- **Open**: jumps to the viewer with that project loaded
  - Local rows → ordinary local edit mode
  - Server-only rows → share mode (asks for the viewer password)
- **Delete**: removes the project from the local IndexedDB only
  - The server copy stays if it was published (the row turns into "Server only")
  - Permanent deletion still has to be done from the Supabase dashboard

---

## 6. Pulling the list from the server (works on any PC)

When you want to see, from this PC, projects you published from a different PC:

1. Click `サーバから一覧取得`
2. Enter the **admin password** (default `MSIadomine`)
3. Every project that has that admin password registered shows up
4. The password is cached in sessionStorage for 12 h (no re-prompt next time)

> If you use a single shared admin password across projects, one entry retrieves the entire catalogue from any PC.

---

## 7. Copying the share URL

Published projects expose a `Copy URL` button.

- Clicking it copies `https://.../viewer/index.html#share=<slug>` to the clipboard
- The button briefly flips to `Copied ✓`
- The viewer (and admin) passwords must be shared **on a separate channel** (Slack, e-mail)

Unpublished projects show a disabled `URL なし` (No URL) button. `Open` → publish in the viewer → return here and `Copy URL` becomes available.

---

## 8. Where data is stored

| Location | What | Scope |
| --- | --- | --- |
| **Local IndexedDB** (`desi-projects`) | Project meta + section structure + ROIs + memo + raw files (TIFF/xlsx/txt) | This browser, this profile |
| **Supabase** (published projects only) | Section structure / ROIs / memo / binaries / bcrypt-hashed passwords | Whole server |
| **localStorage** | Last opened project id, layout sizes | This browser, this profile |
| **sessionStorage** | Admin pw cache, master unlock flag | This tab |

> Important: IndexedDB capacity is not unlimited. Browsers may evict it under storage pressure, so **always use `Publish to share` to back up important projects to the server**.

---

## 9. Troubleshooting

| Symptom | Action |
| --- | --- |
| `Init failed: The requested version (X) is less than the existing version (Y)` | DB schema mismatch. Update to the latest code and hard-reload (Ctrl+F5) |
| Server list refresh errors | The admin pw is wrong, or Supabase is unreachable |
| Copy URL button is missing | Project hasn't been published yet. `Open` → publish in the viewer |
| Password keeps being rejected | Clear cache + reload. If still failing, the admin password may have been changed |
| Projects from another PC not showing | Press `サーバから一覧取得` and re-enter the admin password |
