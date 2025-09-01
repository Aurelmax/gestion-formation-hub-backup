import bcrypt from 'bcrypt';

// Mot de passe que vous souhaitez utiliser
const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then(hash => {
  console.log('Votre hash pour le mot de passe', password, 'est:');
  console.log(hash);
  console.log('Copiez ce hash dans le champ password de votre utilisateur dans Prisma Studio');
}).catch(err => {
  console.error('Erreur lors de la génération du hash:', err);
});
