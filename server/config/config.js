//=====================
// Puertoooo
// ====================
process.env.PORT = process.env.PORT || 3000;

//=====================
// Vencimiento del token
// ====================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//=====================
// SEED
// ====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
