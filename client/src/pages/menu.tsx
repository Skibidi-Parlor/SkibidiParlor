import { useState } from "react";
import { Link } from "react-router";

const fakeMenu = [
  {
    name: "Cheese Pizza",
    description: "Classic cheese pizza with rich tomato sauce.",
    price: "$9.99",
    image: "/menu/cheesepizza.webp",
  },
  {
    name: "Pepperoni Pizza",
    description: "Pepperoni slices on a bed of melted cheese.",
    price: "$11.49",
    image: "/menu/pepperonipizza.png",
  },
  {
    name: "BYO Pizza",
    description:
      "Choose from any pizza with 5 toppings! Toppings include pepperoni, cheese, sausage, mushroom, basil, pineapple.",
    price: "$13.69",
    image: "/menu/byopizza.avif",
  },
  {
    name: "Hot Dog",
    description: "Grilled beef hot dog in a fresh bun.",
    price: "$4.99",
    image: "/menu/hotdog.jpg",
  },
  {
    name: "Breadsticks",
    description: "Garlic buttered breadsticks with marinara sauce.",
    price: "$5.99",
    image: "/menu/breadsticks.jpg",
  },
  {
    name: "Wings",
    description: "Spicy buffalo wings served with ranch.",
    price: "$8.99",
    image: "/menu/wings.jpg",
  },
];

export default function PizzaMenu() {
  const [items] = useState(fakeMenu);

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center py-16 px-6 font-sans">
      <h1 className="text-6xl font-extrabold text-red-500 mb-8 text-center">
        🍕 Skibidi Parlor 🍕
      </h1>

      <Link
        to="/games"
        className="px-8 py-2 text-3xl font-bold bg-gradient-to-r from-red-400 via-yellow-300 to-red-400 text-white rounded-full shadow-xl hover:rotate-3 active:scale-90 transition-all duration-300 mb-8 text-center"
      >
        Play Games While You Wait! 🎮
      </Link>

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-10 space-y-8 border-4 border-dashed border-yellow-400">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b-2 border-yellow-300 pb-6 last:border-none hover:bg-yellow-50 transition-all duration-200 rounded-2xl p-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-full border-4 border-red-300 shadow-md"
            />

            <div className="flex-1 w-full">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-2xl font-bold text-red-500">{item.name}</h3>
                <span className="text-xl font-extrabold text-green-600">
                  {item.price}
                </span>
              </div>
              <p className="text-gray-600 mt-2 text-lg">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
