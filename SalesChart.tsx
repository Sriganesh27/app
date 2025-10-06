'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
interface SalesDatum { month: string; sales: number; }
interface ApiResponse { [year: string]: SalesDatum[]; }

const COLORS = ['#6366F1', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'];

export default function SalesChart() {
  const [salesData, setSalesData] = useState<ApiResponse>({});
  const [year, setYear] = useState<YearKey>('2024');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [threshold, setThreshold] = useState<number>(0);

  // Fetch data from API
  useEffect(() => {
    fetch('/api/sales')
      .then(res => res.json())
      .then(data => setSalesData(data))
      .catch(console.error);
  }, []);

  const filteredData = useMemo(() => {
    const data = salesData[year] ?? [];
    return data.filter((d) => d.sales > threshold);
  }, [salesData, year, threshold]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* SIDE PANEL */}
      <aside className="md:w-64 w-full p-4 bg-gray-100 rounded-lg shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Select Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value as YearKey)}
            className="w-full border rounded-md px-2 py-1 text-sm"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Chart Type</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as any)}
            className="w-full border rounded-md px-2 py-1 text-sm"
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Minimum Sales Threshold</label>
          <input
            type="number"
            min={0}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full border rounded-md px-2 py-1 text-sm"
          />
        </div>

        <button
          onClick={() => { setThreshold(0); setChartType('bar'); setYear('2024'); }}
          className="w-full bg-indigo-600 text-white py-1 rounded-md hover:bg-indigo-700"
        >
          Reset Filters
        </button>
      </aside>

      {/* CHART SECTION */}
      <div className="flex-1 bg-white border rounded-lg shadow-sm p-4 h-[28rem]">
        {filteredData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading data or no months above threshold.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' && (
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v: number) => v.toLocaleString()} />
                <Bar dataKey="sales" fill="#6366F1">
                  {filteredData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            )}
            {chartType === 'line' && (
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v: number) => v.toLocaleString()} />
                <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} dot />
              </LineChart>
            )}
            {chartType === 'pie' && (
              <PieChart>
                <Legend verticalAlign="top" height={36} />
                <Tooltip formatter={(v: number) => v.toLocaleString()} />
                <Pie
                  data={filteredData}
                  dataKey="sales"
                  nameKey="month"
                  outerRadius={110}
                  label
                >
                  {filteredData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
