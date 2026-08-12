export type GardenState = "starting" | "settling" | "growing" | "stable";
export type GardenViewModel = { state: GardenState; title: string; message: string; visualStage: 1|2|3|4; symbols: string[] };

export function getGardenState(input:{baselineActivityRatio:number;recentTrend:"down"|"steady"|"up";rhythmStability:number}):GardenState{
  const score=input.baselineActivityRatio*.65+input.rhythmStability*.25+(input.recentTrend==="up"?10:input.recentTrend==="down"?-4:4);
  if(score<45)return "starting"; if(score<65)return "settling"; if(score<85)return "growing"; return "stable";
}

const views:Record<GardenState,GardenViewModel>={
  starting:{state:"starting",title:"작은 새싹이 자리를 잡고 있어요.",message:"집에서의 생활을 천천히 시작하고 있어요.",visualStage:1,symbols:["🌱","🌿"]},
  settling:{state:"settling",title:"잎이 조금씩 자라고 있어요.",message:"생활 흐름이 조금씩 자리 잡고 있어요.",visualStage:2,symbols:["🌱","🌿","☘️"]},
  growing:{state:"growing",title:"정원에 작은 꽃이 피었어요.",message:"평소 생활에 조금 더 가까워지고 있어요.",visualStage:3,symbols:["🌿","🌼","☘️","🌱"]},
  stable:{state:"stable",title:"정원이 한층 풍성해졌어요.",message:"평소 생활 흐름에 많이 가까워졌어요.",visualStage:4,symbols:["🌿","🌷","🌼","☘️","🌱"]},
};
export function getGardenView(input:{baselineActivityRatio:number;recentTrend:"down"|"steady"|"up";rhythmStability:number}){return views[getGardenState(input)]}

// 기존 farm 성장값을 삭제하지 않고 정원 단계의 보조 입력으로 변환한다.
export function gardenFromLegacyPercent(percent:number){return getGardenView({baselineActivityRatio:Math.max(30,Math.min(100,percent)),recentTrend:"steady",rhythmStability:80})}
