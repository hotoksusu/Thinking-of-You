import assert from 'node:assert/strict';
import {test} from 'node:test';
import {monthlyCareReport, previousMonth} from '../src/lib/monthly-care-report.ts';

test('monthly care metrics respect tenant, period, duplicates, cancellation and previous month', () => {
  const state = {
    patients: [{id: 'p', hospitalId: 'h', name: '환자', dischargeDate: '2026-01-30'}, {id: 'foreign', hospitalId: 'other', dischargeDate: '2026-01-01'}],
    checkIns: [
      {patientId: 'p', date: '2026-01-30', createdAt: '2026-01-30', painScore: 7, pain: 3, mobility: 1},
      {patientId: 'p', date: '2026-01-31', createdAt: '2026-01-31', painScore: 3, pain: 1, mobility: 1},
      {patientId: 'p', date: '2026-01-31', createdAt: '2026-01-31T12:00', painScore: 2, pain: 1, mobility: 1},
      {patientId: 'foreign', date: '2026-01-30', createdAt: '2026-01-30', pain: 3, mobility: 3},
    ],
    careActions: [{patientId: 'p', hospitalId: 'h', createdAt: '2026-01-31', status: 'completed'}, {patientId: 'p', hospitalId: 'h', createdAt: '2026-01-31', status: 'cancelled'}, {patientId: 'p', hospitalId: 'h', createdAt: '2026-02-01', status: 'completed'}],
    followUps: [{patientId: 'p', hospitalId: 'h', createdAt: '2026-01-30', followUpDueDate: '2026-02-01'}, {patientId: 'p', hospitalId: 'h', createdAt: '2026-01-30'}],
  };
  const jan = monthlyCareReport(state, 'h', '2026-01', '2026-02-02');
  assert.equal(jan.current.patients, 1); assert.equal(jan.current.expected, 2);
  assert.equal(jan.current.responses, 2); assert.equal(jan.current.responseRate, 100);
  assert.equal(jan.current.recoveryChange, -5); assert.equal(jan.current.actions, 1);
  assert.equal(jan.current.followUps, 0); assert.equal(jan.current.priorityPatients.length, 1);
  const feb = monthlyCareReport(state, 'h', '2026-02', '2026-02-02');
  assert.equal(feb.current.followUps, 1); assert.equal(feb.previous.responseRate, 100);
  assert.equal(feb.current.expected, 2); assert.equal(feb.current.responseRate, 0);
  assert.equal(previousMonth('2026-01'), '2025-12');
  assert.throws(() => monthlyCareReport(state, 'h', '2026-03', '2026-02-02'));
  assert.throws(() => monthlyCareReport(state, 'h', '2026-13', '2026-02-02'));
});

test('empty periods and completed care never fabricate rates or recovery values', () => {
  const state = {patients: [{id: 'p', hospitalId: 'h', name: '환자', dischargeDate: '2026-01-01'}], checkIns: [], careActions: [], followUps: [], careCompletions: [{patientId: 'p', completedAt: '2026-01-02'}]};
  const jan = monthlyCareReport(state, 'h', '2026-01', '2026-02-02');
  assert.equal(jan.current.expected, 2); assert.equal(jan.current.recoveryChange, null);
  const feb = monthlyCareReport(state, 'h', '2026-02', '2026-02-02');
  assert.equal(feb.current.patients, 0); assert.equal(feb.current.responseRate, null);
});
