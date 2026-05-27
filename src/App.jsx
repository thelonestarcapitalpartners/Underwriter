import { useState, useRef, useEffect } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#0f0e0c;--paper:#f5f2ec;--cream:#ede9e0;--gold:#c9a84c;--gold-bg:rgba(201,168,76,0.12);
  --green:#2d6a4f;--green-bg:#d8f3dc;--red:#c1121f;--red-bg:#ffe5e5;
  --amber:#e07a00;--amber-bg:#fff3cd;--border:#d5cfc4;--muted:#7a7468;
  --card:#fff;--sh:0 2px 12px rgba(15,14,12,0.08);--sh-lg:0 8px 32px rgba(15,14,12,0.12);
}
body{font-family:'DM Sans',sans-serif;background:var(--paper);color:var(--ink);}
.app{min-height:100vh;display:flex;flex-direction:column;}

.hdr{background:var(--ink);color:var(--paper);padding:16px 28px;display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid var(--gold);}
.hdr-logo{font-family:'DM Serif Display',serif;font-size:21px;}
.hdr-logo span{color:var(--gold);}

.main{display:flex;flex:1;min-height:0;}
.content{flex:1;padding:24px 28px;overflow-y:auto;min-width:0;}

.search-wrap{margin-bottom:24px;}
.search-title{font-family:'DM Serif Display',serif;font-size:26px;margin-bottom:4px;}
.search-title span{color:var(--gold);font-style:italic;}
.search-sub{color:var(--muted);font-size:12px;margin-bottom:14px;}
.search-row{display:flex;gap:9px;margin-bottom:12px;}
.addr-inp{flex:1;padding:12px 15px;border:2px solid var(--border);border-radius:8px;font-size:14px;font-family:'DM Sans',sans-serif;background:var(--card);outline:none;transition:border-color .18s;color:var(--ink);}
.addr-inp:focus{border-color:var(--gold);}
.go-btn{padding:12px 22px;background:var(--ink);color:var(--gold);border:2px solid var(--ink);border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .18s;white-space:nowrap;}
.go-btn:hover:not(:disabled){background:var(--gold);color:var(--ink);}
.go-btn:disabled{opacity:.45;cursor:not-allowed;}

.upload-row{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:6px;}
.up-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border:1.5px dashed var(--border);border-radius:6px;background:var(--cream);font-size:11px;font-family:'DM Sans',sans-serif;color:var(--muted);cursor:pointer;transition:all .18s;}
.up-btn:hover{border-color:var(--gold);color:var(--gold);}
.up-btn input{display:none;}
.fchip{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;background:var(--green-bg);border:1px solid #74c69d;border-radius:20px;font-size:10px;color:var(--green);font-family:'DM Mono',monospace;}
.fchip-x{cursor:pointer;font-weight:700;opacity:.6;}
.fchip-x:hover{opacity:1;}

.loading-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:40px 36px;text-align:center;box-shadow:var(--sh);}
.spin{width:34px;height:34px;border:3px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 12px;}
@keyframes spin{to{transform:rotate(360deg);}}
.load-title{font-family:'DM Serif Display',serif;font-size:17px;margin-bottom:4px;}
.load-sub{font-size:12px;color:var(--muted);}

