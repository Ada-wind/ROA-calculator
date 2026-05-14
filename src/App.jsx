import { useEffect, useState } from "react";
import "./App.css";
import {
  computeBusinessModel,
  defaultCurrencySettings,
  defaultFormState,
  formatMoney,
  formatMoneyPlain,
  formatPercent,
  getCurrencySymbol,
  resetSectionData,
} from "./calculations";
import { calculatorSections, copy, navItems } from "./content";
import { InputField, PartsEditor, SectionCard, YearlyFieldGroup } from "./components/FormControls";
import { BarChart, ChartSwitcher, FormulaCard, LineChart, MetricCard, SimpleTable } from "./components/Visuals";
import { exportRoaWorkbook } from "./exportWorkbook";

const storageKeys = {
  language: "roa-language",
  forms: "roa-forms-v2",
  currency: "roa-currency-v2",
};

function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [language, setLanguage] = useState(() => readStorage(storageKeys.language, "zh"));
  const [savedForms, setSavedForms] = useState(() => readStorage(storageKeys.forms, defaultFormState));
  const [draftForms, setDraftForms] = useState(() => readStorage(storageKeys.forms, defaultFormState));
  const [savedCurrency, setSavedCurrency] = useState(() =>
    readStorage(storageKeys.currency, defaultCurrencySettings),
  );
  const [draftCurrency, setDraftCurrency] = useState(() =>
    readStorage(storageKeys.currency, defaultCurrencySettings),
  );
  const [activeSection, setActiveSection] = useState("background");
  const [activeView, setActiveView] = useState("table");
  const [savedMessage, setSavedMessage] = useState("");

  const t = copy[language];
  const model = computeBusinessModel(savedForms);
  const localizedMoney = (value) => formatMoney(value, savedCurrency);
  const localizedMoneyPlain = (value) => formatMoneyPlain(value, savedCurrency);
  const reportCurrency = savedCurrency.selectedCurrency;
  const chartPoints = model.annualRows.map((row) => ({ label: `Y${row.year}`, value: row.roa }));

  useEffect(() => {
    window.localStorage.setItem(storageKeys.language, JSON.stringify(language));
  }, [language]);

  const flashMessage = (message) => {
    setSavedMessage(message);
    window.setTimeout(() => setSavedMessage(""), 2200);
  };

  const persistForms = (nextForms) => {
    setSavedForms(nextForms);
    setDraftForms(nextForms);
    window.localStorage.setItem(storageKeys.forms, JSON.stringify(nextForms));
    flashMessage(t.saved);
  };

  const persistCurrency = (nextCurrency) => {
    setSavedCurrency(nextCurrency);
    setDraftCurrency(nextCurrency);
    window.localStorage.setItem(storageKeys.currency, JSON.stringify(nextCurrency));
    flashMessage(t.saved);
  };

  const clearSection = (section) => {
    const nextSection = resetSectionData(section);
    const nextForms = {
      ...savedForms,
      [section]: nextSection,
    };
    setSavedForms(nextForms);
    setDraftForms((current) => ({ ...current, [section]: nextSection }));
    window.localStorage.setItem(storageKeys.forms, JSON.stringify(nextForms));
    flashMessage(t.cleared);
  };

  const updateSectionValue = (section, key, value) => {
    setDraftForms((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }));
  };

  const updateYearlyValue = (section, key, yearKey, value) => {
    setDraftForms((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: {
          ...current[section][key],
          [yearKey]: value,
        },
      },
    }));
  };

  const updatePartItem = (index, field, value) => {
    setDraftForms((current) => ({
      ...current,
      expenses: {
        ...current.expenses,
        partsItems: current.expenses.partsItems.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      },
    }));
  };

  const addPartItem = () => {
    setDraftForms((current) => ({
      ...current,
      expenses: {
        ...current.expenses,
        partsItems: [...current.expenses.partsItems, { name: "", quantity: "", price: "", frequency: "" }],
      },
    }));
  };

  const removePartItem = (index) => {
    setDraftForms((current) => ({
      ...current,
      expenses: {
        ...current.expenses,
        partsItems: current.expenses.partsItems.filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  };

  const updateArrayItem = (section, key, index, field, value) => {
    setDraftForms((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: current[section][key].map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      },
    }));
  };

  const addArrayItem = (section, key, template) => {
    setDraftForms((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: [...current[section][key], template],
      },
    }));
  };

  const removeArrayItem = (section, key, index, fallbackItem) => {
    setDraftForms((current) => {
      const nextItems = current[section][key].filter((_, itemIndex) => itemIndex !== index);
      return {
        ...current,
        [section]: {
          ...current[section],
          [key]: nextItems.length ? nextItems : [fallbackItem],
        },
      };
    });
  };

  const warningMessages = model.warnings
    .map((key) => {
      if (key.startsWith("attendanceDivisor")) return t.warnings.attendance;
      if (key.startsWith("roaDivisor")) return t.warnings.roa;
      return t.warnings[key];
    })
    .filter(Boolean);

  const annualTableRows = model.annualRows.map((row) => ({
    id: row.year,
    year: `Y${row.year}`,
    revenue: localizedMoneyPlain(row.annualRevenue),
    expense: localizedMoneyPlain(row.totalExpense),
    profit: localizedMoneyPlain(row.annualProfit),
    assets: localizedMoneyPlain(row.totalAssets),
    roa: formatPercent(row.roa),
  }));

  const annualSummaryRow = {
    year: t.table.lifecycle,
    revenue: localizedMoneyPlain(model.lifecycle.annualRevenue),
    expense: localizedMoneyPlain(model.lifecycle.totalExpense),
    profit: localizedMoneyPlain(model.lifecycle.annualProfit),
    assets: localizedMoneyPlain(model.lifecycle.totalAssets),
    roa: formatPercent(model.lifecycle.roa),
  };

  const operationTableRows = model.annualRows.map((row) => ({
    id: `op-${row.year}`,
    year: `Y${row.year}`,
    attendanceRate: formatPercent(row.attendanceRate * 100),
    annualTripsPerVehicle: row.annualTripsPerVehicle.toFixed(1),
    roa: formatPercent(row.roa),
  }));

  const revenueTableRows = model.annualRows.map((row) => ({
    id: `revenue-${row.year}`,
    year: `Y${row.year}`,
    transportPrice: localizedMoneyPlain(savedForms.revenue.transportPrice || 0),
    operatingDays: model.assumptions.operatingDays.toFixed(0),
    payload: model.assumptions.payload.toFixed(2),
    dailyTrips: model.assumptions.dailyTrips.toFixed(2),
    attendanceRate: formatPercent(row.attendanceRate * 100),
    vehicleCount: String(model.assumptions.vehicleCount),
    revenue: localizedMoneyPlain(row.annualRevenue),
  }));

  const costTableRows = model.annualRows.map((row) => ({
    id: `cost-${row.year}`,
    year: `Y${row.year}`,
    depreciationCost: localizedMoneyPlain(row.depreciationCost),
    laborCost: localizedMoneyPlain(row.laborCost),
    energyCost: localizedMoneyPlain(row.energyCost),
    partsCost: localizedMoneyPlain(row.partsCost),
    repairCost: localizedMoneyPlain(row.repairCost),
    tireCost: localizedMoneyPlain(row.tireCost),
    operationCost: localizedMoneyPlain(row.operationCost),
    totalExpense: localizedMoneyPlain(row.totalExpense),
  }));

  const assetTableRows = model.annualRows.map((row) => ({
    id: `asset-${row.year}`,
    year: `Y${row.year}`,
    infrastructure: localizedMoneyPlain(row.infraNetValue),
    partsAsset: localizedMoneyPlain(row.partsInventory),
    tireAsset: localizedMoneyPlain(row.tireInventory),
    assets: localizedMoneyPlain(row.totalAssets),
  }));

  const lifecycleParamRows = [
    { id: "loadVolume", parameter: t.metrics.loadVolume, value: `${model.assumptions.loadVolume.toFixed(2)} m³` },
    { id: "payload", parameter: t.metrics.payload, value: `${model.assumptions.payload.toFixed(2)} t` },
    { id: "operatingDays", parameter: t.metrics.operatingDays, value: `${model.assumptions.operatingDays.toFixed(0)} d` },
    { id: "effectiveDailyHours", parameter: t.metrics.effectiveDailyHours, value: `${model.assumptions.effectiveDailyHours.toFixed(2)} h` },
    { id: "dailyTrips", parameter: t.metrics.dailyTrips, value: model.assumptions.dailyTrips.toFixed(2) },
    { id: "expectedDailyDemand", parameter: t.metrics.expectedDailyDemand, value: `${model.assumptions.expectedDailyDemand.toFixed(2)} t/day` },
    { id: "vehicleCount", parameter: t.metrics.vehicleCount, value: String(model.assumptions.vehicleCount) },
    { id: "lifecycleRoa", parameter: t.metrics.lifecycleRoa, value: formatPercent(model.lifecycle.roa) },
  ];

  const revenueCards = [
    { title: t.labels.transportPrice, value: localizedMoney(savedForms.revenue.transportPrice || 0), hint: "元/吨" },
    { title: t.formulaCards.operatingDays, value: `${model.assumptions.operatingDays.toFixed(0)} d`, hint: "365 - 不运营天数" },
    { title: t.formulaCards.payload, value: `${model.assumptions.payload.toFixed(2)} t`, hint: "单车装载量" },
    { title: t.formulaCards.dailyTrips, value: model.assumptions.dailyTrips.toFixed(2), hint: "24h - NWH 后计算" },
    { title: t.formulaCards.attendanceRate, value: formatPercent(model.lifecycle.averageAttendanceRate), hint: t.notes.averageAnnual },
    { title: t.formulaCards.vehicleCount, value: String(model.assumptions.vehicleCount), hint: t.notes.roundUp },
  ];

  const expenseCards = [
    { title: t.formulaCards.depreciationCost, value: localizedMoney(model.annualRows[0]?.depreciationCost || 0), hint: "年度固定口径" },
    { title: t.formulaCards.laborCost, value: localizedMoney(model.annualRows[0]?.laborCost || 0), hint: "年度固定口径" },
    { title: t.formulaCards.energyCost, value: localizedMoney(model.annualRows[0]?.energyCost || 0), hint: "按当前经营量口径" },
    { title: t.formulaCards.partsCost, value: localizedMoney(model.annualRows[0]?.partsCost || 0), hint: "年度固定口径" },
    { title: t.formulaCards.repairCost, value: localizedMoney(model.lifecycle.averageRepairCost), hint: t.notes.averageAnnual },
    { title: t.formulaCards.tireCost, value: localizedMoney(model.lifecycle.averageTireCost), hint: t.notes.averageAnnual },
    { title: t.formulaCards.operationCost, value: localizedMoney(model.annualRows[0]?.operationCost || 0), hint: "年度固定口径" },
  ];

  const assetCards = [
    { title: t.formulaCards.infraAsset, value: localizedMoney(model.lifecycle.averageInfraNetValue), hint: t.notes.averageAnnual },
    { title: t.formulaCards.partsAsset, value: localizedMoney(model.lifecycle.averagePartsInventory), hint: t.notes.averageAnnual },
    { title: t.formulaCards.tireAsset, value: localizedMoney(model.lifecycle.averageTireInventory), hint: t.notes.averageAnnual },
  ];

  const handleExportExcel = () => {
    exportRoaWorkbook({
      t,
      savedForms,
      savedCurrency,
      model,
      reportCurrency,
      annualTableRows,
      annualSummaryRow,
      revenueTableRows,
      costTableRows,
      assetTableRows,
      operationTableRows,
      lifecycleParamRows,
    });
  };

  return (
    <div className="app-shell">
      <header className="hero" id="home">
        <div className="hero__chrome" />
        <div className="hero__content">
          <div className="hero__topbar">
            <div>
              <span className="eyebrow">{t.badge}</span>
              <h1>{t.heroTitle}</h1>
              <p className="hero__body">{t.heroBody}</p>
            </div>
            <div className="hero__actions">
              <div className="switcher">
                <span>{t.language}</span>
                <button type="button" className={language === "zh" ? "is-active" : ""} onClick={() => setLanguage("zh")}>
                  中文
                </button>
                <button type="button" className={language === "id" ? "is-active" : ""} onClick={() => setLanguage("id")}>
                  Bahasa
                </button>
              </div>
            </div>
          </div>

          <nav className="top-nav">
            <span className="top-nav__brand">{t.brand}</span>
            <div className="top-nav__links">
              {navItems.map((item) => (
                <a href={`#${item}`} key={item}>
                  {t.nav[item]}
                </a>
              ))}
            </div>
          </nav>

          <div className="hero__grid">
            <article className="surface-card hero-card hero-card--primary">
              <h2>{t.homeCardTitle}</h2>
              <p>{t.homeCardBody}</p>
              <p className="hero-card__note">{t.homeCardNote}</p>
              <div className="hero-card__highlights">
                <MetricCard label={t.metrics.lifecycleRoa} value={formatPercent(model.lifecycle.roa)} accent />
                <MetricCard label={t.metrics.vehicleCount} value={String(model.assumptions.vehicleCount)} />
              </div>
            </article>
            <article className="surface-card hero-card">
              <h2>{t.sectionTitles.roa}</h2>
              <div className="hero-card__highlights hero-card__highlights--stack">
                <MetricCard label={t.metrics.annualRevenue} value={localizedMoney(model.lifecycle.annualRevenue)} />
                <MetricCard label={t.metrics.totalExpense} value={localizedMoney(model.lifecycle.totalExpense)} />
                <MetricCard label={t.metrics.totalAssets} value={localizedMoney(model.lifecycle.totalAssets)} />
              </div>
            </article>
          </div>
        </div>
      </header>

      <main className="page-content">
        <section className="surface-card calculator-layout" id="calculator">
          <aside className="calculator-sidebar">
            <div className="calculator-sidebar__title">
              <span className="eyebrow">ROA Calculator</span>
              <h2>{t.brand}</h2>
            </div>
            <div className="calculator-sidebar__menu">
              {calculatorSections.map((section) => (
                <button key={section} type="button" className={activeSection === section ? "is-active" : ""} onClick={() => setActiveSection(section)}>
                  {t.sectionTitles[section]}
                </button>
              ))}
            </div>
            <div className="calculator-sidebar__summary">
              <MetricCard label={t.metrics.annualRevenue} value={localizedMoney(model.lifecycle.annualRevenue)} />
              <MetricCard label={t.metrics.lifecycleRoa} value={formatPercent(model.lifecycle.roa)} />
            </div>
          </aside>

          <div className="calculator-main">
            {activeSection === "background" ? (
              <SectionCard
                title={t.sectionTitles.background}
                intro={t.backgroundIntro}
                footer={
                  <div className="section-card__actions">
                    <button className="primary-button" type="button" onClick={() => persistForms({ ...savedForms, background: draftForms.background })}>
                      {t.save}
                    </button>
                    <button className="ghost-button" type="button" onClick={() => clearSection("background")}>
                      {t.clear}
                    </button>
                    {savedMessage ? <span className="saved-message">{savedMessage}</span> : null}
                  </div>
                }
              >
                <div className="sub-card">
                  <h4>{t.currencyRateTitle}</h4>
                  <p>{t.rateHint}</p>
                  <div className="form-grid form-grid--triple">
                    <InputField
                      label={t.currencyDisplay}
                      type="select"
                      value={draftCurrency.selectedCurrency}
                      onChange={(value) => setDraftCurrency((current) => ({ ...current, selectedCurrency: value }))}
                      options={["RMB", "USD", "IDR"].map((currency) => ({ value: currency, label: currency }))}
                    />
                    {["RMB", "USD", "IDR"].map((currency) => (
                      <InputField
                        key={currency}
                        label={`1 RMB = ${currency}`}
                        value={draftCurrency.rates[currency]}
                        onChange={(value) =>
                          setDraftCurrency((current) => ({
                            ...current,
                            rates: { ...current.rates, [currency]: value },
                          }))
                        }
                        suffix={getCurrencySymbol(currency)}
                      />
                    ))}
                  </div>
                  <div className="section-card__actions">
                    <button className="primary-button" type="button" onClick={() => persistCurrency(draftCurrency)}>
                      {t.save}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <h4>基础信息</h4>
                  <div className="form-grid">
                    <InputField label={t.labels.customerCompanyName} type="text" value={draftForms.background.customerCompanyName} onChange={(value) => updateSectionValue("background", "customerCompanyName", value)} />
                  </div>
                  <div className="repeater-stack">
                    {draftForms.background.routeScenarios.map((item, index) => (
                      <div className="repeater-row" key={`route-${index}`}>
                        <div className="form-grid">
                          <InputField label={t.labels.routeScenario} type="text" value={item.scenario} onChange={(value) => updateArrayItem("background", "routeScenarios", index, "scenario", value)} />
                          <InputField label={t.labels.routeDescription} type="text" value={item.description} onChange={(value) => updateArrayItem("background", "routeScenarios", index, "description", value)} />
                        </div>
                        <button className="ghost-button ghost-button--danger" type="button" onClick={() => removeArrayItem("background", "routeScenarios", index, { scenario: "", description: "" })}>
                          删除
                        </button>
                      </div>
                    ))}
                    <button className="ghost-button" type="button" onClick={() => addArrayItem("background", "routeScenarios", { scenario: "", description: "" })}>
                      {t.repeater.addRoute}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <h4>基础设施</h4>
                  <div className="form-grid">
                    <InputField label={t.labels.operationSite} type="text" value={draftForms.background.operationSite} onChange={(value) => updateSectionValue("background", "operationSite", value)} />
                    <InputField label={t.labels.siteLocation} type="text" value={draftForms.background.siteLocation} onChange={(value) => updateSectionValue("background", "siteLocation", value)} />
                  </div>
                </div>

                <div className="form-group">
                  <h4>联络人</h4>
                  <div className="repeater-stack">
                    {draftForms.background.contacts.map((item, index) => (
                      <div className="repeater-row" key={`contact-${index}`}>
                        <div className="form-grid form-grid--triple">
                          <InputField label={t.labels.contactName} type="text" value={item.name} onChange={(value) => updateArrayItem("background", "contacts", index, "name", value)} />
                          <InputField label={t.labels.contactTitle} type="text" value={item.title} onChange={(value) => updateArrayItem("background", "contacts", index, "title", value)} />
                          <InputField label={t.labels.contactPhone} type="text" value={item.phone} onChange={(value) => updateArrayItem("background", "contacts", index, "phone", value)} />
                        </div>
                        <button className="ghost-button ghost-button--danger" type="button" onClick={() => removeArrayItem("background", "contacts", index, { name: "", title: "", phone: "" })}>
                          删除
                        </button>
                      </div>
                    ))}
                    <button className="ghost-button" type="button" onClick={() => addArrayItem("background", "contacts", { name: "", title: "", phone: "" })}>
                      {t.repeater.addContact}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <h4>客户组织架构</h4>
                  <div className="repeater-stack">
                    {draftForms.background.organizationStructures.map((item, index) => (
                      <div className="repeater-row" key={`org-${index}`}>
                        <div className="form-grid form-grid--quad">
                          <InputField label={t.labels.departmentDivision} type="text" value={item.department} onChange={(value) => updateArrayItem("background", "organizationStructures", index, "department", value)} />
                          <InputField label={t.labels.organizationPosition} type="text" value={item.position} onChange={(value) => updateArrayItem("background", "organizationStructures", index, "position", value)} />
                          <InputField label={t.labels.organizationHeadcount} type="text" value={item.headcount} onChange={(value) => updateArrayItem("background", "organizationStructures", index, "headcount", value)} />
                          <InputField label={t.labels.organizationAverageSalary} type="text" value={item.averageSalary} onChange={(value) => updateArrayItem("background", "organizationStructures", index, "averageSalary", value)} />
                        </div>
                        <button className="ghost-button ghost-button--danger" type="button" onClick={() => removeArrayItem("background", "organizationStructures", index, { department: "", position: "", headcount: "", averageSalary: "" })}>
                          删除
                        </button>
                      </div>
                    ))}
                    <button className="ghost-button" type="button" onClick={() => addArrayItem("background", "organizationStructures", { department: "", position: "", headcount: "", averageSalary: "" })}>
                      {t.repeater.addOrg}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <h4>客户需求信息</h4>
                  <div className="form-grid form-grid--triple">
                    <InputField label={t.labels.requestDate} type="date" value={draftForms.background.requestDate} onChange={(value) => updateSectionValue("background", "requestDate", value)} />
                    <InputField label={t.labels.counterpart} type="text" value={draftForms.background.counterpart} onChange={(value) => updateSectionValue("background", "counterpart", value)} />
                    <InputField label={t.labels.requestedVehicleType} type="text" value={draftForms.background.requestedVehicleType} onChange={(value) => updateSectionValue("background", "requestedVehicleType", value)} />
                    <InputField
                      label={t.labels.energyType}
                      type="select"
                      value={draftForms.background.energyType}
                      onChange={(value) => updateSectionValue("background", "energyType", value)}
                      options={[
                        { value: "electric", label: t.energyType.electric },
                        { value: "diesel", label: t.energyType.diesel },
                      ]}
                    />
                    <InputField label={t.labels.expectedDeliveryDate} type="date" value={draftForms.background.expectedDeliveryDate} onChange={(value) => updateSectionValue("background", "expectedDeliveryDate", value)} />
                    <InputField label={t.labels.desiredConfig} type="text" value={draftForms.background.desiredConfig} onChange={(value) => updateSectionValue("background", "desiredConfig", value)} />
                  </div>
                  <div className="form-grid">
                    <InputField label={t.labels.concernsAndPainPoints} type="textarea" value={draftForms.background.concernsAndPainPoints} onChange={(value) => updateSectionValue("background", "concernsAndPainPoints", value)} />
                    <InputField label={t.labels.specialRequirements} type="textarea" value={draftForms.background.specialRequirements} onChange={(value) => updateSectionValue("background", "specialRequirements", value)} />
                  </div>
                </div>
              </SectionCard>
            ) : null}

            {activeSection === "revenue" ? (
              <SectionCard
                title={t.sectionTitles.revenue}
                intro={t.revenueIntro}
                footer={
                  <div className="section-card__actions">
                    <button className="primary-button" type="button" onClick={() => persistForms({ ...savedForms, revenue: draftForms.revenue })}>
                      {t.save}
                    </button>
                    <button className="ghost-button" type="button" onClick={() => clearSection("revenue")}>
                      {t.clear}
                    </button>
                    {savedMessage ? <span className="saved-message">{savedMessage}</span> : null}
                  </div>
                }
              >
                <div className="formula-grid">{revenueCards.map((card) => <FormulaCard key={card.title} {...card} />)}</div>

                <div className="form-group">
                  <h4>{t.groups.revenuePricing}</h4>
                  <div className="form-grid form-grid--triple">
                    <InputField label={t.labels.transportPrice} value={draftForms.revenue.transportPrice} onChange={(value) => updateSectionValue("revenue", "transportPrice", value)} suffix="元/吨" />
                    <InputField label={t.labels.expectedTransportVolume} value={draftForms.revenue.expectedTransportVolume} onChange={(value) => updateSectionValue("revenue", "expectedTransportVolume", value)} suffix="ton" />
                    <InputField label={t.labels.expectedTransportDays} value={draftForms.revenue.expectedTransportDays} onChange={(value) => updateSectionValue("revenue", "expectedTransportDays", value)} suffix="day" />
                  </div>
                </div>

                <div className="form-group">
                  <h4>{t.groups.revenueOperatingDays}</h4>
                  <div className="form-grid">
                    <InputField label={t.labels.annualDowntimeDays} value={draftForms.revenue.annualDowntimeDays} onChange={(value) => updateSectionValue("revenue", "annualDowntimeDays", value)} suffix="day" />
                  </div>
                </div>

                <div className="form-group">
                  <h4>{t.groups.revenuePayload}</h4>
                  <div className="form-grid form-grid--triple">
                    <InputField
                      label={t.labels.loadVolumeMode}
                      type="select"
                      value={draftForms.revenue.loadVolumeMode}
                      onChange={(value) => updateSectionValue("revenue", "loadVolumeMode", value)}
                      options={[
                        { value: "dimensions", label: t.loadMode.dimensions },
                        { value: "direct", label: t.loadMode.direct },
                      ]}
                    />
                    <InputField label={t.labels.materialDensity} value={draftForms.revenue.materialDensity} onChange={(value) => updateSectionValue("revenue", "materialDensity", value)} suffix="t/m³" />
                  </div>
                  {draftForms.revenue.loadVolumeMode === "dimensions" ? (
                    <div className="form-grid form-grid--triple">
                      <InputField label={t.labels.cargoBoxLength} value={draftForms.revenue.cargoBoxLength} onChange={(value) => updateSectionValue("revenue", "cargoBoxLength", value)} suffix="m" />
                      <InputField label={t.labels.cargoBoxWidth} value={draftForms.revenue.cargoBoxWidth} onChange={(value) => updateSectionValue("revenue", "cargoBoxWidth", value)} suffix="m" />
                      <InputField label={t.labels.cargoBoxHeight} value={draftForms.revenue.cargoBoxHeight} onChange={(value) => updateSectionValue("revenue", "cargoBoxHeight", value)} suffix="m" />
                    </div>
                  ) : (
                    <div className="form-grid">
                      <InputField label={t.labels.directLoadVolume} value={draftForms.revenue.directLoadVolume} onChange={(value) => updateSectionValue("revenue", "directLoadVolume", value)} suffix="m³" />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <h4>{t.groups.revenueTrips}</h4>
                  <div className="form-grid form-grid--triple">
                    <InputField label={t.labels.roundTripHours} value={draftForms.revenue.roundTripHours} onChange={(value) => updateSectionValue("revenue", "roundTripHours", value)} suffix="h" />
                    <InputField label={t.labels.morningMeeting} value={draftForms.revenue.morningMeeting} onChange={(value) => updateSectionValue("revenue", "morningMeeting", value)} suffix="h" />
                    <InputField label={t.labels.mealTime} value={draftForms.revenue.mealTime} onChange={(value) => updateSectionValue("revenue", "mealTime", value)} suffix="h" />
                    <InputField label={t.labels.restTime} value={draftForms.revenue.restTime} onChange={(value) => updateSectionValue("revenue", "restTime", value)} suffix="h" />
                    <InputField label={t.labels.shiftChangeTime} value={draftForms.revenue.shiftChangeTime} onChange={(value) => updateSectionValue("revenue", "shiftChangeTime", value)} suffix="h" />
                    <InputField label={t.labels.otherOperationIdle} value={draftForms.revenue.otherOperationIdle} onChange={(value) => updateSectionValue("revenue", "otherOperationIdle", value)} suffix="h" />
                    <InputField label={t.labels.loadingQueue} value={draftForms.revenue.loadingQueue} onChange={(value) => updateSectionValue("revenue", "loadingQueue", value)} suffix="h" />
                    <InputField label={t.labels.unloadingQueue} value={draftForms.revenue.unloadingQueue} onChange={(value) => updateSectionValue("revenue", "unloadingQueue", value)} suffix="h" />
                    <InputField label={t.labels.yardQueue} value={draftForms.revenue.yardQueue} onChange={(value) => updateSectionValue("revenue", "yardQueue", value)} suffix="h" />
                    <InputField label={t.labels.traffic} value={draftForms.revenue.traffic} onChange={(value) => updateSectionValue("revenue", "traffic", value)} suffix="h" />
                    <InputField label={t.labels.fuelingOrCharging} value={draftForms.revenue.fuelingOrCharging} onChange={(value) => updateSectionValue("revenue", "fuelingOrCharging", value)} suffix="h" />
                    <InputField label={t.labels.otherTransitIdle} value={draftForms.revenue.otherTransitIdle} onChange={(value) => updateSectionValue("revenue", "otherTransitIdle", value)} suffix="h" />
                  </div>
                </div>

                <div className="form-group">
                  <h4>{t.groups.revenueAttendance}</h4>
                  <YearlyFieldGroup label={t.labels.maintenanceHours} values={draftForms.revenue.maintenanceHours} onChange={(yearKey, value) => updateYearlyValue("revenue", "maintenanceHours", yearKey, value)} />
                  <YearlyFieldGroup label={t.labels.partsWaitHours} values={draftForms.revenue.partsWaitHours} onChange={(yearKey, value) => updateYearlyValue("revenue", "partsWaitHours", yearKey, value)} />
                  <YearlyFieldGroup label={t.labels.annualMaintenanceCounts} values={draftForms.revenue.annualMaintenanceCounts} onChange={(yearKey, value) => updateYearlyValue("revenue", "annualMaintenanceCounts", yearKey, value)} />
                </div>

                <div className="form-group">
                  <h4>{t.groups.revenueVehicles}</h4>
                  <div className="section-note">{t.notes.roundUp}</div>
                </div>
              </SectionCard>
            ) : null}

            {activeSection === "expenses" ? (
              <SectionCard
                title={t.sectionTitles.expenses}
                intro={t.expensesIntro}
                footer={
                  <div className="section-card__actions">
                    <button className="primary-button" type="button" onClick={() => persistForms({ ...savedForms, expenses: draftForms.expenses })}>
                      {t.save}
                    </button>
                    <button className="ghost-button" type="button" onClick={() => clearSection("expenses")}>
                      {t.clear}
                    </button>
                    {savedMessage ? <span className="saved-message">{savedMessage}</span> : null}
                  </div>
                }
              >
                <div className="formula-grid">{expenseCards.map((card) => <FormulaCard key={card.title} {...card} />)}</div>

                <div className="form-group">
                  <h4>{t.groups.expenseDepreciation}</h4>
                  <div className="form-grid">
                    <InputField label={t.labels.purchasePrice} value={draftForms.expenses.purchasePrice} onChange={(value) => updateSectionValue("expenses", "purchasePrice", value)} suffix="RMB" />
                    <InputField label={t.labels.depreciationYears} value={draftForms.expenses.depreciationYears} onChange={(value) => updateSectionValue("expenses", "depreciationYears", value)} suffix="year" />
                  </div>
                </div>

                <div className="form-group">
                  <h4>{t.groups.expenseLabor}</h4>
                  <div className="form-grid">
                    <InputField label={t.labels.driverCount} value={draftForms.expenses.driverCount} onChange={(value) => updateSectionValue("expenses", "driverCount", value)} />
                    <InputField label={t.labels.driverSalary} value={draftForms.expenses.driverSalary} onChange={(value) => updateSectionValue("expenses", "driverSalary", value)} suffix="RMB" />
                  </div>
                </div>

                <div className="form-group">
                  <h4>{t.groups.expenseEnergy}</h4>
                  <div className="form-grid form-grid--triple">
                    <InputField label={t.labels.tonKmEnergy} value={draftForms.expenses.tonKmEnergy} onChange={(value) => updateSectionValue("expenses", "tonKmEnergy", value)} />
                    <InputField label={t.labels.energyPrice} value={draftForms.expenses.energyPrice} onChange={(value) => updateSectionValue("expenses", "energyPrice", value)} suffix="RMB" />
                    <InputField label={t.labels.transportDistance} value={draftForms.expenses.transportDistance} onChange={(value) => updateSectionValue("expenses", "transportDistance", value)} suffix="km" />
                  </div>
                </div>

                <div className="form-group">
                  <h4>{t.groups.expenseParts}</h4>
                  <PartsEditor copy={t.partRow} items={draftForms.expenses.partsItems} onChange={updatePartItem} onAdd={addPartItem} onRemove={removePartItem} />
                </div>

                <div className="form-group">
                  <h4>{t.groups.expenseRepair}</h4>
                  <div className="section-note">第 1 年质保期内维修成本按 0 计算</div>
                  <div className="form-grid">
                    <InputField label={t.labels.repairHoursPerVisit} value={draftForms.expenses.repairHoursPerVisit} onChange={(value) => updateSectionValue("expenses", "repairHoursPerVisit", value)} suffix="h" />
                    <InputField label={t.labels.repairUnitPrice} value={draftForms.expenses.repairUnitPrice} onChange={(value) => updateSectionValue("expenses", "repairUnitPrice", value)} suffix="RMB" />
                  </div>
                  <YearlyFieldGroup label={t.labels.repairFrequency} values={draftForms.expenses.repairFrequency} onChange={(yearKey, value) => updateYearlyValue("expenses", "repairFrequency", yearKey, value)} />
                </div>

                <div className="form-group">
                  <h4>{t.groups.expenseTires}</h4>
                  <div className="form-grid">
                    <InputField label={t.labels.tireUnitPrice} value={draftForms.expenses.tireUnitPrice} onChange={(value) => updateSectionValue("expenses", "tireUnitPrice", value)} suffix="RMB" />
                  </div>
                  <YearlyFieldGroup label={t.labels.tireReplacementFrequency} values={draftForms.expenses.tireReplacementFrequency} onChange={(yearKey, value) => updateYearlyValue("expenses", "tireReplacementFrequency", yearKey, value)} />
                </div>

                <div className="form-group">
                  <h4>{t.groups.expenseOperations}</h4>
                  <div className="form-grid form-grid--triple">
                    <InputField label={t.labels.managementCount} value={draftForms.expenses.managementCount} onChange={(value) => updateSectionValue("expenses", "managementCount", value)} />
                    <InputField label={t.labels.managementSalary} value={draftForms.expenses.managementSalary} onChange={(value) => updateSectionValue("expenses", "managementSalary", value)} suffix="RMB" />
                    <InputField label={t.labels.facilityRent} value={draftForms.expenses.facilityRent} onChange={(value) => updateSectionValue("expenses", "facilityRent", value)} suffix="RMB" />
                    <InputField label={t.labels.officeSpend} value={draftForms.expenses.officeSpend} onChange={(value) => updateSectionValue("expenses", "officeSpend", value)} suffix="RMB" />
                  </div>
                </div>
              </SectionCard>
            ) : null}

            {activeSection === "assets" ? (
              <SectionCard
                title={t.sectionTitles.assets}
                intro={t.assetsIntro}
                footer={
                  <div className="section-card__actions">
                    <button className="primary-button" type="button" onClick={() => persistForms({ ...savedForms, assets: draftForms.assets })}>
                      {t.save}
                    </button>
                    <button className="ghost-button" type="button" onClick={() => clearSection("assets")}>
                      {t.clear}
                    </button>
                    {savedMessage ? <span className="saved-message">{savedMessage}</span> : null}
                  </div>
                }
              >
                <div className="formula-grid formula-grid--compact">{assetCards.map((card) => <FormulaCard key={card.title} {...card} />)}</div>

                <div className="form-group">
                  <h4>{t.groups.assetInfra}</h4>
                  <div className="form-grid">
                    <InputField label={t.labels.infrastructureValue} value={draftForms.assets.infrastructureValue} onChange={(value) => updateSectionValue("assets", "infrastructureValue", value)} suffix="RMB" />
                  </div>
                  <p className="section-note">{t.notes.fixedInfra}</p>
                </div>

                <div className="form-group">
                  <h4>{t.groups.assetParts}</h4>
                  <div className="form-grid">
                    <InputField label={t.labels.partsSafetyRate} value={draftForms.assets.partsSafetyRate} onChange={(value) => updateSectionValue("assets", "partsSafetyRate", value)} suffix="ratio" />
                  </div>
                </div>

                <div className="form-group">
                  <h4>{t.groups.assetTires}</h4>
                  <div className="form-grid">
                    <InputField label={t.labels.tireSafetyRate} value={draftForms.assets.tireSafetyRate} onChange={(value) => updateSectionValue("assets", "tireSafetyRate", value)} suffix="ratio" />
                  </div>
                </div>
              </SectionCard>
            ) : null}

            {activeSection === "roa" ? (
              <SectionCard title={t.sectionTitles.roa} intro={t.roaIntro}>
                <div className="metrics-grid">
                  <MetricCard label={t.metrics.annualRevenue} value={localizedMoney(model.lifecycle.annualRevenue)} />
                  <MetricCard label={t.metrics.totalExpense} value={localizedMoney(model.lifecycle.totalExpense)} />
                  <MetricCard label={t.metrics.totalAssets} value={localizedMoney(model.lifecycle.totalAssets)} />
                  <MetricCard label={t.metrics.vehicleCount} value={String(model.assumptions.vehicleCount)} />
                  <MetricCard label={t.metrics.attendanceRate} value={formatPercent(model.lifecycle.averageAttendanceRate)} />
                  <MetricCard label={t.metrics.lifecycleRoa} value={formatPercent(model.lifecycle.roa)} accent />
                </div>

                {warningMessages.length ? (
                  <div className="warning-card">
                    <h4>{t.warnings.title}</h4>
                    <ul className="clean-list">
                      {[...new Set(warningMessages)].map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="section-note">
                  {t.notes.moneyUnit}: {reportCurrency}
                </div>

                <ChartSwitcher copy={t.views} selectedView={activeView} onChange={setActiveView} />

                {activeView === "table" ? (
                  <div className="table-stack">
                    <div className="table-block">
                      <h4>{t.table.lifecycleParams}</h4>
                      <SimpleTable columns={[{ key: "parameter", label: t.table.parameter }, { key: "value", label: t.table.value }]} rows={lifecycleParamRows} />
                    </div>
                    <div className="table-block">
                      <h4>{t.table.revenueModel}</h4>
                      <SimpleTable
                        columns={[
                          { key: "year", label: t.table.year },
                          { key: "transportPrice", label: `${t.labels.transportPrice} (${reportCurrency}/吨)` },
                          { key: "operatingDays", label: t.metrics.operatingDays },
                          { key: "payload", label: t.metrics.payload },
                          { key: "dailyTrips", label: t.metrics.dailyTrips },
                          { key: "attendanceRate", label: t.metrics.attendanceRate },
                          { key: "vehicleCount", label: t.metrics.vehicleCount },
                          { key: "revenue", label: `${t.table.revenue} (${reportCurrency})` },
                        ]}
                        rows={revenueTableRows}
                      />
                    </div>
                    <div className="table-block">
                      <h4>{t.table.costModel}</h4>
                      <SimpleTable
                        columns={[
                          { key: "year", label: t.table.year },
                          { key: "depreciationCost", label: `${t.formulaCards.depreciationCost} (${reportCurrency})` },
                          { key: "laborCost", label: `${t.formulaCards.laborCost} (${reportCurrency})` },
                          { key: "energyCost", label: `${t.formulaCards.energyCost} (${reportCurrency})` },
                          { key: "partsCost", label: `${t.formulaCards.partsCost} (${reportCurrency})` },
                          { key: "repairCost", label: `${t.formulaCards.repairCost} (${reportCurrency})` },
                          { key: "tireCost", label: `${t.formulaCards.tireCost} (${reportCurrency})` },
                          { key: "operationCost", label: `${t.formulaCards.operationCost} (${reportCurrency})` },
                          { key: "totalExpense", label: `${t.table.expense} (${reportCurrency})` },
                        ]}
                        rows={costTableRows}
                      />
                    </div>
                    <div className="table-block">
                      <h4>{t.table.assetModel}</h4>
                      <SimpleTable
                        columns={[
                          { key: "year", label: t.table.year },
                          { key: "infrastructure", label: `${t.table.infrastructure} (${reportCurrency})` },
                          { key: "partsAsset", label: `${t.table.partsAsset} (${reportCurrency})` },
                          { key: "tireAsset", label: `${t.table.tireAsset} (${reportCurrency})` },
                          { key: "assets", label: `${t.table.assets} (${reportCurrency})` },
                        ]}
                        rows={assetTableRows}
                      />
                    </div>
                    <div className="table-block">
                      <h4>{t.table.roaModel}</h4>
                      <SimpleTable
                        columns={[
                          { key: "year", label: t.table.year },
                          { key: "revenue", label: `${t.table.revenue} (${reportCurrency})` },
                          { key: "expense", label: `${t.table.expense} (${reportCurrency})` },
                          { key: "assets", label: `${t.table.assets} (${reportCurrency})` },
                          { key: "roa", label: t.table.roa },
                          { key: "lifecycleRoa", label: t.metrics.lifecycleRoa },
                        ]}
                        rows={annualTableRows.map((row) => ({
                          ...row,
                          lifecycleRoa: formatPercent(model.lifecycle.roa),
                        }))}
                        summaryRow={{
                          year: t.table.lifecycle,
                          revenue: localizedMoneyPlain(model.lifecycle.annualRevenue),
                          expense: localizedMoneyPlain(model.lifecycle.totalExpense),
                          assets: localizedMoneyPlain(model.lifecycle.totalAssets),
                          roa: formatPercent(model.lifecycle.roa),
                          lifecycleRoa: formatPercent(model.lifecycle.roa),
                        }}
                      />
                    </div>
                  </div>
                ) : null}

                {activeView === "bar" ? <BarChart points={chartPoints} /> : null}
                {activeView === "line" ? <LineChart points={chartPoints} /> : null}
              </SectionCard>
            ) : null}

            {activeSection === "download" ? (
              <SectionCard
                title={t.sectionTitles.download}
                intro={t.downloadIntro}
                footer={
                  <div className="section-card__actions">
                    <button className="primary-button" type="button" onClick={handleExportExcel}>
                      {t.exportExcel}
                    </button>
                    <span className="saved-message">{t.exportHint}</span>
                  </div>
                }
              >
                <div className="print-report">
                  <div className="print-block">
                    <h4>{t.sectionTitles.background}</h4>
                    <p>{t.downloadIntro}</p>
                  </div>
                  <div className="print-block">
                    <h4>{t.table.revenueModel}</h4>
                    <p>{t.notes.moneyUnit}: {reportCurrency}</p>
                  </div>
                </div>
              </SectionCard>
            ) : null}
          </div>
        </section>

        <section className="about surface-card" id="about">
          <span className="eyebrow">{t.aboutTitle}</span>
          <h3>周雨嘉-Ada</h3>
          <p>{t.email}: <a href="mailto:yishangtanhuan666@gmail.com">yishangtanhuan666@gmail.com</a></p>
          <p>{t.wechat}: shanyekuangsheng</p>
        </section>
      </main>
    </div>
  );
}

export default App;
