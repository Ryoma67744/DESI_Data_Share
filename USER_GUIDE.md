# DESI Data Share 利用者ガイド

本書は **DESI Data Share** をブラウザだけで使うための手引きです。
インストール作業は不要で、`viewer/index.html` を開けば動作します。

> 旧 `Marmoset Brain Atlas Viewer` の Supabase 共有モードはこのバージョンでは廃止されました。データはすべてローカル (ブラウザの IndexedDB) に保存され、共有は **ZIP ファイル**で行います。
> 同梱の `USER_GUIDE.pdf` は旧バージョンのもので内容が古いため、本ファイル (Markdown) を真とみなしてください。

---

## 目次

1. [このアプリでできること](#1-このアプリでできること)
2. [起動と画面](#2-起動と画面)
3. [プロジェクトと切片](#3-プロジェクトと切片)
4. [HE / IF レイヤーの登録](#4-he--if-レイヤーの登録)
5. [MSI レイヤーの登録](#5-msi-レイヤーの登録)
6. [ROI の手描きと表示](#6-roi-の手描きと表示)
7. [ANALYSIS（切片並列バーグラフ）](#7-analysis切片並列バーグラフ)
8. [ZIP インポート / エクスポート](#8-zip-インポート--エクスポート)
9. [データの永続化と注意点](#9-データの永続化と注意点)
10. [キーボードショートカット](#10-キーボードショートカット)

---

## 1. このアプリでできること

- 任意の数の **切片パネル** を横並びに表示し、各切片に独立した HE/IF/MSI レイヤーを重ね合わせる
- HE / IF の TIFF (PNG/JPEG も可) を **affine 変換 JSON (`T_he_to_msi`)** とともに登録し、MSI 座標系に整合させる
- 既存形式の MSI **`.xlsx`** (`MSI_Data` シート, Image_X / Image_Y / 強度列) を取り込み、化合物単位でレイヤー化
- `.txt` 形式 (Analyte / 一般 TSV/CSV) の MSI も同様に取り込み可能
- 切片ごとに ROI を手描き登録、複数切片で同名 ROI を共有
- 選択 ROI に対して **化合物 × 切片** の Mean Intensity 比較を切片並列バーグラフで表示
- プロジェクト全体を **1 つの ZIP ファイル**にまとめて共有・受け取り

---

## 2. 起動と画面

### 2-1. 推奨ブラウザ

最新版の Chrome / Edge / Firefox / Safari。画面幅 1280px 以上推奨。

### 2-2. 起動

`viewer/index.html` をブラウザで直接開きます。GitHub Pages 等で公開する場合はルート URL でも可。

### 2-3. 画面構成

```
┌─ Top Bar (Project picker / New / Import / Export / + Section / Delete) ─┐
│                                                                          │
│ SPECIMEN  │     Sections Grid (parallel panels)        │   ANALYSIS      │
│ ROI LIST  │  ┌Section 1┐ ┌Section 2┐ ┌Section 3┐      │  Multi-bar      │
│           │  │canvas   │ │canvas   │ │canvas   │      │  per section    │
│           │  │+ HE/IF  │ │+ HE/IF  │ │+ HE/IF  │      │                 │
│           │  │+ MSI ×  │ │+ MSI ×  │ │+ MSI ×  │      │                 │
│           │  │thumbs   │ │thumbs   │ │thumbs   │      │                 │
│           │  └─────────┘ └─────────┘ └─────────┘      │                 │
└──────────────────────────────────────────────────────────────────────────┘
```

| 領域 | 役割 |
| --- | --- |
| Top Bar | プロジェクト切替・追加・ZIP I/O・切片追加 |
| SPECIMEN | アクティブ切片の検体メタ (ID, Organism, Strain, Age, Sex) を編集 |
| ROI LIST | 全切片共通の ROI 一覧。表示トグル・新規描画・各 ROI の追加描画 |
| Sections Grid | 切片パネルを `auto-fit` の grid で並列表示 (1〜10 切片想定) |
| ANALYSIS | 選択 ROI に対する切片 × 化合物 のバーグラフ |

各切片パネルをクリックすると **アクティブ** (青枠) になり、SPECIMEN 編集と ROI 描画の対象になります。

---

## 3. プロジェクトと切片

### 3-1. 新規プロジェクト

1. Top Bar の **`New`** をクリック
2. プロジェクト名を入力して `Create`
3. 作成直後は切片 0 個。`+ Section` を押して追加

### 3-2. プロジェクト切替

- Top Bar のドロップダウンで保存済みプロジェクトを選択
- 自動で IndexedDB から読み込まれます

### 3-3. プロジェクト削除

`Delete` ボタンでアクティブプロジェクトを削除します。
関連する全レイヤーの blob (TIFF / xlsx / txt) も IndexedDB から消えます。

### 3-4. 切片の追加・削除

- `+ Section` で空の切片パネルを追加
- 各パネル右上の `×` でその切片だけを削除
- ROI 内の該当切片の poly_msi も自動で除去されます

---

## 4. HE / IF レイヤーの登録

各切片パネル右上の **`+ HE/IF`** ボタンから:

1. レイヤー名を選択 (`HE Stain`, `IF Stain`, …, または custom)
2. **画像ファイル**を選択 (TIFF / PNG / JPEG)
   - TIFF は UTIF.js で自動デコードされます
3. **変換 JSON** (任意) を選択。フォーマット:
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
4. `Register` で確定すると MSI 座標系に整合した状態でキャンバスに重なります

> 変換 JSON を省略すると、HE/IF はそのキャンバスサイズで表示されます (位置整合は行われません)。

---

## 5. MSI レイヤーの登録

各切片パネルの **`+ MSI`** ボタンから:

### 5-1. xlsx 形式

1. ソースファイル (`.xlsx`) を選択
2. シート名 (既定: `MSI_Data`) と **ヘッダ行** (既定 4) を確認
3. `Reload columns` で列ラベルを再読込
4. **X 列** / **Y 列** (既定: Image_X, Image_Y) を選択
5. **強度列** を Ctrl/Cmd で複数選択 (各列が独立した MSI レイヤーになります)
   - **末尾 2 列** (`Tissue_ROI`, `Region_ROI` など) は自動でグレーアウトされ選択不可
   - 化合物の CV/CE 違いで重複した列も全て独立レイヤーとして展開できます
6. **Data start row** (既定 5) を確認
7. `Register` で各列ごとに `MSI_<列名>` のレイヤーが作成されます

### 5-2. txt 形式

- Analyte (`Analyte (converted from imzML)`) または一般 TSV/CSV
- レイヤー名 (例 `MSI_DA`) と value column 番号を指定して登録

---

## 6. ROI の手描きと表示

### 6-1. 新規 ROI

1. アクティブにしたい切片パネルをクリック
2. ROI LIST 上の **`+ 新規`** をクリック (描画モード ON)
3. キャンバス上を順にクリックして 3 点以上の頂点を打つ
4. 確定:
   - 最初の頂点をもう一度クリック
   - ダブルクリック
   - **Enter** キー
5. ROI 名を入力 (空欄なら anatomy_palette のキー名)
6. ROI LIST に追加されます (色は anatomy_palette から自動割当)

### 6-2. 既存 ROI を別の切片にも描画

- ROI LIST 各行の **`+ draw`** ボタン → アクティブ切片で描画モード ON
- 同じ `id` の ROI が複数切片の `polysBySection` にまとめて保存されます
- 行の右の `2/3` 等のバッジは「描画済 / 全切片数」を示します

### 6-3. 表示制御

- ROI LIST 各行の **チェックボックス** でその ROI 単体の表示 ON/OFF
- ROI LIST ヘッダの **`Show`** トグルで全 ROI を一括 ON/OFF
- 行の **`×`** で ROI 自体を削除 (全切片分が消えます)

> 描画モード中は他のパネルへの切替はできません。Escape で中止できます。

---

## 7. ANALYSIS（切片並列バーグラフ）

- ROI LIST から ROI を選択すると、その ROI が描画されている **全ての切片** を横軸にしたバーグラフを描きます
- 化合物プルダウン (最大 3 系列) を変えると、グループバーが切り替わります
- バーの **塗り色** は化合物色、**枠線色** は ROI のパレット色
- ROI が 1 切片にしか引かれていなければ、その 1 切片分だけ表示されます

---

## 8. ZIP インポート / エクスポート

### 8-1. Export ZIP

Top Bar の **`Export ZIP`** で、現プロジェクト全体を 1 つの ZIP にまとめて保存します。

```
<project>_<timestamp>.zip
├─ project.json                      ← プロジェクトメタ + ROI 全体
└─ sections/
   └─ <sectionId>/
      ├─ atlas.json                  ← 切片メタ + meta.specimen + 変換情報
      └─ data/
         ├─ img_HE_Stain__<file>.tif
         ├─ img_IF_Stain__<file>.tif (任意)
         └─ msi_MSI_DA__<file>.xlsx  ← User ROI 列を追加した版 (xlsx のみ)
```

xlsx には、その切片で描画されている全 ROI 列が **0/1 のフラグ列**として末尾に追加されます (xlsx 元ファイル末尾 2 列はそのまま温存)。

### 8-2. Import ZIP

1. Top Bar の **`Import ZIP`** をクリック
2. エクスポートされた ZIP を選ぶ
3. 新規プロジェクトとして読み込まれ、自動で開かれます

> Import 時は新しい id が振り直されるため、同じ ZIP を 2 回入れても上書きにはなりません (別プロジェクトとして共存)。

---

## 9. データの永続化と注意点

- **保存先**: ブラウザの IndexedDB (`desi-projects` DB)
  - `projects` ストア: プロジェクトメタ + 切片構造 + ROI
  - `blobs` ストア: TIFF / xlsx / txt の生バイナリ
- 自動保存: 編集後 400ms 以内に IndexedDB に書き込まれます
- ブラウザのプロファイルを変えると別データになります。共有は **必ず ZIP** で
- シークレットウィンドウは閉じると消えるので注意
- 大きな TIFF + 多数化合物 + 切片 5〜10 では Export 生成に数十秒かかることがあります

---

## 10. キーボードショートカット

| キー | 機能 |
| --- | --- |
| `Enter` | 描画モード中: 現在の頂点で ROI を確定 |
| `Escape` | 描画モード中: 中止 |
| `Ctrl + F5` / `Cmd + Shift + R` | ブラウザの強制再読み込み |

---

## ライセンス / フィードバック

実装は単一の `viewer/index.html` (Tailwind / SheetJS / UTIF / JSZip を CDN 利用) で完結しています。
不具合や要望は GitHub の Issues から。
