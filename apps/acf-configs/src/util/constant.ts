export const EXTENSIONS = [
  {
    id: 'blfahkipmbikdeipdaogkjggbmgbippe',
    name: 'Auto Clicker - AutoFill [LOCAL]'
  },
  {
    id: 'cpjikgcdmhfnmaiibplplldlchbjejel',
    name: 'Auto Clicker - AutoFill [DEV]'
  },
  {
    id: 'nmcpliniiebkbdehpgicgfcidgkpepep',
    name: 'Auto Clicker - AutoFill [BETA]'
  },
  {
    id: 'iapifmceeokikomajpccajhjpacjmibe',
    name: 'Auto Clicker - AutoFill'
  }
] as Array<TExtension>;

export type TExtension = {
  id: string;
  name: string;
  version?: string;
};
