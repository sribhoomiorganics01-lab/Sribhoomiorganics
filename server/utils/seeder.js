const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  { name: 'Traditional Rice & Millets', icon: '🍚', description: 'Heritage rice varieties and nutrient-rich millets from traditional farms', order: 1 },
  { name: 'Organic Ghee & Oils', icon: '🫒', description: 'Pure A2 ghee and cold-pressed oils made using traditional methods', order: 2 },
  { name: 'Flours & Grains', icon: '🌾', description: 'Stone-ground flours and whole grains for wholesome nutrition', order: 3 },
  { name: 'Traditional Sweets & Snacks', icon: '🍪', description: 'Authentic village-style sweets and crunchy snacks', order: 4 },
  { name: 'Herbal & Health Products', icon: '🌿', description: 'Natural herbs and wellness supplements', order: 5 },
  { name: 'Spices & Seasonings', icon: '🌶️', description: 'Farm-fresh spices and masalas ground to perfection', order: 6 },
  { name: 'Pulses & Dry Fruits', icon: '🫘', description: 'Protein-rich pulses and premium quality dry fruits', order: 7 },
  { name: 'Natural Personal Care', icon: '🧴', description: 'Chemical-free personal care products', order: 8 },
  { name: 'Jaggery & Sweeteners', icon: '🍯', description: 'Pure jaggery and natural sweeteners', order: 9 },
  { name: 'Tea & Beverages', icon: '🍵', description: 'Organic teas and refreshing beverages', order: 10 }
];

