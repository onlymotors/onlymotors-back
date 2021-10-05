const admin = require('firebase-admin');
const serviceAccount = require('../config/onlymotorsConnect.json');

const BUCKET = 'onlymotors-62493.appspot.com'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET
});

const bucket = admin.storage().bucket();

const uploadImage = (request, response, next) => {
  if (!request.file) return next();
  const image = request.file;
  const { userId } = request;

  const nomeArquivo = Date.now() + "." + image.originalname.split(".").pop();

  const file = bucket.file(`${userId}/` + nomeArquivo);

  const stream = file.createWriteStream({
    metedata: {
      contentType: image.mimetype,
    },
  });

  stream.on('error', (e) => {
    console.log(e);
  })

  stream.on('finish', async () => {
    await file.makePublic();
    request.file.urlImage = `https://storage.googleapis.com/${BUCKET}/${userId}/${nomeArquivo}`;
    next();
  });

  stream.end(image.buffer);

}

module.exports = uploadImage;