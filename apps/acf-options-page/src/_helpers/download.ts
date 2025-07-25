import { IConfiguration } from '@dhruv-techapps/acf-common';

export const download = (name: string, data: IConfiguration | Array<IConfiguration>) => {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json;charset=utf-8;' });
  const href = URL.createObjectURL(blob);

  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display: none');
  a.href = href;
  a.download = `${name}.json`;
  a.click();
  URL.revokeObjectURL(href);
};
