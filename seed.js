import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

// ── Models (inline to avoid import issues) ────────────────────
const userSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, password: String });
const User = mongoose.model('User', userSchema);

const menuItemSchema = new mongoose.Schema({
  name: String, category: String, sellingPrice: Number, costPrice: { type: Number, default: 0 },
  description: String, isActive: { type: Boolean, default: true }, isVeg: { type: Boolean, default: true },
  variants: [{ name: String, price: Number, costPrice: { type: Number, default: 0 } }],
});
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

const settingsSchema = new mongoose.Schema({ businessName: String, currency: String, currencySymbol: String, taxRate: Number, taxLabel: String, invoiceNote: String, address: String, phone: String, email: String });
const Settings = mongoose.model('Settings', settingsSchema);

const expenseSchema = new mongoose.Schema({ title: String, amount: Number, category: String, note: String, date: { type: Date, default: Date.now } });
const Expense = mongoose.model('Expense', expenseSchema);

const inventorySchema = new mongoose.Schema({ name: String, unit: String, currentStock: Number, minStock: Number, costPerUnit: Number });
const Inventory = mongoose.model('Inventory', inventorySchema);

// ── Sample Data ───────────────────────────────────────────────
// const MENU_ITEMS = [
//   { name: 'Chicken Burger',      category: 'Burgers',    sellingPrice: 149, costPrice: 65, isVeg: false, description: 'Juicy chicken patty with fresh veggies', variants: [{ name: 'Single', price: 149, costPrice: 65 }, { name: 'Double', price: 229, costPrice: 100 }] },
//   { name: 'Veg Burger',          category: 'Burgers',    sellingPrice: 99,  costPrice: 35, isVeg: true,  description: 'Crispy veg patty with special sauce' },
//   { name: 'Paneer Roll',         category: 'Rolls',      sellingPrice: 129, costPrice: 50, isVeg: true,  description: 'Spiced paneer in a soft wrap', variants: [{ name: 'Regular', price: 129, costPrice: 50 }, { name: 'Large', price: 179, costPrice: 70 }] },
//   { name: 'Chicken Roll',        category: 'Rolls',      sellingPrice: 149, costPrice: 60, isVeg: false, description: 'Grilled chicken in a crispy wrap' },
//   { name: 'Masala Fries',        category: 'Sides',      sellingPrice: 79,  costPrice: 25, isVeg: true,  description: 'Crispy fries with special masala', variants: [{ name: 'Small', price: 79, costPrice: 25 }, { name: 'Large', price: 119, costPrice: 40 }] },
//   { name: 'Cheese Fries',        category: 'Sides',      sellingPrice: 109, costPrice: 38, isVeg: true },
//   { name: 'Chicken Biryani',     category: 'Biryani',    sellingPrice: 199, costPrice: 90, isVeg: false, description: 'Aromatic basmati rice with tender chicken', variants: [{ name: 'Half', price: 199, costPrice: 90 }, { name: 'Full', price: 349, costPrice: 160 }] },
//   { name: 'Veg Biryani',         category: 'Biryani',    sellingPrice: 159, costPrice: 60, isVeg: true,  variants: [{ name: 'Half', price: 159, costPrice: 60 }, { name: 'Full', price: 279, costPrice: 110 }] },
//   { name: 'Cold Coffee',         category: 'Beverages',  sellingPrice: 89,  costPrice: 28, isVeg: true },
//   { name: 'Mango Shake',         category: 'Beverages',  sellingPrice: 99,  costPrice: 32, isVeg: true },
//   { name: 'Coca Cola',           category: 'Beverages',  sellingPrice: 49,  costPrice: 28, isVeg: true, variants: [{ name: '250ml', price: 49, costPrice: 28 }, { name: '500ml', price: 79, costPrice: 45 }] },
//   { name: 'Chocolate Brownie',   category: 'Desserts',   sellingPrice: 99,  costPrice: 35, isVeg: true,  description: 'Rich chocolate brownie with vanilla ice cream' },
//   { name: 'Gulab Jamun',         category: 'Desserts',   sellingPrice: 59,  costPrice: 18, isVeg: true,  variants: [{ name: '2 Pcs', price: 59, costPrice: 18 }, { name: '4 Pcs', price: 109, costPrice: 36 }] },
//   { name: 'Chicken Wings',       category: 'Starters',   sellingPrice: 179, costPrice: 80, isVeg: false, variants: [{ name: '4 Pcs', price: 179, costPrice: 80 }, { name: '8 Pcs', price: 329, costPrice: 155 }] },
//   { name: 'Veg Spring Rolls',    category: 'Starters',   sellingPrice: 119, costPrice: 42, isVeg: true,  variants: [{ name: '4 Pcs', price: 119, costPrice: 42 }, { name: '8 Pcs', price: 219, costPrice: 80 }] },
// ];

