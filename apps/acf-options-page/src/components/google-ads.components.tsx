import { memo, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';

interface GoogleAdsProps {
  readonly client?: string;
  readonly slot?: string;
  readonly className?: string;
}

const GoogleAds = memo(function GoogleAds({ client = import.meta.env.VITE_PUBLIC_GOOGLE_ADS_CLIENT, slot = import.meta.env.VITE_PUBLIC_GOOGLE_ADS_SLOT, className = 'mb-3' }: GoogleAdsProps) {
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
      document.head.removeChild(script);
      document.head.removeChild(scriptFunding);
    };
  }, []);

  return (
    <Row>
      <Col xs={12} className='text-center'>
        <ins className={`${className} adsbygoogle`} style={{ display: 'block' }} data-ad-client={client} data-ad-slot={slot} data-ad-format='auto' data-full-width-responsive='true' />
      </Col>
    </Row>
  );
});

export { GoogleAds };
