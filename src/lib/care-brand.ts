const siteOrigin = 'https://oneul-anbu.yos1015.chatgpt.site';
const contact = { inquiry: '/pilot', help: '/help', privacy: '/settings/privacy' };

const previousBrand = {
  name: '오늘안부 Care', shortName: '오늘안부', englishName: 'Oneul Anbu Care',
  slogan: '퇴원 후 회복·안심관리', subtitle: '퇴원 후에도 병원과 함께',
  description: '퇴원 후 환자의 일상 변화를 살펴보고 필요한 순간 병원과 환자를 다시 연결합니다.',
  englishDescription: 'Recovery Management Platform',
  colors: { primary: '#245FD2', navy: '#194BAE', soft: '#F5F8FC', ink: '#16243A', muted: '#526176', white: '#FFFFFF' },
  logo: '/icons/oneul-anbu-icon-192.png', favicon: '/icons/favicon-v2.ico', icon192: '/icons/oneul-anbu-icon-192.png', icon512: '/icons/oneul-anbu-icon-512.png', apple: '/icons/oneul-anbu-apple-touch-icon.png',
  og: { image: '/og.png', title: '퇴원 후에도 병원과 함께', description: '퇴원 후 사라지는 병원과 환자의 연결을 이어갑니다.' },
  manifest: '/manifest.json', siteOrigin, contact,
};

const danyeon = {
  name: '다녀온', shortName: '다녀온', englishName: 'DANYEON',
  slogan: '병원을 다녀온 후에도.', subtitle: '진료 이후에도 이어지는 회복관리',
  description: '의료기관을 위한 회복관리 전문 SaaS',
  englishDescription: 'Post-Treatment Recovery Management Platform',
  colors: { primary: '#2455CD', navy: '#183A86', soft: '#EFF4FD', ink: '#182230', muted: '#64748B', white: '#FFFFFF' },
  logo: '/brand/danyeon.svg', favicon: '/brand/danyeon.svg', icon192: '/brand/danyeon-192.png', icon512: '/brand/danyeon-512.png', apple: '/brand/danyeon-192.png',
  og: { image: '/brand/danyeon-og.png', title: '병원을 다녀온 후에도.', description: '환자의 회복 기록부터 의료진의 확인과 후속 조치까지 한 곳에서 관리하세요.' },
  manifest: '/manifest.webmanifest', siteOrigin, contact,
};

const requestedBrand = process.env.NEXT_PUBLIC_CARE_BRAND;
export const isDanyeon = requestedBrand !== 'legacy';
export const careBrand = isDanyeon ? danyeon : previousBrand;
export const careProducts = {
  check: { name: careBrand.shortName + ' 체크', english: careBrand.englishName + ' CHECK' },
  desk: { name: careBrand.shortName + ' 데스크', english: careBrand.englishName + ' DESK' },
  insights: { name: careBrand.shortName + ' 인사이트', english: careBrand.englishName + ' INSIGHT' },
  program: { name: careBrand.shortName + ' 프로그램', english: careBrand.englishName + ' PROGRAM' },
};
const localDemo = isDanyeon && process.env.NEXT_PUBLIC_CARE_DEMO === 'local';
export const careDemo = { development: process.env.NODE_ENV === 'development', local: localDemo, available: localDemo || process.env.NODE_ENV === 'development', entry: '/demo' };
export const emergencyNotice = '이 서비스는 응급상황을 실시간으로 감시하지 않습니다. 긴급한 증상은 즉시 의료기관 또는 119에 도움을 요청하세요.';
export const staffSmsPreview = careBrand.name + ' 확인할 업무가 있습니다. 병원 담당자 화면을 확인해주세요.';
export const staffEmailPreview = {
  subject: '[' + careBrand.name + '] 회복관리 업무 안내',
  body: '등록된 병원 담당자 화면에서 회복관리 업무를 확인해주세요.',
};
