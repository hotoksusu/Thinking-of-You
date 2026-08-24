import assert from "node:assert/strict";
import {evaluatePatientStatus} from "../src/lib/status-rules.ts";
const base={id:"c",patientId:"p",date:"2026-08-24",concernText:"",createdAt:new Date().toISOString()};
assert.equal(evaluatePatientStatus({...base,pain:0,mobility:1,hasConcern:false}).level,"stable");
assert.equal(evaluatePatientStatus({...base,pain:2,mobility:1,hasConcern:false}).level,"watch");
assert.equal(evaluatePatientStatus({...base,pain:3,mobility:2,hasConcern:false}).level,"needs_attention");
assert.equal(evaluatePatientStatus({...base,pain:1,mobility:1,hasConcern:true}).level,"needs_attention");
console.log("evaluatePatientStatus: 4 cases passed");
