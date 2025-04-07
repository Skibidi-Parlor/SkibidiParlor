type WalletProps = {
  balance: number;
  onClick?: () => void;
};

const Wallet = ({ balance, onClick }: WalletProps) => {
  const roundedBalance = Math.round(balance * 10) / 10;
  return (
    <div className="flex">
      <div onClick={onClick} className="bg-white text-[#3D1C77] p-1">
        ${roundedBalance + (roundedBalance % 1 != 0 ? "0" : "")} | +
      </div>
    </div>
  );
};

export default Wallet;
