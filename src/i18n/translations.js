const translations = {
  ko: {
    common: {
      korean: "한국어",
      japanese: "日本語",
      save: "저장",
      edit: "수정",
      delete: "삭제",
      cancel: "취소",
      close: "닫기",
      refresh: "새로고침",
      retry: "다시 시도",
      loading: "불러오는 중입니다.",
      noData: "데이터가 없습니다.",
    },

    navigation: {
      workLog: "업무일지",
      dashboard: "대시보드",
      aiReport: "AI 프로젝트 보고서",
      logout: "로그아웃",
    },

    auth: {
      loginTitle: "로그인",
      signupTitle: "회원가입",

      loginIdPlaceholder: "아이디",
      passwordPlaceholder: "비밀번호",
      passwordConfirmPlaceholder: "비밀번호 확인",
      nicknamePlaceholder: "닉네임",

      loginButton: "로그인",
      signupButton: "회원가입",
      goLogin: "로그인으로 돌아가기",

      loggingIn: "로그인 중...",
      signingUp: "회원가입 중...",

      loginIdRequired: "아이디를 입력해 주세요.",
      passwordRequired: "비밀번호를 입력해 주세요.",
      passwordConfirmRequired:
        "비밀번호 확인을 입력해 주세요.",
      passwordNotMatch: "비밀번호가 일치하지 않습니다.",
      nicknameRequired: "닉네임을 입력해 주세요.",

      loginError:
        "아이디 또는 비밀번호가 올바르지 않습니다.",
      signupError: "회원가입에 실패했습니다.",
      signupSuccess: "회원가입이 완료되었습니다.",
    },

    workLog: {
      eyebrow: "AI 업무 기록",
      title: "업무일지",
      description:
        "오늘 진행한 업무를 기록하고 AI 분석 결과를 확인합니다.",

      newEntryLabel: "새 업무 기록",
      editEntryLabel: "업무 기록 수정",
      historyLabel: "업무 기록",

      createTitle: "업무일지 작성",
      editTitle: "업무일지 수정",

      titleLabel: "제목",
      contentLabel: "업무 내용",

      titlePlaceholder:
        "업무일지 제목을 입력하세요.",
      contentPlaceholder:
        "오늘 진행한 업무 내용을 입력하세요.",

      aiSummary: "AI 요약",
      techTags: "기술 태그",
      interviewQuestions: "면접 질문",
      difficulty: "난이도",
      createdAt: "작성일",

      createButton: "업무일지 작성",
      updateButton: "업무일지 수정",
      analyzing: "AI 분석 중...",

      empty: "등록된 업무일지가 없습니다.",
      noWorkLogs: "등록된 업무일지가 없습니다.",

      loadError:
        "업무일지를 불러오지 못했습니다.",
      saveError:
        "업무일지를 저장하지 못했습니다.",
      deleteConfirm:
        "이 업무일지를 삭제하시겠습니까?",
      deleteError:
        "업무일지를 삭제하지 못했습니다.",

      titleRequired: "제목을 입력해 주세요.",
      contentRequired:
        "업무 내용을 입력해 주세요.",

      saveSuccess:
        "업무일지가 저장되었습니다.",
      updateSuccess:
        "업무일지가 수정되었습니다.",
      deleteSuccess:
        "업무일지가 삭제되었습니다.",
    },

    dashboard: {
      eyebrow: "AI WORK ANALYTICS",
      title: "업무 대시보드",
      description:
        "기록한 업무일지를 바탕으로 업무량과 기술 경험을 확인합니다.",

      totalWorkLogs: "전체 업무일지",
      totalDescription: "누적 작성 수",

      recentSevenDays: "최근 7일",
      recentDescription: "최근 작성 수",

      mostUsedTechnology:
        "가장 많이 사용한 기술",
      noTagData: "태그 데이터 없음",
      usageCount: "회 사용",

      advancedWork: "고급 업무",
      advancedDescription: "고난도 업무 수",

      recentChartTitle: "최근 7일 업무량",
      recentChartDescription:
        "날짜별로 작성한 업무일지 수입니다.",
      workCount: "업무 수",

      difficultyTitle: "난이도 분포",
      difficultyDescription:
        "AI가 판단한 업무 난이도입니다.",

      topTagsTitle: "TOP 기술 태그",
      topTagsDescription:
        "업무일지에서 가장 자주 등장한 기술입니다.",

      recentWorkTitle: "최근 업무",
      recentWorkDescription:
        "가장 최근에 작성한 업무일지입니다.",

      loadError:
        "대시보드 정보를 불러오지 못했습니다.",
    },

    report: {
      eyebrow: "AI PROJECT REPORT",
      title: "AI 프로젝트 보고서",
      description:
        "업무일지 전체를 분석해 구현 기능, 성과, 난이도와 개선 방향을 정리합니다.",

      startTitle:
        "업무 기록을 프로젝트 보고서로 변환하세요.",
      startDescription:
        "Spring Boot가 계산한 통계와 업무 데이터를 바탕으로 AI가 포트폴리오용 보고서를 작성합니다.",

      startItemStatistics: "업무 통계",
      startItemFeatures: "구현 기능",
      startItemAchievements: "프로젝트 성과",
      startItemImprovements: "향후 개선점",

      generateButton: "AI 보고서 생성",
      regenerateButton: "다시 생성",
      generating: "생성 중...",

      generatingTitle:
        "AI가 보고서를 작성하고 있습니다.",
      generatingDescription:
        "업무일지 수에 따라 처리 시간이 달라질 수 있습니다.",

      downloadButton: "PDF 다운로드",
      downloading: "다운로드 중...",

      generateError:
        "AI 프로젝트 보고서를 생성하지 못했습니다.",
      downloadError:
        "PDF 파일을 다운로드하지 못했습니다.",

      previewTitle: "보고서 미리보기",
      previewDescription:
        "내용을 확인한 후 PDF 파일로 저장할 수 있습니다.",

      totalWorkLogs: "분석 업무일지",
      totalWorkLogsDescription:
        "보고서 분석에 사용된 기록 수",

      workPeriod: "업무 기록 기간",
      workPeriodDescription:
        "첫 기록부터 최근 기록까지",
      noPeriod: "기간 정보 없음",

      averageDifficulty: "평균 난이도",
      averageDifficultyDescription:
        "업무 난이도를 수치로 환산한 평균",

      technologyCount: "사용 기술",
      technologyCountDescription:
        "확인된 기술 태그 종류",

      workSummary: "전체 업무 요약",
      workSummaryDescription:
        "분석 기간 동안 진행한 주요 업무입니다.",

      statistics: "업무 통계",
      statisticsDescription:
        "난이도와 기술 사용 현황입니다.",
      difficultyCounts: "난이도 분포",
      technologyTags: "기술 태그",

      implementedFeatures: "구현 기능",
      implementedFeaturesDescription:
        "업무일지를 기반으로 분류한 주요 구현 내용입니다.",
      uncategorizedFeature: "기타 기능",

      difficultyAnalysis: "난이도 분석",
      difficultyAnalysisDescription:
        "업무 난이도와 복잡도에 대한 AI 분석입니다.",

      projectAchievements: "프로젝트 성과",
      projectAchievementsDescription:
        "구현을 통해 달성한 기술적 성과입니다.",

      futureImprovements: "향후 개선 방향",
      futureImprovementsDescription:
        "프로젝트 완성도를 높이기 위한 다음 단계입니다.",
    },

    difficulty: {
      beginner: "초급",
      intermediate: "중급",
      advanced: "고급",
      unclassified: "미분류",
    },
  },

  ja: {
    common: {
      korean: "한국어",
      japanese: "日本語",
      save: "保存",
      edit: "編集",
      delete: "削除",
      cancel: "キャンセル",
      close: "閉じる",
      refresh: "更新",
      retry: "再試行",
      loading: "読み込み中です。",
      noData: "データがありません。",
    },

    navigation: {
      workLog: "業務日誌",
      dashboard: "ダッシュボード",
      aiReport: "AIプロジェクトレポート",
      logout: "ログアウト",
    },

    auth: {
      loginTitle: "ログイン",
      signupTitle: "会員登録",

      loginIdPlaceholder: "ID",
      passwordPlaceholder: "パスワード",
      passwordConfirmPlaceholder:
        "パスワード確認",
      nicknamePlaceholder: "ニックネーム",

      loginButton: "ログイン",
      signupButton: "会員登録",
      goLogin: "ログイン画面に戻る",

      loggingIn: "ログイン中...",
      signingUp: "登録中...",

      loginIdRequired:
        "IDを入力してください。",
      passwordRequired:
        "パスワードを入力してください。",
      passwordConfirmRequired:
        "確認用パスワードを入力してください。",
      passwordNotMatch:
        "パスワードが一致しません。",
      nicknameRequired:
        "ニックネームを入力してください。",

      loginError:
        "IDまたはパスワードが正しくありません。",
      signupError:
        "会員登録に失敗しました。",
      signupSuccess:
        "会員登録が完了しました。",
    },

    workLog: {
      eyebrow: "AI業務記録",
      title: "業務日誌",
      description:
        "本日行った業務を記録し、AIの分析結果を確認できます。",

      newEntryLabel: "新規業務記録",
      editEntryLabel: "業務記録修正",
      historyLabel: "業務履歴",

      createTitle: "業務日誌作成",
      editTitle: "業務日誌修正",

      titleLabel: "タイトル",
      contentLabel: "業務内容",

      titlePlaceholder:
        "業務日誌のタイトルを入力してください。",
      contentPlaceholder:
        "本日行った業務内容を入力してください。",

      aiSummary: "AI要約",
      techTags: "技術タグ",
      interviewQuestions: "面接質問",
      difficulty: "難易度",
      createdAt: "作成日",

      createButton: "業務日誌を作成",
      updateButton: "業務日誌を修正",
      analyzing: "AI分析中...",

      empty:
        "登録された業務日誌がありません。",
      noWorkLogs:
        "登録された業務日誌がありません。",

      loadError:
        "業務日誌を読み込めませんでした。",
      saveError:
        "業務日誌を保存できませんでした。",
      deleteConfirm:
        "この業務日誌を削除しますか？",
      deleteError:
        "業務日誌を削除できませんでした。",

      titleRequired:
        "タイトルを入力してください。",
      contentRequired:
        "業務内容を入力してください。",

      saveSuccess:
        "業務日誌を保存しました。",
      updateSuccess:
        "業務日誌を修正しました。",
      deleteSuccess:
        "業務日誌を削除しました。",
    },

    dashboard: {
      eyebrow: "AI WORK ANALYTICS",
      title: "業務ダッシュボード",
      description:
        "記録した業務日誌をもとに、業務量と技術経験を確認できます。",

      totalWorkLogs: "業務日誌の総数",
      totalDescription: "累計登録数",

      recentSevenDays: "直近7日間",
      recentDescription: "最近の登録数",

      mostUsedTechnology:
        "最も使用した技術",
      noTagData: "タグデータなし",
      usageCount: "回使用",

      advancedWork: "上級業務",
      advancedDescription: "高難度業務数",

      recentChartTitle:
        "直近7日間の業務量",
      recentChartDescription:
        "日別の業務日誌登録数です。",
      workCount: "業務数",

      difficultyTitle: "難易度の分布",
      difficultyDescription:
        "AIが判定した業務の難易度です。",

      topTagsTitle: "技術タグ TOP",
      topTagsDescription:
        "業務日誌で頻繁に使用された技術です。",

      recentWorkTitle: "最近の業務",
      recentWorkDescription:
        "最近登録した業務日誌です。",

      loadError:
        "ダッシュボードを読み込めませんでした。",
    },

    report: {
      eyebrow: "AI PROJECT REPORT",
      title: "AIプロジェクトレポート",
      description:
        "業務日誌全体を分析し、実装機能、成果、難易度、改善方向をまとめます。",

      startTitle:
        "業務記録をプロジェクトレポートに変換します。",
      startDescription:
        "Spring Bootが計算した統計と業務データをもとに、AIがポートフォリオ用レポートを作成します。",

      startItemStatistics: "業務統計",
      startItemFeatures: "実装機能",
      startItemAchievements:
        "プロジェクト成果",
      startItemImprovements: "今後の改善点",

      generateButton: "AIレポート作成",
      regenerateButton: "再作成",
      generating: "作成中...",

      generatingTitle:
        "AIがレポートを作成しています。",
      generatingDescription:
        "業務日誌の件数によって処理時間が異なる場合があります。",

      downloadButton: "PDFダウンロード",
      downloading: "ダウンロード中...",

      generateError:
        "AIプロジェクトレポートを作成できませんでした。",
      downloadError:
        "PDFファイルをダウンロードできませんでした。",

      previewTitle: "レポートプレビュー",
      previewDescription:
        "内容を確認した後、PDFファイルとして保存できます。",

      totalWorkLogs: "分析した業務日誌",
      totalWorkLogsDescription:
        "レポート分析に使用した記録数",

      workPeriod: "業務記録期間",
      workPeriodDescription:
        "最初の記録から最新の記録まで",
      noPeriod: "期間情報なし",

      averageDifficulty: "平均難易度",
      averageDifficultyDescription:
        "業務難易度を数値化した平均",

      technologyCount: "使用技術",
      technologyCountDescription:
        "確認された技術タグの種類",

      workSummary: "業務全体の要約",
      workSummaryDescription:
        "分析期間中に行った主な業務です。",

      statistics: "業務統計",
      statisticsDescription:
        "難易度と技術使用状況です。",
      difficultyCounts: "難易度分布",
      technologyTags: "技術タグ",

      implementedFeatures: "実装機能",
      implementedFeaturesDescription:
        "業務日誌をもとに分類した主な実装内容です。",
      uncategorizedFeature: "その他の機能",

      difficultyAnalysis: "難易度分析",
      difficultyAnalysisDescription:
        "業務の難易度と複雑度に関するAI分析です。",

      projectAchievements:
        "プロジェクト成果",
      projectAchievementsDescription:
        "実装によって達成した技術的成果です。",

      futureImprovements: "今後の改善方向",
      futureImprovementsDescription:
        "プロジェクトの完成度を高めるための次のステップです。",
    },

    difficulty: {
      beginner: "初級",
      intermediate: "中級",
      advanced: "上級",
      unclassified: "未分類",
    },
  },
};

export default translations;