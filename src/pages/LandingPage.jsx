import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const COPY = {
  ko: {
    menu: ["주요 기능", "구조", "기술 스택"],
    login: "로그인",
    eyebrow: "AI-Powered Developer Work Journal",
    hero1: "매일의 업무 기록을",
    hero2: "개발자의 성장 데이터로",
    intro:
      "WorkNote는 개발자가 작성한 업무일지를 AI가 분석해 요약, 기술 태그, 예상 면접 질문, 난이도로 구조화하고 누적 경험을 대시보드와 보고서로 확인할 수 있는 서비스입니다.",
    start: "WorkNote 시작하기",
    more: "기능 살펴보기",
    whyTitle: "기록은 쌓이지만, 성장은 한눈에 보이지 않았습니다.",
    whyText:
      "매일 업무일지를 작성해도 기록이 많아질수록 과거 내용을 하나씩 다시 확인해야 했습니다. WorkNote는 흩어진 업무 기록을 AI가 구조화해 어떤 기술을 경험했고 어떤 문제를 해결했는지 다시 확인할 수 있도록 만들었습니다.",
    featureTitle: "업무 기록부터 AI 보고서까지",
    features: [
      ["업무일지 관리", "업무 제목과 내용을 등록하고 조회, 수정, 삭제할 수 있습니다."],
      ["AI 업무 분석", "업무 내용을 AI가 분석해 핵심 내용을 자연어로 요약합니다."],
      ["기술 태그", "업무에 실제로 사용되거나 관련된 기술을 태그로 구조화합니다."],
      ["면접 질문", "기록한 개발 경험을 바탕으로 예상 면접 질문을 생성합니다."],
      ["성장 대시보드", "업무 수, 난이도 분포, 주요 기술 태그와 최근 활동을 확인합니다."],
      ["AI 보고서 · PDF", "누적 업무 데이터를 종합해 AI 보고서를 만들고 PDF로 출력합니다."],
    ],
    archTitle: "프론트엔드, 백엔드, AI를 분리한 구조",
    archText:
      "React가 Spring Boot REST API를 호출하고, Spring Security가 JWT를 검증합니다. 업무 분석이 필요한 경우 백엔드에서 Ollama를 호출하며 결과는 PostgreSQL에 저장합니다.",
    stackTitle: "프로젝트에 사용한 기술",
    ctaTitle: "직접 WorkNote를 사용해 보세요.",
    ctaText:
      "서비스 기능은 로그인 후 사용할 수 있습니다. 아래 버튼을 누르면 로그인 페이지로 이동합니다.",
    ctaButton: "로그인 페이지로 이동",
    footer: "개발자의 업무 기록을 성장 데이터로 바꾸는 개인 프로젝트",
  },
  ja: {
    menu: ["主な機能", "構成", "技術スタック"],
    login: "ログイン",
    eyebrow: "AI-Powered Developer Work Journal",
    hero1: "毎日の業務記録を",
    hero2: "エンジニアの成長データへ",
    intro:
      "WorkNoteは、業務日誌をAIが分析し、要約・技術タグ・想定面接質問・難易度として構造化し、蓄積した経験をダッシュボードやレポートで確認できるサービスです。",
    start: "WorkNoteを始める",
    more: "機能を見る",
    whyTitle: "記録は増えても、成長は一目では分かりませんでした。",
    whyText:
      "業務日誌が増えるほど過去の内容を一件ずつ確認する必要がありました。WorkNoteは、散らばった業務記録をAIで構造化し、経験した技術や解決した課題を振り返れるようにしました。",
    featureTitle: "業務記録からAIレポートまで",
    features: [
      ["業務日誌管理", "業務のタイトルと内容を登録・照会・修正・削除できます。"],
      ["AI業務分析", "業務内容をAIが分析し、重要な内容を自然な文章で要約します。"],
      ["技術タグ", "業務で使用した技術をタグとして構造化します。"],
      ["面接質問", "記録した開発経験をもとに想定面接質問を生成します。"],
      ["成長ダッシュボード", "業務件数、難易度分布、主要技術、最近の活動を可視化します。"],
      ["AIレポート・PDF", "蓄積した業務データをまとめてAIレポートとPDFを生成します。"],
    ],
    archTitle: "フロントエンド・バックエンド・AIを分離した構成",
    archText:
      "ReactからSpring Boot REST APIを呼び出し、Spring SecurityがJWTを検証します。分析が必要な場合はバックエンドからOllamaを呼び出し、結果をPostgreSQLへ保存します。",
    stackTitle: "プロジェクトで使用した技術",
    ctaTitle: "WorkNoteを実際に使ってみてください。",
    ctaText:
      "サービス機能はログイン後に利用できます。下のボタンからログインページへ移動できます。",
    ctaButton: "ログインページへ",
    footer: "開発者の業務記録を成長データへ変える個人プロジェクト",
  },
};

