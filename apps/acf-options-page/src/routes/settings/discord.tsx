import { firebaseSelector, switchFirebaseLoginModal } from '@acf-options-page/store/firebase';
import { useAppDispatch, useAppSelector } from '@acf-options-page/store/hooks';
import { settingsSelector } from '@acf-options-page/store/settings';
import { discordDeleteAPI, discordGetAPI, discordLoginAPI } from '@acf-options-page/store/settings/settings.api';
import { useEffect } from 'react';
import { Button, Form, Image } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';

interface SettingDiscordProps {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

function SettingDiscord({ onChange, checked }: SettingDiscordProps) {
  const { t } = useTranslation();
  const { discord, discordLoading } = useAppSelector(settingsSelector);
  const { user } = useAppSelector(firebaseSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && !discord) {
      dispatch(discordGetAPI());
    }
  }, [user, discord, dispatch]);

  const connect = () => {
    dispatch(discordLoginAPI());
  };

  const remove = () => {
    dispatch(discordDeleteAPI());
  };

  if (discordLoading) {
    return (
      <div className='w-100'>
        <div className='d-flex justify-content-between align-items-center'> </div>
        <div>{t('loading')}</div>
      </div>
    );
  }

  if (!user) {
    return <Trans i18nKey='discord.loginRequired' components={{ 1: <Button variant='link' title='login' onClick={() => dispatch(switchFirebaseLoginModal())} /> }} />;
  }

  if (discord) {
    return (
      <div className='w-100'>
        <div className='d-flex justify-content-between align-items-center'>
          <Form.Label className='ms-2 mt-2 me-auto' htmlFor='discord'>
            <div className='fw-bold mb-2'>{t('discord.title')}</div>
            <Image
              alt={discord.displayName}
              className='me-2'
              title={discord.displayName}
              src={`https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png`}
              roundedCircle
              width='30'
              height='30'
            />
            {discord.username}
            <Button variant='link' onClick={remove}>
              ({t('disconnect')})
            </Button>
          </Form.Label>
          <Form.Check type='switch' id='discord' onChange={onChange} checked={checked || false} name='discord' data-testid='discord-switch' />
        </div>
      </div>
    );
  }

  return (
    <Button variant='link' onClick={connect} data-testid='discord-connect'>
      {t('connect')}
    </Button>
  );
}

SettingDiscord.displayName = 'SettingDiscord';

export { SettingDiscord };
