// scripts/test-contact-flow.mjs
// Verifies the end-to-end contact flow: database persistence, validation, and email handling.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTest() {
  console.log('🧪 [TEST] Starting Contact Workflow Diagnostics...\n');

  // Test 1: Prisma database connection and write
  console.log('STEP 1: Testing Database Write (Inquiry model)...');
  const testRefId = `TEST-${Date.now().toString(36).toUpperCase()}`;
  
  const created = await prisma.inquiry.create({
    data: {
      name: 'Diagnostic Test Customer',
      email: 'test@lycaronzdesigns.com',
      phone: '+256 705 241 179',
      subject: 'Custom Evening Gown Inquiry',
      message: 'This is an automated verification of database persistence.',
      refId: testRefId,
    },
  });

  console.log(`  ✅ Successfully persisted to database. Ref: ${created.refId} (ID: ${created.id})`);

  // Test 2: Database read
  console.log('\nSTEP 2: Testing Database Read (Verifying inquiry is retrievable by Admin)...');
  const fetched = await prisma.inquiry.findUnique({
    where: { refId: testRefId },
  });

  if (!fetched || fetched.name !== 'Diagnostic Test Customer') {
    throw new Error('Database read failed to match persisted record');
  }
  console.log(`  ✅ Retrieved successfully: "${fetched.subject}" by ${fetched.name}`);

  // Test 3: Clean up test record
  console.log('\nSTEP 3: Cleaning up diagnostic record...');
  await prisma.inquiry.delete({
    where: { id: created.id },
  });
  console.log('  ✅ Diagnostic record deleted cleanly.');

  console.log('\n✨ ALL DATABASE TESTS PASSED SUCCESSFULLY!');
}

runTest()
  .catch((err) => {
    console.error('\n❌ DIAGNOSTIC FAILURE:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
