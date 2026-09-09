/**
 * MEP Portal - Corporate Authentication, Session & View Routing Engine
 * Credentials validation, role-based views (ADMIN vs View), inactivity tracker, and page routing
 * Auto-extracted from index.html during Phase 3 modularization
 */
        // Official Credentials Configuration
        const AUTH_CONFIG = {
            adminUsername: "ADMIN",
            adminPassword: "9642",
            viewUsername: "View",
            viewPassword: "1234"
        };

        const STORAGE_KEYS = {
            isAuthenticated: "portal_auth_status",
            lastActivity: "portal_last_active_time"
        };

        function isPageReload() {
            try {
                const nav = performance.getEntriesByType('navigation');
                if (nav && nav.length > 0) {
                    return nav[0].type === 'reload';
                }
                if (performance.navigation) {
                    return performance.navigation.type === 1; // TYPE_RELOAD
                }
            } catch(e) {}
            return false;
        }

        function browseAllReportsAction(event) {
            if (event) event.stopPropagation();
            resetInactivityTimer();

            // Animate department cards on the right with a sequential wave pulse to guide user selection
            const cards = document.querySelectorAll('.dept-card-btn');
            cards.forEach((card, idx) => {
                setTimeout(() => {
                    card.classList.add('dept-card-pulse');
                    setTimeout(() => card.classList.remove('dept-card-pulse'), 700);
                }, idx * 45);
            });

            // Focus on Choose Your Report panel without entering any individual report
            const mainPanel = document.querySelector('.dept-hub-panel');
            if (mainPanel) {
                mainPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            showToast("Please select any report category from the right panel");
        }

        // Universal Master Report Mapping Dictionary
        const REPORT_TITLE_TO_FILE_MAP = {
            'Production Plan': 'production_plan.html',
            'Monthly RM Demand Vs Received': 'monthly_rm_demand_vs_received.html',
            'Assemble Summary': 'assemble_summary.html',
            'Armature Summary': 'armature_summary.html',
            'FG Summary': 'fg_summary.html',
            'BOM': 'bom.html',
            'BOM (Bill of Materials)': 'bom.html',
            'RM Requirement Summary (BOM)': 'rm_requirement_summary_bom.html',
            'BOM With SFG': 'bom_with_sfg.html',
            'Daily FG Production Entry': 'daily_fg_production_entry.html',
            'Daily Production Received Assemble (All)': 'daily_production_received_assemble.html',
            'Daily Production Received Assemble': 'daily_production_received_assemble.html',
            'Daily Production Plan': 'daily_production_plan.html',
            'Check Floor Stock': 'check_floor_stock.html',
            'Fan Damage Calculation Entry': 'fan_damage_calculation_entry.html',
            'All Section SFG': 'report_all_section_sfg.html',
            'Fan Assemble': 'fan_assemble_erp.html',
            'Fan Assemble (Closing ERP)': 'fan_assemble_erp.html',
            'Armature & Winding': 'armature_winding_erp.html',
            'Armature & Winding (Closing ERP)': 'armature_winding_erp.html',
            'Finish Good (FG)': 'closing_finish_good_fg.html',
            'Finish Good FG (Closing ERP)': 'closing_finish_good_fg.html',
            'Closing All SFG': 'closing_all_sfg.html',
            'Closing All SFG (Closing ERP)': 'closing_all_sfg.html',
            'Store Position Report': 'store_position_report.html',
            'Monthly Production Summary (Physical)': 'monthly_production_summary_physical.html',
            'Monthly Production Summary': 'monthly_production_summary_physical.html',
            'Monthly Damage Summary': 'monthly_damage_summary.html',
            'Yearly Production Summary (Physical)': 'yearly_production_summary_physical.html',
            'Yearly Production Summary (ERP)': 'yearly_production_summary_erp.html',
            'Yearly Damage Summary': 'yearly_damage_summary.html',
            'FG Pending Report': 'fg_pending_report.html',
            'Check FG Need Item': 'check_fg_need_item.html',
            'Check RM (Prd. Possible)': 'check_rm_prd_possible.html',
            'Check RM Prd Possible': 'check_rm_prd_possible.html',
            'Master Database': 'master.html',
            'Master': 'master.html',
            'Central Item Master Database': 'master.html'
        };

        window.navigateToReportPage = function(targetUrl, event) {
            if (event) {
                try { event.preventDefault(); event.stopPropagation(); } catch(e) {}
            }
            if (!targetUrl || targetUrl === '#') {
                showToast("ℹ️ This report is currently undergoing scheduled data maintenance.");
                return;
            }

            const cleanFile = targetUrl.split('/').pop().split('?')[0].toLowerCase();

            // Dynamic Link Redirection (from Show & Edit Link manager)
            let effectiveTarget = targetUrl;
            try {
                if (typeof window.getEffectivePageLink === 'function') {
                    effectiveTarget = window.getEffectivePageLink(cleanFile);
                } else {
                    const raw = localStorage.getItem('portal_page_link_mappings');
                    if (raw) {
                        const mappings = JSON.parse(raw);
                        if (mappings && mappings[cleanFile]) {
                            effectiveTarget = mappings[cleanFile];
                        }
                    }
                }
            } catch(e) {}

            const effectiveClean = effectiveTarget.split('/').pop().split('?')[0].toLowerCase();

            // Permission Check for View-Only User
            if (isCurrentUserViewOnly()) {
                const rawPerms = localStorage.getItem('portal_view_page_permissions');
                if (rawPerms) {
                    try {
                        const perms = JSON.parse(rawPerms);
                        if (perms && (perms[cleanFile] === false || perms[effectiveClean] === false)) {
                            alert("Access Denied: You do not have permission to view this report page.");
                            return;
                        }
                    } catch(e) {}
                }
            }

            // Ensure active session timestamp is updated in sessionStorage
            sessionStorage.setItem(STORAGE_KEYS.isAuthenticated, "true");
            sessionStorage.setItem(STORAGE_KEYS.lastActivity, Date.now().toString());

            window.location.href = effectiveTarget;
        };

        window.handleSubReportClick = function(moduleName, reportTitle, event) {
            if (event) {
                try { event.preventDefault(); event.stopPropagation(); } catch(e) {}
            }
            const normalizedTitle = (reportTitle || '').trim();
            const targetUrl = REPORT_TITLE_TO_FILE_MAP[normalizedTitle];
            if (targetUrl) {
                window.navigateToReportPage(targetUrl, event);
            } else {
                showToast(`ℹ️ "${normalizedTitle}" is currently undergoing scheduled data maintenance.`);
            }
        };

        window.openMasterPage = function(event) {
            if (typeof window.navigateToReportPage === 'function') {
                window.navigateToReportPage('master.html', event);
            } else {
                window.location.href = 'master.html';
            }
        };

        /**
         * Initialize & check session on page load
         * Checks both sessionStorage and localStorage for seamless cross-tab & direct file launch support
         */
        function initSession() {
            // STRICT SECURITY: Only valid active session in sessionStorage is accepted!
            // No persistent localStorage auto-login permitted.
            const isAuth = (sessionStorage.getItem(STORAGE_KEYS.isAuthenticated) === "true");
            const storedRole = (sessionStorage.getItem('portal_auth_role') || '').toUpperCase();
            const sig = sessionStorage.getItem('portal_auth_sig') || '';
            const expectedSig = (storedRole === 'VIEW')
                ? btoa('VIEW:::MEP_SECURE_PORTAL_2026')
                : btoa('ADMIN:::MEP_SECURE_PORTAL_2026');

            if (isAuth && (storedRole === 'ADMIN' || storedRole === 'VIEW') && sig === expectedSig) {
                const isViewOnly = (storedRole === 'VIEW') || (sessionStorage.getItem('portal_view_only') === 'true');
                sessionStorage.setItem('portal_auth_role', storedRole);
                sessionStorage.setItem('portal_view_only', isViewOnly ? "true" : "false");
                sessionStorage.setItem('portal_auth_sig', sig);
                sessionStorage.setItem(STORAGE_KEYS.lastActivity, Date.now().toString());

                const urlParams = new URLSearchParams(window.location.search);
                const viewParam = urlParams.get('view');
                const currentView = sessionStorage.getItem('portal_current_view');
                const targetMod = urlParams.get('mod') || sessionStorage.getItem('portal_hub_module');

                if (viewParam === 'main' || viewParam === 'production') {
                    sessionStorage.setItem('portal_current_view', 'main');
                    switchToMainInterfaceView();
                } else if (viewParam === 'dashboard') {
                    sessionStorage.setItem('portal_current_view', 'main');
                    switchToMainInterfaceView();
                } else if (viewParam === 'hub') {
                    sessionStorage.setItem('portal_current_view', 'hub');
                    switchToDepartmentHub(targetMod);
                } else if (viewParam === 'modules') {
                    sessionStorage.setItem('portal_current_view', 'modules');
                    switchToModuleSelectionView();
                } else if (viewParam === 'mis') {
                    if (typeof isMISPinVerified === 'function' && isMISPinVerified()) {
                        sessionStorage.setItem('portal_current_view', 'mis');
                        switchToMISSelectionView();
                    } else {
                        sessionStorage.setItem('portal_current_view', 'modules');
                        switchToModuleSelectionView();
                        if (typeof openMISPinSecurityModal === 'function') {
                            openMISPinSecurityModal();
                        }
                    }
                } else if (viewParam === 'hrm') {
                    sessionStorage.setItem('portal_current_view', 'hrm');
                    const sub = urlParams.get('sub') || (urlParams.get('page') === 'new_entry' ? 'new_entry' : 'dashboard');
                    switchToHRMModuleView(sub);
                } else if (currentView === 'main') {
                    switchToMainInterfaceView();
                } else if (currentView === 'hub') {
                    switchToDepartmentHub(targetMod);
                } else if (currentView === 'modules') {
                    switchToModuleSelectionView();
                } else if (currentView === 'mis') {
                    if (typeof isMISPinVerified === 'function' && isMISPinVerified()) {
                        switchToMISSelectionView();
                    } else {
                        sessionStorage.setItem('portal_current_view', 'modules');
                        switchToModuleSelectionView();
                        if (typeof openMISPinSecurityModal === 'function') {
                            openMISPinSecurityModal();
                        }
                    }
                } else if (currentView === 'hrm') {
                    switchToHRMModuleView();
                } else {
                    // Default view upon successful entry is the 5-Module Selection Screen!
                    switchToModuleSelectionView();
                }
                applyViewOnlyStateUI();
            } else {
                // Not authenticated: clear any partial or expired session and display Lock Screen
                sessionStorage.removeItem(STORAGE_KEYS.isAuthenticated);
                sessionStorage.removeItem('portal_auth_role');
                sessionStorage.removeItem('portal_view_only');
                sessionStorage.removeItem('portal_auth_sig');
                showLoginView();
            }
            initNotificationState();
        }

        /**
         * Switch UI to Dashboard
         */
        function showDashboardView() {
            var loginView = document.getElementById('loginView');
            var hubView = document.getElementById('departmentHubView');
            var dashView = document.getElementById('dashboardView');
            var mainView = document.getElementById('mainInterfaceView');
            var moduleView = document.getElementById('moduleSelectionView');
            var hrmView = document.getElementById('hrmModuleView');
            var misView = document.getElementById('misSelectionView');
            if (hrmView) hrmView.style.setProperty('display', 'none', 'important');
            if (misView) misView.style.setProperty('display', 'none', 'important');

            if (loginView) loginView.style.setProperty('display', 'none', 'important');
            if (hubView) hubView.style.setProperty('display', 'none', 'important');
            if (dashView) dashView.style.setProperty('display', 'flex', 'important');
            if (mainView) mainView.style.setProperty('display', 'none', 'important');
            if (moduleView) moduleView.style.setProperty('display', 'none', 'important');
        }

        function showLoginView() {
            var dashView = document.getElementById('dashboardView');
            var hubView = document.getElementById('departmentHubView');
            var mainView = document.getElementById('mainInterfaceView');
            var moduleView = document.getElementById('moduleSelectionView');
            var hrmView = document.getElementById('hrmModuleView');
            var misView = document.getElementById('misSelectionView');
            if (hrmView) hrmView.style.setProperty('display', 'none', 'important');
            if (misView) misView.style.setProperty('display', 'none', 'important');
            var loginView = document.getElementById('loginView');

            if (dashView) dashView.style.setProperty('display', 'none', 'important');
            if (hubView) hubView.style.setProperty('display', 'none', 'important');
            if (mainView) mainView.style.setProperty('display', 'none', 'important');
            if (moduleView) moduleView.style.setProperty('display', 'none', 'important');
            if (loginView) loginView.style.setProperty('display', 'flex', 'important');

            // Default to ADMIN role
            if (typeof selectRole === 'function') {
                selectRole('ADMIN');
            } else {
                const usernameInput = document.getElementById('username');
                if (usernameInput) usernameInput.value = 'ADMIN';
            }

            const passwordInput = document.getElementById('password');
            if (passwordInput) {
                passwordInput.value = '';
                passwordInput.classList.remove('input-error');
                setTimeout(() => passwordInput.focus(), 120);
            }

            const errorBox = document.getElementById('loginError');
            if (errorBox) errorBox.classList.remove('show');
        }

        function updateNavState(activeView) {
            const isMain = (activeView === 'main');
            const isHub = (activeView === 'hub');
            const isDash = (activeView === 'dashboard');
            const isModules = (activeView === 'modules');

            document.querySelectorAll('.btn-nav-main, .btn-rail-main, .mep-btn-main, .mep-btn-3d-dash').forEach(el => {
                if (isMain) el.classList.add('active');
                else el.classList.remove('active');
            });
            document.querySelectorAll('.btn-nav-home, .btn-rail-home, .mep-btn-menu').forEach(el => {
                if (isHub) el.classList.add('active');
                else el.classList.remove('active');
            });
            document.querySelectorAll('.btn-nav-dash, .btn-rail-dash').forEach(el => {
                if (isDash) el.classList.add('active');
                else el.classList.remove('active');
            });
            document.querySelectorAll('.btn-nav-modules, .mep-btn-portal, .mep-btn-3d-mod').forEach(el => {
                if (isModules) el.classList.add('active');
                else el.classList.remove('active');
            });
        }

        function switchToMainInterfaceView() {
            resetInactivityTimer();
            sessionStorage.setItem('portal_current_view', 'main');
            sessionStorage.removeItem('portal_hub_module');
            var loginView = document.getElementById('loginView');
            var hubView = document.getElementById('departmentHubView');
            var dashView = document.getElementById('dashboardView');
            var mainView = document.getElementById('mainInterfaceView');
            var moduleView = document.getElementById('moduleSelectionView');
            var hrmView = document.getElementById('hrmModuleView');
            var misView = document.getElementById('misSelectionView');
            if (hrmView) hrmView.style.setProperty('display', 'none', 'important');
            if (misView) misView.style.setProperty('display', 'none', 'important');

            if (loginView) loginView.style.setProperty('display', 'none', 'important');
            if (hubView) hubView.style.setProperty('display', 'none', 'important');
            if (dashView) dashView.style.setProperty('display', 'none', 'important');
            if (mainView) mainView.style.setProperty('display', 'flex', 'important');
            if (moduleView) moduleView.style.setProperty('display', 'none', 'important');

            updateNavState('main');

            if (typeof renderProductionPerformanceDashboard === 'function') {
                renderProductionPerformanceDashboard();
            }

            applyViewOnlyStateUI();

            if (window.location.search) {
                try {
                    window.history.replaceState(null, '', window.location.pathname);
                } catch(e) {}
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function switchToDashboardView() {
            window.location.href = 'fg_pending_report.html';
        }

        function switchToDepartmentHub(targetModuleId) {
            resetInactivityTimer();
            sessionStorage.setItem('portal_current_view', 'hub');
            var loginView = document.getElementById('loginView');
            var dashView = document.getElementById('dashboardView');
            var mainView = document.getElementById('mainInterfaceView');
            var hubView = document.getElementById('departmentHubView');
            var moduleView = document.getElementById('moduleSelectionView');
            var misView = document.getElementById('misSelectionView');
            var hrmView = document.getElementById('hrmModuleView');
            if (hrmView) hrmView.style.setProperty('display', 'none', 'important');
            if (misView) misView.style.setProperty('display', 'none', 'important');

            if (loginView) loginView.style.setProperty('display', 'none', 'important');
            if (dashView) dashView.style.setProperty('display', 'none', 'important');
            if (mainView) mainView.style.setProperty('display', 'none', 'important');
            if (hubView) hubView.style.setProperty('display', 'flex', 'important');
            if (moduleView) moduleView.style.setProperty('display', 'none', 'important');

            updateNavState('hub');
            applyViewOnlyStateUI();

            if (targetModuleId) {
                selectDepartmentModule(targetModuleId);
            } else {
                sessionStorage.removeItem('portal_hub_module');
                document.querySelectorAll('.dept-card-btn').forEach(function(card) {
                    card.classList.remove('active-dept');
                });
                var emptyState = document.getElementById('hubEmptyState');
                var container = document.getElementById('hubActiveModuleContainer');
                if (emptyState) {
                    emptyState.classList.remove('is-hidden');
                    emptyState.style.setProperty('display', 'flex', 'important');
                }
                if (container) {
                    container.classList.add('is-hidden');
                    container.style.setProperty('display', 'none', 'important');
                    container.innerHTML = '';
                }
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        /**
         * Switch UI to 5-Module Department Selection Screen (Default Gateway View)
         */
        function switchToModuleSelectionView() {
            resetInactivityTimer();
            sessionStorage.setItem('portal_current_view', 'modules');
            sessionStorage.removeItem('portal_hub_module');
            sessionStorage.removeItem('mis_pin_verified');

            var loginView = document.getElementById('loginView');
            var hubView = document.getElementById('departmentHubView');
            var dashView = document.getElementById('dashboardView');
            var mainView = document.getElementById('mainInterfaceView');
            var moduleView = document.getElementById('moduleSelectionView');
            var hrmView = document.getElementById('hrmModuleView');
            var misView = document.getElementById('misSelectionView');
            if (hrmView) hrmView.style.setProperty('display', 'none', 'important');
            if (misView) misView.style.setProperty('display', 'none', 'important');

            if (loginView) loginView.style.setProperty('display', 'none', 'important');
            if (hubView) hubView.style.setProperty('display', 'none', 'important');
            if (dashView) dashView.style.setProperty('display', 'none', 'important');
            if (mainView) mainView.style.setProperty('display', 'none', 'important');
            if (moduleView) moduleView.style.setProperty('display', 'flex', 'important');

            updateNavState('modules');
            applyViewOnlyStateUI();
            updateModuleHeaderState();

            if (window.location.search && !window.location.search.includes('view=modules')) {
                try {
                    window.history.replaceState(null, '', window.location.pathname);
                } catch(e) {}
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        /**
         * Switch UI to Premium MIS Option Selection Screen (Select Your Option)
         */
        function switchToMISSelectionView() {
            if (typeof isMISPinVerified === 'function' && !isMISPinVerified()) {
                if (typeof openMISPinSecurityModal === 'function') {
                    openMISPinSecurityModal();
                }
                return;
            }
            resetInactivityTimer();
            sessionStorage.setItem('portal_current_view', 'mis');
            sessionStorage.removeItem('portal_hub_module');

            var loginView = document.getElementById('loginView');
            var hubView = document.getElementById('departmentHubView');
            var dashView = document.getElementById('dashboardView');
            var mainView = document.getElementById('mainInterfaceView');
            var moduleView = document.getElementById('moduleSelectionView');
            var hrmView = document.getElementById('hrmModuleView');
            var misView = document.getElementById('misSelectionView');

            if (loginView) loginView.style.setProperty('display', 'none', 'important');
            if (hubView) hubView.style.setProperty('display', 'none', 'important');
            if (dashView) dashView.style.setProperty('display', 'none', 'important');
            if (mainView) mainView.style.setProperty('display', 'none', 'important');
            if (moduleView) moduleView.style.setProperty('display', 'none', 'important');
            if (hrmView) hrmView.style.setProperty('display', 'none', 'important');
            if (misView) misView.style.setProperty('display', 'flex', 'important');

            updateNavState('mis');
            applyViewOnlyStateUI();
            updateModuleHeaderState();

            if (window.location.search && !window.location.search.includes('view=mis')) {
                try {
                    window.history.replaceState(null, '', window.location.pathname + '?view=mis');
                } catch(e) {}
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        /**
         * Production Module Click Handler -> Opens the complete rearranged Dashboard
         */
        function switchToProductionModule(event) {
            if (event) {
                try { event.preventDefault(); event.stopPropagation(); } catch(e) {}
            }
            switchToMainInterfaceView();
        }

        function openModuleNotice(moduleName, moduleDesc) {
            // Toast alert removed per user requirement
        }

        function openModuleWarehouseAction(event) {
            if (event) {
                try { event.preventDefault(); event.stopPropagation(); } catch(e) {}
            }
            switchToDepartmentHub('mod-01');
        }

        function switchToHRMModuleView(subPage) {
            resetInactivityTimer();
            sessionStorage.setItem('portal_current_view', 'hrm');
            sessionStorage.removeItem('portal_hub_module');
            var loginView = document.getElementById('loginView');
            var hubView = document.getElementById('departmentHubView');
            var dashView = document.getElementById('dashboardView');
            var mainView = document.getElementById('mainInterfaceView');
            var moduleView = document.getElementById('moduleSelectionView');
            var hrmView = document.getElementById('hrmModuleView');
            var misView = document.getElementById('misSelectionView');

            if (loginView) loginView.style.setProperty('display', 'none', 'important');
            if (hubView) hubView.style.setProperty('display', 'none', 'important');
            if (dashView) dashView.style.setProperty('display', 'none', 'important');
            if (mainView) mainView.style.setProperty('display', 'none', 'important');
            if (moduleView) moduleView.style.setProperty('display', 'none', 'important');
            if (misView) misView.style.setProperty('display', 'none', 'important');
            if (hrmView) hrmView.style.setProperty('display', 'flex', 'important');

            updateNavState('hrm');
            applyViewOnlyStateUI();

            if (window.HRM_ENGINE) {
                window.HRM_ENGINE.switchPage(subPage || 'dashboard');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function openModuleHRMAction(event) {
            if (event) {
                try { event.preventDefault(); event.stopPropagation(); } catch(e) {}
            }
            switchToHRMModuleView();
        }

        function toggleModuleProfileDropdown(event) {
            if (event) {
                try { event.stopPropagation(); } catch(e) {}
            }
            if (typeof resetInactivityTimer === 'function') resetInactivityTimer();
            if (typeof updateServiceDuration === 'function') updateServiceDuration();

            const menu = document.getElementById('moduleProfileDropdownMenu');
            const btn = document.getElementById('moduleUserProfileBtn');
            if (!menu) return;

            const isShown = menu.classList.contains('show');
            if (typeof closeProfileDropdown === 'function') {
                closeProfileDropdown();
            } else {
                document.querySelectorAll('.profile-dropdown-menu').forEach(function(m) {
                    m.classList.remove('show');
                });
            }

            if (!isShown) {
                menu.classList.add('show');
                if (btn) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                }
            }
        }

        function closeModuleProfileDropdown(event) {
            if (event) {
                try { event.stopPropagation(); } catch(e) {}
            }
            const menu = document.getElementById('moduleProfileDropdownMenu');
            const btn = document.getElementById('moduleUserProfileBtn');
            if (menu) menu.classList.remove('show');
            if (btn) {
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            }
        }

        function openModuleUserAction(event) {
            if (event) {
                try { event.preventDefault(); event.stopPropagation(); } catch(e) {}
            }
            toggleModuleProfileDropdown(event);
        }

        // =========================================================================
        // MIS MODULE — 5-Digit Enterprise Security PIN Verification Controller
        // PIN: 96420 (Pure keyboard / zero click auto-verification on 5th digit)
        // =========================================================================
        const MIS_SECURITY_PIN = "96420";

        function isMISPinVerified() {
            return sessionStorage.getItem('mis_pin_verified') === 'true';
        }

        function openMISPinSecurityModal() {
            const modal = document.getElementById('misPinSecurityModal');
            if (!modal) return;
            modal.style.display = 'flex';
            clearMISPinInputs();
            resetMISPinStatus();
            setTimeout(function() {
                const first = document.getElementById('misPin0');
                if (first) {
                    first.focus();
                    first.select();
                }
            }, 60);
        }

        function closeMISPinSecurityModal() {
            const modal = document.getElementById('misPinSecurityModal');
            if (modal) {
                modal.style.display = 'none';
            }
            clearMISPinInputs();
            resetMISPinStatus();
        }

        function clearMISPinInputs() {
            for (let i = 0; i < 5; i++) {
                const inp = document.getElementById('misPin' + i);
                if (inp) {
                    inp.value = '';
                    inp.disabled = false;
                    inp.classList.remove('is-filled', 'is-error', 'is-success');
                }
            }
            const container = document.getElementById('misPinInputsContainer');
            if (container) {
                container.classList.remove('error-shake');
            }
        }

        function resetMISPinStatus() {
            const msg = document.getElementById('misPinStatusMsg');
            if (msg) {
                msg.textContent = '';
                msg.className = 'mis-pin-status-msg';
            }
        }

        function checkMISPinComplete() {
            let pin = '';
            for (let i = 0; i < 5; i++) {
                const inp = document.getElementById('misPin' + i);
                if (!inp || !inp.value) return false;
                pin += inp.value;
            }

            if (pin.length === 5) {
                verifyMISPin(pin);
                return true;
            }
            return false;
        }

        function verifyMISPin(pin) {
            const container = document.getElementById('misPinInputsContainer');
            const statusMsg = document.getElementById('misPinStatusMsg');
            const inputs = document.querySelectorAll('.mis-pin-digit');

            if (pin === MIS_SECURITY_PIN) {
                // Correct PIN (96420)
                inputs.forEach(function(inp) {
                    inp.classList.remove('is-error');
                    inp.classList.add('is-success');
                    inp.disabled = true;
                });

                if (statusMsg) {
                    statusMsg.textContent = '✓ Access Authorized — Unlocking MIS Module...';
                    statusMsg.className = 'mis-pin-status-msg is-success';
                }

                sessionStorage.setItem('mis_pin_verified', 'true');

                if (typeof window.logSystemAudit === 'function') {
                    try {
                        window.logSystemAudit({
                            pageName: 'MIS Module Selection Screen',
                            actionType: 'Security Gate Passed',
                            targetItem: 'MIS Module Access Gate',
                            fieldName: '5-Digit Security PIN',
                            previousValue: 'Protected Gate',
                            newValue: 'Access Granted',
                            description: '5-Digit Security PIN (96420) successfully verified. MIS Interface unlocked.'
                        });
                    } catch(err) {}
                }

                setTimeout(function() {
                    closeMISPinSecurityModal();
                    switchToMISSelectionView();
                }, 260);

            } else {
                // Incorrect PIN
                inputs.forEach(function(inp) {
                    inp.classList.remove('is-success');
                    inp.classList.add('is-error');
                });

                if (container) {
                    container.classList.remove('error-shake');
                    void container.offsetWidth;
                    container.classList.add('error-shake');
                }

                if (statusMsg) {
                    statusMsg.textContent = '✕ Incorrect Security PIN. Please try again.';
                    statusMsg.className = 'mis-pin-status-msg is-error';
                }

                setTimeout(function() {
                    clearMISPinInputs();
                    const first = document.getElementById('misPin0');
                    if (first) {
                        first.focus();
                    }
                }, 450);
            }
        }

        function setupMISPinListeners() {
            const inputs = document.querySelectorAll('.mis-pin-digit');
            if (!inputs.length) return;

            inputs.forEach(function(input) {
                const index = parseInt(input.dataset.index, 10);

                input.addEventListener('input', function(e) {
                    const raw = this.value;
                    const digit = raw.replace(/\D/g, '').slice(-1);
                    this.value = digit;

                    if (digit) {
                        this.classList.add('is-filled');
                        if (index < 4) {
                            const next = document.getElementById('misPin' + (index + 1));
                            if (next) {
                                next.focus();
                                next.select();
                            }
                        }
                    } else {
                        this.classList.remove('is-filled');
                    }

                    checkMISPinComplete();
                });

                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace') {
                        if (!this.value && index > 0) {
                            e.preventDefault();
                            const prev = document.getElementById('misPin' + (index - 1));
                            if (prev) {
                                prev.value = '';
                                prev.classList.remove('is-filled', 'is-error', 'is-success');
                                prev.focus();
                            }
                        } else if (this.value) {
                            this.value = '';
                            this.classList.remove('is-filled');
                            e.preventDefault();
                        }
                    } else if (e.key === 'ArrowLeft' && index > 0) {
                        const prev = document.getElementById('misPin' + (index - 1));
                        if (prev) prev.focus();
                    } else if (e.key === 'ArrowRight' && index < 4) {
                        const next = document.getElementById('misPin' + (index + 1));
                        if (next) next.focus();
                    } else if (e.key === 'Escape') {
                        closeMISPinSecurityModal();
                    }
                });

                input.addEventListener('paste', function(e) {
                    e.preventDefault();
                    const clipboardData = e.clipboardData || window.clipboardData;
                    if (!clipboardData) return;
                    const pastedText = clipboardData.getData('text') || '';
                    const digits = pastedText.replace(/\D/g, '').slice(0, 5);
                    if (!digits) return;

                    clearMISPinInputs();
                    for (let i = 0; i < digits.length; i++) {
                        const inp = document.getElementById('misPin' + i);
                        if (inp) {
                            inp.value = digits[i];
                            inp.classList.add('is-filled');
                        }
                    }

                    if (digits.length < 5) {
                        const next = document.getElementById('misPin' + digits.length);
                        if (next) next.focus();
                    } else {
                        checkMISPinComplete();
                    }
                });
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupMISPinListeners);
        } else {
            setupMISPinListeners();
        }

        function openModuleMISAction(event) {
            if (event) {
                try { event.preventDefault(); event.stopPropagation(); } catch(e) {}
            }
            if (isMISPinVerified()) {
                switchToMISSelectionView();
            } else {
                openMISPinSecurityModal();
            }
        }

        function toggleMISProfileDropdown(event) {
            if (event) {
                try { event.stopPropagation(); } catch(e) {}
            }
            const menu = document.getElementById('misProfileDropdownMenu');
            const btn = document.getElementById('misUserProfileBtn');
            if (!menu || !btn) return;
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isExpanded);
            btn.classList.toggle('active', !isExpanded);
            menu.classList.toggle('show', !isExpanded);
        }

        function closeMISProfileDropdown(event) {
            if (event) {
                try { event.stopPropagation(); } catch(e) {}
            }
            const menu = document.getElementById('misProfileDropdownMenu');
            const btn = document.getElementById('misUserProfileBtn');
            if (menu) menu.classList.remove('show');
            if (btn) {
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            }
        }

        function updateModuleHeaderState() {
            const role = (sessionStorage.getItem('portal_auth_role') || 'ADMIN').toUpperCase();
            const isViewOnly = isCurrentUserViewOnly();
            const nameEl = document.getElementById('moduleProfileName');
            const roleEl = document.getElementById('moduleProfileRole');
            const dropTitle = document.getElementById('moduleProfileDropdownTitle');
            const dropRole = document.getElementById('moduleProfileDropdownRole');
            const dropId = document.getElementById('moduleProfileDropdownId');

            const misNameEl = document.getElementById('misProfileName');
            const misRoleEl = document.getElementById('misProfileRole');
            const misDropTitle = document.getElementById('misProfileDropdownTitle');
            const misDropRole = document.getElementById('misProfileDropdownRole');
            const misDropId = document.getElementById('misProfileDropdownId');

            if (isViewOnly || role === 'VIEW') {
                if (nameEl) nameEl.textContent = "View User";
                if (roleEl) roleEl.textContent = "Restricted Access";
                if (dropTitle) dropTitle.textContent = "View User";
                if (dropRole) dropRole.textContent = "Restricted Access";
                if (dropId) dropId.textContent = "VIEW-01";

                if (misNameEl) misNameEl.textContent = "View User";
                if (misRoleEl) misRoleEl.textContent = "Restricted Access";
                if (misDropTitle) misDropTitle.textContent = "View User";
                if (misDropRole) misDropRole.textContent = "Restricted Access";
                if (misDropId) misDropId.textContent = "VIEW-01";
            } else {
                if (nameEl) nameEl.textContent = "Sayful Islam";
                if (roleEl) roleEl.textContent = "Senior Supervisor";
                if (dropTitle) dropTitle.textContent = "Sayful Islam";
                if (dropRole) dropRole.textContent = "Senior Supervisor";
                if (dropId) dropId.textContent = "10676";

                if (misNameEl) misNameEl.textContent = "Sayful Islam";
                if (misRoleEl) misRoleEl.textContent = "Senior Supervisor";
                if (misDropTitle) misDropTitle.textContent = "Sayful Islam";
                if (misDropRole) misDropRole.textContent = "Senior Supervisor";
                if (misDropId) misDropId.textContent = "10676";
            }
        }

        function initNotificationState() {
            const isRead = localStorage.getItem('mep_notif_read_v1') === 'true';
            document.querySelectorAll('.notif-badge-dot').forEach(el => {
                el.style.display = isRead ? 'none' : 'block';
            });
        }

        function toggleNotificationPanel() {
            const panel = document.getElementById('notificationPanel');
            if (!panel) return;
            const isActive = panel.classList.contains('active');
            if (isActive) {
                panel.classList.remove('active');
            } else {
                panel.classList.add('active');
                localStorage.setItem('mep_notif_read_v1', 'true');
                document.querySelectorAll('.notif-badge-dot').forEach(el => {
                    el.style.display = 'none';
                });
            }
        }

        function closeNotificationPanel() {
            const panel = document.getElementById('notificationPanel');
            if (panel) panel.classList.remove('active');
        }

        /**
         * Toggle Password Visibility (Show / Hide)
         */
        function togglePasswordVisibility() {
            const pwdInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eyeIcon');
            const eyeOffIcon = document.getElementById('eyeOffIcon');

            if (!pwdInput) return;
            if (pwdInput.type === 'password') {
                pwdInput.type = 'text';
                if (eyeIcon) eyeIcon.style.display = 'none';
                if (eyeOffIcon) eyeOffIcon.style.display = 'block';
            } else {
                pwdInput.type = 'password';
                if (eyeIcon) eyeIcon.style.display = 'block';
                if (eyeOffIcon) eyeOffIcon.style.display = 'none';
            }
        }

        /**
         * Toggle Username / Role Dropdown Menu
         */
        function toggleRoleDropdown(forceClose = false) {
            const menu = document.getElementById('roleDropdownMenu');
            const btn = document.getElementById('roleSelectorBtn');
            if (!menu || !btn) return;

            const isOpen = forceClose ? false : !menu.classList.contains('show');
            if (isOpen) {
                menu.classList.add('show');
                btn.setAttribute('aria-expanded', 'true');
            } else {
                menu.classList.remove('show');
                btn.setAttribute('aria-expanded', 'false');
            }
        }

        // Close dropdown when user clicks outside
        document.addEventListener('click', function(e) {
            const dropdown = document.getElementById('userRoleDropdown');
            if (dropdown && !dropdown.contains(e.target)) {
                toggleRoleDropdown(true);
            }
        });

        /**
         * Select User Role (ADMIN vs View)
         */
        function selectRole(role) {
            const usernameInput = document.getElementById('username');
            const roleNameEl = document.getElementById('activeRoleName');
            const roleTagEl = document.getElementById('activeRoleTag');
            const roleIconBox = document.getElementById('activeRoleIcon');
            const itemAdmin = document.getElementById('roleItemAdmin');
            const itemView = document.getElementById('roleItemView');
            const checkAdmin = document.getElementById('checkAdmin');
            const checkView = document.getElementById('checkView');
            const pwdRoleHint = document.getElementById('pwdRoleHint');
            const pwdInput = document.getElementById('password');

            if (usernameInput) usernameInput.value = role;

            if (role === 'View') {
                if (roleNameEl) roleNameEl.textContent = 'View';
                if (roleTagEl) roleTagEl.textContent = 'Visitor / View Only (Read-Only Portal)';
                if (roleIconBox) {
                    roleIconBox.className = 'role-icon-box view-mode';
                    roleIconBox.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
                }
                if (itemAdmin) itemAdmin.classList.remove('active');
                if (itemView) itemView.classList.add('active');
                if (checkAdmin) checkAdmin.style.display = 'none';
                if (checkView) checkView.style.display = 'inline';
                if (pwdRoleHint) pwdRoleHint.textContent = 'View PIN';
            } else {
                // ADMIN
                if (roleNameEl) roleNameEl.textContent = 'ADMIN';
                if (roleTagEl) roleTagEl.textContent = 'System Administrator (Full Edit Access)';
                if (roleIconBox) {
                    roleIconBox.className = 'role-icon-box';
                    roleIconBox.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
                }
                if (itemAdmin) itemAdmin.classList.add('active');
                if (itemView) itemView.classList.remove('active');
                if (checkAdmin) checkAdmin.style.display = 'inline';
                if (checkView) checkView.style.display = 'none';
                if (pwdRoleHint) pwdRoleHint.textContent = 'Admin PIN';
            }

            toggleRoleDropdown(true);

            // Clear password and focus
            if (pwdInput) {
                pwdInput.value = '';
                pwdInput.classList.remove('input-error');
                setTimeout(() => pwdInput.focus(), 80);
            }

            const errorBox = document.getElementById('loginError');
            if (errorBox) errorBox.classList.remove('show');
        }

        /**
         * Handle Login Submission
         */
        function handleLogin(event) {
            if (event) event.preventDefault();

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const errorBox = document.getElementById('loginError');
            const errorMsg = document.getElementById('loginErrorMsg');
            const loginCard = document.querySelector('.auth-split-card') || document.getElementById('loginView');

            const selectedRole = usernameInput ? usernameInput.value.trim() : 'ADMIN';
            const enteredPass = passwordInput ? passwordInput.value.trim() : '';

            // Password strictly required: no empty logins permitted
            if (!enteredPass) {
                if (errorBox) errorBox.classList.add('show');
                if (errorMsg) errorMsg.textContent = 'Please enter password to login!';
                if (passwordInput) {
                    passwordInput.classList.add('input-error');
                    passwordInput.focus();
                }
                if (loginCard) {
                    loginCard.classList.remove('shake-effect');
                    void loginCard.offsetWidth;
                    loginCard.classList.add('shake-effect');
                }
                return;
            }

            let isValid = false;
            let isViewOnly = false;

            if (selectedRole === 'ADMIN') {
                if (enteredPass === AUTH_CONFIG.adminPassword || enteredPass === '9642') {
                    isValid = true;
                    isViewOnly = false;
                }
            } else if (selectedRole === 'View') {
                if (enteredPass === AUTH_CONFIG.viewPassword || enteredPass === '1234') {
                    isValid = true;
                    isViewOnly = true;
                }
            } else {
                // Fallback username check
                if (enteredPass === '9642') {
                    isValid = true;
                    isViewOnly = false;
                } else if (enteredPass === '1234') {
                    isValid = true;
                    isViewOnly = true;
                }
            }

            if (isValid) {
                const role = isViewOnly ? 'VIEW' : 'ADMIN';
                const sessionSig = btoa(role + ':::MEP_SECURE_PORTAL_2026');
                // Active session lives strictly in sessionStorage for true session lifecycle
                sessionStorage.setItem(STORAGE_KEYS.isAuthenticated, "true");
                sessionStorage.setItem('portal_auth_role', role);
                sessionStorage.setItem('portal_view_only', isViewOnly ? "true" : "false");
                sessionStorage.setItem('portal_auth_sig', sessionSig);
                sessionStorage.setItem(STORAGE_KEYS.lastActivity, Date.now().toString());

                // Remove any old permanent flags from localStorage to avoid persistent bypass
                localStorage.removeItem(STORAGE_KEYS.isAuthenticated);
                localStorage.removeItem('portal_auth_role');
                localStorage.removeItem('portal_view_only');
                localStorage.removeItem('portal_auth_sig');

                if (errorBox) errorBox.classList.remove('show');
                if (passwordInput) {
                    passwordInput.classList.remove('input-error');
                    passwordInput.value = '';
                }

                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('view') === 'main' || urlParams.get('view') === 'production') {
                    switchToMainInterfaceView();
                } else if (urlParams.get('view') === 'hub') {
                    switchToDepartmentHub();
                } else if (urlParams.get('view') === 'dashboard') {
                    switchToDashboardView();
                } else {
                    // NEW FLOW: Successful login routes to the 5-Module Department Selection Screen!
                    switchToModuleSelectionView();
                }
                applyViewOnlyStateUI();
            } else {
                // Invalid credentials
                if (errorBox) errorBox.classList.add('show');
                if (errorMsg) {
                    errorMsg.textContent = selectedRole === 'ADMIN' 
                        ? 'Invalid ADMIN Password! Please try again.' 
                        : 'Invalid View Password! Please try again.';
                }
                if (passwordInput) {
                    passwordInput.classList.add('input-error');
                    passwordInput.value = '';
                    passwordInput.focus();
                }

                if (loginCard) {
                    loginCard.classList.remove('shake-effect');
                    void loginCard.offsetWidth;
                    loginCard.classList.add('shake-effect');
                }
            }
        }

        /**
         * Handle View-Only Access (Visitor / Guest Mode)
         */
        function handleViewOnlyAccess() {
            selectRole('View');
            const pwdInput = document.getElementById('password');
            if (pwdInput) pwdInput.focus();
        }

        function isCurrentUserViewOnly() {
            try {
                const sig = sessionStorage.getItem('portal_auth_sig') || '';
                if (sig === btoa('VIEW:::MEP_SECURE_PORTAL_2026')) return true;
                if (sig === btoa('ADMIN:::MEP_SECURE_PORTAL_2026')) return false;
                const isView = (sessionStorage.getItem('portal_view_only') === 'true');
                const role = (sessionStorage.getItem('portal_auth_role') || '').toUpperCase();
                const localRole = (localStorage.getItem('portal_auth_role') || '').toUpperCase();
                return isView || role === 'VIEW' || localRole === 'VIEW';
            } catch(e) {
                return false;
            }
        }

        function applyViewOnlyStateUI() {
            const isViewOnly = isCurrentUserViewOnly();
            document.querySelectorAll('.smart-view-only-badge').forEach(el => {
                el.style.setProperty('display', isViewOnly ? 'inline-flex' : 'none', 'important');
            });
            if (isViewOnly) {
                document.body.classList.add('portal-view-only');
                document.documentElement.classList.add('portal-view-only');
                const rawPerms = localStorage.getItem('portal_view_page_permissions');
                if (rawPerms) {
                    try {
                        const perms = JSON.parse(rawPerms);
                        document.querySelectorAll('a[href]').forEach(a => {
                            const href = a.getAttribute('href') || '';
                            const file = href.split('/').pop().split('?')[0].toLowerCase();
                            if (file.endsWith('.html') && perms[file] === false) {
                                a.style.display = 'none';
                            }
                        });
                        document.querySelectorAll('.dept-card-btn, .quick-card-btn, .portal-nav-card').forEach(card => {
                            const link = (card.getAttribute('onclick') || '').toLowerCase();
                            ALL_PORTAL_PAGES.forEach(p => {
                                if (perms[p.file] === false && link.includes(p.file.toLowerCase())) {
                                    card.style.display = 'none';
                                }
                            });
                        });
                        document.querySelectorAll('.sub-report-item').forEach(item => {
                            const onclickStr = (item.getAttribute('onclick') || '').toLowerCase();
                            const hrefStr = (item.getAttribute('href') || '').toLowerCase();
                            ALL_PORTAL_PAGES.forEach(p => {
                                const target = p.file.toLowerCase();
                                if (perms[p.file] === false && (onclickStr.includes(target) || hrefStr.includes(target))) {
                                    item.style.display = 'none';
                                }
                            });
                        });
                    } catch(e) {}
                }
            } else {
                document.body.classList.remove('portal-view-only');
                document.documentElement.classList.remove('portal-view-only');
                document.querySelectorAll('a[href], .dept-card-btn, .quick-card-btn, .portal-nav-card, .sub-report-item').forEach(a => {
                    a.style.display = '';
                });
            }
        }

        /**
         * Terminate Active Session
         */
        function handleLogout() {
            sessionStorage.removeItem(STORAGE_KEYS.isAuthenticated);
            sessionStorage.removeItem(STORAGE_KEYS.lastActivity);
            sessionStorage.removeItem('portal_view_only');
            sessionStorage.removeItem('portal_auth_role');
            sessionStorage.removeItem('portal_auth_sig');
            sessionStorage.removeItem('portal_current_view');
            sessionStorage.removeItem('portal_hub_module');
            sessionStorage.removeItem('mis_pin_verified');

            localStorage.removeItem(STORAGE_KEYS.isAuthenticated);
            localStorage.removeItem(STORAGE_KEYS.lastActivity);
            localStorage.removeItem('portal_view_only');
            localStorage.removeItem('portal_auth_role');
            localStorage.removeItem('portal_auth_sig');
            localStorage.removeItem('portal_current_view');
            localStorage.removeItem('portal_hub_module');
            localStorage.removeItem('mis_pin_verified');

            // Broadcast logout event across all open tabs immediately
            localStorage.setItem('portal_logout_broadcast', Date.now().toString());

            // Ensure any active notification toast is completely hidden
            const toast = document.getElementById('notification-toast');
            if (toast) toast.classList.remove('show');

            showLoginView();
        }

        /**
         * Reset user inactivity timer on activity
         */
        function resetInactivityTimer() {
            if (sessionStorage.getItem(STORAGE_KEYS.isAuthenticated) === "true") {
                sessionStorage.setItem(STORAGE_KEYS.lastActivity, Date.now().toString());
            }
        }

        /**
         * Show bottom notification toast message
         */
        function showToast(message) {
            const toast = document.getElementById('notification-toast');
            const toastMsg = document.getElementById('toast-message');
            if (!toast || !toastMsg) return;

            toastMsg.innerText = message;
            toast.classList.add('show');

            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }

        // =========================================================================
        // Anti-Tamper DevTools Security Guard:
        // Automatically prevents unhiding internal views if not authenticated
        // =========================================================================
        function setupAntiTamperGuard() {
            var targets = ['mainInterfaceView', 'departmentHubView', 'dashboardView'];
            var observer = new MutationObserver(function() {
                var isAuth = (sessionStorage.getItem(STORAGE_KEYS.isAuthenticated) === "true");
                if (!isAuth) {
                    targets.forEach(function(id) {
                        var el = document.getElementById(id);
                        if (el && el.style.display !== 'none') {
                            el.style.setProperty('display', 'none', 'important');
                        }
                    });
                    var login = document.getElementById('loginView');
                    if (login && login.style.display === 'none') {
                        login.style.setProperty('display', 'flex', 'important');
                    }
                }

                // MIS Module Route Guard: Prevent unhiding misSelectionView without PIN verification
                var misEl = document.getElementById('misSelectionView');
                if (misEl && misEl.style.display !== 'none' && !isMISPinVerified()) {
                    misEl.style.setProperty('display', 'none', 'important');
                    if (isAuth && typeof openMISPinSecurityModal === 'function') {
                        openMISPinSecurityModal();
                    }
                }
            });

            targets.forEach(function(id) {
                var el = document.getElementById(id);
                if (el) {
                    observer.observe(el, { attributes: true, attributeFilter: ['style', 'class'] });
                }
            });
            var login = document.getElementById('loginView');
            if (login) {
                observer.observe(login, { attributes: true, attributeFilter: ['style', 'class'] });
            }
            var misView = document.getElementById('misSelectionView');
            if (misView) {
                observer.observe(misView, { attributes: true, attributeFilter: ['style', 'class'] });
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupAntiTamperGuard);
        } else {
            setupAntiTamperGuard();
        }

// Expose globally for portal and hubs
window.AUTH_CONFIG = AUTH_CONFIG;
window.STORAGE_KEYS = STORAGE_KEYS;
window.isPageReload = isPageReload;
window.browseAllReportsAction = browseAllReportsAction;
window.REPORT_TITLE_TO_FILE_MAP = REPORT_TITLE_TO_FILE_MAP;
window.navigateToReportPage = navigateToReportPage;
window.handleSubReportClick = handleSubReportClick;
window.openMasterPage = openMasterPage;
window.initSession = initSession;
window.showDashboardView = showDashboardView;
window.showLoginView = showLoginView;
window.updateNavState = updateNavState;
window.switchToMainInterfaceView = switchToMainInterfaceView;
window.switchToDashboardView = switchToDashboardView;
window.switchToDepartmentHub = switchToDepartmentHub;
window.initNotificationState = initNotificationState;
window.toggleNotificationPanel = toggleNotificationPanel;
window.closeNotificationPanel = closeNotificationPanel;
window.togglePasswordVisibility = togglePasswordVisibility;
window.toggleRoleDropdown = toggleRoleDropdown;
window.selectRole = selectRole;
window.handleLogin = handleLogin;
window.handleViewOnlyAccess = handleViewOnlyAccess;
window.isCurrentUserViewOnly = isCurrentUserViewOnly;
window.applyViewOnlyStateUI = applyViewOnlyStateUI;
window.handleLogout = handleLogout;
window.resetInactivityTimer = resetInactivityTimer;
window.showToast = showToast;
window.switchToModuleSelectionView = switchToModuleSelectionView;
window.switchToProductionModule = switchToProductionModule;
window.openModuleWarehouseAction = openModuleWarehouseAction;
window.openModuleHRMAction = openModuleHRMAction;
window.switchToHRMModuleView = switchToHRMModuleView;
window.toggleModuleProfileDropdown = toggleModuleProfileDropdown;
window.closeModuleProfileDropdown = closeModuleProfileDropdown;
window.openModuleNotice = openModuleNotice;
window.openModuleUserAction = openModuleUserAction;
window.openModuleMISAction = openModuleMISAction;
window.switchToMISSelectionView = switchToMISSelectionView;
window.toggleMISProfileDropdown = toggleMISProfileDropdown;
window.closeMISProfileDropdown = closeMISProfileDropdown;
window.updateModuleHeaderState = updateModuleHeaderState;
window.MIS_SECURITY_PIN = MIS_SECURITY_PIN;
window.isMISPinVerified = isMISPinVerified;
window.openMISPinSecurityModal = openMISPinSecurityModal;
window.closeMISPinSecurityModal = closeMISPinSecurityModal;
window.verifyMISPin = verifyMISPin;
window.clearMISPinInputs = clearMISPinInputs;


