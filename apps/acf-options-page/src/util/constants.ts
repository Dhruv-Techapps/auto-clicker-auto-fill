// Application Links
export const APP_LINK = {
  DOCS: 'https://getautoclicker.com/docs/4.x/',
  BLOG: 'https://blog.getautoclicker.com/',
  CONFIGS: 'https://configs.getautoclicker.com/',
  TEST: 'https://test.getautoclicker.com/',
  ISSUES: 'https://github.com/Dhruv-Techapps/auto-clicker-auto-fill/issues',
  DISCUSSIONS: 'https://github.com/Dhruv-Techapps/auto-clicker-auto-fill/discussions'
};

// Application Languages
export const APP_LANGUAGES = ['en', 'ar', 'de', 'es', 'fi', 'fr', 'id', 'it', 'ja', 'ko', 'nl', 'pt', 'ru', 'sv', 'vi', 'zh_CN', 'zh_TW'];

export const SPONSORS = [
  {
    id: 'saroj-kitchen',
    link: 'https://www.youtube.com/@sarojskitchen',
    title: "Saroj's Kitchen",
    image: 'https://yt3.googleusercontent.com/ytc/AL5GRJXXSNx_TgWygPPxifjLMWl6De3YVmGwHAjOfhztgVA=s176-c-k-c0x00ffffff-no-rj'
  }
];

export const NO_EXTENSION_ERROR = ['Could not establish connection. Receiving end does not exist.', "Cannot read properties of undefined (reading 'sendMessage')"];
// Web store links
export const CHROME_WEB_STORE = 'https://chrome.google.com/webstore/detail/';

const message = encodeURIComponent('Fill input field or click button or link anything anywhere. easy configure in few steps and work like PRO #AutoClickerAutoFill');
const webStore = CHROME_WEB_STORE;
const extensionId = import.meta.env[`VITE_PUBLIC_CHROME_EXTENSION_ID`];
const url = encodeURIComponent(webStore + extensionId);
// Social
export const SOCIAL_LINKS_OLD = {
  YOUTUBE: 'https://www.youtube.com/@autoclickerautofill/',
  INSTAGRAM: 'https://www.instagram.com/dharmeshhemaram/',
  DISCORD: 'https://discord.gg/ubMBeX3',
  GOOGLE_GROUP: 'https://groups.google.com/g/auto-clicker-autofill',
  TWITTER: `https://twitter.com/intent/tweet?text=${message}&url=${url}`,
  GITHUB: 'https://github.com/Dhruv-Techapps/auto-clicker-auto-fill',
  FACEBOOK: `https://www.facebook.com/sharer.php?u=${url}&quote=${message}`,
  WHATSAPP: `https://wa.me/?text=${message}%5Cn%20${url}`,
  RATE_US: `https://chromewebstore.google.com/detail/${extensionId}/reviews`
};

export const LEARN_MORE_LINKS = [
  { href: 'https://getautoclicker.com/docs/', title: 'docs', label: 'Docs', icon: 'bi-journal-code' },
  { href: 'https://github.com/Dhruv-Techapps/auto-clicker-auto-fill/issues', title: 'issues', label: 'Issues', icon: 'bi-exclamation-circle' },
  { href: 'https://github.com/Dhruv-Techapps/auto-clicker-auto-fill/discussions', title: 'discussion', label: 'Discussion', icon: 'bi-chat-dots' },
  { href: 'https://test.getautoclicker.com/', title: 'practice form', label: 'Practice Form', icon: 'bi-ui-checks-grid' }
];

export const ABOUT_LINKS = [
  { href: 'https://getautoclicker.com/policy', title: 'privacy policy', label: 'Privacy & Policy', icon: 'bi-shield-lock' },
  { href: `https://chromewebstore.google.com/detail/${extensionId}/reviews`, title: 'rate us', label: 'Rate us', icon: 'bi-star' }
];

export const SOCIAL_LINKS = [
  {
    href: 'https://www.youtube.com/@autoclickerautofill',
    label: 'YouTube',
    title: 'Watch tutorials on YouTube',
    icon: 'bi-youtube'
  },
  {
    href: 'https://discord.gg/ubMBeX3',
    label: 'Discord',
    title: 'Join our Discord community',
    icon: 'bi-discord'
  },
  {
    href: 'https://x.com/DhruvTechApps',
    label: 'Twitter / X',
    title: 'Follow us on Twitter / X',
    icon: 'bi-twitter-x'
  },
  {
    href: 'https://github.com/Dhruv-Techapps/auto-clicker-auto-fill',
    label: 'GitHub',
    title: 'View source on GitHub',
    icon: 'bi-github'
  },
  {
    href: 'mailto:support@getautoclicker.com',
    label: 'Email',
    title: 'Contact us via email',
    icon: 'bi-envelope'
  }
];
