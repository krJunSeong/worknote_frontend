import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const COPY = {
  ko: {
    nav: ["30초 데모", "주요 기능", "기술 구조", "문제와 개선", "기술 스택"],
    login: "로그인",
    eyebrow: "AI-POWERED DEVELOPER WORK JOURNAL",
    hero1: "매일의 업무 기록을",
    hero2: "설명 가능한 성장 데이터로",
    intro: "업무일지를 남기면 AI가 요약·기술 태그·예상 면접 질문으로 구조화하고, 캘린더·목표·대시보드·보고서에서 다시 활용할 수 있는 개발자용 업무 기록 서비스입니다.",
    demoBtn: "30초 데모 체험",
    tryBtn: "직접 사용하기",
    proof: ["JWT 인증", "사용자 권한 검증", "AI·OCR 일일 제한", "Calendar D&D", "Azure OCR", "PDF Report"],
    demoEyebrow: "30 SECOND INTERACTIVE DEMO",
    demoTitle: "기록 하나가 어떻게 성장 데이터로 바뀌는지",
    demoText: "제목과 업무 내용을 직접 입력하고 분석 결과가 만들어지는 흐름을 로그인 없이 체험할 수 있습니다. 아래 버튼을 누르면 인터랙티브 데모가 열립니다.",
    demoSteps: [
      ["업무 기록", "Spring Security에서 다른 사용자의 Dashboard 접근 가능성을 확인하고 권한 검사를 수정했다."],
      ["AI 분석", "핵심 요약, Spring Security·JWT 태그, 예상 면접 질문을 생성합니다."],
      ["업무 캘린더", "업무 날짜와 목표 기간을 캘린더에서 확인하고 Drag & Drop으로 변경합니다."],
      ["성장 데이터", "Dashboard와 AI Report에서 누적 기술과 문제 해결 경험을 다시 확인합니다."],
    ],
    whyTitle: "업무를 기록해도, 나중에는 내 경험으로 설명하기 어렵다는 문제에서 시작했습니다.",
    whyText: "WorkNote는 흩어진 업무 기록을 AI가 요약·기술 태그·예상 면접 질문으로 정리하고, 캘린더·목표·대시보드·보고서에서 다시 꺼내 쓸 수 있도록 만든 서비스입니다.",
    featuresTitle: "현재 WorkNote에서 직접 사용할 수 있는 기능",
    features: [
      ["업무 기록", "등록·조회·수정·삭제와 상세 페이지를 제공하고, 작성 시 AI 분석 결과를 함께 저장합니다.", "01"],
      ["AI 업무 분석", "요약, 기술 태그, 난이도, 예상 면접 질문으로 업무 경험을 구조화합니다.", "02"],
      ["Azure OCR", "이미지 메모를 업로드하면 실제 이미지 검증 후 OCR하고 업무일지 초안으로 변환합니다.", "03"],
      ["Calendar", "월간 업무 기록과 목표를 함께 보고 업무 날짜 이동, 목표 기간 이동·Resize가 가능합니다.", "04"],
      ["Goal Planner", "목표 기간, 상태, 진행률을 관리하고 게이지를 직접 드래그해 진행도를 수정합니다.", "05"],
      ["Dashboard", "누적 업무 수, 난이도, 주요 기술 태그, 최근 활동을 사용자별로 집계합니다.", "06"],
      ["AI Report · PDF", "누적 기록을 AI 보고서로 정리하고 PDF 형태로 출력합니다.", "07"],
      ["KO / JA", "한국어와 일본어 UI를 제공해 실제 일본 취업 포트폴리오로 사용할 수 있게 구성했습니다.", "08"],
    ],
    engTitle: "화면 뒤에서 어떤 요청 흐름이 일어나는가",
    engText: "클라이언트의 userId를 신뢰하지 않고 JWT 인증 정보에서 사용자를 확인하며, 외부 AI/OCR 호출과 데이터 저장을 Backend에서 통제합니다.",
    architecture: [
      ["React + Vite", "UI · Calendar · Drag & Drop", "Client"],
      ["Spring Security", "JWT · Authentication · Ownership", "Security"],
      ["Spring Boot", "REST API · Validation · Business Logic", "Server"],
      ["PostgreSQL", "WorkLog · Goal · Usage Data", "Data"],
      ["Ollama", "Summary · Tags · Interview Questions", "AI"],
      ["Azure OCR", "Image → Text → Draft", "External"],
    ],
    securityTitle: "클라이언트가 보내는 userId를 신뢰하지 않도록 바꿨습니다.",
    securityText: "초기에는 Dashboard URL에 userId를 전달했지만, 브라우저나 직접 API 호출에서 값이 바뀔 수 있어 JWT에서 로그인 사용자를 확인하는 방식으로 변경했습니다.",
    before: "BEFORE",
    after: "AFTER",
    beforeLines: ["Dashboard 요청에 사용자 식별값 포함", "Client가 식별값을 전달", "브라우저에서 값 조작 가능성"],
    afterLines: ["Dashboard 요청은 인증 정보만 사용", "JWT에서 로그인 사용자 확인", "인증된 사용자 데이터만 조회"],
    securityChecks: [
      ["다른 사용자 리소스 접근", "소유권 검증"],
      ["JWT 누락·변조", "인증 단계에서 차단"],
      ["AI / OCR 과다 호출", "사용자별 일일 제한"],
      ["이미지 파일 위장", "MIME + 실제 이미지 포맷 검증"],
      ["과도한 입력 길이", "Backend validation"],
      ["운영 JWT Secret", "환경변수 필수"],
    ],
    caseTitle: "개발 중 발견한 문제와 해결 방법",
    cases: [
      ["01 · 권한 검증", "프론트에서 막았다고 안전한 것은 아니다", "ID, 길이 제한, 소유권처럼 보안에 영향을 주는 값은 Backend가 다시 검증하도록 변경했습니다."],
      ["02 · 날짜 모델", "작성 시각과 업무 날짜는 같은 값이 아니다", "Calendar Drag & Drop을 위해 createdAt은 이력으로 유지하고 workDate를 별도로 분리했습니다."],
      ["03 · 외부 API 비용", "AI 기능은 성공 여부뿐 아니라 비용도 설계 대상이다", "Ollama·Azure OCR을 사용자별 일일 한도로 통제하고 초과 시 429 흐름으로 처리합니다."],
      ["04 · 기능 연결", "기능이 서로 연결되어야 서비스가 된다", "업무 기록 → AI 분석 → Calendar/Goal → Dashboard/Report로 한 경험 흐름을 만들었습니다."],
    ],
    qualityTitle: "현재 WorkNote에 적용한 안정성·보안",
    implemented: "현재 적용",
    implementedItems: ["JWT + BCrypt", "Dashboard/Goal 소유권 검증", "Backend 입력 검증", "AI/OCR 사용량 제한", "이미지 실포맷 검증", "운영 JWT_SECRET 필수"],
    stackTitle: "프로젝트에서 실제 사용한 기술",
    ctaTitle: "직접 기능과 구현을 확인해보세요.",
    ctaText: "WorkNote에 로그인해 실제 기능을 사용하거나 GitHub에서 구현 코드를 확인할 수 있습니다.",
    footer: "개발자의 업무 기록을 설명 가능한 성장 데이터로 바꾸는 개인 프로젝트",
  },
  ja: {
    nav: ["30秒デモ", "主な機能", "技術構成", "課題と改善", "技術スタック"],
    login: "ログイン",
    eyebrow: "AI-POWERED DEVELOPER WORK JOURNAL",
    hero1: "毎日の業務記録を",
    hero2: "説明できる成長データへ",
    intro: "業務日誌をAIが要約・技術タグ・想定面接質問として構造化し、カレンダー・目標・ダッシュボード・レポートで再利用できるエンジニア向け業務記録サービスです。",
    demoBtn: "30秒デモを体験",
    tryBtn: "実際に使う",
    proof: ["JWT認証", "所有権チェック", "AI・OCR日次制限", "Calendar D&D", "Azure OCR", "PDF Report"],
    demoEyebrow: "30 SECOND INTERACTIVE DEMO",
    demoTitle: "1件の記録が、どのように成長データへ変わるのか",
    demoText: "タイトルと業務内容を実際に入力し、分析結果が生成される流れをログインせずに体験できます。下のボタンからインタラクティブデモを開始できます。",
    demoSteps: [
      ["業務記録", "Spring Securityで他ユーザーのDashboardへアクセスできる可能性を確認し、権限チェックを修正した。"],
      ["AI分析", "要約、Spring Security・JWTタグ、想定面接質問を生成します。"],
      ["業務カレンダー", "業務日と目標期間を確認し、Drag & Dropで日程を変更できます。"],
      ["成長データ", "DashboardとAI Reportで蓄積した技術と問題解決経験を振り返ります。"],
    ],
    whyTitle: "業務を記録しても、後から自分の経験として説明しにくい。その課題から始めました。",
    whyText: "WorkNoteは、日々の業務記録をAIで要約・技術タグ・想定面接質問に整理し、カレンダー・目標・ダッシュボード・レポートから振り返れるようにしたサービスです。",
    featuresTitle: "現在のWorkNoteで実際に利用できる機能",
    features: [
      ["業務記録", "登録・照会・修正・削除と詳細画面を提供し、登録時にAI分析結果も保存します。", "01"],
      ["AI業務分析", "要約・技術タグ・難易度・想定面接質問として業務経験を構造化します。", "02"],
      ["Azure OCR", "画像メモを実画像として検証後OCRし、業務日誌の下書きへ変換します。", "03"],
      ["Calendar", "月間の業務記録と目標を表示し、業務日の移動や目標期間の移動・Resizeができます。", "04"],
      ["Goal Planner", "期間・状態・進捗率を管理し、ゲージをドラッグして進捗を更新できます。", "05"],
      ["Dashboard", "業務件数、難易度、主要技術タグ、最近の活動をユーザー別に集計します。", "06"],
      ["AI Report · PDF", "蓄積した記録をAIレポートとして整理し、PDF出力できます。", "07"],
      ["KO / JA", "韓国語・日本語UIに対応し、日本での転職用ポートフォリオとして構成しました。", "08"],
    ],
    engTitle: "画面の裏側で、どのようなリクエストが流れるのか",
    engText: "クライアントのuserIdを信用せず、JWT認証情報からユーザーを確定し、外部AI/OCR呼び出しとデータ保存をBackendで制御します。",
    architecture: [
      ["React + Vite", "UI · Calendar · Drag & Drop", "Client"],
      ["Spring Security", "JWT · Authentication · Ownership", "Security"],
      ["Spring Boot", "REST API · Validation · Business Logic", "Server"],
      ["PostgreSQL", "WorkLog · Goal · Usage Data", "Data"],
      ["Ollama", "Summary · Tags · Interview Questions", "AI"],
      ["Azure OCR", "Image → Text → Draft", "External"],
    ],
    securityTitle: "クライアントから渡されたuserIdを信用しない設計に変更しました。",
    securityText: "初期版ではDashboard URLにuserIdを渡していましたが、ブラウザやAPIから値を変更できるため、JWTからログインユーザーを確定する方式へ変更しました。",
    before: "BEFORE",
    after: "AFTER",
    beforeLines: ["Dashboard要求にユーザー識別値を含める", "Clientが識別値を渡す", "ブラウザから値を変更できる可能性"],
    afterLines: ["Dashboard要求は認証情報のみ利用", "JWTからログインユーザーを確定", "認証済みユーザーのデータのみ取得"],
    securityChecks: [
      ["他ユーザーのリソース", "所有権チェック"],
      ["JWT未送信・改ざん", "認証段階で拒否"],
      ["AI / OCR過剰利用", "ユーザー別日次制限"],
      ["画像ファイル偽装", "MIME + 実画像形式の検証"],
      ["過剰な入力長", "Backend validation"],
      ["本番JWT Secret", "環境変数を必須化"],
    ],
    caseTitle: "開発中に見つけた課題と、その改善",
    cases: [
      ["01 · 権限チェック", "フロントで制限しても安全とは限らない", "ID・入力長・所有権などセキュリティに関わる値はBackendでも再検証するようにしました。"],
      ["02 · 日付モデル", "作成時刻と業務日は同じデータではない", "CalendarのDrag & Dropに対応するためcreatedAtは履歴として保持し、workDateを分離しました。"],
      ["03 · 外部APIコスト", "AI機能は成功可否だけでなくコストも設計対象", "Ollama・Azure OCRをユーザー別日次上限で制御し、超過時は429の流れで処理します。"],
      ["04 · 機能連携", "機能同士がつながって初めてサービスになる", "業務記録 → AI分析 → Calendar/Goal → Dashboard/Reportという体験をつなげました。"],
    ],
    qualityTitle: "現在WorkNoteに適用している安定性・セキュリティ対策",
    implemented: "現在適用中",
    implementedItems: ["JWT + BCrypt", "Dashboard/Goal所有権チェック", "Backend入力検証", "AI/OCR利用回数制限", "画像実形式検証", "本番JWT_SECRET必須"],
    stackTitle: "プロジェクトで実際に使用した技術",
    ctaTitle: "実際の機能と実装をご確認ください。",
    ctaText: "WorkNoteにログインして機能を試すか、GitHubで実装コードを確認できます。",
    footer: "エンジニアの業務記録を、説明できる成長データへ変える個人プロジェクト",
  },
};

