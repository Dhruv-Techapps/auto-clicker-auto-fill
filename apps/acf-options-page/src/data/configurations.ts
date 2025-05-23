import { Configuration } from '@dhruv-techapps/acf-common';

export const CONFIGURATIONS: Configuration[] = [
  {
    actions: [
      { elementFinder: '//input[@name="username"][@placeholder="username"]', elementType: 'text', id: '4cce810a-f4e3-4699-8aeb-6ec2f8b4da0d', initWait: 0, name: 'username', value: 'Dharmesh' },
      { elementFinder: '//input[@placeholder="First name"]', elementType: 'text', id: '95abcfa1-cecc-4400-abde-6bb2eafd9136', initWait: 0, name: 'First name', value: 'Dharmesh' },
      { elementFinder: '//input[@id="last-name"][@placeholder="last name"]', elementType: 'text', id: '8272aeeb-9c75-4bc0-aad1-32a4295ea9a2', initWait: 0, name: 'last-name', value: 'Patel' },
      { elementFinder: '//input[@aria-describedby="name"]', elementType: 'text', id: '425a64ba-b4f8-40f6-8f66-80a62bb95bcf', initWait: 0, name: '', value: 'Dharmesh' },
      { elementFinder: '//input[@readonly=""]', elementType: 'text', id: '7678ab9f-9dd9-4a38-ba19-a9885e127f5d', initWait: 0, name: '', value: '' },
      { elementFinder: '//input[@placeholder="email"]', elementType: 'email', id: '45781a83-a691-4aeb-a72f-87179787fe0c', initWait: 0, name: 'email', value: 'dharmesh@gmail.com' },
      { elementFinder: '/html/body/div[1]/form[1]/table/tbody/tr[9]/td[1]/input', elementType: 'password', id: '1359e71b-a155-4b29-8e22-64acf54c3ae7', initWait: 0, name: '', value: '123456' },
      {
        checked: true,
        elementFinder: '//input[@name="gender"][@value="female"]',
        elementType: 'radio',
        elementValue: 'female',
        id: '5eafe6c4-c786-49cb-a039-16f62fea4d02',
        initWait: 0,
        name: 'gender'
      },
      { elementFinder: '//select[@id="product-size"]', elementValue: '35', id: 'c31dfbaf-2f74-43ef-81f6-cba3166df330', initWait: 0, name: 'product-size', value: '35' },
      { elementFinder: '//select[@name="cars"]', elementValue: 'Audi', id: '3cec0fe7-a19d-4d66-ade3-7a2b6ab17117', initWait: 0, name: 'cars', value: 'Audi' },
      {
        elementFinder: '//textarea[@name="message"][@rows="3"][@cols="30"]',
        id: '61a0d773-c189-4239-8c12-b36bdc6648ba',
        initWait: 0,
        name: 'message',
        value: 'The cat was playing in the garden. and mice also'
      },
      {
        checked: true,
        elementFinder: '//input[@name="vehicle2"][@value="Car"]',
        elementType: 'checkbox',
        elementValue: 'Car',
        id: 'f1383c7d-4f1d-4f02-9ed9-c30b14a35cac',
        initWait: 0,
        name: 'vehicle2'
      },
      {
        checked: true,
        elementFinder: '//input[@name="vehicle1"][@value="Bike"]',
        elementType: 'checkbox',
        elementValue: 'Bike',
        id: 'af68b21d-c1f2-460a-ad4f-0f27d896b0f0',
        initWait: 0,
        name: 'vehicle1'
      },
      { elementFinder: '/html/body/div[1]/form[1]/table/tbody/tr[17]/td[1]/button', elementValue: 'Click Me! (Alert)', id: '3b0e9b8b-2a43-46d7-a4a1-85aec973294f', initWait: 0, name: '', value: '' },
      {
        elementFinder: '/html/body/div[1]/form[1]/table/tbody/tr[18]/td[1]/button',
        elementValue: 'Click Me! (Console Hello World)',
        id: 'bb101eb7-738e-4a5e-ad79-d9ede35a8c7c',
        initWait: 0,
        name: '',
        value: ''
      },
      {
        elementFinder: '/html/body/div[1]/form[1]/table/tbody/tr[19]/td[1]/button',
        elementValue: 'Click Me! (Console Random)',
        id: 'be602b59-8024-4c1d-a17e-92eab668d581',
        initWait: 0,
        name: '',
        value: ''
      },
      { elementFinder: '//button[@name="btnLogin"]', elementValue: 'Login', id: 'a8aa5f74-ff1c-4668-8cae-85614c17132f', initWait: 0, name: 'btnLogin', value: '' },
      {
        elementFinder: '//input[@id="address"][@placeholder="1234 Main St"]',
        elementType: 'text',
        id: '1e1691af-6579-415e-94c6-7a3c47473dc7',
        initWait: 0,
        name: 'address',
        value: 'Here is my new address'
      },
      { elementFinder: '/html/body/div[1]/form[2]/table/tbody/tr[4]/td[1]/button[1]', elementValue: 'Primary', id: 'fa5d504b-80d9-4476-b101-24043b457256', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/form[2]/table/tbody/tr[4]/td[1]/button[2]', elementValue: 'Secondary', id: 'a4cb5c9f-88c3-4b6c-8c5d-bb8d5d241aaa', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/form[2]/table/tbody/tr[4]/td[1]/button[3]', elementValue: 'Success', id: '49e903ca-3864-4dbd-8530-6598f8947aee', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/form[2]/table/tbody/tr[4]/td[1]/button[4]', elementValue: 'Danger', id: '81cea222-27b9-4216-b93a-b9c6b00a4255', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/form[2]/table/tbody/tr[4]/td[1]/button[5]', elementValue: 'Warning', id: '19e4ba6b-12d6-4076-a221-3ecc500182b1', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/form[2]/table/tbody/tr[4]/td[1]/button[6]', elementValue: 'Info', id: '2942aa2b-5757-4b74-a674-623122d38be9', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/form[2]/table/tbody/tr[4]/td[1]/button[7]', elementValue: 'Light', id: '3623a040-73cd-4a69-a252-1b6f8a0cb159', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/form[2]/table/tbody/tr[4]/td[1]/button[8]', elementValue: 'Dark', id: '1276529a-f2c9-4ed9-b5d2-911da3bd9cf4', initWait: 0, name: '', value: '' },
      {
        elementFinder: '//input[@id="inputEmail"][@placeholder="Email address"]',
        elementType: 'email',
        id: '1c5a1353-5166-45be-9048-0297914c0c29',
        initWait: 0,
        name: 'inputEmail',
        value: 'dharmesh@gail.com'
      },
      {
        elementFinder: '//input[@id="inputPassword"][@placeholder="Password"]',
        elementType: 'password',
        id: '0c983c2a-95bb-49c6-b107-3e232ad2f2f1',
        initWait: 0,
        name: 'inputPassword',
        value: '123456'
      },
      { elementFinder: '/html/body/div[1]/table[2]/tbody/tr/td[1]/button[1]', elementValue: 'Primary', id: 'b976f02e-294a-4aba-88a5-c9c9f351d3c6', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/table[2]/tbody/tr/td[1]/button[2]', elementValue: 'Secondary', id: '788fc906-157e-42cf-b13b-2ef0fbd07f30', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/table[2]/tbody/tr/td[1]/button[3]', elementValue: 'Success', id: 'ad1b1b8b-afc1-4737-acc4-298643fb0df0', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/table[2]/tbody/tr/td[1]/button[4]', elementValue: 'Danger', id: '4491bd2d-21fc-4825-ab25-a648e9159f16', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/table[2]/tbody/tr/td[1]/button[5]', elementValue: 'Warning', id: '1dd21f0d-3bd3-4d5c-9ca8-c43999280108', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/table[2]/tbody/tr/td[1]/button[6]', elementValue: 'Light', id: 'fe10f7db-02f5-4e24-a53d-a90d18f580a4', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/table[2]/tbody/tr/td[1]/button[7]', elementValue: 'Info', id: 'b844ae78-b461-4f6a-9f65-87e437cb7562', initWait: 0, name: '', value: '' },
      { elementFinder: '/html/body/div[1]/table[2]/tbody/tr/td[1]/button[8]', elementValue: 'Dark', id: 'fdaa262f-9226-4fdc-9199-e6569d365736', initWait: 0, name: '', value: '' },
      { elementFinder: '//button[@id="click-events-test"]', elementValue: 'Click Events', id: '4cfdd42f-ad52-46cd-ba2e-2e6658e776d2', initWait: 0, name: 'click-events-test', value: '' },
      {
        elementFinder: '//input[@id="form-events-test"][@placeholder="Form Events Test"]',
        elementType: 'text',
        id: 'e399e157-2117-4295-b0f5-b811f23e43ed',
        initWait: 0,
        name: 'form-events-test',
        value: 'Form events to test check console'
      },
      { elementFinder: '//button[@id="speed-test"]', elementValue: 'CLICK ME 1', id: 'b1ac8cd2-9c6b-4a0b-a4d3-f3c29ea187ca', initWait: 0, name: 'speed-test', repeat: 10, value: '' }
    ],
    enable: false,
    id: '4ac9b2ad-1112-43c4-b532-b9b5bece69a7',
    loadType: 'window',
    name: 'Sample Config | Auto click / Auto Fill',
    source: 'wizard',
    startType: 'auto',
    timer: 1736353844887,
    updated: true,
    url: 'https://test.getautoclicker.com/'
  } as Configuration,
  {
    actions: [{ elementFinder: '//input', error: [], id: '85f50b8e-eba2-47a7-a0e2-10f5ad7d9ee2', value: 'GoogleSheets::Users!A1' }],
    batch: { refresh: false },
    bypass: { alert: true, confirm: false, prompt: false },
    enable: false,
    id: '9585a3ea-807a-488e-9e62-6e3720a1bcc8',
    loadType: 'window',
    name: 'Sample Config | Google Sheets',
    source: 'web',
    spreadsheetId: '1J2OcSNJsnYQCcQmA4K9Fhtv8yqvg0NouB--H4B0jsZA',
    startType: 'auto',
    updated: true,
    url: 'https://test.getautoclicker.com/'
  } as Configuration,
  {
    actions: [{ elementFinder: '//input[@name="username"]', error: [], id: '2a0a59d2-698d-453a-a14a-278b2aebc9e2', value: 'Dharmesh <random(hello|world)>' }],
    enable: false,
    id: '64bddaab-e1e3-46ed-ae62-cb7e768cc2fb',
    initWait: 5,
    loadType: 'window',
    name: 'Sample Config | Random',
    source: 'web',
    startType: 'auto',
    updated: true,
    url: 'https://test.getautoclicker.com/'
  } as Configuration,
  {
    actions: [{ elementFinder: '//input[@name="username"]', error: [], id: 'b28a5b20-7627-4be6-89d4-357f1006b47a', value: 'Query::ab' }],
    enable: false,
    id: '7f54c534-f224-4f19-a55d-00ce2226084c',
    initWait: 5,
    loadType: 'window',
    name: 'Sample Config | Query Param',
    source: 'web',
    startType: 'auto',
    updated: true,
    url: 'https://test.getautoclicker.com/?ab=12'
  } as Configuration,
  {
    actions: [
      { elementFinder: '//form//input[@id="name"]', error: [], id: 'd12e549c-e799-47d5-af25-48e76924199c', repeat: 0, repeatInterval: 0, settings: { iframeFirst: true }, value: 'Name' },
      { elementFinder: '//form//input[@id="mail"]', error: [], id: '39671f28-0a02-4578-9fa4-5805a1ebde73', settings: { iframeFirst: true }, value: 'test@gmail.com' },
      { elementFinder: '//form//textarea[@id="msg"]', error: [], id: '52bffeab-268c-4ea3-a5d3-6fa6ede3ee6e', settings: { iframeFirst: true }, value: "I'm Here" }
    ],
    batch: { repeat: 0, repeatInterval: 0 },
    enable: false,
    id: 'ac53ee3b-f438-4d8d-90cf-b4ed04d3353b',
    loadType: 'window',
    name: 'Sample Config | Iframe',
    source: 'web',
    startType: 'auto',
    updated: true,
    url: 'https://test.getautoclicker.com/'
  } as Configuration
];