const products = [
  // Traditional Rice & Millets
  {
    name: 'Mapillai Samba Rice',
    category: 'Traditional Rice & Millets',
    price: 280,
    stock: 80,
    unit: '1 kg',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    description: 'Traditional bride groom rice, unpolished and stone-milled. Known for its strengthening properties and distinct aroma. Perfect for making Pongal and kanji. Source from organic farms in Tamil Nadu.'
  },
  {
    name: 'Seeraga Samba Rice',
    category: 'Traditional Rice & Millets',
    price: 320,
    stock: 75,
    unit: '1 kg',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    description: 'Premium small-grained aromatic rice, the finest variety for biryani. Easy to digest and diabetic-friendly. Stone-polished to retain natural nutrients. A heritage grain from South India.'
  },
  {
    name: 'Karuppu Kavuni Rice',
    category: 'Traditional Rice & Millets',
    price: 350,
    stock: 50,
    unit: '1 kg',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    description: 'Rare black rice variety, naturally pigmented with anthocyanin. Rich in antioxidants and iron. Traditional medicinal rice used for special occasions. Unpolished and unprocessed.'
  },
  {
    name: 'Kattuyanam Rice',
    category: 'Traditional Rice & Millets',
    price: 290,
    stock: 60,
    unit: '1 kg',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    description: 'Ancient medicinal rice variety with extraordinary health benefits. High in protein and fiber. Traditionally used for lactating mothers and recovering patients. Very easy to digest.'
  },
  {
    name: 'Foxtail Millet',
    category: 'Traditional Rice & Millets',
    price: 180,
    stock: 90,
    unit: '500g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop',
    description: 'One of the oldest known millets, high in iron and dietary fiber. Perfect substitute for rice in everyday meals. Promotes heart health and helps manage blood sugar levels.'
  },
  {
    name: 'Little Millet',
    category: 'Traditional Rice & Millets',
    price: 160,
    stock: 85,
    unit: '500g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop',
    description: 'Nutrient-dense small millet, easy to cook and digest. Rich in phosphorus and calcium. Ideal for weight watchers and diabetics. Makes fluffy rice-like preparation.'
  },
  {
    name: 'Kodo Millet',
    category: 'Traditional Rice & Millets',
    price: 170,
    stock: 80,
    unit: '500g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop',
    description: 'Protein-rich millet with bitter compounds known for therapeutic properties. Excellent for managing diabetes and weight. High in fiber content. Traditional staple of tribal communities.'
  },
  {
    name: 'Barnyard Millet',
    category: 'Traditional Rice & Millets',
    price: 175,
    stock: 75,
    unit: '500g',
    featured: true,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop',
    description: 'Fastest growing millet, also known as Sanwa. Very high in fiber and minerals. Easy to digest and gluten-free. Perfect for upma, kheer, and rice dishes.'
  },
  {
    name: 'Pearl Millet (Bajra)',
    category: 'Traditional Rice & Millets',
    price: 140,
    stock: 95,
    unit: '500g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop',
    description: 'Robust millet perfect for winter. High in energy and iron content. Traditional staple in Rajasthan. Makes nutritious rotis and khichdi. Supports bone health.'
  },
  {
    name: 'Proso Millet',
    category: 'Traditional Rice & Millets',
    price: 165,
    stock: 70,
    unit: '500g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop',
    description: 'Mild-flavored millet, easiest to digest among all varieties. High in protein and B vitamins. Cooks quickly like rice. Great for everyday healthy meals.'
  },

  // Organic Ghee & Oils
  {
    name: 'A2 Gir Cow Ghee',
    category: 'Organic Ghee & Oils',
    price: 850,
    salePrice: 750,
    stock: 45,
    unit: '500g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1630003099850-hosting-assets-bce28e4c2d2c?w=400&h=400&fit=crop',
    description: 'Premium A2 ghee made from Gir cow milk using traditional bilona method. Contains beta-casein protein. Rich in vitamins A, D, E, and K. Authentic taste and aroma. Lab tested for purity.'
  },
  {
    name: 'A2 Ghee - Small Pack',
    category: 'Organic Ghee & Oils',
    price: 480,
    salePrice: 420,
    stock: 60,
    unit: '250g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1630003099850-hosting-assets-bce28e4c2d2c?w=400&h=400&fit=crop',
    description: 'Pure A2 gir cow ghee, small pack for first-time try. Made with traditional Vedic process. Contains no added chemicals or preservatives. Perfect for infants and elderly.'
  },
  {
    name: 'Cold Pressed Coconut Oil',
    category: 'Organic Ghee & Oils',
    price: 380,
    stock: 70,
    unit: '500ml',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop',
    description: 'Wood-pressed coconut oil extracted without heat. Retains all natural nutrients and coconut aroma. Multi-purpose: cooking, hair care, skin care. No refinement or bleaching.'
  },
  {
    name: 'Cold Pressed Groundnut Oil',
    category: 'Organic Ghee & Oils',
    price: 420,
    stock: 65,
    unit: '1 L',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
    description: 'Traditional kachi ghani groundnut oil with authentic aroma. High smoke point, perfect for deep frying. Rich in heart-healthy monounsaturated fats. No added preservatives.'
  },
  {
    name: 'Cold Pressed Gingelly Oil',
    category: 'Organic Ghee & Oils',
    price: 380,
    stock: 55,
    unit: '500ml',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
    description: 'Premium sesame oil for authentic South Indian cooking. Traditional health tonic for oil pulling. Rich in antioxidants and sesamin. Distinct nutty flavor enhances any dish.'
  },
  {
    name: 'Mustard Oil - Kachi Ghani',
    category: 'Organic Ghee & Oils',
    price: 280,
    stock: 75,
    unit: '1 L',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
    description: 'Traditional cold-pressed mustard oil with strong antibacterial properties. Authentic pungent flavor. Perfect for pickles, massage, and North Indian cooking. No artificial colors.'
  },
  {
    name: 'Organic Sunflower Oil',
    category: 'Organic Ghee & Oils',
    price: 350,
    stock: 60,
    unit: '1 L',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
    description: 'Light and healthy organic sunflower oil. High in Vitamin E. Neutral taste suitable for all cooking methods. No trans fats or cholesterol. Pressed from organic sunflower seeds.'
  },

  // Flours & Grains
  {
    name: 'Organic Whole Wheat Flour',
    category: 'Flours & Grains',
    price: 140,
    stock: 100,
    unit: '1 kg',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
    description: 'Stone-ground whole wheat flour from organic wheat. Retains bran and germ for maximum nutrition. Perfect for soft rotis and nutritious bread. No maida or additives.'
  },
  {
    name: 'Multi Grain Flour',
    category: 'Flours & Grains',
    price: 160,
    stock: 85,
    unit: '1 kg',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
    description: 'Blended flour with wheat, jowar, bajra, and chana. High in protein and fiber. Perfect for daily rotis. Supports digestive health. Traditional nutrition made easy.'
  },
  {
    name: 'Ragi Flour',
    category: 'Flours & Grains',
    price: 150,
    stock: 80,
    unit: '500g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
    description: 'Pure finger millet flour, calcium-rich superfood. Traditional food for infants and growing children. Helps manage diabetes and anemia. Makes nutritious porridge and rotis.'
  },
  {
    name: 'Kambu Flour (Pearl Millet)',
    category: 'Flours & Grains',
    price: 130,
    stock: 75,
    unit: '500g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
    description: 'Traditional bajra flour for winter wellness. High in iron and energy-giving. Makes healthy rotis perfect for cold weather. Supports bone and joint health.'
  },
  {
    name: 'Besan (Gram Flour)',
    category: 'Flours & Grains',
    price: 150,
    stock: 90,
    unit: '1 kg',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
    description: 'Fine-quality chickpea flour for pakoras, sweets, and savory dishes. High in protein and fiber. Gluten-free alternative. Essential in Indian pantry.'
  },
  {
    name: 'Rice Flour',
    category: 'Flours & Grains',
    price: 120,
    stock: 85,
    unit: '500g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
    description: 'Fine rice flour for traditional recipes. Perfect for making idiyappam, pathiri, and sweets. Gluten-free baking essential. Stone-ground for smooth texture.'
  },
  {
    name: 'Jowar Flour (Sorghum)',
    category: 'Flours & Grains',
    price: 140,
    stock: 70,
    unit: '500g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
    description: 'Gluten-free sorghum flour, rich in antioxidants. Supports heart health and helps manage blood sugar. Makes soft rotis with slight sweetness. Traditional staple of Maharashtra.'
  },

  // Traditional Sweets & Snacks
  {
    name: 'Authentic Murukku',
    category: 'Traditional Sweets & Snacks',
    price: 220,
    stock: 60,
    unit: '250g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
    description: 'Traditional rice flour spirals, hand-twisted and deep-fried in gingelly oil. Crispy, crunchy, and aromatic. Made with urad dal and rice flour. No artificial flavors.'
  },
  {
    name: 'Groundnut Chikki',
    category: 'Traditional Sweets & Snacks',
    price: 180,
    stock: 70,
    unit: '250g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Crunchy peanut brittle made with jaggery syrup. High in protein and healthy fats. Traditional energy booster. No added sugar or artificial ingredients.'
  },
  {
    name: 'Sesame Chikki',
    category: 'Traditional Sweets & Snacks',
    price: 200,
    stock: 55,
    unit: '250g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Natural sesame and jaggery chikki, calcium-rich snack. Handmade with organic sesame seeds. No preservatives or artificial colors. Perfect healthy sweet treat.'
  },
  {
    name: 'Mixed Dry Fruit Ladoo',
    category: 'Traditional Sweets & Snacks',
    price: 450,
    salePrice: 380,
    stock: 40,
    unit: '500g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Premium energy ladoos made with almonds, cashews, pistachios, and dates. No added sugar, naturally sweet. Perfect for new mothers and growing children. Traditional recipe.'
  },
  {
    name: 'Kadalai Mittai (Peanut Candy)',
    category: 'Traditional Sweets & Snacks',
    price: 150,
    stock: 65,
    unit: '250g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Classic South Indian peanut candy with jaggery. Crunchy and delicious traditional snack. High in protein. Made with organic peanuts and pure jaggery.'
  },
  {
    name: 'Thenkozhi (Crispy Puffs)',
    category: 'Traditional Sweets & Snacks',
    price: 180,
    stock: 50,
    unit: '200g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
    description: 'Traditional rice flour crispy puffs, melt-in-mouth texture. Light and crunchy snack. Made with organic rice flour and cumin. Perfect tea-time companion.'
  },
  {
    name: 'Oma Biscuits',
    category: 'Traditional Sweets & Snacks',
    price: 120,
    stock: 75,
    unit: '200g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
    description: 'Traditional cumin seed cookies, aromatic and delicious. Made with organic wheat flour and fresh cumin. No artificial flavors or colors. Perfect for toddlers and elderly.'
  },

  // Herbal & Health Products
  {
    name: 'Organic Moringa Powder',
    category: 'Herbal & Health Products',
    price: 350,
    salePrice: 280,
    stock: 50,
    unit: '250g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=400&fit=crop',
    description: 'Pure moringa leaf powder, the miracle tree superfood. Rich in vitamins, minerals, and antioxidants. Supports immunity and energy levels. Shade-dried to retain nutrients.'
  },
  {
    name: 'Organic Ashwagandha',
    category: 'Herbal & Health Products',
    price: 380,
    stock: 45,
    unit: '250g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=400&fit=crop',
    description: 'Pure ashwagandha root powder, ancient adaptogen herb. Helps manage stress and promotes sound sleep. Enhances stamina and vitality. Ayurvedic wellness essential.'
  },
  {
    name: 'Organic Turmeric Powder',
    category: 'Herbal & Health Products',
    price: 280,
    salePrice: 220,
    stock: 100,
    unit: '250g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop',
    description: 'High-curcumin organic turmeric with 3-5% curcumin content. Anti-inflammatory and immunity booster. Sourced from organic farms. Natural antiseptic and healer.'
  },
  {
    name: 'Organic Amla Powder',
    category: 'Herbal & Health Products',
    price: 250,
    stock: 60,
    unit: '250g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=400&fit=crop',
    description: 'Pure amla (Indian gooseberry) powder, richest source of Vitamin C. Supports hair growth and skin health. Boosts immunity and digestion. 100% natural and organic.'
  },
  {
    name: 'Organic Wheatgrass Powder',
    category: 'Herbal & Health Products',
    price: 320,
    stock: 40,
    unit: '200g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=400&fit=crop',
    description: 'Nutrient-dense wheatgrass, nature detoxifier. Rich in chlorophyll and amino acids. Supports liver detox and energy. Shade-dried to preserve enzymes.'
  },
  {
    name: 'Organic Neem Powder',
    category: 'Herbal & Health Products',
    price: 180,
    stock: 55,
    unit: '250g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=400&fit=crop',
    description: 'Pure neem leaf powder, nature antibiotic. Blood purifier and skin health booster. Helps manage blood sugar levels. Traditional Ayurvedic remedy.'
  },
  {
    name: 'Organic Triphala Churna',
    category: 'Herbal & Health Products',
    price: 280,
    stock: 45,
    unit: '250g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=400&fit=crop',
    description: 'Classical Ayurvedic formula of three fruits: amla, haritaki, bibhitaki. Gentle digestive tonic and detoxifier. Supports eye health and immunity. Daily wellness supplement.'
  },
  {
    name: 'Organic Matcha Green Tea',
    category: 'Herbal & Health Products',
    price: 550,
    stock: 35,
    unit: '100g',
    featured: true,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    description: 'Premium ceremonial grade matcha from organic green tea leaves. Rich in EGCG antioxidants. Boosts metabolism and mental clarity. Shade-grown for maximum chlorophyll.'
  },

  // Spices & Seasonings
  {
    name: 'Organic Red Chilli Powder',
    category: 'Spices & Seasonings',
    price: 220,
    stock: 80,
    unit: '250g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',
    description: 'Pure Kashmiri red chilli powder, vibrant color and mild heat. Stone-ground to retain natural oils. No artificial colors or adulterants. Perfect for curry base.'
  },
  {
    name: 'Organic Coriander Powder',
    category: 'Spices & Seasonings',
    price: 180,
    stock: 85,
    unit: '250g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',
    description: 'Fresh coriander powder with citrusy aroma. Stone-ground from organically grown seeds. Essential spice for Indian cooking. Aids digestion and adds flavor.'
  },
  {
    name: 'Organic Cumin Seeds',
    category: 'Spices & Seasonings',
    price: 250,
    stock: 70,
    unit: '250g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',
    description: 'Premium quality jeera, full of volatile oils. Essential for tempering and spice blends. Aids digestion and relieves bloating. Freshly ground aroma.'
  },
  {
    name: 'Organic Black Pepper',
    category: 'Spices & Seasonings',
    price: 380,
    stock: 45,
    unit: '100g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',
    description: 'Whole black peppercorns, king of spices. High piperine content for maximum health benefits. Sharp, pungent flavor. Essential in every kitchen.'
  },
  {
    name: 'Organic Turmeric Root Powder',
    category: 'Spices & Seasonings',
    price: 200,
    stock: 75,
    unit: '200g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop',
    description: 'Fresh turmeric root powder, more potent than powder. Contains natural oils and curcumin. Anti-inflammatory and healing. Traditional wisdom in every pinch.'
  },
  {
    name: 'Organic Garam Masala',
    category: 'Spices & Seasonings',
    price: 320,
    stock: 55,
    unit: '200g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',
    description: 'Traditional blend of 12 warming spices. Authentic recipe passed through generations. Perfect for biryanis and curries. Freshly ground for maximum aroma.'
  },
  {
    name: 'Organic Sambar Powder',
    category: 'Spices & Seasonings',
    price: 200,
    stock: 70,
    unit: '250g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',
    description: 'Traditional South Indian sambar masala. Perfect blend for sambar, rasam, and chutneys. Authentic temple-style recipe. Made with freshly roasted spices.'
  },
  {
    name: 'Organic Rasam Powder',
    category: 'Spices & Seasonings',
    price: 180,
    stock: 65,
    unit: '200g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',
    description: 'Aromatic rasam spice mix for South Indian soup. Digestive and warming. Perfect for cold and flu. Traditional recipe with fresh spices.'
  },

  // Pulses & Dry Fruits
  {
    name: 'Organic Toor Dal',
    category: 'Pulses & Dry Fruits',
    price: 220,
    stock: 90,
    unit: '1 kg',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1515543904323-04aa167a2cc8?w=400&h=400&fit=crop',
    description: 'Premium quality arhar dal, staple protein source. Cleaned and hand-sorted. Rich in protein and fiber. Makes creamy dal tadka.'
  },
  {
    name: 'Organic Moong Dal',
    category: 'Pulses & Dry Fruits',
    price: 200,
    stock: 85,
    unit: '1 kg',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1515543904323-04aa167a2cc8?w=400&h=400&fit=crop',
    description: 'Split green gram, light and easy to digest. Perfect for babies and elderly. High in protein and fiber. Makes nutritious khichdi and dal.'
  },
  {
    name: 'Organic Urad Dal',
    category: 'Pulses & Dry Fruits',
    price: 240,
    stock: 75,
    unit: '1 kg',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1515543904323-04aa167a2cc8?w=400&h=400&fit=crop',
    description: 'Black gram dal, protein powerhouse. Essential for idli, dosa, and vada. Makes fluffy idlis and crispy dosas. High in iron and calcium.'
  },
  {
    name: 'Organic Chana Dal',
    category: 'Pulses & Dry Fruits',
    price: 180,
    stock: 80,
    unit: '1 kg',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1515543904323-04aa167a2cc8?w=400&h=400&fit=crop',
    description: 'Split chickpeas, versatile legume. Perfect for dal, pakoras, and sweets. High in protein and fiber. Easy to digest and nutritious.'
  },
  {
    name: 'Organic Almonds',
    category: 'Pulses & Dry Fruits',
    price: 550,
    salePrice: 480,
    stock: 60,
    unit: '500g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&h=400&fit=crop',
    description: 'Premium organic almonds, California variety. Rich in Vitamin E and healthy fats. Perfect for snacking and cooking. No added salt or oil.'
  },
  {
    name: 'Organic Cashews',
    category: 'Pulses & Dry Fruits',
    price: 600,
    salePrice: 520,
    stock: 55,
    unit: '500g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1606850783753-c9cb7d2a7a97?w=400&h=400&fit=crop',
    description: 'Whole organic cashews, creamy and delicious. Rich in minerals and healthy fats. Perfect for sweets and snacking. No preservatives.'
  },
  {
    name: 'Organic Walnuts',
    category: 'Pulses & Dry Fruits',
    price: 580,
    stock: 45,
    unit: '500g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1563630445022-6c8764c56d66?w=400&h=400&fit=crop',
    description: 'Premium organic walnuts, light color and mild flavor. Omega-3 rich brain food. Supports heart health. Perfect for salads and baking.'
  },
  {
    name: 'Organic Raisins',
    category: 'Pulses & Dry Fruits',
    price: 220,
    stock: 70,
    unit: '500g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1563630445022-6c8764c56d66?w=400&h=400&fit=crop',
    description: 'Natural sun-dried raisins, seedless and sweet. High in iron and natural sugars. Perfect for snacks and baking. No added sugar or preservatives.'
  },

  // Natural Personal Care
  {
    name: 'Organic Shikakai Powder',
    category: 'Natural Personal Care',
    price: 180,
    stock: 70,
    unit: '200g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=400&fit=crop',
    description: 'Natural shikakai for hair washing. Promotes hair growth and prevents dandruff. Chemical-free shampoo alternative. Traditional Ayurvedic recipe.'
  },
  {
    name: 'Organic Reetha Powder',
    category: 'Natural Personal Care',
    price: 150,
    stock: 65,
    unit: '200g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=400&fit=crop',
    description: 'Pure soapnut for natural cleaning. Nature detergent for hair and laundry. Antifungal and antibacterial. Zero chemicals, completely natural.'
  },
  {
    name: 'Organic Hair Oil',
    category: 'Natural Personal Care',
    price: 380,
    salePrice: 320,
    stock: 50,
    unit: '200ml',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop',
    description: 'Traditional hair oil blend with coconut, amla, and bhringraj. Promotes hair growth and prevents graying. No mineral oil or silicone. Authentic Ayurvedic formulation.'
  },
  {
    name: 'Natural Neem Soap',
    category: 'Natural Personal Care',
    price: 120,
    stock: 100,
    unit: '100g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400&h=400&fit=crop',
    description: 'Pure neem soap with antimicrobial properties. Treats acne and skin infections. Chemical-free and gentle. Made with cold process method.'
  },
  {
    name: 'Organic Turmeric Soap',
    category: 'Natural Personal Care',
    price: 140,
    stock: 85,
    unit: '100g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400&h=400&fit=crop',
    description: 'Natural turmeric soap for glowing skin. Anti-inflammatory and antibacterial. Brightens complexion naturally. No artificial fragrances.'
  },
  {
    name: 'Organic Multani Mitti',
    category: 'Natural Personal Care',
    price: 120,
    stock: 75,
    unit: '200g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=400&fit=crop',
    description: 'Pure Fullers Earth for face packs. Absorbs excess oil and cleanses pores. Natural cooling effect. Traditional beauty secret.'
  },

  // Jaggery & Sweeteners
  {
    name: 'Organic Palm Jaggery',
    category: 'Jaggery & Sweeteners',
    price: 180,
    stock: 80,
    unit: '500g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
    description: 'Pure palm jaggery, unrefined natural sweetener. Rich in iron and minerals. Traditional alternative to white sugar. Distinct caramel flavor.'
  },
  {
    name: 'Organic Sugarcane Jaggery',
    category: 'Jaggery & Sweeteners',
    price: 160,
    stock: 85,
    unit: '500g',
    featured: false,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
    description: 'Traditional cane jaggery blocks. Made without any chemicals. Rich in iron and calcium. Perfect for chikki and sweets.'
  },
  {
    name: 'Organic Honey - Wild',
    category: 'Jaggery & Sweeteners',
    price: 480,
    salePrice: 420,
    stock: 40,
    unit: '500g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
    description: 'Raw wild forest honey, unprocessed and unfiltered. Natural immunity booster. Antibacterial and antioxidant rich. No added sugar or syrup.'
  },
  {
    name: 'Organic Coconut Sugar',
    category: 'Jaggery & Sweeteners',
    price: 280,
    stock: 55,
    unit: '500g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
    description: 'Low glycemic index sweetener from coconut sap. Contains minerals and vitamins. Perfect for diabetics. Caramel-like flavor for baking.'
  },

  // Tea & Beverages
  {
    name: 'Organic Green Tea',
    category: 'Tea & Beverages',
    price: 320,
    stock: 60,
    unit: '100g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    description: 'Premium organic green tea leaves. Shade-grown for high antioxidants. Fresh and aromatic. Perfect for daily wellness.'
  },
  {
    name: 'Organic Masala Chai',
    category: 'Tea & Beverages',
    price: 280,
    stock: 55,
    unit: '200g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    description: 'Authentic spice tea blend with cardamom, ginger, and cinnamon. Traditional brewing spices. Perfect for morning energy. No artificial flavors.'
  },
  {
    name: 'Organic Filter Coffee',
    category: 'Tea & Beverages',
    price: 380,
    stock: 40,
    unit: '250g',
    featured: true,
    bestSeller: true,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    description: 'Traditional South Indian filter coffee blend. Chicory mixed for authentic taste. Dark roasted for rich aroma. Perfect brewing ratio included.'
  },
  {
    name: 'Organic Kokum Sherbet',
    category: 'Tea & Beverages',
    price: 220,
    stock: 45,
    unit: '200g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    description: 'Natural kokum extract for refreshing summer drink. Digestive and cooling properties. Traditional Konkan recipe. Just add water and serve.'
  },
  {
    name: 'Organic Lemon Tea',
    category: 'Tea & Beverages',
    price: 250,
    stock: 50,
    unit: '200g',
    featured: false,
    bestSeller: false,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    description: 'Refreshing lemon-infused tea blend. Rich in Vitamin C and antioxidants. Perfect for summer afternoons. Natural citrus flavor.'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sribhoomi');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@sribhoomi.com',
      password: adminPassword,
      role: 'admin',
      phone: '9876543210'
    });
    console.log('Admin user created: admin@sribhoomi.com / admin123');

    const categoryDocs = await Category.insertMany(categories);
    console.log('Categories created:', categories.length);

    const categoryMap = {};
    categoryDocs.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    const productsWithCategories = products.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));

    await Product.insertMany(productsWithCategories);
    console.log('Products created:', products.length);

    console.log('\n' + '='.repeat(60));
    console.log('Sri Bhoomi Organics Database seeded successfully!');
    console.log('='.repeat(60));
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@sribhoomi.com');
    console.log('Password: admin123');
    console.log('\nCategories:', categories.length);
    console.log('Products:', products.length);
    console.log('='.repeat(60));

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
