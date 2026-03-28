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
const MENU_ITEMS = [
  { name: 'Chicken Burger',      category: 'Burgers',    sellingPrice: 149, costPrice: 65, isVeg: false, description: 'Juicy chicken patty with fresh veggies', variants: [{ name: 'Single', price: 149, costPrice: 65 }, { name: 'Double', price: 229, costPrice: 100 }] },
  { name: 'Veg Burger',          category: 'Burgers',    sellingPrice: 99,  costPrice: 35, isVeg: true,  description: 'Crispy veg patty with special sauce' },
  { name: 'Paneer Roll',         category: 'Rolls',      sellingPrice: 129, costPrice: 50, isVeg: true,  description: 'Spiced paneer in a soft wrap', variants: [{ name: 'Regular', price: 129, costPrice: 50 }, { name: 'Large', price: 179, costPrice: 70 }] },
  { name: 'Chicken Roll',        category: 'Rolls',      sellingPrice: 149, costPrice: 60, isVeg: false, description: 'Grilled chicken in a crispy wrap' },
  { name: 'Masala Fries',        category: 'Sides',      sellingPrice: 79,  costPrice: 25, isVeg: true,  description: 'Crispy fries with special masala', variants: [{ name: 'Small', price: 79, costPrice: 25 }, { name: 'Large', price: 119, costPrice: 40 }] },
  { name: 'Cheese Fries',        category: 'Sides',      sellingPrice: 109, costPrice: 38, isVeg: true },
  { name: 'Chicken Biryani',     category: 'Biryani',    sellingPrice: 199, costPrice: 90, isVeg: false, description: 'Aromatic basmati rice with tender chicken', variants: [{ name: 'Half', price: 199, costPrice: 90 }, { name: 'Full', price: 349, costPrice: 160 }] },
  { name: 'Veg Biryani',         category: 'Biryani',    sellingPrice: 159, costPrice: 60, isVeg: true,  variants: [{ name: 'Half', price: 159, costPrice: 60 }, { name: 'Full', price: 279, costPrice: 110 }] },
  { name: 'Cold Coffee',         category: 'Beverages',  sellingPrice: 89,  costPrice: 28, isVeg: true },
  { name: 'Mango Shake',         category: 'Beverages',  sellingPrice: 99,  costPrice: 32, isVeg: true },
  { name: 'Coca Cola',           category: 'Beverages',  sellingPrice: 49,  costPrice: 28, isVeg: true, variants: [{ name: '250ml', price: 49, costPrice: 28 }, { name: '500ml', price: 79, costPrice: 45 }] },
  { name: 'Chocolate Brownie',   category: 'Desserts',   sellingPrice: 99,  costPrice: 35, isVeg: true,  description: 'Rich chocolate brownie with vanilla ice cream' },
  { name: 'Gulab Jamun',         category: 'Desserts',   sellingPrice: 59,  costPrice: 18, isVeg: true,  variants: [{ name: '2 Pcs', price: 59, costPrice: 18 }, { name: '4 Pcs', price: 109, costPrice: 36 }] },
  { name: 'Chicken Wings',       category: 'Starters',   sellingPrice: 179, costPrice: 80, isVeg: false, variants: [{ name: '4 Pcs', price: 179, costPrice: 80 }, { name: '8 Pcs', price: 329, costPrice: 155 }] },
  { name: 'Veg Spring Rolls',    category: 'Starters',   sellingPrice: 119, costPrice: 42, isVeg: true,  variants: [{ name: '4 Pcs', price: 119, costPrice: 42 }, { name: '8 Pcs', price: 219, costPrice: 80 }] },
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
