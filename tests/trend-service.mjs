import assert from "node:assert/strict";
import {getPainTrend,getMobilityTrend,getConcernTimeline} from "../src/services/trend.ts";
const checks=[
  {id:"1",patientId:"p",date:"2026-08-21",painScore:5,mobilityScore:2,hasConcern:false,concerns:[],createdAt:"2026-08-21T00:00:00Z"},
  {id:"2",patientId:"p",date:"2026-08-22",painScore:null,mobilityScore:null,hasConcern:true,concerns:["swelling"],createdAt:"2026-08-22T00:00:00Z"},
  {id:"3",patientId:"p",date:"2026-08-23",painScore:7,mobilityScore:3,hasConcern:false,concerns:[],createdAt:"2026-08-23T00:00:00Z"},
];
assert.deepEqual(getPainTrend(checks).recentValues,[5,7]);
assert.equal(getPainTrend(checks).delta,2);
assert.deepEqual(getMobilityTrend(checks).recentValues,[2,3]);
assert.equal(getConcernTimeline(checks).find(x=>x.concerns.length)?.concerns[0],"swelling");
console.log("PASS trend service: missing values are not coerced to zero");
