// Load environment variables
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const Product = require('../models/productModel');
const connectDatabase = require('../config/database');

// Sample admin products data
const sampleProducts = [
    {
        name: "Apple iPhone 14 Pro Max (256GB) - Deep Purple",
        description: "The most Pro iPhone ever with A16 Bionic chip, Pro camera system, and all-day battery life. Features Dynamic Island, Always-On display, and Ceramic Shield front.",
        highlights: [
            "A16 Bionic chip with 6-core CPU",
            "Pro camera system (48MP Main, 12MP Ultra Wide, 12MP Telephoto)",
            "6.7-inch Super Retina XDR display with ProMotion",
            "Up to 29 hours video playback",
            "Ceramic Shield front, textured matte glass back"
        ],
        specifications: [
            {
                title: "Display",
                description: "6.7-inch Super Retina XDR OLED, 2796x1290 resolution"
            },
            {
                title: "Chip",
                description: "A16 Bionic chip with 6-core CPU, 5-core GPU"
            },
            {
                title: "Camera",
                description: "Triple 48MP Pro camera system with 2x, 3x optical zoom"
            },
            {
                title: "Storage",
                description: "256GB internal storage"
            },
            {
                title: "Battery",
                description: "Up to 29 hours video playback, MagSafe wireless charging"
            }
        ],
        price: 129900,
        cuttedPrice: 139900,
        images: [
            {
                public_id: "iphone_14_pro_max_1",
                url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-max-deeppurple-select?wid=940&hei=1112&fmt=png-alpha&.v=1661027788969"
            },
            {
                public_id: "iphone_14_pro_max_2", 
                url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-max-deeppurple-back-select?wid=940&hei=1112&fmt=png-alpha&.v=1661027788969"
            }
        ],
        brand: {
            name: "Apple",
            logo: {
                public_id: "apple_logo",
                url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            }
        },
        category: "Mobiles",
        stock: 50,
        warranty: 1,
        ratings: 4.5,
        numOfReviews: 125,
        reviews: []
    },
    {
        name: "Samsung Galaxy S23 Ultra 5G (256GB) - Phantom Black",
        description: "The ultimate Galaxy S experience with S Pen built in, Nightography camera, and fastest Samsung Galaxy processor ever.",
        highlights: [
            "Snapdragon 8 Gen 2 processor",
            "200MP Pro-grade camera with 100x Space Zoom", 
            "6.8-inch Dynamic AMOLED 2X display",
            "Built-in S Pen for ultimate productivity",
            "5000mAh battery with 45W fast charging"
        ],
        specifications: [
            {
                title: "Display",
                description: "6.8-inch Dynamic AMOLED 2X, 3088x1440 resolution"
            },
            {
                title: "Processor",
                description: "Snapdragon 8 Gen 2 for Galaxy, Octa-core"
            },
            {
                title: "Camera",
                description: "Quad camera: 200MP+12MP+10MP+10MP, Front: 12MP"
            },
            {
                title: "Storage",
                description: "256GB internal storage, expandable up to 1TB"
            },
            {
                title: "Battery",
                description: "5000mAh with 45W wired, 15W wireless charging"
            }
        ],
        price: 109999,
        cuttedPrice: 124999,
        images: [
            {
                public_id: "galaxy_s23_ultra_1",
                url: "https://images.samsung.com/in/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-color-phantom-black.jpg"
            },
            {
                public_id: "galaxy_s23_ultra_2",
                url: "https://images.samsung.com/in/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-spen.jpg"
            }
        ],
        brand: {
            name: "Samsung",
            logo: {
                public_id: "samsung_logo",
                url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg"
            }
        },
        category: "Mobiles",
        stock: 75,
        warranty: 1,
        ratings: 4.4,
        numOfReviews: 89,
        reviews: []
    },
    {
        name: "MacBook Pro 14-inch M3 Pro (512GB SSD) - Space Black",
        description: "Supercharged by M3 Pro chip for demanding workflows. Features Liquid Retina XDR display, up to 18 hours battery life, and advanced camera and audio.",
        highlights: [
            "Apple M3 Pro chip with 11-core CPU and 14-core GPU",
            "14.2-inch Liquid Retina XDR display",
            "512GB SSD storage, 18GB unified memory",
            "Up to 18 hours battery life",
            "Three Thunderbolt 4 ports, HDMI port, SDXC card slot"
        ],
        specifications: [
            {
                title: "Display",
                description: "14.2-inch Liquid Retina XDR, 3024x1964 resolution"
            },
            {
                title: "Chip",
                description: "Apple M3 Pro with 11-core CPU, 14-core GPU"
            },
            {
                title: "Memory",
                description: "18GB unified memory"
            },
            {
                title: "Storage",
                description: "512GB SSD"
            },
            {
                title: "Battery",
                description: "Up to 18 hours video playback, 100Wh lithium-polymer"
            }
        ],
        price: 199900,
        cuttedPrice: 219900,
        images: [
            {
                public_id: "macbook_pro_14_1",
                url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290"
            },
            {
                public_id: "macbook_pro_14_2",
                url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-cto-hero-202310?wid=2000&hei=1458&fmt=jpeg&qlt=90&.v=1697311629601"
            }
        ],
        brand: {
            name: "Apple",
            logo: {
                public_id: "apple_logo", 
                url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            }
        },
        category: "Laptops",
        stock: 25,
        warranty: 1,
        ratings: 4.7,
        numOfReviews: 67,
        reviews: []
    },
    {
        name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones - Black",
        description: "Industry-leading noise canceling with two processors controlling 8 microphones. Up to 30-hour battery life with quick charge.",
        highlights: [
            "Industry-leading noise canceling technology",
            "Crystal clear hands-free calling",
            "Up to 30 hours battery life",
            "Lightweight design with soft fit leather",
            "Multipoint connection for two devices"
        ],
        specifications: [
            {
                title: "Driver Unit",
                description: "30mm dynamic driver"
            },
            {
                title: "Frequency Response",
                description: "4Hz-40,000Hz (LDAC 96kHz/24bit)"
            },
            {
                title: "Battery Life",
                description: "Up to 30 hours with ANC, 3 min charge = 3 hours playback"
            },
            {
                title: "Weight",
                description: "Approx. 250g"
            },
            {
                title: "Connectivity",
                description: "Bluetooth 5.2, NFC, 3.5mm audio jack"
            }
        ],
        price: 24990,
        cuttedPrice: 29990,
        images: [
            {
                public_id: "sony_wh1000xm5_1",
                url: "https://www.sony.co.in/image/5d02da5df552836db894acd8c0ac0c55?fmt=pjpeg&wid=660&bgcolor=FFFFFF&bgc=FFFFFF"
            },
            {
                public_id: "sony_wh1000xm5_2",
                url: "https://www.sony.co.in/image/65a98b96a1e1e7e5e1c5c1d81e0b0f0e?fmt=pjpeg&wid=660&bgcolor=FFFFFF&bgc=FFFFFF"
            }
        ],
        brand: {
            name: "Sony",
            logo: {
                public_id: "sony_logo",
                url: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg"
            }
        },
        category: "Electronics",
        stock: 100,
        warranty: 1,
        ratings: 4.6,
        numOfReviews: 234,
        reviews: []
    },
    {
        name: "LG 55 inch 4K Ultra HD Smart OLED TV - OLED55C3PSA",
        description: "Self-lit OLED pixels for perfect black and intense color. Powered by α9 AI Processor Gen6 for enhanced picture and sound quality.",
        highlights: [
            "Self-lit OLED technology with perfect black",
            "α9 AI Processor Gen6 for enhanced performance", 
            "webOS 23 with AI ThinQ smart platform",
            "FILMMAKER MODE and Dolby Vision IQ",
            "4 HDMI ports with VRR, ALLM for gaming"
        ],
        specifications: [
            {
                title: "Screen Size",
                description: "55 inches (139.7 cm)"
            },
            {
                title: "Display Technology",
                description: "4K Self-lit OLED"
            },
            {
                title: "Processor", 
                description: "α9 AI Processor Gen6"
            },
            {
                title: "Smart Platform",
                description: "webOS 23 with ThinQ AI"
            },
            {
                title: "Audio",
                description: "40W output with AI Sound Pro, Dolby Atmos"
            }
        ],
        price: 134990,
        cuttedPrice: 149990,
        images: [
            {
                public_id: "lg_oled_c3_1",
                url: "https://www.lg.com/in/images/tvs/md07525992/gallery/01_medium.jpg"
            },
            {
                public_id: "lg_oled_c3_2",
                url: "https://www.lg.com/in/images/tvs/md07525992/gallery/02_medium.jpg"
            }
        ],
        brand: {
            name: "LG",
            logo: {
                public_id: "lg_logo",
                url: "https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg"
            }
        },
        category: "TVs & Appliances",
        stock: 30,
        warranty: 2,
        ratings: 4.3,
        numOfReviews: 45,
        reviews: []
    },
    {
        name: "Nike Air Max 270 React - Black/White",
        description: "Featuring Nike's biggest heel Max Air unit for super soft cushioning. React foam provides lightweight, responsive feel.",
        highlights: [
            "Max Air 270 unit in heel for superior cushioning",
            "React foam midsole for responsive feel",
            "Durable rubber outsole with multi-surface traction",
            "Breathable mesh upper with synthetic overlays",
            "Pull tabs for easy on and off"
        ],
        specifications: [
            {
                title: "Material",
                description: "Mesh upper with synthetic overlays"
            },
            {
                title: "Midsole",
                description: "React foam with Max Air 270 unit"
            },
            {
                title: "Outsole",
                description: "Durable rubber with multi-surface traction"
            },
            {
                title: "Closure",
                description: "Lace-up with pull tabs"
            },
            {
                title: "Origin",
                description: "Imported"
            }
        ],
        price: 9995,
        cuttedPrice: 12995,
        images: [
            {
                public_id: "nike_air_max_270_1",
                url: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/i1-665455a5-45de-40fb-945f-c1852b82400d/air-max-270-react-shoes-JlLlWz.png"
            },
            {
                public_id: "nike_air_max_270_2",
                url: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/i1-32b4a9c2-7af6-4d3b-8772-9b7e9d5d8e2b/air-max-270-react-shoes-JlLlWz.png"
            }
        ],
        brand: {
            name: "Nike",
            logo: {
                public_id: "nike_logo",
                url: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
            }
        },
        category: "Fashion",
        stock: 80,
        warranty: 1,
        ratings: 4.2,
        numOfReviews: 178,
        reviews: []
    }
];

// Seed function
const seedProducts = async () => {
    try {
        console.log('Connecting to database...');
        await connectDatabase();
        
        console.log('Clearing existing products...');
        await Product.deleteMany({});
        
        console.log('Seeding new products...');
        
        // Create a default admin user ID (you should replace this with an actual admin user ID)
        const adminUserId = new mongoose.Types.ObjectId();
        
        // Add admin user to each product
        const productsWithUser = sampleProducts.map(product => ({
            ...product,
            user: adminUserId
        }));
        
        await Product.insertMany(productsWithUser);
        
        console.log(`Successfully seeded ${sampleProducts.length} products!`);
        console.log('Available categories:', [...new Set(sampleProducts.map(p => p.category))]);
        
        process.exit();
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    seedProducts();
}

module.exports = { seedProducts, sampleProducts };
