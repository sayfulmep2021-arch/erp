/**
 * MEP Portal - Production Performance Dashboard Dynamic Engine
 * Real-time Target vs Achievement, Branch Progress, Yearly SVG Graph, and Semi-Circle Gauge
 * Auto-extracted from index.html during Phase 2 modularization
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

            // 2. Dynamic Production Target from Production Plan
            let planData = null;
            if (typeof getProductionPlanTargetForPeriod === 'function') {
                planData = getProductionPlanTargetForPeriod(liveYear, liveMonthName);
            }

            // 3. Dynamic Production Achievement from Yearly Production Summary ERP
            let erpData = null;
            if (typeof getYearlyERPDataForPeriod === 'function') {
                erpData = getYearlyERPDataForPeriod(liveYear, liveMonthName);
            }

            // 4. Resolve Target & Achievement values
            let target = (customData && customData.monthlyTarget !== undefined) ? Number(customData.monthlyTarget) :
                         (planData ? planData.totalTarget : 40000);

            let achieve = (customData && customData.monthlyAchievement !== undefined) ? Number(customData.monthlyAchievement) :
                          (erpData ? erpData.totalAchievement : 25000);

            // Default branch values
            let branchT = (planData && planData.branchBreakdown) ? { ...planData.branchBreakdown } : { fanAssemble: 20000, bladeDimmer: 10000, armatureWinding: 10000 };
            let branchA = (erpData && erpData.branchBreakdown) ? { ...erpData.branchBreakdown } : { fanAssemble: 15000, bladeDimmer: 5000, armatureWinding: 6500 };

            if (customData && customData.branches) {
                if (customData.branches.fanAssemble) {
                    if (customData.branches.fanAssemble.target !== undefined) branchT.fanAssemble = customData.branches.fanAssemble.target;
                    if (customData.branches.fanAssemble.achievement !== undefined) branchA.fanAssemble = customData.branches.fanAssemble.achievement;
                }
                if (customData.branches.bladeDimmer) {
                    if (customData.branches.bladeDimmer.target !== undefined) branchT.bladeDimmer = customData.branches.bladeDimmer.target;
                    if (customData.branches.bladeDimmer.achievement !== undefined) branchA.bladeDimmer = customData.branches.bladeDimmer.achievement;
                }
                if (customData.branches.armatureWinding) {
                    if (customData.branches.armatureWinding.target !== undefined) branchT.armatureWinding = customData.branches.armatureWinding.target;
                    if (customData.branches.armatureWinding.achievement !== undefined) branchA.armatureWinding = customData.branches.armatureWinding.achievement;
                }
            }

            // Calculate overall percentages
            const pending = Math.max(0, target - achieve);
            const achievePct = target > 0 ? ((achieve / target) * 100).toFixed(1) : "0.0";
            const pendingPct = target > 0 ? ((pending / target) * 100).toFixed(1) : "0.0";

            // ① Card 1: Production Target (Dynamic)
            const elTarget = document.getElementById('valProdTarget');
            if (elTarget) {
                elTarget.innerHTML = `${target.toLocaleString()} <span style="font-size:0.52em; font-weight:800; letter-spacing:0;">PCS</span>`;
            }
            const elTargetSub = document.getElementById('lblProdTargetSub');
            if (elTargetSub) {
                elTargetSub.innerText = `Monthly Production Target (${liveMonthShortYear})`;
            }

            // ② Card 2: Production Achievement (Dynamic)
            const elAchieve = document.getElementById('valProdAchieve');
            if (elAchieve) {
                elAchieve.innerHTML = `${achieve.toLocaleString()} <span style="font-size:0.52em; font-weight:800; color:#334155; letter-spacing:0;">PCS</span>`;
            }
            const elAchieveSub = document.getElementById('lblProdAchieveSub');
            if (elAchieveSub) {
                elAchieveSub.innerText = `Completed Production (${liveMonthShortYear})`;
            }

            // ③ Card 3: Three Branch Achievement Bar
            const fanT = branchT.fanAssemble || 20000;
            const fanA = branchA.fanAssemble || 15000;
            const fanP = fanT > 0 ? Math.round((fanA / fanT) * 100) : 75;

            const bladeT = branchT.bladeDimmer || 10000;
            const bladeA = branchA.bladeDimmer || 5000;
            const bladeP = bladeT > 0 ? Math.round((bladeA / bladeT) * 100) : 50;

            const armT = branchT.armatureWinding || 10000;
            const armA = branchA.armatureWinding || 6500;
            const armP = armT > 0 ? Math.round((armA / armT) * 100) : 65;

            const elFanPct = document.getElementById('pctFanAssemble');
            const elFanBar = document.getElementById('barFanAssemble');
            if (elFanPct) elFanPct.innerText = `${fanP}%`;
            if (elFanBar) {
                elFanBar.style.width = `${Math.min(100, fanP)}%`;
                elFanBar.title = `Fan Assemble: ${fanP}% (${fanA.toLocaleString()} / ${fanT.toLocaleString()} PCS)`;
            }

            const elBladePct = document.getElementById('pctBladeDimmer');
            const elBladeBar = document.getElementById('barBladeDimmer');
            if (elBladePct) elBladePct.innerText = `${bladeP}%`;
            if (elBladeBar) {
                elBladeBar.style.width = `${Math.min(100, bladeP)}%`;
                elBladeBar.title = `Blade & Dimmer: ${bladeP}% (${bladeA.toLocaleString()} / ${bladeT.toLocaleString()} PCS)`;
            }

            const elArmPct = document.getElementById('pctArmatureWinding');
            const elArmBar = document.getElementById('barArmatureWinding');
            if (elArmPct) elArmPct.innerText = `${armP}%`;
            if (elArmBar) {
                elArmBar.style.width = `${Math.min(100, armP)}%`;
                elArmBar.title = `Armature & Winding: ${armP}% (${armA.toLocaleString()} / ${armT.toLocaleString()} PCS)`;
            }

            // ④ Zone 4: Yearly Graph Dynamic Active Month Marker
            const activeColIdx = planData ? planData.columnIndex : 2;
            const activeX = 75 + (activeColIdx * 60);

            const elActiveLine = document.getElementById('graphActiveGuideLine');
            const elActiveRect = document.getElementById('graphActiveBadgeRect');
            const elActiveText = document.getElementById('graphActiveBadgeText');
            if (elActiveLine) {
                elActiveLine.setAttribute('x1', activeX);
                elActiveLine.setAttribute('x2', activeX);
            }
            if (elActiveRect) {
                elActiveRect.setAttribute('x', activeX - 25);
            }
            if (elActiveText) {
                elActiveText.setAttribute('x', activeX);
            }

            for (let i = 0; i < 12; i++) {
                const elM = document.getElementById(`lblGraphMonth${i}`);
                if (elM) {
                    if (i === activeColIdx) {
                        elM.setAttribute('fill', '#0284c7');
                        elM.setAttribute('font-weight', '900');
                        elM.setAttribute('font-size', '9.5');
                    } else {
                        elM.setAttribute('fill', '#64748b');
                        elM.setAttribute('font-weight', '800');
                        elM.setAttribute('font-size', '9');
                    }
                }
            }

            const elGraphActiveMonth = document.getElementById('graphActiveMonthPill');
            if (elGraphActiveMonth) {
                elGraphActiveMonth.innerHTML = `Active Output: <strong style="color:#0284c7;">${achieve.toLocaleString()} PCS (${liveMonthShortYear})</strong>`;
            }

            // ⑤ Zone 5: Branch Summary Table
            const elTblFanT = document.getElementById('tblTargetFan');
            const elTblFanA = document.getElementById('tblAchieveFan');
            const elTblFanP = document.getElementById('tblPendingFan');
            if (elTblFanT) elTblFanT.innerText = fanT.toLocaleString();
            if (elTblFanA) elTblFanA.innerText = fanA.toLocaleString();
            if (elTblFanP) elTblFanP.innerText = Math.max(0, fanT - fanA).toLocaleString();

            const elTblBladeT = document.getElementById('tblTargetBlade');
            const elTblBladeA = document.getElementById('tblAchieveBlade');
            const elTblBladeP = document.getElementById('tblPendingBlade');
            if (elTblBladeT) elTblBladeT.innerText = bladeT.toLocaleString();
            if (elTblBladeA) elTblBladeA.innerText = bladeA.toLocaleString();
            if (elTblBladeP) elTblBladeP.innerText = Math.max(0, bladeT - bladeA).toLocaleString();

            const elTblArmT = document.getElementById('tblTargetArm');
            const elTblArmA = document.getElementById('tblAchieveArm');
            const elTblArmP = document.getElementById('tblPendingArm');
            if (elTblArmT) elTblArmT.innerText = armT.toLocaleString();
            if (elTblArmA) elTblArmA.innerText = armA.toLocaleString();
            if (elTblArmP) elTblArmP.innerText = Math.max(0, armT - armA).toLocaleString();

            const sumTarget = fanT + bladeT + armT;
            const sumAchieve = fanA + bladeA + armA;
            const sumPending = Math.max(0, sumTarget - sumAchieve);

            const elTblTotT = document.getElementById('tblTargetTotal');
            const elTblTotA = document.getElementById('tblAchieveTotal');
            const elTblTotP = document.getElementById('tblPendingTotal');
            if (elTblTotT) elTblTotT.innerText = sumTarget.toLocaleString();
            if (elTblTotA) elTblTotA.innerText = sumAchieve.toLocaleString();
            if (elTblTotP) elTblTotP.innerText = sumPending.toLocaleString();

            // ⑥ Zone 6: Gauge Display & Mathematics
            const elGaugeAchPct = document.getElementById('valGaugeAchievePct');
            const elGaugePendPct = document.getElementById('valGaugePendingPct');
            const elGaugePendPcs = document.getElementById('valGaugePendingPcs');
            const elGaugeTgtPcs = document.getElementById('valGaugeTargetPcs');
            const elGaugeArc = document.getElementById('gaugeAchieveArc');
            const elGaugeFormula = document.getElementById('valGaugeFormulaFootnote');

            if (elGaugeAchPct) elGaugeAchPct.innerText = `${achievePct}%`;
            if (elGaugePendPct) elGaugePendPct.innerText = `${pendingPct}%`;
            if (elGaugePendPcs) elGaugePendPcs.innerText = `${pending.toLocaleString()} PCS`;
            if (elGaugeTgtPcs) elGaugeTgtPcs.innerText = `${target.toLocaleString()} PCS`;

            if (elGaugeArc) {
                const arcLength = 267.0;
                const dashVal = Math.max(0, Math.min(arcLength, (parseFloat(achievePct) / 100) * arcLength));
                elGaugeArc.setAttribute('stroke-dasharray', `${dashVal.toFixed(1)} ${arcLength}`);
            }

            if (elGaugeFormula) {
                elGaugeFormula.innerHTML = `Completed (${achieve.toLocaleString()}) ÷ Target (${target.toLocaleString()}) × 100 = <strong>${achievePct}%</strong> | Pending = <strong>${pendingPct}%</strong>`;
            }
        }

        window.updateProductionDashboard = function(newData) {
            renderProductionPerformanceDashboard(newData);
        };

        // Real-time synchronization across browser tabs (when Production Plan or ERP Summary updates)
        window.addEventListener('storage', (e) => {
            if (e.key === 'mep_yearly_production_plans_all' || e.key === 'mep_yearly_erp_production_data') {
                renderProductionPerformanceDashboard();
            }
        });

        // Re-calculate on window focus in case date or localStorage changed
        window.addEventListener('focus', () => {
            renderProductionPerformanceDashboard();
        });
