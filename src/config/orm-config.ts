import fs = require('fs');
import { ConfigService } from './config';

fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(ConfigService.getTypeOrmConfig(), null, 2),
);
