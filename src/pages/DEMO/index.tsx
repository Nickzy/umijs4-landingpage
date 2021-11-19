import { useIntl } from 'react-intl';
import { FooModelType } from '../../models/index';

function DemoPage0() {

  let { formatMessage } = useIntl();

  console.log(FooModelType,"FooModelType");

  return (
    <div className="demo">
      demo~
    </div>
  );
}

export default DemoPage0