export const BODY_PARTS=["무릎","고관절","척추","어깨","골반","대퇴/허벅지","하퇴/종아리","발목","발","상완","팔꿈치","전완","손목","손","기타"] as const;
export const PROCEDURES:Record<string,string[]>={무릎:["인공관절 전치환","인공관절 부분치환","관절경 수술","반월상연골 수술","인대 수술","골절 수술"],고관절:["인공관절 전치환","인공관절 반치환","골절 수술","관절경"],척추:["경추 수술","요추 수술","감압술","유합술","디스크 관련 수술","내시경 척추수술","척추 골절 수술"],어깨:["회전근개 관련 수술","관절경 수술","인공관절","골절 수술"]};
export const CONCERNS=["swelling","fever","incision_discomfort","numbness","walking","medication","dizziness","fall","other"] as const;

