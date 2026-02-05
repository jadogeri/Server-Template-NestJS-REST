import dataSourceOptions from './src/configs/type-orm.config';
import { DataSource, DataSourceOptions } from 'typeorm';

// Do NOT export the options here, only the DataSource instance
const AppDataSource = new DataSource(dataSourceOptions as DataSourceOptions);

export default AppDataSource;
