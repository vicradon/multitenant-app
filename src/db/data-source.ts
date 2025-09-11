import { ConfigService } from '@nestjs/config';
import { hospitalADB, hospitalBDB } from 'src/config/db.config';
import { DataSource } from 'typeorm';


// export const HospitalADatasource = new DataSource({
//   ...hospitalADB,
//   entities: ['./dist/hospitalA/**/*entity.{ts,js}'],
// });

// export const HospitalBDatasource = new DataSource({
//   ...hospitalBDB,
//   entities: ['./dist/hospitalB/**/*entity.{ts,js}'],
// });



// const loadDataSource = (configService: ConfigService) => ({
//   type: 'postgres',
//   url: configService.get('DB_URL_HOSPITAL_A'),
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   synchronize: true,
// })
