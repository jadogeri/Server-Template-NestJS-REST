import { DataSource, DataSourceOptions } from 'typeorm';
import dataSourceOptions from './src/configs/type-orm.config'; // Ensure path is correct

// Do NOT export the options here, only the DataSource instance
const AppDataSource = new DataSource(dataSourceOptions as DataSourceOptions);

export default AppDataSource;
