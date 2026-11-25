import { carePaths } from './care-urls';

export const proposalEdition = {
  version: '2.5',
  issuedOn: '2026-11-25',
  pdfPath: '/overview/danyeon-healthcare-v2.5.pdf',
};

type ProposalPage = {
  id: string;
  label: string;
  title: string;
  description: string;
  points?: {title:string;description:string}[];
  sequence?: string[];
  screen?: {file:string; width:number; height:number; alt:string};
  note?: string;
};

export const healthcareProposal: ProposalPage[] = [
  {
    id:'product',label:'상품 정의',title:'병원을 다녀온 후에도, 환자관리는 이어집니다.',
    description:'다녀온은 수술·시술 후 환자의 회복기록과 병원의 확인, 조치, 후속관리를 연결하는 의료기관용 솔루션입니다.',
    points:[
      {title:'환자',description:'병원에서 받은 링크로 회복 상태를 기록합니다.'},
      {title:'의료기관',description:'응답을 확인하고 환자별 후속 업무를 이어갑니다.'},
    ],
    screen:{file:'desk',width:1152,height:560,alt:'다녀온 데스크의 회복관리 목록과 업무 상태'},
  },
  {
    id:'patient-management-problem',label:'환자관리 문제',title:'진료가 끝난 뒤에도 병원에는 업무가 남습니다.',
    description:'다음 진료 전에는 환자 상태를 확인할 정보가 부족합니다. 전화와 메모를 오가면 지난 확인 내용과 다음 담당 업무를 함께 찾기 어렵습니다.',
    points:[
      {title:'환자 응답',description:'연락이 닿지 않았는지, 상태를 아직 확인하지 않았는지 구별해야 합니다.'},
      {title:'담당자 인계',description:'누가 무엇을 확인했고 언제 다시 연락할지 다음 담당자가 알아야 합니다.'},
      {title:'운영 확인',description:'누락된 후속관리와 처리 상태를 파악할 기준이 필요합니다.'},
    ],
  },
  {
    id:'solution',label:'해결 방식',title:'회복기록을 병원의 다음 업무로 연결합니다.',
    description:'환자는 앱을 설치하지 않고 회복 상태를 기록합니다. 병원은 답변과 미응답을 확인하고, 필요한 조치와 다음 확인 시점을 환자별로 기록합니다.',
    sequence:['회복기록 수집','담당자 확인','조치 기록','후속 확인'],
    note:'체크인은 응급상황을 실시간으로 감시하지 않습니다. 의료 판단과 안내는 의료기관의 절차를 따릅니다.',
  },
  {
    id:'platform',label:'상품 구조',title:'하나의 환자관리 흐름에 필요한 기능을 연결합니다.',
    description:'프로그램은 질문과 관리 주기를 정하고, 체크·데스크·인사이트는 환자와 담당자의 일을 연결합니다.',
    points:[
      {title:'다녀온 프로그램',description:'치료별 질문, 기간, 일정, 승인 버전을 설정하는 기능이 구현되어 있으며 합성 데모에서 검증합니다.'},
      {title:'다녀온 체크',description:'병원 링크로 환자 체크인과 회복기록 조회를 제공합니다.'},
      {title:'다녀온 데스크',description:'응답 확인, 조치, 후속관리와 담당 업무를 연결합니다.'},
      {title:'다녀온 인사이트',description:'응답과 확인, 후속관리 상태를 기간별로 확인합니다.'},
    ],
  },
  {
    id:'crm',label:'환자관리 CRM',title:'환자별 회복기록과 관리 이력을 함께 살핍니다.',
    description:'환자가 남긴 회복기록을 시간순으로 확인할 수 있습니다. 병원 담당자는 확인한 내용과 조치를 해당 환자의 업무에 남깁니다.',
    screen:{file:'history',width:780,height:1075,alt:'합성 환자의 날짜별 통증 추이와 회복기록'},
    note:'통합 상담 채널, 마케팅 CRM, 외부 고객 데이터 통합은 확장 검토 범위입니다.',
  },
  {
    id:'desk',label:'의료기관 업무관리',title:'오늘 확인할 응답과 남은 업무를 한 화면에서 봅니다.',
    description:'담당자가 미응답 환자와 확인할 내용을 찾고 연락·조치·후속 일정을 기록합니다. 응답 제출과 담당자 확인을 별도 상태로 표시합니다.',
    screen:{file:'response',width:1094,height:405,alt:'예시 환자의 원본 응답과 담당 업무 상세 화면'},
  },
  {
    id:'schedule',label:'예약 및 일정관리',title:'다음에 누구를 확인할지 기록하고 이어받습니다.',
    description:'환자별 후속 확인 예정일을 정하고 업무 목록에서 처리 상태를 확인합니다.',
    screen:{file:'followup',width:1152,height:420,alt:'다녀온 데스크의 후속 확인 일정 목록'},
    note:'실제 진료 예약 자동화, 외부 캘린더·EMR 연동은 확장 검토 항목입니다.',
  },
  {
    id:'insights',label:'반복 업무와 인사이트',title:'반복되는 확인 업무를 추적하고 운영 상태를 봅니다.',
    description:'응답률과 담당자 확인, 후속관리 상태를 기간별 리포트로 확인하고 병원 범위에서 내려받을 수 있습니다.',
    screen:{file:'insights',width:1094,height:460,alt:'합성 데이터의 등록 환자와 응답률을 표시한 운영 리포트'},
    note:'화면 수치는 합성 데이터 예시입니다. 자동 발송, AI 상담, 위험 예측 기능은 현재 상품 소개에 포함하지 않습니다.',
  },
  {
    id:'workflow',label:'실제 이용 프로세스',title:'등록에서 후속관리까지 한 번의 업무 흐름으로.',
    description:'담당자가 환자와 관리 프로그램을 등록하고, 환자는 병원 링크에서 회복 상태를 기록합니다. 담당자가 응답을 확인한 뒤 다음 확인 일정을 남깁니다.',
    sequence:['환자 등록','링크 안내와 체크인','응답 확인과 조치','일정 관리와 종료'],
    screen:{file:'checkin',width:780,height:990,alt:'환자용 다녀온 체크의 통증 입력 예시'},
  },
  {
    id:'specialties',label:'진료과별 활용',title:'치료별 회복관리 프로그램으로 확장할 수 있습니다.',
    description:'관절·척추 수술 후 정형외과 흐름을 대표로 시연합니다. 의료기관 업무와 의료진 검토에 따라 프로그램을 설계합니다.',
    points:[
      {title:'정형외과 · 대표 데모',description:'관절·척추 수술 후 회복기록과 담당자 확인을 시연합니다.'},
      {title:'안과 · 확장 검토',description:'백내장 등 수술 후 업무 흐름과 관리 요구를 확인합니다.'},
      {title:'외과 · 도입 상담',description:'과별 후속 확인 절차와 필요한 프로그램을 상담합니다.'},
      {title:'기타 수술·시술 · 수요 검토',description:'반복적인 후속 확인이 필요한 치료부터 업무를 검토합니다.'},
    ],
  },
  {
    id:'implementation',label:'도입 절차와 보안',title:'병원 업무를 확인하고 작은 범위부터 시작합니다.',
    description:'담당자와 확인 시간을 정한 뒤 의료진 검토를 거친 질문과 관리 주기를 설정합니다. 도입 범위, 개인정보 처리와 운영 절차는 기관별로 검토합니다.',
    sequence:['현재 업무 확인','프로그램과 담당자 설정','검증과 단계별 적용'],
    points:[
      {title:'접근 범위',description:'의료기관·직원 역할과 환자별 권한을 확인합니다.'},
      {title:'업무 이력',description:'확인과 조치 이력을 기록하며 데모는 합성 데이터로 진행합니다.'},
    ],
  },
  {
    id:'next-step',label:'제품 체험과 도입 문의',title:'우리 병원의 환자관리 흐름을 함께 검토하세요.',
    description:'정형외과 합성 데이터 시연에서 환자 체크인부터 병원 후속관리까지 확인할 수 있습니다.',
    points:[
      {title:'제품 체험',description:'시연에서 현재 지원하는 기능과 실제 업무 흐름을 확인합니다.'},
      {title:'병원 도입 문의',description:'의료기관 유형과 진료과, 관리 대상 환자와 담당 업무를 알려 주세요.'},
    ],
    note:'문의와 시연 요청에는 환자정보를 입력하지 마세요.',
  },
];

