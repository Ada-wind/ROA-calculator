export const YEARS = [1, 2, 3, 4];

export const defaultCurrencySettings = {
  selectedCurrency: "RMB",
  rates: {
    RMB: 1,
    USD: 0.14,
    IDR: 2300,
  },
};

export const defaultFormState = {
  background: {
    customerCompanyName: "",
    routeScenarios: [{ scenario: "", description: "" }],
    operationSite: "",
    siteLocation: "",
    contacts: [{ name: "", title: "", phone: "" }],
    organizationStructures: [{ department: "", position: "", headcount: "", averageSalary: "" }],
    requestDate: "",
    counterpart: "",
    requestedVehicleType: "",
    energyType: "electric",
    desiredConfig: "",
    concernsAndPainPoints: "",
    expectedDeliveryDate: "",
    specialRequirements: "",
  },
  revenue: {
    transportPrice: 85,
    annualDowntimeDays: 20,
    expectedTransportVolume: 420000,
    expectedTransportDays: 330,
    vehicleCountMode: "calculated",
    manualVehicleCount: 12,
    loadVolumeMode: "dimensions",
    cargoBoxLength: 8.6,
    cargoBoxWidth: 2.35,
    cargoBoxHeight: 1.75,
    directLoadVolume: 35,
    materialDensity: 0.9,
    roundTripHours: 4,
    morningMeeting: 0.3,
    mealTime: 1,
    restTime: 1,
    shiftChangeTime: 0.4,
    otherOperationIdle: 0.2,
    loadingQueue: 0.5,
    unloadingQueue: 0.5,
    yardQueue: 0.2,
    traffic: 0.4,
    fuelingOrCharging: 0.4,
    otherTransitIdle: 0.2,
    maintenanceHours: {
      year1: 8,
      year2: 8,
      year3: 8,
      year4: 8,
    },
    partsWaitHours: {
      year1: 4,
      year2: 4,
      year3: 4,
      year4: 4,
    },
    annualMaintenanceCounts: {
      year1: 2,
      year2: 3,
      year3: 4,
      year4: 5,
    },
  },
  expenses: {
    purchasePrice: 420000,
    depreciationYears: 4,
    driverCount: 12,
    driverSalary: 120000,
    technicianCount: 0,
    technicianSalary: 0,
    warehouseManagerCount: 0,
    warehouseManagerSalary: 0,
    laborRoles: [],
    kmEnergyUse: 1.4,
    energyPrice: 1.1,
    oneWayDistance: 55,
    repairHoursPerVisit: 10,
    repairUnitPrice: 180,
    repairFrequency: {
      year1: 1,
      year2: 2,
      year3: 3,
      year4: 4,
    },
    tireUnitPrice: 4200,
    tiresPerVehicle: 10,
    tireReplacementFrequency: {
      year1: 0.5,
      year2: 1,
      year3: 1.5,
      year4: 2,
    },
    managementCount: 3,
    managementSalary: 150000,
    facilityRent: 260000,
    officeSpend: 120000,
    partsCostMode: "formula",
    annualPartsDirectCost: {
      year1: 0,
      year2: 0,
      year3: 0,
      year4: 0,
    },
    partsItems: [
      { name: "制动片", quantity: 2, price: 850, frequency: 2 },
      { name: "滤芯", quantity: 4, price: 280, frequency: 4 },
      { name: "油液包", quantity: 1, price: 1250, frequency: 3 },
    ],
  },
  assets: {
    infrastructurePurchaseValue: 2800000,
    infrastructureValue: 2800000,
    infrastructureDepreciationYears: 10,
    partsSafetyRate: 0.25,
    tireSafetyRate: 0.25,
  },
};

