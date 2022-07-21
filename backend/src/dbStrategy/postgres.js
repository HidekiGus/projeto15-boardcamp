import pkg from 'pg';

const { Pool } = pkg;

const connection = new Pool('postgres://bootcamp_role:senha_super_hiper_ultra_secreta_do_role_do_bootcamp@localhost:5432/boardcamp');

export default connection;

