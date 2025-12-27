
import { FinancialData, StockData, FinancialStatementDeep, DividendRecord, AIFinancialHealth } from '../types';

const generateMockStatement = (period: string, seed: number): FinancialStatementDeep => {
  const base = 100000000 * (1 + (seed % 10) / 10);
  return {
    period,
    revenue: base,
    cogs: base * 0.58,
    grossProfit: base * 0.42,
    operatingExpenses: base * 0.15,
    sellingGeneralAdmin: base * 0.09,
    depreciationAndAmortization: base * 0.04,
    ebitda: base * 0.31,
    ebit: base * 0.27,
    interestExpense: base * 0.03,
    preTaxIncome: base * 0.24,
    zakatProvision: base * 0.02,
    netIncome: base * 0.22,
    eps: (base * 0.22) / 50000000,
    cashAndEquivalents: base * 0.5,
    accountsReceivable: base * 0.3,
    inventory: base * 0.2,
    totalCurrentAssets: base * 1.0,
    ppe: base * 4.0,
    intangibleAssets: base * 0.5,
    totalNonCurrentAssets: base * 4.5,
    totalAssets: base * 5.5,
    accountsPayable: base * 0.25,
    shortTermDebt: base * 0.1,
    totalCurrentLiabilities: base * 0.7,
    longTermDebt: base * 1.8,
    totalNonCurrentLiabilities: base * 2.1,
    totalLiabilities: base * 2.8,
    paidInCapital: base * 2.0,
    retainedEarnings: base * 0.7,
    totalEquity: base * 2.7,
    operatingCashFlow: base * 0.25,
    investingCashFlow: -(base * 0.18),
    capex: base * 0.15,
    financingCashFlow: -(base * 0.05),
    dividendsPaid: base * 0.12,
    netChangeInCash: base * 0.02,
    freeCashFlow: base * 0.10
  };
};

export const getDetailedFinancials = (stock: StockData): FinancialData => {
  const seed = parseInt(stock.symbol) || 1000;
  const policies: ('سنوية' | 'نصف سنوية' | 'ربع سنوية')[] = ['سنوية', 'نصف سنوية', 'ربع سنوية'];
  const policy = policies[seed % 3];

  return {
    peRatio: 12 + (seed % 15),
    pbRatio: 1.2 + (seed % 3) / 10,
    eps: 1.5 + (seed % 5),
    dividendYield: 2 + (seed % 6),
    debtToEquity: 0.2 + (seed % 8) / 10,
    roe: 15 + (seed % 10),
    roa: 7 + (seed % 5),
    currentRatio: 1.4 + (seed % 4) / 2,
    quickRatio: 1.0 + (seed % 3) / 2,
    profitMargin: 15 + (seed % 15),
    distributionPolicy: policy,
    yearlyStatements: [
      generateMockStatement('2023 السنوي', seed),
      generateMockStatement('2022 السنوي', seed - 1),
      generateMockStatement('2021 السنوي', seed - 2),
    ],
    quarterlyStatements: [
      generateMockStatement('الربع الثالث 2024', seed),
      generateMockStatement('الربع الثاني 2024', seed),
      generateMockStatement('الربع الأول 2024', seed),
    ],
    semiAnnualStatements: [
      generateMockStatement('النصف الأول 2024', seed),
      generateMockStatement('النصف الثاني 2023', seed),
    ],
    dividendsHistory: [
      { period: '2024 ربع 3', type: 'CASH', amount: 0.50, percentage: 5, eligibilityDate: '2024-10-15', paymentDate: '2024-11-01' },
      { period: '2024 ربع 2', type: 'CASH', amount: 0.60, percentage: 6, eligibilityDate: '2024-07-20', paymentDate: '2024-08-10' },
      { period: '2023 سنوي', type: 'BONUS', amount: 0, percentage: 10, bonusRatio: '1:10', eligibilityDate: '2023-12-25', paymentDate: '2024-01-20' },
      { period: '2023 ربع 3', type: 'CASH', amount: 0.45, percentage: 4.5, eligibilityDate: '2023-10-05', paymentDate: '2023-10-25' }
    ]
  };
};

/**
 * محرك صياغة التقارير اللحظية المهيكلة بالأرقام
 */
