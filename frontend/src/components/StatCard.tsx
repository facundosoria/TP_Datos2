type StatCardProps = {
  title: string;
  value: string | number;
  icon: string;
  color?: "blue" | "green" | "red" | "yellow" | "purple";
  subtitle?: string;
};

const colorMap = {
  blue: "bg-blue-50 border-blue-200 text-blue-700",
  green: "bg-green-50 border-green-200 text-green-700",
  red: "bg-red-50 border-red-200 text-red-700",
  yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
  purple: "bg-purple-50 border-purple-200 text-purple-700",
};

const iconBg = {
  blue: "bg-blue-100",
  green: "bg-green-100",
  red: "bg-red-100",
  yellow: "bg-yellow-100",
  purple: "bg-purple-100",
};

export default function StatCard({
  title,
  value,
  icon,
  color = "blue",
  subtitle,
}: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs mt-1 opacity-60">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${iconBg[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
