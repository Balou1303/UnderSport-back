import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// On recrée __dirname pour les modules ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // On pointe bien vers le dossier 'public/picture'
    // Le chemin est relatif à la racine du projet où on lance le serveur
    callback(null, 'public/picture');
  },
  filename: (req, file, callback) => {
    // nettoie le nom du fichier
    // remplace les espaces par des underscores pour éviter les bugs d'URL
    const name = file.originalname.split(' ').join('_').split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    
    // Ajout d'un timestamp (Date.now()) pour rendre le nom unique
    callback(null, name + Date.now() + '.' + extension);
  }
});

export default multer({ storage: storage }).single('image');