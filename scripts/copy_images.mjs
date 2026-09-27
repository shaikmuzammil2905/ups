import fs from 'fs';
import path from 'path';

const brainDir = 'C:/Users/muzam/.gemini/antigravity-ide/brain/3c79a566-e4ad-4452-bf4d-5742690db87f';
const productsDir = 'c:/Users/muzam/Desktop/UPS/public/images/products';
const servicesDir = 'c:/Users/muzam/Desktop/UPS/public/images/services';

if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });
if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });

const files = fs.readdirSync(brainDir);

const mapping = [
  { match: 'cat_online_ups', out: path.join(productsDir, 'online-ups.jpg') },
  { match: 'cat_smf_battery', out: path.join(productsDir, 'smf-battery.jpg') },
  { match: 'cat_tubular_battery', out: path.join(productsDir, 'tubular-battery.jpg') },
  { match: 'cat_lithium_ups', out: path.join(productsDir, 'lithium-ups.jpg') },
  { match: 'cat_home_inverter', out: path.join(productsDir, 'home-inverter.jpg') },
  { match: 'cat_stabilizer', out: path.join(productsDir, 'stabilizer.jpg') },
  { match: 'cat_small_backup', out: path.join(productsDir, 'small-backup.jpg') },
  { match: 'srv_technician_service', out: path.join(servicesDir, 'ups-technician.jpg') },
  { match: 'srv_battery_replacement', out: path.join(servicesDir, 'battery-replacement.jpg') }
];

mapping.forEach(m => {
  const found = files.find(f => f.startsWith(m.match) && (f.endsWith('.jpg') || f.endsWith('.png')));
  if (found) {
    fs.copyFileSync(path.join(brainDir, found), m.out);
    console.log(`Copied ${found} -> ${m.out}`);
  }
});

console.log('Images copy done.');
