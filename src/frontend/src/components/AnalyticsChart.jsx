import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Legend
} from 'recharts';

const NEON_COLORS = [
  '#00FF87', // Neon Green
  '#00D8FF', // Light Cyan
  '#FF007F', // Pink/Neon Red
  '#FFD700', // Gold
  '#9D00FF', // Purple
  '#FF8F00', // Orange
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-[#222222] rounded-lg p-3 text-xs shadow-xl font-mono text-left">
        {label && <p className="text-[#A0A0A0] font-bold mb-1 uppercase">{label}</p>}
        {payload.map((item, idx) => (
          <p key={idx} style={{ color: item.color || '#00FF87' }} className="font-bold flex items-center space-x-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: item.color || '#00FF87' }}></span>
            <span>{item.name}:</span>
            <span className="text-white ml-auto">{item.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart({ type, data, title, description }) {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        // Horizontal Bar Chart configuration
        return (
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
            <CartesianGrid stroke="#222" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" stroke="#555" />
            <YAxis dataKey="name" type="category" stroke="#A0A0A0" width={110} tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              name="Count / Average"
              dataKey="value"
              fill="#00FF87"
              radius={[0, 4, 4, 0]}
              animationBegin={0}
              animationDuration={800}
            />
          </BarChart>
        );

      case 'pie':
        // Pie Chart configuration (Donut style)
        return (
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={NEON_COLORS[index % NEON_COLORS.length]} />
              ))}
            </Pie>
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 10, paddingTop: 10, color: '#A0A0A0' }}
            />
          </PieChart>
        );

      case 'radar':
        // Radar Chart configuration
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#222" />
            <PolarAngleAxis dataKey="subject" stroke="#A0A0A0" tick={{ fontSize: 10, fontWeight: 'bold' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#222" tick={{ fill: '#555', fontSize: 8 }} />
            
            {/* Player A (Neon Green) */}
            <Radar
              name={data[0]?.nameA || 'Player A'}
              dataKey="A"
              stroke="#00FF87"
              fill="#00FF87"
              fillOpacity={0.25}
              animationBegin={0}
              animationDuration={800}
            />

            {/* Player B (White) — visible only if comparison data is provided */}
            {data[0]?.B !== undefined && (
              <Radar
                name={data[0]?.nameB || 'Player B'}
                dataKey="B"
                stroke="#FFFFFF"
                fill="#FFFFFF"
                fillOpacity={0.15}
                animationBegin={0}
                animationDuration={800}
              />
            )}
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="square"
              iconSize={8}
              wrapperStyle={{ fontSize: 10, paddingTop: 10, color: '#A0A0A0' }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        );

      case 'line':
        // Line Chart configuration
        return (
          <LineChart data={data} margin={{ left: 5, right: 5, top: 10, bottom: 10 }}>
            <CartesianGrid stroke="#222" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#A0A0A0" tick={{ fontSize: 10 }} />
            <YAxis stroke="#A0A0A0" tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              name="Value"
              dataKey="value"
              stroke="#00FF87"
              strokeWidth={2.5}
              activeDot={{ r: 6, stroke: '#00FF87', strokeWidth: 1, fill: '#0A0A0A' }}
              animationBegin={0}
              animationDuration={800}
            />
          </LineChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 flex flex-col h-full w-full">
      {/* Title & Description */}
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[11px] text-[#555] font-semibold uppercase mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Chart Canvas */}
      <div className="flex-grow w-full min-h-[260px] relative">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
