/* ================================================================
   BCMSOnboarding — 3-step onboarding popup
   Step 1: Industry selection
   Step 2: Certification goal
   Step 3: BCMS roadmap
   ================================================================ */
(() => {
  'use strict';

  const DONE_KEY     = 'bcmsOnboardingDone';
  const INDUSTRY_KEY = 'bcmsIndustry';
  const GOAL_KEY     = 'bcmsGoal';
  const BIA_KEY      = 'bcmsBIAData';
  const RISK_KEY     = 'bcmsRiskList';

  const INDUSTRIES = [
    { key: '제조업',   icon: '🏭', desc: '생산·품질·물류 중심 업무연속성 관리' },
    { key: '금융',     icon: '🏦', desc: '전산시스템·결제망 중심 업무연속성 관리' },
    { key: '공공기관', icon: '🏛️', desc: '행정전산·민원서비스 중심 업무연속성 관리' },
    { key: '고속도로', icon: '🛣️', desc: '교통관제·요금수납·방재 중심 업무연속성 관리' },
    { key: '통신',     icon: '📡', desc: '네트워크·교환시스템 중심 업무연속성 관리' },
    { key: 'IDC',      icon: '🖥️', desc: '전력·항온항습·서버 중심 업무연속성 관리' },
  ];

  const GOALS = [
    { key: 'iso22301', icon: '🛡️', label: 'ISO 22301 단독 취득',             desc: 'ISO 22301 국제인증 취득을 목표로 합니다' },
    { key: 'drrb',     icon: '🏆', label: '재해경감우수기업 단독 인증',         desc: '국내 재해경감우수기업 인증을 목표로 합니다' },
    { key: 'both',     icon: '🎯', label: 'ISO 22301 + 재해경감우수기업 동시', desc: '두 인증을 동시에 취득합니다' },
  ];

  const ROADMAP = [
    {
      num: 1, key: 'governance', title: '거버넌스 수립', period: '1~2주',
      tasks: ['BCMS 정책 수립', '조직 및 역할 정의', '법규요구사항 검토'],
      iso: '4, 5, 6조', path: '/governance/policy.html',
    },
    {
      num: 2, key: 'bia', title: '업무영향분석 BIA', period: '2~3주',
      tasks: ['핵심업무 식별 및 영향 분석', '복구목표(RTO/MTPD) 설정'],
      iso: '8.2조', path: '/risk-bia/bia.html',
    },
    {
      num: 3, key: 'risk', title: '리스크 평가', period: '1~2주',
      tasks: ['업무 중단 위협 식별', '리스크 매트릭스 작성'],
      iso: '8.2조', path: '/risk-bia/risk.html',
    },
    {
      num: 4, key: 'bcp', title: 'BCP 전략 수립', period: '2~4주',
      tasks: ['핵심업무 우선순위 확정', '연속성 전략 수립'],
      iso: '8.3조', path: '/strategy-plans/bcp.html',
    },
    {
      num: 5, key: 'training', title: '훈련 및 점검', period: '진행 중 수시',
      tasks: ['훈련 계획 수립 및 실시', '훈련 결과 기록'],
      iso: '8.5조', path: '/training/index.html',
    },
    {
      num: 6, key: 'audit', title: '성과평가 및 개선', period: '분기별',
      tasks: ['ISO 22301 갭분석', '내부심사 실시', 'CAPA 등록 및 관리'],
      iso: '9, 10조', path: '/audit/index.html',
    },
  ];

  /* ── Duration helpers ── */
  function parseDurToMinutes(s) {
    if (!s || s === '-' || s === '즉시') return null;
    const n = parseInt(s, 10);
    if (isNaN(n)) return null;
    if (s.includes('일'))   return n * 1440;
    if (s.includes('시간')) return n * 60;
    if (s.includes('분'))   return n;
    return null;
  }

  function parseDurToVU(s) {
    if (!s || s === '-') return { value: '', unit: '분' };
    if (s === '즉시')    return { value: 0,  unit: '분' };
    const n = parseInt(s, 10);
    if (s.includes('일'))   return { value: n, unit: '일' };
    if (s.includes('시간')) return { value: n, unit: '시간' };
    if (s.includes('분'))   return { value: n, unit: '분' };
    return { value: '', unit: '분' };
  }

  function makeTimeImpact(imp) {
    if (imp >= 5) return { immediate:3, min30:4, hour1:5, hour4:5, day1:5, week1:5 };
    if (imp >= 4) return { immediate:2, min30:3, hour1:4, hour4:5, day1:5, week1:5 };
    if (imp >= 3) return { immediate:1, min30:2, hour1:2, hour4:3, day1:4, week1:5 };
    return           { immediate:1, min30:1, hour1:1, hour4:2, day1:3, week1:4 };
  }

  /* ── Data converters ── */
  function toBiaStorage(rawList) {
    const byTeam = new Map();
    rawList.forEach(r => {
      if (!byTeam.has(r.team)) byTeam.set(r.team, []);
      const rto = parseDurToVU(r.rto);
      const rpo = parseDurToVU(r.rpo);
      const mtpdMinutes = parseDurToMinutes(r.mtpd);
      const imp = r.importance === '핵심'
        ? (mtpdMinutes !== null && mtpdMinutes <= 60 ? 5 : 4)
        : r.importance === '중요' ? 3 : 2;
      const rtoStr = (!r.rto || r.rto === '-') ? '-' : r.rto;
      byTeam.get(r.team).push({
        id: r.id, biaId: r.id,
        functionId: r.id.replace('BIA-', 'FN-'),
        name: r.functionName,
        importance: r.importance,
        overallImpact: imp, impact: imp,
        mtpd: (!r.mtpd || r.mtpd === '-') ? null : r.mtpd,
        mtpdMinutes,
        rtoValue: rto.value, rtoUnit: rto.unit, rto: rtoStr,
        rpoValue: rpo.value, rpoUnit: rpo.unit,
        mbco: r.mbco != null ? r.mbco : 70,
        requiredResources: [], resourceDetails: {}, relatedRisks: [],
        grade: r.importance, coreFinal: r.importance !== '일반',
        timeImpact: makeTimeImpact(imp),
        description: '',
        financialImpact: imp,
        operationalImpact: imp,
        reputationalImpact: Math.max(1, imp - 1),
      });
    });
    return [...byTeam.entries()].map(([team, functions]) => ({ team, functions }));
  }

  function toRiskStorage(rawList) {
    const d = new Date();
    const date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    return rawList.map(r => ({
      id: r.id, riskType: r.type, riskName: r.name,
      resources: r.resources,
      likelihood: r.likelihood, impact: r.impact, riskScore: r.riskScore,
      riskLevel: r.riskScore >= 13 ? '높음' : r.riskScore >= 6 ? '보통' : '낮음',
      residualLikelihood: r.residualLikelihood,
      residualImpact: r.residualImpact,
      residualScore: r.residualScore,
      treatment: r.treatment, description: '', registeredAt: date
    }));
  }

  /* ── Raw sample data ── */
  const RAW = {
    '제조업': {
      bia: [
        {id:"BIA-2025-001",team:"생산팀",    functionName:"생산라인 운영",    importance:"핵심",mtpd:"24시간",rto:"8시간", rpo:"1시간", mbco:80},
        {id:"BIA-2025-002",team:"품질팀",    functionName:"품질검사·출하승인",importance:"핵심",mtpd:"36시간",rto:"12시간",rpo:"4시간", mbco:70},
        {id:"BIA-2025-003",team:"IT팀",      functionName:"ERP 시스템 운영", importance:"핵심",mtpd:"8시간", rto:"2시간", rpo:"30분",  mbco:90},
        {id:"BIA-2025-004",team:"물류팀",    functionName:"물류·출하 관리",  importance:"핵심",mtpd:"48시간",rto:"24시간",rpo:"4시간", mbco:70},
        {id:"BIA-2025-005",team:"구매팀",    functionName:"원자재 구매·조달",importance:"중요",mtpd:"72시간",rto:"24시간",rpo:"8시간", mbco:60},
        {id:"BIA-2025-006",team:"생산관리팀",functionName:"생산계획·일정관리",importance:"중요",mtpd:"24시간",rto:"4시간", rpo:"2시간", mbco:70},
        {id:"BIA-2025-007",team:"시설팀",    functionName:"설비 유지보수",   importance:"중요",mtpd:"24시간",rto:"8시간", rpo:"-",     mbco:60},
        {id:"BIA-2025-008",team:"영업팀",    functionName:"고객 주문 접수",  importance:"중요",mtpd:"48시간",rto:"12시간",rpo:"8시간", mbco:60},
      ],
      risk: [
        {id:"RSK-2025-001",type:"IT·시스템 장애",    name:"ERP 시스템 장애",            resources:["기술·IT"],                    likelihood:3,impact:5,riskScore:15,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
        {id:"RSK-2025-002",type:"설비·시설",          name:"핵심 생산설비 고장·화재",    resources:["설비·장비","시설·작업장"],    likelihood:3,impact:5,riskScore:15,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
        {id:"RSK-2025-003",type:"전력·유틸리티 중단", name:"정전으로 인한 생산라인 중단",resources:["유틸리티"],                  likelihood:3,impact:4,riskScore:12,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
        {id:"RSK-2025-004",type:"공급망 중단",        name:"핵심 원자재 공급 중단",      resources:["공급망·외주"],               likelihood:3,impact:4,riskScore:12,residualLikelihood:2,residualImpact:2,residualScore:4, treatment:"완화"},
        {id:"RSK-2025-005",type:"사이버 공격",        name:"랜섬웨어로 생산시스템 마비", resources:["기술·IT","정보·문서"],       likelihood:2,impact:5,riskScore:10,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
      ]
    },
    '금융': {
      bia: [
        {id:"BIA-2025-001",team:"IT팀",      functionName:"전산인프라·네트워크 운영", importance:"핵심",mtpd:"2시간", rto:"30분",  rpo:"15분", mbco:99},
        {id:"BIA-2025-002",team:"IT팀",      functionName:"계정계 시스템 운영",       importance:"핵심",mtpd:"4시간", rto:"1시간", rpo:"15분", mbco:99},
        {id:"BIA-2025-003",team:"IT팀",      functionName:"대외계·금융결제망 연결",   importance:"핵심",mtpd:"4시간", rto:"2시간", rpo:"30분", mbco:99},
        {id:"BIA-2025-004",team:"자금팀",    functionName:"자금결제·청산 업무",       importance:"핵심",mtpd:"4시간", rto:"2시간", rpo:"30분", mbco:99},
        {id:"BIA-2025-005",team:"영업팀",    functionName:"수신·여신 업무처리",       importance:"핵심",mtpd:"8시간", rto:"4시간", rpo:"1시간",mbco:90},
        {id:"BIA-2025-006",team:"IT팀",      functionName:"인터넷·모바일뱅킹",       importance:"핵심",mtpd:"8시간", rto:"4시간", rpo:"1시간",mbco:90},
        {id:"BIA-2025-007",team:"고객지원팀",functionName:"고객센터 운영",            importance:"중요",mtpd:"24시간",rto:"8시간", rpo:"4시간",mbco:70},
        {id:"BIA-2025-008",team:"준법감시팀",functionName:"리스크·컴플라이언스 관리",importance:"중요",mtpd:"48시간",rto:"24시간",rpo:"8시간",mbco:60},
      ],
      risk: [
        {id:"RSK-2025-001",type:"사이버 공격",        name:"DDoS 공격으로 서비스 마비",   resources:["기술·IT","유틸리티"],     likelihood:4,impact:5,riskScore:20,residualLikelihood:2,residualImpact:3,residualScore:6, treatment:"완화"},
        {id:"RSK-2025-002",type:"IT·시스템 장애",    name:"계정계 시스템 장애",           resources:["기술·IT"],               likelihood:3,impact:5,riskScore:15,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
        {id:"RSK-2025-003",type:"사이버 공격",        name:"해킹으로 인한 고객정보 유출",  resources:["기술·IT","정보·문서"],   likelihood:3,impact:5,riskScore:15,residualLikelihood:1,residualImpact:3,residualScore:3, treatment:"완화"},
        {id:"RSK-2025-004",type:"전력·유틸리티 중단", name:"전산센터 전력 공급 중단",      resources:["유틸리티"],              likelihood:2,impact:5,riskScore:10,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
        {id:"RSK-2025-005",type:"법규·규정 위반",     name:"금융감독원 제재·영업정지",     resources:["인원","정보·문서"],      likelihood:2,impact:5,riskScore:10,residualLikelihood:1,residualImpact:3,residualScore:3, treatment:"회피"},
      ]
    },
    '공공기관': {
      bia: [
        {id:"BIA-2025-001",team:"기획팀",functionName:"비상연락·보고체계 운영",  importance:"핵심",mtpd:"1시간", rto:"30분",  rpo:"-",     mbco:100},
        {id:"BIA-2025-002",team:"IT팀",  functionName:"행정전산망·네트워크 운영",importance:"핵심",mtpd:"8시간", rto:"2시간", rpo:"1시간", mbco:90},
        {id:"BIA-2025-003",team:"행정팀",functionName:"내부결재·문서관리",        importance:"핵심",mtpd:"24시간",rto:"8시간", rpo:"4시간", mbco:80},
        {id:"BIA-2025-004",team:"민원팀",functionName:"민원처리·대민서비스",      importance:"핵심",mtpd:"24시간",rto:"8시간", rpo:"4시간", mbco:80},
        {id:"BIA-2025-005",team:"재무팀",functionName:"예산·회계 처리",           importance:"중요",mtpd:"48시간",rto:"24시간",rpo:"8시간", mbco:70},
        {id:"BIA-2025-006",team:"인사팀",functionName:"인사·급여 관리",           importance:"중요",mtpd:"72시간",rto:"48시간",rpo:"24시간",mbco:60},
        {id:"BIA-2025-007",team:"시설팀",functionName:"시설·보안 관리",           importance:"중요",mtpd:"4시간", rto:"1시간", rpo:"-",     mbco:80},
      ],
      risk: [
        {id:"RSK-2025-001",type:"IT·시스템 장애",    name:"행정전산망 장애·중단",          resources:["기술·IT"],                likelihood:3,impact:5,riskScore:15,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
        {id:"RSK-2025-002",type:"사이버 공격",        name:"랜섬웨어로 행정시스템 마비",    resources:["기술·IT","정보·문서"],    likelihood:3,impact:5,riskScore:15,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
        {id:"RSK-2025-003",type:"사이버 공격",        name:"개인정보 대량 유출",            resources:["정보·문서","기술·IT"],    likelihood:2,impact:5,riskScore:10,residualLikelihood:1,residualImpact:3,residualScore:3, treatment:"완화"},
        {id:"RSK-2025-004",type:"자연재해",           name:"홍수·지진으로 청사 기능 마비",  resources:["시설·작업장","유틸리티"], likelihood:2,impact:5,riskScore:10,residualLikelihood:1,residualImpact:3,residualScore:3, treatment:"전가"},
        {id:"RSK-2025-005",type:"전염병·감염병",      name:"감염병 확산으로 인력 운용 불가",resources:["인원"],                  likelihood:2,impact:4,riskScore:8, residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
      ]
    },
    '고속도로': {
      bia: [
        {id:"BIA-2025-001",team:"시설팀",    functionName:"전력공급·비상전원 운영",   importance:"핵심",mtpd:"30분", rto:"10분", rpo:"-",    mbco:100},
        {id:"BIA-2025-002",team:"관제팀",    functionName:"교통관제센터 운영",        importance:"핵심",mtpd:"1시간",rto:"30분", rpo:"15분", mbco:100},
        {id:"BIA-2025-003",team:"시설팀",    functionName:"터널 환기·방재설비 운영",  importance:"핵심",mtpd:"30분", rto:"15분", rpo:"-",    mbco:100},
        {id:"BIA-2025-004",team:"관제팀",    functionName:"CCTV·돌발검지 시스템",    importance:"핵심",mtpd:"1시간",rto:"30분", rpo:"15분", mbco:100},
        {id:"BIA-2025-005",team:"순찰팀",    functionName:"긴급출동·사고대응",        importance:"핵심",mtpd:"30분", rto:"즉시", rpo:"-",    mbco:100},
        {id:"BIA-2025-006",team:"IT팀",      functionName:"요금수납시스템(ETC) 운영",importance:"핵심",mtpd:"4시간",rto:"1시간",rpo:"30분", mbco:90},
        {id:"BIA-2025-007",team:"재무팀",    functionName:"하이패스·정산 처리",       importance:"중요",mtpd:"24시간",rto:"8시간",rpo:"4시간",mbco:70},
        {id:"BIA-2025-008",team:"유지보수팀",functionName:"도로유지보수 관리",        importance:"중요",mtpd:"24시간",rto:"8시간",rpo:"-",    mbco:60},
      ],
      risk: [
        {id:"RSK-2025-001",type:"자연재해",           name:"폭설·결빙으로 도로 통제",             resources:["시설·작업장","유틸리티"],  likelihood:4,impact:4,riskScore:16,residualLikelihood:2,residualImpact:2,residualScore:4, treatment:"완화"},
        {id:"RSK-2025-002",type:"설비·시설",          name:"터널 화재로 인한 교통통제",           resources:["시설·작업장","설비·장비"], likelihood:2,impact:5,riskScore:10,residualLikelihood:1,residualImpact:3,residualScore:3, treatment:"완화"},
        {id:"RSK-2025-003",type:"IT·시스템 장애",    name:"교통관제시스템(TCS) 장애",            resources:["기술·IT"],                likelihood:2,impact:5,riskScore:10,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
        {id:"RSK-2025-004",type:"전력·유틸리티 중단", name:"변전소 장애로 관제·방재 전력 중단",  resources:["유틸리티"],               likelihood:2,impact:5,riskScore:10,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
        {id:"RSK-2025-005",type:"인적 오류·사고",    name:"대형 다중충돌 사고",                  resources:["인원","시설·작업장"],     likelihood:3,impact:4,riskScore:12,residualLikelihood:2,residualImpact:3,residualScore:6, treatment:"완화"},
      ]
    },
    '통신': {
      bia: [
        {id:"BIA-2025-001",team:"시설팀",      functionName:"전원설비·UPS 운영",    importance:"핵심",mtpd:"30분", rto:"10분", rpo:"-",    mbco:100},
        {id:"BIA-2025-002",team:"네트워크팀",  functionName:"코어네트워크 운영",    importance:"핵심",mtpd:"1시간",rto:"30분", rpo:"15분", mbco:100},
        {id:"BIA-2025-003",team:"네트워크팀",  functionName:"교환·라우팅 시스템",  importance:"핵심",mtpd:"2시간",rto:"1시간",rpo:"30분", mbco:99},
        {id:"BIA-2025-004",team:"서비스팀",    functionName:"음성통화 서비스",      importance:"핵심",mtpd:"2시간",rto:"1시간",rpo:"30분", mbco:99},
        {id:"BIA-2025-005",team:"서비스팀",    functionName:"인터넷·데이터 서비스",importance:"핵심",mtpd:"4시간",rto:"2시간",rpo:"1시간",mbco:99},
        {id:"BIA-2025-006",team:"무선팀",      functionName:"기지국·무선망 운영",  importance:"핵심",mtpd:"4시간",rto:"2시간",rpo:"1시간",mbco:99},
        {id:"BIA-2025-007",team:"기업서비스팀",functionName:"기업전용회선·VPN",    importance:"핵심",mtpd:"4시간",rto:"2시간",rpo:"1시간",mbco:90},
        {id:"BIA-2025-008",team:"고객지원팀",  functionName:"고객센터·장애접수",   importance:"중요",mtpd:"8시간",rto:"4시간",rpo:"2시간",mbco:80},
      ],
      risk: [
        {id:"RSK-2025-001",type:"사이버 공격",        name:"DDoS로 인터넷 서비스 마비",    resources:["기술·IT","유틸리티"],       likelihood:4,impact:4,riskScore:16,residualLikelihood:2,residualImpact:2,residualScore:4, treatment:"완화"},
        {id:"RSK-2025-002",type:"설비·시설",          name:"광케이블 절단으로 서비스 중단", resources:["설비·장비","유틸리티"],     likelihood:3,impact:4,riskScore:12,residualLikelihood:2,residualImpact:2,residualScore:4, treatment:"완화"},
        {id:"RSK-2025-003",type:"IT·시스템 장애",    name:"코어 라우터 장애로 전국망 중단",resources:["기술·IT"],                 likelihood:2,impact:5,riskScore:10,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
        {id:"RSK-2025-004",type:"자연재해",           name:"태풍·낙뢰로 기지국 집단 장애", resources:["설비·장비","시설·작업장"],  likelihood:3,impact:4,riskScore:12,residualLikelihood:2,residualImpact:2,residualScore:4, treatment:"완화"},
        {id:"RSK-2025-005",type:"전력·유틸리티 중단", name:"국사 전력 공급 중단",           resources:["유틸리티"],                likelihood:2,impact:5,riskScore:10,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
      ]
    },
    'IDC': {
      bia: [
        {id:"BIA-2025-001",team:"시설팀",    functionName:"전력공급·UPS·발전기 운영",    importance:"핵심",mtpd:"15분", rto:"즉시", rpo:"-",    mbco:100},
        {id:"BIA-2025-002",team:"시설팀",    functionName:"항온항습·공조 시스템 운영",   importance:"핵심",mtpd:"30분", rto:"15분", rpo:"-",    mbco:100},
        {id:"BIA-2025-003",team:"시설팀",    functionName:"소방·방재설비 운영",          importance:"핵심",mtpd:"즉시", rto:"즉시", rpo:"-",    mbco:100},
        {id:"BIA-2025-004",team:"보안팀",    functionName:"물리보안·출입통제",           importance:"핵심",mtpd:"즉시", rto:"즉시", rpo:"-",    mbco:100},
        {id:"BIA-2025-005",team:"운영팀",    functionName:"서버·스토리지 운영",          importance:"핵심",mtpd:"1시간",rto:"30분", rpo:"15분", mbco:99},
        {id:"BIA-2025-006",team:"네트워크팀",functionName:"네트워크·백본 운영",         importance:"핵심",mtpd:"1시간",rto:"30분", rpo:"15분", mbco:99},
        {id:"BIA-2025-007",team:"서비스팀",  functionName:"고객 호스팅·코로케이션 서비스",importance:"핵심",mtpd:"2시간",rto:"1시간",rpo:"30분", mbco:99},
        {id:"BIA-2025-008",team:"운영팀",    functionName:"NOC·고객지원 운영",          importance:"중요",mtpd:"4시간",rto:"2시간",rpo:"1시간",mbco:90},
      ],
      risk: [
        {id:"RSK-2025-001",type:"설비·시설",          name:"항온항습 장애로 서버실 과열",     resources:["설비·장비","유틸리티"],     likelihood:3,impact:5,riskScore:15,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
        {id:"RSK-2025-002",type:"사이버 공격",        name:"DDoS로 네트워크 대역폭 포화",    resources:["기술·IT","유틸리티"],       likelihood:4,impact:4,riskScore:16,residualLikelihood:2,residualImpact:2,residualScore:4, treatment:"완화"},
        {id:"RSK-2025-003",type:"전력·유틸리티 중단", name:"한전 공급 전력 차단·UPS 방전",   resources:["유틸리티"],                 likelihood:2,impact:5,riskScore:10,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
        {id:"RSK-2025-004",type:"전력·유틸리티 중단", name:"비상발전기 기동 실패",            resources:["유틸리티","설비·장비"],     likelihood:2,impact:5,riskScore:10,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
        {id:"RSK-2025-005",type:"설비·시설",          name:"누수·침수로 서버 손상",           resources:["시설·작업장","설비·장비"],  likelihood:2,impact:5,riskScore:10,residualLikelihood:1,residualImpact:2,residualScore:2, treatment:"완화"},
      ]
    },
  };

  /* Pre-convert sample data once at load */
  const SAMPLE_DATA = Object.fromEntries(
    Object.entries(RAW).map(([k, v]) => [k, { bia: toBiaStorage(v.bia), risk: toRiskStorage(v.risk) }])
  );

  /* ── Modal state ── */
  let selectedIndustry = null;
  let selectedGoal     = null;
  let currentStep      = 1;
  let rootEl           = null;

  /* ── Portal base URL (for roadmap links) ── */
  function portalBase() {
    const p = window.location.pathname;
    const m = p.match(/^(\/[^\/]+)(?=\/(governance|risk-bia|strategy-plans|op-center|library|training|audit|admin|reports|assets)\/)/);
    return m ? m[1] : '';
  }

  /* ── Check if roadmap step is done ── */
  function isStepDone(key) {
    try {
      const raw = localStorage.getItem('bcmsCompletedSteps');
      if (raw) {
        const c = JSON.parse(raw);
        if (Array.isArray(c))                          return c.includes(key);
        if (typeof c === 'object' && c !== null)       return c[key] === true;
      }
      const dataMap = {
        governance: 'bcmsPolicyData',
        bia:        'bcmsBIAData',
        risk:       'bcmsRiskList',
        bcp:        'bcmsBCP',
        training:   'bcmsTrainingData',
        audit:      'bcmsGapAnalysis',
      };
      const k = dataMap[key];
      if (!k) return false;
      const v = localStorage.getItem(k);
      if (!v) return false;
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed.length > 0 : !!parsed;
    } catch { return false; }
  }

  /* ── Inject CSS ── */
  function injectStyles() {
    if (document.getElementById('bcms-ob-css')) return;
    const s = document.createElement('style');
    s.id = 'bcms-ob-css';
    s.textContent = `
      @keyframes ob-fade  { from{opacity:0} to{opacity:1} }
      @keyframes ob-slide { from{transform:translateY(22px);opacity:0} to{transform:translateY(0);opacity:1} }

      .ob-overlay {
        position:fixed;inset:0;z-index:9999;
        background:rgba(0,0,0,.52);
        backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
        display:flex;align-items:center;justify-content:center;
        padding:20px;overflow-y:auto;overflow-x:hidden;
        box-sizing:border-box;
        animation:ob-fade .2s ease;
      }
      .ob-card {
        background:#ffffff;border-radius:16px;
        box-shadow:0 24px 64px rgba(0,0,0,.2);
        width:92vw;max-width:min(860px,92vw);
        box-sizing:border-box;
        display:flex;flex-direction:column;
        max-height:calc(100vh - 40px);
        overflow:hidden;
        animation:ob-slide .25s cubic-bezier(.4,0,.2,1);
      }
      .ob-head {
        background:linear-gradient(135deg,#0070f3 0%,#0050d4 100%);
        padding:28px 32px 22px;color:#fff;flex-shrink:0;
        border-radius:16px 16px 0 0;
      }
      .ob-logo    { font-size:22px;font-weight:800;letter-spacing:-.02em;word-break:keep-all }
      .ob-tagline { font-size:12px;opacity:.82;margin-top:3px;word-break:keep-all }
      .ob-dots    { display:flex;gap:5px;margin-top:16px }
      .ob-dot     { height:5px;width:5px;border-radius:3px;background:rgba(255,255,255,.35);transition:all .2s }
      .ob-dot.active { width:18px;background:#fff }

      .ob-body    { padding:28px 28px;overflow-y:auto;overflow-x:hidden;box-sizing:border-box;border-radius:0 0 16px 16px }
      .ob-title   { font-size:17px;font-weight:700;color:#111;letter-spacing:-.02em;margin-bottom:6px;word-break:keep-all }
      .ob-desc    { font-size:13px;color:#666;line-height:1.7;word-break:keep-all;margin-bottom:18px }
      .ob-actions { display:flex;gap:8px;justify-content:flex-end;margin-top:20px;flex-wrap:wrap }

      .ob-btn { font-family:inherit;font-size:13px;font-weight:600;padding:9px 20px;border-radius:8px;border:1px solid rgba(0,0,0,.12);background:#fff;color:#111;cursor:pointer;transition:all .12s;white-space:nowrap }
      .ob-btn:hover { background:#f5f5f5 }
      .ob-btn.primary { background:#0070f3;color:#fff;border-color:transparent }
      .ob-btn.primary:hover { background:#0060df }
      .ob-btn:disabled { opacity:.42;cursor:not-allowed;pointer-events:none }

      /* ── Step 1: Industry cards ── */
      .ob-ind-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:8px;min-width:0;overflow:hidden }
      @media(max-width:580px){ .ob-ind-grid { grid-template-columns:repeat(2,1fr) } }
      .ob-ind-card {
        border:1.5px solid rgba(0,0,0,.1);border-radius:10px;padding:12px 10px;cursor:pointer;
        display:flex;flex-direction:column;gap:5px;transition:all .14s;background:#fff;
        text-align:left;font-family:inherit;width:100%;min-width:0;overflow:hidden;box-sizing:border-box;
      }
      .ob-ind-card:hover   { border-color:#0070f3;background:rgba(0,112,243,.04) }
      .ob-ind-card.selected{ border-color:#0070f3;background:rgba(0,112,243,.08);box-shadow:0 0 0 2px rgba(0,112,243,.22) }
      .ob-ind-icon  { font-size:22px;line-height:1 }
      .ob-ind-name  { font-size:12.5px;font-weight:700;color:#111;letter-spacing:-.01em;word-break:keep-all }
      .ob-ind-desc  { font-size:10.5px;color:#777;line-height:1.4;word-break:keep-all }
      .ob-ind-check { width:16px;height:16px;border-radius:50%;background:#0070f3;color:#fff;font-size:9px;font-weight:800;display:none;align-items:center;justify-content:center;align-self:flex-end;margin-top:2px }
      .ob-ind-card.selected .ob-ind-check { display:flex }

      /* ── Step 2: Goal cards ── */
      .ob-goal-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:8px;overflow:hidden }
      @media(max-width:620px){ .ob-goal-grid { grid-template-columns:1fr } }
      .ob-goal-card {
        border:1.5px solid rgba(0,0,0,.1);border-radius:10px;padding:16px 14px;cursor:pointer;
        display:flex;flex-direction:column;gap:6px;transition:all .14s;background:#fff;
        text-align:left;font-family:inherit;width:100%;min-width:0;overflow:hidden;box-sizing:border-box;
      }
      .ob-goal-card:hover    { border-color:#0070f3;background:rgba(0,112,243,.04) }
      .ob-goal-card.selected { border-color:#0070f3;background:rgba(0,112,243,.08);box-shadow:0 0 0 2px rgba(0,112,243,.22) }
      .ob-goal-icon  { font-size:22px;line-height:1 }
      .ob-goal-label { font-size:13px;font-weight:700;color:#111;word-break:keep-all;overflow:hidden;text-overflow:ellipsis }
      .ob-goal-desc  { font-size:11px;color:#777;line-height:1.4;word-break:keep-all;flex:1;overflow:hidden }
      .ob-goal-check { width:16px;height:16px;border-radius:50%;background:#0070f3;color:#fff;font-size:9px;font-weight:800;display:none;align-items:center;justify-content:center;align-self:flex-end;margin-top:4px }
      .ob-goal-card.selected .ob-goal-check { display:flex }

      /* ── Step 3: Roadmap ── */
      .ob-roadmap-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:8px;overflow:hidden }
      @media(max-width:620px){ .ob-roadmap-grid { grid-template-columns:1fr } }
      .ob-rm-card {
        border:1px solid rgba(0,0,0,.1);border-radius:10px;padding:14px;
        display:flex;flex-direction:column;gap:8px;background:#fafafa;
        min-width:0;overflow:hidden;box-sizing:border-box;
      }
      .ob-rm-head   { display:flex;align-items:center;gap:8px;flex-wrap:nowrap }
      .ob-rm-num {
        width:26px;height:26px;border-radius:50%;flex-shrink:0;
        background:#0070f3;color:#fff;font-size:11px;font-weight:800;
        display:flex;align-items:center;justify-content:center;
      }
      .ob-rm-num.done { background:#16a34a }
      .ob-rm-title  { font-size:13px;font-weight:700;color:#111;word-break:keep-all;flex:1;min-width:0 }
      .ob-rm-period {
        font-size:10px;color:#0070f3;font-weight:600;white-space:nowrap;
        padding:2px 7px;border-radius:99px;background:rgba(0,112,243,.1);flex-shrink:0;
      }
      .ob-rm-tasks  { list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:3px }
      .ob-rm-tasks li { font-size:11.5px;color:#555;padding-left:12px;position:relative;word-break:keep-all;line-height:1.5 }
      .ob-rm-tasks li::before { content:'·';position:absolute;left:2px;color:#999 }
      .ob-rm-footer { display:flex;align-items:center;justify-content:space-between;margin-top:2px;gap:6px }
      .ob-rm-iso    { font-size:10.5px;color:#999 }
      .ob-rm-link {
        font-size:11px;font-weight:600;color:#0070f3;text-decoration:none;
        padding:3px 9px;border-radius:5px;border:1px solid rgba(0,112,243,.25);
        background:rgba(0,112,243,.06);white-space:nowrap;
      }
      .ob-rm-link:hover { background:rgba(0,112,243,.12) }

      /* ── Toast ── */
      .ob-toast {
        position:fixed;bottom:24px;right:24px;z-index:10000;
        background:#111;color:#fff;padding:12px 20px;border-radius:10px;
        font-size:13px;font-weight:600;
        font-family:"Pretendard","Inter",system-ui,sans-serif;
        box-shadow:0 8px 24px rgba(0,0,0,.28);animation:ob-fade .2s ease;word-break:keep-all;
      }

      /* ── Dark mode ── */
      [data-theme="dark"] .ob-card    { background:#111 }
      [data-theme="dark"] .ob-body    { background:#111 }
      [data-theme="dark"] .ob-title   { color:#ededed }
      [data-theme="dark"] .ob-desc    { color:#888 }
      [data-theme="dark"] .ob-btn     { background:#1c1c1c;color:#ededed;border-color:rgba(255,255,255,.12) }
      [data-theme="dark"] .ob-btn:hover { background:#252525 }
      [data-theme="dark"] .ob-ind-card  { background:#1c1c1c;border-color:rgba(255,255,255,.1) }
      [data-theme="dark"] .ob-ind-card:hover    { background:rgba(0,112,243,.12) }
      [data-theme="dark"] .ob-ind-card.selected { background:rgba(0,112,243,.16) }
      [data-theme="dark"] .ob-ind-name { color:#ededed }
      [data-theme="dark"] .ob-ind-desc { color:#888 }
      [data-theme="dark"] .ob-goal-card  { background:#1c1c1c;border-color:rgba(255,255,255,.1) }
      [data-theme="dark"] .ob-goal-card:hover    { background:rgba(0,112,243,.12) }
      [data-theme="dark"] .ob-goal-card.selected { background:rgba(0,112,243,.16) }
      [data-theme="dark"] .ob-goal-label { color:#ededed }
      [data-theme="dark"] .ob-goal-desc  { color:#888 }
      [data-theme="dark"] .ob-rm-card  { background:#1c1c1c;border-color:rgba(255,255,255,.08) }
      [data-theme="dark"] .ob-rm-title { color:#ededed }
      [data-theme="dark"] .ob-rm-tasks li { color:#aaa }
      [data-theme="dark"] .ob-rm-iso   { color:#666 }
    `;
    document.head.appendChild(s);
  }

  /* ── HTML builders ── */
  function buildDots() {
    return [1,2,3].map(i =>
      `<div class="ob-dot${i <= currentStep ? ' active' : ''}"></div>`
    ).join('');
  }

  function buildStep1() {
    const cards = INDUSTRIES.map(ind => `
      <button class="ob-ind-card${selectedIndustry === ind.key ? ' selected' : ''}" type="button" data-ind="${ind.key}">
        <span class="ob-ind-icon">${ind.icon}</span>
        <span class="ob-ind-name">${ind.key}</span>
        <span class="ob-ind-desc">${ind.desc}</span>
        <span class="ob-ind-check">✓</span>
      </button>`).join('');
    return `
      <div class="ob-title">귀사의 업종을 선택해주세요</div>
      <div class="ob-desc">업종에 맞는 샘플 데이터와 용어로 빠르게 시작할 수 있습니다.</div>
      <div class="ob-ind-grid">${cards}</div>
      <div class="ob-actions">
        <button class="ob-btn primary" type="button" id="obNext"${!selectedIndustry ? ' disabled' : ''}>다음 →</button>
      </div>`;
  }

  function buildStep2() {
    const cards = GOALS.map(g => `
      <button class="ob-goal-card${selectedGoal === g.key ? ' selected' : ''}" type="button" data-goal="${g.key}">
        <span class="ob-goal-icon">${g.icon}</span>
        <span class="ob-goal-label">${g.label}</span>
        <span class="ob-goal-desc">${g.desc}</span>
        <span class="ob-goal-check">✓</span>
      </button>`).join('');
    return `
      <div class="ob-title">어떤 인증을 목표로 하시나요?</div>
      <div class="ob-desc">목표 인증에 맞춘 관리 방향을 안내해 드립니다.</div>
      <div class="ob-goal-grid">${cards}</div>
      <div class="ob-actions">
        <button class="ob-btn" type="button" id="obBack">← 이전</button>
        <button class="ob-btn primary" type="button" id="obNext"${!selectedGoal ? ' disabled' : ''}>다음 →</button>
      </div>`;
  }

  function buildStep3() {
    const base = portalBase();
    const cards = ROADMAP.map(step => {
      const done = isStepDone(step.key);
      return `
        <div class="ob-rm-card">
          <div class="ob-rm-head">
            <div class="ob-rm-num${done ? ' done' : ''}">${done ? '✓' : step.num}</div>
            <div class="ob-rm-title">${step.num}단계 ${step.title}</div>
            <span class="ob-rm-period">${step.period}</span>
          </div>
          <ul class="ob-rm-tasks">
            ${step.tasks.map(t => `<li>${t}</li>`).join('')}
          </ul>
          <div class="ob-rm-footer">
            <span class="ob-rm-iso">ISO 22301: ${step.iso}</span>
            <a href="${base}${step.path}" class="ob-rm-link">바로가기 →</a>
          </div>
        </div>`;
    }).join('');
    return `
      <div class="ob-title">BCMS 수립 로드맵</div>
      <div class="ob-desc">아래 순서대로 진행하시면 됩니다. 예상 소요기간: 3~6개월</div>
      <div class="ob-roadmap-grid">${cards}</div>
      <div class="ob-actions">
        <button class="ob-btn" type="button" id="obBack">← 이전</button>
        <button class="ob-btn primary" type="button" id="obStart">🚀 시작하기</button>
      </div>`;
  }

  function render() {
    if (!rootEl) return;
    const body = currentStep === 1 ? buildStep1()
               : currentStep === 2 ? buildStep2()
               :                     buildStep3();
    rootEl.innerHTML = `
      <div class="ob-overlay">
        <div class="ob-card">
          <div class="ob-head">
            <div class="ob-logo">🛡 BCMS Portal</div>
            <div class="ob-tagline">ISO 22301 기반 업무연속성관리 시스템</div>
            <div class="ob-dots">${buildDots()}</div>
          </div>
          <div class="ob-body">${body}</div>
        </div>
      </div>`;
    attachEvents();
  }

  function attachEvents() {
    const next  = document.getElementById('obNext');
    const back  = document.getElementById('obBack');
    const start = document.getElementById('obStart');

    if (next)  next.addEventListener('click',  () => { currentStep++; render(); });
    if (back)  back.addEventListener('click',  () => { currentStep--; render(); });
    if (start) start.addEventListener('click', () => finish());

    rootEl.querySelectorAll('.ob-ind-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedIndustry = card.getAttribute('data-ind');
        rootEl.querySelectorAll('.ob-ind-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const n = document.getElementById('obNext');
        if (n) n.disabled = false;
      });
    });

    rootEl.querySelectorAll('.ob-goal-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedGoal = card.getAttribute('data-goal');
        rootEl.querySelectorAll('.ob-goal-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const n = document.getElementById('obNext');
        if (n) n.disabled = false;
      });
    });
  }

  function loadSampleData(industry) {
    const data = SAMPLE_DATA[industry];
    if (!data) return;
    localStorage.setItem(BIA_KEY,  JSON.stringify(data.bia));
    localStorage.setItem(RISK_KEY, JSON.stringify(data.risk));
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'ob-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  function finish() {
    localStorage.setItem(DONE_KEY, 'true');
    if (selectedIndustry) localStorage.setItem(INDUSTRY_KEY, selectedIndustry);
    if (selectedGoal)     localStorage.setItem(GOAL_KEY, selectedGoal);

    // 기존 BIA/리스크/BCP 데이터 초기화 (업종 변경 시 구 데이터 잔존 방지)
    ['bcmsBIAData', 'bcmsRiskAssessment', 'bcmsRiskList',
     'bcmsBCPStrategy', 'bcmsBCP', 'bcmsPriorityConfirmed'].forEach(k => localStorage.removeItem(k));

    // 새 업종 샘플 강제 로드
    const loaded = window.BCMSDemoSeed?.loadDemo({ force: true });

    if (rootEl) { rootEl.remove(); rootEl = null; }

    const redirect = window.BCMS_ONBOARDING_REDIRECT;
    if (loaded && selectedIndustry) {
      showToast(`✓ ${selectedIndustry} 샘플 데이터 로드 완료`);
      setTimeout(() => {
        if (redirect) window.location.href = redirect;
        else          window.location.reload();
      }, 900);
    } else if (redirect) {
      window.location.href = redirect;
    } else {
      window.location.reload();
    }
  }

  function show() {
    if (rootEl) return;
    injectStyles();
    currentStep      = 1;
    selectedIndustry = null;
    selectedGoal     = null;
    rootEl = document.createElement('div');
    rootEl.id = 'bcmsOnboardingRoot';
    document.body.appendChild(rootEl);
    render();
  }

  function init() {
    const force = window.BCMS_FORCE_ONBOARDING === true;
    if (!force && localStorage.getItem(DONE_KEY) !== null) return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', show);
    } else {
      show();
    }
  }

  /* ── Public API ── */
  window.BCMSOnboarding = {
    reset() {
      localStorage.removeItem(DONE_KEY);
      localStorage.removeItem(INDUSTRY_KEY);
      localStorage.removeItem(GOAL_KEY);
      show();
    },
    forceShow() { show(); },
    showRoadmap() {
      if (rootEl) { rootEl.remove(); rootEl = null; }
      injectStyles();
      currentStep = 3;
      rootEl = document.createElement('div');
      rootEl.id = 'bcmsOnboardingRoot';
      document.body.appendChild(rootEl);
      render();
    },
  };

  init();
})();
