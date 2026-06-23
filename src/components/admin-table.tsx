export function AdminTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-brand-line text-stone-500">
            {headers.map((header) => (
              <th key={header} className="py-3 pr-4 font-bold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.join("-")}-${index}`} className="border-b border-brand-line">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="py-3 pr-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