const MENU_ITEMS = [
  {
    name: 'Spinach Sandwich',
    category: 'Sandwich',
    sellingPrice: null,
    costPrice: null,
    isVeg: true,
    description: 'Minced spinach with mozzarella cheese, corns, served in fresh bread'
  },
  {
    name: 'Healthy Sandwich',
    category: 'Sandwich',
    sellingPrice: null,
    costPrice: null,
    isVeg: true,
    description: 'Multigrain bread with low fat yogurt and fresh veggies'
  },

  {
    name: 'Besan Cheela',
    category: 'Cheela',
    sellingPrice: null,
    costPrice: null,
    isVeg: true,
    description: 'Same as moong dal cheela'
  },
  {
    name: 'Moong Dal Cheela',
    category: 'Cheela',
    sellingPrice: null,
    costPrice: null,
    isVeg: true,
    description: 'With spinach, broccoli, carrots, served with chutney'
  },

  {
    name: 'Moong Dal Khichdi',
    category: 'Khichdi',
    sellingPrice: null,
    costPrice: null,
    isVeg: true,
    description: 'Light nourishing meal with desi ghee, papad, achar'
  },
  {
    name: 'Moong Dal Khichdi Veg Mix',
    category: 'Khichdi',
    sellingPrice: null,
    costPrice: null,
    isVeg: true,
    description: 'Khichdi with mixed vegetables'
  },

  {
    name: 'Plain Cheese Pizza',
    category: 'Pizza',
    sellingPrice: 220,
    costPrice: 110,
    isVeg: true,
    description: 'Classic cheese pizza',
    variants: [{ name: 'Regular', price: 220, costPrice: 110 }]
  },
  {
    name: 'Cheese Onion Capsicum Pizza',
    category: 'Pizza',
    sellingPrice: 260,
    costPrice: 130,
    isVeg: true,
    description: 'Loaded with onion and capsicum',
    variants: [{ name: 'Regular', price: 260, costPrice: 130 }]
  },
  {
    name: 'Mushroom Pizza',
    category: 'Pizza',
    sellingPrice: 260,
    costPrice: 130,
    isVeg: true,
    description: 'Topped with mushrooms',
    variants: [{ name: 'Regular', price: 260, costPrice: 130 }]
  },
  {
    name: 'Corn Pizza',
    category: 'Pizza',
    sellingPrice: 300,
    costPrice: 150,
    isVeg: true,
    description: 'Sweet corn pizza',
    variants: [{ name: 'Regular', price: 300, costPrice: 150 }]
  },
  {
    name: 'Farmhouse Pizza',
    category: 'Pizza',
    sellingPrice: 300,
    costPrice: 150,
    isVeg: true,
    description: 'Veg loaded farmhouse pizza',
    variants: [{ name: 'Regular', price: 300, costPrice: 150 }]
  },
  {
    name: 'Pineapple Pizza',
    category: 'Pizza',
    sellingPrice: 300,
    costPrice: 150,
    isVeg: true,
    description: 'Pineapple topping pizza',
    variants: [{ name: 'Regular', price: 300, costPrice: 150 }]
  },
  {
    name: 'Spinach Pizza',
    category: 'Pizza',
    sellingPrice: 350,
    costPrice: 175,
    isVeg: true,
    description: 'Spinach loaded pizza',
    variants: [{ name: 'Regular', price: 350, costPrice: 175 }]
  },

  {
    name: 'Plain Noodles',
    category: 'Noodles',
    sellingPrice: 160,
    costPrice: 80,
    isVeg: true,
    description: 'Simple noodles',
    variants: [{ name: 'Regular', price: 160, costPrice: 80 }]
  },
  {
    name: 'Veg Noodles',
    category: 'Noodles',
    sellingPrice: 180,
    costPrice: 90,
    isVeg: true,
    description: 'Veg noodles',
    variants: [{ name: 'Regular', price: 180, costPrice: 90 }]
  },
  {
    name: 'Hakka Noodles',
    category: 'Noodles',
    sellingPrice: 200,
    costPrice: 100,
    isVeg: true,
    description: 'Hakka style noodles',
    variants: [{ name: 'Regular', price: 200, costPrice: 100 }]
  },

  {
    name: 'Manchurian Gravy',
    category: 'Manchurian',
    sellingPrice: 170,
    costPrice: 85,
    isVeg: true,
    description: 'Manchurian gravy',
    variants: [{ name: 'Regular', price: 170, costPrice: 85 }]
  },
  {
    name: 'Manchurian Dry',
    category: 'Manchurian',
    sellingPrice: 170,
    costPrice: 85,
    isVeg: true,
    description: 'Dry manchurian',
    variants: [{ name: 'Regular', price: 170, costPrice: 85 }]
  },

  {
    name: 'Fried Rice',
    category: 'Rice',
    sellingPrice: 160,
    costPrice: 80,
    isVeg: true,
    description: 'Veg fried rice',
    variants: [{ name: 'Regular', price: 160, costPrice: 80 }]
  },

  {
    name: 'Anda Paratha',
    category: 'Paratha',
    sellingPrice: 100,
    costPrice: 50,
    isVeg: false,
    description: 'Egg paratha',
    variants: [{ name: 'Regular', price: 100, costPrice: 50 }]
  },

  {
    name: 'Idli (2 pcs)',
    category: 'South Indian',
    sellingPrice: 80,
    costPrice: 40,
    isVeg: true,
    description: 'Soft idlis',
    variants: [{ name: '2 pcs', price: 80, costPrice: 40 }]
  },
  {
    name: 'Idli Pops (8 pcs)',
    category: 'South Indian',
    sellingPrice: 80,
    costPrice: 40,
    isVeg: true,
    description: 'Mini idli pops',
    variants: [{ name: '8 pcs', price: 80, costPrice: 40 }]
  },

  {
    name: 'Moong Dal Cheela (Stuffed)',
    category: 'Cheela',
    sellingPrice: 110,
    costPrice: 55,
    isVeg: true,
    description: 'Stuffed cheela',
    variants: [{ name: 'Stuffed', price: 110, costPrice: 55 }]
  },
  {
    name: 'Besan Cheela (Stuffed)',
    category: 'Cheela',
    sellingPrice: 110,
    costPrice: 55,
    isVeg: true,
    description: 'Stuffed besan cheela',
    variants: [{ name: 'Stuffed', price: 110, costPrice: 55 }]
  },
  {
    name: 'Moong Dal Cheela (Plain)',
    category: 'Cheela',
    sellingPrice: 60,
    costPrice: 30,
    isVeg: true,
    description: 'Plain cheela',
    variants: [{ name: 'Plain', price: 60, costPrice: 30 }]
  },

  {
    name: 'Green Moong Dal Khichdi (Plain)',
    category: 'Khichdi',
    sellingPrice: 175,
    costPrice: 90,
    isVeg: true,
    description: 'Green moong khichdi',
    variants: [{ name: 'Regular', price: 175, costPrice: 90 }]
  },

  {
    name: 'Plain Veg Sandwich',
    category: 'Sandwich',
    sellingPrice: 60,
    costPrice: 30,
    isVeg: true,
    description: 'Simple veg sandwich',
    variants: [{ name: 'Regular', price: 60, costPrice: 30 }]
  },
  {
    name: 'Cheese Veg Sandwich',
    category: 'Sandwich',
    sellingPrice: 80,
    costPrice: 40,
    isVeg: true,
    description: 'Cheese sandwich',
    variants: [{ name: 'Regular', price: 80, costPrice: 40 }]
  },
  {
    name: 'Spinach Cheese Sandwich',
    category: 'Sandwich',
    sellingPrice: 120,
    costPrice: 60,
    isVeg: true,
    description: 'Spinach cheese sandwich',
    variants: [{ name: 'Regular', price: 120, costPrice: 60 }]
  },
  {
    name: 'Paneer Sandwich',
    category: 'Sandwich',
    sellingPrice: 100,
    costPrice: 50,
    isVeg: true,
    description: 'Paneer sandwich',
    variants: [{ name: 'Regular', price: 100, costPrice: 50 }]
  },
  {
    name: 'Healthy Veg Sandwich',
    category: 'Sandwich',
    sellingPrice: 120,
    costPrice: 60,
    isVeg: true,
    description: 'Healthy sandwich',
    variants: [{ name: 'Regular', price: 120, costPrice: 60 }]
  },

  {
    name: 'Aloo Tikki Burger',
    category: 'Burger',
    sellingPrice: 60,
    costPrice: 30,
    isVeg: true,
    description: 'Aloo tikki burger',
    variants: [{ name: 'Regular', price: 60, costPrice: 30 }]
  },
  {
    name: 'Cheese Burger',
    category: 'Burger',
    sellingPrice: 120,
    costPrice: 60,
    isVeg: true,
    description: 'Cheese burger',
    variants: [{ name: 'Regular', price: 120, costPrice: 60 }]
  },
  {
    name: 'Paneer Burger',
    category: 'Burger',
    sellingPrice: 120,
    costPrice: 60,
    isVeg: true,
    description: 'Paneer burger',
    variants: [{ name: 'Regular', price: 120, costPrice: 60 }]
  },
  {
    name: 'Healthy Patty Burger',
    category: 'Burger',
    sellingPrice: 150,
    costPrice: 75,
    isVeg: true,
    description: 'Healthy patty burger',
    variants: [{ name: 'Regular', price: 150, costPrice: 75 }]
  }
];

