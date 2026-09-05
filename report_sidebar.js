/**
 * MEP FAN REPORTS - Unified Executive Portal Architecture
 * 1. Full-Width Top Navbar with Unified Border across 100vw
 * 2. Left-Corner Title (Module & Report Name)
 * 3. Dedicated Frozen Sidebar showing ONLY the Active Report Module (Zero Cut-Off / Zero Clutter)
 */

(function() {
    // 0. Session Auth Guard - Ensure active login session, otherwise redirect to login page
    if (sessionStorage.getItem('portal_auth_status') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // 1. Module Definition with Bespoke Pastel SVG Icons
    const MEP_NAV_MODULES = [
        {
            id: "mep-acc-01",
            title: "All Report Summary",
            iconBg: "#e0f2fe",
            iconColor: "#0284c7",
            iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
            items: [
                { name: "Production Plan", url: "production_plan.html" },
                { name: "Monthly RM Demand Vs Received", url: "monthly_rm_demand_vs_received.html" },
                { name: "Assemble Summary", url: "assemble_summary.html" },
                { name: "Armature Summary", url: "armature_summary.html" },
                { name: "FG Summary", url: "fg_summary.html" },
                { name: "BOM", url: "bom.html" }
            ]
        },
        {
            id: "mep-acc-02",
            title: "Daily Check Report",
            iconBg: "#fef3c7",
            iconColor: "#d97706",
            iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
            items: [
                { name: "Daily FG Production Entry", url: "daily_fg_production_entry.html" },
                { name: "Daily Production Received Assemble (All)", url: "daily_production_received_assemble.html" },
                { name: "Inter Company Received", url: "#" },
                { name: "All Section RM", url: "#" },
                { name: "Daily Production Plan", url: "daily_production_plan.html" },
                { name: "Safety Stock SFG", url: "#" },
                { name: "Check Floor Stock", url: "check_floor_stock.html" },
                { name: "Fan Damage Calculation Entry", url: "fan_damage_calculation_entry.html" }
            ]
        },
        {
            id: "mep-acc-03",
            title: "Report All Branch Fan",
            iconBg: "#d1fae5",
            iconColor: "#059669",
            iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M12 9v-7"></path><path d="M12 15v7"></path><path d="M15 12h7"></path><path d="M9 12h-7"></path></svg>`,
            items: [
                { name: "All Section SFG", url: "report_all_section_sfg.html" }
            ]
        },
        {
            id: "mep-acc-04",
            title: "Closing (ERP)",
            iconBg: "#fee2e2",
            iconColor: "#dc2626",
            iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
            isClosingERP: true,
            items: [
                { name: "Fan Assemble", url: "fan_assemble_erp.html", idKey: "fan-assemble" },
                { name: "Armature & Winding", url: "armature_winding_erp.html", idKey: "armature-winding" },
                { name: "Finish Good (FG)", url: "closing_finish_good_fg.html", idKey: "closing-fg" },
                { name: "Closing All SFG", url: "closing_all_sfg.html", idKey: "closing-all-sfg" },
                { name: "Store Position Report", url: "store_position_report.html", idKey: "store-position" }
            ]
        },
        {
            id: "mep-acc-05",
            title: "All Monthly Report",
            iconBg: "#f3e8ff",
            iconColor: "#7c3aed",
            iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
            items: [
                { name: "Monthly Production Summary (Physical)", url: "monthly_production_summary_physical.html" },
                { name: "Monthly Damage Summary", url: "monthly_damage_summary.html" }
            ]
        },
        {
            id: "mep-acc-06",
            title: "All Yearly Report",
            iconBg: "#ccfbf1",
            iconColor: "#0d9488",
            iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
            items: [
                { name: "Yearly Production Summary (Physical)", url: "yearly_production_summary_physical.html" },
                { name: "Yearly Production Summary (ERP)", url: "yearly_production_summary_erp.html" },
                { name: "Yearly Damage Summary", url: "yearly_damage_summary.html" }
            ]
        },
        {
            id: "mep-acc-07",
            title: "Reject Report",
            iconBg: "#ffedd5",
            iconColor: "#ea580c",
            iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
            items: [
                { name: "Assemble Reject", url: "#" },
                { name: "All Section Reject", url: "#" }
            ]
        },
        {
            id: "mep-acc-08",
            title: "Complete vs Pending",
            iconBg: "#e0e7ff",
            iconColor: "#4f46e5",
            iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
            items: [
                { name: "FG Pending Report", url: "fg_pending_report.html" }
            ]
        },
        {
            id: "mep-acc-09",
            title: "Fan Floor Closing Report",
            iconBg: "#ecfccb",
            iconColor: "#65a30d",
            iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
            items: [
                { name: "Daily Floor Closing Summary", url: "#" },
                { name: "Shift Production Reconciliation", url: "#" },
                { name: "Floor Material Return Report", url: "#" }
            ]
        },
        {
            id: "mep-acc-10",
            title: "Other Reports",
            iconBg: "#f1f5f9",
            iconColor: "#475569",
            iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
            items: [
                { name: "Quality Inspection Log", url: "#" },
                { name: "Maintenance & Breakdown Log", url: "#" },
                { name: "Miscellaneous Operational Logs", url: "#" }
            ]
        },
        {
            id: "mep-acc-11",
            title: "Individual Check",
            iconBg: "#ecfeff",
            iconColor: "#0891b2",
            iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
            items: [
                { name: "Check FG Need Item", url: "check_fg_need_item.html" },
                { name: "Check RM (Prd. Possible)", url: "check_rm_prd_possible.html" },
                { name: "BOM With SFG", url: "bom_with_sfg.html" }
            ]
        }
    ];

    // Helper to get current file name
    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().split('?')[0].split('#')[0];
        return page || "index.html";
    }

    // Helper to resolve closing date
    function resolveClosingReportDate(repKey, fallbackDefault) {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        const keyMap = {
            'fan-assemble': ['mep_fan_assemble_date_interval', 'mep_erp_date_interval', 'closingDate_fan_assemble'],
            'armature-winding': ['mep_armature_winding_date_interval', 'mep_erp_date_interval', 'closingDate_armature_winding'],
            'closing-fg': ['mep_closing_fg_date_interval', 'mep_erp_date_interval', 'closingDate_closing_fg'],
            'closing-all-sfg': ['mep_closing_all_sfg_date_interval', 'mep_erp_date_interval', 'closingDate_closing_all_sfg'],
            'store-position': ['mep_store_position_date', 'mep_store_position_date_interval', 'mep_erp_date_interval', 'closingDate_store_position']
        };
        
        let foundRaw = null;
        const keys = keyMap[repKey] || [];
        for (let k of keys) {
            const val = localStorage.getItem(k);
            if (val && val.trim()) { foundRaw = val.trim(); break; }
        }
        
        let date = fallbackDefault;
        if (foundRaw) {
            const match = foundRaw.match(/(\d{4}-\d{2}-\d{2})\s*$/);
            if (match) date = match[1];
            else {
                const single = foundRaw.match(/(\d{4}-\d{2}-\d{2})/);
                if (single) date = single[1];
            }
        }
        
        const isLive = (date >= todayStr);
        const shortDate = date.length >= 10 ? date.slice(5) : date;
        return { date, shortDate, isLive };
    }

    // Initialize Unified Layout & Sidebar
    function initFrozenSidebar() {
        const currentPage = getCurrentPage();
        if (currentPage === 'index.html' || currentPage === '') {
            return;
        }

        // 1. Find active module & item name (Exact match first, then fallback)
        let activeModule = null;
        let activeItemName = document.title || "Report Detail";

        // Pass 1: Exact match
        for (let i = 0; i < MEP_NAV_MODULES.length; i++) {
            const mod = MEP_NAV_MODULES[i];
            for (let j = 0; j < mod.items.length; j++) {
                const item = mod.items[j];
                if (currentPage === item.url) {
                    activeModule = mod;
                    activeItemName = item.name;
                    break;
                }
            }
            if (activeModule) break;
        }

        // Pass 2: Fallback if no exact match
        if (!activeModule) {
            for (let i = 0; i < MEP_NAV_MODULES.length; i++) {
                const mod = MEP_NAV_MODULES[i];
                for (let j = 0; j < mod.items.length; j++) {
                    const item = mod.items[j];
                    if (item.url !== '#' && (currentPage.startsWith(item.url.replace('.html', '')) || currentPage.includes(item.url.replace('.html', '')))) {
                        activeModule = mod;
                        activeItemName = item.name;
                        break;
                    }
                }
                if (activeModule) break;
            }
        }

        if (!activeModule) {
            if (currentPage === 'master.html') {
                activeModule = {
                    id: "mep-acc-master",
                    title: "MASTER Central DB",
                    iconBg: "#334155",
                    iconColor: "#38bdf8",
                    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
                    items: [
                        { name: "Master Central DB", url: "master.html" }
                    ]
                };
                activeItemName = "Central Item Master Database";
            } else {
                activeModule = MEP_NAV_MODULES[0];
                activeItemName = "Report Detail";
            }
        }

        // 2. Identify top navbar and clean it up (Insert Home, Dashboard and [S] Sayful Islam)
        const nav = document.querySelector('.portal-nav') || document.querySelector('header');
        if (nav) {
            // Remove old buttons
            const btnsToRemove = nav.querySelectorAll('.btn-nav-group, .btn-nav-action, .btn-back-portal, .btn-toggle-frozen-sidebar, .btn-portal-back');
            btnsToRemove.forEach(el => el.remove());

            let navLeft = nav.querySelector('.nav-left');
            let navRight = nav.querySelector('.nav-right');

            if (!navLeft) {
                let container = nav.querySelector('.nav-container');
                if (!container) {
                    container = document.createElement('div');
                    container.className = 'nav-container';
                    nav.appendChild(container);
                }
                navLeft = document.createElement('div');
                navLeft.className = 'nav-left';
                container.insertBefore(navLeft, container.firstChild);
            }
            
            // 1. Clean navLeft of all legacy brands, duplicate titles, and old Link Details button
            navLeft.innerHTML = '';
            navLeft.style.display = 'inline-flex';
            navLeft.style.alignItems = 'center';

            // 2. Permanent Brand Bar - Smart Time Management (Exclusive Header Branding)
            const brandCard = document.createElement('div');
            brandCard.className = 'smart-brand-card';
            brandCard.innerHTML = `<span class="smart-brand-text">Smart Time Management</span>`;
            navLeft.appendChild(brandCard);

            // 3. Place new [Link] button in the page toolbar (.header-actions or .header-action-group)
            const targetToolbar = document.querySelector('.header-actions, .header-action-group');
            if (targetToolbar && !targetToolbar.querySelector('.btn-action-link')) {
                const linkBtn = document.createElement('button');
                linkBtn.type = 'button';
                linkBtn.className = 'btn-action btn-action-link';
                linkBtn.setAttribute('data-tooltip', 'Link');
                linkBtn.onclick = function() { window.openLinkDetailsModal(); };
                linkBtn.style.cssText = "background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.35);";
                linkBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                `;
                targetToolbar.insertBefore(linkBtn, targetToolbar.firstChild);
            }

            // 4. Setup Icon-Only Action Buttons & Premium Tooltips across all toolbars
            document.querySelectorAll('.header-actions, .header-action-group, .damage-actions-group').forEach(tb => {
                tb.querySelectorAll('button').forEach(btn => {
                    btn.removeAttribute('title');
                    const txt = btn.textContent.trim();
                    if (!btn.getAttribute('data-tooltip')) {
                        if (txt.includes('Link')) btn.setAttribute('data-tooltip', 'Link');
                        else if (txt.includes('Plan') || txt.includes('Save')) btn.setAttribute('data-tooltip', 'Plan');
                        else if (txt.includes('Add')) btn.setAttribute('data-tooltip', 'Add Item');
                        else if (txt.includes('Export') || txt.includes('CSV')) btn.setAttribute('data-tooltip', 'Export CSV');
                        else if (txt.includes('Print')) btn.setAttribute('data-tooltip', 'Print');
                        else if (txt.includes('Paste') || txt.includes('Import')) btn.setAttribute('data-tooltip', 'Paste / Import');
                        else if (txt.length > 0) btn.setAttribute('data-tooltip', txt);
                    }
                    btn.querySelectorAll('span').forEach(s => s.style.display = 'none');
                });
            });

            // 5. Clean up any Company Address / Location Subheadings under Main Headings
            document.querySelectorAll('.location-text, .company-location, .header-title-sub, .company-meta-group .location-text, .company-header-group .company-location').forEach(el => {
                el.remove();
            });

            // Check right corner: Ensure round [Profile Photo] Sayful Islam component exists (NO Bell in Report Header)
            if (!navRight) {
                let container = nav.querySelector('.nav-container') || nav;
                navRight = document.createElement('div');
                navRight.className = 'nav-right';
                container.appendChild(navRight);
            }

            if (navRight) {
                // Remove any old notification bell if present
                const oldBell = navRight.querySelector('.notif-btn-wrapper, .notif-bell-btn');
                if (oldBell) oldBell.remove();

                // Realtime Firebase Cloud Status Indicator: "Live"
                if (!navRight.querySelector('.smart-cloud-status-badge')) {
                    const cloudBadge = document.createElement('div');
                    cloudBadge.className = 'smart-cloud-status-badge';
                    cloudBadge.id = 'smartCloudStatusBadge';
                    cloudBadge.title = 'Realtime Cloud: Connected (Live Sync)';
                    cloudBadge.innerHTML = `
                        <span class="cloud-pulse-dot"></span>
                        <span class="cloud-status-text">Live</span>
                    `;
                    navRight.insertBefore(cloudBadge, navRight.firstChild);
                } else {
                    const txt = navRight.querySelector('.smart-cloud-status-badge .cloud-status-text');
                    if (txt && txt.textContent.includes('Cloud Live')) txt.textContent = 'Live';
                }

                // View-Only Mode Status Indicator (Dynamic: Only shown if logged in as View-Only)
                const isViewOnlyMode = (sessionStorage.getItem('portal_view_only') === 'true');
                let viewBadge = navRight.querySelector('.smart-view-only-badge');
                if (isViewOnlyMode) {
                    if (!viewBadge) {
                        viewBadge = document.createElement('div');
                        viewBadge.className = 'smart-view-only-badge';
                        viewBadge.title = 'View-Only Mode: Data entry and editing are disabled';
                        viewBadge.innerHTML = `
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            <span>View Only</span>
                        `;
                        navRight.insertBefore(viewBadge, navRight.querySelector('.user-brand-card') || null);
                    } else {
                        viewBadge.style.display = 'inline-flex';
                    }
                } else if (viewBadge) {
                    viewBadge.remove();
                }

                // Ensure Live Clock Badge exists
                if (!navRight.querySelector('.live-clock-badge')) {
                    const clockBadge = document.createElement('div');
                    clockBadge.className = 'live-clock-badge';
                    clockBadge.id = 'liveClockBadge';
                    clockBadge.title = 'Live System Day & Time';
                    clockBadge.innerHTML = `
                        <div class="live-clock-info">
                            <span class="live-day-text" id="liveDayText">Loading date...</span>
                            <span class="live-time-text" id="liveTimeText">--:--:-- --</span>
                        </div>
                    `;
                    navRight.insertBefore(clockBadge, navRight.querySelector('.user-brand-card') || null);
                }

                if (!navRight.querySelector('.user-brand-card')) {
                    const userBrand = document.createElement('a');
                    userBrand.href = "index.html?view=main";
                    userBrand.className = 'user-brand-card';
                    userBrand.title = "Sayful Islam - Senior Supervisor";
                    userBrand.innerHTML = `
                        <div class="user-avatar-frame">
                            <img src="profile.jpg" alt="Sayful Islam" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="user-avatar-fallback" style="display:none; width:100%; height:100%; background:#0284c7; color:#fff; align-items:center; justify-content:center; font-weight:800; font-size:13px;">S</div>
                        </div>
                        <div class="user-brand-meta">
                            <span class="user-brand-name" style="font-size:0.86rem;">Sayful Islam</span>
                            <span class="user-brand-role" style="font-size:0.62rem;">Senior Supervisor</span>
                        </div>
                    `;
                    navRight.appendChild(userBrand);
                }

                // Header Top-Right Logout Button (Uniform across all report pages)
                if (!navRight.querySelector('.header-logout-btn')) {
                    const logoutBtn = document.createElement('button');
                    logoutBtn.type = 'button';
                    logoutBtn.className = 'header-logout-btn';
                    logoutBtn.title = 'Logout / Lock Portal';
                    logoutBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    `;
                    logoutBtn.onclick = function() {
                        sessionStorage.removeItem('portal_auth_status');
                        sessionStorage.removeItem('portal_view_only');
                        sessionStorage.removeItem('portal_current_view');
                        sessionStorage.removeItem('portal_hub_module');
                        window.location.href = 'index.html';
                    };
                    navRight.appendChild(logoutBtn);
                }
            }
        }

        // 3. Build Full Accordion Sidebar containing ALL Main Headings (Modules)
        let accordionHtml = '';

        MEP_NAV_MODULES.forEach(mod => {
            const isThisActiveModule = (mod.id === activeModule.id);
            const isClosing = !!mod.isClosingERP;

            let subItemsHtml = '';
            mod.items.forEach(item => {
                const isActiveItem = (currentPage === item.url || (activeModule && item.name === activeItemName));
                let statusTagHtml = '';
                let dotClass = 'sub-item-dot';

                if (isClosing && item.idKey) {
                    const repInfo = resolveClosingReportDate(item.idKey, '2026-08-25');
                    dotClass += repInfo.isLive ? ' status-updated' : ' status-outdated';
                    statusTagHtml = `<span class="sub-item-status-tag ${repInfo.isLive ? 'tag-updated' : 'tag-outdated'}">${repInfo.shortDate}</span>`;
                }

                subItemsHtml += `
                    <a href="${item.url}" class="sub-report-item ${isActiveItem ? 'active-page item-highlight-entry' : ''}" style="margin-bottom: 5px; text-decoration: none !important;" title="${item.name}" onclick="handleSubItemClick(this)">
                        <div class="sub-item-left">
                            <span class="${dotClass}" id="mep-dot-${item.idKey || ''}"></span>
                            <span class="sub-item-title">${item.name}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:6px;">
                            ${statusTagHtml}
                            <svg class="sub-item-arrow" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </div>
                    </a>
                `;
            });

            const badgeText = mod.badge || (isClosing ? 'LIVE ERP' : `${mod.items.length} Reports`);

            accordionHtml += `
                <div class="mep-module-accordion ${isThisActiveModule ? 'is-open' : ''}" id="mep-acc-group-${mod.id}">
                    <!-- Main Heading ("মূল হেডিং") -->
                    <div class="mep-module-heading mep-heading-${mod.id} ${isThisActiveModule ? 'is-active-module' : ''}" onclick="toggleSidebarModule('${mod.id}')" title="Click to open/collapse ${mod.title}">
                        <div class="mep-mod-left">
                            <div class="mep-mod-icon" style="background:${mod.iconBg}; color:${mod.iconColor};">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    ${mod.iconSvg}
                                </svg>
                            </div>
                            <div class="mep-mod-info">
                                <div class="mep-mod-title">${mod.title}</div>
                            </div>
                        </div>
                        <div class="mep-mod-chevron">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>

                    <!-- Sub-Reports List (Files inside this Main Heading) -->
                    <div class="mep-module-sublist sub-report-list" id="mep-acc-body-${mod.id}">
                        ${subItemsHtml}
                    </div>
                </div>
            `;
        });

        // Global accordion toggle handler
        window.toggleSidebarModule = function(modId) {
            const targetGroup = document.getElementById(`mep-acc-group-${modId}`);
            if (!targetGroup) return;

            const wasOpen = targetGroup.classList.contains('is-open');

            // Collapse all modules
            document.querySelectorAll('.mep-module-accordion').forEach(grp => {
                grp.classList.remove('is-open');
                const h = grp.querySelector('.mep-module-heading');
                if (h) h.classList.remove('is-active-module');
            });

            // Open clicked module if it was previously closed
            if (!wasOpen) {
                targetGroup.classList.add('is-open');
                const h = targetGroup.querySelector('.mep-module-heading');
                if (h) h.classList.add('is-active-module');
                setTimeout(() => {
                    targetGroup.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 50);
            }
        };

        // Instant click handler for sub-report pages
        window.handleSubItemClick = function(clickedEl) {
            document.querySelectorAll('.sub-report-item').forEach(el => {
                el.classList.remove('active-page');
                el.classList.remove('item-highlight-entry');
            });
            clickedEl.classList.add('active-page');
            clickedEl.classList.add('item-highlight-entry');
        };

        // 4. Create Sidebar matching Accordion Architecture
        const aside = document.createElement('aside');
        aside.id = 'mepFrozenSidebar';
        aside.className = 'mep-frozen-sidebar';
        aside.innerHTML = `
            <div class="mep-sidebar-actions" style="display:flex; gap:8px; padding:8px 10px; border-bottom:1.5px solid #e2e8f0; background:#f8fafc;">
                <!-- Button 0: Main Interface -->
                <a href="index.html?view=main" class="btn-nav-tab btn-nav-main" style="flex:1; justify-content:center; height:34px; padding:0;" aria-label="Main Interface">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" stroke="currentColor" stroke-width="0.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </a>
                <!-- Button 1: Home (Main Menu) -->
                <a href="index.html?view=hub" class="btn-nav-tab btn-nav-home" style="flex:1; justify-content:center; height:34px; padding:0;" aria-label="Home">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9.5z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </a>
            </div>

            <div class="mep-sidebar-body" style="padding: 8px 8px 20px;">
                ${accordionHtml}
            </div>
        `;

        // 5. Structure Unified DOM Layout
        document.body.classList.add('has-frozen-sidebar');

        if (!document.getElementById('mepLayoutContainer')) {
            const layoutContainer = document.createElement('div');
            layoutContainer.id = 'mepLayoutContainer';
            layoutContainer.className = 'mep-layout-container';

            const pageContent = document.createElement('div');
            pageContent.id = 'mepPageContent';
            pageContent.className = 'mep-page-content';

            // Move all body children except top navbar into pageContent
            const children = Array.from(document.body.childNodes);
            children.forEach(node => {
                if (node !== nav && node !== aside) {
                    pageContent.appendChild(node);
                }
            });

            layoutContainer.appendChild(aside);
            layoutContainer.appendChild(pageContent);

            if (nav) {
                document.body.insertBefore(nav, document.body.firstChild);
                document.body.appendChild(layoutContainer);
            } else {
                document.body.appendChild(layoutContainer);
            }

            setTimeout(() => {
                const activeModEl = document.querySelector('.mep-module-accordion.is-open');
                if (activeModEl) {
                    activeModEl.scrollIntoView({ block: 'nearest' });
                }
            }, 60);
        }

                // Dynamic Page Title inside Report Header Box (Matches User Screenshot 4)
        const compTitle = document.querySelector('.company-meta-group h1');
        if (compTitle) {
            compTitle.textContent = activeItemName;
            const compSub = document.querySelector('.company-meta-group .location-text');
            if (compSub) {
                compSub.textContent = 'MEP Fan Ltd. â€¢ Gogon Goli, Barishal.';
            }
        }
                // Live System Clock Updater for Sub-Reports
        function runSubReportLiveClock() {
            const now = new Date();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dayName = days[now.getDay()];
            const dateNum = now.getDate();
            const monthName = months[now.getMonth()];
            const yearNum = now.getFullYear();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const formattedHours = String(hours).padStart(2, '0');

            const dateStr = `${dayName}, ${dateNum} ${monthName} ${yearNum}`;
            const timeStr = `${formattedHours}:${minutes}:${seconds} ${ampm}`;

            document.querySelectorAll('.live-day-text').forEach(function(el) { el.innerText = dateStr; });
            document.querySelectorAll('.live-time-text').forEach(function(el) { el.innerText = timeStr; });
        }
        runSubReportLiveClock();
        setInterval(runSubReportLiveClock, 1000);
        updateSidebarClosingStatus();
    }

    // Update Closing ERP Date Badges and Red/Green Status
    function updateSidebarClosingStatus() {
        const reportKeys = ['fan-assemble', 'armature-winding', 'closing-fg', 'closing-all-sfg', 'store-position'];
        let anyHasRed = false;

        reportKeys.forEach(key => {
            const repInfo = resolveClosingReportDate(key, '2026-08-25');
            const dotEl = document.getElementById(`mep-dot-${key}`);
            const itemLink = dotEl ? dotEl.closest('.sub-report-item') : null;
            const tagEl = itemLink ? itemLink.querySelector('.sub-item-status-tag') : null;

            if (tagEl) {
                tagEl.textContent = repInfo.shortDate;
                tagEl.className = `sub-item-status-tag ${repInfo.isLive ? 'tag-updated' : 'tag-outdated'}`;
            }

            if (dotEl) {
                dotEl.className = `sub-item-dot ${repInfo.isLive ? 'status-updated' : 'status-outdated'}`;
                dotEl.title = repInfo.isLive ? `Live & Updated (${repInfo.date})` : `Pending Update! (${repInfo.date})`;
                if (!repInfo.isLive) anyHasRed = true;
            }
        });
    }

    // =========================================================================
    // Global Theme Support for Sub-Report Pages (☀️ Light / 🌙 Dark Mode)
    // =========================================================================
    function initThemeSupport() {
        const savedTheme = localStorage.getItem('mep_portal_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (document.body) {
            document.body.setAttribute('data-theme', savedTheme);
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        }
    }
    initThemeSupport();

    // =========================================================================
    // Comprehensive Per-Page Link Information Registry
    // =========================================================================
    const PAGE_LINK_REGISTRY = {
        'check_fg_need_item': {
            title: 'Check FG Need Item',
            path: 'Individual Check → Check FG Need Item',
            desc: 'Calculates raw component requirements, physical floor stock, store availability, and net deficit for target FG production assembly.',
            links: [
                {
                    col: 'Floor Stock',
                    sourcePage: 'Assemble Summary',
                    sourcePageUrl: 'assemble_summary.html',
                    sourceCol: 'Bin Closing',
                    matchKey: 'Item Code',
                    desc: 'Real-time assembly bin stock matched by raw material code'
                },
                {
                    col: 'Store Stock',
                    sourcePage: 'Store Position Report',
                    sourcePageUrl: 'store_position_report.html',
                    sourceCol: 'Store Stock / Balance',
                    matchKey: 'FG Code / Item Code',
                    desc: 'Central store balance extracted from Closing ERP'
                },
                {
                    col: 'Pending',
                    sourcePage: 'Check Floor Stock / All Section SFG',
                    sourcePageUrl: 'report_all_section_sfg.html',
                    sourceCol: 'Total Pending / Assemble Short',
                    matchKey: 'Item Code',
                    desc: 'WIP assembly pending units queued in production'
                }
            ],
            calcs: [
                {
                    target: 'Short Floor',
                    formula: 'Short Floor = Need FG − Floor Stock (0 if Floor Stock ≥ Need FG)'
                },
                {
                    target: 'Need',
                    formula: 'Need = Short Floor − Store Stock (0 if Store Stock ≥ Short Floor)'
                },
                {
                    target: 'Warning Status',
                    formula: 'If Need > 0 ➔ CRITICAL SHORTAGE; If Store Stock ≥ Short Floor ➔ STORE AVAILABLE'
                }
            ],
            visualMap: [
                { sourcePage: 'Assemble Summary', sourceCol: 'Bin Closing', key: 'Item Code Match', targetCol: 'Floor Stock' },
                { sourcePage: 'Store Position Report', sourceCol: 'Store Qty', key: 'FG Code Match', targetCol: 'Store Stock' },
                { sourcePage: 'Check Floor Stock', sourceCol: 'Total Pending', key: 'Item Code Match', targetCol: 'Pending' }
            ]
        },
        'fg_summary': {
            title: 'FG Summary',
            path: 'All Report Summary → FG Summary',
            desc: 'Consolidated Finished Goods stock and production movement ledger linked 100% Code-to-Code with Closing ERP → Finish Good FG.',
            links: [
                {
                    col: 'Opening',
                    sourcePage: 'Finish Good (FG)',
                    sourcePageUrl: 'closing_finish_good_fg.html',
                    sourceCol: 'Opening',
                    matchKey: '100% Item Code ↔ Item Code',
                    desc: 'Opening balance linked from Finish Good FG (Opening Column)'
                },
                {
                    col: 'Production Received',
                    sourcePage: 'Finish Good (FG)',
                    sourcePageUrl: 'closing_finish_good_fg.html',
                    sourceCol: 'Other (Receive Other)',
                    matchKey: '100% Item Code ↔ Item Code',
                    desc: 'Direct Code ↔ Code link from Finish Good FG (Receive Other Column between Transfer Total and Total Stock)'
                },
                {
                    col: 'Delivery',
                    sourcePage: 'Finish Good (FG)',
                    sourcePageUrl: 'closing_finish_good_fg.html',
                    sourceCol: 'Transfer (Issue Transfer)',
                    matchKey: '100% Item Code ↔ Item Code',
                    desc: 'Direct Code ↔ Code link from Finish Good FG (Issue Transfer Column between Sales and Issue Other)'
                },
                {
                    col: 'Closing',
                    sourcePage: 'Finish Good (FG)',
                    sourcePageUrl: 'closing_finish_good_fg.html',
                    sourceCol: 'Bin Closing',
                    matchKey: '100% Item Code ↔ Item Code',
                    desc: 'Direct Code ↔ Code link from Finish Good FG (Bin Closing Column)'
                }
            ],
            calcs: [
                {
                    target: '100% Code-to-Code Matching Rule',
                    formula: 'Destination Item Code == Source Item Code ➔ Actual Data, else 0'
                },
                {
                    target: 'Zero-Fill Rule for Missing/New Codes',
                    formula: 'If Item Code does NOT exist in current Month Source ➔ Opening=0, Prod=0, Delivery=0, Closing=0'
                }
            ],
            visualMap: [
                { sourcePage: 'Closing (ERP) Finish Good (FG)', sourceCol: 'Opening', key: '100% Item Code Match', targetCol: 'Opening' },
                { sourcePage: 'Closing (ERP) Finish Good (FG)', sourceCol: 'Other (Receive)', key: '100% Item Code Match', targetCol: 'Production Received' },
                { sourcePage: 'Closing (ERP) Finish Good (FG)', sourceCol: 'Transfer (Issue)', key: '100% Item Code Match', targetCol: 'Delivery' },
                { sourcePage: 'Closing (ERP) Finish Good (FG)', sourceCol: 'Bin Closing', key: '100% Item Code Match', targetCol: 'Closing' }
            ]
        },
        'bom': {
            title: 'BOM (Bill of Materials)',
            path: 'All Report Summary → BOM',
            desc: 'Defines the exact engineering component breakdown and raw material composition for every Finished Good (FG) model.',
            links: [
                {
                    col: 'FG Model Code',
                    sourcePage: 'Master Central DB',
                    sourcePageUrl: 'master.html',
                    sourceCol: 'Product Code',
                    matchKey: 'FG Model Code',
                    desc: 'Standardized model catalog identification'
                },
                {
                    col: 'SFG Component Code',
                    sourcePage: 'Closing All SFG',
                    sourcePageUrl: 'closing_all_sfg.html',
                    sourceCol: 'Item Code',
                    matchKey: 'SFG Code',
                    desc: 'Sub-assembly part identifier (Blade, Body, Armature, Stator)'
                },
                {
                    col: 'Section',
                    sourcePage: 'All Section SFG',
                    sourcePageUrl: 'report_all_section_sfg.html',
                    sourceCol: 'Section Name',
                    matchKey: 'Part Type',
                    desc: 'Production shop floor routing assignment'
                }
            ],
            calcs: [
                {
                    target: 'Required Component Ratio',
                    formula: 'BOM Ratio = Sub-component Quantity / 1 Unit Finished Good'
                },
                {
                    target: 'Assembly Need Calculation',
                    formula: 'Target FG Units × Component Ratio = Total SFG Quantity Required'
                }
            ],
            visualMap: [
                { sourcePage: 'Master Central DB', sourceCol: 'Model Master', key: 'FG Code Match', targetCol: 'BOM Model Header' },
                { sourcePage: 'Closing All SFG', sourceCol: 'Item Code', key: 'SFG Code Match', targetCol: 'Component Mapping' }
            ]
        },
        'store_position_report': {
            title: 'Store Position Report',
            path: 'Closing (ERP) → Store Position Report',
            desc: 'Daily warehouse inventory ledger containing raw materials, semi-finished components, and packaging balances.',
            links: [
                {
                    col: 'Item Code & Description',
                    sourcePage: 'Central SAP / ERP Export',
                    sourcePageUrl: '#',
                    sourceCol: 'Material Number & Text',
                    matchKey: 'ERP Item Code',
                    desc: 'Extracted directly from ERP closing ledger'
                },
                {
                    col: 'Physical Store Stock',
                    sourcePage: 'Store Ledger / ERP Balance',
                    sourcePageUrl: '#',
                    sourceCol: 'Closing Balance Qty',
                    matchKey: 'Numeric Item ID',
                    desc: 'Sanitized inventory balance after group classification'
                }
            ],
            calcs: [
                {
                    target: 'Item Group Filtering',
                    formula: 'Classifies rows into Fan Raw, SFG Blade, Motors, and Packaging groups'
                },
                {
                    target: 'Downstream Consumption',
                    formula: 'Exported live to Check FG Need Item (Store Stock column)'
                }
            ],
            visualMap: [
                { sourcePage: 'ERP System Export', sourceCol: 'Raw Warehouse File', key: 'Paste / Import', targetCol: 'Store Position Ledger' },
                { sourcePage: 'Store Position Report', sourceCol: 'Store Stock', key: 'Item Code Match', targetCol: 'Check FG Need Item' }
            ]
        },
        'check_floor_stock': {
            title: 'Check Floor Stock',
            path: 'Daily Check Report → Check Floor Stock',
            desc: 'Shop floor component audit reconciling WIP buffers and pending line issuances.',
            links: [
                {
                    col: 'Item Code / Name',
                    sourcePage: 'BOM With SFG',
                    sourcePageUrl: 'bom_with_sfg.html',
                    sourceCol: 'Component Code',
                    matchKey: 'Item Code',
                    desc: 'Active assembly component definitions'
                },
                {
                    col: 'Line Available Stock',
                    sourcePage: 'Assemble Summary',
                    sourcePageUrl: 'assemble_summary.html',
                    sourceCol: 'Bin Closing',
                    matchKey: 'Item Code',
                    desc: 'Current bin stock on assembly floor'
                },
                {
                    col: 'Total Pending',
                    sourcePage: 'Daily Production Received Assemble',
                    sourcePageUrl: 'daily_production_received_assemble.html',
                    sourceCol: 'Pending Units',
                    matchKey: 'Item Code',
                    desc: 'Unassembled batches in transit'
                }
            ],
            calcs: [
                {
                    target: 'Effective Floor Balance',
                    formula: 'Floor Balance = Bin Closing − Buffer Requirement'
                },
                {
                    target: 'Safety Alert Status',
                    formula: 'Red Alert triggered if Floor Balance < Minimum Line Threshold'
                }
            ],
            visualMap: [
                { sourcePage: 'Assemble Summary', sourceCol: 'Bin Closing', key: 'Item Code Match', targetCol: 'Floor Balance' },
                { sourcePage: 'Production Received', sourceCol: 'Pending Queue', key: 'Batch Code', targetCol: 'Total Pending' }
            ]
        },
        'assemble_summary': {
            title: 'Assemble Summary',
            path: 'All Report Summary → Assemble Summary',
            desc: 'Consolidated assembly floor inventory ledger tracking opening, received, dispatch, and bin closing balances.',
            links: [
                {
                    col: 'Opening Balance',
                    sourcePage: 'Previous Assemble Summary',
                    sourcePageUrl: 'assemble_summary.html',
                    sourceCol: 'Bin Closing',
                    matchKey: 'Item Code',
                    desc: 'Closing balance of previous production day'
                },
                {
                    col: 'Production Received',
                    sourcePage: 'Daily Production Received Assemble',
                    sourcePageUrl: 'daily_production_received_assemble.html',
                    sourceCol: 'Daily Qty Received',
                    matchKey: 'Item Code',
                    desc: 'Physical units received into assembly floor'
                },
                {
                    col: 'Issue / Transfer',
                    sourcePage: 'Daily Dispatch Log',
                    sourcePageUrl: '#',
                    sourceCol: 'Issued Units',
                    matchKey: 'Item Code',
                    desc: 'Dispatched to packaging or branch transfer'
                }
            ],
            calcs: [
                {
                    target: 'Bin Closing Formula',
                    formula: 'Bin Closing = Opening + Production Received − Issue / Transfer'
                },
                {
                    target: 'Downstream Output',
                    formula: 'Feeds Floor Stock column in Check FG Need Item'
                }
            ],
            visualMap: [
                { sourcePage: 'Daily Prod Received', sourceCol: 'Received Qty', key: 'Item Code Match', targetCol: 'Production Received' },
                { sourcePage: 'Assemble Summary', sourceCol: 'Bin Closing', key: 'Feeds Downstream', targetCol: 'Check FG Need Item' }
            ]
        },
        'report_all_section_sfg': {
            title: 'All Section SFG',
            path: 'Report All Branch Fan → All Section SFG',
            desc: 'Consolidated branch-wide SFG ledger with strict Code ↔ Code matching from Closing ERP ➔ Closing All SFG.',
            links: [
                {
                    col: 'Opening',
                    sourcePage: 'Closing All SFG',
                    sourcePageUrl: 'closing_all_sfg.html',
                    sourceCol: 'Opening',
                    matchKey: 'Item Code ↔ Item Code',
                    desc: 'Code ↔ Code live sync from Closing All SFG'
                },
                {
                    col: 'Production Receive',
                    sourcePage: 'Closing All SFG',
                    sourcePageUrl: 'closing_all_sfg.html',
                    sourceCol: 'Production Receive',
                    matchKey: 'Item Code ↔ Item Code',
                    desc: 'Code ↔ Code live sync from Closing All SFG'
                },
                {
                    col: 'Delivery',
                    sourcePage: 'Closing All SFG',
                    sourcePageUrl: 'closing_all_sfg.html',
                    sourceCol: 'WIP Issue',
                    matchKey: 'Item Code ↔ Item Code',
                    desc: 'Code ↔ Code live sync from Closing All SFG (WIP Issue)'
                },
                {
                    col: 'Closing',
                    sourcePage: 'Closing All SFG',
                    sourcePageUrl: 'closing_all_sfg.html',
                    sourceCol: 'Bin Closing',
                    matchKey: 'Item Code ↔ Item Code',
                    desc: 'Code ↔ Code live sync from Closing All SFG (Bin Closing)'
                }
            ],
            calcs: [],
            visualMap: [
                { sourcePage: 'Closing All SFG', sourceCol: 'Opening, Prod rcv, WIP Issue, Bin Closing', key: 'Item Code ↔ Item Code', targetCol: 'Opening, Production Receive, Delivery, Closing' }
            ]
        }
    };

    // =========================================================================
    // Global Link Details Modal (Page-Specific Mapping & Flow)
    // =========================================================================
    window.openLinkDetailsModal = function(customPage) {
        const page = (customPage || getCurrentPage() || '').replace('.html', '');
        let reg = null;

        for (let key in PAGE_LINK_REGISTRY) {
            if (page.includes(key)) {
                reg = PAGE_LINK_REGISTRY[key];
                break;
            }
        }

        if (!reg) {
            reg = {
                title: page.replace(/_/g, ' ').toUpperCase(),
                path: 'Portal Navigation → ' + page.replace(/_/g, ' ').toUpperCase(),
                desc: 'Standard production and operational reporting linked to the Central Master Database.',
                links: [
                    {
                        col: 'Item Code & Description',
                        sourcePage: 'Master Central DB',
                        sourcePageUrl: 'master.html',
                        sourceCol: 'Master Item Registry',
                        matchKey: 'Item Code',
                        desc: 'Synchronized with primary product master catalog'
                    },
                    {
                        col: 'Daily Quantities',
                        sourcePage: 'Daily Floor Logs',
                        sourcePageUrl: '#',
                        sourceCol: 'Entry Quantities',
                        matchKey: 'Batch / Date',
                        desc: 'Live verified shop floor records'
                    }
                ],
                calcs: [
                    {
                        target: 'Summary Total',
                        formula: 'Sum of active line quantities grouped by model classification'
                    }
                ],
                visualMap: [
                    { sourcePage: 'Master Central DB', sourceCol: 'Item Code', key: 'Code Match', targetCol: 'Active Page Ledger' }
                ]
            };
        }

        // Build Table Rows
        let tableRowsHtml = '';
        reg.links.forEach(l => {
            tableRowsHtml += `
                <tr>
                    <td><span class="col-tag-current">${l.col}</span></td>
                    <td><strong>${l.sourcePage}</strong></td>
                    <td><span class="col-tag-source">${l.sourceCol}</span></td>
                    <td><span class="col-tag-key">${l.matchKey}</span></td>
                    <td style="color:#64748b; font-size:0.80rem;">${l.desc}</td>
                </tr>
            `;
        });

        // Build Calculation Cards
        let calcsHtml = '';
        reg.calcs.forEach(c => {
            calcsHtml += `
                <div class="calc-rule-card">
                    <div class="calc-rule-target">🧮 ${c.target}</div>
                    <div class="calc-rule-formula">${c.formula}</div>
                </div>
            `;
        });

        // Build Visual Map Rows
        let mapHtml = '';
        reg.visualMap.forEach(m => {
            mapHtml += `
                <div class="visual-map-row">
                    <div class="visual-node">
                        <div class="node-page">${m.sourcePage}</div>
                        <div class="node-col">${m.sourceCol}</div>
                    </div>
                    <div class="visual-arrow-bridge">
                        <span class="match-key">${m.key}</span>
                        <div class="arrow-line"></div>
                    </div>
                    <div class="visual-node" style="border-color:#0284c7; background:#f0f9ff;">
                        <div class="node-page" style="color:#0284c7;">Current Page</div>
                        <div class="node-col" style="color:#0369a1;">${m.targetCol}</div>
                    </div>
                </div>
            `;
        });

        let backdrop = document.getElementById('linkDetailsBackdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'linkDetailsBackdrop';
            backdrop.className = 'link-details-backdrop';
            backdrop.onclick = function(e) {
                if (e.target === backdrop) window.closeLinkDetailsModal();
            };
            document.body.appendChild(backdrop);
        }

        backdrop.innerHTML = `
            <div class="link-details-dialog" role="dialog" aria-modal="true" aria-labelledby="linkDialogTitle">
                <div class="link-details-header">
                    <div class="link-details-title-wrap">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        <span class="link-details-title" id="linkDialogTitle">🔗 Page Link Information &amp; Data Flow</span>
                    </div>
                    <button type="button" class="data-flow-close-btn" onclick="window.closeLinkDetailsModal()" title="Close Guide">✕</button>
                </div>
                <div class="link-details-body">
                    <!-- Page Banner -->
                    <div class="link-page-banner">
                        <div>
                            <div style="font-size:1rem; font-weight:800; color:#0f2942;">📄 ${reg.title}</div>
                            <div style="font-size:0.78rem; color:#64748b; margin-top:2px;">${reg.path}</div>
                        </div>
                        <span class="link-page-badge">Active Page Mapping</span>
                    </div>

                    <!-- Description -->
                    <div style="font-size:0.84rem; color:#475569; line-height:1.45; background:#f8fafc; border-left:3px solid #0284c7; padding:8px 12px; border-radius:0 6px 6px 0;">
                        ${reg.desc}
                    </div>

                    <!-- 1. Column-to-Column Mapping Table -->
                    <div>
                        <div class="link-section-title">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0284c7" stroke-width="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                            <span>1. Linked Data Sources &amp; Column Mapping</span>
                        </div>
                        <div class="link-table-wrapper">
                            <table class="link-data-table">
                                <thead>
                                    <tr>
                                        <th>Current Page Column</th>
                                        <th>Source Page</th>
                                        <th>Source Column</th>
                                        <th>Matching Criteria</th>
                                        <th>Functional Purpose</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tableRowsHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 2. Calculation Rules -->
                    <div>
                        <div class="link-section-title">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#d97706" stroke-width="2.2"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>
                            <span>2. Calculation Rules &amp; Formulas</span>
                        </div>
                        <div class="calc-rules-grid">
                            ${calcsHtml}
                        </div>
                    </div>

                    <!-- 3. Visual Relationship Map -->
                    <div>
                        <div class="link-section-title">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#16a34a" stroke-width="2.2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                            <span>3. Visual Data Relationship Map</span>
                        </div>
                        <div class="visual-map-container">
                            ${mapHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
        backdrop.style.display = 'flex';
    };

    window.closeLinkDetailsModal = function() {
        const backdrop = document.getElementById('linkDetailsBackdrop');
        if (backdrop) backdrop.style.display = 'none';
    };

    // Backward compatibility alias
    window.openDataFlowModal = function(customPage) {
        window.openLinkDetailsModal(customPage);
    };
    window.closeDataFlowModal = function() {
        window.closeLinkDetailsModal();
    };

    // Dynamically ensure notification_system.js is loaded
    if (!document.getElementById('smartNotificationScript')) {
        const nScript = document.createElement('script');
        nScript.id = 'smartNotificationScript';
        nScript.src = 'notification_system.js';
        document.head.appendChild(nScript);
    }

    // Dynamically ensure smart_firebase_sync.js is loaded
    if (!document.getElementById('smartFirebaseSyncScript')) {
        const fbScript = document.createElement('script');
        fbScript.id = 'smartFirebaseSyncScript';
        fbScript.src = 'smart_firebase_sync.js';
        document.head.appendChild(fbScript);
    }

    // Enforce View-Only restrictions when in Viewer mode
    function enforceViewOnlyRestrictions() {
        if (sessionStorage.getItem('portal_view_only') !== 'true') return;

        document.body.classList.add('portal-view-only');

        // Intercept clicks on any edit / add / save / paste / delete buttons
        document.addEventListener('click', function(e) {
            if (sessionStorage.getItem('portal_view_only') !== 'true') return;

            const target = e.target.closest('button, .btn-action, .btn-plan, a');
            if (!target) return;

            const onclickAttr = (target.getAttribute('onclick') || '').toLowerCase();
            const classList = (target.className || '').toLowerCase();
            const btnText = (target.textContent || '').toLowerCase();

            const isBlockedAction = (
                classList.includes('btn-add') ||
                classList.includes('btn-save') ||
                classList.includes('btn-import') ||
                classList.includes('btn-edit') ||
                classList.includes('btn-delete') ||
                onclickAttr.includes('save') ||
                onclickAttr.includes('openadd') ||
                onclickAttr.includes('openpaste') ||
                onclickAttr.includes('delete') ||
                onclickAttr.includes('edit') ||
                btnText.includes('add') ||
                btnText.includes('save') ||
                btnText.includes('paste') ||
                btnText.includes('import') ||
                btnText.includes('delete')
            );

            // Allow Link modal, export, print, filters, nav tabs
            const isAllowed = (
                classList.includes('btn-action-link') ||
                onclickAttr.includes('openlinkdetails') ||
                onclickAttr.includes('export') ||
                onclickAttr.includes('print') ||
                onclickAttr.includes('filter') ||
                onclickAttr.includes('switch') ||
                classList.includes('btn-plan-outline') ||
                classList.includes('btn-nav-tab') ||
                classList.includes('rail-icon-btn')
            );

            if (isBlockedAction && !isAllowed) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                showViewOnlyToast();
            }
        }, true);

        // Disable non-filter inputs
        setTimeout(() => {
            document.querySelectorAll('input:not(#searchInput):not(#singleDateInput):not(#fromDateInput):not(#toDateInput), textarea').forEach(inp => {
                const id = (inp.id || '').toLowerCase();
                if (!id.includes('search') && !id.includes('filter') && !id.includes('date') && !id.includes('month') && !id.includes('year')) {
                    inp.readOnly = true;
                    inp.style.cursor = 'not-allowed';
                    inp.style.opacity = '0.7';
                }
            });
        }, 500);
    }

    function showViewOnlyToast() {
        let toast = document.getElementById('viewOnlyToastAlert');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'viewOnlyToastAlert';
            toast.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#0f2942; color:#ffffff; padding:10px 22px; border-radius:10px; font-size:0.86rem; font-weight:800; z-index:999999; box-shadow:0 8px 24px rgba(15,41,66,0.3); display:flex; align-items:center; gap:8px; pointer-events:none; transition:opacity 0.25s ease; opacity:0;';
            toast.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#38bdf8" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span>🔒 View Only Mode: You can view all data, but data entry and editing are disabled.</span>
            `;
            document.body.appendChild(toast);
        }
        toast.style.opacity = '1';
        clearTimeout(window._viewOnlyToastTimeout);
        window._viewOnlyToastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);
    }

    // Universal Live Clock Engine for Report Pages
    function updateUniversalLiveClock() {
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;

        document.querySelectorAll('#liveDayText, .live-day-text').forEach(el => { el.textContent = dateStr; });
        document.querySelectorAll('#liveTimeText, .live-time-text').forEach(el => { el.textContent = timeStr; });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initFrozenSidebar();
            enforceViewOnlyRestrictions();
            setInterval(updateUniversalLiveClock, 1000);
            updateUniversalLiveClock();
        });
    } else {
        initFrozenSidebar();
        enforceViewOnlyRestrictions();
        setInterval(updateUniversalLiveClock, 1000);
        updateUniversalLiveClock();
    }
})();