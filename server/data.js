const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const JSON_FILES = {
  products: 'products.json',
  services: 'services.json',
  members: 'members.json',
  users: 'users.json',
  contacts: 'contacts.json',
  items: 'items.json'  // renamed from objects
};

function getFilePath(filename) {
  return path.join(DATA_DIR, filename);
}

function loadData(filename, defaultData = []) {
  const filePath = getFilePath(filename);
  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return Array.isArray(data) ? data : defaultData;
    }
  } catch (err) {
    console.warn(`Failed to load ${filename}:`, err.message);
  }
  return defaultData;
}

function saveData(filename, data) {
  const filePath = getFilePath(filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Failed to save ${filename}:`, err.message);
  }
}

// Initial seed data
const SEED_DATA = {
  products: [
    { id: 1, title: "Gaming", img: "/src/assets/gaming.webp" },
    { id: 2, title: "Graphic Design", img: "/src/assets/design.webp" },
    { id: 3, title: "Office & Others", img: "/src/assets/office.webp" },
  ],
  services: [
    { id: 1, title: "Lifetime Guarantee", desc: "High quality products guaranteed." },
    { id: 2, title: "Good Price", desc: "Best value for premium devices." },
    { id: 3, title: "Free Software Updates", desc: "Lifetime update support." },
    { id: 4, title: "24/7 Support", desc: "We are always here to help." },
  ],
  members: [
    { id: 1, name: "Electros" },
    { id: 2, name: "Tech Lab" },
    { id: 3, name: "PC Predator" },
    { id: 4, name: "SpacePlay" },
  ],
  users: [],
  contacts: [],
  items: [
    { id: 'item1', name: 'Sample Laptop', year: 2023, price: 1299.99, cpuModel: 'Intel i7', hardDiskSize: '1TB SSD' }
  ]
};

// Load or seed data
const products = loadData(JSON_FILES.products, SEED_DATA.products);
const services = loadData(JSON_FILES.services, SEED_DATA.services);
const members = loadData(JSON_FILES.members, SEED_DATA.members);
const users = loadData(JSON_FILES.users, SEED_DATA.users);
const contacts = loadData(JSON_FILES.contacts, SEED_DATA.contacts);
const items = loadData(JSON_FILES.items, SEED_DATA.items);

// Helper functions for mutable data (users, contacts, items)
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

function createUser(userData) {
  const newUser = { ...userData, id: Date.now() };
  users.push(newUser);
  saveData(JSON_FILES.users, users);
  return newUser;
}

function updateUser(id, updates) {
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveData(JSON_FILES.users, users);
    return users[index];
  }
  return null;
}

function createContact(contact) {
  const newContact = { ...contact, id: Date.now(), created: new Date().toISOString() };
  contacts.push(newContact);
  saveData(JSON_FILES.contacts, contacts);
  return newContact;
}

function findItemById(id) {
  return items.find(item => item.id === id);
}

function createItem(itemData) {
  const newItem = {
    ...itemData,
    id: 'item_' + Date.now(),
    created: new Date().toISOString()
  };
  items.push(newItem);
  saveData(JSON_FILES.items, items);
  return newItem;
}

function updateItem(id, updates) {
  const item = findItemById(id);
  if (item) {
    Object.assign(item, updates);
    saveData(JSON_FILES.items, items);
    return item;
  }
  return null;
}

function deleteItem(id) {
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    saveData(JSON_FILES.items, items);
    return true;
  }
  return false;
}

function searchItems({ search = '', page = 1, limit = 10 }) {
  let filtered = items;
  if (search) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  filtered.sort((a, b) => a.name.localeCompare(b.name));
  const skip = (page - 1) * limit;
  const data = filtered.slice(skip, skip + limit);
  return { data, total: filtered.length, page: parseInt(page), limit: parseInt(limit) };
}

// Seed if empty (for static data, allow manual edit)
if (products.length === 0) {
  Object.assign(products, SEED_DATA.products);
  saveData(JSON_FILES.products, products);
}
if (services.length === 0) {
  Object.assign(services, SEED_DATA.services);
  saveData(JSON_FILES.services, services);
}
if (members.length === 0) {
  Object.assign(members, SEED_DATA.members);
  saveData(JSON_FILES.members, members);
}

module.exports = {
  products,
  services,
  members,
  users,
  contacts,
  items,
  // Helpers
  findUserByEmail,
  createUser,
  updateUser,
  hashPassword,
  verifyPassword,
  createContact,
  createItem,
  updateItem,
  deleteItem,
  findItemById,
  searchItems
};

