import { prisma } from "../lib/Prisma.js";
import { catchAsync } from "../utils/catchAsync .js";

const formatLabel = (date: Date, period: string) => {
  if (period === "year") {
    return date.toLocaleDateString(undefined, { month: "short" }); // Jan
  }
  if (period === "month") {
    return date.getDate().toString(); // 1..31
  }
  return date.toLocaleDateString(undefined, { weekday: "short" }); // Mon
};

const getDateRange = (period: string) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let start: Date;
  let prevStart: Date;
  let prevEnd: Date;

  if (period === "year") {
    start = new Date(today);
    start.setMonth(today.getMonth() - 11);
    start.setDate(1);

    prevStart = new Date(start);
    prevStart.setFullYear(start.getFullYear() - 1);

    prevEnd = new Date(start);
  } else if (period === "week") {
    start = new Date(today);
    start.setDate(today.getDate() - 6);

    prevStart = new Date(today);
    prevStart.setDate(today.getDate() - 13);

    prevEnd = new Date(today);
    prevEnd.setDate(today.getDate() - 7);
  } else {
    // ✅ DEFAULT = MONTH
    start = new Date(today);
    start.setDate(1);

    prevStart = new Date(start);
    prevStart.setMonth(start.getMonth() - 1);

    prevEnd = new Date(start);
  }

  return { start, prevStart, prevEnd };
};

const groupByPeriod = (data: { createdAt: Date }[], period: string) => {
  const map = new Map<string, number>();

  data.forEach((item) => {
    const d = new Date(item.createdAt);

    let key = "";
    if (period === "year") {
      key = `${d.getFullYear()}-${d.getMonth()}`;
    } else {
      key = d.toISOString().slice(0, 10);
    }

    map.set(key, (map.get(key) ?? 0) + 1);
  });

  return map;
};

const fillData = (map: Map<string, number>, period: string) => {
  const today = new Date();
  const result: any[] = [];

  if (period === "year") {
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(today.getMonth() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}`;

      result.push({
        day: formatLabel(d, period),
        count: map.get(key) ?? 0,
      });
    }
  } else if (period === "month") {
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), i);
      const key = d.toISOString().slice(0, 10);

      result.push({
        day: formatLabel(d, period),
        count: map.get(key) ?? 0,
      });
    }
  } else {
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);

      result.push({
        day: formatLabel(d, period),
        count: map.get(key) ?? 0,
      });
    }
  }

  return result;
};

const calculateTrend = (current: number, previous: number) => {
  if (previous === 0) return { trend: "up", change: "100%" };

  const diff = current - previous;
  const percent = (diff / previous) * 100;

  return {
    trend: diff >= 0 ? "up" : "down",
    change: `${Math.abs(percent).toFixed(1)}%`,
  };
};

export const getDashboardStats = catchAsync(async (req, res) => {
  // ✅ GET PERIOD
  const period =
    req.query.period === "week" ||
    req.query.period === "year" ||
    req.query.period === "month"
      ? req.query.period
      : "month";

  const { start, prevStart, prevEnd } = getDateRange(period);

  // 🔥 TOTAL COUNTS
  const [
    totalUsers,
    totalProducts,
    adminUsers,
    managerUsers,
    availableProducts,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { role: "MANAGER" } }),
    prisma.product.count({ where: { isActive: true } }),
  ]);

  const [currentUsers, prevUsers, currentProducts, prevProducts] =
    await prisma.$transaction([
      prisma.user.count({ where: { createdAt: { gte: start } } }),
      prisma.user.count({
        where: { createdAt: { gte: prevStart, lt: prevEnd } },
      }),

      prisma.product.count({ where: { createdAt: { gte: start } } }),
      prisma.product.count({
        where: { createdAt: { gte: prevStart, lt: prevEnd } },
      }),
    ]);

  const userTrend = calculateTrend(currentUsers, prevUsers);
  const productTrend = calculateTrend(currentProducts, prevProducts);

  const productsRaw = await prisma.product.findMany({
    where: { createdAt: { gte: start } },
    select: { createdAt: true },
  });

  const productMap = groupByPeriod(productsRaw, period);
  const productData = fillData(productMap, period);

  res.status(200).json({
    status: "success",
    data: {
      stats: [
        {
          title: "Total Users",
          value: totalUsers,
          icon: "Users",
          trend: userTrend.trend,
          change: userTrend.change,
        },
        {
          title: "Total Products",
          value: totalProducts,
          icon: "CreditCard",
          trend: productTrend.trend,
          change: productTrend.change,
        },
      ],
      userRoleDistribution: [
        { name: "Admin Users", value: adminUsers },
        { name: "Managers", value: managerUsers },
      ],
      productAvailability: [
        {
          name: "Available Products",
          value: availableProducts,
        },
      ],
      productGrowth: productData.map((d) => ({
        day: d.day,
        products: d.count,
      })),
    },
  });
});
