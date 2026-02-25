import { configSelector, reorderConfigs, useAppDispatch, useAppSelector } from '@acf-options-page/store';
import { addToast } from '@acf-options-page/store/toast.slice';
import { IConfiguration } from '@dhruv-techapps/acf-common';
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormEvent, useEffect, useState } from 'react';
import { Badge, Button, ListGroup, Offcanvas } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface AutomationsReorderOffcanvasProps {
  show: boolean;
}

export const AutomationsReorderOffcanvas = ({ show }: AutomationsReorderOffcanvasProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { configs } = useAppSelector(configSelector);
  const [localConfigs, setLocalConfigs] = useState<Array<IConfiguration>>([]);
  const [sort, setSort] = useState<boolean>();

  useEffect(() => {
    if (show && configs) {
      setLocalConfigs([...configs]);
      setSort(undefined);
    }
  }, [show, configs]);

  const handleClose = () => navigate(-1);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(reorderConfigs(localConfigs));
    dispatch(addToast({ header: t('automations.toast.header'), body: t('automations.toast.reorder') }));
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const sortConfigs = () => {
    const next = !sort;
    setSort(next);
    setLocalConfigs((prev) =>
      [...prev].sort((a, b) => {
        const first = next ? a.name || a.url || '' : b.name || b.url || '';
        const second = next ? b.name || b.url || '' : a.name || a.url || '';
        return first.localeCompare(second);
      })
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setLocalConfigs((prev) => {
        const oldIndex = prev.findIndex((config) => config.id === active.id);
        const newIndex = prev.findIndex((config) => config.id === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement='end' backdrop={true}>
      <form onSubmit={onSubmit} className='h-100 d-flex flex-column'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('reorder.title')}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='flex-grow-1 overflow-auto'>
          <p className='text-muted'>{t('reorder.hint')}</p>
          <Button type='button' variant='outline-secondary' size='sm' onClick={sortConfigs} className='mb-3'>
            {t('automations.reorderByName')}
            {sort !== undefined && <span className='ms-1'>{sort ? <i className='bi bi-arrow-up' /> : <i className='bi bi-arrow-down' />}</span>}
          </Button>
          <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
            <SortableContext items={localConfigs} strategy={verticalListSortingStrategy}>
              <ListGroup>
                {localConfigs.map((config) => (
                  <SortableConfigItem key={config.id} {...config} />
                ))}
              </ListGroup>
            </SortableContext>
          </DndContext>
        </Offcanvas.Body>
        <div className='offcanvas-footer d-flex justify-content-between p-3 border-top'>
          <Button type='button' variant='outline-primary' className='px-5' onClick={handleClose} data-testid='configs-reorder-close'>
            {t('common.close')}
          </Button>
          <Button type='submit' variant='primary' className='px-5' data-testid='configs-reorder-save'>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Offcanvas>
  );
};

interface SortableConfigItemProps {
  id: string;
  name?: string;
  url?: string;
  enable?: IConfiguration['enable'];
}

function SortableConfigItem({ id, name, enable, url }: SortableConfigItemProps) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <ListGroup.Item ref={setNodeRef} {...attributes} {...listeners} style={style} className='d-flex align-items-center gap-2 cursor-grab'>
      <i className='bi bi-grip-vertical text-body-tertiary' />
      <span className='flex-grow-1'>{name || url || `automation - ${id}`}</span>
      {!enable && (
        <Badge pill bg='secondary'>
          {t('common.disabled')}
        </Badge>
      )}
    </ListGroup.Item>
  );
}
