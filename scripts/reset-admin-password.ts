import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'shenna.rangel@yahoo.com';
  const newPassword = 'Admin123!Temporary'; 
  
  console.log(`🔄 Resetting password for ${email}...`);
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { 
        password: hashedPassword,
        role: 'ADMIN' // Ensure they are admin
      },
      create: {
        email,
        password: hashedPassword,
        name: 'Shenna Rangel',
        role: 'ADMIN',
      },
    });
    
    console.log('✅ Success! Admin credentials updated.');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log('⚠️  IMPORTANT: Please login and change this password immediately.');
    
  } catch (error) {
    console.error('❌ Error resetting password:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
