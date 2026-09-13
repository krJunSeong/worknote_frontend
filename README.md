# WorkNote Frontend

WorkNote は、日々の業務記録を蓄積し、AI要約・技術タグ・想定面接質問・レポートへつなげるポートフォリオ用Webアプリです。

## 主な機能

- ログイン / 会員登録
  - ログインID: 4〜20文字、英字・数字・アンダースコア（_）のみ
  - 新規パスワード: 8〜64文字、記号・空白も利用可能
  - パスワード確認: 文字数と一致を検証
  - ニックネーム: 2〜12文字、文字・数字・空白・アンダースコア（_）
  - 不正な入力は赤枠と具体的なルール文で表示
  - ログイン時は既存アカウント互換のため、新規登録時の最小文字数を再強制せず最大64文字のみ制限
- JWT認証によるログイン状態管理
- 業務記録
  - 作成 / 一覧 / 詳細 / 編集 / 削除
  - タイトルクリックまたは「詳細を見る」から詳細画面へ移動
  - AI要約、技術タグ、難易度、想定面接質問
  - OCR画像から業務日誌の下書きを生成
- ダッシュボード
  - JWTのログインユーザーを基準にデータを取得
  - クライアント側のuserIdを信頼しない設計
- カレンダー
  - 月間グリッド / 前月・翌月移動
  - 業務記録と目標期間を表示
  - 業務記録をDrag & Dropして業務日を変更
  - 目標をDrag & Dropして期間を保ったまま移動
  - 目標の左右ハンドルをDrag & Dropして開始日・期限を変更
  - 完了した目標はチェック表示と取り消し線で識別
  - 業務タイトルをクリックすると詳細画面へ移動
  - 日付セルをダブルクリックすると、その日付で業務日誌を即時作成
- 計画目標
  - 開始日 / 期限 / 状態 / 進捗率
  - 期限超過を自動表示
  - 一覧の進捗ゲージを直接ドラッグして更新
  - タイトル/計画内容の鉛筆アイコンからインライン編集し、Enterまたはフォーカス移動で保存
  - カレンダーと期間連携
- AIプロジェクトレポート / PDF出力
- 韓国語 / 日本語切替

## カレンダー操作

```text
業務記録をドラッグ → 別の日付へドロップ
  → workDateのみ変更（createdAtは保持）

目標をドラッグ → 別の日付へドロップ
  → 開始日〜期限の長さを保持して移動

目標の左ハンドル → 開始日を変更
目標の右ハンドル → 期限を変更

日付セルをダブルクリック
  → タイトル / 内容を入力
  → 選択日をworkDateとして業務日誌を作成
  → 通常のAI分析を実行
```

`createdAt` は作成時刻として保持し、カレンダー上で変更できる日付は `workDate` として分離しています。これにより、スケジュール変更で作成履歴そのものを書き換えません。

## AI / OCR 利用制限

バックエンドのユーザー単位・日単位の制限を利用します。

- AI: デフォルト 20回 / 日
- Azure OCR: デフォルト 5回 / 日
- OCR下書きは OCR 1回 + AI 1回を消費

上限到達時は `429 DAILY_AI_LIMIT_EXCEEDED` を受け取り、画面に次の警告を表示します。

> 오늘 쓸 수 있는 AI기능을 다 썼습니다. 내일 다시 시도해주세요.

## 主なルート

```text
/                  Landing
/login             ログイン
/signup            会員登録
/dashboard         ダッシュボード
/work/list         業務記録
/work/create       業務日誌作成
/work/view/:id     業務日誌詳細
/work/edit/:id     業務日誌編集
/calendar          カレンダー
/goals             計画目標
/report            AIプロジェクトレポート
```

サイドバー左上の **WorkNote** ロゴをクリックすると `/dashboard` へ戻ります。

## 開発

```bash
npm install
npm run dev
```

環境変数例:

```text
VITE_API_BASE_URL=http://localhost:8081
```

## Landing Page / Portfolio Showcase

The landing page is structured for fast portfolio review:

- Hero product-flow demo: Work Log → AI Analysis → Calendar → Dashboard
- Large chapter tabs beside the Hero preview; manual selection resets the full auto-advance timer, and an explicit AUTO control pauses/resumes rotation
- Login-free 30-second interactive demo with editable input and simulated analysis results
- Current product features including Azure OCR, Calendar drag/drop & resize, Goal Planner, Dashboard and AI Report/PDF
- Engineering architecture and request flow
- Security hardening Before/After case study without exposing real endpoint paths
- Lessons learned plus only the reliability/security measures that are actually implemented

Set `VITE_GITHUB_URL` in `.env` to expose the GitHub link on the landing page.

## Landing Page Interactive Demo

The landing page includes a login-free 30-second interactive demo. Visitors can edit a sample work log, run a browser-side demo analysis, and preview the summary, tech tags, difficulty, interview question, and the Work Log → AI → Calendar → Dashboard flow. The landing demo does not call the production AI/OCR APIs or consume user quotas.
