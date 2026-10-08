import 'dotenv/config';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { categoriesData } from '../../src/data/productsData.js';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seed] Connected successfully.');

    // 1. Seed or Update Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@yashclothstores.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const newAdmin = new Admin({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      await newAdmin.save();
      console.log(`[Seed] Admin user created: ${adminEmail}`);
    } else {
      console.log(`[Seed] Admin user already exists: ${adminEmail}`);
    }

    // 2. Seed the 9 Categories
    console.log('[Seed] Seeding categories...');
    for (let i = 0; i < categoriesData.length; i++) {
      const cat = categoriesData[i];
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        {
          name: cat.name,
          slug: cat.slug,
          tagline: cat.tagline || '',
          description: cat.description || '',
          coverImage: cat.coverImage || '',
          badge: cat.badge || 'Available in Store',
          itemCountText: cat.itemCountText || '',
          order: i + 1,
        },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Seeded ${categoriesData.length} categories.`);

    // 3. Migrate existing products from static data across all categories
    console.log('[Seed] Migrating products across all categories...');
    let migratedCount = 0;

    for (const cat of categoriesData) {
      if (!cat.products || cat.products.length === 0) continue;

      for (const prod of cat.products) {
        const existingProd = await Product.findOne({ name: prod.name });
        if (!existingProd) {
          const formattedImages = prod.images.map((img) => ({
            url: typeof img === 'string' ? img : img.url,
            public_id: img.public_id || '',
          }));

          const newProduct = new Product({
            name: prod.name,
            category: prod.category || cat.name,
            categoryId: prod.categoryId || cat.id,
            shortDescription: prod.shortDescription || '',
            description: prod.description || '',
            price: prod.price || null,
            size: prod.size || '',
            details: prod.details || {},
            images: formattedImages,
            tags: prod.tags || [],
            available: true,
            isHidden: false,
          });

          await newProduct.save();
          migratedCount++;
        }
      }
    }

    console.log(`[Seed] Migrated ${migratedCount} new products into MongoDB.`);
    console.log('[Seed] All seeding complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
