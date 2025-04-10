import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormEvent, useState } from 'react';
import { Badge, Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ErrorAlert } from '../components';
import { configReorderSelector, configReorderUpdateAPI, switchConfigReorderModal, updateConfigReorder } from '../store/config';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ArrowDown, ArrowUp } from '../util';

const ReorderConfigsModal = () => {
  const { visible, configs, error } = useAppSelector(configReorderSelector);
  const [sort, setSort] = useState<boolean>();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(configReorderUpdateAPI());
  };

  const handleClose = () => {
    dispatch(switchConfigReorderModal());
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortActions = () => {
    setSort(!sort);
    if (configs) {
      dispatch(
        updateConfigReorder(
          [...configs].sort((a, b) => {
            const first = sort ? a.name || a.url : b.name || b.url;
            const second = sort ? b.name || b.url : a.name || a.url;
            return first.localeCompare(second);
          })
        )
      );
    }
  };

  const onShow = () => {
    //:TODO
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id && configs) {
      const oldIndex = configs.findIndex((config) => config.id === active.id);
      const newIndex = configs.findIndex((config) => config.id === over.id);

      dispatch(updateConfigReorder(arrayMove(configs, oldIndex, newIndex)));
    }
  };

  if (!configs) {
    return;
  }

  return (
    <Modal show={visible} size='lg' onHide={handleClose} scrollable onShow={onShow} data-testid='reorder-configs-modal'>
      <Form onSubmit={onSubmit} id='reorder-configs'>
        <Modal.Header>
          <Modal.Title as='h6'>{t('modal.reorder.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: 'auto', height: 'calc(100vh - 200px)' }}>
          <ErrorAlert error={error} />
          <p className='text-muted'>{t('modal.reorder.hint')}</p>
          <Button onClick={sortActions} className='mb-3'>
            Reorder {sort !== undefined && <span>{sort ? <ArrowUp /> : <ArrowDown />}</span>}
          </Button>
          <div className='list-group'>
            <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
              <SortableContext items={configs} strategy={verticalListSortingStrategy}>
                {configs?.map((config) => (
                  <SortableItem key={config.id} {...config} />
                ))}
              </SortableContext>
            </DndContext>
            {/*<Reorder reorderId='configurations' draggedClassName='active' placeholderClassName='list-group' onReorder={onReorder}></Reorder>*/}
          </div>
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button type='button' variant='outline-primary px-5' onClick={handleClose} data-testid='configurations-reorder-close'>
            {t('common.close')}
          </Button>
          <Button type='submit' variant='primary px-5' className='ml-3' id='reorder-configs-button' data-testid='configurations-reorder-save'>
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export function SortableItem(props) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <ListGroup.Item key={props.id} ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {props.name || 'configuration - ' + props.id}
      {!props.enable && (
        <Badge pill bg='secondary' className='ms-2'>
          {t('common.disabled')}
        </Badge>
      )}
    </ListGroup.Item>
  );
}

export { ReorderConfigsModal };
