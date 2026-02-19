import { addConfig } from '@acf-options-page/store/config';
import { useAppDispatch } from '@acf-options-page/store/hooks';
import { Button, Card, Carousel, Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const VIDEOS: Array<{ id: string; titleKey: string }> = [
  { id: 'M3yNuBkJW3g', titleKey: 'home.videos.video1.title' },
  { id: 'm9slDbpflwI', titleKey: 'home.videos.video2.title' },
  { id: 'p4VY0Ot59SM', titleKey: 'home.videos.video3.title' },
  { id: 'IbfcO4ndgIw', titleKey: 'home.videos.video4.title' }
];

const QUICK_START_STEPS = [
  { icon: 'bi-download', titleKey: 'home.quickStart.step1.title', descKey: 'home.quickStart.step1.desc', linkKey: 'home.quickStart.step1.link' },
  { icon: 'bi-cursor-fill', titleKey: 'home.quickStart.step2.title', descKey: 'home.quickStart.step2.desc', linkKey: 'home.quickStart.step2.link' },
  { icon: 'bi-play-circle-fill', titleKey: 'home.quickStart.step3.title', descKey: 'home.quickStart.step3.desc', linkKey: 'home.quickStart.step3.link' }
];

const TIPS = [
  { icon: 'bi-mouse2', titleKey: 'home.tips.tip1.title', descKey: 'home.tips.tip1.desc', linkKey: 'home.tips.tip1.link' },
  { icon: 'bi-code-slash', titleKey: 'home.tips.tip2.title', descKey: 'home.tips.tip2.desc', linkKey: 'home.tips.tip2.link' },
  { icon: 'bi-hourglass-split', titleKey: 'home.tips.tip3.title', descKey: 'home.tips.tip3.desc', linkKey: 'home.tips.tip3.link' },
  { icon: 'bi-gear-fill', titleKey: 'home.tips.tip4.title', descKey: 'home.tips.tip4.desc', linkKey: 'home.tips.tip4.link' },
  { icon: 'bi-magic', titleKey: 'home.tips.tip5.title', descKey: 'home.tips.tip5.desc', linkKey: 'home.tips.tip5.link' }
];

export const Home = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onAddConfig = () => {
    const action = dispatch(addConfig());
    navigate(`/configurations/${action.payload.id}`);
  };

  return (
    <Container className='p-4'>
      {/* ── Hero ── */}
      <Row className='py-5 mb-4 rounded-4 bg-body-secondary text-center align-items-center justify-content-center'>
        <Col md={8}>
          <i className='bi bi-lightning-charge-fill text-primary' style={{ fontSize: '3rem' }} />
          <h1 className='mt-3 fw-bold'>{t('home.title')}</h1>
          <p className='lead text-body-secondary mb-4'>{t('home.subtitle')}</p>
          <Button variant='primary' size='lg' onClick={onAddConfig}>
            <i className='bi bi-plus-lg me-2' />
            {t('configuration.add')}
          </Button>
        </Col>
      </Row>

      {/* ── Quick Start Guide ── */}
      <section className='mb-5'>
        <h4 className='mb-4 fw-semibold'>
          <i className='bi bi-flag-fill text-success me-2' />
          {t('home.quickStart.title')}
        </h4>
        <Row className='g-3'>
          {QUICK_START_STEPS.map(({ icon, titleKey, descKey, linkKey }) => (
            <Col md={4} key={titleKey}>
              <Card className='h-100 shadow-sm border-0'>
                <Card.Body className='d-flex flex-column gap-2'>
                  <div className='text-primary mb-1' style={{ fontSize: '1.75rem' }}>
                    <i className={`bi ${icon}`} />
                  </div>
                  <Card.Title className='fw-semibold fs-6 mb-1'>{t(titleKey)}</Card.Title>
                  <Card.Text className='text-body-secondary small flex-grow-1'>{t(descKey)}</Card.Text>
                  <a href={t(linkKey)} target='_blank' rel='noreferrer' className='btn btn-outline-primary btn-sm mt-auto align-self-start'>
                    {t('sidebar.learnMore')} <i className='bi bi-arrow-right ms-1' />
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* ── Helpful Tips ── */}
      <section className='mb-5'>
        <h4 className='mb-4 fw-semibold'>
          <i className='bi bi-lightbulb-fill text-warning me-2' />
          {t('home.tips.title')}
        </h4>
        <Row className='g-3'>
          {TIPS.map(({ icon, titleKey, descKey, linkKey }) => (
            <Col md={6} lg={4} key={titleKey}>
              <Card className='h-100 shadow-sm border-0'>
                <Card.Body className='d-flex flex-column gap-2'>
                  <div className='d-flex align-items-center gap-2 mb-1'>
                    <span className='text-warning' style={{ fontSize: '1.4rem' }}>
                      <i className={`bi ${icon}`} />
                    </span>
                    <Card.Title className='fw-semibold fs-6 mb-0'>{t(titleKey)}</Card.Title>
                  </div>
                  <Card.Text className='text-body-secondary small flex-grow-1'>{t(descKey)}</Card.Text>
                  <a href={t(linkKey)} target='_blank' rel='noreferrer' className='btn btn-link btn-sm p-0 align-self-start text-decoration-none'>
                    {t('sidebar.learnMore')} <i className='bi bi-box-arrow-up-right ms-1' />
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* ── Video Guides ── */}
      <section className='mb-4'>
        <h4 className='mb-4 fw-semibold'>
          <i className='bi bi-play-btn-fill text-danger me-2' />
          {t('home.videos.title')}
        </h4>
        <Carousel className='rounded-4 overflow-hidden shadow-sm bg-black' interval={null}>
          {VIDEOS.map(({ id, titleKey }) => (
            <Carousel.Item key={id}>
              <div className='ratio ratio-16x9'>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${id}`}
                  title={t(titleKey)}
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  style={{ border: 0 }}
                />
              </div>
              <Carousel.Caption className='py-3 bg-black bg-opacity-50 rounded-bottom-4'>
                <p className='mb-0 fw-semibold'>{t(titleKey)}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>
    </Container>
  );
};
