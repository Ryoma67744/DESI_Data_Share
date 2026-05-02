# DESI Data Share — プロジェクト管理ガイド

このガイドは **DESI Data Share の管理画面 (`/`)** だけを対象にしたマニュアルです。データの登録 / 公開や受け手向けの操作については、Help モーダル右上の読者タブで「データ共有 (admin)」「データ共有 (受け手)」を選んでください。

---

## 目次

1. [この画面でできること](#1-この画面でできること)
2. [ログイン (パスワード)](#2-ログイン-パスワード)
3. [画面構成](#3-画面構成)
4. [新規プロジェクトを作成する](#4-新規プロジェクトを作成する)
5. [プロジェクトを開く・削除する](#5-プロジェクトを開く削除する)
6. [サーバから一覧取得 (別 PC でも見る)](#6-サーバから一覧取得-別-pc-でも見る)
7. [URL のコピー](#7-url-のコピー)
8. [データの保存先](#8-データの保存先)
9. [困ったときは](#9-困ったときは)

---

## 1. この画面でできること

- 自分が作成したプロジェクトの一覧表示 (ローカル + サーバ)
- 新規プロジェクトの作成 (実験日 / 装置 / Matrix / Google Keep / Memo を一括入力)
- 既存プロジェクトを開く / 削除する
- 公開済みプロジェクトの **共有 URL を 1 クリックでコピー**
- サーバから過去公開したプロジェクトを呼び出す (別 PC からでも一覧可)

データの登録 (HE/IF, MSI) や `Publish to share` は、ここから `Open` してビューアに入った後の操作です (詳細は「データ共有 (admin)」)。

---

## 2. ログイン (パスワード)

管理画面の入口で admin password を要求されます。

- 既定値は `MSIadomine` (Publish モーダルの admin password 欄に pre-fill されるもの)
- 認証が通ると **12 時間** sessionStorage に保持され、再入力不要
- タブを閉じれば失効
- Supabase が接続できる場合は `list_projects(pw)` を呼んで bcrypt 照合
- オフライン時は SHA-256 でローカル比較に fallback

> このゲートは shoulder-surfing 防止レベルです。本格的な秘匿は Supabase 側 (bcrypt) で実現されています。

---

## 3. 画面構成

- **ヘッダ**: タイトル + Help ボタン
- **アクション行**: `+ 新規プロジェクト` / `サーバから一覧取得`
- **プロジェクト一覧**: 各行は以下の情報とアクション
  - 名前 + バッジ (`Local` / `Local + Server` / `Server only`)
  - 実験日 / 装置 / Matrix / Google Keep / Memo の冒頭
  - `Open` / `Copy URL` / `Delete`

### バッジの意味

| バッジ | 意味 |
| --- | --- |
| **Local** | このブラウザの IndexedDB にだけある (未 publish、または別 PC で作成等) |
| **Local + Server** | ローカルにもサーバにもある (この PC で publish したもの) |
| **Server only** | サーバのみ (別 PC で publish した、ローカルから削除済み等) |

---

## 4. 新規プロジェクトを作成する

1. `+ 新規プロジェクト` ボタンを押す
2. メタ情報フォーム:
   - **プロジェクト名** (必須)
   - **実験日時**: `<input type="date">`
   - **装置**: DESI / TIMS / LTQ / Other
   - **Matrix**: 装置が DESI 以外の場合のみ表示
   - **Google Keep**: 関連ノートの URL (任意)
   - **Memo**: 自由記述
3. `Create` でビューアに遷移、すぐに HE/IF/MSI を登録できる状態に

ここで入力した値はビューア右下の Memo パネルにそのまま反映されます。

---

## 5. プロジェクトを開く・削除する

- **Open**: ビューアに遷移してそのプロジェクトを開く
  - Local 行 → 通常のローカル編集モード
  - Server only 行 → 共有モード (viewer pw を要求)
- **Delete**: ローカル IndexedDB から削除
  - サーバに publish 済みなら **サーバ側のデータは残る** (Server only に変わる)
  - 完全削除したい場合は Supabase ダッシュボードから

---

## 6. サーバから一覧取得 (別 PC でも見る)

別 PC で publish したプロジェクトをこの PC でも一覧したいときに使います。

1. `サーバから一覧取得` ボタンを押す
2. **admin password** を入力 (既定 `MSIadomine`)
3. その admin pw が登録されているプロジェクトがすべて表示される
4. 入力した pw は sessionStorage に 12 時間キャッシュ (次回はプロンプトなし)

> 共通 admin pw を運用していれば、どの PC でも同じパスワードで全プロジェクトを呼び出せます。

---

## 7. URL のコピー

Publish 済みのプロジェクトには `Copy URL` ボタンが出ます。

- クリックでクリップボードに `https://.../viewer/index.html#share=<slug>` をコピー
- ボタンが `Copied ✓` に一瞬切替わる
- viewer password と admin password は **別チャネル** (Slack / メール) で受け手に渡してください

未 publish のプロジェクトは `URL なし` (disabled) が表示されます。`Open` → ビューアで `Publish to share` してから戻ると `Copy URL` が現れます。

---

## 8. データの保存先

| 場所 | 何が入る | 範囲 |
| --- | --- | --- |
| **ローカル IndexedDB** (`desi-projects` DB) | プロジェクトメタ + 切片構造 + ROI + Memo + 登録ファイル本体 (TIFF/xlsx/txt) | このブラウザのこのプロファイル限定 |
| **Supabase** (publish 済のみ) | 切片構造 / ROI / Memo / 圧縮バイナリ / bcrypt パスワード | サーバ全体 |
| **localStorage** | 最後に開いたプロジェクト ID、レイアウト寸法 | このブラウザのこのプロファイル |
| **sessionStorage** | admin pw キャッシュ、master 解錠フラグ | このタブのみ |

> 重要: ローカル IndexedDB の容量は無制限ではありません。ブラウザのストレージ逼迫時に削除されることがあるので、**重要なプロジェクトは必ず Publish to share でサーバに退避**してください。

---

## 9. 困ったときは

| 症状 | 対処 |
| --- | --- |
| `Init failed: The requested version (X) is less than the existing version (Y)` | DB スキーマのバージョン不整合。最新コードに更新してハードリロード (Ctrl+F5) |
| サーバ一覧取得でエラー | admin pw が違う、または Supabase が接続できない |
| URL コピーボタンが出ない | まだ Publish to share していない。`Open` → ビューアで Publish |
| パスワードを入力しても先に進めない | キャッシュをクリア + 再ロード。それでもダメなら admin pw を変更した可能性 |
| 別 PC からプロジェクトが見えない | `サーバから一覧取得` で admin pw を入力し直してください |
