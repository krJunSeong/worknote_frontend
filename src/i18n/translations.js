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
      language: "언어 선택",
    },

    navigation: {
      workLog: "업무일지",
      dashboard: "대시보드",
      aiReport: "AI 프로젝트 보고서",
      logout: "로그아웃",
      user: "사용자",
      member: "WorkNote 멤버",
      collapseSidebar: "사이드바 접기",
      expandSidebar: "사이드바 펼치기",
      workLogGroup: "업무일지",
      workLogList: "업무일지 기록",
      workLogCreate: "업무일지 작성",
      planningGroup: "계획 관리",
      calendar: "캘린더",
      goals: "계획 목표",
      workspace: "WORKSPACE",
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
      loginLoadingStatus: "서버 시작을 기다리는 중",
      loginLoadingCompleteStatus: "서버 응답 확인 완료",
      loginLoadingOverEstimateStatus: "예상 시간을 넘어 연결 대기 중",
      loginLoadingProgressLabel: "WorkNote 서버 연결 예상 진행률",
      loginLoadingProgressEstimate: "예상 진행률",
      loginLoadingEstimatedTimeLabel: "평균 예상 시간",
      loginLoadingRemainingTimeLabel: "예상 남은 시간",
      loginLoadingElapsedTimeLabel: "현재 경과 시간",
      loginLoadingTitle: "서버를 준비하고 있습니다",
      loginLoadingDescriptionPrefix:
        "서버가 대기 상태라면 다시 준비되는 데 평균 약 ",
      loginLoadingDescriptionSuffix:
        "를 예상하고 있습니다. 실제 서버 응답이 더 빠르게 도착하면 진행률을 즉시 100%로 완료하고 로그인합니다.",
      loginLoadingGuide:
        "표시되는 진행률은 서버가 보내는 실제 부팅률이 아니라 예상 대기 시간을 기준으로 한 안내입니다.",
      loginLoadingOverEstimateTitle: "예상 시간보다 조금 더 걸리고 있습니다",
      loginLoadingOverEstimateDescriptionPrefix:
        "서버 응답을 계속 기다리고 있습니다. 최대 ",
      loginLoadingOverEstimateDescriptionSuffix:
        "까지 기다린 뒤에도 응답이 없으면 서버 연결 실패로 안내합니다.",
      loginLoadingOverEstimateGuide:
        "예상 시간을 넘긴 뒤에는 99%를 넘기지 않고 실제 서버 응답을 기다립니다.",
      loginLoadingCompleteTitle: "서버 연결이 완료되었습니다",
      loginLoadingCompleteDescription:
        "로그인 응답을 확인했습니다. 잠시 후 WorkNote로 이동합니다.",
      loginLoadingCompleteGuide:
        "실제 응답이 확인되어 진행률을 100%로 완료했습니다.",
      loginServerTimeoutError:
        "10분 동안 서버의 응답이 없어 로그인을 중단했습니다. 현재 서버에 문제가 있거나 일시적으로 사용할 수 없는 상태일 수 있습니다. 잠시 후 다시 시도해 주세요.",
      loginServerConnectionError:
        "서버에 연결할 수 없습니다. 네트워크 또는 서버 상태를 확인한 뒤 다시 시도해 주세요.",
      signingUp: "회원가입 중...",

      loginIdRequired: "아이디를 입력해 주세요.",
      loginIdLengthGuide: "아이디는 4자 이상 20자 이하로 입력해 주세요.",
      loginIdLengthError: "아이디는 4~20자로 입력해 주세요.",
      passwordRequired: "비밀번호를 입력해 주세요.",
      passwordConfirmRequired:
        "비밀번호 확인을 입력해 주세요.",
      passwordNotMatch: "비밀번호가 일치하지 않습니다.",
      nicknameRequired: "닉네임을 입력해 주세요.",
      nicknameLengthGuide: "닉네임은 2자 이상 12자 이하로 입력해 주세요.",
      nicknameLengthError: "닉네임은 2~12자로 입력해 주세요.",

      loginError:
        "아이디 또는 비밀번호가 올바르지 않습니다.",
      signupError: "회원가입에 실패했습니다.",
      signupSuccess: "회원가입이 완료되었습니다.",

      heroTitle: "매일의 개발 기록을, 면접에서 설명할 수 있는 성과로.",
      heroDescription: "업무일지를 기록하면 AI가 핵심 요약, 기술 태그, 예상 면접 질문을 정리합니다.",
      featureRecordTitle: "업무 기록 관리",
      featureRecordDescription: "하루의 작업과 해결 과정을 구조적으로 축적합니다.",
      featureAiTitle: "AI 분석",
      featureAiDescription: "기록에서 핵심 성과와 기술 경험을 자동으로 추출합니다.",
      featureReportTitle: "포트폴리오 보고서",
      featureReportDescription: "누적 기록을 프로젝트 보고서와 PDF로 정리합니다.",
      welcomeBack: "다시 만나서 반갑습니다",
      createAccount: "새 계정 만들기",
      loginDescription: "WorkNote 계정으로 계속 진행하세요.",
      signupDescription: "기록을 시작하기 위한 기본 정보를 입력하세요.",
      loginIdLabel: "아이디",
      passwordLabel: "비밀번호",
      passwordConfirmLabel: "비밀번호 확인",
      nicknameLabel: "닉네임",
      noAccount: "아직 계정이 없나요?",
      hasAccount: "이미 계정이 있나요?",
      signupHeroDescription:
        "하루의 업무를 꾸준히 기록하고 AI 분석으로 기술 경험과 성과를 체계화하세요.",
      passwordLengthGuide: "비밀번호는 5자 이상 12자 이하로 입력해 주세요.",
      passwordLengthError: "비밀번호 양식이 맞지 않습니다. 5~12자로 입력해 주세요.",
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
      totalEntries: "전체 기록",
      recordsSectionTitle: "전체 업무 기록",
      recordsSectionDescription:
        "누적된 업무일지와 AI 분석 결과를 검색하고 난이도별로 확인할 수 있습니다.",
      searchPlaceholder: "제목, 업무 내용, 기술 태그 검색",
      difficultyFilter: "난이도 필터",
      filterAll: "전체",
      sortLabel: "정렬",
      sortNewest: "최신순",
      sortOldest: "오래된순",
      filterReset: "필터 초기화",
      visibleEntries: "표시 중",
      noSearchResultsTitle: "조건에 맞는 기록이 없습니다.",
      noSearchResultsDescription:
        "검색어나 난이도 필터를 변경한 뒤 다시 확인해 주세요.",
      listTitle: "업무일지 기록",
      listDescription:
        "작성한 업무일지와 AI 분석 결과를 한 화면에서 확인하고 수정할 수 있습니다.",
      emptyTitle: "아직 업무 기록이 없습니다.",
      emptyDescription:
        "첫 업무일지를 작성하면 AI 요약, 기술 태그, 예상 면접 질문이 이곳에 표시됩니다.",
      editorDescription:
        "진행한 업무와 해결 과정을 구체적으로 작성하면 AI 분석 품질이 더 좋아집니다.",
      completion: "작성 완성도",
      completionDescription:
        "제목과 구체적인 업무 내용을 입력하면 완성도가 올라갑니다.",
      writeSectionTitle: "오늘의 업무를 기록해 주세요.",
      editorContentPlaceholder:
        "무엇을 했는지, 왜 했는지, 어떤 방법으로 해결했는지, 결과가 어땠는지 구체적으로 작성해 주세요.",
      promptWhat: "무엇을 했나요?",
      promptWhy: "왜 진행했나요?",
      promptHow: "어떻게 해결했나요?",
      promptResult: "결과는 어땠나요?",
      flowTitle: "작성부터 AI 분석까지",
      flowWriteTitle: "업무 내용 작성",
      flowWriteDescription: "제목과 작업 내용을 구체적으로 입력합니다.",
      flowAnalyzeTitle: "AI 분석",
      flowAnalyzeDescription: "요약, 기술 태그, 난이도와 면접 질문을 생성합니다.",
      flowSaveTitle: "기록 저장",
      flowSaveDescription: "분석 결과와 업무 기록을 함께 저장합니다.",
      tipTitle: "작성 팁",
      tipDescription:
        "문제 상황, 선택한 해결 방법, 적용한 기술, 결과를 함께 적으면 포트폴리오에 활용하기 좋은 분석이 생성됩니다.",
      previewTitle: "생성될 AI 분석",
      entryNotFound: "수정할 업무일지를 찾을 수 없습니다.",
      detailEyebrow: "WORK LOG DETAIL",
      detailTitle: "업무일지 상세",
      detailDescription: "기록한 업무 내용과 AI 분석 결과를 확인합니다.",
      backToList: "목록으로",
      editThisEntry: "이 기록 수정",
    },

    memoImage: {
      kicker: "MEMO IMPORT",
      title: "메모 사진에서 업무일지 초안 만들기",
      description:
        "노트나 종이에 적어둔 메모 사진을 OCR로 읽고 AI가 업무일지 제목과 내용을 초안으로 정리합니다.",
      selectImage: "메모 이미지 선택",
      fileGuide: "JPG 또는 PNG · 업로드 전 자동 압축",
      previewAlt: "선택한 메모 이미지 미리보기",
      changeImage: "다른 이미지 선택",
      analyzeButton: "메모 분석하기",
      analyzing: "OCR 및 AI 분석 중...",
      processingNote:
        "OCR로 글자를 읽은 뒤 AI가 업무일지 형태로 정리합니다. 잠시 시간이 걸릴 수 있습니다.",
      resultKicker: "DRAFT READY",
      resultTitle: "업무일지 초안",
      retry: "다시 분석",
      showRawText: "OCR 원문 보기",
      reviewNotice:
        "OCR과 AI 결과에는 오류가 있을 수 있으므로 적용 후 내용을 확인하고 수정해 주세요.",
      append: "기존 내용 뒤에 추가",
      replace: "초안으로 교체",
      apply: "업무일지에 적용",
      providerNotice:
        "선택한 이미지는 OCR 서비스로, 인식된 텍스트는 업무일지 초안 생성을 위해 AI 서비스로 전송됩니다. 원본 이미지와 OCR 원문은 WorkNote DB에 저장되지 않습니다.",
      unsupportedFile: "JPG/JPEG/PNG 이미지만 사용할 수 있습니다.",
      fileTooLarge:
        "이미지 용량이 너무 큽니다. 더 작은 이미지로 다시 시도해 주세요.",
      imageReadError: "이미지를 읽거나 압축하지 못했습니다.",
      invalidImage:
        "이미지에서 텍스트를 인식하지 못했거나 파일을 처리할 수 없습니다. 더 선명한 JPG/PNG 이미지로 다시 시도해 주세요.",
      serviceUnavailable:
        "현재 OCR 기능을 사용할 수 없습니다. 서버의 OCR 설정을 확인해 주세요.",
      analysisError: "메모 이미지를 분석하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    },

    calendar: {
      eyebrow: "WORK CALENDAR",
      title: "업무 캘린더",
      description: "날짜별 업무 기록과 목표 마감일을 한눈에 확인합니다.",
      previousMonth: "이전 달",
      nextMonth: "다음 달",
      today: "오늘",
      workLog: "업무",
      goal: "목표",
      more: "개 더보기",
      monthlyRecords: "이번 달 업무 기록",
      monthlyRecordsDescription: "날짜와 제목을 선택하면 해당 업무일지로 이동합니다.",
      selectedDate: "선택한 날짜",
      selectedEmpty: "이 날짜에는 등록된 업무나 목표가 없습니다.",
      noRecords: "이번 달에 등록된 업무 기록이 없습니다.",
      loadError: "캘린더 정보를 불러오지 못했습니다.",
      weekdays: ["일", "월", "화", "수", "목", "금", "토"],
    },

    goal: {
      eyebrow: "GOAL PLANNER",
      title: "계획 목표",
      description: "마감일과 진행률을 정해 목표를 관리하고 캘린더와 연결합니다.",
      createTitle: "새 목표 만들기",
      editTitle: "목표 수정",
      titleLabel: "목표 제목",
      titlePlaceholder: "예: 9월까지 Spring Security 복습 완료",
      descriptionLabel: "계획 내용",
      descriptionPlaceholder: "어떤 방식으로 진행할지 간단히 적어 주세요.",
      targetDateLabel: "마감일",
      statusLabel: "상태",
      progressLabel: "진행률",
      planned: "예정",
      inProgress: "진행 중",
      completed: "완료",
      overdue: "지연",
      save: "목표 저장",
      update: "수정 저장",
      cancelEdit: "수정 취소",
      delete: "삭제",
      edit: "수정",
      deleteConfirm: "이 목표를 삭제하시겠습니까?",
      loadError: "목표를 불러오지 못했습니다.",
      saveError: "목표를 저장하지 못했습니다.",
      deleteError: "목표를 삭제하지 못했습니다.",
      titleRequired: "목표 제목을 입력해 주세요.",
      targetDateRequired: "마감일을 선택해 주세요.",
      empty: "등록된 목표가 없습니다. 첫 목표를 만들어 보세요.",
      total: "전체 목표",
      active: "진행 중",
      completedCount: "완료",
      overdueCount: "기한 초과",
      all: "전체",
      calendarHint: "목표의 마감일은 캘린더에도 함께 표시됩니다.",
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
      language: "言語選択",
    },

    navigation: {
      workLog: "業務日誌",
      dashboard: "ダッシュボード",
      aiReport: "AIプロジェクトレポート",
      logout: "ログアウト",
      user: "ユーザー",
      member: "WorkNote メンバー",
      collapseSidebar: "サイドバーを閉じる",
      expandSidebar: "サイドバーを開く",
      workLogGroup: "業務日誌",
      workLogList: "業務日誌の記録",
      workLogCreate: "業務日誌を作成",
      planningGroup: "計画管理",
      calendar: "カレンダー",
      goals: "計画目標",
      workspace: "WORKSPACE",
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
      loginLoadingStatus: "サーバーの起動を待っています",
      loginLoadingCompleteStatus: "サーバー応答を確認しました",
      loginLoadingOverEstimateStatus: "目安時間を超えて応答待機中",
      loginLoadingProgressLabel: "WorkNoteサーバー接続の推定進行率",
      loginLoadingProgressEstimate: "推定進行率",
      loginLoadingEstimatedTimeLabel: "平均目安時間",
      loginLoadingRemainingTimeLabel: "推定残り時間",
      loginLoadingElapsedTimeLabel: "現在の経過時間",
      loginLoadingTitle: "サーバーを準備しています",
      loginLoadingDescriptionPrefix:
        "サーバーが休止状態の場合、再び利用可能になるまでの目安は約 ",
      loginLoadingDescriptionSuffix:
        "です。実際のサーバー応答が早く届いた場合は、進行率をすぐに100%にしてログインを続行します。",
      loginLoadingGuide:
        "表示している進行率はサーバーが返す実際の起動率ではなく、推定待ち時間を基準にした目安です。",
      loginLoadingOverEstimateTitle: "目安時間より少し長くかかっています",
      loginLoadingOverEstimateDescriptionPrefix:
        "サーバーからの応答を引き続き待っています。最大 ",
      loginLoadingOverEstimateDescriptionSuffix:
        "まで待っても応答がない場合は、サーバー接続失敗としてご案内します。",
      loginLoadingOverEstimateGuide:
        "目安時間を超えた後は99%を上限にし、実際のサーバー応答を待ちます。",
      loginLoadingCompleteTitle: "サーバー接続が完了しました",
      loginLoadingCompleteDescription:
        "ログイン応答を確認しました。まもなくWorkNoteへ移動します。",
      loginLoadingCompleteGuide:
        "実際の応答を確認したため、進行率を100%にしました。",
      loginServerTimeoutError:
        "10分間サーバーから応答がなかったため、ログインを中断しました。現在サーバーに問題があるか、一時的に利用できない可能性があります。しばらくしてからもう一度お試しください。",
      loginServerConnectionError:
        "サーバーに接続できません。ネットワークまたはサーバーの状態を確認してから、もう一度お試しください。",
      signingUp: "登録中...",

      loginIdRequired:
        "IDを入力してください。",
      loginIdLengthGuide:
        "IDは4文字以上20文字以下で入力してください。",
      loginIdLengthError:
        "IDは4〜20文字で入力してください。",
      passwordRequired:
        "パスワードを入力してください。",
      passwordConfirmRequired:
        "確認用パスワードを入力してください。",
      passwordNotMatch:
        "パスワードが一致しません。",
      nicknameRequired:
        "ニックネームを入力してください。",
      nicknameLengthGuide:
        "ニックネームは2文字以上12文字以下で入力してください。",
      nicknameLengthError:
        "ニックネームは2〜12文字で入力してください。",

      loginError:
        "IDまたはパスワードが正しくありません。",
      signupError:
        "会員登録に失敗しました。",
      signupSuccess:
        "会員登録が完了しました。",

      heroTitle: "毎日の開発記録を、面接で伝わる実績へ。",
      heroDescription: "業務日誌を記録すると、AIが要約、技術タグ、想定面接質問を整理します。",
      featureRecordTitle: "業務記録の管理",
      featureRecordDescription: "日々の作業と問題解決の過程を体系的に蓄積します。",
      featureAiTitle: "AI分析",
      featureAiDescription: "記録から主要な成果と技術経験を自動で抽出します。",
      featureReportTitle: "ポートフォリオレポート",
      featureReportDescription: "蓄積した記録をプロジェクトレポートとPDFにまとめます。",
      welcomeBack: "おかえりなさい",
      createAccount: "アカウント作成",
      loginDescription: "WorkNoteアカウントで続行してください。",
      signupDescription: "記録を始めるための基本情報を入力してください。",
      loginIdLabel: "ID",
      passwordLabel: "パスワード",
      passwordConfirmLabel: "パスワード確認",
      nicknameLabel: "ニックネーム",
      noAccount: "アカウントをお持ちでない方",
      hasAccount: "すでにアカウントをお持ちの方",
      signupHeroDescription:
        "日々の業務を記録し、AI分析で技術経験と成果を体系的に整理しましょう。",
      passwordLengthGuide: "パスワードは5文字以上12文字以下で入力してください。",
      passwordLengthError:
        "パスワード形式が正しくありません。5〜12文字で入力してください。",
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
      totalEntries: "全記録",
      recordsSectionTitle: "すべての業務記録",
      recordsSectionDescription:
        "蓄積した業務日誌とAI分析結果を検索し、難易度別に確認できます。",
      searchPlaceholder: "タイトル、業務内容、技術タグを検索",
      difficultyFilter: "難易度フィルター",
      filterAll: "すべて",
      sortLabel: "並び順",
      sortNewest: "新しい順",
      sortOldest: "古い順",
      filterReset: "フィルターをリセット",
      visibleEntries: "表示中",
      noSearchResultsTitle: "条件に一致する記録がありません。",
      noSearchResultsDescription:
        "検索語または難易度フィルターを変更してください。",
      listTitle: "業務日誌の記録",
      listDescription:
        "作成した業務日誌とAI分析結果を一つの画面で確認・編集できます。",
      emptyTitle: "まだ業務記録がありません。",
      emptyDescription:
        "最初の業務日誌を作成すると、AI要約、技術タグ、想定面接質問がここに表示されます。",
      editorDescription:
        "実施した業務と解決過程を具体的に書くほど、AI分析の品質が高まります。",
      completion: "入力完成度",
      completionDescription:
        "タイトルと具体的な業務内容を入力すると完成度が上がります。",
      writeSectionTitle: "今日の業務を記録してください。",
      editorContentPlaceholder:
        "何をしたか、なぜ行ったか、どのように解決したか、結果はどうだったかを具体的に入力してください。",
      promptWhat: "何をしましたか？",
      promptWhy: "なぜ行いましたか？",
      promptHow: "どう解決しましたか？",
      promptResult: "結果はどうでしたか？",
      flowTitle: "入力からAI分析まで",
      flowWriteTitle: "業務内容を入力",
      flowWriteDescription: "タイトルと作業内容を具体的に入力します。",
      flowAnalyzeTitle: "AI分析",
      flowAnalyzeDescription: "要約、技術タグ、難易度、面接質問を生成します。",
      flowSaveTitle: "記録を保存",
      flowSaveDescription: "分析結果と業務記録を一緒に保存します。",
      tipTitle: "入力のヒント",
      tipDescription:
        "課題、選んだ解決方法、使用技術、結果を一緒に書くと、ポートフォリオに活用しやすい分析が生成されます。",
      previewTitle: "生成されるAI分析",
      entryNotFound: "編集する業務日誌が見つかりません。",
      detailEyebrow: "WORK LOG DETAIL",
      detailTitle: "業務日誌詳細",
      detailDescription: "記録した業務内容とAI分析結果を確認します。",
      backToList: "一覧へ",
      editThisEntry: "この記録を編集",
    },

    memoImage: {
      kicker: "MEMO IMPORT",
      title: "メモ画像から業務日誌の下書きを作成",
      description:
        "ノートや紙に書いたメモ画像をOCRで読み取り、AIが業務日誌のタイトルと内容を下書きとして整理します。",
      selectImage: "メモ画像を選択",
      fileGuide: "JPG または PNG · アップロード前に自動圧縮",
      previewAlt: "選択したメモ画像のプレビュー",
      changeImage: "別の画像を選択",
      analyzeButton: "メモを解析",
      analyzing: "OCR・AI解析中...",
      processingNote:
        "OCRで文字を読み取った後、AIが業務日誌形式に整理します。少し時間がかかる場合があります。",
      resultKicker: "DRAFT READY",
      resultTitle: "業務日誌の下書き",
      retry: "再解析",
      showRawText: "OCR原文を表示",
      reviewNotice:
        "OCR・AIの結果には誤りが含まれる可能性があるため、反映後に内容を確認・修正してください。",
      append: "既存内容の後ろに追加",
      replace: "下書きに置き換え",
      apply: "業務日誌に反映",
      providerNotice:
        "選択した画像はOCRサービスへ、認識したテキストは業務日誌の下書き生成のためAIサービスへ送信されます。元画像とOCR原文はWorkNote DBに保存しません。",
      unsupportedFile: "JPG/JPEG/PNG画像のみ使用できます。",
      fileTooLarge:
        "画像サイズが大きすぎます。より小さい画像で再試行してください。",
      imageReadError: "画像を読み込みまたは圧縮できませんでした。",
      invalidImage:
        "画像から文字を認識できないか、ファイルを処理できません。より鮮明なJPG/PNG画像で再試行してください。",
      serviceUnavailable:
        "現在OCR機能を利用できません。サーバーのOCR設定を確認してください。",
      analysisError: "メモ画像を解析できませんでした。しばらくしてから再試行してください。",
    },

    calendar: {
      eyebrow: "WORK CALENDAR",
      title: "業務カレンダー",
      description: "日付ごとの業務記録と目標の期限を一目で確認できます。",
      previousMonth: "前の月",
      nextMonth: "次の月",
      today: "今日",
      workLog: "業務",
      goal: "目標",
      more: "件をさらに表示",
      monthlyRecords: "今月の業務記録",
      monthlyRecordsDescription: "日付とタイトルを選択すると該当する業務日誌へ移動します。",
      selectedDate: "選択した日",
      selectedEmpty: "この日には業務記録や目標がありません。",
      noRecords: "今月の業務記録はありません。",
      loadError: "カレンダー情報を読み込めませんでした。",
      weekdays: ["日", "月", "火", "水", "木", "金", "土"],
    },

    goal: {
      eyebrow: "GOAL PLANNER",
      title: "計画目標",
      description: "期限と進捗率を設定し、目標をカレンダーと連携して管理します。",
      createTitle: "新しい目標を作成",
      editTitle: "目標を編集",
      titleLabel: "目標タイトル",
      titlePlaceholder: "例：9月までにSpring Securityの復習を完了",
      descriptionLabel: "計画内容",
      descriptionPlaceholder: "どのように進めるか簡単に記入してください。",
      targetDateLabel: "期限",
      statusLabel: "状態",
      progressLabel: "進捗率",
      planned: "予定",
      inProgress: "進行中",
      completed: "完了",
      overdue: "遅延",
      save: "目標を保存",
      update: "変更を保存",
      cancelEdit: "編集をキャンセル",
      delete: "削除",
      edit: "編集",
      deleteConfirm: "この目標を削除しますか？",
      loadError: "目標を読み込めませんでした。",
      saveError: "目標を保存できませんでした。",
      deleteError: "目標を削除できませんでした。",
      titleRequired: "目標タイトルを入力してください。",
      targetDateRequired: "期限を選択してください。",
      empty: "登録された目標はありません。最初の目標を作成してみましょう。",
      total: "目標合計",
      active: "進行中",
      completedCount: "完了",
      overdueCount: "期限超過",
      all: "すべて",
      calendarHint: "目標の期限はカレンダーにも表示されます。",
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