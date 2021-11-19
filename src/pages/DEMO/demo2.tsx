import { useIntl } from 'react-intl';

function DemoPage2() {

  let { formatMessage } = useIntl();

  return (
    <div className="demo2">
      demo2
    </div>
  );
}

export default DemoPage2