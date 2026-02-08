import Action from '@acf-options-page/app/configs/action';
import Footer from '@acf-options-page/app/footer';
import { Ads } from '@acf-options-page/components';
import { configByIdSelector } from '@acf-options-page/store/config';
import { useAppSelector } from '@acf-options-page/store/hooks';
import { useParams } from 'react-router';

export const Config = () => {
  const { id } = useParams<{ id: string }>();
  const config = useAppSelector((state) => configByIdSelector(state, id));
  console.log('Selected Config:', config);
  return (
    <>
      <div>
        <h2 className='mb-4'>{config?.name || config?.url || 'Configuration'}</h2>
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </div>
      <Ads />
      <Action />
      <Footer />;
    </>
  );
};
