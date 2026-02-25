import { firebaseSelector } from '@acf-options-page/store';
import { useAppSelector } from '@acf-options-page/store/hooks';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const Upgrade = () => {
  const { t } = useTranslation();
  const { role } = useAppSelector(firebaseSelector);
  return (
    <Container className='p-4'>
      <h2 className='mb-1'>{t('upgradePlan.title')}</h2>
      <p className='text-muted mb-4'>{t('upgradePlan.subtitle')}</p>
      <Row className='g-4'>
        <Col xs={12} md={6} lg={4}>
          <Card className='h-100'>
            <CardBody className='d-flex row-gap-3 flex-column'>
              <div>
                <h5 className='mb-0'>{t('upgradePlan.free.name')}</h5>
                <small className='text-muted'>{t('upgradePlan.free.tagline')}</small>
              </div>
              <div>
                <div className='d-flex align-items-center'>
                  <h1 className='m-0 me-2'>$0</h1>
                  <small className='text-muted'>{t('upgradePlan.free.perMonth')}</small>
                </div>
              </div>
              <div>
                <p className='p-0 mb-2 fw-semibold'>{t('upgradePlan.free.includes')}</p>
                <ul className='list-unstyled d-flex flex-column row-gap-1 mb-0'>
                  <li>
                    <i className='bi bi-check-circle-fill me-2' />
                    {t('upgradePlan.free.features.unlimitedAutomations')}
                  </li>
                  <li>
                    <i className='bi bi-check-circle-fill me-2' />
                    {t('upgradePlan.free.features.unlimitedSteps')}
                  </li>
                  <li>
                    <i className='bi bi-check-circle-fill me-2' />
                    {t('upgradePlan.free.features.loopSteps')}
                  </li>
                  <li>
                    <i className='bi bi-check-circle-fill me-2' />
                    {t('upgradePlan.free.features.recording')}
                  </li>
                  <li>
                    <i className='bi bi-check-circle-fill me-2' />
                    {t('upgradePlan.free.features.allValues')}
                  </li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card className='h-100'>
            <CardBody className='d-flex row-gap-3 flex-column'>
              <div>
                <h5 className='mb-0' style={{ whiteSpace: 'nowrap' }}>
                  {t('upgradePlan.lite.name')}
                </h5>
                <small className='text-muted'>{t('upgradePlan.lite.tagline')}</small>
              </div>
              <div>
                <div className='d-flex align-items-center'>
                  <h1 className='m-0 me-2'>$5</h1>
                  <small className='text-muted'>{t('upgradePlan.lite.perMonth')}</small>
                </div>
                <Button target='_blank' href='https://github.com/sponsors/Dhruv-Techapps' disabled={role === 'PLUS'} className='px-5 py-2 mt-3 w-100'>
                  {role === 'PLUS' ? t('upgradePlan.currentPlan') : t('upgradePlan.lite.cta')}
                </Button>
              </div>
              <div>
                <p className='p-0 mb-2 fw-semibold'>{t('upgradePlan.lite.includes')}</p>
                <ul className='list-unstyled d-flex flex-column row-gap-1 mb-0'>
                  <li>
                    <span className='me-2'>♾️</span>
                    {t('upgradePlan.lite.features.addonCondition')}
                  </li>
                  <li>
                    <span className='me-2'>♾️</span>
                    {t('upgradePlan.lite.features.actionCondition')}
                  </li>
                  <li>
                    <span className='me-2'>♾️</span>
                    {t('upgradePlan.lite.features.actionSettings')}
                  </li>
                  <li>
                    <span className='me-2'>🚫</span>
                    {t('upgradePlan.lite.features.noAds')}
                  </li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Card className='h-100 '>
            <CardBody className='d-flex row-gap-3 flex-column'>
              <div>
                <h5 className=' mb-0'>{t('upgradePlan.pro.name')}</h5>
                <small className='text-muted'>{t('upgradePlan.pro.tagline')}</small>
              </div>
              <div>
                <div className='d-flex align-items-center'>
                  <h1 className='m-0 me-2'>$10</h1>
                  <small className='text-muted'>{t('upgradePlan.pro.perMonth')}</small>
                </div>
                <Button target='_blank' href='https://github.com/sponsors/Dhruv-Techapps' disabled={role === 'PRO'} className='px-5 py-2 mt-3 w-100'>
                  {role === 'PRO' ? t('upgradePlan.currentPlan') : t('upgradePlan.pro.cta')}
                </Button>
              </div>
              <div>
                <p className='p-0 mb-2 fw-semibold'>{t('upgradePlan.pro.includes')}</p>
                <ul className='list-unstyled d-flex flex-column row-gap-1 mb-0'>
                  <li>
                    <i className='bi bi-check-circle-fill text-primary me-2' />
                    {t('upgradePlan.pro.features.sheets')}
                  </li>
                  <li>
                    <i className='bi bi-check-circle-fill text-primary me-2' />
                    {t('upgradePlan.pro.features.discord')}
                  </li>
                  <li>
                    <i className='bi bi-check-circle-fill text-primary me-2' />
                    {t('upgradePlan.pro.features.captcha')}
                  </li>
                  <li>
                    <i className='bi bi-discord text-primary me-2' />
                    {t('upgradePlan.pro.features.vipSupport')}
                  </li>
                  <li>
                    <i className='bi bi-star-fill text-primary me-2' />
                    {t('upgradePlan.pro.features.earlyAccess')}
                  </li>
                  <li>
                    <i className='bi bi-award-fill text-primary me-2' />
                    {t('upgradePlan.pro.features.prideAndJoy')}
                  </li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
