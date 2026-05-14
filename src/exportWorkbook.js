function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function inferType(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return "Number";
  }
  return "String";
}

function cellXml(value) {
  const type = inferType(value);
  return `<Cell><Data ss:Type="${type}">${escapeXml(value)}</Data></Cell>`;
}

function rowXml(row) {
  return `<Row>${row.map(cellXml).join("")}</Row>`;
}

function worksheetXml(name, rows) {
  return `<Worksheet ss:Name="${escapeXml(name)}"><Table>${rows.map(rowXml).join("")}</Table></Worksheet>`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function exportRoaWorkbook({ t, savedForms, savedCurrency, model, reportCurrency, annualTableRows, annualSummaryRow, revenueTableRows, costTableRows, assetTableRows, lifecycleParamRows }) {
  const backgroundRows = [
    [t.labels.customerCompanyName, savedForms.background.customerCompanyName || ""],
    [t.labels.operationSite, savedForms.background.operationSite || ""],
    [t.labels.siteLocation, savedForms.background.siteLocation || ""],
    [t.labels.requestDate, savedForms.background.requestDate || ""],
    [t.labels.counterpart, savedForms.background.counterpart || ""],
    [t.labels.requestedVehicleType, savedForms.background.requestedVehicleType || ""],
    [t.labels.energyType, t.energyType[savedForms.background.energyType] || ""],
    [t.labels.desiredConfig, savedForms.background.desiredConfig || ""],
    [t.labels.concernsAndPainPoints, savedForms.background.concernsAndPainPoints || ""],
    [t.labels.expectedDeliveryDate, savedForms.background.expectedDeliveryDate || ""],
    [t.labels.specialRequirements, savedForms.background.specialRequirements || ""],
    [""],
    ["线路 / 场景", "描述"],
    ...savedForms.background.routeScenarios.map((item) => [item.scenario || "", item.description || ""]),
    [""],
    ["联系人", "职务", "电话"],
    ...savedForms.background.contacts.map((item) => [item.name || "", item.title || "", item.phone || ""]),
    [""],
    ["部门", "岗位", "人数", "平均薪资"],
    ...savedForms.background.organizationStructures.map((item) => [
      item.department || "",
      item.position || "",
      item.headcount || "",
      item.averageSalary || "",
    ]),
  ];

  const revenueRows = [
    ["公式", "收入 = 运输单价 × 运营天数 × 单车装载量 × 单天车次 × 出勤率 × 车数"],
    [t.labels.transportPrice, savedForms.revenue.transportPrice || ""],
    [t.metrics.operatingDays, model.assumptions.operatingDays],
    [t.metrics.payload, model.assumptions.payload],
    [t.metrics.dailyTrips, model.assumptions.dailyTrips],
    [t.metrics.attendanceRate, model.lifecycle.averageAttendanceRate],
    [t.metrics.vehicleCount, model.assumptions.vehicleCount],
  ];

  const expenseRows = [
    ["公式", "支出 = 折旧成本 + 人工成本 + 能源成本 + 配件成本 + 维修成本 + 轮胎成本 + 运维成本"],
    [t.formulaCards.depreciationCost, model.annualRows[0]?.depreciationCost ?? 0],
    [t.formulaCards.laborCost, model.annualRows[0]?.laborCost ?? 0],
    [t.formulaCards.energyCost, model.annualRows[0]?.energyCost ?? 0],
    [t.formulaCards.partsCost, model.annualRows[0]?.partsCost ?? 0],
    [t.formulaCards.repairCost, model.lifecycle.averageRepairCost],
    [t.formulaCards.tireCost, model.lifecycle.averageTireCost],
    [t.formulaCards.operationCost, model.annualRows[0]?.operationCost ?? 0],
  ];

  const assetRows = [
    ["公式", "资本 = 自建基础设施 + 配件资产 + 轮胎资产"],
    [t.formulaCards.infraAsset, model.lifecycle.averageInfraNetValue],
    [t.formulaCards.partsAsset, model.lifecycle.averagePartsInventory],
    [t.formulaCards.tireAsset, model.lifecycle.averageTireInventory],
  ];

  const roaSheetRows = [
    [t.table.lifecycleParams],
    [t.table.parameter, t.table.value],
    ...lifecycleParamRows.map((row) => [row.parameter, row.value]),
    [""],
    [t.table.revenueModel],
    [t.table.year, `${t.labels.transportPrice} (${reportCurrency}/吨)`, t.metrics.operatingDays, t.metrics.payload, t.metrics.dailyTrips, t.metrics.attendanceRate, t.metrics.vehicleCount, `${t.table.revenue} (${reportCurrency})`],
    ...revenueTableRows.map((row) => [row.year, row.transportPrice, row.operatingDays, row.payload, row.dailyTrips, row.attendanceRate, row.vehicleCount, row.revenue]),
    [""],
    [t.table.costModel],
    [t.table.year, `${t.formulaCards.depreciationCost} (${reportCurrency})`, `${t.formulaCards.laborCost} (${reportCurrency})`, `${t.formulaCards.energyCost} (${reportCurrency})`, `${t.formulaCards.partsCost} (${reportCurrency})`, `${t.formulaCards.repairCost} (${reportCurrency})`, `${t.formulaCards.tireCost} (${reportCurrency})`, `${t.formulaCards.operationCost} (${reportCurrency})`, `${t.table.expense} (${reportCurrency})`],
    ...costTableRows.map((row) => [row.year, row.depreciationCost, row.laborCost, row.energyCost, row.partsCost, row.repairCost, row.tireCost, row.operationCost, row.totalExpense]),
    [""],
    [t.table.assetModel],
    [t.table.year, `${t.table.infrastructure} (${reportCurrency})`, `${t.table.partsAsset} (${reportCurrency})`, `${t.table.tireAsset} (${reportCurrency})`, `${t.table.assets} (${reportCurrency})`],
    ...assetTableRows.map((row) => [row.year, row.infrastructure, row.partsAsset, row.tireAsset, row.assets]),
    [""],
    [t.table.roaModel],
    [t.table.year, `${t.table.revenue} (${reportCurrency})`, `${t.table.expense} (${reportCurrency})`, `${t.table.assets} (${reportCurrency})`, t.table.roa, t.metrics.lifecycleRoa],
    ...annualTableRows.map((row) => [row.year, row.revenue, row.expense, row.assets, row.roa, formatPercent(model.lifecycle.roa)]),
    [t.table.lifecycle, annualSummaryRow.revenue, annualSummaryRow.expense, annualSummaryRow.assets, annualSummaryRow.roa, formatPercent(model.lifecycle.roa)],
    [""],
    [t.notes.moneyUnit, reportCurrency],
  ];

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
${worksheetXml(t.sectionTitles.background, backgroundRows)}
${worksheetXml(t.sectionTitles.revenue, revenueRows)}
${worksheetXml(t.sectionTitles.expenses, expenseRows)}
${worksheetXml(t.sectionTitles.assets, assetRows)}
${worksheetXml(t.sectionTitles.roa, roaSheetRows)}
</Workbook>`;

  const blob = new Blob([xml], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const dateStamp = new Date().toISOString().slice(0, 10);
  downloadBlob(blob, `roa-analysis-${savedCurrency.selectedCurrency}-${dateStamp}.xls`);
}
import { formatPercent } from "./calculations";
