
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  type: 'weather' | 'country' | 'currency' | 'news' | 'flight';
  children: ReactNode;
  onView?: () => void;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ModuleCard = ({ 
  title, 
  type,
  children,
  onView,
  onAdd,
  onEdit,
  onDelete
}: ModuleCardProps) => {
  return (
    <Card className={`module-card module-card-${type} border-t-4`}>
      <CardHeader className={`module-header module-header-${type} p-3 flex flex-row items-center justify-between`}>
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex space-x-1">
          {onAdd && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={onAdd}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
          {onView && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {children}
        {(onEdit || onDelete) && (
          <div className="flex justify-end gap-2 mt-2">
            {onEdit && (
              <Button variant="outline" size="sm" className="h-8 px-2" onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" className="h-8 px-2 text-destructive border-destructive hover:bg-destructive/10" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
