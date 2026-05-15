(function(){
  const KEYS = {
    CORE: 'bcmsCoreFunctions',
    SERVICE: 'bcms_service_registry_v1',
    BIA: 'bcmsBIAData',
    RISK: 'bcmsRiskAssessment',
    BCP: 'bcmsBCP',
    DRP: 'bcmsDRP'
  };

  const DEMO_TAG = { isDemo: true, demoLabel: '예시' };

  const DEMO = {
    [KEYS.CORE]: [
      { team:'전기팀', teamId:'TEAM-전기팀', functions:[{ id:'CF-전기-전력공급', name:'데이터센터 전력 공급 운영', serviceName:'IDC 전력' },{ id:'CF-전기-UPS', name:'UPS 및 배터리 시스템 운영', serviceName:'IDC 전력' },{ id:'CF-전기-발전기', name:'비상 발전기 운영', serviceName:'IDC 전력' }], ...DEMO_TAG },
      { team:'기계(냉각)팀', teamId:'TEAM-기계냉각팀', functions:[{ id:'CF-냉각-운영', name:'데이터센터 냉각 시스템 운영', serviceName:'IDC 냉각' },{ id:'CF-냉각-공조', name:'냉동기 및 공조기 운영', serviceName:'IDC 냉각' }], ...DEMO_TAG },
      { team:'SRE/플랫폼운영팀', teamId:'TEAM-sre플랫폼운영팀', functions:[{ id:'CF-sre-플랫폼운영', name:'플랫폼 서비스 운영', serviceName:'플랫폼 공통서비스' },{ id:'CF-sre-장애복구', name:'시스템 장애 대응 및 복구', serviceName:'플랫폼 공통서비스' }], ...DEMO_TAG },
      { team:'네트워크운영팀', teamId:'TEAM-네트워크운영팀', functions:[{ id:'CF-net-운영', name:'데이터센터 네트워크 운영', serviceName:'코어 네트워크' }], ...DEMO_TAG },
      { team:'정보보호팀', teamId:'TEAM-정보보호팀', functions:[{ id:'CF-sec-보안탐지', name:'보안 위협 탐지 및 대응', serviceName:'보안 관제' }], ...DEMO_TAG },
      { team:'DC운영(NOC/관제)팀', teamId:'TEAM-dc운영noc관제팀', functions:[{ id:'CF-noc-관제', name:'데이터센터 통합 모니터링', serviceName:'통합 모니터링' }], ...DEMO_TAG }
    ],
    [KEYS.SERVICE]: [
      { id:'SVC-IDC-POWER', name:'IDC 전력', ownerTeamId:'TEAM-전기팀', ownerTeamName:'전기팀', active:true, criticality:'매우높음', description:'전력 공급 운영', ...DEMO_TAG },
      { id:'SVC-IDC-COOL', name:'IDC 냉각', ownerTeamId:'TEAM-기계냉각팀', ownerTeamName:'기계(냉각)팀', active:true, criticality:'매우높음', description:'냉각 운영', ...DEMO_TAG },
      { id:'SVC-PLATFORM', name:'플랫폼 공통서비스', ownerTeamId:'TEAM-sre플랫폼운영팀', ownerTeamName:'SRE/플랫폼운영팀', active:true, criticality:'높음', description:'플랫폼 운영', ...DEMO_TAG },
      { id:'SVC-SECURITY', name:'보안 관제', ownerTeamId:'TEAM-정보보호팀', ownerTeamName:'정보보호팀', active:true, criticality:'높음', description:'보안 위협 탐지', ...DEMO_TAG }
    ],
    [KEYS.BIA]: [
      { team:'전기팀', isDemo:true, demoLabel:'예시', functions:[
        { name:'데이터센터 전력 공급 운영', importance:'중요', overallImpact:5, impact:5, timeImpact:{immediate:3,min30:4,hour1:5,hour4:5,day1:5,week1:5}, mtpd:'30분', rto:'10분', grade:'핵심', coreFinal:true, requiredResources:['설비','유틸리티','예비부품'], ...DEMO_TAG },
        { name:'UPS 및 배터리 시스템 운영', importance:'중요', overallImpact:5, impact:5, timeImpact:{immediate:2,min30:4,hour1:5,hour4:5,day1:5,week1:5}, mtpd:'30분', rto:'15분', grade:'핵심', coreFinal:true, requiredResources:['설비','유틸리티'], ...DEMO_TAG }
      ]},
      { team:'기계(냉각)팀', isDemo:true, demoLabel:'예시', functions:[
        { name:'데이터센터 냉각 시스템 운영', importance:'중요', overallImpact:5, impact:5, timeImpact:{immediate:2,min30:3,hour1:4,hour4:5,day1:5,week1:5}, mtpd:'1시간', rto:'30분', grade:'핵심', coreFinal:true, requiredResources:['설비','유틸리티'], ...DEMO_TAG }
      ]},
      { team:'SRE/플랫폼운영팀', isDemo:true, demoLabel:'예시', functions:[
        { name:'플랫폼 서비스 운영', importance:'중요', overallImpact:4, impact:4, timeImpact:{immediate:2,min30:3,hour1:4,hour4:5,day1:5,week1:5}, mtpd:'1시간', rto:'30분', grade:'핵심', coreFinal:true, requiredResources:['인력','시스템','데이터'], ...DEMO_TAG }
      ]},
      { team:'네트워크운영팀', isDemo:true, demoLabel:'예시', functions:[
        { name:'데이터센터 네트워크 운영', importance:'중요', overallImpact:4, impact:4, timeImpact:{immediate:2,min30:3,hour1:4,hour4:5,day1:5,week1:5}, mtpd:'1시간', rto:'30분', grade:'핵심', coreFinal:true, requiredResources:['인력','시스템','회선'], ...DEMO_TAG }
      ]},
      { team:'정보보호팀', isDemo:true, demoLabel:'예시', functions:[
        { name:'보안 위협 탐지 및 대응', importance:'중요', overallImpact:4, impact:4, timeImpact:{immediate:3,min30:4,hour1:5,hour4:5,day1:5,week1:5}, mtpd:'30분', rto:'15분', grade:'핵심', coreFinal:true, requiredResources:['인력','시스템','데이터'], ...DEMO_TAG }
      ]},
      { team:'DC운영(NOC/관제)팀', isDemo:true, demoLabel:'예시', functions:[
        { name:'데이터센터 통합 모니터링', importance:'중요', overallImpact:4, impact:4, timeImpact:{immediate:3,min30:4,hour1:5,hour4:5,day1:5,week1:5}, mtpd:'30분', rto:'15분', grade:'핵심', coreFinal:true, requiredResources:['인력','시스템','통신'], ...DEMO_TAG }
      ]}
    ],
    [KEYS.RISK]: [
      { team:'전기팀', isDemo:true, demoLabel:'예시', risks:[
        { function:'데이터센터 전력 공급 운영', risk:'외부전력중단', likelihood:3, impact:5, riskScore:15, riskLevel:'높음', critical:true, ...DEMO_TAG },
        { function:'데이터센터 전력 공급 운영', risk:'UPS 장애', likelihood:4, impact:5, riskScore:20, riskLevel:'높음', critical:true, ...DEMO_TAG },
        { function:'데이터센터 전력 공급 운영', risk:'발전기 미기동', likelihood:2, impact:5, riskScore:10, riskLevel:'보통', critical:false, ...DEMO_TAG }
      ]},
      { team:'기계(냉각)팀', isDemo:true, demoLabel:'예시', risks:[
        { function:'데이터센터 냉각 시스템 운영', risk:'냉동기 고장', likelihood:3, impact:5, riskScore:15, riskLevel:'높음', critical:true, ...DEMO_TAG },
        { function:'데이터센터 냉각 시스템 운영', risk:'냉각수 순환 이상', likelihood:4, impact:5, riskScore:20, riskLevel:'높음', critical:true, ...DEMO_TAG }
      ]},
      { team:'SRE/플랫폼운영팀', isDemo:true, demoLabel:'예시', risks:[
        { function:'플랫폼 서비스 운영', risk:'가상화 호스트 장애', likelihood:4, impact:4, riskScore:16, riskLevel:'높음', critical:true, ...DEMO_TAG },
        { function:'플랫폼 서비스 운영', risk:'잘못된 배포', likelihood:3, impact:4, riskScore:12, riskLevel:'보통', critical:false, ...DEMO_TAG }
      ]},
      { team:'네트워크운영팀', isDemo:true, demoLabel:'예시', risks:[
        { function:'데이터센터 네트워크 운영', risk:'코어 스위치 장애', likelihood:4, impact:4, riskScore:16, riskLevel:'높음', critical:true, ...DEMO_TAG },
        { function:'데이터센터 네트워크 운영', risk:'대외 회선 장애', likelihood:3, impact:4, riskScore:12, riskLevel:'보통', critical:false, ...DEMO_TAG }
      ]},
      { team:'정보보호팀', isDemo:true, demoLabel:'예시', risks:[
        { function:'보안 위협 탐지 및 대응', risk:'관리자 계정 탈취', likelihood:4, impact:4, riskScore:16, riskLevel:'높음', critical:true, ...DEMO_TAG },
        { function:'보안 위협 탐지 및 대응', risk:'랜섬웨어 감염', likelihood:3, impact:4, riskScore:12, riskLevel:'보통', critical:false, ...DEMO_TAG }
      ]},
      { team:'DC운영(NOC/관제)팀', isDemo:true, demoLabel:'예시', risks:[
        { function:'데이터센터 통합 모니터링', risk:'관제 알람 미전파', likelihood:4, impact:4, riskScore:16, riskLevel:'높음', critical:true, ...DEMO_TAG },
        { function:'데이터센터 통합 모니터링', risk:'모니터링 시스템 장애', likelihood:3, impact:4, riskScore:12, riskLevel:'보통', critical:false, ...DEMO_TAG }
      ]}
    ],
    [KEYS.BCP]: [
      { team:'전기팀', isDemo:true, demoLabel:'예시', strategies:[
        { function:'데이터센터 전력 공급 운영', risk:'외부전력중단', riskScore:15, critical:true, importance:'중요', grade:'핵심', mtpd:'30분', rto:'10분', impact:5, coreFinal:true, strategyType:'자원 이중화', strategyText:'발전기 자동전환 및 중요부하 우선공급', requiredResources:['설비','유틸리티','예비부품'], status:'확정', ...DEMO_TAG },
        { function:'데이터센터 전력 공급 운영', risk:'UPS 장애', riskScore:20, critical:true, importance:'중요', grade:'핵심', mtpd:'30분', rto:'10분', impact:5, coreFinal:true, strategyType:'대체 설비', strategyText:'예비 UPS 전환 및 발전기 연계', requiredResources:['설비','유틸리티'], status:'검토중', ...DEMO_TAG }
      ]},
      { team:'기계(냉각)팀', isDemo:true, demoLabel:'예시', strategies:[
        { function:'데이터센터 냉각 시스템 운영', risk:'냉동기 고장', riskScore:15, critical:true, importance:'중요', grade:'핵심', mtpd:'1시간', rto:'30분', impact:5, coreFinal:true, strategyType:'대체 설비', strategyText:'예비 냉동기 투입 및 냉각 부하 분산', requiredResources:['설비','유틸리티'], status:'초안', ...DEMO_TAG }
      ]},
      { team:'SRE/플랫폼운영팀', isDemo:true, demoLabel:'예시', strategies:[
        { function:'플랫폼 서비스 운영', risk:'가상화 호스트 장애', riskScore:16, critical:true, importance:'중요', grade:'핵심', mtpd:'1시간', rto:'30분', impact:4, coreFinal:true, strategyType:'대체 운영', strategyText:'이중화 클러스터로 워크로드 이동', requiredResources:['시스템','데이터','인력'], status:'확정', ...DEMO_TAG }
      ]},
      { team:'네트워크운영팀', isDemo:true, demoLabel:'예시', strategies:[
        { function:'데이터센터 네트워크 운영', risk:'코어 스위치 장애', riskScore:16, critical:true, importance:'중요', grade:'핵심', mtpd:'1시간', rto:'30분', impact:4, coreFinal:true, strategyType:'대체 설비', strategyText:'이중화 코어 전환 및 우회 경로 적용', requiredResources:['시스템','회선','인력'], status:'검토중', ...DEMO_TAG }
      ]},
      { team:'정보보호팀', isDemo:true, demoLabel:'예시', strategies:[
        { function:'보안 위협 탐지 및 대응', risk:'관리자 계정 탈취', riskScore:16, critical:true, importance:'중요', grade:'핵심', mtpd:'30분', rto:'15분', impact:4, coreFinal:true, strategyType:'예방/감축', strategyText:'계정 격리 및 비상 접근통제 적용', requiredResources:['인력','시스템','데이터'], status:'검토중', ...DEMO_TAG }
      ]},
      { team:'DC운영(NOC/관제)팀', isDemo:true, demoLabel:'예시', strategies:[
        { function:'데이터센터 통합 모니터링', risk:'관제 알람 미전파', riskScore:16, critical:true, importance:'중요', grade:'핵심', mtpd:'30분', rto:'15분', impact:4, coreFinal:true, strategyType:'수동 처리', strategyText:'백업 관제 채널 전환 및 수동 상황전파', requiredResources:['인력','통신'], status:'초안', ...DEMO_TAG }
      ]}
    ],
    [KEYS.DRP]: [
      { team:'전기팀', isDemo:true, demoLabel:'예시', procedures:[
        { function:'데이터센터 전력 공급 운영', risk:'UPS 장애', riskScore:20, critical:true, importance:'중요', grade:'핵심', mtpd:'30분', rto:'10분', strategyType:'대체 설비', strategyText:'예비 UPS 전환 및 발전기 연계', triggerCondition:'UPS 장애로 이중화 전환 실패 시', preChecks:['관련 알람 확인','영향 범위 확인','승인권자 연락'], steps:[{stepNo:1,action:'예비 UPS 상태 확인',owner:'전기팀',targetTime:'5분',verification:'예비 UPS 정상 확인'},{stepNo:2,action:'UPS Bypass 전환',owner:'전기팀',targetTime:'10분',verification:'중요부하 유지 확인'},{stepNo:3,action:'발전기 연계 상태 확인',owner:'전기팀',targetTime:'10분',verification:'출력 정상 확인'},{stepNo:4,action:'DC운영팀 상황 전파',owner:'DC운영(NOC/관제)팀',targetTime:'5분',verification:'상황 공유 완료'}], owners:['전기팀','DC운영(NOC/관제)팀'], requiredResources:['설비','유틸리티'], completionCriteria:'주요 전력 경보 해제 및 중요부하 정상 유지 확인', status:'검토중', notes:'', ...DEMO_TAG }
      ]},
      { team:'기계(냉각)팀', isDemo:true, demoLabel:'예시', procedures:[
        { function:'데이터센터 냉각 시스템 운영', risk:'냉동기 고장', riskScore:15, critical:true, importance:'중요', grade:'핵심', mtpd:'1시간', rto:'30분', strategyType:'대체 설비', strategyText:'예비 냉동기 투입 및 냉각 부하 분산', triggerCondition:'주요 냉동기 정지 및 대체설비 즉시 가동 필요 시', preChecks:['냉각 알람 확인','영향 존 확인'], steps:[{stepNo:1,action:'예비 냉동기 투입 준비',owner:'기계(냉각)팀',targetTime:'10분',verification:'대체설비 준비 완료'},{stepNo:2,action:'냉각 부하 분산',owner:'기계(냉각)팀',targetTime:'10분',verification:'주요 구역 온도 상승 억제'},{stepNo:3,action:'DC운영팀과 상황 공유',owner:'DC운영(NOC/관제)팀',targetTime:'5분',verification:'공유 완료'}], owners:['기계(냉각)팀','DC운영(NOC/관제)팀'], requiredResources:['설비','유틸리티'], completionCriteria:'주요 구역 온도 정상 범위 회복', status:'초안', notes:'', ...DEMO_TAG }
      ]},
      { team:'SRE/플랫폼운영팀', isDemo:true, demoLabel:'예시', procedures:[
        { function:'플랫폼 서비스 운영', risk:'가상화 호스트 장애', riskScore:16, critical:true, importance:'중요', grade:'핵심', mtpd:'1시간', rto:'30분', strategyType:'대체 운영', strategyText:'이중화 클러스터로 워크로드 이동', triggerCondition:'주요 호스트 장애로 서비스 이중화 전환 필요 시', preChecks:['영향 VM 확인','클러스터 상태 확인'], steps:[{stepNo:1,action:'장애 호스트 격리',owner:'SRE/플랫폼운영팀',targetTime:'5분',verification:'장애 호스트 분리 완료'},{stepNo:2,action:'워크로드 이관',owner:'SRE/플랫폼운영팀',targetTime:'10분',verification:'대체 노드 정상 구동'},{stepNo:3,action:'서비스 상태 확인',owner:'애플리케이션운영팀',targetTime:'10분',verification:'서비스 정상 응답 확인'}], owners:['SRE/플랫폼운영팀','애플리케이션운영팀'], requiredResources:['시스템','데이터','인력'], completionCriteria:'핵심 서비스 정상 응답 및 모니터링 지표 안정화', status:'확정', notes:'', ...DEMO_TAG }
      ]}
    ]
  };

  function parse(raw, fb){ try{ return JSON.parse(raw); }catch(e){ return fb; } }
  function getArr(key){ const v = parse(localStorage.getItem(key) || '[]', []); return Array.isArray(v) ? v : []; }
  function setArr(key, arr){
    if (window.DataStore && key === KEYS.BIA && typeof DataStore.writeBiaRecords === 'function' && typeof DataStore.readBiaRecords === 'function') {
      localStorage.setItem(key, JSON.stringify(arr));
      DataStore.writeBiaRecords(DataStore.readBiaRecords());
      if (typeof DataStore.syncRiskWithBia === 'function') DataStore.syncRiskWithBia(DataStore.readBiaRecords());
      return;
    }
    if (window.DataStore && key === KEYS.RISK && typeof DataStore.writeRiskRecords === 'function' && typeof DataStore.readRiskRecords === 'function') {
      localStorage.setItem(key, JSON.stringify(arr));
      DataStore.writeRiskRecords(DataStore.readRiskRecords());
      return;
    }
    if (window.DataStore && key === KEYS.SERVICE && typeof DataStore.writeServices === 'function') {
      DataStore.writeServices(arr);
      return;
    }
    localStorage.setItem(key, JSON.stringify(arr));
  }

  function isEmptyKey(key){ return getArr(key).length === 0; }
  function allMainEmpty(){ return [KEYS.BIA, KEYS.RISK, KEYS.BCP, KEYS.DRP].every(isEmptyKey); }

  function marker(item){ return !!(item && (item.isDemo === true || item.demoLabel === '예시')); }

  function removeDemoFromList(key, list){
    if(key === KEYS.BIA){
      return list.map((teamRow)=>({ ...teamRow, functions:(teamRow.functions||[]).filter((f)=>!marker(f)) })).filter((x)=>!marker(x) && (x.functions||[]).length);
    }
    if(key === KEYS.RISK){
      return list.map((teamRow)=>({ ...teamRow, risks:(teamRow.risks||[]).filter((r)=>!marker(r)) })).filter((x)=>!marker(x) && (x.risks||[]).length);
    }
    if(key === KEYS.BCP){
      return list.map((teamRow)=>({ ...teamRow, strategies:(teamRow.strategies||[]).filter((s)=>!marker(s)) })).filter((x)=>!marker(x) && (x.strategies||[]).length);
    }
    if(key === KEYS.DRP){
      return list.map((teamRow)=>({ ...teamRow, procedures:(teamRow.procedures||[]).filter((p)=>!marker(p)) })).filter((x)=>!marker(x) && (x.procedures||[]).length);
    }
    return list.filter((x)=>!marker(x));
  }

  function idKey(key, obj){
    if(key === KEYS.CORE) return `${obj.team}`;
    if(key === KEYS.BIA || key === KEYS.RISK) return `${obj.team}`;
    if(key === KEYS.BCP || key === KEYS.DRP) return `${obj.team}`;
    return JSON.stringify(obj);
  }

  function mergeByTeamList(key, current, demo) {
    const map = new Map();
    current.forEach((x)=>map.set(idKey(key,x), JSON.parse(JSON.stringify(x))));
    for(const d of demo){
      const k = idKey(key,d);
      if(!map.has(k)){ map.set(k, JSON.parse(JSON.stringify(d))); continue; }
      const base = map.get(k);
      const prop = key===KEYS.BIA?'functions':key===KEYS.RISK?'risks':key===KEYS.BCP?'strategies':key===KEYS.DRP?'procedures':null;
      if(!prop){ continue; }
      const exist = Array.isArray(base[prop]) ? base[prop] : [];
      const add = Array.isArray(d[prop]) ? d[prop] : [];
      const ekeys = new Set(exist.map((i)=>`${i.function||i.name||''}||${i.risk||''}`));
      for(const i of add){
        const ik = `${i.function||i.name||''}||${i.risk||''}`;
        if(!ekeys.has(ik)) exist.push(JSON.parse(JSON.stringify(i)));
      }
      base[prop] = exist;
    }
    return [...map.values()];
  }

  function loadDemo(options){
    const force = !!(options && options.force);
    const apply = force || allMainEmpty();
    if(!apply) return false;

    Object.values(KEYS).forEach((key)=>{
      const current = removeDemoFromList(key, getArr(key));
      const demo = DEMO[key] || [];
      let next;
      if(key === KEYS.CORE) {
        const teams = new Set(current.map((x)=>x.team));
        next = [...current, ...demo.filter((d)=>!teams.has(d.team))];
      } else {
        next = mergeByTeamList(key, current, demo);
      }
      setArr(key, next);
    });
    return true;
  }

  function removeDemo(){
    Object.values(KEYS).forEach((key)=> setArr(key, removeDemoFromList(key, getArr(key))));
  }

  function hasDemo(){
    return Object.values(KEYS).some((key)=> getArr(key).some((x)=> marker(x) || ['functions','risks','strategies','procedures'].some((p)=>Array.isArray(x[p]) && x[p].some(marker))));
  }

  function mountBanner(targetSelector){
    const root = document.querySelector(targetSelector || '.wrap');
    if(!root) return;
    const box = document.createElement('div');
    box.style.cssText = 'margin-bottom:12px;padding:10px 12px;border:1px solid rgba(59,130,246,.35);background:rgba(59,130,246,.09);border-radius:12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;';
    const msg = document.createElement('span');
    msg.style.cssText = 'font-size:13px;font-weight:800;color:#1e3a8a;';
    const btnLoad = document.createElement('button');
    btnLoad.type='button'; btnLoad.textContent='예시 데이터 다시 불러오기';
    btnLoad.style.cssText='padding:6px 10px;border-radius:999px;border:1px solid rgba(37,99,235,.35);background:#fff;color:#1d4ed8;font-size:12px;font-weight:900;cursor:pointer;';
    const btnRm = document.createElement('button');
    btnRm.type='button'; btnRm.textContent='예시 데이터 제거';
    btnRm.style.cssText='padding:6px 10px;border-radius:999px;border:1px solid rgba(239,68,68,.35);background:#fff;color:#991b1b;font-size:12px;font-weight:900;cursor:pointer;';

    const refreshText = ()=>{
      msg.textContent = '샘플 데이터가 로드되어 있습니다. 실제 데이터 입력 후 샘플을 제거하세요.';
    };
    btnLoad.addEventListener('click', ()=>{ loadDemo({force:true}); location.reload(); });
    btnRm.addEventListener('click', ()=>{ removeDemo(); location.reload(); });
    refreshText();
    box.append(msg, btnLoad, btnRm);
    root.prepend(box);
  }

  window.BCMSDemoSeed = {
    KEYS,
    ensureDemoIfEmpty: () => loadDemo({force:false}),
    loadDemo: () => loadDemo({force:true}),
    removeDemo,
    hasDemo,
    mountBanner
  };
})();