const INTERACTIVE_DEMO_COPY = {
  ko: {
    badge: "30초 INTERACTIVE DEMO",
    title: "업무 기록을 직접 넣어보세요.",
    description: "로그인 없이 입력 → 분석 → 결과 확인 흐름을 체험할 수 있습니다. 이 데모는 포트폴리오 체험용으로 브라우저에서 동작하며 실제 AI 사용량을 소비하지 않습니다.",
    titleLabel: "업무 제목",
    contentLabel: "업무 내용",
    titlePlaceholder: "예: Dashboard 권한 검사 개선",
    contentPlaceholder: "오늘 해결한 문제와 적용한 기술을 간단히 적어보세요.",
    analyze: "AI 분석 시작",
    analyzing: "업무 기록을 분석하고 있습니다",
    analyzeSteps: ["업무 내용 구조화", "기술 키워드 추출", "면접 질문 생성"],
    result: "분석 결과",
    summary: "AI 요약",
    tags: "기술 태그",
    difficulty: "난이도",
    question: "예상 면접 질문",
    difficultyValue: "중급",
    flow: "이 결과는 실제 WorkNote에서 Calendar · Dashboard · AI Report로 이어집니다.",
    retry: "다시 입력하기",
    useReal: "실제 기능 사용하기",
    close: "닫기",
    sample: "샘플로 채우기",
    empty: "제목과 업무 내용을 입력해주세요.",
    demoLabel: "DEMO RESULT",
    launch: "직접 30초 데모 체험하기",
  },
  ja: {
    badge: "30秒 INTERACTIVE DEMO",
    title: "業務記録を実際に入力してみてください。",
    description: "ログインせずに、入力 → 分析 → 結果確認の流れを体験できます。このデモはポートフォリオ体験用としてブラウザ上で動作し、実際のAI利用回数は消費しません。",
    titleLabel: "業務タイトル",
    contentLabel: "業務内容",
    titlePlaceholder: "例：Dashboard権限チェック改善",
    contentPlaceholder: "今日解決した課題と利用した技術を簡単に入力してください。",
    analyze: "AI分析を開始",
    analyzing: "業務記録を分析しています",
    analyzeSteps: ["業務内容を構造化", "技術キーワードを抽出", "面接質問を生成"],
    result: "分析結果",
    summary: "AI要約",
    tags: "技術タグ",
    difficulty: "難易度",
    question: "想定面接質問",
    difficultyValue: "中級",
    flow: "この結果は実際のWorkNoteでは Calendar · Dashboard · AI Report に連携されます。",
    retry: "もう一度入力",
    useReal: "実際の機能を使う",
    close: "閉じる",
    sample: "サンプルを入力",
    empty: "タイトルと業務内容を入力してください。",
    demoLabel: "DEMO RESULT",
    launch: "30秒デモを実際に体験する",
  },
};

