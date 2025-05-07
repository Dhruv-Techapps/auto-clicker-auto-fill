import { firebaseSelector } from '../store/firebase';
import { useAppSelector } from '../store/hooks';
import { GoogleAds } from './google-ads.components';

export function Ads() {
  const { role, isLoading } = useAppSelector(firebaseSelector);
  if (!isLoading && role === undefined && /\.getautoclicker\.com/.exec(window.location.href) !== null) {
    return <GoogleAds />;
  }
  return null;
}
