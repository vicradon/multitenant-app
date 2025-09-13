import 'dotenv/config';
import { runSeeder } from 'typeorm-extension';
import { getSeederDataSources } from './data-source';


const runAllSeeders = async () => {
  const dataSources = getSeederDataSources();

  for (const dataSource of dataSources) {
    await dataSource.initialize();
    console.log(`Seeding database: ${dataSource.options.database}`);
    await runSeeder(dataSource, require('./database/seeders/CreateUsersSeeder').default);
    await dataSource.destroy();
  }
};

runAllSeeders()
  .then(() => console.log('Seeding complete for all tenant databases.'))
  .catch((err) => console.error(err));