const DEMO_SAMPLE = {
  ko: {
    title: "Dashboard 권한 검사 개선",
    body: "Spring Security에서 다른 사용자의 Dashboard에 접근할 수 있는 가능성을 확인했다. 클라이언트가 전달하는 userId 대신 JWT 인증 사용자 정보를 기준으로 조회하도록 수정하고 소유권 검사를 추가했다.",
  },
  ja: {
    title: "Dashboard権限チェック改善",
    body: "Spring Securityで他ユーザーのDashboardへアクセスできる可能性を確認した。クライアントから渡されるuserIdではなくJWT認証ユーザーを基準に取得するよう修正し、所有権チェックを追加した。",
  },
};

const STACKS = [
  ["Frontend", "React", "Vite", "Axios", "React Router", "Recharts"],
  ["Backend", "Java 21", "Spring Boot", "Spring Security", "Spring Data JPA", "WebClient"],
  ["Data & AI", "PostgreSQL", "Supabase", "Ollama", "Azure Document Intelligence"],
  ["Deploy & Etc.", "Vercel", "Render", "Docker", "JWT", "PDFBox", "Swagger"],
];

function LandingPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem("language") === "ja" ? "ja" : "ko");
  const [demoStep, setDemoStep] = useState(0);
  const [demoCycleKey, setDemoCycleKey] = useState(0);
  const [demoPaused, setDemoPaused] = useState(false);
  const [interactiveDemoOpen, setInteractiveDemoOpen] = useState(false);
  const [interactiveDemoPhase, setInteractiveDemoPhase] = useState("input");
  const [interactiveDemoProgress, setInteractiveDemoProgress] = useState(0);
  const [interactiveDemoTitle, setInteractiveDemoTitle] = useState("");
  const [interactiveDemoBody, setInteractiveDemoBody] = useState("");
  const [interactiveDemoError, setInteractiveDemoError] = useState("");
  const demoTimers = useRef([]);
  const c = COPY[language];
  const interactiveCopy = INTERACTIVE_DEMO_COPY[language];
  const githubUrl = import.meta.env.VITE_GITHUB_URL?.trim();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (interactiveDemoOpen || demoPaused) return undefined;
    const timer = window.setTimeout(() => {
      setDemoStep((step) => (step + 1) % c.demoSteps.length);
    }, 4800);
    return () => window.clearTimeout(timer);
  }, [demoStep, demoCycleKey, demoPaused, interactiveDemoOpen, c.demoSteps.length]);

  useEffect(() => () => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (!interactiveDemoOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeInteractiveDemo();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [interactiveDemoOpen]);

  const changeLanguage = (next) => {
    setLanguage(next);
    localStorage.setItem("language", next);
  };

  const clearDemoTimers = () => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
  };

  const fillDemoSample = () => {
    const sample = DEMO_SAMPLE[language];
    setInteractiveDemoTitle(sample.title);
    setInteractiveDemoBody(sample.body);
    setInteractiveDemoError("");
  };

  const openInteractiveDemo = () => {
    clearDemoTimers();
    const sample = DEMO_SAMPLE[language];
    setInteractiveDemoTitle(sample.title);
    setInteractiveDemoBody(sample.body);
    setInteractiveDemoPhase("input");
    setInteractiveDemoProgress(0);
    setInteractiveDemoError("");
    setInteractiveDemoOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeInteractiveDemo = () => {
    clearDemoTimers();
    setInteractiveDemoOpen(false);
    setInteractiveDemoPhase("input");
    setInteractiveDemoProgress(0);
    document.body.style.overflow = "";
  };

  const runInteractiveDemo = () => {
    if (!interactiveDemoTitle.trim() || !interactiveDemoBody.trim()) {
      setInteractiveDemoError(interactiveCopy.empty);
      return;
    }

    clearDemoTimers();
    setInteractiveDemoError("");
    setInteractiveDemoPhase("analyzing");
    setInteractiveDemoProgress(18);
    demoTimers.current = [
      window.setTimeout(() => setInteractiveDemoProgress(46), 450),
      window.setTimeout(() => setInteractiveDemoProgress(74), 950),
      window.setTimeout(() => setInteractiveDemoProgress(94), 1450),
      window.setTimeout(() => {
        setInteractiveDemoProgress(100);
        setInteractiveDemoPhase("result");
      }, 1900),
    ];
  };

  const buildInteractiveResult = () => {
    const text = `${interactiveDemoTitle} ${interactiveDemoBody}`.toLowerCase();
    const rules = [
      { keys: ["spring", "security", "jwt", "권한", "인증", "権限", "認証"], tags: ["Spring Security", "JWT", "Authorization"], ko: "인증·권한 구조를 개선한 경험에서 보안 경계를 어떻게 설정했나요?", ja: "認証・権限構造を改善する際、セキュリティ境界をどのように設計しましたか？" },
      { keys: ["react", "calendar", "drag", "drop", "캘린더", "カレンダー"], tags: ["React", "Calendar", "Drag & Drop"], ko: "캘린더 인터랙션의 상태와 서버 데이터를 어떻게 동기화했나요?", ja: "カレンダー操作の状態とサーバーデータをどのように同期しましたか？" },
      { keys: ["postgres", "sql", "jpa", "database", "db", "데이터베이스"], tags: ["PostgreSQL", "JPA", "Data Modeling"], ko: "데이터 모델을 설계하면서 가장 중요하게 고려한 기준은 무엇인가요?", ja: "データモデル設計で最も重視した基準は何ですか？" },
      { keys: ["ocr", "azure", "image", "이미지", "画像"], tags: ["Azure OCR", "File Validation", "REST API"], ko: "외부 OCR API의 비용과 파일 보안을 어떻게 통제했나요?", ja: "外部OCR APIのコストとファイルセキュリティをどのように制御しましたか？" },
      { keys: ["docker", "render", "vercel", "deploy", "배포", "デプロイ"], tags: ["Docker", "Deployment", "Environment"], ko: "개발환경과 운영환경의 설정 차이를 어떻게 관리했나요?", ja: "開発環境と本番環境の設定差異をどのように管理しましたか？" },
    ];
    const matched = rules.find((rule) => rule.keys.some((key) => text.includes(key)));
    const tags = matched?.tags ?? ["Problem Solving", "Backend", "Work Log"];
    const cleanBody = interactiveDemoBody.trim().replace(/\s+/g, " ");
    const clipped = cleanBody.length > 92 ? `${cleanBody.slice(0, 92)}…` : cleanBody;
    return {
      summary: language === "ja"
        ? `${interactiveDemoTitle.trim()}：${clipped}`
        : `${interactiveDemoTitle.trim()} — ${clipped}`,
      tags,
      question: matched ? matched[language] : (language === "ja" ? "この業務で発生した課題と、解決のために選択した方法を説明してください。" : "이 업무에서 발생한 문제와 해결을 위해 선택한 방법을 설명해주세요."),
    };
  };

  const selectDemoStep = (index) => {
    setDemoStep(index);
    setDemoCycleKey((value) => value + 1);
  };

  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const demo = c.demoSteps[demoStep];
  const v = language === "ja" ? {
    title: "Dashboard権限チェック改善",
    body: "Spring Securityで他ユーザーのDashboardへアクセスできる可能性を確認し、JWTユーザー基準で権限チェックを修正した。",
    aiIncluded: "AI分析を含む", save: "記録を保存 →",
    summary: "Dashboardアクセス権限をJWT認証ユーザー基準へ改善",
    question: "IDORを防ぐため、ユーザー識別方式をどのように改善しましたか？",
    calendarWork: "JWT権限改善", goal: "Security Goal",
    month: "SEPTEMBER 2026", logs: "+4 this month", records: "8 records",
    report: "9月の業務経験が\n面接質問として整理されました。"
  } : {
    title: "Dashboard 권한 검사 개선",
    body: "Spring Security에서 다른 사용자의 Dashboard 접근 가능성을 확인하고 JWT 사용자 기준으로 권한 검사를 수정했다.",
    aiIncluded: "AI 분석 포함", save: "기록 저장 →",
    summary: "Dashboard 접근 권한을 JWT 인증 사용자 기준으로 개선",
    question: "IDOR를 방지하기 위해 사용자 식별 방식을 어떻게 개선했나요?",
    calendarWork: "JWT 권한 개선", goal: "Security Goal",
    month: "SEPTEMBER 2026", logs: "+4 this month", records: "8 records",
    report: "9월 업무 경험이\n면접 질문으로 정리되었습니다."
  };

  const demoVisual = useMemo(() => {
    if (demoStep === 0) {
      return (
        <div className="demo-worklog">
          <div className="demo-form-label">TITLE</div>
          <div className="demo-input">{v.title}</div>
          <div className="demo-form-label">WORK LOG</div>
          <div className="demo-textarea">{v.body}</div>
          <div className="demo-submit"><span>{v.aiIncluded}</span><b>{v.save}</b></div>
        </div>
      );
    }
    if (demoStep === 1) {
      return (
        <div className="demo-ai-result">
          <div className="ai-result-head"><span>AI ANALYSIS</span><b>Ready</b></div>
          <h4>{v.summary}</h4>
          <div className="demo-tags"><span>Spring Security</span><span>JWT</span><span>Authorization</span></div>
          <div className="demo-question"><small>INTERVIEW QUESTION</small><p>{v.question}</p></div>
        </div>
      );
    }
    if (demoStep === 2) {
      return (
        <div className="demo-calendar">
          <div className="calendar-head"><b>{v.month}</b><span>‹　›</span></div>
          <div className="calendar-week">{["MON","TUE","WED","THU","FRI","SAT","SUN"].map((d) => <span key={d}>{d}</span>)}</div>
          <div className="calendar-days">
            {[7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28].map((d) => (
              <div key={d} className={d === 12 ? "focus-day" : ""}><small>{d}</small>{d === 10 && <i className="work-pill">{v.calendarWork}</i>}{d >= 12 && d <= 15 && <i className="goal-pill">{v.goal}</i>}</div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="demo-dashboard">
        <div className="dash-stat"><small>WORK LOGS</small><strong>24</strong><span>{v.logs}</span></div>
        <div className="dash-stat"><small>TOP SKILL</small><strong>Spring</strong><span>{v.records}</span></div>
        <div className="dash-chart"><small>ACTIVITY</small><div>{[38,62,52,80,55,92,70,84].map((h, i) => <i key={i} style={{height:`${h}%`}} />)}</div></div>
        <div className="dash-report"><small>AI REPORT</small><b>{v.report.split("\n").map((line, i) => <span key={line}>{i > 0 && <br/>}{line}</span>)}</b><span>PDF Ready →</span></div>
      </div>
    );
  }, [demoStep, language]);

  const interactiveResult = buildInteractiveResult();

  return (
    <div className="landing-v2">
      <header className="landing-header-v2">
        <a href="/" className="brand-v2"><b>W</b><span>WorkNote</span></a>
        <nav>
          <button onClick={openInteractiveDemo}>{c.nav[0]}</button>
          <button onClick={() => scroll("features")}>{c.nav[1]}</button>
          <button onClick={() => scroll("engineering")}>{c.nav[2]}</button>
          <button onClick={() => scroll("case-study")}>{c.nav[3]}</button>
          <button onClick={() => scroll("stack")}>{c.nav[4]}</button>
        </nav>
        <div className="header-right-v2">
          <div className="language-v2" role="group" aria-label={language === "ja" ? "言語選択" : "언어 선택"}>
            <button
              type="button"
              className={language === "ko" ? "active" : ""}
              onClick={() => changeLanguage("ko")}
              aria-pressed={language === "ko"}
            >
              <span className="language-mark" aria-hidden="true">한</span>
              <span>한국어</span>
            </button>
            <button
              type="button"
              className={language === "ja" ? "active" : ""}
              onClick={() => changeLanguage("ja")}
              aria-pressed={language === "ja"}
            >
              <span className="language-mark" aria-hidden="true">日</span>
              <span>日本語</span>
            </button>
          </div>
          <button className="header-login" onClick={() => navigate("/login")}>{c.login}</button>
        </div>
      </header>

      <main>
        <section className="hero-v2">
          <div className="hero-copy-v2">
            <span className="hero-eyebrow">{c.eyebrow}</span>
            <h1><span className="hero-title-primary">{c.hero1}</span><strong>{c.hero2}</strong></h1>
            <p>{c.intro}</p>
            <div className="hero-buttons-v2">
              <button className="btn-demo" onClick={openInteractiveDemo}><span className="play">▶</span>{c.demoBtn}</button>
              <button className="btn-try" onClick={() => navigate("/login")}>{c.tryBtn}<b>→</b></button>
              {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}
            </div>
            <div className="proof-row">{c.proof.map((item) => <span key={item}>✓ {item}</span>)}</div>
          </div>

          <div className="hero-product-showcase">
            <div className="demo-chapter-tabs" aria-label={language === "ja" ? "デモ画面選択" : "데모 화면 선택"}>
              {c.demoSteps.map((step, index) => (
                <button
                  type="button"
                  key={step[0]}
                  className={index === demoStep ? "active" : ""}
                  onClick={() => selectDemoStep(index)}
                  aria-pressed={index === demoStep}
                >
                  <small>0{index + 1}</small>
                  <span>{step[0]}</span>
                </button>
              ))}
              <button
                type="button"
                className="demo-rotation-control"
                onClick={() => setDemoPaused((value) => !value)}
                aria-pressed={demoPaused}
              >
                <small>AUTO</small>
                <span>{demoPaused ? (language === "ja" ? "▶ 再開" : "▶ 재생") : (language === "ja" ? "Ⅱ 一時停止" : "Ⅱ 일시정지")}</span>
              </button>
            </div>
            <div className="hero-product-demo" aria-label="WorkNote product demo preview">
              <div className="browser-bar"><div><i/><i/><i/></div><span>worknote-ai.vercel.app</span><em>{demoPaused ? "PAUSED" : "AUTO · 4.8s"}</em></div>
              <div className="product-shell">
                <aside><b>W</b><i className="on"/><i/><i/><i/></aside>
                <div className="product-stage">
                  <div className="stage-head"><div><small>WORKNOTE</small><strong>{demo[0]}</strong></div><span>0{demoStep + 1} / 04</span></div>
                  <div className="stage-body">{demoVisual}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="product-story" id="demo">
          <div className="section-heading centered"><span>{c.demoEyebrow}</span><h2>{c.demoTitle}</h2><p>{c.demoText}</p><button className="story-demo-launch" onClick={openInteractiveDemo}><span>▶</span>{interactiveCopy.launch}</button></div>
          <div className="story-grid">
            {c.demoSteps.map(([title, text], index) => (
              <button key={title} className={demoStep === index ? "active" : ""} onClick={() => selectDemoStep(index)}>
                <span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><i>→</i>
              </button>
            ))}
          </div>
        </section>

        <section className="why-v2">
          <div><span>PROBLEM TO SOLVE</span><h2>{c.whyTitle}</h2></div><p>{c.whyText}</p>
        </section>

        <section className="landing-section" id="features">
          <div className="section-heading"><span>PRODUCT FEATURES</span><h2>{c.featuresTitle}</h2></div>
          <div className="feature-grid-v2">
            {c.features.map(([title, text, no]) => <article key={title}><span>{no}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="engineering-section" id="engineering">
          <div className="engineering-inner">
            <div className="section-heading light"><span>ENGINEERING / UNDER THE HOOD</span><h2>{c.engTitle}</h2><p>{c.engText}</p></div>
            <div className="architecture-v2">
              {c.architecture.map(([title, desc, role], index) => <article key={title}><small>{role}</small><span>0{index + 1}</span><h3>{title}</h3><p>{desc}</p>{index < c.architecture.length - 1 && <b className="flow-arrow">→</b>}</article>)}
            </div>
          </div>
        </section>

        <section className="landing-section security-section">
          <div className="section-heading"><span>SECURITY HARDENING</span><h2>{c.securityTitle}</h2><p>{c.securityText}</p></div>
          <div className="security-before-after">
            <article className="before-card"><header><span>{c.before}</span><b>Client-trusted ID</b></header>{c.beforeLines.map((line, i) => <p key={line}><i>{i + 1}</i>{line}</p>)}</article>
            <div className="security-arrow"><span>REVIEW</span><b>→</b></div>
            <article className="after-card"><header><span>{c.after}</span><b>JWT-owned identity</b></header>{c.afterLines.map((line, i) => <p key={line}><i>{i + 1}</i>{line}</p>)}</article>
          </div>
          <div className="security-checks">{c.securityChecks.map(([risk, defense]) => <article key={risk}><span>✓</span><div><small>{risk}</small><b>{defense}</b></div></article>)}</div>
        </section>

        <section className="case-section" id="case-study">
          <div className="section-heading"><span>PROBLEM → SOLUTION</span><h2>{c.caseTitle}</h2></div>
          <div className="case-list">{c.cases.map(([eyebrow, title, text]) => <article key={eyebrow}><span>{eyebrow}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <section className="quality-section">
          <div className="section-heading"><span>RELIABILITY & SECURITY</span><h2>{c.qualityTitle}</h2></div>
          <div className="quality-columns is-single">
            <article><header><i className="done-dot"/><h3>{c.implemented}</h3></header><div className="quality-applied-grid">{c.implementedItems.map((item) => <p key={item}>✓ <span>{item}</span></p>)}</div></article>
          </div>
        </section>

        <section className="landing-section" id="stack">
          <div className="section-heading"><span>TECH STACK</span><h2>{c.stackTitle}</h2></div>
          <div className="stack-grid-v2">{STACKS.map(([title, ...items]) => <article key={title}><h3>{title}</h3><div>{items.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div>
        </section>

        <section className="final-cta">
          <div><span>LIVE PRODUCT / SOURCE</span><h2>{c.ctaTitle}</h2><p>{c.ctaText}</p></div>
          <div className="final-actions"><button onClick={() => navigate("/login")}>{c.tryBtn}<b>→</b></button>{githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}</div>
        </section>
      </main>

      {interactiveDemoOpen && (
        <div className="interactive-demo-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeInteractiveDemo(); }}>
          <section className="interactive-demo-modal" role="dialog" aria-modal="true" aria-labelledby="interactive-demo-title">
            <header className="interactive-demo-header">
              <div><span>{interactiveCopy.badge}</span><h2 id="interactive-demo-title">{interactiveCopy.title}</h2><p>{interactiveCopy.description}</p></div>
              <button className="interactive-demo-close" type="button" onClick={closeInteractiveDemo} aria-label={interactiveCopy.close}>×</button>
            </header>

            <div className={`interactive-demo-content phase-${interactiveDemoPhase}`}>
              <div className="interactive-demo-editor">
                <div className="interactive-demo-editor-head"><strong>WORK LOG</strong><button type="button" onClick={fillDemoSample}>{interactiveCopy.sample}</button></div>
                <label>{interactiveCopy.titleLabel}<input value={interactiveDemoTitle} onChange={(event) => setInteractiveDemoTitle(event.target.value)} maxLength={80} placeholder={interactiveCopy.titlePlaceholder} disabled={interactiveDemoPhase === "analyzing"} /></label>
                <label>{interactiveCopy.contentLabel}<textarea value={interactiveDemoBody} onChange={(event) => setInteractiveDemoBody(event.target.value)} maxLength={800} placeholder={interactiveCopy.contentPlaceholder} disabled={interactiveDemoPhase === "analyzing"} /></label>
                <div className="interactive-demo-count">{interactiveDemoBody.length} / 800</div>
                {interactiveDemoError && <p className="interactive-demo-error">{interactiveDemoError}</p>}
                {interactiveDemoPhase !== "analyzing" && (
                  <button className="interactive-analyze-button" type="button" onClick={runInteractiveDemo}><span>✦</span>{interactiveCopy.analyze}<b>→</b></button>
                )}
              </div>

              <div className="interactive-demo-output">
                {interactiveDemoPhase === "input" && (
                  <div className="interactive-demo-empty">
                    <div className="demo-ai-orb">AI</div>
                    <strong>WorkNote AI</strong>
                    <p>{language === "ja" ? "左側に業務内容を入力してAI分析を開始してください。" : "왼쪽에 업무 내용을 입력하고 AI 분석을 시작해보세요."}</p>
                    <div><span>SUMMARY</span><span>TECH TAGS</span><span>QUESTION</span></div>
                  </div>
                )}

                {interactiveDemoPhase === "analyzing" && (
                  <div className="interactive-demo-loading">
                    <div className="demo-ai-orb loading">AI</div>
                    <strong>{interactiveCopy.analyzing}</strong>
                    <div className="interactive-progress"><i style={{ width: `${interactiveDemoProgress}%` }} /></div>
                    <b>{interactiveDemoProgress}%</b>
                    <ul>{interactiveCopy.analyzeSteps.map((step, index) => <li key={step} className={interactiveDemoProgress >= [20, 50, 78][index] ? "done" : ""}><span>{interactiveDemoProgress >= [20, 50, 78][index] ? "✓" : index + 1}</span>{step}</li>)}</ul>
                  </div>
                )}

                {interactiveDemoPhase === "result" && (
                  <div className="interactive-demo-result">
                    <div className="interactive-result-title"><span>{interactiveCopy.demoLabel}</span><b>✓ {interactiveCopy.result}</b></div>
                    <article><small>{interactiveCopy.summary}</small><p>{interactiveResult.summary}</p></article>
                    <div className="interactive-result-row">
                      <article><small>{interactiveCopy.tags}</small><div className="interactive-result-tags">{interactiveResult.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>
                      <article className="difficulty-card"><small>{interactiveCopy.difficulty}</small><strong>●●●○</strong><b>{interactiveCopy.difficultyValue}</b></article>
                    </div>
                    <article className="question-card"><small>{interactiveCopy.question}</small><p>{interactiveResult.question}</p></article>
                    <div className="interactive-demo-flow"><span>Work Log</span><b>→</b><span>AI Analysis</span><b>→</b><span>Calendar</span><b>→</b><span>Dashboard</span></div>
                    <p className="interactive-demo-flow-note">{interactiveCopy.flow}</p>
                    <div className="interactive-demo-result-actions"><button type="button" onClick={() => { setInteractiveDemoPhase("input"); setInteractiveDemoProgress(0); }}>{interactiveCopy.retry}</button><button type="button" className="primary" onClick={() => { closeInteractiveDemo(); navigate("/login"); }}>{interactiveCopy.useReal}<b>→</b></button></div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      <footer className="landing-footer-v2"><b>WorkNote</b><p>{c.footer}</p><span>© {new Date().getFullYear()} WorkNote</span></footer>
    </div>
  );
}

export default LandingPage;
