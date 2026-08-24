import type { PatientEpisode } from "@/domain/care-events";
import {getMobilityTrend,getPainTrend,type TrendInput} from "@/services/trend";
export function getRecoveryFeatures(episode:PatientEpisode,events:TrendInput[],asOf:string){const pain=getPainTrend(events),mobility=getMobilityTrend(events),day=(a:string,b:string)=>Math.max(0,Math.floor((Date.parse(`${b}T12:00:00Z`)-Date.parse(`${a}T12:00:00Z`))/86400000));return{painLatest:pain.latestValue,painDelta1d:pain.delta,painRecentValues:pain.recentValues,mobilityLatest:mobility.latestValue,mobilityDelta:mobility.delta,concernCount:events.at(-1)?.concerns?.length??0,daysSinceSurgery:day(episode.surgeryDate,asOf),daysSinceDischarge:day(episode.dischargeDate,asOf),missedCheckInCount:null}}

