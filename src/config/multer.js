import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path'; // Extname é uma função do path do node que retorna a extensão de um arquivo.

export default {
  storage: multer.diskStorage({
    // Diz que os nossos aquivos serão guardados em uma pasta do nosso projeto.
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'), // Informamos o caminho onde serão salvos os arquivos.
    // No filename vamos dizer como vamos formatar o nosso arquivo, nesse caso, de imagem.
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    }
  })
};
