# DESI Data Share — Admin Guide (Data Sharing)

This guide is for the **master / admin** publishing data with DESI Data Share. If you only need project bookkeeping, see "Project Management". Recipients of a share URL should read "Data sharing (recipient)".

---

## Table of Contents

1. [Overall flow](#1-overall-flow)
2. [Opening a project](#2-opening-a-project)
3. [Registering HE / IF layers](#3-registering-he--if-layers)
4. [Registering MSI layers](#4-registering-msi-layers)
5. [Drawing ROIs](#5-drawing-rois)
6. [Filling in the Memo](#6-filling-in-the-memo)
7. [Publish to share](#7-publish-to-share)
8. [Sharing the URL & passwords](#8-sharing-the-url--passwords)
9. [What happens on re-publish](#9-what-happens-on-re-publish)
10. [Upload progress / large files](#10-upload-progress--large-files)
11. [Storage capacity](#11-storage-capacity)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Overall flow

```
[Manager /]
   │ + New project / Open
   ▼
[Viewer /viewer/]
   │ Register HE/IF/MSI → ROIs → Memo
   ▼
[Publish to share]
   │ slug + viewer pw + admin pw
   ▼
[Share URL + passwords]
   ▼
Send to collaborators (URL and viewer pw on separate channels)
```

---

## 2. Opening a project

- **New**: in the manager, click `+ 新規プロジェクト` → fill in metadata → `Create` → viewer
- **Existing**: click `Open` on a project row in the manager

The viewer's `← Projects` button takes you back to the manager.

---

## 3. Registering HE / IF layers

Click `+ HE/IF` on a section panel:

1. Pick a layer name (`HE Stain` / `IF Stain` / custom)
2. Pick the **image file** (TIFF / PNG / JPEG)
   - TIFF is decoded by UTIF.js automatically
3. Optional: pick the **transform JSON**:
   ```json
   {
     "T_he_to_msi": [
       [-0.283, -0.0005,  87.87],
       [ 0.0005, -0.283, 115.64],
       [ 0.0,    0.0,    1.0  ]
     ],
     "he_um_per_px":  { "x": 0.25, "y": 0.25 },
     "msi_um_per_px": { "x": 50.0, "y": 50.0 }
   }
   ```
4. `Register` overlays the image aligned to the MSI coordinate system

> Without a transform JSON the HE/IF is shown at the bare canvas size (no alignment).

---

## 4. Registering MSI layers

`+ MSI` on a section panel:

### 4-1. xlsx
1. Pick the source `.xlsx`
2. Confirm sheet name (default `MSI_Data`) and **header row** (default 4)
3. `Reload columns` to refresh column labels
4. Pick the **X / Y columns** (default `Image_X`, `Image_Y`)
5. Pick the **intensity columns** (Ctrl/Cmd-click for multi-select; each becomes its own MSI layer)
6. Confirm **Data start row** (default 5)
7. `Register` creates one `MSI_<col>` layer per selected column

### 4-2. txt
- Analyte (`Analyte (converted from imzML)`) or generic TSV/CSV
- Specify a layer name (e.g. `MSI_DA`) and the value column index

---

## 5. Drawing ROIs

1. Click a section panel to make it active
2. Click `+ 新規` in ROI LIST (drawing mode ON)
3. Drop ≥ 3 vertices by clicking on the canvas
4. Finish with: first-vertex click / double-click / **Enter**
5. Type an ROI name

Click `+ draw` on an existing ROI row to extend it onto another section.

> **Escape** during drawing cancels (in-flight vertices are dropped). Multi-section ROIs accumulate in `polysBySection`.

---

## 6. Filling in the Memo

The Memo panel at the bottom right of the viewer:

| Field | Notes |
| --- | --- |
| Sample | sample name |
| Experiment date | date |
| Machine | DESI / TIMS / LTQ / Other |
| Matrix | shown only for non-DESI machines |
| Google Keep | URL of a related note |
| Memo | free text |
| Derivatization | derivatization step |

Values auto-save to IndexedDB (~400 ms debounce). On Publish they're also written to the server's `projects.meta.memo`.

> The Method (MRM) table's **Precursor / Fragment / CE / CV** columns are **admin-only**. Visitors entering with the regular viewer password don't see them; only those who unlock with the admin password do.

---

## 7. Publish to share

The header's `Publish to share` button:

| Field | Meaning |
| --- | --- |
| **Project slug** | URL identifier (alphanumerics, `_`, `-`) |
| **Viewer password** | What recipients type (≥ 4 chars) |
| **Admin password** | Pre-filled with `MSIadomine` (≥ 4 chars) |

Pressing `Publish`:

1. All blobs (TIFF / xlsx / txt) upload to Supabase Storage in parallel (concurrency 4)
2. A progress modal shows live `X / N files (Y MB / Z MB)`
3. Each file retries up to 3 times with exponential backoff
4. On success a Share URL modal opens with URL + viewer/admin passwords

> Read the next section about re-publish behaviour before re-running on a previously-published slug.

---

## 8. Sharing the URL & passwords

- URL: `https://.../viewer/index.html#share=<slug>`
- Send the viewer password on a **separate channel** (Slack, e-mail)
- Only share the admin password with people you want to grant the admin view (full Method table)

> The URL is also accessible later via `Share info` (post-publish) or `Copy URL` on the manager page.

---

## 9. What happens on re-publish

★ Important: **publishing the same slug a second time fully overwrites the server-side project.**

| Item | Behaviour |
| --- | --- |
| `projects` row | display_name / anatomy_palette / meta updated |
| **Viewer password** | **Always** overwritten with the new value |
| **Admin password** | Overwritten if the field is non-empty; otherwise unchanged |
| **sections** table | Wiped and re-inserted |
| **rois** table | **Wiped and re-inserted** (any ROIs added by recipients are gone) |
| **Storage `<slug>/...`** | Same path: upserted; new path: added; **old paths remain (orphans)** |

Caveats:

- ROIs added by recipients via the share URL are **lost on re-publish**
- Existing 12 h session tokens stay valid even after a password change
- Storage orphans accumulate and eat into your Supabase quota (cleanup is a future task)

---

## 10. Upload progress / large files

Already implemented:

- **Parallel uploads** (concurrency = 4)
- **Auto retry** (up to 3 times per file, backoff 800 ms → 1.6 s → 3.2 s)
- **Progress modal** with percentage, files done, MB done, progress bar

Tips for large (~1.5 GB) projects:

- Per section, expect MSI xlsx around 50–500 MB and HE TIFF around 50–300 MB
- A project total over 1 GB blows past the Supabase Free tier — consider **Pro (100 GB)**
- Publish from a stable network if uploading large files

---

## 11. Storage capacity

| Plan | Storage | Bandwidth | Monthly |
| --- | --- | --- | --- |
| Free | 1 GB | 5 GB / month | $0 |
| **Pro** | **100 GB** | **250 GB / month** | **$25** |

Per-file size cap defaults to 50 MB on both plans, raisable to 5 GB from the dashboard settings.

> A 1.5 GB project pretty much requires Pro. The Free tier will hit both storage and bandwidth limits on the very first publish.

---

## 12. Troubleshooting

| Symptom | Action |
| --- | --- |
| Publish errors mid-upload | Progress modal closes and an alert appears. Inspect failed PUTs in DevTools' Network tab and retry |
| `new row violates row-level security policy` | Re-run the storage policies in `share_locks.sql` (see `supabase/README.md`) |
| Storage quota filling up with orphans | Manually delete `<slug>/<oldSectionId>/` from the Supabase Storage dashboard |
| Accidentally published over an existing slug | No undo — be careful with names |
| Forgot the password | In the Supabase SQL Editor, run `select set_project_password('<slug>', 'admin', '<new>');` |
| `サーバから一覧取得` returns 0 rows | The admin pw matches no projects yet (none published, or a different admin pw was used) |
