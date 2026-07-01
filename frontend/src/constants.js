export const ROOMS = [
  { id: 1, name: "Ruang Meeting A", cap: 10, price: 150000, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600" },
  { id: 2, name: "Ruang Meeting B", cap: 20, price: 250000, img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=600" },
  { id: 3, name: "Ruang Event", cap: 50, price: 500000, img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600" },
  { id: 4, name: "Private Office", cap: 2, price: 75000, img: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=600" },
  { id: 5, name: "Open Space", cap: 30, price: 200000, img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600" },
  { id: 6, name: "Event Space", cap: 100, price: 1000000, img: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600" },
];

export const TIME_SLOTS = [
  "08.00 - 09.00",
  "09.00 - 10.00",
  "10.00 - 11.00",
  "11.00 - 12.00",
  "13.00 - 14.00",
  "14.00 - 15.00",
  "15.00 - 16.00",
  "16.00 - 17.00",
  "17.00 - 18.00"
];

export function rupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}