export const getImmediateFinancialSummary = (data: FinancialData): AIFinancialHealth => {
  // 1. تحليل جودة الأرباح (Profitability Context)
  let qualityNote = "";
  const margin = data.profitMargin.toFixed(1);
  const pe = data.peRatio.toFixed(1);

  if (data.profitMargin > 20) {
    qualityNote = `تتمتع الشركة بهامش ربح استثنائي يبلغ ${margin}%، وهو ما يعكس كفاءة عالية في ضبط التكاليف وقدرة تسعيرية قوية. وبمكرر ربحية يبلغ ${pe}، يظهر أن جودة هذه الأرباح مستدامة ومدعومة بنمو تشغيلي حقيقي.`;
  } else if (data.profitMargin > 12) {
    qualityNote = `أداء الربحية مستقر بنسبة هامش صافي قدرها ${margin}%. هذه الأرقام تضع الشركة في منطقة الأمان التشغيلي، حيث تغطي الإيرادات كافة المصاريف بهامش ربح مجزٍ يتماشى مع طبيعة القطاع.`;
  } else {
    qualityNote = `يلاحظ ضغط على هوامش الربح حيث تبلغ حالياً ${margin}%. هذا الرقم يتطلب مراقبة دقيقة لكفاءة التشغيل، خصوصاً مع مكرر ربحية يبلغ ${pe}، مما قد يعني أن السوق يراقب تحسن الأداء المستقبلي.`;
  }

  // 2. تحليل كفاءة التشغيل (Management Efficiency)
  let efficiencyNote = "";
  const roe = data.roe.toFixed(1);
  const eps = data.eps.toFixed(2);

  if (data.roe > 18) {
    efficiencyNote = `كفاءة الإدارة في استغلال رأس المال ممتازة، حيث بلغ العائد على حقوق المساهمين (ROE) نسبة ${roe}%. هذا النمو يترجم فعلياً في ربحية السهم التي بلغت ${eps} ريال، مما يعزز الثقة في استراتيجية الإدارة.`;
  } else if (data.roe > 10) {
    efficiencyNote = `تحقق الشركة عائداً مقبولاً على حقوق المساهمين بنسبة ${roe}%، وهو أداء متزن يعكس استمرارية العمليات وتحقيق ربحية للسهم قدرها ${eps} ريال دون الحاجة لرفع مستويات المخاطرة التشغيلية.`;
  } else {
    efficiencyNote = `العائد على حقوق المساهمين يبلغ حالياً ${roe}%، وهو رقم يحتاج إلى تحسين لرفع قيمة السهم الدفترية. ربحية السهم البالغة ${eps} ريال تشير إلى وجود مساحة كافية لتطوير الأداء وزيادة الكفاءة.`;
  }

  // 3. تحليل الملاءة المالية (Solvency & Liquidity)
  let solvencyNote = "";
  const liq = data.currentRatio.toFixed(2);
  const debt = data.debtToEquity.toFixed(2);

  if (data.debtToEquity < 0.4 && data.currentRatio > 1.5) {
    solvencyNote = `المركز المالي صلب للغاية؛ حيث تبلغ نسبة السيولة الحالية ${liq} مقابل التزامات قصيرة الأجل، مع مستوى مديونية منخفض جداً قدره ${debt}. هذا الوضع يمنح الشركة ملاءة تمكنها من التوسع أو زيادة التوزيعات.`;
  } else if (data.debtToEquity < 0.8) {
    solvencyNote = `هيكل رأس المال متوازن مع نسبة مديونية قدرها ${debt}. السيولة الحالية عند مستوى ${liq} كافية تماماً لتغطية الالتزامات الجارية، مما يحمي التدفقات النقدية من أي ضغوط تمويلية مفاجئة.`;
  } else {
    solvencyNote = `نسبة المديونية تبلغ ${debt} مقابل الحقوق، مع سيولة جارية قدرها ${liq}. هذا يتطلب إدارة حذرة للتدفقات النقدية لضمان الوفاء بالالتزامات التمويلية دون التأثير على استقرار توزيعات الأرباح.`;
  }

  const rating = Math.min(10, Math.max(1, Math.round(
    (data.currentRatio > 1.2 ? 3 : 1) + 
    (data.debtToEquity < 0.5 ? 3 : 1) + 
    (data.roe > 15 ? 4 : 2)
  )));

  return {
    status: rating >= 7 ? 'إيجابي' : rating >= 5 ? 'محايد' : 'سلبي',
    rating: rating,
    executiveSummary: `1. [جودة الأرباح]: ${qualityNote}\n\n2. [كفاءة التشغيل]: ${efficiencyNote}\n\n3. [الملاءة المالية]: ${solvencyNote}`,
    strengths: [
      data.currentRatio > 1.4 ? `سيولة نقدية جيدة (${liq})` : "تغطية مقبولة للالتزامات",
      data.roe > 15 ? `عائد قوي على الحقوق (${roe}%)` : "استقرار المركز المالي"
    ],
    weaknesses: [
      data.peRatio > 20 ? "تقييم السهم مرتفع بناءً على الأرباح" : "المنافسة القطاعية قد تضغط على الهوامش",
      data.debtToEquity > 0.6 ? `تحتاج لمراقبة مستوى الدين (${debt})` : "الحاجة لزيادة تدفقات الكاش"
    ]
  };
};

export const FINANCIAL_GLOSSARY: Record<string, { title: string, definition: string }> = {
  revenue: { title: "الإيرادات", definition: "إجمالي المبالغ الداخلة للشركة من بيع منتجاتها أو خدماتها." },
  netIncome: { title: "صافي الربح", definition: "المبلغ المتبقي بعد خصم كافة التكاليف والمصاريف والزكاة." },
  freeCashFlow: { title: "التدفق النقدي الحر", definition: "الكاش الفعلي المتوفر للتوزيع على المساهمين بعد الاستثمارات." },
  peRatio: { title: "مكرر الربحية", definition: "السعر الذي تدفعه مقابل كل ريال ربح تحققه الشركة." },
  roe: { title: "العائد على الحقوق", definition: "مدى شطارة الإدارة في استثمار أموال الملاك." },
  debtToEquity: { title: "نسبة المديونية", definition: "حجم ديون الشركة مقارنة بأموال الملاك." }
};