.err-card{background:var(--red-bg);border:1px solid #f5a0a5;border-radius:10px;padding:14px;margin-bottom:14px;}
.err-title{font-weight:600;color:var(--red);margin-bottom:3px;}
.err-body{font-size:11px;line-height:1.6;color:var(--ink);}

.empty{text-align:center;padding:60px 20px;color:var(--muted);}
.empty-icon{font-size:46px;margin-bottom:12px;}
.empty-title{font-family:'DM Serif Display',serif;font-size:21px;color:var(--ink);margin-bottom:6px;}

.ph{background:var(--ink);color:var(--paper);border-radius:12px;padding:20px 24px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:flex-start;gap:14px;}
.ph-addr{font-family:'DM Serif Display',serif;font-size:19px;margin-bottom:8px;}
.badges{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;}
.bdg{display:inline-flex;align-items:center;padding:3px 10px;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.4);border-radius:20px;font-size:9px;font-family:'DM Mono',monospace;color:var(--gold);letter-spacing:.05em;}
.bdg.g{background:rgba(45,106,79,.25);border-color:rgba(45,106,79,.6);color:#74c69d;}
.ph-desc{font-size:11px;color:#999;line-height:1.5;max-width:500px;}
.ph-price{font-family:'DM Serif Display',serif;font-size:26px;color:var(--gold);text-align:right;white-space:nowrap;}
.ph-sub{font-size:10px;color:#666;text-align:right;font-family:'DM Mono',monospace;margin-top:2px;}

.conflict-banner{display:flex;align-items:flex-start;gap:9px;padding:10px 14px;background:var(--amber-bg);border:1px solid #ffd080;border-radius:8px;margin-bottom:11px;font-size:11px;line-height:1.6;}
.src-banner{display:flex;align-items:flex-start;gap:9px;padding:10px 14px;background:var(--green-bg);border:1px solid #74c69d;border-radius:8px;margin-bottom:11px;font-size:11px;line-height:1.6;}
.doc-banner{display:flex;align-items:flex-start;gap:9px;padding:10px 14px;background:var(--green-bg);border:1px solid #74c69d;border-radius:8px;margin-bottom:11px;font-size:11px;line-height:1.6;}

.sec{background:var(--card);border:1px solid var(--border);border-radius:12px;margin-bottom:13px;overflow:hidden;box-shadow:var(--sh);}
.sec-hdr{display:flex;justify-content:space-between;align-items:center;padding:14px 19px;cursor:pointer;user-select:none;transition:background .13s;}
.sec-hdr:hover{background:var(--cream);}
.sec-ttl{font-family:'DM Serif Display',serif;font-size:14px;display:flex;align-items:center;gap:8px;}
.chev{color:var(--muted);transition:transform .2s;font-size:16px;display:inline-block;}
.chev.open{transform:rotate(180deg);}
.sec-body{padding:16px 19px;border-top:1px solid var(--border);}

.sec-fixed{background:var(--card);border:1px solid var(--border);border-radius:12px;margin-bottom:13px;overflow:hidden;box-shadow:var(--sh);}
.sec-fixed-hdr{padding:14px 19px;border-bottom:1px solid var(--border);}
.sec-fixed-ttl{font-family:'DM Serif Display',serif;font-size:14px;font-weight:600;}
.sec-fixed-body{padding:16px 19px;}

.strategy-btns{display:flex;gap:8px;margin-bottom:14px;}
.strat-btn{flex:1;padding:10px 14px;border:1.5px solid var(--border);border-radius:7px;background:var(--cream);color:var(--ink);font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .18s;text-align:center;}
.strat-btn:hover{border-color:var(--gold);background:#ece8de;}
.strat-btn.active{border-color:var(--gold);background:var(--gold-bg);font-weight:600;}

.feat{background:#161512;border:1px solid #252525;border-radius:8px;padding:12px;margin-bottom:12px;}
.feat-lbl{font-size:9px;font-family:'DM Mono',monospace;color:var(--gold);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;font-weight:600;}
.feat-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #222;}
.feat-row:last-child{border-bottom:none;}
.feat-n{font-size:10px;color:#777;}
.feat-v{font-family:'DM Mono',monospace;font-size:13px;font-weight:500;color:var(--gold);}

.mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:9px;margin-bottom:16px;}
.mc{background:var(--cream);border:1px solid var(--border);border-radius:8px;padding:12px 13px;}
.mc.hl{background:var(--ink);border-color:var(--gold);}
.mn{font-size:9px;font-family:'DM Mono',monospace;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;}
.mc.hl .mn{color:#666;}
.mv{font-family:'DM Mono',monospace;font-size:16px;font-weight:500;color:var(--ink);}
.mc.hl .mv{color:var(--gold);}
.gv{color:var(--green)!important;}
.rv{color:var(--red)!important;}

.tbl{width:100%;border-collapse:collapse;font-size:12px;}
.tbl th{font-family:'DM Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);padding:7px 10px;text-align:left;border-bottom:2px solid var(--border);}
.tbl td{padding:8px 10px;border-bottom:1px solid var(--cream);}
.cat td{background:var(--cream);font-weight:500;font-size:9px;color:var(--muted);font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.06em;}
.tot td{font-weight:600;border-top:2px solid var(--border)!important;background:var(--cream);}
.rc{text-align:right;font-family:'DM Mono',monospace;}

.ag{margin-bottom:11px;}
.al{font-size:9px;font-family:'DM Mono',monospace;color:#666;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;display:block;font-weight:500;}
.ai{width:100%;background:#f9f7f2;border:1.5px solid var(--border);color:var(--ink);padding:8px 12px;border-radius:6px;font-family:'DM Mono',monospace;font-size:12px;outline:none;transition:border-color .18s;}
.ai:focus{border-color:var(--gold);background:var(--card);}
.ai::placeholder{color:#999;}

.ri{display:flex;gap:6px;}
.ri .ag{flex:1;margin-bottom:0;}

.trow{display:flex;justify-content:space-between;align-items:center;padding:6px 0;}
.tlbl{font-size:10px;color:#888;font-weight:500;}
.tog{position:relative;width:34px;height:18px;background:#d5cfc4;border-radius:9px;cursor:pointer;transition:background .18s;border:none;flex-shrink:0;}
.tog:hover{background:#cac4b8;}
.tog.on{background:var(--green);}
.tog::after{content:'';position:absolute;width:12px;height:12px;background:#fff;border-radius:50%;top:3px;left:3px;transition:left .18s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
.tog.on::after{left:19px;}

.risk-hdr{display:flex;align-items:center;gap:14px;margin-bottom:16px;}
.rcirc{width:70px;height:70px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;border:3px solid;font-family:'DM Mono',monospace;flex-shrink:0;}
.rn{font-size:22px;font-weight:700;}
.rl{font-size:8px;text-transform:uppercase;letter-spacing:.1em;margin-top:2px;}
.rht h3{font-family:'DM Serif Display',serif;font-size:15px;margin-bottom:3px;}
.rht p{font-size:11px;color:var(--muted);}

.flags{display:flex;flex-direction:column;gap:8px;}
.flag{display:flex;align-items:flex-start;gap:9px;padding:11px 13px;border-radius:8px;font-size:11px;line-height:1.5;}
.flag.high{background:var(--red-bg);border:1px solid #f5a0a5;}
.flag.medium{background:var(--amber-bg);border:1px solid #ffd080;}
.flag.low{background:var(--green-bg);border:1px solid #74c69d;}
.flag-icon{font-size:14px;flex-shrink:0;margin-top:1px;}
.flag-content{flex:1;}
.ft{font-weight:600;margin-bottom:2px;}
.fb{font-family:'DM Mono',monospace;font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;padding:2px 6px;border-radius:3px;white-space:nowrap;display:inline-block;margin-left:4px;}
.flag.high .fb{background:var(--red);color:#fff;}
.flag.medium .fb{background:var(--amber);color:#fff;}
.flag.low .fb{background:var(--green);color:#fff;}

.sgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:8px;}
.scard{background:var(--cream);border:1px solid var(--border);border-radius:8px;padding:12px 13px;}
.si{font-size:16px;margin-bottom:6px;}
.sname{font-weight:600;font-size:11px;margin-bottom:2px;}
.sfound{font-size:9px;font-family:'DM Mono',monospace;color:var(--green);}
.sfound.no{color:var(--muted);}
.snote{font-size:9px;color:var(--muted);margin-top:3px;line-height:1.4;}

.hh-hint{font-size:10px;color:#555;font-family:'DM Mono',monospace;margin-bottom:10px;padding:8px 10px;background:var(--cream);border-radius:6px;border:1px solid var(--border);line-height:1.6;}

.reset-btn{padding:7px 14px;background:transparent;border:1px solid var(--border);color:#888;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:11px;cursor:pointer;transition:all .18s;}
.reset-btn:hover{border-color:var(--red);color:var(--red);}

.ngrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;}
.nc{background:var(--cream);border:1px solid var(--border);border-radius:8px;padding:12px;}
.nt{font-size:9px;font-family:'DM Mono',monospace;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px;}
`;

// ============ Helper Functions ============

// Mock data fetching - in production, integrate with real APIs
const mockFetchPropertyData = async (address) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        address,
        propertyType: "multifamily",
        units: 4,
        askingPrice: 450000,
        estimatedMonthlyRent: 4200,
        propertyTaxes: 380,
        bedroomBath: "12 bed / 4 bath",
        yearBuilt: 1985,
        lotSize: 0.28,
        squareFeet: 3850,
        sources: {
          zillow: true,
          redfin: true,
          taxRecords: true,
          mls: false,
        },
        neighborhood: {
          walkScore: 72,
          crimeRate: "low",
          schoolRating: 8,
        },
      });
    }, 1500);
  });
};

// ============ Utility Functions ============

const formatCurrency = (num) => {
  if (!num && num !== 0) return "$0";
  return "$" + Math.round(num).toLocaleString();
};

const formatPercent = (num) => {
  if (!num && num !== 0) return "0%";
  return (num * 100).toFixed(1) + "%";
};

const formatNumber = (num) => {
  if (!num && num !== 0) return "0";
  return Math.round(num).toLocaleString();
};

// ============ Main App Component ============

export default function App() {
  // ---- State ----
  const [address, setAddress] = useState("");
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  
  // Documents & conflicts
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [docData, setDocData] = useState(null);
  const [dataConflicts, setDataConflicts] = useState([]);
  
  // Investment strategy
  const [investmentStrategy, setInvestmentStrategy] = useState("investor"); // "investor" or "houseHack"
  
  // Financial assumptions (editable)
  const [assumptions, setAssumptions] = useState({
    purchasePrice: 450000,
    downPaymentPercent: 25,
    loanInterestRate: 6.5,
    loanTermYears: 30,
    closingCosts: 12000,
    propertyTaxesMonthly: 380,
    insuranceMonthly: 140,
    maintenanceMonthlyPercent: 0.01,
    propertyManagementPercent: 0.08,
    vacancyRatePercent: 0.05,
    monthlyRent: 4200,
    rentableUnits: 4,
    expectedAnnualAppreciation: 0.03,
    capExAnnual: 5000,
  });
  
  // Section collapse states
  const [sectionOpen, setSectionOpen] = useState({
    underwriting: false,
    market: false,
    riskFlags: false,
    sources: false,
  });

  // ---- Effects ----
  useEffect(() => {
    if (property) {
      // Update assumptions based on property data
      setAssumptions((prev) => ({
        ...prev,
        purchasePrice: property.askingPrice || prev.purchasePrice,
        propertyTaxesMonthly: property.propertyTaxes || prev.propertyTaxesMonthly,
        monthlyRent: property.estimatedMonthlyRent || prev.monthlyRent,
        rentableUnits: property.units || prev.rentableUnits,
      }));
    }
  }, [property]);

  // Detect data conflicts when property loaded
  useEffect(() => {
    if (property && docData) {
      const conflicts = [];
      if (
        docData.purchasePrice &&
        docData.purchasePrice !== property.askingPrice
      ) {
        conflicts.push({
          field: "Purchase Price",
          docValue: docData.purchasePrice,
          publicValue: property.askingPrice,
        });
      }
      if (docData.monthlyRent && docData.monthlyRent !== property.estimatedMonthlyRent) {
        conflicts.push({
          field: "Monthly Rent",
          docValue: docData.monthlyRent,
          publicValue: property.estimatedMonthlyRent,
        });
      }
      setDataConflicts(conflicts);
    }
  }, [property, docData]);

  // ---- Handlers ----
  const handleSearchAddress = async () => {
    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await mockFetchPropertyData(address);
      setProperty(data);
    } catch (err) {
      setError("Failed to fetch property data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocs = (e) => {
    const files = Array.from(e.target.files);
    setUploadedDocs((prev) => [...prev, ...files.map((f) => f.name)]);
    // Mock parsing doc data
    setDocData({
      purchasePrice: 445000,
      monthlyRent: 4300,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeDoc = (docName) => {
    setUploadedDocs((prev) => prev.filter((d) => d !== docName));
    if (uploadedDocs.length === 1) {
      setDocData(null);
      setDataConflicts([]);
    }
  };

  const handleStrategyChange = (strategy) => {
    setInvestmentStrategy(strategy);
    // Reset assumptions based on strategy
    if (strategy === "houseHack") {
      // For house hack, adjust down payment and rent
      setAssumptions((prev) => ({
        ...prev,
        downPaymentPercent: 5,
        rentableUnits: Math.min(prev.rentableUnits - 1, prev.rentableUnits),
      }));
    } else {
      // For investor
      setAssumptions((prev) => ({
        ...prev,
        downPaymentPercent: 25,
      }));
    }
  };

  const handleAssumptionChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    setAssumptions((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const toggleSection = (section) => {
    setSectionOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ---- Calculations ----
  const getFinancialMetrics = () => {
    const {
      purchasePrice,
      downPaymentPercent,
      loanInterestRate,
      loanTermYears,
      closingCosts,
      propertyTaxesMonthly,
      insuranceMonthly,
      maintenanceMonthlyPercent,
      propertyManagementPercent,
      vacancyRatePercent,
      monthlyRent,
      rentableUnits,
      capExAnnual,
    } = assumptions;

    // Purchase calculations
    const downPayment = purchasePrice * (downPaymentPercent / 100);
    const loanAmount = purchasePrice - downPayment;
    const totalOutOfPocket = downPayment + closingCosts;

    // Monthly calculations
    const rentableMonthlyIncome = (monthlyRent / assumptions.rentableUnits) * Math.max(rentableUnits - (investmentStrategy === "houseHack" ? 1 : 0), 0);
    const effectiveMonthlyIncome = rentableMonthlyIncome * (1 - vacancyRatePercent);
    const maintenanceMonthly = purchasePrice * maintenanceMonthlyPercent;
    const managementMonthly =
      investmentStrategy === "houseHack" ? 0 : effectiveMonthlyIncome * propertyManagementPercent;

    const monthlyExpenses =
      propertyTaxesMonthly +
      insuranceMonthly +
      maintenanceMonthly +
      managementMonthly;

    // Loan payment (simple approximation)
    const monthlyRate = loanInterestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;
    const monthlyPayment =
      loanAmount *
      ((monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1));

    const totalMonthlyExpenses = monthlyExpenses + monthlyPayment;
    const monthlyProfit = effectiveMonthlyIncome - totalMonthlyExpenses;
    const annualProfit = monthlyProfit * 12;

    // Financial metrics
    const capRate = (annualProfit / purchasePrice) * 100;
    const cashOnCash = (annualProfit / totalOutOfPocket) * 100;
    const roi = ((annualProfit - capExAnnual) / totalOutOfPocket) * 100;
    const debtToIncomeRatio = (totalMonthlyExpenses / effectiveMonthlyIncome) * 100;

    return {
      purchasePrice,
      downPayment,
      downPaymentPercent,
      loanAmount,
      totalOutOfPocket,
      monthlyPayment,
      monthlyRent: rentableMonthlyIncome,
      effectiveMonthlyIncome,
      monthlyExpenses,
      totalMonthlyExpenses,
      monthlyProfit,
      annualProfit,
      capRate,
      cashOnCash,
      roi,
      debtToIncomeRatio,
    };
  };

  const metrics = property ? getFinancialMetrics() : null;

  // ---- Render ----

  return (
    <div className="app">
      <style>{STYLES}</style>

      {/* Header */}
      <div className="hdr">
        <div>
          <div className="hdr-logo">
            Real Estate <span>Underwriter</span>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="content">
          {/* Search Section */}
          <div className="search-wrap">
            <div className="search-title">
              Find Your <span>Deal</span>
            </div>
            <div className="search-sub">
              Enter a property address to analyze investment potential
            </div>

            <div className="search-row">
              <input
                type="text"
                className="addr-inp"
                placeholder="123 Main St, Austin, TX 78701"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchAddress()}
              />
              <button
                className="go-btn"
                onClick={handleSearchAddress}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>

            {/* Document Upload */}
            <div className="upload-row">
              <label className="up-btn">
                📎 Upload Property Docs
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleUploadDocs}
                  accept=".pdf,.doc,.docx,.xlsx"
                />
              </label>
              {uploadedDocs.map((doc) => (
                <div key={doc} className="fchip">
                  {doc}
                  <span
                    className="fchip-x"
                    onClick={() => removeDoc(doc)}
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="err-card">
              <div className="err-title">⚠ Error</div>
              <div className="err-body">{error}</div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="loading-card">
              <div className="spin"></div>
              <div className="load-title">Analyzing Property</div>
              <div className="load-sub">Fetching data from public sources...</div>
            </div>
          )}

          {/* Empty State */}
          {!property && !loading && (
            <div className="empty">
              <div className="empty-icon">🏠</div>
              <div className="empty-title">No Property Selected</div>
              <div
                className="empty-title"
                style={{ fontSize: "13px", color: "#888", marginTop: "8px" }}
              >
                Enter an address above to get started
              </div>
            </div>
          )}

          {/* Property Results */}
          {property && (
            <>
              {/* Property Header */}
              <div className="ph">
                <div>
                  <div className="ph-addr">{property.address}</div>
                  <div className="badges">
                    <div className="bdg">
                      {property.units} Units {property.propertyType}
                    </div>
                    <div className="bdg g">Auto-detected</div>
                  </div>
                  <div className="ph-desc">{property.bedroomBath}</div>
                </div>
                <div>
                  <div className="ph-price">
                    {formatCurrency(property.askingPrice)}
                  </div>
                  <div className="ph-sub">Asking Price</div>
                </div>
              </div>

              {/* Document Banner */}
              {uploadedDocs.length > 0 && (
                <div className="doc-banner">
                  ✓ {uploadedDocs.length} document(s) uploaded - Using as source of truth
                </div>
              )}

              {/* Data Conflicts */}
              {dataConflicts.length > 0 && uploadedDocs.length > 0 && (
                <div className="conflict-banner">
                  ⚠ <strong>Data Conflict Detected:</strong> Document values differ
                  from public sources. Using document values.{" "}
                  {dataConflicts
                    .map(
                      (c) =>
                        `${c.field}: ${formatCurrency(c.docValue)} vs ${formatCurrency(c.publicValue)}`
                    )
                    .join(", ")}
                </div>
              )}

              {/* Always Visible: Adjust Financial Assumptions */}
              <div className="sec-fixed">
                <div className="sec-fixed-hdr">
                  <div className="sec-fixed-ttl">⚙ Adjust Financial Assumptions</div>
                </div>
                <div className="sec-fixed-body">
                  {/* Investment Strategy Selection */}
                  <div style={{ marginBottom: "14px" }}>
                    <label className="al">Investment Strategy</label>
                    <div className="strategy-btns">
                      <button
                        className={`strat-btn \${
                          investmentStrategy === "investor" ? "active" : ""
                        }`}
                        onClick={() => handleStrategyChange("investor")}
                      >
                        🏢 Investor (20-30% down)
                      </button>
                      <button
                        className={`strat-btn \${
                          investmentStrategy === "houseHack" ? "active" : ""
                        }`}
                        onClick={() => handleStrategyChange("houseHack")}
                        disabled={property.units > 4}
                      >
                        🏡 House Hack (5% down)
                      </button>
                    </div>
                    {investmentStrategy === "houseHack" && property.units <= 4 && (
                      <div className="hh-hint">
                        💡 House hack: You'll live in 1 unit. {property.units - 1} unit(s)
                        will be rented. Rent calculated on rentable units only.
                      </div>
                    )}
                    {investmentStrategy === "houseHack" && property.units > 4 && (
                      <div className="hh-hint" style={{ color: "#c1121f" }}>
                        ⚠ House hack only works for 1-4 unit properties
                      </div>
                    )}
                  </div>

                  {/* Featured Metrics Box */}
                  {metrics && (
                    <div className="feat">
                      <div className="feat-lbl">
                        📊{" "}
                        {investmentStrategy === "houseHack"
                          ? "Key Metrics (House Hack)"
                          : "Key Metrics (Investor)"}
                      </div>
                      <div className="feat-row">
                        <div className="feat-n">Monthly Profit</div>
                        <div
                          className="feat-v"
                          style={{
                            color: metrics.monthlyProfit > 0 ? "#74c69d" : "#f5a0a5",
                          }}
                        >
                          {formatCurrency(metrics.monthlyProfit)}
                        </div>
                      </div>
                      <div className="feat-row">
                        <div className="feat-n">Cash-on-Cash Return</div>
                        <div className="feat-v">
                          {formatPercent(metrics.cashOnCash / 100)}
                        </div>
                      </div>
                      {investmentStrategy === "investor" && (
                        <>
                          <div className="feat-row">
                            <div className="feat-n">Cap Rate</div>
                            <div className="feat-v">
                              {formatPercent(metrics.capRate / 100)}
                            </div>
                          </div>
                          <div className="feat-row">
                            <div className="feat-n">Annual ROI</div>
                            <div className="feat-v">
                              {formatPercent(metrics.roi / 100)}
                            </div>
                          </div>
                        </>
                      )}
                      {investmentStrategy === "houseHack" && (
                        <>
                          <div className="feat-row">
                            <div className="feat-n">Out of Pocket</div>
                            <div className="feat-v">
                              {formatCurrency(metrics.totalOutOfPocket)}
                            </div>
                          </div>
                          <div className="feat-row">
                            <div className="feat-n">Annual Savings</div>
                            <div className="feat-v">
                              {formatCurrency(metrics.annualProfit)}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Editable Financial Assumptions */}
                  <label className="al" style={{ marginTop: "14px" }}>
                    Purchase & Financing
                  </label>
                  <div className="ri">
                    <div className="ag">
                      <label className="al">Purchase Price</label>
                      <input
                        type="number"
                        className="ai"
                        value={assumptions.purchasePrice}
                        onChange={(e) =>
                          handleAssumptionChange("purchasePrice", e.target.value)
                        }
                      />
                    </div>
                    <div className="ag">
                      <label className="al">Down Payment %</label>
                      <input
                        type="number"
                        className="ai"
                        value={assumptions.downPaymentPercent}
                        onChange={(e) =>
                          handleAssumptionChange("downPaymentPercent", e.target.value)
                        }
                        step="1"
                      />
                    </div>
                  </div>

                  <div className="ri">
                    <div className="ag">
                      <label className="al">Interest Rate %</label>
                      <input
                        type="number"
                        className="ai"
                        value={assumptions.loanInterestRate}
                        onChange={(e) =>
                          handleAssumptionChange("loanInterestRate", e.target.value)
                        }
                        step="0.1"
                      />
                    </div>
                    <div className="ag">
                      <label className="al">Loan Term (Years)</label>
                      <input
                        type="number"
                        className="ai"
                        value={assumptions.loanTermYears}
                        onChange={(e) =>
                          handleAssumptionChange("loanTermYears", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="ag">
                    <label className="al">Closing Costs</label>
                    <input
                      type="number"
                      className="ai"
                      value={assumptions.closingCosts}
                      onChange={(e) =>
                        handleAssumptionChange("closingCosts", e.target.value)
                      }
                    />
                  </div>

                  <label className="al" style={{ marginTop: "14px" }}>
                    Monthly Expenses
                  </label>
                  <div className="ri">
                    <div className="ag">
                      <label className="al">Property Taxes</label>
                      <input
                        type="number"
                        className="ai"
                        value={assumptions.propertyTaxesMonthly}
                        onChange={(e) =>
                          handleAssumptionChange("propertyTaxesMonthly", e.target.value)
                        }
                      />
                    </div>
                    <div className="ag">
                      <label className="al">Insurance</label>
                      <input
                        type="number"
                        className="ai"
                        value={assumptions.insuranceMonthly}
                        onChange={(e) =>
                          handleAssumptionChange("insuranceMonthly", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="ri">
                    <div className="ag">
                      <label className="al">Maintenance (% of price)</label>
                      <input
                        type="number"
                        className="ai"
                        value={assumptions.maintenanceMonthlyPercent * 100}
                        onChange={(e) =>
                          handleAssumptionChange(
                            "maintenanceMonthlyPercent",
                            parseFloat(e.target.value) / 100
                          )
                        }
                        step="0.1"
                      />
                    </div>
                    <div className="ag">
                      <label className="al">Property Mgmt %</label>
                      <input
                        type="number"
                        className="ai"
                        value={assumptions.propertyManagementPercent * 100}
                        onChange={(e) =>
                          handleAssumptionChange(
                            "propertyManagementPercent",
                            parseFloat(e.target.value) / 100
                          )
                        }
                        step="0.1"
                      />
                    </div>
                  </div>

                  <label className="al" style={{ marginTop: "14px" }}>
                    Rental Income
                  </label>
                  <div className="ri">
                    <div className="ag">
                      <label className="al">
                        {investmentStrategy === "houseHack"
                          ? "Rent per Unit"
                          : "Monthly Rent (Total)"}
                      </label>
                      <input
                        type="number"
                        className="ai"
                        value={assumptions.monthlyRent}
                        onChange={(e) =>
                          handleAssumptionChange("monthlyRent", e.target.value)
                        }
                      />
                    </div>
                    {investmentStrategy === "houseHack" && (
                      <div className="ag">
                        <label className="al">Rentable Units</label>
                        <input
                          type="number"
                          className="ai"
                          value={assumptions.rentableUnits}
                          onChange={(e) =>
                            handleAssumptionChange("rentableUnits", e.target.value)
                          }
                          max={property.units - 1}
                        />
                      </div>
                    )}
                  </div>

                  <div className="ri">
                    <div className="ag">
                      <label className="al">Vacancy Rate %</label>
                      <input
                        type="number"
                        className="ai"
                        value={assumptions.vacancyRatePercent * 100}
                        onChange={(e) =>
                          handleAssumptionChange(
                            "vacancyRatePercent",
                            parseFloat(e.target.value) / 100
                          )
                        }
                        step="0.1"
                      />
                    </div>
                    <div className="ag">
                      <label className="al">Annual CapEx</label>
                      <input
                        type="number"
                        className="ai"
                        value={assumptions.capExAnnual}
                        onChange={(e) =>
                          handleAssumptionChange("capExAnnual", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 1: Financial Underwriting (Collapsible) */}
              <div className="sec">
                <div
                  className="sec-hdr"
                  onClick={() => toggleSection("underwriting")}
                >
                  <div className="sec-ttl">
                    📊 Section 1: Financial Underwriting
                    <span className={`chev \${sectionOpen.underwriting ? "open" : ""}`}>
                      ▼
                    </span>
                  </div>
                </div>
                {sectionOpen.underwriting && (
                  <div className="sec-body">
                    {metrics && (
                      <>
                        {/* Key Metrics */}
                        <div style={{ marginBottom: "16px" }}>
                          <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "10px" }}>
                            Purchase & Financing Summary
                          </div>
                          <div className="mgrid">
                            <div className="mc">
                              <div className="mn">Purchase Price</div>
                              <div className="mv">
                                {formatCurrency(metrics.purchasePrice)}
                              </div>
                            </div>
                            <div className="mc">
                              <div className="mn">Down Payment</div>
                              <div className="mv">
                                {formatCurrency(metrics.downPayment)}
                              </div>
                            </div>
                            <div className="mc">
                              <div className="mn">Loan Amount</div>
                              <div className="mv">
                                {formatCurrency(metrics.loanAmount)}
                              </div>
                            </div>
                            <div className="mc">
                              <div className="mn">Monthly Payment</div>
                              <div className="mv">
                                {formatCurrency(metrics.monthlyPayment)}
                              </div>
                            </div>
                            <div className="mc hl">
                              <div className="mn">Total Out of Pocket</div>
                              <div className="mv">
                                {formatCurrency(metrics.totalOutOfPocket)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Income & Expenses */}
                        <div style={{ marginBottom: "16px" }}>
                          <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "10px" }}>
                            Monthly Income & Expenses
                          </div>
                          <table className="tbl">
                            <thead>
                              <tr>
                                <th>Item</th>
                                <th style={{ textAlign: "right" }}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Rental Income</td>
                                <td className="rc">{formatCurrency(metrics.monthlyRent)}</td>
                              </tr>
                              <tr>
                                <td>Effective Income (after vacancy)</td>
                                <td className="rc gv">
                                  {formatCurrency(metrics.effectiveMonthlyIncome)}
                                </td>
                              </tr>
                              <tr className="cat">
                                <td>Operating Expenses</td>
                                <td className="rc">-</td>
                              </tr>
                              <tr>
                                <td style={{ paddingLeft: "20px" }}>Loan Payment</td>
                                <td className="rc">
                                  {formatCurrency(metrics.monthlyPayment)}
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingLeft: "20px" }}>Taxes & Insurance</td>
                                <td className="rc">
                                  {formatCurrency(
                                    assumptions.propertyTaxesMonthly +
                                      assumptions.insuranceMonthly
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingLeft: "20px" }}>Maintenance</td>
                                <td className="rc">
                                  {formatCurrency(
                                    metrics.purchasePrice *
                                      assumptions.maintenanceMonthlyPercent
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingLeft: "20px" }}>
                                  Property Management
                                </td>
                                <td className="rc">
                                  {formatCurrency(
                                    metrics.effectiveMonthlyIncome *
                                      assumptions.propertyManagementPercent *
                                      (investmentStrategy === "houseHack" ? 0 : 1)
                                  )}
                                </td>
                              </tr>
                              <tr className="tot">
                                <td>Monthly Profit / Loss</td>
                                <td className={`rc \${metrics.monthlyProfit > 0 ? "gv" : "rv"}`}>
                                  {formatCurrency(metrics.monthlyProfit)}
                                </td>
                              </tr>
                              <tr className="cat">
                                <td>Annual Profit</td>
                                <td className="rc">
                                  {formatCurrency(metrics.annualProfit)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Financial Ratios */}
                        <div style={{ marginBottom: "16px" }}>
                          <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "10px" }}>
                            Key Financial Ratios
                          </div>
                          <div className="mgrid">
                            <div className="mc">
                              <div className="mn">Cap Rate</div>
                              <div className="mv">
                                {formatPercent(metrics.capRate / 100)}
                              </div>
                            </div>
                            <div className="mc">
                              <div className="mn">Cash-on-Cash</div>
                              <div className="mv">
                                {formatPercent(metrics.cashOnCash / 100)}
                              </div>
                            </div>
                            <div className="mc">
                              <div className="mn">ROI</div>
                              <div className="mv">
                                {formatPercent(metrics.roi / 100)}
                              </div>
                            </div>
                            <div className="mc">
                              <div className="mn">Debt/Income Ratio</div>
                              <div className="mv">
                                {formatPercent(metrics.debtToIncomeRatio / 100)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Section 2: Market & Risk Assessment (Collapsible) */}
              <div className="sec">
                <div className="sec-hdr" onClick={() => toggleSection("market")}>
                  <div className="sec-ttl">
                    📍 Section 2: Market & Risk Assessment
                    <span className={`chev \${sectionOpen.market ? "open" : ""}`}>
                      ▼
                    </span>
                  </div>
                </div>
                {sectionOpen.market && (
                  <div className="sec-body">
                    <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "12px" }}>
                      Neighborhood Metrics
                    </div>
                    <div className="ngrid" style={{ marginBottom: "16px" }}>
                      <div className="nc">
                        <div className="nt">Walk Score</div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              height: "6px",
                              background: "#d5cfc4",
                              borderRadius: "3px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `\${property.neighborhood.walkScore}%`,
                                height: "100%",
                                background: "#2d6a4f",
                              }}
                            ></div>
                          </div>
                          <div
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "11px",
                              fontWeight: "500",
                              width: "28px",
                              textAlign: "right",
                            }}
                          >
                            {property.neighborhood.walkScore}
                          </div>
                        </div>
                      </div>
                      <div className="nc">
                        <div className="nt">Crime Rate</div>
                        <div
                          style={{
                            fontSize: "12px",
                            fontFamily: "'DM Mono', monospace",
                            color:
                              property.neighborhood.crimeRate === "low"
                                ? "#2d6a4f"
                                : "#c1121f",
                            fontWeight: "500",
                          }}
                        >
                          {property.neighborhood.crimeRate === "low"
                            ? "✓ Low"
                            : "⚠ High"}
                        </div>
                      </div>
                      <div className="nc">
                        <div className="nt">School Rating</div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontFamily: "'DM Mono', monospace",
                            color: "#c9a84c",
                            fontWeight: "600",
                          }}
                        >
                          {property.neighborhood.schoolRating} / 10
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: "11px", color: "#666", lineHeight: "1.6" }}>
                      Area is experiencing moderate appreciation with good walkability
                      and low crime rates. Strong rental demand noted.
                    </div>
                  </div>
                )}
              </div>

              {/* Risk Flags (Collapsible) */}
              <div className="sec">
                <div className="sec-hdr" onClick={() => toggleSection("riskFlags")}>
                  <div className="sec-ttl">
                    🚩 Risk Flags Identified
                    <span className={`chev \${sectionOpen.riskFlags ? "open" : ""}`}>
                      ▼
                    </span>
                  </div>
                </div>
                {sectionOpen.riskFlags && (
                  <div className="sec-body">
                    <div className="flags">
                      {metrics && metrics.debtToIncomeRatio > 85 && (
                        <div className="flag high">
                          <div className="flag-icon">⚠</div>
                          <div className="flag-content">
                            <div className="ft">High Debt-to-Income Ratio</div>
                            <div>
                              Debt service represents {Math.round(metrics.debtToIncomeRatio)}% of
                              income. Consider higher down payment.
                              <span className="fb">HIGH</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {metrics && metrics.monthlyProfit < 0 && (
                        <div className="flag high">
                          <div className="flag-icon">⚠</div>
                          <div className="flag-content">
                            <div className="ft">Negative Cash Flow</div>
                            <div>
                              Property is cash flow negative at current assumptions.
                              Review expenses and rent estimates.
                              <span className="fb">HIGH</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {assumptions.vacancyRatePercent < 0.03 && (
                        <div className="flag medium">
                          <div className="flag-icon">⚠</div>
                          <div className="flag-content">
                            <div className="ft">Low Vacancy Buffer</div>
                            <div>
                              Vacancy rate very low. Consider increasing reserve assumption.
                              <span className="fb">MEDIUM</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {investmentStrategy === "houseHack" &&
                        property.units > 4 && (
                          <div className="flag high">
                            <div className="flag-icon">⚠</div>
                            <div className="flag-content">
                              <div className="ft">
                                House Hack Strategy Not Applicable
                              </div>
                              <div>
                                This property has {property.units} units. House hack only
                                works for 1-4 unit properties.
                                <span className="fb">HIGH</span>
                              </div>
                            </div>
                          </div>
                        )}
                      {property.neighborhood.crimeRate === "high" && (
                        <div className="flag medium">
                          <div className="flag-icon">⚠</div>
                          <div className="flag-content">
                            <div className="ft">High Crime Area</div>
                            <div>
                              This neighborhood has higher crime rates. May impact
                              tenant quality and vacancy rates.
                              <span className="fb">MEDIUM</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {property.neighborhood.walkScore < 50 && (
                        <div className="flag low">
                          <div className="flag-icon">ℹ</div>
                          <div className="flag-content">
                            <div className="ft">Car-Dependent Area</div>
                            <div>
                              Low walkability. Tenants will rely on cars. May limit
                              rental market appeal.
                              <span className="fb">LOW</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Aggregated Sources (Collapsible) */}
              <div className="sec">
                <div className="sec-hdr" onClick={() => toggleSection("sources")}>
                  <div className="sec-ttl">
                    🌐 Aggregated Sources
                    <span className={`chev \${sectionOpen.sources ? "open" : ""}`}>
                      ▼
                    </span>
                  </div>
                </div>
                {sectionOpen.sources && (
                  <div className="sec-body">
                    <div className="sgrid">
                      {property.sources.zillow && (
                        <div className="scard">
                          <div className="si">🏘</div>
                          <div>
                            <div className="sname">Zillow</div>
                            <div className="sfound">✓ Data found</div>
                            <div className="snote">
                              Listing price, estimated rent, market data
                            </div>
                          </div>
                        </div>
                      )}
                      {property.sources.redfin && (
                        <div className="scard">
                          <div className="si">🏠</div>
                          <div>
                            <div className="sname">Redfin</div>
                            <div className="sfound">✓ Data found</div>
                            <div className="snote">
                              Price history, home estimate, property details
                            </div>
                          </div>
                        </div>
                      )}
                      {property.sources.taxRecords && (
                        <div className="scard">
                          <div className="si">📋</div>
                          <div>
                            <div className="sname">Tax Records</div>
                            <div className="sfound">✓ Data found</div>
                            <div className="snote">
                              Property taxes, assessed value, owner info
                            </div>
                          </div>
                        </div>
                      )}
                      {!property.sources.mls && (
                        <div className="scard">
                          <div className="si">📊</div>
                          <div>
                            <div className="sname">MLS Data</div>
                            <div className="sfound no">Not available</div>
                            <div className="snote">
                              MLS data not accessible for this area
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
