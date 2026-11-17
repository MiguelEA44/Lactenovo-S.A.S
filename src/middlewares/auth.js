const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado: token no proporcionado' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  jwt.verify(parts[1], process.env.JWT_SECRET || 'secret_dev', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token expirado o inválido' });
    }
    req.user = decoded;
    next();
  });
};

const verificarRol = (rolesPermitidos) => (req, res, next) => {
  if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
    return res.status(403).json({ error: 'No tiene permisos para realizar esta acción' });
  }
  next();
};

module.exports = { verificarToken, verificarRol };