export const publicBusinessTopics = [
  {title:'사업 비전',description:'수술·시술 이후에도 환자의 회복기록이 병원의 업무로 이어지는 서비스를 만듭니다.'},
  {title:'고객 문제',description:'전화, 메모, 재확인에 나뉜 사후관리 업무의 누락과 인계를 줄이는 것이 목표입니다.'},
  {title:'시장 기회',description:'회복 확인이 반복되는 의료기관에서 독립적인 사후관리 흐름에 대한 구매 의사를 검증합니다.'},
  {title:'제품과 해결 방식',description:'치료 프로그램에 따라 환자가 기록하고, 담당자가 응답 확인부터 후속 확인까지 한 흐름으로 처리합니다.'},
  {title:'사업모델',description:'의료기관이 도입하는 B2B2C SaaS입니다. 파일럿에서 운영 범위와 구매 의사를 함께 검증합니다.'},
  {title:'비교 관점',description:'상담·재진 관리와 비대면진료에는 다양한 제품이 있습니다. 다녀온은 수술·시술 후 반복되는 회복 확인과 담당자 업무에 집중합니다.',sources:[{name:'애프터닥 공개 소개',href:'https://www.afterdoc.ai/'},{name:'솔닥 파트너스 공개 소개',href:'https://soldoc.co.kr/partners'}]},
  {title:'초기 고객군',description:'관절·척추 정형외과, 중소형 수술 특화 병원과 수술 중심 의원부터 검토합니다.'},
  {title:'시장 진입',description:'현장 인터뷰, 합성 데이터 시연, 기관별 파일럿 협의를 통해 반복 가능한 도입 절차를 검증합니다.'},
  {title:'기술 아키텍처',description:'공통 업무 플랫폼과 버전별 치료 프로그램을 분리합니다. 의료기관 권한과 환자별 접근 범위를 적용합니다.'},
  {title:'개발과 검증',description:'회복 체크인, 병원 업무, 후속관리, 운영 리포트의 흐름을 합성 데이터로 검증합니다.'},
  {title:'성장 방향',description:'기존 진료과에서 사용성을 확인한 뒤, 치료 프로그램과 기관별 운영 지원 범위를 확대합니다.'},
  {title:'창업팀과 제휴 방향',description:'의료기관 운영 책임자와 업무 적합성을 검토하고, 의료 및 채널 제휴는 기관별 협의로 진행합니다.'},
];

export const businessContactOptions = {
  partnership: { title:'사업 제휴 문의', path:carePaths.partnershipInquiry },
  investment: { title:'투자 및 상세자료 요청', path:carePaths.investmentInquiry },
} as const;

