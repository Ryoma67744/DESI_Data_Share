# DESI Data Share — User Guide

This guide explains how to use **DESI Data Share** straight from a browser.
No installation is required: just open `viewer/index.html`.

> The Supabase share mode of the legacy `Marmoset Brain Atlas Viewer` has been re-implemented in this version. The Master edits everything locally (browser IndexedDB) and can publish a share URL via `Publish to share`. Recipients open that URL in a read-centric viewer mode.
> The bundled `USER_GUIDE.pdf` is from the previous version and is out of date — treat this Markdown file as the source of truth.

---

## Table of Contents

1. [What this app can do](#1-what-this-app-can-do)
2. [Launch & layout](#2-launch--layout)
3. [Projects and sections](#3-projects-and-sections)
4. [Drawing and showing ROIs](#4-drawing-and-showing-rois)
5. [ANALYSIS (parallel bar chart)](#5-analysis-parallel-bar-chart)
6. [ZIP import / export](#6-zip-import--export)
7. [What gets saved vs discarded](#7-what-gets-saved-vs-discarded)
8. [Keyboard shortcuts](#8-keyboard-shortcuts)

---

## 1. What this app can do

- Render any number of **section panels** side by side, each with its own HE/IF/MSI layer stack
- Register HE / IF TIFFs (PNG/JPEG also accepted) together with an **affine transform JSON (`T_he_to_msi`)** so they line up with MSI coordinates
- Import existing MSI **`.xlsx`** files (`MSI_Data` sheet, Image_X / Image_Y / intensity columns) and split them per compound
- Import MSI **`.txt`** files (Analyte format or generic TSV/CSV) the same way
- Hand-draw ROIs on each section, sharing the same ROI across multiple sections
- Compare the **mean intensity** of a selected ROI across compounds × sections in a parallel bar chart
- Distribute the entire project as a single **ZIP file** or as a **share URL**

---

## 2. Launch & layout

### 2-1. Recommended browsers

Latest Chrome / Edge / Firefox / Safari. Window width ≥ 1280 px is recommended.

### 2-2. Launching

Open `viewer/index.html` directly, or visit your published GitHub Pages URL. Opening a share URL (`#share=<slug>`) automatically enters viewer mode.

### 2-3. Screen layout

<div style="border:1px solid #475569;border-radius:6px;overflow:hidden;font-size:11px;margin:10px 0;background:#fff;">
  <div style="background:#1e293b;color:#fff;padding:6px 10px;font-weight:600;letter-spacing:0.02em;">
    Top Bar &nbsp;—&nbsp; Project picker / New / Import ZIP / Export ZIP / Publish to share / Share info / + Section / Delete / Help
  </div>
  <div style="display:grid;grid-template-columns:170px 1fr 220px;">
    <div style="background:#f8fafc;padding:8px;border-right:1px solid #cbd5e1;">
      <div style="font-weight:600;color:#0f172a;">ROI LIST</div>
      <ul style="margin:6px 0 0 1em;padding:0;color:#475569;font-size:11px;line-height:1.5;">
        <li>+ New / Show toggle</li>
        <li>Per-ROI checkbox &amp; delete</li>
      </ul>
    </div>
    <div style="padding:8px;background:#fff;">
      <div style="font-weight:600;color:#0f172a;margin-bottom:4px;">Sections Grid</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
        <div style="border:1px solid #cbd5e1;padding:6px;border-radius:4px;background:#f8fafc;">
          <div style="font-weight:600;font-size:11px;">Section 1</div>
          <div style="color:#64748b;font-size:11px;">canvas</div>
          <div style="color:#64748b;font-size:11px;">+ HE/IF / + MSI</div>
          <div style="color:#64748b;font-size:11px;">thumbs</div>
        </div>
        <div style="border:1px solid #cbd5e1;padding:6px;border-radius:4px;background:#f8fafc;">
          <div style="font-weight:600;font-size:11px;">Section 2</div>
          <div style="color:#64748b;font-size:11px;">canvas</div>
          <div style="color:#64748b;font-size:11px;">+ HE/IF / + MSI</div>
          <div style="color:#64748b;font-size:11px;">thumbs</div>
        </div>
        <div style="border:1px solid #cbd5e1;padding:6px;border-radius:4px;background:#f8fafc;">
          <div style="font-weight:600;font-size:11px;">Section 3</div>
          <div style="color:#64748b;font-size:11px;">canvas</div>
          <div style="color:#64748b;font-size:11px;">+ HE/IF / + MSI</div>
          <div style="color:#64748b;font-size:11px;">thumbs</div>
        </div>
      </div>
      <div style="margin-top:8px;padding:6px;border:1px dashed #cbd5e1;border-radius:4px;background:#fafafa;">
        <div style="font-weight:600;color:#0f172a;font-size:11px;">Method (MRM)</div>
        <div style="color:#64748b;font-size:11px;">Compound / Precursor / Product / CE / CV / Range</div>
      </div>
    </div>
    <div style="background:#f8fafc;padding:8px;border-left:1px solid #cbd5e1;">
      <div style="font-weight:600;color:#0f172a;">ANALYSIS</div>
      <ul style="margin:6px 0 8px 1em;padding:0;color:#475569;font-size:11px;line-height:1.5;">
        <li>Section-parallel bar chart</li>
        <li>Up to 3 compound series</li>
      </ul>
      <div style="font-weight:600;color:#0f172a;">Memo</div>
      <ul style="margin:6px 0 0 1em;padding:0;color:#475569;font-size:11px;line-height:1.5;">
        <li>Sample / Machine / Matrix …</li>
      </ul>
    </div>
  </div>
</div>

| Region | Role |
| --- | --- |
| Top Bar | Project picker, ZIP I/O, Publish to share, add section, Help |
| ROI LIST | Project-wide ROI list. Show toggle, draw new, draw on extra section |
| Sections Grid | Section panels in an `auto-fit` grid (1 – 10 sections expected) |
| Method (MRM) | MSI layer table for the active section. Click to switch display |
| ANALYSIS | Bar chart of the selected ROI across sections × compounds |
| Memo | Specimen metadata (Sample / Machine / Matrix / Google Keep / +α …) |

Click a section panel to make it **active** (blue outline). The active panel is the target for ROI drawing and Method operations.

> When opened via a share URL (`#share=<slug>`), all editing buttons (`+ Section`, `Delete`, registration buttons) are hidden and a `Share view` badge appears in the header.

---

## 3. Projects and sections

### 3-1. New project

1. Click **`New`** in the Top Bar
2. Enter a project name and click `Create`
3. The project starts empty — click `+ Section` to add slices

### 3-2. Switching projects

- Pick a saved project from the Top Bar dropdown
- It is reloaded from IndexedDB automatically

### 3-3. Deleting a project

The `Delete` button removes the active project together with **all of its blobs** (TIFF / xlsx / txt) from IndexedDB.

### 3-4. Adding / removing sections

- `+ Section` adds an empty section panel
- `×` on a panel header deletes only that section
- `poly_msi` entries for that section inside any ROI are also removed

> **Share mode** does not allow adding or removing sections (the buttons are hidden).

---

## 4. Drawing and showing ROIs

### 4-1. New ROI

1. Click the section panel you want to make active
2. Click **`+ New`** in ROI LIST (drawing mode ON)
3. Click on the canvas to drop ≥ 3 vertices in order
4. To finish:
   - Click the first vertex again, or
   - Double-click, or
   - Press **Enter**
5. Type an ROI name (defaults to a key from the anatomy palette)
6. The ROI is added to ROI LIST (colour assigned automatically)

### 4-2. Drawing the same ROI on another section

- Click **`+ draw`** next to the ROI in the list → drawing mode ON for the active section
- The same ROI `id` accumulates polygons in `polysBySection`
- The right-side `2/3` badge means "drawn on / total sections"

### 4-3. Visibility control

- Per-row **checkbox** toggles a single ROI on/off
- The **`Show`** switch in the ROI LIST header toggles all ROIs
- The **`×`** button removes the ROI entirely (across every section)

> While drawing you cannot switch sections. Press Escape to cancel.

> In **share mode**, ROI editing is permitted **only after acquiring an exclusive lock** (one writer at a time). Other viewers must wait until the lock is released.

---

## 5. ANALYSIS (parallel bar chart)

- Select an ROI from ROI LIST to render a bar chart whose x-axis is **every section that ROI is drawn on**
- Up to 3 compound dropdowns let you compare grouped series
- The **fill colour** is the compound colour; the **outline colour** is the ROI palette colour
- If an ROI is drawn on a single section, only that section appears

---

## 6. ZIP import / export

### 6-1. Export ZIP

`Export ZIP` in the Top Bar bundles the entire active project into one zip:

```
<project>_<timestamp>.zip
├─ project.json                      ← project meta + all ROIs
└─ sections/
   └─ <sectionId>/
      ├─ atlas.json                  ← section meta + meta.specimen + transforms
      └─ data/
         ├─ img_HE_Stain__<file>.tif
         ├─ img_IF_Stain__<file>.tif (optional)
         └─ msi_MSI_DA__<file>.xlsx  ← xlsx with appended User-ROI flag columns
```

Each xlsx has **0/1 flag columns** appended for every ROI drawn on that section (the original file's last 2 columns are preserved).

> The ZIP **does not contain the share URL or passwords**. To distribute via URL, use `Publish to share` instead.

### 6-2. Import ZIP

1. Click **`Import ZIP`** in the Top Bar
2. Pick a previously exported zip
3. It is imported as a brand-new project and opened automatically

> Import always assigns fresh ids, so importing the same zip twice yields two separate projects rather than overwriting one.

---

## 7. What gets saved vs discarded

DESI Data Share has **two storage targets**:

- **Local IndexedDB** — your browser, per profile (gone when an incognito window closes)
- **Supabase server** — only for projects that were `Publish to share`-d. Shared by every viewer

Behaviour differs by mode.

### 7-1. Master mode (your editing screen)

| Item | Storage | Notes |
| --- | --- | --- |
| Project name, section structure | IndexedDB | Auto-saved ~400 ms after each change |
| HE / IF / MSI layer settings | IndexedDB | Range / Opacity / Rotation / marker colour persisted |
| Registered files (TIFF / xlsx / txt) | IndexedDB | Stored as blobs |
| ROIs (vertices / name / colour / per-section) | IndexedDB | Auto-saved |
| Memo (Sample / Machine / Matrix …) | IndexedDB | Auto-saved |
| Active section / view mode (Free / Compound) / focus compound | localStorage | Restored on next launch |
| Share URL / passwords (after Publish) | IndexedDB | Re-displayed via `Share info`. Local only — the server never receives them in cleartext |

→ Practically every action by the master is **auto-saved**. Nothing is silently dropped.

### 7-2. Publish to share

| Item | Storage | Notes |
| --- | --- | --- |
| Section structure / meta / transforms | Supabase tables | Re-publishing the same slug **overwrites the entire project** |
| HE / IF / MSI binaries | Supabase Storage (`atlases` bucket) | Public-read; the security model assumes anyone with the URL may fetch the bytes |
| All ROIs | Supabase tables | The previous server-side ROI set is replaced |
| Viewer / Admin passwords | Supabase tables (bcrypt) | Cleartext is never sent to the server; the master keeps it locally only |
| Memo / Range / marker colours | **Not** sent to the server | These remain master-local |

> Re-publishing under the same slug overwrites the server-side project, including ROIs.

### 7-3. Share mode (recipient, opened via `#share=<slug>`)

| Item | What happens |
| --- | --- |
| Adding / editing / deleting ROIs | **Pushed to the server immediately**. Other viewers must wait while you hold the write lock |
| Up-to-12-hour session | Stored in sessionStorage (lost when the tab closes) |
| HE / IF / MSI files | Fetched from the server and cached in IndexedDB for that tab |
| Layer on/off, Range, Opacity, marker colour, view mode | Editable for display purposes, but **reverted to the server state on the next reload** |
| Memo edits | Same — discarded on reload |
| Aborting drawing (Escape / leaving mid-draw) | Vertices in flight are dropped. Without finishing (Enter / first-vertex click) nothing is sent to the server |

→ In share mode, only **ROIs are persisted**. Visual tweaks (range, colours, memo) are session-only and reset on reload.

### 7-4. Caveats

- A different browser profile is a different dataset. To hand a project to another master, **always use ZIP**. To let a collaborator browse, use **`Publish to share`** and share the URL
- Incognito windows lose everything when closed
- Large TIFFs × many compounds × 5 – 10 sections can take tens of seconds (or longer) to export or publish
- IndexedDB capacity depends on the browser — Chrome / Edge usually allow several GB, but content can be evicted under storage pressure. **Back up important projects as a ZIP.**

---

## 8. Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Enter` | Drawing mode: commit the ROI at the current vertex set |
| `Escape` | Drawing mode: cancel |
| `Ctrl + F5` / `Cmd + Shift + R` | Browser hard reload |

---

## License / feedback

The implementation lives in a single `viewer/index.html` (Tailwind / SheetJS / UTIF / JSZip / supabase-js / marked / DOMPurify, all loaded via CDN).
Bug reports and feature requests welcome at the GitHub Issues page.
