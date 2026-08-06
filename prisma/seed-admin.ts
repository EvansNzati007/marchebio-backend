// prisma/seed.ts
import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcrypt';

const adapter = new PrismaMariaDb({
  host: 'mysql',
  port: 3306,
  user: 'evans_admm',
  password: 'marchebio241',
  database: 'marchebio_db',
});

const prisma = new PrismaClient({
  adapter,
});

// Mini images en base64 pour les produits (exemples)
const IMAGES = {
  TOMATE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wkDBTQndxZSMgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAKUlEQVR42u3NAQ0AAAgDIMe/6WsgQWQJjAts7MYAAACAvwABAAAAMMBAIAABoAgBAAAAAElFTkSuQmCC",
  LAITUE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wkDBTksRSa2XQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAKUlEQVR42u3NAQ0AAAgDIMe/6WsgQWQJjAts7MYAAACAvwABAAAAMMBAIAABoAgBAAAAAElFTkSuQmCC",
  CAROTTE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wkDBT4gecHZUgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAKUlEQVR42u3NAQ0AAAgDIMe/6WsgQWQJjAts7MYAAACAvwABAAAAMMBAIAABoAgBAAAAAElFTkSuQmCC",
  POMME: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wkDBT8awZx3RwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAKUlEQVR42u3NAQ0AAAgDIMe/6WsgQWQJjAts7MYAAACAvwABAAAAMMBAIAABoAgBAAAAAElFTkSuQmCC",
  BANANE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wkDBUASxMpVQAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAKUlEQVR42u3NAQ0AAAgDIMe/6WsgQWQJjAts7MYAAACAvwABAAAAMMBAIAABoAgBAAAAAElFTkSuQmCC",
  ORANGE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wkDBUAwNLYajwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAKUlEQVR42u3NAQ0AAAgDIMe/6WsgQWQJjAts7MYAAACAvwABAAAAMMBAIAABoAgBAAAAAElFTkSuQmCC",
};

async function main() {
  console.log('🌱 Début du seeding complet...');

  // 1. Créer l'admin (si non existant)
  const adminEmail = 'admin@marchebio.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        userName: 'Administrateur',
        password: hashedPassword,
        numTel: '077000000',
        adresse: 'Libreville, Gabon',
        role: 'ADMIN',
      },
    });
    console.log('✅ Administrateur créé');
  } else {
    console.log('ℹ️ Administrateur existe déjà');
  }

  // 2. Créer le producteur principal
  const producteurEmail = 'producteur1@test.com';
  const existingProducteur = await prisma.user.findUnique({
    where: { email: producteurEmail },
  });
  let producteur;
  if (!existingProducteur) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    producteur = await prisma.user.create({
      data: {
        email: producteurEmail,
        userName: 'Producteur Test',
        password: hashedPassword,
        numTel: '077000001',
        adresse: 'Ntoum, Gabon',
        role: 'PRODUCTEUR',
      },
    });
    console.log(`✅ Producteur créé : ${producteur.userName}`);
  } else {
    producteur = existingProducteur;
    console.log(`ℹ️ Producteur existe déjà : ${producteur.userName}`);
  }

  // 3. Créer l'acheteur (si non existant)
  const acheteurEmail = 'acheteur1@test.com';
  const existingAcheteur = await prisma.user.findUnique({
    where: { email: acheteurEmail },
  });
  if (!existingAcheteur) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await prisma.user.create({
      data: {
        email: acheteurEmail,
        userName: 'Acheteur Test',
        password: hashedPassword,
        numTel: '077000002',
        adresse: 'Libreville, Gabon',
        role: 'ACHETEUR',
      },
    });
    console.log('✅ Acheteur créé');
  } else {
    console.log('ℹ️ Acheteur existe déjà');
  }

  // 4. Créer les produits pour le producteur
  const produitsData = [
    {
      name: 'Tomates Bio',
      description: 'Tomates fraîches cultivées sans pesticides',
      price: 2.50,
      quantity: 50,
      photoData: IMAGES.TOMATE,
      photoMimeType: 'image/png',
    },
    {
      name: 'Laitue Bio',
      description: 'Laitue croquante et verte',
      price: 1.80,
      quantity: 30,
      photoData: IMAGES.LAITUE,
      photoMimeType: 'image/png',
    },
    {
      name: 'Carottes Bio',
      description: 'Carottes oranges riches en vitamines',
      price: 2.00,
      quantity: 40,
      photoData: IMAGES.CAROTTE,
      photoMimeType: 'image/png',
    },
    {
      name: 'Pommes Bio',
      description: 'Pommes sucrées et juteuses',
      price: 3.00,
      quantity: 25,
      photoData: IMAGES.POMME,
      photoMimeType: 'image/png',
    },
    {
      name: 'Bananes Bio',
      description: 'Bananes douces et énergétiques',
      price: 1.50,
      quantity: 60,
      photoData: IMAGES.BANANE,
      photoMimeType: 'image/png',
    },
    {
      name: 'Oranges Bio',
      description: 'Oranges juteuses pleines de vitamine C',
      price: 2.20,
      quantity: 35,
      photoData: IMAGES.ORANGE,
      photoMimeType: 'image/png',
    },
  ];

  // Vérifier si les produits existent déjà (on les crée seulement s'ils n'existent pas)
  let produitsCrees = 0;
  for (const produit of produitsData) {
    const existing = await prisma.product.findFirst({
      where: {
        name: produit.name,
        producteurId: producteur.id,
      },
    });
    if (!existing) {
      await prisma.product.create({
        data: {
          ...produit,
          producteurId: producteur.id,
        },
      });
      produitsCrees++;
    }
  }
  console.log(`✅ ${produitsCrees} nouveaux produits créés pour ${producteur.userName}`);

  // 5. Résumé final
  console.log('\n📋 RÉSUMÉ DES COMPTES DE TEST :');
  console.log(`🔵 Producteur : ${producteurEmail} / 123456`);
  console.log(`🟢 Acheteur   : acheteur1@test.com / 123456`);
  console.log(`🔴 Admin      : admin@marchebio.com / 123456`);
  console.log(`\n🌱 Seeding terminé avec succès !`);
}

main()
  .catch((error) => {
    console.error('❌ Erreur :', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