const STACKS = [
  ["Frontend", "React", "Vite", "Axios", "React Router"],
  ["Backend", "Java 21", "Spring Boot", "Spring Security", "Spring Data JPA", "WebClient"],
  ["Data & AI", "PostgreSQL", "Supabase", "Ollama"],
  ["Deploy & Etc.", "Vercel", "Render", "Docker", "JWT", "PDFBox", "Swagger"],
];

function LandingPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(
    localStorage.getItem("language") === "ja" ? "ja" : "ko"
  );

  const c = COPY[language];
  const githubUrl = import.meta.env.VITE_GITHUB_URL?.trim();

  const changeLanguage = (next) => {
    setLanguage(next);
    localStorage.setItem("language", next);
    document.documentElement.lang = next;
  };

  const scroll = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="landing">
      <header className="landing-header">
        <a href="/" className="brand"><b>W</b>WorkNote</a>

        <nav>
          <button onClick={() => scroll("features")}>{c.menu[0]}</button>
          <button onClick={() => scroll("architecture")}>{c.menu[1]}</button>
          <button onClick={() => scroll("stack")}>{c.menu[2]}</button>
        </nav>

        <div className="header-actions">
          <div className="language">
            <button className={language === "ko" ? "on" : ""} onClick={() => changeLanguage("ko")}>KO</button>
            <span>/</span>
            <button className={language === "ja" ? "on" : ""} onClick={() => changeLanguage("ja")}>JA</button>
          </div>
          <button className="login-btn" onClick={() => navigate("/login")}>{c.login}</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">{c.eyebrow}</p>
            <h1>{c.hero1}<strong>{c.hero2}</strong></h1>
            <p className="intro">{c.intro}</p>

            <div className="hero-actions">
              <button className="primary" onClick={() => navigate("/login")}>
                {c.start}<span>→</span>
              </button>
              <button className="secondary" onClick={() => scroll("features")}>{c.more}</button>
              {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}
            </div>
          </div>

          <div className="mock">
            <div className="mock-top"><i/><i/><i/><span>WorkNote · Dashboard</span></div>
            <div className="mock-body">
              <aside><b>W</b><i className="active"/><i/><i/></aside>
              <div className="mock-main">
                <div className="mock-title"><div><i/><b/></div><button>+</button></div>
                <div className="stats">
                  <article><small>Work Logs</small><strong>24</strong></article>
                  <article><small>Top Skill</small><strong>Spring</strong></article>
                  <article><small>AI Report</small><strong>Ready</strong></article>
                </div>
                <div className="mock-panels">
                  <article className="bars">
                    {[45,70,52,86,58,95,76].map((h, i) => <i key={i} style={{height:`${h}%`}} />)}
                  </article>
                  <article className="ai-card">
                    <b>AI</b><i/><i/><i/>
                    <div><span>Spring</span><span>JWT</span><span>React</span></div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="why">
          <div><p className="eyebrow">WHY WORKNOTE</p><h2>{c.whyTitle}</h2></div>
          <p>{c.whyText}</p>
        </section>

        <section className="section" id="features">
          <p className="eyebrow">FEATURES</p>
          <h2>{c.featureTitle}</h2>
          <div className="feature-grid">
            {c.features.map(([title, text], index) => (
              <article key={title}>
                <span>0{index + 1}</span><h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section dark" id="architecture">
          <p className="eyebrow">ARCHITECTURE</p>
          <h2>{c.archTitle}</h2>
          <p className="section-text">{c.archText}</p>
          <div className="flow">
            {[
              ["React + Vite", "UI · API"],
              ["Spring Boot", "REST · Security"],
              ["PostgreSQL", "Data"],
              ["Ollama", "AI Analysis"],
            ].map(([title, text], index) => (
              <article key={title}>
                <span>0{index + 1}</span><h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="stack">
          <p className="eyebrow">TECH STACK</p>
          <h2>{c.stackTitle}</h2>
          <div className="stack-grid">
            {STACKS.map(([title, ...items]) => (
              <article key={title}>
                <h3>{title}</h3>
                <div>{items.map((item) => <span key={item}>{item}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="cta">
          <div><p>TRY WORKNOTE</p><h2>{c.ctaTitle}</h2><span>{c.ctaText}</span></div>
          <button onClick={() => navigate("/login")}>{c.ctaButton}<b>→</b></button>
        </section>
      </main>

      <footer><b>WorkNote</b><p>{c.footer}</p><span>© {new Date().getFullYear()} WorkNote</span></footer>
    </div>
  );
}

export default LandingPage;
