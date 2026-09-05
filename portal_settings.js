/**
 * MEP Portal - System Settings, Themes & View Access Control Manager
 * Handles Light/Dark themes, View-User access restrictions, and Settings Modal
 * Auto-extracted from index.html during Phase 3 modularization
 */
        /* ==========================================================================
           System Settings, Themes & View Access Control Manager
           ========================================================================== */
        const ALL_PORTAL_PAGES = [
            // Complete vs Pending
            { id: "fg_pending", file: "fg_pending_report.html", title: "FG Pending Report (Complete vs Pending)", module: "Complete vs Pending" },

            // All Report Summary
            { id: "prod_plan", file: "production_plan.html", title: "Production Plan", module: "All Report Summary" },
            { id: "monthly_rm", file: "monthly_rm_demand_vs_received.html", title: "Monthly RM Demand Vs Received", module: "All Report Summary" },
            { id: "assemble_sum", file: "assemble_summary.html", title: "Assemble Summary", module: "All Report Summary" },
            { id: "armature_sum", file: "armature_summary.html", title: "Armature Summary", module: "All Report Summary" },
            { id: "fg_sum", file: "fg_summary.html", title: "FG Summary", module: "All Report Summary" },
            { id: "bom", file: "bom.html", title: "BOM (Bill of Materials)", module: "All Report Summary" },
            { id: "bom_sfg", file: "bom_with_sfg.html", title: "BOM With SFG", module: "All Report Summary" },

            // Daily Check Report
            { id: "daily_fg_entry", file: "daily_fg_production_entry.html", title: "Daily FG Production Entry", module: "Daily Check Report" },
            { id: "daily_prod_assemble", file: "daily_production_received_assemble.html", title: "Daily Production Received Assemble (All)", module: "Daily Check Report" },
            { id: "daily_plan", file: "daily_production_plan.html", title: "Daily Production Plan", module: "Daily Check Report" },
            { id: "floor_stock", file: "check_floor_stock.html", title: "Check Floor Stock", module: "Daily Check Report" },
            { id: "fg_need", file: "check_fg_need_item.html", title: "Check FG Need Item", module: "Daily Check Report" },
            { id: "rm_possible", file: "check_rm_prd_possible.html", title: "Check RM Prd Possible", module: "Daily Check Report" },
            { id: "fan_damage_entry", file: "fan_damage_calculation_entry.html", title: "Fan Damage Calculation Entry", module: "Daily Check Report" },

            // Report All Branch Fan
            { id: "all_section_sfg", file: "report_all_section_sfg.html", title: "All Section SFG", module: "Report All Branch Fan" },

            // Closing (ERP)
            { id: "fan_assemble_erp", file: "fan_assemble_erp.html", title: "Fan Assemble (Closing ERP)", module: "Closing (ERP)" },
            { id: "armature_winding_erp", file: "armature_winding_erp.html", title: "Armature & Winding (Closing ERP)", module: "Closing (ERP)" },
            { id: "closing_fg", file: "closing_finish_good_fg.html", title: "Finish Good FG (Closing ERP)", module: "Closing (ERP)" },
            { id: "closing_all_sfg", file: "closing_all_sfg.html", title: "Closing All SFG (Closing ERP)", module: "Closing (ERP)" },
            { id: "store_pos", file: "store_position_report.html", title: "Store Position Report", module: "Closing (ERP)" },

            // Monthly Reports
            { id: "monthly_prod_phys", file: "monthly_production_summary_physical.html", title: "Monthly Production Summary (Physical)", module: "All Monthly Report" },
            { id: "monthly_dmg", file: "monthly_damage_summary.html", title: "Monthly Damage Summary", module: "All Monthly Report" },

            // Yearly Reports
            { id: "yearly_prod_phys", file: "yearly_production_summary_physical.html", title: "Yearly Production Summary (Physical)", module: "All Yearly Report" },
            { id: "yearly_prod_erp", file: "yearly_production_summary_erp.html", title: "Yearly Production Summary (ERP)", module: "All Yearly Report" },
            { id: "yearly_dmg", file: "yearly_damage_summary.html", title: "Yearly Damage Summary", module: "All Yearly Report" },

            // Master Database
            { id: "master_db", file: "master.html", title: "Master Database (System Master)", module: "Master Database" }
        ];

        function getViewPermissionsMap() {
            const raw = localStorage.getItem('portal_view_page_permissions');
            if (raw) {
                try { return JSON.parse(raw); } catch(e) {}
            }
            const def = {};
            ALL_PORTAL_PAGES.forEach(p => { def[p.file] = true; });
            return def;
        }

        function switchSettingsTab(tab) {
            const tabTheme = document.getElementById('settingsTabTheme');
            const tabAccess = document.getElementById('settingsTabAccess');
            const paneTheme = document.getElementById('paneThemeMode');
            const paneAccess = document.getElementById('paneViewAccess');

            if (tab === 'theme') {
                if (tabTheme) tabTheme.classList.add('active');
                if (tabAccess) tabAccess.classList.remove('active');
                if (paneTheme) paneTheme.style.display = 'block';
                if (paneAccess) paneAccess.style.display = 'none';
            } else {
                if (tabTheme) tabTheme.classList.remove('active');
                if (tabAccess) tabAccess.classList.add('active');
                if (paneTheme) paneTheme.style.display = 'none';
                if (paneAccess) paneAccess.style.display = 'block';
                renderViewAccessChecklist();
            }
        }

        function renderViewAccessChecklist(searchQuery) {
            const container = document.getElementById('accessPagesListContainer');
            if (!container) return;

            const perms = getViewPermissionsMap();
            const query = (searchQuery || '').trim().toLowerCase();
            const isViewOnly = (sessionStorage.getItem('portal_view_only') === 'true');

            let html = '';
            let totalFiltered = 0;

            ALL_PORTAL_PAGES.forEach(p => {
                const isChecked = perms[p.file] !== false;

                if (query) {
                    const match = p.title.toLowerCase().includes(query) ||
                                  p.file.toLowerCase().includes(query) ||
                                  p.module.toLowerCase().includes(query);
                    if (!match) return;
                }

                totalFiltered++;
                html += `
                    <div class="access-page-item ${!isChecked ? 'is-blocked' : ''}" onclick="toggleAccessRow(event, 'perm_${p.id}')">
                        <div class="access-item-left">
                            <input type="checkbox" class="access-checkbox" id="perm_${p.id}" data-file="${p.file}" ${isChecked ? 'checked' : ''} ${isViewOnly ? 'disabled' : ''} onclick="event.stopPropagation(); onAccessCheckboxChanged();">
                            <div>
                                <div class="access-item-title">${p.title}</div>
                                <div class="access-item-file">${p.file}</div>
                            </div>
                        </div>
                        <span class="access-item-mod-badge">${p.module}</span>
                    </div>
                `;
            });

            if (totalFiltered === 0) {
                html = `
                    <div style="padding: 30px; text-align: center; color: #94a3b8; font-weight: 600; font-size: 0.85rem;">
                        No pages found matching "${searchQuery || ''}"
                    </div>
                `;
            }

            container.innerHTML = html;
            updateAccessPermCount();
        }

        function toggleAccessRow(event, checkboxId) {
            if (sessionStorage.getItem('portal_view_only') === 'true') return;
            const chk = document.getElementById(checkboxId);
            if (chk && event.target !== chk) {
                chk.checked = !chk.checked;
                onAccessCheckboxChanged();
            }
        }

        function onAccessCheckboxChanged() {
            updateAccessPermCount();
            document.querySelectorAll('.access-page-item').forEach(item => {
                const chk = item.querySelector('.access-checkbox');
                if (chk) {
                    item.classList.toggle('is-blocked', !chk.checked);
                }
            });
        }

        function updateAccessPermCount() {
            const countEl = document.getElementById('accessPermCount');
            if (!countEl) return;
            const checkboxes = document.querySelectorAll('#accessPagesListContainer .access-checkbox');
            let allowed = 0;
            checkboxes.forEach(c => { if (c.checked) allowed++; });
            countEl.textContent = `${allowed} of ${checkboxes.length} pages allowed`;
        }

        function toggleAllViewPermissions(val) {
            if (sessionStorage.getItem('portal_view_only') === 'true') return;
            document.querySelectorAll('#accessPagesListContainer .access-checkbox').forEach(chk => {
                chk.checked = !!val;
            });
            onAccessCheckboxChanged();
        }

        function filterAccessPages(val) {
            renderViewAccessChecklist(val);
        }

        function saveViewPermissions() {
            if (isCurrentUserViewOnly()) {
                alert("Security Alert: View-Only user is not authorized to modify access permissions.");
                return;
            }

            const currentMap = getViewPermissionsMap();
            let allowedCount = 0;
            let blockedCount = 0;

            document.querySelectorAll('.access-checkbox').forEach(chk => {
                const file = chk.getAttribute('data-file');
                if (file) {
                    currentMap[file] = chk.checked;
                }
            });

            ALL_PORTAL_PAGES.forEach(p => {
                if (currentMap[p.file] !== false) allowedCount++;
                else blockedCount++;
            });

            localStorage.setItem('portal_view_page_permissions', JSON.stringify(currentMap));

            // Log Admin activity to Notification System
            if (typeof window.logSystemChange === 'function') {
                window.logSystemChange({
                    page: "View Access Control",
                    module: "Settings & Security",
                    type: "Access Control Changed",
                    badgeColor: "#d97706",
                    badgeBg: "#fef3c7",
                    title: "View User Access Permissions Updated",
                    description: `Admin updated permissions for 'View' role: ${allowedCount} pages accessible, ${blockedCount} pages restricted.`,
                    timestamp: new Date().toLocaleString()
                });
            }

            alert("View User Access Permissions saved and applied successfully!");
            closeSettingsModal();
        }

        function openSettingsModal() {
            resetInactivityTimer();
            const modal = document.getElementById('settingsModalBackdrop');
            if (modal) {
                modal.style.display = 'flex';
                updateThemeUI(localStorage.getItem('mep_portal_theme') || 'light');
                const isViewOnly = isCurrentUserViewOnly();
                const tabAccess = document.getElementById('settingsTabAccess');
                if (tabAccess) {
                    tabAccess.style.display = isViewOnly ? 'none' : 'inline-flex';
                }
                const paneAccess = document.getElementById('paneViewAccess');
                if (isViewOnly && paneAccess) {
                    paneAccess.style.display = 'none';
                }
                switchSettingsTab('theme');
            }
        }

        function closeSettingsModal() {
            const modal = document.getElementById('settingsModalBackdrop');
            if (modal) modal.style.display = 'none';
        }

        function setAppTheme(theme) {
            if (theme !== 'dark' && theme !== 'light') theme = 'light';
            localStorage.setItem('mep_portal_theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
            document.body.setAttribute('data-theme', theme);
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
            updateThemeUI(theme);
        }

        function updateThemeUI(theme) {
            const optLight = document.getElementById('themeOptLight');
            const optDark = document.getElementById('themeOptDark');
            if (optLight && optDark) {
                optLight.classList.toggle('active', theme === 'light');
                optDark.classList.toggle('active', theme === 'dark');
            }
        }

        function initTheme() {
            const savedTheme = localStorage.getItem('mep_portal_theme') || 'light';
            setAppTheme(savedTheme);
        }

// Expose globally for portal and hubs
window.ALL_PORTAL_PAGES = ALL_PORTAL_PAGES;
window.getViewPermissionsMap = getViewPermissionsMap;
window.renderViewAccessChecklist = renderViewAccessChecklist;
window.toggleAccessRow = toggleAccessRow;
window.onAccessCheckboxChanged = onAccessCheckboxChanged;
window.updateAccessPermCount = updateAccessPermCount;
window.toggleAllViewPermissions = toggleAllViewPermissions;
window.filterAccessPages = filterAccessPages;
window.saveViewPermissions = saveViewPermissions;
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.setAppTheme = setAppTheme;
window.updateThemeUI = updateThemeUI;
window.initTheme = initTheme;
