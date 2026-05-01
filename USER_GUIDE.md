# DESI Data Share 閲覧者ガイド

このガイドは **共有 URL を受け取って DESI Data Share を閲覧している方** 向けの説明書です。
データ作成側 (Master) の操作 (新規プロジェクト作成、レイヤー登録、Publish to share など) はここでは扱いません。

> URL を発行した方から **viewer password** が別途共有されているはずです。手元にない場合は発行者に問い合わせてください。

---

## 目次

1. [このアプリで閲覧者ができること](#1-このアプリで閲覧者ができること)
2. [URL を開く・パスワード入力](#2-url-を開くパスワード入力)
3. [画面構成](#3-画面構成)
4. [ROI の表示と追加](#4-roi-の表示と追加)
5. [Method (MRM) と化合物の切替](#5-method-mrm-と化合物の切替)
6. [Range / Opacity / Rotation の調整](#6-range--opacity--rotation-の調整)
7. [Memo の編集](#7-memo-の編集)
8. [Export ZIP で手元に保存](#8-export-zip-で手元に保存)
9. [保存されること・破棄されること](#9-保存されること破棄されること)
10. [キーボードショートカット](#10-キーボードショートカット)

---

## 1. このアプリで閲覧者ができること

- 切片画像 (HE / IF / MSI) を化合物単位で重ねて閲覧
- 化合物の切替・比較 (Free / Compound モード)
- 既存 ROI の表示・非表示
- **書き込みロック取得時** に新規 ROI の追加・既存 ROI の削除 (同時編集者は 1 名)
- ANALYSIS バーグラフで切片 × 化合物の Mean Intensity を比較
- 表示パラメタ (Range / Opacity / Rotation / Pan / Zoom) の **一時的な** 調整
- Memo の **一時的な** 編集
- プロジェクト全体を ZIP でダウンロード

---

## 2. URL を開く・パスワード入力

1. 提供者から渡された URL (例: `https://.../viewer/index.html#share=<slug>`) をブラウザで開く
2. 「共有プロジェクト」モーダルが開くので、別途共有された **viewer password** を入力
3. **Unlock** を押すとプロジェクトが読み込まれる
4. ヘッダ右に 🔒 **Share view** バッジが付き、編集系ボタンは自動的に隠れる

セッションは **12 時間** で失効します。タブを閉じても再度 URL を開けば同じパスワードでログインし直せます。

---

## 3. 画面構成

<div style="border:1px solid #475569;border-radius:6px;overflow:hidden;font-size:11px;margin:10px 0;background:#fff;">
  <div style="background:#1e293b;color:#fff;padding:6px 10px;font-weight:600;letter-spacing:0.02em;">
    Top Bar &nbsp;—&nbsp; 🔒 Share view / Free / Compound / Export ZIP / Help
  </div>
  <div style="display:grid;grid-template-columns:170px 1fr 220px;">
    <div style="background:#f8fafc;padding:8px;border-right:1px solid #cbd5e1;">
      <div style="font-weight:600;color:#0f172a;">ROI LIST</div>
      <ul style="margin:6px 0 0 1em;padding:0;color:#475569;font-size:11px;line-height:1.5;">
        <li>+ 新規 (要ロック取得)</li>
        <li>Show トグル</li>
        <li>各 ROI のチェックボックス・削除</li>
      </ul>
    </div>
    <div style="padding:8px;background:#fff;">
      <div style="font-weight:600;color:#0f172a;margin-bottom:4px;">Sections Grid</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
        <div style="border:1px solid #cbd5e1;padding:6px;border-radius:4px;background:#f8fafc;">
          <div style="font-weight:600;font-size:11px;">Section 1</div>
          <div style="color:#64748b;font-size:11px;">canvas (パン/ズーム)</div>
          <div style="color:#64748b;font-size:11px;">thumbs (ON/OFF)</div>
        </div>
        <div style="border:1px solid #cbd5e1;padding:6px;border-radius:4px;background:#f8fafc;">
          <div style="font-weight:600;font-size:11px;">Section 2</div>
          <div style="color:#64748b;font-size:11px;">canvas</div>
          <div style="color:#64748b;font-size:11px;">thumbs</div>
        </div>
        <div style="border:1px solid #cbd5e1;padding:6px;border-radius:4px;background:#f8fafc;">
          <div style="font-weight:600;font-size:11px;">Section 3</div>
          <div style="color:#64748b;font-size:11px;">canvas</div>
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
        <li>化合物プルダウン × 3</li>
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
| Top Bar | 表示モード切替 (Free / Compound)・Export ZIP・Help |
| ROI LIST | 全切片共通の ROI 一覧。表示トグル・新規描画・各 ROI への追加描画 |
| Sections Grid | 切片パネル。クリックでアクティブ (青枠) 化、ドラッグでパン、ホイールでズーム |
| Method (MRM) | アクティブ切片の MSI レイヤー一覧。クリックで表示切替 |
| ANALYSIS | 選択 ROI に対する切片 × 化合物 のバーグラフ |
| Memo | Sample / Machine / Matrix / Google Keep / +α … (一時編集) |

---

## 4. ROI の表示と追加

### 4-1. 既存 ROI の表示制御

- ROI LIST 各行の **チェックボックス** で個別に表示 ON/OFF
- ヘッダの **Show** トグルで全 ROI を一括 ON/OFF

これらの操作はサーバには送られず、自分の画面でのみ反映されます。

### 4-2. 新規 ROI を描く (書き込みロック必須)

共有モードで ROI を書き込むには、**書き込みロックの取得が必須** です (同時に 1 名のみ)。

1. ROI を描きたい切片パネルをクリックしてアクティブ化
2. ROI LIST 上の **`+ 新規`** をクリック → 自動的にロック取得を試行
3. ロックが取れたら描画モードに入り、キャンバス上で 3 点以上の頂点を打つ
4. 確定方法 (いずれか):
   - 最初の頂点をもう一度クリック
   - ダブルクリック
   - **Enter** キー
5. ROI 名を入力 → **サーバに即時保存**、他の閲覧者にもリロード後に反映される

> ロック取得に失敗した場合は「ロック中: ◯◯」と表示されます。前の人がブラウザを閉じていれば 30 秒以内に自動で取り直せます。
> 描画完了後、ロックは自動で解放されます。

### 4-3. 既存 ROI を別の切片にも描く

- ROI LIST 各行の **`+ draw`** ボタン → アクティブ切片で描画モード ON
- 同じ ROI が複数切片で共有されます
- 行右の `2/3` 等のバッジは「描画済 / 全切片数」

### 4-4. ROI の削除

- ROI LIST 各行の **`×`** で削除 → 全切片分が消え、サーバにも即時反映
- 削除も書き込みロック取得中のみ有効

> 描画モード中は他のパネルへの切替はできません。**Escape** で中止 (描画途中の頂点は破棄)。

---

## 5. Method (MRM) と化合物の切替

中央下の **Method (MRM)** テーブルにアクティブ切片の MSI レイヤー一覧が出ます。

| 列 | 意味 |
| --- | --- |
| Compound | 化合物名 |
| Precursor | プリカーサ m/z |
| Product | プロダクト m/z |
| CE | Collision Energy |
| CV | Collision Voltage / Compensation Voltage |
| Range | レイヤーの強度値レンジ (現在の Min / Max) |

行をクリックすると:
- **Compound モード** … 全切片で同じ化合物がフォーカス表示される (切片間比較に便利)
- **Free モード** … その行のレイヤーの ON/OFF を切替

ヘッダ右上の **Free / Compound** トグルでモードを切替できます。

---

## 6. Range / Opacity / Rotation の調整

セクションツールバー (各切片パネル上部) の 3 つのグループ:

| 項目 | 入力 | 意味 |
| --- | --- | --- |
| **Range** | min — max | アクティブ MSI レイヤーの **強度値レンジ**。表示する輝度の上下限 |
| **Opacity** | 0–100 % | レイヤーの **不透明度** |
| **Rotation** | -180°〜180° | キャンバス全体の **回転角** (パン・ズームと組み合わせ) |

各項目右の **🔗** で全切片に値を同期できます。**`↻`** ボタンは translate / rotate / zoom (パン位置・回転・倍率) のリセット。

> これらの調整は **一時的** で、再ロードするとサーバ側の状態に戻ります。他の閲覧者にも反映されません。

> パン: ドラッグ (修飾キーなし) / ズーム: マウスホイール / 回転: Rotation 入力か、ヘッダの 🔗 で他切片と同期。

---

## 7. Memo の編集

右下の **Memo** フォームで Sample / Machine / Google Keep / +α / Matrix / Derivatization が編集可能です。

> Memo の編集も **一時的** で、再ロードで破棄されます。サーバには送られません。

---

## 8. Export ZIP で手元に保存

ヘッダの **Export ZIP** で、現在閲覧中のプロジェクト全体を ZIP にまとめてダウンロードできます。

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

xlsx には、その切片で描画されている全 ROI が **0/1 のフラグ列** として末尾に追加されます (xlsx 元ファイル末尾 2 列はそのまま温存)。

> ZIP は手元に持ち帰る用途のみ。**再アップロードや Publish はできません** (受け手側に該当ボタンが表示されません)。

---

## 9. 保存されること・破棄されること

| 操作 | 保存先 | 他の閲覧者に見える | 再ロード後に残る |
| --- | --- | --- | --- |
| ROI の追加・編集・削除 | **サーバ** | ✅ (再ロード後反映) | ✅ |
| Range / Opacity / Rotation の調整 | (ローカルキャッシュのみ) | ❌ | ❌ |
| パン位置・ズーム倍率 | (同上) | ❌ | ❌ |
| マーカー色・レイヤー ON/OFF | (同上) | ❌ | ❌ |
| View モード (Free / Compound) | localStorage | ❌ | ✅ |
| Memo の編集 | (ローカルキャッシュのみ) | ❌ | ❌ |
| 描画途中の頂点 (Escape / 離脱) | (破棄) | — | — |

要点:

- **ROI のみがサーバに保存** され、他の閲覧者と共有されます
- 表示調整 (色味・倍率・メモ等) は **その場限り**。再ロードで初期状態に戻ります
- セッション情報 (12 時間有効) は sessionStorage に保持。タブを閉じると失効します
- ROI 編集は **書き込みロック取得中のみ** 有効。ロック保持者がいる間、他の閲覧者は待機します

---

## 10. キーボードショートカット

| キー | 機能 |
| --- | --- |
| `Enter` | 描画モード中: 現在の頂点で ROI を確定 |
| `Escape` | 描画モード中: 中止 (途中の頂点は破棄) |
| `Ctrl + F5` / `Cmd + Shift + R` | ブラウザの強制再読み込み |

---

## 困ったときは

| 症状 | 確認ポイント |
| --- | --- |
| パスワードが違うと出る | 提供者から共有された viewer password が正確か (大文字小文字含む) |
| `+ 新規` が「ロック中」のまま | 別の閲覧者が編集中。30 秒待って再試行 |
| ROI の変更が他の人に見えない | 他の閲覧者がページを **再読み込み** しないと反映されません |
| 表示の倍率や色味が次に開くと戻っている | 仕様 — 表示調整はその場限りです |
| 画像が表示されない | 提供者側の Storage 設定が変わった可能性。提供者に問い合わせ |

不具合や要望は GitHub Issues、または提供者までご連絡ください。
