# DESI Data Share — 管理者ガイド (データ共有)

このガイドは **DESI Data Share でデータを公開する側 (master / admin)** 向けです。プロジェクトの棚卸しだけなら「プロジェクト管理」、共有 URL を受け取った閲覧者には「データ共有 (受け手)」を参照してください。

---

## 目次

1. [全体フロー](#1-全体フロー)
2. [プロジェクトを開く](#2-プロジェクトを開く)
3. [HE / IF レイヤーを登録](#3-he--if-レイヤーを登録)
4. [MSI レイヤーを登録](#4-msi-レイヤーを登録)
5. [ROI を引く](#5-roi-を引く)
6. [Memo の入力](#6-memo-の入力)
7. [Publish to share](#7-publish-to-share)
8. [共有 URL とパスワードの渡し方](#8-共有-url-とパスワードの渡し方)
9. [再 publish の挙動](#9-再-publish-の挙動)
10. [アップロード進捗 / 大ファイル対策](#10-アップロード進捗--大ファイル対策)
11. [Storage 容量の目安](#11-storage-容量の目安)
12. [困ったときは](#12-困ったときは)

---

## 1. 全体フロー

```
[管理画面 /]
   │ + 新規プロジェクト or Open
   ▼
[ビューア /viewer/]
   │ HE/IF/MSI 登録 → ROI → Memo
   ▼
[Publish to share]
   │ slug + viewer pw + admin pw
   ▼
[Share URL + Passwords]
   ▼
共同研究者に渡す (URL と viewer pw を別チャネルで)
```

---

## 2. プロジェクトを開く

- **新規**: 管理画面で `+ 新規プロジェクト` → メタ情報入力 → `Create` → ビューア
- **既存**: 管理画面のプロジェクト一覧で `Open`

ビューアの `← Projects` ボタンで管理画面に戻れます。

---

## 3. HE / IF レイヤーを登録

各切片パネル右上の `+ HE/IF` ボタンから:

1. レイヤー名 (`HE Stain` / `IF Stain` / 任意 custom) を選択
2. **画像ファイル** (TIFF / PNG / JPEG) を選択
   - TIFF は UTIF.js で自動デコード
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
4. `Register` で確定 → MSI 座標系に整合してキャンバスに重なる

> 変換 JSON を省略すると HE/IF はそのキャンバスサイズで表示 (位置整合なし)。

---

## 4. MSI レイヤーを登録

各切片パネルの `+ MSI` ボタンから:

### 4-1. xlsx 形式
1. ソースファイル (`.xlsx`) を選択
2. シート名 (既定 `MSI_Data`) と **ヘッダ行** (既定 4) を確認
3. `Reload columns` で列ラベルを再読込
4. **X 列** / **Y 列** (既定 `Image_X`, `Image_Y`) を選択
5. **強度列** を Ctrl/Cmd で複数選択 (各列が独立した MSI レイヤーになる)
6. **Data start row** (既定 5) を確認
7. `Register` で各列ごとに `MSI_<列名>` のレイヤーが作成される

### 4-2. txt 形式
- Analyte (`Analyte (converted from imzML)`) または一般 TSV/CSV
- レイヤー名 (例 `MSI_DA`) と value column 番号を指定して登録

---

## 5. ROI を引く

1. アクティブにしたい切片パネルをクリック
2. ROI LIST 上の `+ 新規` をクリック (描画モード ON)
3. キャンバス上を順にクリックして 3 点以上の頂点
4. 確定: 始点クリック / ダブルクリック / **Enter**
5. ROI 名を入力

別切片に同じ ROI を描くには各行の `+ draw` ボタン。

> 描画途中で **Escape** → 中止。複数切片で `polysBySection` に蓄積されます。

---

## 6. Memo の入力

ビューア右下の Memo パネル:

| 項目 | 内容 |
| --- | --- |
| Sample | サンプル名 |
| Experiment date | 実験日 |
| Machine | DESI / TIMS / LTQ / Other |
| Matrix | 装置が DESI 以外の場合のみ表示 |
| Google Keep | 関連ノート URL |
| Memo | 自由記述 |
| Derivatization | 誘導体化処理 |

入力値は IndexedDB に約 400ms で自動保存。Publish 時にサーバの `projects.meta.memo` にも送られます。

> Method (MRM) テーブルの **Precursor / Fragment / CE / CV** は **管理者のみ表示** (admin password で開いた閲覧者にも見える)。通常の viewer pw だけで開いた閲覧者には隠されます。

---

## 7. Publish to share

ヘッダの `Publish to share` ボタン:

| 項目 | 内容 |
| --- | --- |
| **Project slug** | URL の識別子 (英数字 / `_` / `-`) |
| **Viewer password** | 受け手が入力するパスワード (4 文字以上) |
| **Admin password** | 既定で `MSIadomine` が pre-fill (4 文字以上) |

`Publish` を押すと:

1. 全 blob (TIFF / xlsx / txt) を Supabase Storage に並列 (4 同時) アップロード
2. 進捗モーダルで `X / N files (Y MB / Z MB)` をライブ表示
3. 各ファイルは最大 3 回までリトライ (exponential backoff)
4. 完了後、Share URL モーダルが開く (URL + viewer/admin pw を一覧表示)

> 再 publish の挙動は次節「9. 再 publish の挙動」を必ずご確認ください。

---

## 8. 共有 URL とパスワードの渡し方

- URL: `https://.../viewer/index.html#share=<slug>`
- viewer password を **別チャネル** (Slack / メール) で
- admin password を渡すのは「相手にも管理者ビュー (Method 全列) を見せたい」ときのみ

> URL は `Share info` ボタン (Publish 後) または管理画面の `Copy URL` で再表示できます。

---

## 9. 再 publish の挙動

★重要: **同じ slug で 2 回目以降の publish を実行すると、サーバ側のプロジェクトは完全に上書きされます。**

| 対象 | 挙動 |
| --- | --- |
| `projects` 行 | display_name, anatomy_palette, meta が上書き |
| **viewer password** | 入力した新しい値で **必ず上書き** |
| **admin password** | 入力欄が空でなければ上書き、空ならそのまま |
| **sections テーブル** | 全削除 → 再挿入 |
| **rois テーブル** | **全削除 → 再挿入** (受け手が追加した ROI も消える) |
| **Storage `<slug>/...`** | 同パスは upsert で上書き、新パスは追加。**古いパスのファイルは残る (孤児)** |

注意点:

- 受け手が共有 URL から追加した ROI は **再 publish で消えます**
- パスワード変更時、12 時間以内の既存セッショントークンは有効のまま
- Storage 孤児が累積すると Supabase 容量を圧迫 (今後の課題: クリーンアップ機能)

---

## 10. アップロード進捗 / 大ファイル対策

実装済みの対策:

- **並列アップロード** (concurrency = 4)
- **自動リトライ** (1 ファイルあたり最大 3 回, backoff 800ms → 1.6s → 3.2s)
- **進捗モーダル** (パーセント / 完了ファイル数 / バイト数 / プログレスバー)

大ファイル (1.5 GB クラス) のアドバイス:

- 切片あたり MSI xlsx は 50–500 MB / HE TIFF は 50–300 MB が現実的目安
- 1 プロジェクト合計 1 GB を超える場合、Supabase Free Tier (1 GB) は不足 → **Pro プラン (100 GB)** を検討
- ネットワーク不安定な環境では安定回線で publish を実施

---

## 11. Storage 容量の目安

| プラン | Storage | 帯域 | 月額 |
| --- | --- | --- | --- |
| Free | 1 GB | 5 GB / 月 | $0 |
| **Pro** | **100 GB** | **250 GB / 月** | **$25** |

ファイルサイズ上限は Free / Pro どちらも標準 50 MB → ダッシュボード設定で 5 GB まで引き上げ可能。

> 1.5 GB プロジェクトを想定するなら Pro プラン必須。Free 枠で進めると 1 つ目で容量も帯域も即破綻します。

---

## 12. 困ったときは

| 症状 | 対処 |
| --- | --- |
| Publish 中にエラー | 進捗モーダルが消えてアラート表示。Network タブで失敗 PUT を確認、再試行 |
| `new row violates row-level security policy` | `share_locks.sql` の Storage ポリシーを再実行 (`supabase/README.md` 参照) |
| 大量孤児ファイルで Storage 容量逼迫 | Supabase ダッシュボードの Storage 画面で `<slug>/<oldSectionId>/` 以下を手動削除 |
| 同じ slug で別プロジェクトを上書きしてしまった | 復元手段なし。命名は慎重に |
| パスワードを忘れた | Supabase SQL Editor で `select set_project_password('<slug>', 'admin', '<新>');` を直接実行 |
| 「サーバから一覧取得」で 0 件 | admin pw が一致するプロジェクトが無い (まだ Publish していない、または別 admin pw を使った) |
