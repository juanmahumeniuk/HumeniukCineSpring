import { Button } from '../ui/Button'

interface RowCrudActionsProps {
  onView?: () => void
  onEdit: () => void
  onDelete: () => void
  viewLabel?: string
}

export function RowCrudActions({
  onView,
  onEdit,
  onDelete,
  viewLabel = 'Ver ID',
}: RowCrudActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {onView && (
        <Button variant="ghost" size="sm" onClick={onView}>
          {viewLabel}
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={onEdit}>
        Editar
      </Button>
      <Button variant="danger" size="sm" onClick={onDelete}>
        Eliminar
      </Button>
    </div>
  )
}
