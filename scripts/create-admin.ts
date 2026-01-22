import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('lapesqueria2026', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lapesqueria.com' },
    update: {},
    create: {
      email: 'admin@lapesqueria.com',
      name: 'La Pesqueria Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('\n===========================================');
  console.log('  LA PESQUERIA OUTFITTERS - ADMIN LOGIN');
  console.log('===========================================\n');
  console.log('  Email:    admin@lapesqueria.com');
  console.log('  Password: lapesqueria2026');
  console.log('  Role:     ADMIN');
  console.log('\n  Admin ID:', adminUser.id);
  console.log('  Created:', adminUser.createdAt);
  console.log('\n===========================================\n');

  // Also create a staff user
  const staffPassword = await bcrypt.hash('lapesqueria2026', 12);
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@lapesqueria.com' },
    update: {},
    create: {
      email: 'staff@lapesqueria.com',
      name: 'La Pesqueria Staff',
      password: staffPassword,
      role: 'STAFF',
    },
  });

  console.log('  STAFF ACCOUNT (optional):');
  console.log('  Email:    staff@lapesqueria.com');
  console.log('  Password: lapesqueria2026');
  console.log('  Role:     STAFF');
  console.log('  Staff ID:', staffUser.id);
  console.log('\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
