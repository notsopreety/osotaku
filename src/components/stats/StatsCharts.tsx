import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface ScoreData {
  score: number;
  count: number;
}

interface GenreData {
  genre: string;
  count: number;
  meanScore?: number;
  minutesWatched?: number;
}

interface FormatData {
  format?: string;
  count: number;
}

interface StatusData {
  status?: string;
  count: number;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
];

const STATUS_COLORS: Record<string, string> = {
  CURRENT: '#3b82f6',
  COMPLETED: '#10b981',
  PLANNING: '#f59e0b',
  PAUSED: '#8b5cf6',
  DROPPED: '#ef4444',
  REPEATING: '#06b6d4',
};

const STATUS_LABELS: Record<string, string> = {
  CURRENT: 'Watching',
  COMPLETED: 'Completed',
  PLANNING: 'Planning',
  PAUSED: 'Paused',
  DROPPED: 'Dropped',
  REPEATING: 'Rewatching',
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
      <p className="font-medium text-sm">{label}</p>
      {payload.map((item, index) => (
        <p key={index} className="text-sm text-muted-foreground">
          {item.name}: <span className="font-semibold text-foreground">{item.value}</span>
        </p>
      ))}
    </div>
  );
}

interface ScoreDistributionChartProps {
  data: ScoreData[];
}

export function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  // Fill in missing scores
  const chartData = [...Array(10)].map((_, i) => {
    const score = (i + 1) * 10;
    const found = data.find((d) => d.score === score);
    return {
      score: score.toString(),
      count: found?.count || 0,
    };
  });

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="score" 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
          <Bar 
            dataKey="count" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]}
            name="Anime"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface GenreDistributionChartProps {
  data: GenreData[];
  maxItems?: number;
}

export function GenreDistributionChart({ data, maxItems = 8 }: GenreDistributionChartProps) {
  const chartData = data.slice(0, maxItems).map((d) => ({
    name: d.genre,
    count: d.count,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          layout="vertical" 
          margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
        >
          <XAxis 
            type="number" 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            axisLine={false} 
            tickLine={false}
            width={80}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
          <Bar 
            dataKey="count" 
            fill="hsl(var(--primary))" 
            radius={[0, 4, 4, 0]}
            name="Anime"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface FormatDistributionChartProps {
  data: FormatData[];
}

export function FormatDistributionChart({ data }: FormatDistributionChartProps) {
  const chartData = data.map((d) => ({
    name: d.format?.replace('_', ' ') || 'Unknown',
    value: d.count,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            labelLine={false}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string) => [value, 'Count']}
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface StatusDistributionChartProps {
  data: StatusData[];
}

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  const chartData = data.map((d) => ({
    name: STATUS_LABELS[d.status] || d.status,
    value: d.count,
    fill: STATUS_COLORS[d.status] || COLORS[0],
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string) => [
              `${value} (${((value / total) * 100).toFixed(1)}%)`,
              name
            ]}
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend 
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
