import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface ValueFieldTypeTooltipProps {
  id: string;
  valueFieldType: 'input' | 'textarea' | 'script';
  children: React.ReactElement;
}

export function ValueFieldTypeTooltip({ id, valueFieldType, children }: ValueFieldTypeTooltipProps) {
  return (
    <OverlayTrigger overlay={<Tooltip id={id}>{valueFieldType === 'input' ? 'Switch to Textarea' : 'Switch to Input'}</Tooltip>}>
      {children}
    </OverlayTrigger>
  );
}
