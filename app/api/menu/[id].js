// /api/menu/[id].js
import { menuItems } from './menuData'; // Assume menuData is where your menu items are stored

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const item = menuItems.find((item) => item.id === id);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
