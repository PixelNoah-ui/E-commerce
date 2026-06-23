"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const Prisma_js_1 = require("../lib/Prisma.js");
const catchAsync__js_1 = require("../utils/catchAsync .js");
const formatLabel = (date, period) => {
    if (period === "year") {
        return date.toLocaleDateString(undefined, { month: "short" }); // Jan
    }
    if (period === "month") {
        return date.getDate().toString(); // 1..31
    }
    return date.toLocaleDateString(undefined, { weekday: "short" }); // Mon
};
const getDateRange = (period) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    let start;
    let prevStart;
    let prevEnd;
    if (period === "year") {
        start = new Date(today);
        start.setMonth(today.getMonth() - 11);
        start.setDate(1);
        prevStart = new Date(start);
        prevStart.setFullYear(start.getFullYear() - 1);
        prevEnd = new Date(start);
    }
    else if (period === "week") {
        start = new Date(today);
        start.setDate(today.getDate() - 6);
        prevStart = new Date(today);
        prevStart.setDate(today.getDate() - 13);
        prevEnd = new Date(today);
        prevEnd.setDate(today.getDate() - 7);
    }
    else {
        // ✅ DEFAULT = MONTH
        start = new Date(today);
        start.setDate(1);
        prevStart = new Date(start);
        prevStart.setMonth(start.getMonth() - 1);
        prevEnd = new Date(start);
    }
    return { start, prevStart, prevEnd };
};
const groupByPeriod = (data, period) => {
    const map = new Map();
    data.forEach((item) => {
        var _a;
        const d = new Date(item.createdAt);
        let key = "";
        if (period === "year") {
            key = `${d.getFullYear()}-${d.getMonth()}`;
        }
        else {
            key = d.toISOString().slice(0, 10);
        }
        map.set(key, ((_a = map.get(key)) !== null && _a !== void 0 ? _a : 0) + 1);
    });
    return map;
};
const fillData = (map, period) => {
    var _a, _b, _c;
    const today = new Date();
    const result = [];
    if (period === "year") {
        for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(today.getMonth() - i);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            result.push({
                day: formatLabel(d, period),
                count: (_a = map.get(key)) !== null && _a !== void 0 ? _a : 0,
            });
        }
    }
    else if (period === "month") {
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(today.getFullYear(), today.getMonth(), i);
            const key = d.toISOString().slice(0, 10);
            result.push({
                day: formatLabel(d, period),
                count: (_b = map.get(key)) !== null && _b !== void 0 ? _b : 0,
            });
        }
    }
    else {
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            result.push({
                day: formatLabel(d, period),
                count: (_c = map.get(key)) !== null && _c !== void 0 ? _c : 0,
            });
        }
    }
    return result;
};
const calculateTrend = (current, previous) => {
    if (previous === 0)
        return { trend: "up", change: "100%" };
    const diff = current - previous;
    const percent = (diff / previous) * 100;
    return {
        trend: diff >= 0 ? "up" : "down",
        change: `${Math.abs(percent).toFixed(1)}%`,
    };
};
exports.getDashboardStats = (0, catchAsync__js_1.catchAsync)(async (req, res) => {
    // ✅ GET PERIOD
    const period = req.query.period === "week" ||
        req.query.period === "year" ||
        req.query.period === "month"
        ? req.query.period
        : "month";
    const { start, prevStart, prevEnd } = getDateRange(period);
    // 🔥 TOTAL COUNTS
    const [totalUsers, totalProducts, adminUsers, managerUsers, availableProducts,] = await Prisma_js_1.prisma.$transaction([
        Prisma_js_1.prisma.user.count(),
        Prisma_js_1.prisma.product.count(),
        Prisma_js_1.prisma.user.count({ where: { role: "ADMIN" } }),
        Prisma_js_1.prisma.user.count({ where: { role: "MANAGER" } }),
        Prisma_js_1.prisma.product.count({ where: { isActive: true } }),
    ]);
    const [currentUsers, prevUsers, currentProducts, prevProducts] = await Prisma_js_1.prisma.$transaction([
        Prisma_js_1.prisma.user.count({ where: { createdAt: { gte: start } } }),
        Prisma_js_1.prisma.user.count({
            where: { createdAt: { gte: prevStart, lt: prevEnd } },
        }),
        Prisma_js_1.prisma.product.count({ where: { createdAt: { gte: start } } }),
        Prisma_js_1.prisma.product.count({
            where: { createdAt: { gte: prevStart, lt: prevEnd } },
        }),
    ]);
    const userTrend = calculateTrend(currentUsers, prevUsers);
    const productTrend = calculateTrend(currentProducts, prevProducts);
    const productsRaw = await Prisma_js_1.prisma.product.findMany({
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
//# sourceMappingURL=dashboardController.js.map