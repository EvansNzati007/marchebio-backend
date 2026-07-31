export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),

  database: {
    host: process.env.DATABASE_HOST ?? 'mysql',
    port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    name: process.env.MYSQL_DATABASE,
  },
});
