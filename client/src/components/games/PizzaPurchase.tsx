interface PfpShopCardProps {
  pizza: string;
  name: string;
  price: number;
  onBuy: () => void;
}

const PizzaPurchase = ({ pizza, name, price, onBuy }: PfpShopCardProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-lg bg-white rounded-2xl shadow-md border-2 border-gray-200 p-4 gap-4 hover:scale-[1.02] transition-transform duration-200 flex-wrap sm:flex-nowrap">
      {/* Circular Image */}
      <img
        src={`/games/Gatchaza/${pizza}.png`}
        alt={name}
        className="w-20 h-20 rounded-full object-cover border border-gray-300"
      />

      {/* Name/Description */}
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-lg font-semibold">{name}</h2>
      </div>

      {/* Price + Button */}
      <div className="flex flex-col items-center sm:items-end">
        <p className="text-gray-700 font-medium text-base mb-2">
          {price} points
        </p>
        <button
          onClick={onBuy}
          className="px-4 py-1 bg-indigo-500 text-white text-sm font-semibold rounded-md hover:bg-indigo-600 transition-colors"
        >
          Buy PFP
        </button>
      </div>
    </div>
  );
};

export default PizzaPurchase;
