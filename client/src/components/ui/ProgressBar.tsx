interface ProgressBarProps {
  value: number; // from 0 to 100
}

const ProgressBar = ({ value }: ProgressBarProps) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const indicators = [
    { percent: 0, label: "🥉 Bronze" },
    { percent: 25, label: "🥈 Silver" },
    { percent: 50, label: "🥇 Gold" },
    { percent: 99, label: "👑 Plat" },
  ];

  // Dynamic color based on value
  const getBarColor = () => {
    if (clampedValue < 25) return "bg-[#cd7f32]";
    if (clampedValue < 50) return "bg-[#8a8a8a]";
    if (clampedValue < 100) return "bg-[#ffd700]";
    return "bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500";
  };

  return (
    <div className="w-full mt-5">
      {/* Progress Bar Background */}
      <div className="relative h-4 bg-gray-300 rounded-full overflow-hidden">
        {/* Fill */}
        <div
          className={`h-full transition-all duration-300 ease-in-out ${getBarColor()}`}
          style={{ width: `${clampedValue}%` }}
        />
        {/* Indicator Lines */}
        {indicators.map(({ percent }, i) => (
          <div
            key={`line-${i}`}
            className="absolute top-0 bottom-0 w-0.5 bg-black"
            style={{ left: `${percent}%` }}
          />
        ))}
      </div>

      {/* Indicator Labels */}
      <div className="relative mt-1 h-5">
        {indicators.map(({ percent, label }, i) => (
          <div
            key={`label-${i}`}
            className={`absolute text-sm ${
              i === indicators.length - 1
                ? "-translate-x-[115%]" // moved further left
                : "-translate-x-[70%]"
            }`}
            style={{ left: `${percent}%` }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
