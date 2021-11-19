import { useIntl } from 'react-intl';

function DemoPage1() {

  let { formatMessage } = useIntl();

  return (
    <div className="demo1">
      demo1
    </div>
  );
}

export default DemoPage1