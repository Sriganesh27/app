import { NextResponse } from 'next/server';

export async function GET() {
  const salesData = {
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

  return NextResponse.json(salesData);
}
