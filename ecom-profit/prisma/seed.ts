// prisma/seed.ts
import { PrismaClient, PlatformType, ExpenseCategory, ExpenseType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123456', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@ecomprofit.pl' },
    update: {},
    create: {
      email: 'demo@ecomprofit.pl',
      name: 'Jan Kowalski',
      password: hashedPassword,
      companyName: 'Sklep Demo Sp. z o.o.',
      plan: 'PRO',
    },
  })

  console.log('✅ User created:', user.email)

  // Create platforms
  const allegro = await prisma.platform.upsert({
    where: { id: 'platform-allegro' },
    update: {},
    create: {
      id: 'platform-allegro',
      userId: user.id,
      name: 'Allegro',
      type: PlatformType.ALLEGRO,
      commissionRate: 8.5,
      isActive: true,
    },
  })

  const amazon = await prisma.platform.upsert({
    where: { id: 'platform-amazon' },
    update: {},
    create: {
      id: 'platform-amazon',
      userId: user.id,
      name: 'Amazon PL',
      type: PlatformType.AMAZON,
      commissionRate: 15,
      isActive: true,
    },
  })

  const olx = await prisma.platform.upsert({
    where: { id: 'platform-olx' },
    update: {},
    create: {
      id: 'platform-olx',
      userId: user.id,
      name: 'OLX',
      type: PlatformType.OLX,
      commissionRate: 5,
      isActive: true,
    },
  })

  const woo = await prisma.platform.upsert({
    where: { id: 'platform-woo' },
    update: {},
    create: {
      id: 'platform-woo',
      userId: user.id,
      name: 'Sklep WooCommerce',
      type: PlatformType.WOOCOMMERCE,
      commissionRate: 0,
      isActive: true,
    },
  })

  console.log('✅ Platforms created')

  // Create products
  const products = [
    {
      id: 'prod-1',
      name: 'Słuchawki Bluetooth Premium',
      sku: 'SB-001',
      purchasePrice: 89.99,
      sellingPrice: 199.99,
      stock: 45,
      minStock: 10,
      platformId: allegro.id,
      category: 'Elektronika',
    },
    {
      id: 'prod-2',
      name: 'Powerbank 20000mAh',
      sku: 'PB-002',
      purchasePrice: 49.99,
      sellingPrice: 129.99,
      stock: 120,
      minStock: 20,
      platformId: allegro.id,
      category: 'Elektronika',
    },
    {
      id: 'prod-3',
      name: 'Mata do jogi antypoślizgowa',
      sku: 'MJ-003',
      purchasePrice: 29.99,
      sellingPrice: 89.99,
      stock: 8,
      minStock: 15,
      platformId: amazon.id,
      category: 'Sport',
    },
    {
      id: 'prod-4',
      name: 'Kubek termiczny 500ml',
      sku: 'KT-004',
      purchasePrice: 24.99,
      sellingPrice: 69.99,
      stock: 200,
      minStock: 30,
      platformId: woo.id,
      category: 'Dom i Kuchnia',
    },
    {
      id: 'prod-5',
      name: 'Zestaw noży kuchennych',
      sku: 'ZN-005',
      purchasePrice: 59.99,
      sellingPrice: 149.99,
      stock: 35,
      minStock: 10,
      platformId: olx.id,
      category: 'Dom i Kuchnia',
    },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, userId: user.id },
    })
  }

  console.log('✅ Products created')

  // Create monthly expenses
  const expenses = [
    { name: 'ZUS przedsiębiorcy', category: ExpenseCategory.ZUS, type: ExpenseType.FIXED, amount: 1600, isRecurring: true, recurringDay: 10 },
    { name: 'Biuro rachunkowe', category: ExpenseCategory.ACCOUNTING, type: ExpenseType.FIXED, amount: 350, isRecurring: true, recurringDay: 5 },
    { name: 'Najem magazynu', category: ExpenseCategory.WAREHOUSE, type: ExpenseType.FIXED, amount: 1200, isRecurring: true, recurringDay: 1 },
    { name: 'Opakowania - styczeń', category: ExpenseCategory.PACKAGING, type: ExpenseType.VARIABLE, amount: 890, isRecurring: false },
    { name: 'Paliwo - styczeń', category: ExpenseCategory.FUEL, type: ExpenseType.VARIABLE, amount: 450, isRecurring: false },
    { name: 'Reklamy Allegro Ads', category: ExpenseCategory.ADS, type: ExpenseType.VARIABLE, amount: 2100, isRecurring: false },
    { name: 'Google Ads', category: ExpenseCategory.ADS, type: ExpenseType.VARIABLE, amount: 800, isRecurring: false },
  ]

  for (const e of expenses) {
    await prisma.expense.create({
      data: { ...e, userId: user.id, date: new Date() },
    })
  }

  console.log('✅ Expenses created')

  // Create sales (last 30 days)
  const salesData = [
    { productId: 'prod-1', platformId: allegro.id, quantity: 15, unitPrice: 199.99, commission: 17, adsCost: 5.5, shippingCost: 12, packagingCost: 3, returnRate: 3, vatRate: 23 },
    { productId: 'prod-2', platformId: allegro.id, quantity: 28, unitPrice: 129.99, commission: 11, adsCost: 3.5, shippingCost: 10, packagingCost: 2.5, returnRate: 2, vatRate: 23 },
    { productId: 'prod-3', platformId: amazon.id, quantity: 42, unitPrice: 89.99, commission: 13.5, adsCost: 4, shippingCost: 9, packagingCost: 2, returnRate: 5, vatRate: 23 },
    { productId: 'prod-4', platformId: woo.id, quantity: 67, unitPrice: 69.99, commission: 0, adsCost: 2, shippingCost: 8, packagingCost: 1.5, returnRate: 1, vatRate: 23 },
    { productId: 'prod-5', platformId: olx.id, quantity: 19, unitPrice: 149.99, commission: 7.5, adsCost: 3, shippingCost: 11, packagingCost: 2.5, returnRate: 4, vatRate: 23 },
  ]

  for (const s of salesData) {
    const totalRevenue = s.quantity * s.unitPrice
    const commissionCost = totalRevenue * (s.commission / 100)
    const adsCost = s.adsCost * s.quantity
    const shipping = s.shippingCost * s.quantity
    const packaging = s.packagingCost * s.quantity
    const returnCost = totalRevenue * (s.returnRate / 100) * 0.3
    const product = await prisma.product.findUnique({ where: { id: s.productId } })
    const purchaseCost = (product?.purchasePrice ?? 0) * s.quantity
    const netProfit = totalRevenue - commissionCost - adsCost - shipping - packaging - returnCost - purchaseCost
    const grossMargin = (netProfit / totalRevenue) * 100

    // Create multiple sales spread over last 30 days
    for (let i = 0; i < 4; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const soldAt = new Date()
      soldAt.setDate(soldAt.getDate() - daysAgo)

      await prisma.sale.create({
        data: {
          userId: user.id,
          productId: s.productId,
          platformId: s.platformId,
          quantity: Math.ceil(s.quantity / 4),
          unitPrice: s.unitPrice,
          totalRevenue: totalRevenue / 4,
          commission: commissionCost / 4,
          adsCost: adsCost / 4,
          shippingCost: shipping / 4,
          packagingCost: packaging / 4,
          returnRate: s.returnRate,
          returnCost: returnCost / 4,
          vatRate: s.vatRate,
          netProfit: netProfit / 4,
          grossMargin,
          soldAt,
        },
      })
    }
  }

  console.log('✅ Sales created')
  console.log('\n🎉 Seed completed!')
  console.log('📧 Login: demo@ecomprofit.pl')
  console.log('🔑 Password: demo123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
