import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
//   navTheme: 'light',
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'XiaoZhouzi',
  pwa: false,
  logo: 'http://pic.616pic.com/ys_b_img/00/21/23/7caRgtSkn7.jpg',
  iconfontUrl: '/',
};

export default Settings;