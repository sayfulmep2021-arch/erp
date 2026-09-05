/**
 * ============================================================================
 * SMART TIME MANAGEMENT - Unified Notification & Change History System
 * ============================================================================
 * Features:
 * 1. Persistent Red Dot on Notification Button until opened
 * 2. Complete Edit History (Page Name, Module, Change Type, Link Details, Formulas)
 * 3. Dynamic Logging Engine (window.logSystemChange)
 * 4. Cross-tab Real-time Synchronization
 */

(function() {
    const NOTIF_STORAGE_KEY = 'mep_notification_history';
    const NOTIF_UNREAD_KEY = 'mep_notification_unread';

    const INITIAL_LOGS = [
        {
            id: "notif_5",
            page: "View Access Control",
            module: "Settings & Security",
            type: "Access Control Activated",
            badgeColor: "#059669",
            badgeBg: "#d1fae5",
            title: "View Role Page Permissions Activated",
            linkDetails: null,
            description: "System Administrator can now control which pages are accessible or hidden/blocked for 'View' login users directly from the Settings modal.",
            timestamp: "06-Sep-2026 09:30 AM",
            isUnread: true
        },
        {
            id: "notif_4",
            page: "Smart Time Management Portal",
            module: "Executive System",
            type: "Design Changed",
            badgeColor: "#0284c7",
            badgeBg: "#e0f2fe",
            title: "Header Branding & Borderless Menu System",
            linkDetails: null,
            description: "Updated top header brand to 'Smart Time Management', removed sidebar menu borders, and integrated live Update History notification drawer.",
            timestamp: "03-Sep-2026 04:00 PM",
            isUnread: true
        },
        {
            id: "notif_3",
            page: "Daily Production Received Assemble (All)",
            module: "Daily Check Report",
            type: "Formula Changed",
            badgeColor: "#7c3aed",
            badgeBg: "#f3e8ff",
            title: "TOTAL Formula Updated to Include Opening",
            linkDetails: {
                currentPage: "Daily Production Received Assemble (All)",
                currentColumn: "TOTAL",
                linkedFrom: "Opening + All Month Dates (01..Last Day)",
                sourcePage: "Assemble Summary & Armature Summary",
                sourceColumn: "Production Received -> ERP",
                matching: "Item Code -> Item Code"
            },
            description: "Formula: TOTAL = Opening + Day 01 + Day 02 + ... + Month Last Day. Opening value is strictly included in Total across all rows.",
            timestamp: "03-Sep-2026 03:55 PM",
            isUnread: true
        },
        {
            id: "notif_2",
            page: "Daily FG Production Entry",
            module: "Daily Check Report",
            type: "Data Entry System Updated",
            badgeColor: "#0284c7",
            badgeBg: "#e0f2fe",
            title: "Date Filter & Excel Export Enhanced",
            linkDetails: null,
            description: "Date Filter Added (Single Date & Date Range). Excel Download font formatted to Times New Roman. Clean borderless design.",
            timestamp: "03-Sep-2026 03:15 PM",
            isUnread: true
        },
        {
            id: "notif_1",
            page: "Check Floor Stock",
            module: "Daily Check Report",
            type: "Formula Changed",
            badgeColor: "#d97706",
            badgeBg: "#fef3c7",
            title: "Store Qty Formula & ERP Linkup",
            linkDetails: {
                currentPage: "Check Floor Stock",
                currentColumn: "Store Qty",
                linkedFrom: "Closing ERP",
                sourcePage: "Store Position Report",
                sourceColumn: "Store Qty",
                matching: "Item Code -> Item Code"
            },
            description: "Store Qty is now 100% dynamically linked with Closing ERP Store Position Report via Item Code matching.",
            timestamp: "03-Sep-2026 03:48 PM",
            isUnread: true
        }
    ];

    function getHistory() {
        const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch (e) {
                console.error("Error reading notification history:", e);
            }
        }
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(INITIAL_LOGS));
        localStorage.setItem(NOTIF_UNREAD_KEY, 'true');
        return INITIAL_LOGS;
    }

    function saveHistory(list) {
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(list));
    }

    function isUnread() {
        const list = getHistory();
        const hasUnreadItem = list.some(item => item.isUnread === true);
        const state = localStorage.getItem(NOTIF_UNREAD_KEY);
        if (state === null) {
            return hasUnreadItem;
        }
        return state === 'true' || hasUnreadItem;
    }

    function setUnreadState(val) {
        localStorage.setItem(NOTIF_UNREAD_KEY, val ? 'true' : 'false');
        updateAllDots();
    }

    function updateAllDots() {
        const unread = isUnread();
        document.querySelectorAll('.notif-red-dot, .notif-badge-dot').forEach(el => {
            el.style.display = unread ? 'block' : 'none';
        });
    }

    window.logSystemChange = function(changeObj) {
        const list = getHistory();
        const newEntry = {
            id: 'notif_' + Date.now(),
            page: changeObj.page || "Portal",
            module: changeObj.module || "General",
            type: changeObj.type || "Data Edited",
            badgeColor: changeObj.badgeColor || "#0284c7",
            badgeBg: changeObj.badgeBg || "#e0f2fe",
            title: changeObj.title || "System Updated",
            linkDetails: changeObj.linkDetails || null,
            description: changeObj.description || "",
            timestamp: changeObj.timestamp || new Date().toLocaleString(),
            isUnread: true
        };
        list.unshift(newEntry);
        saveHistory(list);
        setUnreadState(true);
        renderNotificationContent();
    };

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
    }

    function renderNotificationContent() {
        const bodyEl = document.getElementById('smartNotifPanelBody') || document.querySelector('#notificationPanel .notif-panel-body');
        if (!bodyEl) return;

        const list = getHistory();
        const unreadItems = list.filter(item => item.isUnread);
        const readItems = list.filter(item => !item.isUnread);

        let html = '';

        if (unreadItems.length > 0) {
            html += `
                <div class="notif-section-header notif-unread-header">
                    <span class="notif-section-dot">??</span>
                    <span class="notif-section-title">UNREAD (${unreadItems.length})</span>
                </div>
            `;
            unreadItems.forEach(item => {
                html += renderItemCard(item, true);
            });
        }

        if (readItems.length > 0) {
            html += `
                <div class="notif-section-header notif-history-header">
                    <span class="notif-section-dot">??</span>
                    <span class="notif-section-title">PREVIOUS HISTORY</span>
                </div>
            `;
            readItems.forEach(item => {
                html += renderItemCard(item, false);
            });
        }

        if (list.length === 0) {
            html = `
                <div style="padding: 40px 20px; text-align: center; color: #94a3b8;">
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8" style="margin-bottom:8px; opacity:0.6;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    <div style="font-weight:700; font-size:0.95rem;">No History Recorded</div>
                    <div style="font-size:0.80rem; margin-top:4px;">All changes will appear here automatically.</div>
                </div>
            `;
        }

        bodyEl.innerHTML = html;
    }

    function renderItemCard(item, isUnread) {
        let linkBoxHtml = '';
        if (item.linkDetails) {
            const ld = item.linkDetails;
            linkBoxHtml = `
                <div class="notif-link-details-box">
                    <div class="notif-link-row">
                        <span class="notif-link-label">Current Page:</span>
                        <span class="notif-link-val">${escapeHtml(ld.currentPage)}</span>
                    </div>
                    <div class="notif-link-row">
                        <span class="notif-link-label">Current Column:</span>
                        <span class="notif-link-val highlight">${escapeHtml(ld.currentColumn)}</span>
                    </div>
                    <div class="notif-link-flow">
                        <div class="flow-line">&larr; Linked From: <strong>${escapeHtml(ld.linkedFrom)}</strong></div>
                        <div class="flow-line">&larr; Source Page: <strong>${escapeHtml(ld.sourcePage)}</strong></div>
                        <div class="flow-line">&larr; Source Column: <strong>${escapeHtml(ld.sourceColumn)}</strong></div>
                    </div>
                    <div class="notif-link-matching">
                        <span>Matching:</span> <strong>${escapeHtml(ld.matching)}</strong>
                    </div>
                </div>
            `;
        }

        return `
            <div class="notif-card ${isUnread ? 'is-unread-card' : ''}">
                <div class="notif-card-meta">
                    <span class="notif-module-badge">${escapeHtml(item.module)}</span>
                    <span class="notif-time-badge">${escapeHtml(item.timestamp)}</span>
                </div>
                <div class="notif-page-title">${escapeHtml(item.page)}</div>
                
                <div class="notif-change-type-pill" style="background:${item.badgeBg || '#e0f2fe'}; color:${item.badgeColor || '#0284c7'};">
                    <span>&#10003;</span> ${escapeHtml(item.type)}
                </div>

                <div class="notif-card-desc">${escapeHtml(item.description)}</div>
                ${linkBoxHtml}
            </div>
        `;
    }

    window.toggleSmartNotificationPanel = function() {
        const panel = document.getElementById('smartNotificationDrawer');
        if (!panel) return;
        const isOpen = panel.classList.contains('active');
        if (isOpen) {
            panel.classList.remove('active');
        } else {
            panel.classList.add('active');
            renderNotificationContent();
            // User opened notifications: mark unread as read and clear red dot
            const list = getHistory();
            list.forEach(i => i.isUnread = false);
            saveHistory(list);
            setUnreadState(false);
        }
    };

    window.closeSmartNotificationPanel = function() {
        const panel = document.getElementById('smartNotificationDrawer');
        if (panel) panel.classList.remove('active');
    };

    window.clearAllNotificationHistory = function() {
        if (confirm("Are you sure you want to clear all notification history?")) {
            localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify([]));
            setUnreadState(false);
            renderNotificationContent();
        }
    };

    // Inject Drawer Markup into DOM if not present
    function ensureNotificationDrawer() {
        if (document.getElementById('smartNotificationDrawer')) return;

        const drawer = document.createElement('div');
        drawer.id = 'smartNotificationDrawer';
        drawer.className = 'smart-notification-drawer';
        drawer.innerHTML = `
            <div class="smart-notif-header">
                <div class="smart-notif-title-area">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    <div style="display:flex; flex-direction:column;">
                        <span class="smart-notif-title">UPDATE HISTORY</span>
                        <span style="font-size:0.72rem; color:#94a3b8; font-weight:600;">Complete Audit &amp; Link Changelog</span>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button type="button" class="smart-notif-clear-btn" onclick="clearAllNotificationHistory()">Clear</button>
                    <button type="button" class="smart-notif-close-btn" onclick="closeSmartNotificationPanel()">&#10005;</button>
                </div>
            </div>
            <div class="smart-notif-body" id="smartNotifPanelBody">
                <!-- Injected dynamically -->
            </div>
        `;
        document.body.appendChild(drawer);
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
        ensureNotificationDrawer();
        getHistory();
        updateAllDots();

        // Listen to storage events from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === NOTIF_STORAGE_KEY || e.key === NOTIF_UNREAD_KEY) {
                updateAllDots();
                renderNotificationContent();
            }
        });
    });

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        ensureNotificationDrawer();
        getHistory();
        updateAllDots();
    }
})();
