# DESI Data Share 利用者ガイド

本書は **DESI Data Share** をブラウザだけで使うための手引きです。
インストール作業は不要で、`viewer/index.html` を開けば動作します。

> 旧 `Marmoset Brain Atlas Viewer` の Supabase 共有モードはこのバージョンで再実装されました。Master はローカル (ブラウザの IndexedDB) でデータを編集し、`Publish to share` で共有 URL を発行できます。共有を受けた viewer 側は読み取り中心の閲覧モードになります。
> 同梱の `USER_GUIDE.pdf` は旧バージョンのもので内容が古いため、本ファイル (Markdown) を真とみなしてください。

---

## 目次

1. [このアプリでできること](#1-このアプリでできること)
2. [起動と画面](#2-起動と画面)
3. [プロジェクトと切片](#3-プロジェクトと切片)
4. [ROI の手描きと表示](#4-roi-の手描きと表示)
5. [ANALYSIS（切片並列バーグラフ）](#5-analysis切片並列バーグラフ)
6. [ZIP インポート / エクスポート](#6-zip-インポート--エクスポート)
7. [保存される情報 / 破棄される情報](#7-保存される情報--破棄される情報)
8. [キーボードショートカット](#8-キーボードショートカット)

---

## 1. このアプリでできること

- 任意の数の **切片パネル** を横並びに表示し、各切片に独立した HE/IF/MSI レイヤーを重ね合わせる
- HE / IF の TIFF (PNG/JPEG も可) を **affine 変換 JSON (`T_he_to_msi`)** とともに登録し、MSI 座標系に整合させる
- 既存形式の MSI **`.xlsx`** (`MSI_Data` シート, Image_X / Image_Y / 強度列) を取り込み、化合物単位でレイヤー化
- `.txt` 形式 (Analyte / 一般 TSV/CSV) の MSI も同様に取り込み可能
- 切片ごとに ROI を手描き登録、複数切片で同名 ROI を共有
- 選択 ROI に対して **化合物 × 切片** の Mean Intensity 比較を切片並列バーグラフで表示
- プロジェクト全体を **1 つの ZIP ファイル** または **共有 URL** で配布

---

## 2. 起動と画面

### 2-1. 推奨ブラウザ

最新版の Chrome / Edge / Firefox / Safari。画面幅 1280px 以上推奨。

### 2-2. 起動

`viewer/index.html` をブラウザで直接開きます。GitHub Pages 等で公開する場合はルート URL でも可。共有 URL (`#share=<slug>`) を開くと自動的に閲覧モードになります。

### 2-3. 画面構成

<div style="border:1px solid #475569;border-radius:6px;overflow:hidden;font-size:11px;margin:10px 0;background:#fff;">
  <div style="background:#1e293b;color:#fff;padding:6px 10px;font-weight:600;letter-spacing:0.02em;">
    Top Bar &nbsp;—&nbsp; Project picker / New / Import ZIP / Export ZIP / Publish to share / Share info / + Section / Delete / Help
  </div>
  <div style="display:grid;grid-template-columns:170px 1fr 220px;">
    <div style="background:#f8fafc;padding:8px;border-right:1px solid #cbd5e1;">
      <div style="font-weight:600;color:#0f172a;">ROI LIST</div>
      <ul style="margin:6px 0 0 1em;padding:0;color:#475569;font-size:11px;line-height:1.5;">
        <li>+ 新規 / Show トグル</li>
        <li>各 ROI のチェックボックス・削除</li>
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
        <li>切片並列バーグラフ</li>
        <li>3 系列までの化合物比較</li>
      </ul>
      <div style="font-weight:600;color:#0f172a;">Memo</div>
      <ul style="margin:6px 0 0 1em;padding:0;color:#475569;font-size:11px;line-height:1.5;">
        <li>Sample / Machine / Matrix …</li>
      </ul>
    </div>
  </div>
</div>

| 領域 | 役割 |
| --- | --- |
| Top Bar | プロジェクト切替・追加・ZIP I/O・Publish to share・切片追加・Help |
| ROI LIST | 全切片共通の ROI 一覧。表示トグル・新規描画・各 ROI の追加描画 |
| Sections Grid | 切片パネルを `auto-fit` の grid で並列表示 (1〜10 切片想定) |
| Method (MRM) | アクティブ切片の MSI レイヤー一覧。クリックで表示切替 |
| ANALYSIS | 選択 ROI に対する切片 × 化合物 のバーグラフ |
| Memo | 検体メタ (Sample / Machine / Matrix / Google Keep / +α …) |

各切片パネルをクリックすると **アクティブ** (青枠) になり、ROI 描画と Method 操作の対象になります。

> 共有モード (`#share=<slug>`) で開くと、Top Bar の登録系ボタンや `+ Section`、`Delete` などは自動的に隠れ、`Share view` バッジが表示されます。

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

> **共有モード** では切片の追加・削除はできません (ボタンが非表示)。

---

## 4. ROI の手描きと表示

### 4-1. 新規 ROI

1. アクティブにしたい切片パネルをクリック
2. ROI LIST 上の **`+ 新規`** をクリック (描画モード ON)
3. キャンバス上を順にクリックして 3 点以上の頂点を打つ
4. 確定:
   - 最初の頂点をもう一度クリック
   - ダブルクリック
   - **Enter** キー
5. ROI 名を入力 (空欄なら anatomy_palette のキー名)
6. ROI LIST に追加されます (色は anatomy_palette から自動割当)

### 4-2. 既存 ROI を別の切片にも描画

- ROI LIST 各行の **`+ draw`** ボタン → アクティブ切片で描画モード ON
- 同じ `id` の ROI が複数切片の `polysBySection` にまとめて保存されます
- 行の右の `2/3` 等のバッジは「描画済 / 全切片数」を示します

### 4-3. 表示制御

- ROI LIST 各行の **チェックボックス** でその ROI 単体の表示 ON/OFF
- ROI LIST ヘッダの **`Show`** トグルで全 ROI を一括 ON/OFF
- 行の **`×`** で ROI 自体を削除 (全切片分が消えます)

> 描画モード中は他のパネルへの切替はできません。Escape で中止できます。

> **共有モード** では ROI 編集は **書き込みロック取得後** にのみ可能です (同時に 1 名)。ロック取得中は他の閲覧者が編集できません。

---

## 5. ANALYSIS（切片並列バーグラフ）

- ROI LIST から ROI を選択すると、その ROI が描画されている **全ての切片** を横軸にしたバーグラフを描きます
- 化合物プルダウン (最大 3 系列) を変えると、グループバーが切り替わります
- バーの **塗り色** は化合物色、**枠線色** は ROI のパレット色
- ROI が 1 切片にしか引かれていなければ、その 1 切片分だけ表示されます

---

## 6. ZIP インポート / エクスポート

### 6-1. Export ZIP

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

xlsx には、その切片で描画されている全 ROI 列が **0/1 のフラグ列** として末尾に追加されます (xlsx 元ファイル末尾 2 列はそのまま温存)。

> ZIP には **share URL / パスワードは含まれません**。受け手に共有 URL で渡したい場合は ZIP ではなく `Publish to share` を使ってください。

### 6-2. Import ZIP

1. Top Bar の **`Import ZIP`** をクリック
2. エクスポートされた ZIP を選ぶ
3. 新規プロジェクトとして読み込まれ、自動で開かれます

> Import 時は新しい id が振り直されるため、同じ ZIP を 2 回入れても上書きにはなりません (別プロジェクトとして共存)。

---

## 7. 保存される情報 / 破棄される情報

DESI Data Share には **2 つの保存先** があります:

- **ローカル IndexedDB** : 自分のブラウザ内、プロファイル単位 (シークレットウィンドウは閉じると消えます)
- **Supabase サーバ** : `Publish to share` で発行したプロジェクトのみ。閲覧者全員で共有

挙動はモードによって異なります。

### 7-1. Master モード（自分の編集画面）

| 対象 | 保存先 | 説明 |
| --- | --- | --- |
| プロジェクト名・切片構造 | IndexedDB | 編集後 約 400ms で自動保存 |
| HE / IF / MSI のレイヤー設定 | IndexedDB | Range / Opacity / Rotation / マーカー色を保持 |
| 登録ファイル本体 (TIFF / xlsx / txt) | IndexedDB | Blob として保存 |
| ROI (頂点 / 名前 / 色 / 切片対応) | IndexedDB | 自動保存 |
| Memo (Sample / Machine / Matrix …) | IndexedDB | 自動保存 |
| Active 切片 / View モード (Free / Compound) / focus 化合物 | localStorage | 次回起動時に復元 |
| Share URL / パスワード (Publish 後) | IndexedDB | `Share info` で再表示可。ローカルのみ、サーバには平文を残しません |

→ Master 側はほぼすべての操作が **自動的に保存** されます。明示的に破棄されるものはありません。

### 7-2. Publish to share 実行時

| 対象 | 保存先 | 説明 |
| --- | --- | --- |
| 切片構造・メタ・変換 | Supabase テーブル | 同 slug で再 Publish すると **丸ごと上書き** |
| HE / IF / MSI ファイル本体 | Supabase Storage (`atlases` バケット) | 公開 read。誰でも URL を辿れる前提のセキュリティモデル |
| ROI 一式 | Supabase テーブル | サーバ側の既存 ROI は削除されます |
| Viewer / Admin パスワード | Supabase テーブル (bcrypt) | 平文は送らず、フロント側でも IndexedDB のみ保持 |
| Memo / Range / マーカー色 | サーバには **送られません** | これらは master のローカル専用 |

> 同じ slug で再 Publish するとサーバ側のプロジェクトは丸ごと上書きされ、それまでの ROI も消えます。

### 7-3. 共有モード（受け手 / `#share=<slug>` で開いた画面）

| 対象 | どうなるか |
| --- | --- |
| ROI の追加・編集・削除 | **サーバへ即時反映**。ロック取得中の編集者がいれば他の閲覧者は待機 |
| 12 時間以内のセッション | sessionStorage に保持 (タブを閉じると失効) |
| HE / IF / MSI ファイル | サーバから取得し、その場で IndexedDB にキャッシュ |
| レイヤーの ON/OFF・Range・Opacity・マーカー色・View モード | 表示中は変更可能ですが、**次回 URL を開き直すとサーバ側の状態に戻ります** |
| Memo の編集 | 同上、再ロードで破棄 |
| ROI 描画モードの中断 (Escape / 描画途中で離脱) | 描画途中の頂点は破棄。完了 (Enter / 始点クリック) しなければサーバには行きません |

→ 共有モードでは **ROI のみが永続化** されます。それ以外の調整 (色味・倍率・メモ等) はその場限りで、リロードすると初期状態に戻ります。

### 7-4. 注意点

- ブラウザのプロファイルを変えると別データになります。Master 同士で配布する場合は **必ず ZIP** で。共同研究者に閲覧してもらう場合は **`Publish to share`** で URL を渡してください
- シークレットウィンドウは閉じると消えるので注意
- 大きな TIFF + 多数化合物 + 切片 5〜10 では Export 生成や Publish に数十秒〜数分かかることがあります
- IndexedDB の容量はブラウザ依存です。Chrome / Edge では概ね数 GB まで使えますが、ストレージ逼迫時にブラウザ側で削除される可能性があるため、**重要なプロジェクトは ZIP で別途バックアップ**することを推奨します

---

## 8. キーボードショートカット

| キー | 機能 |
| --- | --- |
| `Enter` | 描画モード中: 現在の頂点で ROI を確定 |
| `Escape` | 描画モード中: 中止 |
| `Ctrl + F5` / `Cmd + Shift + R` | ブラウザの強制再読み込み |

---

## ライセンス / フィードバック

実装は単一の `viewer/index.html` (Tailwind / SheetJS / UTIF / JSZip / supabase-js / marked / DOMPurify を CDN 利用) で完結しています。
不具合や要望は GitHub の Issues から。
