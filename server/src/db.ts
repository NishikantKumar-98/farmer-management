import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

type Data = {
  farms: any[];
  orders: any[];
  users: any[];
};

const file = path.join(__dirname, '..', 'data', 'db.json');
const adapter = new JSONFile<Data>(file);
const defaultData: Data = { farms: [], orders: [], users: [] };

// Pass adapter and provide safe init handling - lowdb v6 constructor accepts (adapter, defaultData)
export const db = new Low<Data>(adapter, defaultData);

export async function initDb() {
  try {
    await db.read();
  } catch (err) {
    // If reading fails (corrupt/missing file), initialize with defaults
    db.data = defaultData;
    await db.write();
    return;
  }

  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }

  // seed if empty
  if (db.data.farms.length === 0) {
    db.data.farms.push({ id: 'farm1', name: 'Demo Farm', location: 'Block A', produce: ['wheat', 'rice'] });
    await db.write();
  }
}
