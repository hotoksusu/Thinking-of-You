import { adoptionStates, departments, organizationTypes, type OrganizationFields } from '@/lib/recovery-program';

const inputClass = 'mt-1 block min-h-12 w-full rounded-xl border p-3';

export function readOrganizationFields(form: FormData) {
  return { ...Object.fromEntries(form), departments: form.getAll('departments') };
}

export function CareOrganizationFields({ value, operator }: { value?:OrganizationFields; operator:boolean }) {
  return <fieldset className="grid gap-3 rounded-xl border p-3">
    <legend className="px-2 font-bold">의료기관 정보</legend>
    <label>의료기관 유형<select name="organizationType" defaultValue={value?.organizationType || ''} className={inputClass}>
      <option value="">선택 안 함</option>{organizationTypes.map(type=><option key={type}>{type}</option>)}
    </select></label>
    <label>주요 진료과<select name="primaryDepartment" defaultValue={value?.primaryDepartment || ''} className={inputClass}>
      <option value="">선택 안 함</option>{departments.map(department=><option key={department}>{department}</option>)}
    </select></label>
    <details>
      <summary className="min-h-11 cursor-pointer font-bold">추가 진료과 선택</summary>
      <div className="grid grid-cols-2 gap-2">
        {departments.map(department=><label key={department} className="flex min-h-11 items-center gap-2"><input type="checkbox" name="departments" value={department} defaultChecked={value?.departments?.includes(department) && department!==value.primaryDepartment}/>{department}</label>)}
      </div>
    </details>
    <label>도입 담당자<input className={inputClass} name="contactName" maxLength={60} defaultValue={value?.contactName}/></label>
    <label>담당자 업무용 이메일<input className={inputClass} type="email" name="contactEmail" maxLength={200} defaultValue={value?.contactEmail}/></label>
    <label>월간 회복관리 대상 환자 수 (선택)<input className={inputClass} type="number" min={0} max={100000} name="monthlyPatients" defaultValue={value?.monthlyPatients}/></label>
    {operator && <label>도입 상태<select className={inputClass} name="adoptionStatus" defaultValue={value?.adoptionStatus || '도입 검토'}>
      {adoptionStates.map(state=><option key={state}>{state}</option>)}
    </select></label>}
  </fieldset>;
}