const EXPENSES = [
  { title: 'Monthly Rent',     amount: 15000, category: 'Rent',        note: 'Kitchen space rent' },
  { title: 'LPG Gas Refill',   amount: 1800,  category: 'Gas',         note: '2 cylinders' },
  { title: 'Electricity Bill', amount: 3200,  category: 'Electricity', note: 'June bill' },
  { title: 'Staff Salary',     amount: 18000, category: 'Labour',      note: '2 helpers' },
  { title: 'Packaging Material', amount: 2400, category: 'Packaging', note: 'Boxes and bags' },
  { title: 'Marketing - Swiggy Ads', amount: 2000, category: 'Marketing', note: 'Promoted listing' },
];

const INVENTORY_ITEMS = [
  { name: 'Chicken Breast',   unit: 'kg',     currentStock: 8,   minStock: 3,  costPerUnit: 220 },
  { name: 'Paneer',           unit: 'kg',     currentStock: 2,   minStock: 2,  costPerUnit: 320 },
  { name: 'Burger Buns',      unit: 'piece',  currentStock: 60,  minStock: 20, costPerUnit: 8 },
  { name: 'Basmati Rice',     unit: 'kg',     currentStock: 15,  minStock: 5,  costPerUnit: 85 },
  { name: 'Refined Oil',      unit: 'litre',  currentStock: 3,   minStock: 2,  costPerUnit: 130 },
  { name: 'Potatoes',         unit: 'kg',     currentStock: 10,  minStock: 4,  costPerUnit: 30 },
  { name: 'Cheese Slices',    unit: 'piece',  currentStock: 40,  minStock: 15, costPerUnit: 12 },
  { name: 'Wraps/Rotis',      unit: 'piece',  currentStock: 80,  minStock: 30, costPerUnit: 5 },
  { name: 'Coca Cola Stock',  unit: 'piece',  currentStock: 1,   minStock: 12, costPerUnit: 28 }, // intentionally low
  { name: 'Chocolate Sauce',  unit: 'litre',  currentStock: 0.5, minStock: 1,  costPerUnit: 250 }, // intentionally low
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      MenuItem.deleteMany({}),
      Settings.deleteMany({}),
      Expense.deleteMany({}),
      Inventory.deleteMany({}),
    ]);
    console.log('🧹 Cleared existing data');

    // Create Admin user
    const hashedPwd = await bcrypt.hash('admin123', 12);
    const admin = await User.create({ name: 'Admin', email: 'admin@kitchen.com', password: hashedPwd });
    console.log(`👤 Admin created: admin@kitchen.com / admin123`);

    // Create Menu Items
    const menu = await MenuItem.insertMany(MENU_ITEMS);
    console.log(`🍔 Created ${menu.length} menu items`);

    // Create Settings
    await Settings.create({
      businessName: 'CloudKitchen Express',
      currency: 'INR', currencySymbol: '₹',
      taxRate: 5, taxLabel: 'GST',
      invoiceNote: 'Thank you for ordering from CloudKitchen Express! 🍴',
      address: '123, Food Street, Sector 14, Gurugram, Haryana - 122001',
      phone: '+91 98765 43210',
      email: 'orders@cloudkitchen.in',
    });
    console.log('⚙️  Settings created');

    // Create Expenses
    await Expense.insertMany(EXPENSES.map(e => ({ ...e, date: new Date() })));
    console.log(`💸 Created ${EXPENSES.length} expenses`);

    // Create Inventory
    await Inventory.insertMany(INVENTORY_ITEMS.map(i => ({ ...i, lastUpdated: new Date() })));
    console.log(`📦 Created ${INVENTORY_ITEMS.length} inventory items`);

    console.log('\n🎉 Seed complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Login: admin@kitchen.com');
    console.log('  Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
