/**
 * MEP Portal - Production Performance Dashboard Dynamic Engine
 * Real-time Production Target, Achievement, Pending, Day-wise Gap & 3-Color Donut Chart
 * Synchronized live to Production Plan & Yearly Production Summary ERP
 */
window.PRODUCTION_DASHBOARD_DATA = null;

function renderProductionPerformanceDashboard(customData) {
    // 1. Determine Current Live Date
    const now = new Date();
    const liveYear = now.getFullYear();
    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const liveMonthIdx = now.getMonth();
    const liveMonthName = MONTH_NAMES[liveMonthIdx];
    const liveMonthShort = MONTH_SHORT[liveMonthIdx];
    const liveMonthShortYear = `${liveMonthShort}-${String(liveYear).slice(-2)}`;

    // 2. Dynamic Production Target from Production Plan (STRICT: Ceiling Fan Series Total Target)
    let planData = null;
    if (typeof getProductionPlanTargetForPeriod === 'function') {
        try {
            planData = getProductionPlanTargetForPeriod(liveYear, liveMonthName);
        } catch(e) {
            console.warn("[Dashboard Engine] getProductionPlanTargetForPeriod error:", e);
        }
    }

    // 3. Dynamic Production Achievement from Yearly Production Summary ERP (STRICT: Ceiling Fan Series ONLY)
    let erpData = null;
    if (typeof getYearlyERPDataForPeriod === 'function') {
        try {
            erpData = getYearlyERPDataForPeriod(liveYear, liveMonthName);
        } catch(e) {
            console.warn("[Dashboard Engine] getYearlyERPDataForPeriod error:", e);
        }
    }

    // 4. Resolve Production Target & Achievement (Defaults for Sep 2026: 40,000 & 7,613)
    let target = (customData && customData.monthlyTarget !== undefined) ? Number(customData.monthlyTarget) :
                 (planData && planData.ceilingFanTarget !== undefined ? Number(planData.ceilingFanTarget) :
                 (planData && planData.totalTarget !== undefined ? Number(planData.totalTarget) : 40000));

    let achieve = (customData && customData.monthlyAchievement !== undefined) ? Number(customData.monthlyAchievement) :
                  (erpData && erpData.ceilingFanAchievement !== undefined ? Number(erpData.ceilingFanAchievement) :
                  (erpData && erpData.totalAchievement !== undefined ? Number(erpData.totalAchievement) : 7613));

    target = Math.max(0, target);
    achieve = Math.max(0, achieve);

    // 5. Calculate Pending (Strictly non-negative)
    const pending = Math.max(0, target - achieve);
    const achievePct = target > 0 ? ((achieve / target) * 100).toFixed(1) : "0.0";
    const pendingPct = target > 0 ? ((pending / target) * 100).toFixed(1) : "0.0";

    // 6. Day-wise Target & Production Gap (26 Working Days Standard)
    const STANDARD_WORKING_DAYS = 26;
    const dailyTarget = Math.round(target / STANDARD_WORKING_DAYS);

    // Completed working days: based on day of month, capped at 26
    const curDay = now.getDate();
    const totalDaysInMonth = new Date(liveYear, liveMonthIdx + 1, 0).getDate();
    const completedWorkingDays = Math.min(STANDARD_WORKING_DAYS, Math.max(1, Math.round((curDay / totalDaysInMonth) * STANDARD_WORKING_DAYS)));

    const expectedProduction = Math.round(dailyTarget * completedWorkingDays);
    const productionGap = Math.max(0, expectedProduction - achieve);
    const isBehind = achieve < expectedProduction;
    const dayWisePct = expectedProduction > 0 ? Math.min(100, Math.round((achieve / expectedProduction) * 100)) : 100;

    // Cache state
    window.PRODUCTION_DASHBOARD_DATA = {
        year: liveYear,
        month: liveMonthName,
        target,
        achieve,
        pending,
        achievePct,
        pendingPct,
        dailyTarget,
        completedWorkingDays,
        expectedProduction,
        productionGap,
        isBehind,
        dayWisePct
    };

    // =========================================================================
    // UPDATE DOM ELEMENTS IN MAIN INTERFACE VIEW
    // =========================================================================

    // ① CARD 1: PRODUCTION TARGET
    const elSalesVal = document.getElementById('kpiSalesVal');
    if (elSalesVal) {
        elSalesVal.innerHTML = `${target.toLocaleString()} <span style="font-size:0.55em; font-weight:800; color:#64748b;">PCS</span>`;
    }
    const elTargetSubVal = document.getElementById('kpiTargetSubVal');
    if (elTargetSubVal) {
        elTargetSubVal.innerText = `${target.toLocaleString()} PCS`;
    }
    const elTargetScope = document.getElementById('kpiTargetScope');
    if (elTargetScope) {
        elTargetScope.innerText = `Ceiling Fan (${liveMonthShortYear})`;
    }
    const elTargetProgressBar = document.getElementById('kpiTargetProgressBar');
    if (elTargetProgressBar) {
        elTargetProgressBar.style.width = '100%';
    }

    // ② CARD 2: ACHIEVEMENT
    const elPurchaseVal = document.getElementById('kpiPurchaseVal');
    if (elPurchaseVal) {
        elPurchaseVal.innerHTML = `${achieve.toLocaleString()} <span style="font-size:0.55em; font-weight:800; color:#64748b;">PCS</span>`;
    }
    const elAchieveSubVal = document.getElementById('kpiAchieveSubVal');
    if (elAchieveSubVal) {
        elAchieveSubVal.innerText = `${achieve.toLocaleString()} PCS`;
    }
    const elAchievePct = document.getElementById('kpiAchievePct');
    if (elAchievePct) {
        elAchievePct.innerText = `${achievePct}%`;
    }
    const elAchieveProgressBar = document.getElementById('kpiAchieveProgressBar');
    if (elAchieveProgressBar) {
        elAchieveProgressBar.style.width = `${Math.min(100, parseFloat(achievePct))}%`;
    }

    // ③ CARD 3: PENDING
    const elCashFlowVal = document.getElementById('kpiCashFlowVal');
    if (elCashFlowVal) {
        elCashFlowVal.innerHTML = `${pending.toLocaleString()} <span style="font-size:0.55em; font-weight:800; color:#64748b;">PCS</span>`;
    }
    const elPendingSubVal = document.getElementById('kpiPendingSubVal');
    if (elPendingSubVal) {
        elPendingSubVal.innerText = `${pending.toLocaleString()} PCS`;
    }
    const elPendingPct = document.getElementById('kpiPendingPct');
    if (elPendingPct) {
        elPendingPct.innerText = `${pendingPct}%`;
    }
    const elPendingProgressBar = document.getElementById('kpiPendingProgressBar');
    if (elPendingProgressBar) {
        elPendingProgressBar.style.width = `${Math.min(100, parseFloat(pendingPct))}%`;
    }

    // ④ CARD 4: DAY WISE TARGET & PRODUCTION GAP
    const elAccountVal = document.getElementById('kpiAccountVal');
    if (elAccountVal) {
        elAccountVal.innerHTML = `${dailyTarget.toLocaleString()} <span style="font-size:0.55em; font-weight:800; color:#64748b;">PCS / Day</span>`;
    }
    const elDayWiseExpected = document.getElementById('kpiDayWiseExpected');
    if (elDayWiseExpected) {
        elDayWiseExpected.innerText = `${expectedProduction.toLocaleString()} PCS`;
    }
    const elDayWiseGap = document.getElementById('kpiDayWiseGap');
    if (elDayWiseGap) {
        if (isBehind) {
            elDayWiseGap.innerHTML = `<span style="color:#ef4444;">${productionGap.toLocaleString()} PCS Behind</span>`;
        } else {
            const ahead = achieve - expectedProduction;
            elDayWiseGap.innerHTML = `<span style="color:#10b981;">On Track (+${ahead.toLocaleString()} PCS)</span>`;
        }
    }
    const elDayStatusBadge = document.getElementById('kpiDayStatusBadge');
    if (elDayStatusBadge) {
        if (isBehind) {
            elDayStatusBadge.innerText = 'BEHIND';
            elDayStatusBadge.style.background = '#fee2e2';
            elDayStatusBadge.style.color = '#dc2626';
        } else {
            elDayStatusBadge.innerText = 'ON TRACK';
            elDayStatusBadge.style.background = '#dcfce7';
            elDayStatusBadge.style.color = '#15803d';
        }
    }
    const elDayWiseProgressBar = document.getElementById('kpiDayWiseProgressBar');
    if (elDayWiseProgressBar) {
        elDayWiseProgressBar.style.width = `${dayWisePct}%`;
        elDayWiseProgressBar.style.background = isBehind ? '#ef4444' : '#10b981';
    }
    const elDayWiseLabel = document.getElementById('kpiDayWiseLabel');
    if (elDayWiseLabel) {
        elDayWiseLabel.innerText = `Day ${completedWorkingDays} of ${STANDARD_WORKING_DAYS} Working Days`;
    }

    // ⑤ SECTION 5: PREMIUM DONUT / PIE CHART
    // Circumference for r = 38 is 2 * PI * 38 = 238.761
    const C = 2 * Math.PI * 38;
    const ratioAchieve = target > 0 ? (achieve / target) : 0;
    const ratioPending = target > 0 ? (pending / target) : 1;

    const strokeAchieve = Math.max(0, Math.min(C, ratioAchieve * C));
    const strokePending = Math.max(0, Math.min(C, ratioPending * C));

    const elArcAchieve = document.getElementById('donutArcAchieve');
    if (elArcAchieve) {
        elArcAchieve.setAttribute('stroke-dasharray', `${strokeAchieve.toFixed(2)} ${C.toFixed(2)}`);
        elArcAchieve.setAttribute('stroke-dashoffset', '0');
    }

    const elArcPending = document.getElementById('donutArcPending');
    if (elArcPending) {
        elArcPending.setAttribute('stroke-dasharray', `${strokePending.toFixed(2)} ${C.toFixed(2)}`);
        elArcPending.setAttribute('stroke-dashoffset', `-${strokeAchieve.toFixed(2)}`);
    }

    const elCenterPct = document.getElementById('donutCenterPct');
    if (elCenterPct) {
        elCenterPct.innerText = `${achievePct}%`;
    }
    const elCenterTarget = document.getElementById('donutCenterTarget');
    if (elCenterTarget) {
        elCenterTarget.innerText = `Target: ${target.toLocaleString()} PCS`;
    }

    // Donut Legend
    const elLegendTarget = document.getElementById('legendTargetVal');
    if (elLegendTarget) {
        elLegendTarget.innerText = `${target.toLocaleString()} PCS`;
    }
    const elLegendAchieve = document.getElementById('legendAchieveVal');
    if (elLegendAchieve) {
        elLegendAchieve.innerText = `${achieve.toLocaleString()} PCS - ${achievePct}%`;
    }
    const elLegendPending = document.getElementById('legendPendingVal');
    if (elLegendPending) {
        elLegendPending.innerText = `${pending.toLocaleString()} PCS - ${pendingPct}%`;
    }

    // Right Card: Last 30 Days Trend Stat Boxes
    const elTrendTarget = document.getElementById('trendTargetVal');
    if (elTrendTarget) elTrendTarget.innerText = `${target.toLocaleString()} PCS`;

    const elTrendAchieve = document.getElementById('trendAchieveVal');
    if (elTrendAchieve) elTrendAchieve.innerText = `${achieve.toLocaleString()} PCS`;

    const elTrendPending = document.getElementById('trendPendingVal');
    if (elTrendPending) elTrendPending.innerText = `${pending.toLocaleString()} PCS`;

    // ⑥ LEGACY / OPTIONAL COMPATIBILITY (if older elements exist)
    const elTargetOld = document.getElementById('valProdTarget');
    if (elTargetOld) elTargetOld.innerHTML = `${target.toLocaleString()} <span style="font-size:0.52em; font-weight:800;">PCS</span>`;
    const elAchieveOld = document.getElementById('valProdAchieve');
    if (elAchieveOld) elAchieveOld.innerHTML = `${achieve.toLocaleString()} <span style="font-size:0.52em; font-weight:800;">PCS</span>`;
}

window.updateProductionDashboard = function(newData) {
    renderProductionPerformanceDashboard(newData);
};

// Real-time synchronization across browser tabs (when Production Plan or ERP Summary updates in localStorage)
window.addEventListener('storage', (e) => {
    if (e.key === 'mep_yearly_production_plans_all' || e.key === 'mep_yearly_erp_production_data' || e.key === 'mep_monthly_production_snapshots') {
        renderProductionPerformanceDashboard();
    }
});

// Re-calculate on window focus in case localStorage changed in another tab
window.addEventListener('focus', () => {
    renderProductionPerformanceDashboard();
});
