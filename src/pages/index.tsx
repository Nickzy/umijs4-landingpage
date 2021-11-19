import { useIntl } from 'react-intl';
import styles from './index.less';
// import { useAccess, Access } from 'umi';

import DEMO from './DEMO';
import DEMO3 from './DEMO/demo3';

function IndexPage() {

  let { formatMessage } = useIntl();

  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <h3>{formatMessage({ id: "welcome" })}</h3>
      <h4>{formatMessage({ id: "welcome.h3" })}</h4>
      <DEMO3 />
      <DEMO />
      a
    </div>
  );
}

export default IndexPage