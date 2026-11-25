const productionOrigin = new URL(process.env.NEXT_PUBLIC_CARE_SITE_ORIGIN || 'https://danyeon.yos1015.chatgpt.site').origin;
const developmentOrigin = new URL(process.env.NEXT_PUBLIC_CARE_DEV_ORIGIN || 'http://localhost:3000').origin;
const demoOrigin = new URL(process.env.NEXT_PUBLIC_CARE_DEMO_ORIGIN || 'http://127.0.0.1:3310').origin;
const origin = process.env.NEXT_PUBLIC_CARE_DEMO === 'local' ? demoOrigin
  : process.env.NODE_ENV === 'development' ? developmentOrigin : productionOrigin;

export const carePaths = {
  home: '/', patient: '/patient', invitation: '/i', desk: '/care/server',
  hospitalLogin: '/hospital/login', hospitalSupport: '/hospital/support',
  admin: '/admin', adminLogin: '/admin/login',
  demo: '/demo', inquiry: '/pilot', help: '/help', privacy: '/settings/privacy', carePrivacy: '/care/privacy',
  company: '/company', familyInvitation: '/parent-start',
};

const returnToDesk = '?return_to=' + encodeURIComponent(carePaths.desk);

export const careUrls = {
  origin, productionOrigin, developmentOrigin, demoOrigin,
  canonical: new URL(carePaths.home, origin).href,
  shareOrigin: origin,
  invitationBase: new URL(carePaths.invitation, origin).href,
  signIn: '/signin-with-chatgpt' + returnToDesk,
  signOut: '/signout-with-chatgpt' + returnToDesk,
};
