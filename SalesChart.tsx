'use client';

import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

type YearKey = '2024' | '2023' | '2022';

interface SalesDatum {
  month: string;
  sales: number;
}

interface SalesChartProps {
  /** Optional starting year (defaults to '2024') */
  initialYear?: YearKey;
}

/**
 * Mock sales data (as requested).
 */
const salesData: Record<YearKey, SalesDatum[]> = {
  '2024': [
    { month: 'Jan', sales: 4250 }, { month: 'Feb', sales: 3100 }, { month: 'Mar', sales: 5500 },
    { month: 'Apr', sales: 4800 }, { month: 'May', sales: 6200 }, { month: 'Jun', sales: 7500 },
    { month: 'Jul', sales: 8100 }, { month: 'Aug', sales: 7200 }, { month: 'Sep', sales: 6500 },
    { month: 'Oct', sales: 5800 }, { month: 'Nov', sales: 9000 }, { month: 'Dec', sales: 11500 },
  ],
  '2023': [
    { month: 'Jan', sales: 3800 }, { month: 'Feb', sales: 2900 }, { month: 'Mar', sales: 4800 },
    { month: 'Apr', sales: 4300 }, { month: 'May', sales: 5800 }, { month: 'Jun', sales: 6900 },
    { month: 'Jul', sales: 7500 }, { month: 'Aug', sales: 6700 }, { month: 'Sep', sales: 6000 },
    { month: 'Oct', sales: 5300 }, { month: 'Nov', sales: 8200 }, { month: 'Dec', sales: 10500 },
  ],
  '2022': [
    { month: 'Jan', sales: 3100 }, { month: 'Feb', sales: 2500 }, { month: 'Mar', sales: 4100 },
    { month: 'Apr', sales: 3800 }, { month: 'May', sales: 5100 }, { month: 'Jun', sales: 6200 },
    { month: 'Jul', sales: 6800 }, { month: 'Aug', sales: 6100 }, { month: 'Sep', sales: 5500 },
    { month: 'Oct', sales: 4900 }, { month: 'Nov', sales: 7500 }, { month: 'Dec', sales: 9800 },
  ],
};

/**
 * Colors for pie slices / bars. Recharts will accept these.
 */
const COLORS = [
  '#6366F1', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6',
  '#F97316', '#3B82F6', '#EC4899', '#14B8A6', '#A78BFA', '#F43F5E',
];

export default function SalesChart({ initialYear = '2024' }: SalesChartProps) {
  const [year, setYear] = useState<YearKey>(initialYear);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [threshold, setThreshold] = useState<number>(0);

  // Filtered data according to selected year and threshold (> threshold as requested)
  const filteredData = useMemo(() => {
    const data = salesData[year] ?? [];
    return data.filter((d) => d.sales > threshold);
  }, [year, threshold]);

  // Small aggregates for UI (useful to show context)
  const totalSales = useMemo(() => {
    return filteredData.reduce((sum, d) => sum + d.sales, 0);
  }, [filteredData]);

  const avgSales = useMemo(() => {
    return filteredData.length ? Math.round(totalSales / filteredData.length) : 0;
  }, [totalSales, filteredData.length]);

  return (
    <section className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Year</h2>
          <div className="flex gap-2">
            {(['2024', '2023', '2022'] as YearKey[]).map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                aria-pressed={y === year}
                className={`px-3 py-1 rounded-md text-sm font-medium
                  ${y === year ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Chart</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('bar')}
                className={`px-2 py-1 rounded text-sm ${chartType === 'bar' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-2 py-1 rounded text-sm ${chartType === 'line' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`px-2 py-1 rounded text-sm ${chartType === 'pie' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
              >
                Pie
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="threshold" className="text-sm font-medium">Minimum Sales Threshold</label>
            <input
              id="threshold"
              type="number"
              min={0}
              value={String(threshold)}
              onChange={(e) => {
                const v = Number(e.target.value);
                setThreshold(Number.isNaN(v) ? 0 : v);
              }}
              className="w-28 px-2 py-1 border rounded-md text-sm bg-white"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredData.length}</span> month(s) for <span className="font-medium">{year}</span>
            {threshold > 0 && <span className="text-gray-500"> (sales &gt; {threshold.toLocaleString()})</span>}
          </p>
          <p className="mt-1 text-sm">
            Total: <span className="font-semibold">{totalSales.toLocaleString()}</span> — Avg: <span className="font-semibold">{avgSales.toLocaleString()}</span>
          </p>
        </div>

        <div className="text-sm text-gray-500">
          <button
            onClick={() => { setThreshold(0); setChartType('bar'); setYear('2024'); }}
            className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
            aria-label="Reset filters"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Chart area */}
      <div className="w-full h-96 bg-white border rounded-lg p-4 shadow-sm">
        {filteredData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No months match the current threshold — try lowering the threshold or pick another year.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' && (
              <BarChart data={filteredData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Bar dataKey="sales" name="Sales" radius={[6, 6, 0, 0]}>
                  {filteredData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            )}

            {chartType === 'line' && (
              <LineChart data={filteredData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            )}

            {chartType === 'pie' && (
              <PieChart>
                <Legend verticalAlign="top" height={36} />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Pie
                  data={filteredData}
                  dataKey="sales"
                  nameKey="month"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  fill="#8884d8"
                  label={(entry) => `${entry.month} (${entry.sales.toLocaleString()})`}
                >
                  {filteredData.map((_, idx) => (
                    <Cell key={`slice-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
