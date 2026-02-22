import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const Upgrade = () => {
  const { t } = useTranslation();

  return (
    <div className='p-4'>
      <h2 className='mb-1'>{t('upgradePlan.title')}</h2>
      <p className='text-muted mb-4'>{t('upgradePlan.subtitle')}</p>
      <Row className='g-4'>
        <Col xs={12} md={6} lg={5}>
          <Card className='h-100 border-primary'>
            <CardBody className='d-flex row-gap-3 flex-column'>
              <div>
                <h5 className='text-primary mb-0'>{t('upgradePlan.pro.name')}</h5>
                <small className='text-muted'>{t('upgradePlan.pro.tagline')}</small>
              </div>
              <div>
                <div className='d-flex align-items-center'>
                  <h1 className='m-0 me-2'>$10</h1>
                  <small className='text-muted'>{t('upgradePlan.pro.perMonth')}</small>
                </div>
                <Button variant='primary' target='_blank' href='https://github.com/sponsors/Dhruv-Techapps' className='px-5 py-2 mt-3 w-100'>
                  {t('upgradePlan.pro.cta')}
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
                    <i className='bi bi-check-circle-fill text-primary me-2' />
                    {t('upgradePlan.pro.features.noAds')}
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
    </div>
  );
};
