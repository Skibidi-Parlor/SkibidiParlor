type ButtonProps = {
  className: string;

  title: string;
  onClick?: () => void;
};

const Button = ({ title, className, onClick }: ButtonProps) => {
  return (
    <button
      className={`bg-white text-[#3D1C77] px-4 py-2 ml-2 mt-2 rounded-2xl w-fit ${className}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
