import { memo, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import useAdRotator from '../hooks/useAdRotator';

interface GoogleAdsProps {
  readonly client?: string;
  readonly slot?: string;
  /** Optional: multiple ad slots to rotate through. */
  readonly slots?: string[];
  /** Rotation interval in ms (applies when `slots` length > 1). */
  readonly rotateIntervalMs?: number;
  readonly className?: string;
}

const GoogleAds = memo(function GoogleAds({
  client = import.meta.env.VITE_PUBLIC_GOOGLE_ADS_CLIENT,
  slot = import.meta.env.VITE_PUBLIC_GOOGLE_ADS_SLOT,
  slots,
  rotateIntervalMs = 3000,
  className = 'mt-2'
}: GoogleAdsProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9512495707028343';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    };
    script.onerror = () => console.error(`Error while loading Google Ads script`);

    // This is for the Funding Choices message
    const scriptFunding = document.createElement('script');
    scriptFunding.src = 'https://fundingchoicesmessages.google.com/i/pub-9512495707028343?ers=1';
    scriptFunding.async = true;
    scriptFunding.nonce = 'zG-XMu9e9eZgUA3cG1msWw';
    document.head.appendChild(script);
    document.head.appendChild(scriptFunding);
    return () => {
      // Cleanup the script when the component unmounts
      try {
        document.head.removeChild(script);
      } catch {}
      try {
        document.head.removeChild(scriptFunding);
      } catch {}
    };
  }, []);

  // Build the list of slot IDs to rotate. Favor explicit `slots` prop.
  const slotIds =
    slots && slots.length > 0
      ? slots
      : slot
        ? slot
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

  const { activeSlotId } = useAdRotator(slotIds, { intervalMs: rotateIntervalMs });

  // Use the active slot id (fall back to provided single `slot` if no rotation)
  const renderSlot = activeSlotId ?? slotIds[0] ?? slot;

  useEffect(() => {
    // After the ins element is mounted/changed, ask adsbygoogle to render.
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // swallow errors — ad library may not be ready in tests
    }
  }, [renderSlot]);

  return (
    <Row>
      <Col xs={12} className='text-center'>
        <ins
          key={String(renderSlot)}
          className={`${className} adsbygoogle ad-fade`}
          style={{ display: 'inline-block', width: '728px', height: '90px', transition: 'opacity 300ms ease' }}
          data-ad-client={client}
          data-ad-slot={renderSlot}
        />
      </Col>
    </Row>
  );
});

export { GoogleAds };
