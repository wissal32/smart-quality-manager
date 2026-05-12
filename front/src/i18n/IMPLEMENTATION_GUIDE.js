// IMPLEMENTATION GUIDE: Completing French Localization
// Use this pattern for all remaining components

// ============================================
// FRONTEND PAGE COMPONENTS (Actions Pattern)
// ============================================

// Step 1: Add import at the top of the file
import { fr } from '../i18n/fr'

// Step 2: Replace hardcoded English strings with French translations
// Replace:  "Quality Execution"  →  {fr.actions.title}
// Replace:  "Actions Management"  →  {fr.actions.subtitle}
// Replace:  "New Action"  →  {fr.actions.newAction}

// Step 3: Update filter/status labels
const statusLabels = {
  pending: fr.actions.filters.status.pending,
  in_progress: fr.actions.filters.status.inProgress,
  completed: fr.actions.filters.status.completed,
}

// ============================================
// COMPONENT PATTERNS FOR FORMS/TABLES
// ============================================

// For ActionForm, IncidentForm, IdeaForm, etc:
import { fr } from '../i18n/fr'

// Replace form labels:
<label className="label">{fr.actions.form.title}</label>
<label className="label">{fr.actions.form.description}</label>
<label className="label">{fr.actions.form.priority}</label>

// Replace validation messages:
<span className="error-text">{fr.actions.form.titleValidation}</span>

// Replace button text:
<button>{isSubmitting ? fr.actions.form.saving : fr.actions.form.createButton}</button>

// ============================================
// QUICK REFERENCE: Remaining Pages to Update
// ============================================

/*
1. Incidents Page (Incidents.jsx):
   - fr.incidents.title
   - fr.incidents.subtitle
   - fr.incidents.description
   - fr.incidents.reportIncident
   - fr.incidents.filters.*
   - fr.incidents.stats.*
   - fr.incidents.table.*
   - fr.incidents.form.*
   - fr.incidents.messages.*

2. Ideas Page (Ideas.jsx):
   - fr.ideas.title
   - fr.ideas.subtitle
   - fr.ideas.description
   - fr.ideas.submitIdea
   - fr.ideas.stats.*
   - fr.ideas.card.*
   - fr.ideas.form.*
   - fr.ideas.messages.*

3. Equipments Page (Equipments.jsx):
   - fr.equipments.title
   - fr.equipments.stats.*
   - fr.equipments.form.*
   - fr.equipments.messages.*

4. Users Page (Users.jsx):
   - fr.users.title
   - fr.users.stats.*
   - fr.users.form.*
   - fr.users.list.*
   - fr.users.messages.*

5. Audits5S Page (Audits5S.jsx or FiveSAudits.jsx):
   - fr.audits5s.title
   - fr.audits5s.subtitle
   - fr.audits5s.description
   - fr.audits5s.createAudit
   - fr.audits5s.filters.*
   - fr.audits5s.stats.*
   - fr.audits5s.table.*
   - fr.audits5s.form.*
   - fr.audits5s.details.*
   - fr.audits5s.messages.*
*/

// ============================================
// COMPONENT FILES TO UPDATE
// ============================================

/*
In src/components/:

1. Common Components:
   - StatusBadge.jsx - status display translations
   - DataTable.jsx - "Loading...", "No data found."

2. Action Components:
   - ActionTable.jsx - table headers, buttons
   - ActionRow.jsx - row labels, buttons
   - ActionForm.jsx - form labels, validation

3. Incident Components:
   - IncidentTable.jsx - table headers, buttons
   - IncidentForm.jsx - form labels, validation

4. Ideas Components:
   - IdeaCard.jsx - card labels, buttons
   - IdeaForm.jsx - form labels, validation

5. Equipment Components:
   - EquipmentForm.jsx - form labels, validation

6. User Components:
   - UserForm.jsx - form labels, validation
   - UserList.jsx - list labels

7. Audit Components:
   - AuditTable.jsx - table headers, buttons
   - AuditForm.jsx - form labels, validation, 5S steps
*/

// ============================================
// MODAL/DIALOG PATTERN
// ============================================

// Replace modal titles:
{isCreateMode ? fr.actions.form.createTitle : fr.actions.form.editTitle}
{isCreateMode ? fr.actions.form.addNew : fr.actions.form.update}

// Replace modal buttons:
<button className="btn btn-ghost">{fr.common.buttons.cancel}</button>
<button className="btn btn-primary">{isSubmitting ? fr.common.buttons.saving : (isCreateMode ? fr.actions.form.createButton : fr.actions.form.updateButton)}</button>

// ============================================
// TOAST MESSAGES PATTERN
// ============================================

// Replace success/error messages:
toast.success(fr.actions.messages.createSuccess)
toast.error(fr.actions.messages.createError)
toast.success(fr.actions.messages.updateSuccess)
toast.error(fr.actions.messages.updateError)
toast.success(fr.actions.messages.deleteSuccess)
toast.error(fr.actions.messages.deleteError)

// ============================================
// DELETE CONFIRMATION PATTERN
// ============================================

// Replace confirmation dialogs:
`${fr.actions.messages.deleteConfirm}`
// Where deleteConfirm in i18n has placeholder: 'Delete action "{title}"? This action cannot be undone.'

// Use with template:
const confirmMessage = fr.actions.messages.deleteConfirm
  .replace('{title}', item.title)

// ============================================
// BATCH SEARCH & REPLACE COMMANDS
// ============================================

/*
For VSCode Find & Replace:

Incidents Page Status Labels:
- Find: 'open'|'in_progress'|'resolved'
- Look for display strings

Incidents Severity:
- Find: 'low'|'medium'|'high'|'critical'
- Look for severity display

Table Headers:
- Find: '| Title | Status | Priority | Assigned To |'
- Replace with i18n references

Buttons:
- Find: 'Edit|Delete|Create|Update|Save|Cancel'
- Replace with i18n references
*/

// ============================================
// TEST CHECKLIST
// ============================================

/*
After updating each page, verify:

☐ Page title and description are in French
☐ All buttons show French labels
☐ Form labels are in French
☐ Table column headers are in French
☐ Status/severity badges show French text
☐ Validation error messages are in French
☐ Success/error toast messages are in French
☐ Modal titles are in French
☐ No placeholder English text visible
☐ All filters work correctly
☐ Layout and styling unchanged
*/
