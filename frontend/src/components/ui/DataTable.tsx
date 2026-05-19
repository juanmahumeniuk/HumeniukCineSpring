import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string | number
  actions?: (row: T) => ReactNode
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  actions,
}: DataTableProps<T>) {
  return (
    <div className="glass-card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted ${
                    col.className ?? ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.03]"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-4 align-middle text-[13.5px] text-white/90 ${
                      col.className ?? ''
                    }`}
                  >
                    {col.render(row)}
                  </td>
                ))}
                {actions && (
                  <td className="px-5 py-4 text-right">{actions(row)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