export const emptyFormState = {
  background: {
    customerCompanyName: "",
    routeScenarios: [{ scenario: "", description: "" }],
    operationSite: "",
    siteLocation: "",
    contacts: [{ name: "", title: "", phone: "" }],
    organizationStructures: [{ department: "", position: "", headcount: "", averageSalary: "" }],
    requestDate: "",
    counterpart: "",
    requestedVehicleType: "",
    energyType: "electric",
    desiredConfig: "",
    concernsAndPainPoints: "",
    expectedDeliveryDate: "",
    specialRequirements: "",
  },
  revenue: {
    transportPrice: "",
    annualDowntimeDays: "",
    expectedTransportVolume: "",
    expectedTransportDays: "",
    vehicleCountMode: "calculated",
    manualVehicleCount: "",
    loadVolumeMode: "dimensions",
    cargoBoxLength: "",
    cargoBoxWidth: "",
    cargoBoxHeight: "",
    directLoadVolume: "",
    materialDensity: "",
    roundTripHours: "",
    morningMeeting: "",
    mealTime: "",
    restTime: "",
    shiftChangeTime: "",
    otherOperationIdle: "",
    loadingQueue: "",
    unloadingQueue: "",
    yardQueue: "",
    traffic: "",
    fuelingOrCharging: "",
    otherTransitIdle: "",
    maintenanceHours: {
      year1: "",
      year2: "",
      year3: "",
      year4: "",
    },
    partsWaitHours: {
      year1: "",
      year2: "",
      year3: "",
      year4: "",
    },
    annualMaintenanceCounts: {
      year1: "",
      year2: "",
      year3: "",
      year4: "",
    },
  },
  expenses: {
    purchasePrice: "",
    depreciationYears: "",
    driverCount: "",
    driverSalary: "",
    technicianCount: "",
    technicianSalary: "",
    warehouseManagerCount: "",
    warehouseManagerSalary: "",
    laborRoles: [],
    kmEnergyUse: "",
    energyPrice: "",
    oneWayDistance: "",
    repairHoursPerVisit: "",
    repairUnitPrice: "",
    repairFrequency: {
      year1: "",
      year2: "",
      year3: "",
      year4: "",
    },
    tireUnitPrice: "",
    tiresPerVehicle: "",
    tireReplacementFrequency: {
      year1: "",
      year2: "",
      year3: "",
      year4: "",
    },
    managementCount: "",
    managementSalary: "",
    facilityRent: "",
    officeSpend: "",
    partsCostMode: "formula",
    annualPartsDirectCost: {
      year1: "",
      year2: "",
      year3: "",
      year4: "",
    },
    partsItems: [{ name: "", quantity: "", price: "", frequency: "" }],
  },
  assets: {
    infrastructurePurchaseValue: "",
    infrastructureValue: "",
    infrastructureDepreciationYears: 10,
    partsSafetyRate: "",
    tireSafetyRate: "",
  },
};

const sum = (values) => values.reduce((total, value) => total + value, 0);

export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function normalizeForms(stored) {
  const base = deepClone(defaultFormState);
  const source = stored && typeof stored === "object" ? stored : {};
  const merged = {
    ...base,
    ...source,
    background: {
      ...base.background,
      ...source.background,
      routeScenarios:
        source.background?.routeScenarios ?? (source.background?.routeScenario ? [{ scenario: source.background.routeScenario, description: "" }] : base.background.routeScenarios),
      contacts:
        source.background?.contacts ??
        (source.background?.contactName
          ? [{ name: source.background.contactName, title: source.background.contactTitle ?? "", phone: source.background.contactPhone ?? "" }]
          : base.background.contacts),
      organizationStructures:
        source.background?.organizationStructures ??
        (source.background?.departmentDivision
          ? [{ department: source.background.departmentDivision, position: "", headcount: source.background.organizationHeadcount ?? "", averageSalary: "" }]
          : base.background.organizationStructures),
    },
    revenue: {
      ...base.revenue,
      ...source.revenue,
      maintenanceHours:
        typeof source.revenue?.maintenanceHours === "object"
          ? { ...base.revenue.maintenanceHours, ...source.revenue.maintenanceHours }
          : base.revenue.maintenanceHours,
      partsWaitHours:
        typeof source.revenue?.partsWaitHours === "object"
          ? { ...base.revenue.partsWaitHours, ...source.revenue.partsWaitHours }
          : base.revenue.partsWaitHours,
      annualMaintenanceCounts: {
        ...base.revenue.annualMaintenanceCounts,
        ...source.revenue?.annualMaintenanceCounts,
      },
    },
    expenses: {
      ...base.expenses,
      ...source.expenses,
      repairFrequency: { ...base.expenses.repairFrequency, ...source.expenses?.repairFrequency },
      tireReplacementFrequency: {
        ...base.expenses.tireReplacementFrequency,
        ...source.expenses?.tireReplacementFrequency,
      },
      annualPartsDirectCost: {
        ...base.expenses.annualPartsDirectCost,
        ...source.expenses?.annualPartsDirectCost,
      },
      partsItems: source.expenses?.partsItems?.length ? source.expenses.partsItems : base.expenses.partsItems,
      laborRoles: source.expenses?.laborRoles?.length ? source.expenses.laborRoles : base.expenses.laborRoles,
    },
    assets: {
      ...base.assets,
      ...source.assets,
    },
  };

  if (!merged.assets.infrastructurePurchaseValue && merged.assets.infrastructureValue) {
    merged.assets.infrastructurePurchaseValue = merged.assets.infrastructureValue;
  }

  return merged;
}

