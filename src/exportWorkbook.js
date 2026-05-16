import { formatPercent } from "./calculations";

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

export function exportRoaWorkbook({ t, savedForms, model, reportCurrency, annualTableRows, annualSummaryRow, revenueTableRows, costTableRows, assetTableRows, lifecycleParamRows }) {
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
    [t.labels.routeScenario, t.labels.routeDescription],
    ...savedForms.background.routeScenarios.map((item) => [item.scenario || "", item.description || ""]),
    [""],
    [t.labels.contactName, t.labels.contactTitle, t.labels.contactPhone],
    ...savedForms.background.contacts.map((item) => [item.name || "", item.title || "", item.phone || ""]),
    [""],
    [t.labels.departmentDivision, t.labels.organizationPosition, t.labels.organizationHeadcount, t.labels.organizationAverageSalary],
    ...savedForms.background.organizationStructures.map((item) => [
      item.department || "",
      item.position || "",
      item.headcount || "",
      item.averageSalary || "",
    ]),
  ];

  const revenueRows = [
    ["Formula", t.formulas.revenue],
    [t.table.parameter, "Y1", "Y2", "Y3", "Y4"],
    [t.labels.transportPrice, savedForms.revenue.transportPrice || "", savedForms.revenue.transportPrice || "", savedForms.revenue.transportPrice || "", savedForms.revenue.transportPrice || ""],
    [t.metrics.operatingDays, model.assumptions.operatingDays, model.assumptions.operatingDays, model.assumptions.operatingDays, model.assumptions.operatingDays],
    [t.metrics.payload, model.assumptions.payload, model.assumptions.payload, model.assumptions.payload, model.assumptions.payload],
    [t.metrics.dailyTrips, model.assumptions.dailyTrips, model.assumptions.dailyTrips, model.assumptions.dailyTrips, model.assumptions.dailyTrips],
    [t.labels.maintenanceHours, savedForms.revenue.maintenanceHours.year1, savedForms.revenue.maintenanceHours.year2, savedForms.revenue.maintenanceHours.year3, savedForms.revenue.maintenanceHours.year4],
    [t.labels.partsWaitHours, savedForms.revenue.partsWaitHours.year1, savedForms.revenue.partsWaitHours.year2, savedForms.revenue.partsWaitHours.year3, savedForms.revenue.partsWaitHours.year4],
    [t.labels.annualMaintenanceCounts, savedForms.revenue.annualMaintenanceCounts.year1, savedForms.revenue.annualMaintenanceCounts.year2, savedForms.revenue.annualMaintenanceCounts.year3, savedForms.revenue.annualMaintenanceCounts.year4],
    [t.metrics.attendanceRate, ...model.annualRows.map((row) => formatPercent(row.attendanceRate * 100))],
    [t.metrics.vehicleCount, model.assumptions.vehicleCount, model.assumptions.vehicleCount, model.assumptions.vehicleCount, model.assumptions.vehicleCount],
    [t.table.revenue, ...model.annualRows.map((row) => row.annualRevenue)],
  ];

  const expenseRows = [
    ["Formula", t.formulas.expense],
    [t.table.parameter, "Y1", "Y2", "Y3", "Y4"],
    [t.labels.purchasePrice, savedForms.expenses.purchasePrice || "", savedForms.expenses.purchasePrice || "", savedForms.expenses.purchasePrice || "", savedForms.expenses.purchasePrice || ""],
    [t.labels.driverCount, savedForms.expenses.driverCount || "", savedForms.expenses.driverCount || "", savedForms.expenses.driverCount || "", savedForms.expenses.driverCount || ""],
    [t.labels.driverSalary, savedForms.expenses.driverSalary || "", savedForms.expenses.driverSalary || "", savedForms.expenses.driverSalary || "", savedForms.expenses.driverSalary || ""],
    [t.labels.technicianCount, savedForms.expenses.technicianCount || "", savedForms.expenses.technicianCount || "", savedForms.expenses.technicianCount || "", savedForms.expenses.technicianCount || ""],
    [t.labels.technicianSalary, savedForms.expenses.technicianSalary || "", savedForms.expenses.technicianSalary || "", savedForms.expenses.technicianSalary || "", savedForms.expenses.technicianSalary || ""],
    [t.labels.warehouseManagerCount, savedForms.expenses.warehouseManagerCount || "", savedForms.expenses.warehouseManagerCount || "", savedForms.expenses.warehouseManagerCount || "", savedForms.expenses.warehouseManagerCount || ""],
    [t.labels.warehouseManagerSalary, savedForms.expenses.warehouseManagerSalary || "", savedForms.expenses.warehouseManagerSalary || "", savedForms.expenses.warehouseManagerSalary || "", savedForms.expenses.warehouseManagerSalary || ""],
    ...((savedForms.expenses.laborRoles ?? []).flatMap((role) => ([
      [`${role.name || t.labels.extraRoleName} - ${t.labels.extraRoleCount}`, role.count || "", role.count || "", role.count || "", role.count || ""],
      [`${role.name || t.labels.extraRoleName} - ${t.labels.extraRoleSalary}`, role.salary || "", role.salary || "", role.salary || "", role.salary || ""],
    ]))),
    [t.labels.kmEnergyUse, savedForms.expenses.kmEnergyUse || "", savedForms.expenses.kmEnergyUse || "", savedForms.expenses.kmEnergyUse || "", savedForms.expenses.kmEnergyUse || ""],
    [t.labels.energyPrice, savedForms.expenses.energyPrice || "", savedForms.expenses.energyPrice || "", savedForms.expenses.energyPrice || "", savedForms.expenses.energyPrice || ""],
    [t.labels.oneWayDistance, savedForms.expenses.oneWayDistance || "", savedForms.expenses.oneWayDistance || "", savedForms.expenses.oneWayDistance || "", savedForms.expenses.oneWayDistance || ""],
    [t.labels.repairFrequency, savedForms.expenses.repairFrequency.year1, savedForms.expenses.repairFrequency.year2, savedForms.expenses.repairFrequency.year3, savedForms.expenses.repairFrequency.year4],
    [t.labels.tireUnitPrice, savedForms.expenses.tireUnitPrice || "", savedForms.expenses.tireUnitPrice || "", savedForms.expenses.tireUnitPrice || "", savedForms.expenses.tireUnitPrice || ""],
    [t.labels.tiresPerVehicle, savedForms.expenses.tiresPerVehicle || "", savedForms.expenses.tiresPerVehicle || "", savedForms.expenses.tiresPerVehicle || "", savedForms.expenses.tiresPerVehicle || ""],
    [t.labels.tireReplacementFrequency, savedForms.expenses.tireReplacementFrequency.year1, savedForms.expenses.tireReplacementFrequency.year2, savedForms.expenses.tireReplacementFrequency.year3, savedForms.expenses.tireReplacementFrequency.year4],
    [t.formulaCards.depreciationCost, ...model.annualRows.map((row) => row.depreciationCost)],
    [t.formulaCards.laborCost, ...model.annualRows.map((row) => row.laborCost)],
    [t.formulaCards.energyCost, ...model.annualRows.map((row) => row.energyCost)],
    [t.formulaCards.partsCost, ...model.annualRows.map((row) => row.partsCost)],
    [t.formulaCards.repairCost, ...model.annualRows.map((row) => row.repairCost)],
    [t.formulaCards.tireCost, ...model.annualRows.map((row) => row.tireCost)],
    [t.formulaCards.operationCost, ...model.annualRows.map((row) => row.operationCost)],
    [t.table.expense, ...model.annualRows.map((row) => row.totalExpense)],
  ];

  const assetRows = [
    ["Formula", t.formulas.asset],
    [t.table.parameter, "Y1", "Y2", "Y3", "Y4"],
    [t.labels.infrastructurePurchaseValue, savedForms.assets.infrastructurePurchaseValue || "", savedForms.assets.infrastructurePurchaseValue || "", savedForms.assets.infrastructurePurchaseValue || "", savedForms.assets.infrastructurePurchaseValue || ""],
    [t.labels.infrastructureDepreciationYears, savedForms.assets.infrastructureDepreciationYears || "", savedForms.assets.infrastructureDepreciationYears || "", savedForms.assets.infrastructureDepreciationYears || "", savedForms.assets.infrastructureDepreciationYears || ""],
    [t.formulaCards.vehicleAsset, ...model.annualRows.map((row) => row.vehicleNetValue)],
    [t.formulaCards.infraAsset, ...model.annualRows.map((row) => row.infraNetValue)],
    [t.formulaCards.partsAsset, ...model.annualRows.map((row) => row.partsInventory)],
    [t.formulaCards.tireAsset, ...model.annualRows.map((row) => row.tireInventory)],
    [t.table.assets, ...model.annualRows.map((row) => row.totalAssets)],
  ];

  const roaSheetRows = [
    [t.table.lifecycleParams],
    [t.table.parameter, t.table.value],
    ...lifecycleParamRows.map((row) => [row.parameter, row.value]),
    [""],
    [t.table.revenueModel],
    [t.table.year, `${t.labels.transportPrice} (${reportCurrency}/${t.units.ton})`, t.metrics.operatingDays, t.metrics.payload, t.metrics.dailyTrips, t.metrics.attendanceRate, t.metrics.vehicleCount, `${t.table.revenue} (${reportCurrency})`],
    ...revenueTableRows.map((row) => [row.year, row.transportPrice, row.operatingDays, row.payload, row.dailyTrips, row.attendanceRate, row.vehicleCount, row.revenue]),
    [""],
    [t.table.costModel],
    [t.table.year, `${t.formulaCards.depreciationCost} (${reportCurrency})`, `${t.formulaCards.laborCost} (${reportCurrency})`, `${t.formulaCards.energyCost} (${reportCurrency})`, `${t.formulaCards.partsCost} (${reportCurrency})`, `${t.formulaCards.repairCost} (${reportCurrency})`, `${t.formulaCards.tireCost} (${reportCurrency})`, `${t.formulaCards.operationCost} (${reportCurrency})`, `${t.table.expense} (${reportCurrency})`],
    ...costTableRows.map((row) => [row.year, row.depreciationCost, row.laborCost, row.energyCost, row.partsCost, row.repairCost, row.tireCost, row.operationCost, row.totalExpense]),
    [""],
    [t.table.assetModel],
    [t.table.year, `${t.formulaCards.vehicleAsset} (${reportCurrency})`, `${t.table.infrastructure} (${reportCurrency})`, `${t.table.partsAsset} (${reportCurrency})`, `${t.table.tireAsset} (${reportCurrency})`, `${t.table.assets} (${reportCurrency})`],
    ...assetTableRows.map((row) => [row.year, row.vehicleAsset, row.infrastructure, row.partsAsset, row.tireAsset, row.assets]),
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
  downloadBlob(blob, `roa-analysis-${reportCurrency}-${dateStamp}.xls`);
}
