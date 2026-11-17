require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Base de datos PostgreSQL sincronizada correctamente.');
    app.listen(PORT, () => {
      console.log(`Servidor Lactenovo API escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar con la base de datos:', err);
    process.exit(1);
  });
