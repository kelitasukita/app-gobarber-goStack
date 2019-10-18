module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timeStamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