export function resetSectionData(section) {
  return deepClone(emptyFormState[section]);
}

export function numberValue(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function safeDivide(numerator, denominator, key, warnings) {
  if (!denominator) {
    warnings.push(key);
    return 0;
  }
  return numerator / denominator;
}

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export function convertCurrency(value, currencySettings) {
  const rate = numberValue(currencySettings.rates[currencySettings.selectedCurrency]) || 1;
  return value * rate;
}

export function getCurrencySymbol(currency) {
  return {
    RMB: "¥",
    USD: "$",
    IDR: "Rp",
  }[currency] ?? "";
}

export function formatMoney(value, currencySettings) {
  const converted = convertCurrency(value, currencySettings);
  const code = currencySettings.selectedCurrency;
  const locale = code === "IDR" ? "id-ID" : code === "USD" ? "en-US" : "zh-CN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    maximumFractionDigits: code === "IDR" ? 0 : 2,
  }).format(converted);
}

export function formatMoneyPlain(value, currencySettings) {
  const converted = convertCurrency(value, currencySettings);
  const locale =
    currencySettings.selectedCurrency === "IDR"
      ? "id-ID"
      : currencySettings.selectedCurrency === "USD"
        ? "en-US"
        : "zh-CN";

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: currencySettings.selectedCurrency === "IDR" ? 0 : 2,
  }).format(converted);
}

export function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}

export function computeBusinessModel(forms) {
  const warnings = [];
  const revenue = forms.revenue;
  const expenses = forms.expenses;
  const assets = forms.assets;

  const loadVolume =
    revenue.loadVolumeMode === "dimensions"
      ? numberValue(revenue.cargoBoxLength) *
        numberValue(revenue.cargoBoxWidth) *
        numberValue(revenue.cargoBoxHeight)
      : numberValue(revenue.directLoadVolume);

  const operatingDays = Math.max(0, 365 - numberValue(revenue.annualDowntimeDays));
  const payload = Math.max(0, loadVolume * numberValue(revenue.materialDensity));
  const nwhOperation =
    numberValue(revenue.morningMeeting) +
    numberValue(revenue.mealTime) +
    numberValue(revenue.restTime) +
    numberValue(revenue.shiftChangeTime) +
    numberValue(revenue.otherOperationIdle);
  const nwhTransit =
    numberValue(revenue.loadingQueue) +
    numberValue(revenue.unloadingQueue) +
    numberValue(revenue.yardQueue) +
    numberValue(revenue.traffic) +
    numberValue(revenue.fuelingOrCharging) +
    numberValue(revenue.otherTransitIdle);
  const invalidWorkTime = nwhOperation + nwhTransit;
  const effectiveDailyHours = Math.max(0, 24 - invalidWorkTime);
  const dailyTrips = Math.max(
    0,
    safeDivide(effectiveDailyHours, numberValue(revenue.roundTripHours), "dailyTripsDivisor", warnings),
  );
  const expectedDailyDemand = Math.max(
    0,
    safeDivide(
      numberValue(revenue.expectedTransportVolume),
      numberValue(revenue.expectedTransportDays),
      "expectedTransportDaysDivisor",
      warnings,
    ),
  );
  const vehicleCountRaw = Math.max(
    0,
    safeDivide(expectedDailyDemand, payload * dailyTrips, "vehicleCountDivisor", warnings),
  );
  const vehicleCount =
    revenue.vehicleCountMode === "manual"
      ? Math.max(0, Math.round(numberValue(revenue.manualVehicleCount)))
      : vehicleCountRaw > 0
        ? Math.ceil(vehicleCountRaw)
        : 0;

  const formulaPartsCost = sum(
    expenses.partsItems.map(
      (item) =>
        numberValue(item.quantity) * numberValue(item.price) * numberValue(item.frequency),
    ),
  );

  const annualRows = YEARS.map((year) => {
    const maintenanceCount = numberValue(revenue.annualMaintenanceCounts[`year${year}`]);
    const availableHours = operatingDays * effectiveDailyHours;
    const maintenanceDowntime =
      maintenanceCount *
      (numberValue(revenue.maintenanceHours[`year${year}`]) +
        numberValue(revenue.partsWaitHours[`year${year}`]));
    const attendanceRate = clamp(
      safeDivide(
        availableHours - maintenanceDowntime,
        availableHours,
        `attendanceDivisorYear${year}`,
        warnings,
      ),
    );
    const annualTripsPerVehicle = operatingDays * dailyTrips * attendanceRate;

    const annualRevenue =
      numberValue(revenue.transportPrice) *
      operatingDays *
      payload *
      dailyTrips *
      attendanceRate *
      vehicleCount;

    const depreciationCost =
      vehicleCount *
      safeDivide(
        numberValue(expenses.purchasePrice),
        numberValue(expenses.depreciationYears),
        "depreciationDivisor",
        warnings,
      );
    const laborCost =
      numberValue(expenses.driverCount) * numberValue(expenses.driverSalary) +
      numberValue(expenses.technicianCount) * numberValue(expenses.technicianSalary) +
      numberValue(expenses.warehouseManagerCount) * numberValue(expenses.warehouseManagerSalary) +
      sum(
        (expenses.laborRoles ?? []).map(
          (role) => numberValue(role.count) * numberValue(role.salary),
        ),
      );
    const energyCost =
      numberValue(expenses.kmEnergyUse) *
      numberValue(expenses.energyPrice) *
      2 *
      numberValue(expenses.oneWayDistance) *
      dailyTrips *
      operatingDays *
      vehicleCount;
    const attendanceAdjustedEnergyCost = energyCost * attendanceRate;
    const partsCost =
      expenses.partsCostMode === "direct"
        ? numberValue(expenses.annualPartsDirectCost[`year${year}`])
        : formulaPartsCost;
    const repairCost =
      year === 1
        ? 0
        : numberValue(expenses.repairHoursPerVisit) *
          numberValue(expenses.repairFrequency[`year${year}`]) *
          numberValue(expenses.repairUnitPrice) *
          vehicleCount;
    const tireCost =
      numberValue(expenses.tireUnitPrice) *
      numberValue(expenses.tiresPerVehicle) *
      vehicleCount *
      numberValue(expenses.tireReplacementFrequency[`year${year}`]);
    const operationCost =
      numberValue(expenses.managementCount) * numberValue(expenses.managementSalary) +
      numberValue(expenses.facilityRent) +
      numberValue(expenses.officeSpend);

    const totalExpense =
      depreciationCost +
      laborCost +
      attendanceAdjustedEnergyCost +
      partsCost +
      repairCost +
      tireCost +
      operationCost;

    const vehicleNetValue = Math.max(
      0,
      vehicleCount *
        numberValue(expenses.purchasePrice) *
        (1 - year / Math.max(numberValue(expenses.depreciationYears), 1)),
    );
    const infraNetValue = Math.max(
      0,
      numberValue(assets.infrastructurePurchaseValue || assets.infrastructureValue) *
        (1 - year / Math.max(numberValue(assets.infrastructureDepreciationYears), 1)),
    );
    const partsInventory = partsCost * numberValue(assets.partsSafetyRate);
    const tireInventory = tireCost * numberValue(assets.tireSafetyRate);
    const totalAssets = vehicleNetValue + infraNetValue + partsInventory + tireInventory;
    const annualProfit = annualRevenue - totalExpense;
    const roa = safeDivide(annualProfit, totalAssets, `roaDivisorYear${year}`, warnings) * 100;

    return {
      year,
      maintenanceCount,
      attendanceRate,
      annualTripsPerVehicle,
      annualRevenue,
      depreciationCost,
      laborCost,
      energyCost: attendanceAdjustedEnergyCost,
      partsCost,
      repairCost,
      tireCost,
      operationCost,
      totalExpense,
      annualProfit,
      vehicleNetValue,
      infraNetValue,
      partsInventory,
      tireInventory,
      totalAssets,
      roa,
    };
  });

  const totalRevenue = sum(annualRows.map((row) => row.annualRevenue));
  const totalExpense = sum(annualRows.map((row) => row.totalExpense));
  const totalAssets = sum(annualRows.map((row) => row.totalAssets));
  const lifecycleProfit = totalRevenue - totalExpense;
  const lifecycleRoa =
    safeDivide(lifecycleProfit, totalAssets, "lifecycleRoaDivisor", warnings) * 100;
  const averageAnnualRevenue = safeDivide(totalRevenue, YEARS.length, "avgRevenueDivisor", []);
  const averageAnnualExpense = safeDivide(totalExpense, YEARS.length, "avgExpenseDivisor", []);
  const averageAnnualAssets = safeDivide(totalAssets, YEARS.length, "avgAssetsDivisor", []);
  const averageAttendanceRate =
    safeDivide(sum(annualRows.map((row) => row.attendanceRate)), YEARS.length, "avgAttendanceDivisor", []) * 100;
  const averageRepairCost = safeDivide(
    sum(annualRows.map((row) => row.repairCost)),
    YEARS.length,
    "avgRepairDivisor",
    [],
  );
  const averageTireCost = safeDivide(
    sum(annualRows.map((row) => row.tireCost)),
    YEARS.length,
    "avgTireDivisor",
    [],
  );
  const averageInfraNetValue = safeDivide(
    sum(annualRows.map((row) => row.infraNetValue)),
    YEARS.length,
    "avgInfraDivisor",
    [],
  );
  const averagePartsInventory = safeDivide(
    sum(annualRows.map((row) => row.partsInventory)),
    YEARS.length,
    "avgPartsInventoryDivisor",
    [],
  );
  const averageTireInventory = safeDivide(
    sum(annualRows.map((row) => row.tireInventory)),
    YEARS.length,
    "avgTireInventoryDivisor",
    [],
  );
  const averageVehicleNetValue = safeDivide(
    sum(annualRows.map((row) => row.vehicleNetValue)),
    YEARS.length,
    "avgVehicleNetValueDivisor",
    [],
  );

  return {
    warnings,
    assumptions: {
      loadVolume,
      operatingDays,
      payload,
      nwhOperation,
      nwhTransit,
      invalidWorkTime,
      effectiveDailyHours,
      dailyTrips,
      expectedDailyDemand,
      vehicleCountRaw,
      vehicleCount,
      partsCost: formulaPartsCost,
    },
    annualRows,
    lifecycle: {
      annualRevenue: totalRevenue,
      totalExpense,
      annualProfit: lifecycleProfit,
      totalAssets,
      roa: lifecycleRoa,
      averageAnnualRevenue,
      averageAnnualExpense,
      averageAnnualAssets,
      averageAttendanceRate,
      averageRepairCost,
      averageTireCost,
      averageVehicleNetValue,
      averageInfraNetValue,
      averagePartsInventory,
      averageTireInventory,
    },
  };
}
