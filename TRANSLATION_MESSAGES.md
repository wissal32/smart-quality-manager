# Smart Quality Manager - API Messages for Translation

## Overview
This document contains all user-facing messages and responses from the Laravel and Node.js backends that need to be translated to French.

---

## 1. AUTHENTICATION MESSAGES

### Registration
- **Laravel** (`AuthController.php:register`):
  - `"User registered successfully."`

### Login
- **Laravel** (`AuthController.php:login`):
  - `"The given data was invalid."`
  - `"User not found."`
  - `"Stored password is invalid."`
  - `"Unable to verify the stored password hash."`
  - `"Invalid password."`
  - `"Login failed due to an internal error."`

- **Node.js** (`authController.js:login`):
  - `"Invalid email or password"`

### Logout
- **Laravel** (`AuthController.php:logout`):
  - `"Logged out successfully."`

---

## 2. USER MANAGEMENT MESSAGES

### Create User
- **Laravel** (`UserController.php:store`):
  - `"User created successfully."`

- **Node.js** (`authController.js:createUser`):
  - `"User created successfully"`

### Read User
- **Laravel** (`AuthController.php:me`):
  - Returns user data (no message)

- **Node.js** (`authController.js:getUserById`):
  - `"User not found"`

### Update User
- **Laravel** (`UserController.php:update`):
  - `"User not found."`
  - `"User updated successfully."`

- **Node.js** (`authController.js:updateUser`):
  - `"User updated successfully"`
  - `"User not found"`
  - `"Email already exists"`

### Delete User
- **Laravel** (`UserController.php:destroy`):
  - `"User not found."`
  - `"You cannot delete your own account."`
  - `"User deleted successfully."`

- **Node.js** (`authController.js:deleteUser`):
  - `"User deleted successfully"`
  - `"User not found"`

### User Creation Errors (Node.js)
- **Node.js** (`authController.js:createUser`):
  - `"Email already exists"`

---

## 3. ACTION MESSAGES

### Create Action
- **Laravel** (`ActionController.php:store`):
  - `"Action created successfully."`

- **Node.js** (`actionController.js:createAction`):
  - `"Action created successfully"`

### Read Action
- **Node.js** (`actionController.js:getActionById`):
  - `"Action not found"`

### Update Action
- **Laravel** (`ActionController.php:update`):
  - `"Action updated successfully."`

- **Node.js** (`actionController.js:updateAction`):
  - `"Action updated successfully"`
  - `"Action not found"`

### Delete Action
- **Laravel** (`ActionController.php:destroy`):
  - `"Action deleted successfully."`

- **Node.js** (`actionController.js:deleteAction`):
  - `"Action deleted successfully"`
  - `"Action not found"`

---

## 4. EQUIPMENT MESSAGES

### Create Equipment
- **Laravel** (`EquipmentController.php:store`):
  - `"Equipment created successfully."`

- **Node.js** (`equipmentController.js:createEquipment`):
  - `"Equipment created successfully"`

### Read Equipment
- **Node.js** (`equipmentController.js:getEquipmentById`):
  - `"Equipment not found"`

### Update Equipment
- **Laravel** (`EquipmentController.php:update`):
  - `"Equipment updated successfully."`

- **Node.js** (`equipmentController.js:updateEquipment`):
  - `"Equipment updated successfully"`
  - `"Equipment not found"`

### Delete Equipment
- **Laravel** (`EquipmentController.php:destroy`):
  - `"Equipment deleted successfully."`

- **Node.js** (`equipmentController.js:deleteEquipment`):
  - `"Equipment deleted successfully"`
  - `"Equipment not found"`

---

## 5. INCIDENT MESSAGES

### Create Incident
- **Laravel** (`IncidentController.php:store`):
  - `"Incident created successfully."`

- **Node.js** (`incidentController.js:createIncident`):
  - `"Incident created successfully"`

### Read Incident
- **Node.js** (`incidentController.js:getIncidentById`):
  - `"Incident not found"`

### Update Incident
- **Laravel** (`IncidentController.php:update`):
  - `"Incident updated successfully."`

- **Node.js** (`incidentController.js:updateIncident`):
  - `"Incident updated successfully"`
  - `"Incident not found"`

### Delete Incident
- **Laravel** (`IncidentController.php:destroy`):
  - `"Incident deleted successfully."`

- **Node.js** (`incidentController.js:deleteIncident`):
  - `"Incident deleted successfully"`
  - `"Incident not found"`

---

## 6. IDEA MESSAGES

### Create Idea
- **Laravel** (`IdeaController.php:store`):
  - `"Idea created successfully."`

- **Node.js** (`ideaController.js:createIdea`):
  - `"Idea created successfully"`

### Read Idea
- **Node.js** (`ideaController.js:getIdeaById`):
  - `"Idea not found"`

### Update Idea
- **Laravel** (`IdeaController.php:update`):
  - `"Idea updated successfully."`

- **Node.js** (`ideaController.js:updateIdea`):
  - `"Idea updated successfully"`
  - `"Idea not found"`

### Delete Idea
- **Laravel** (`IdeaController.php:destroy`):
  - `"Idea deleted successfully."`

- **Node.js** (`ideaController.js:deleteIdea`):
  - `"Idea deleted successfully"`
  - `"Idea not found"`

---

## 7. 5S AUDIT MESSAGES

### Create 5S Audit
- **Laravel** (`FiveSAuditController.php:store`):
  - `"5S audit created successfully."`

### Update 5S Audit
- **Laravel** (`FiveSAuditController.php:update`):
  - `"5S audit updated successfully."`

### Delete 5S Audit
- **Laravel** (`FiveSAuditController.php:destroy`):
  - `"5S audit deleted successfully."`

---

## 8. AUTHENTICATION & AUTHORIZATION ERRORS

### Middleware Messages

#### CheckRole Middleware (Laravel - `app/Http/Middleware/CheckRole.php`)
- `"Unauthenticated."`
- `"Forbidden. You do not have access to this resource."`

#### AuthMiddleware (Node.js - `middleware/authMiddleware.js`)
- `"Authorization token is required"`
- `"User no longer exists"`

#### RoleMiddleware (Node.js - `middleware/roleMiddleware.js`)
- `"Authentication required"`
- `"You do not have permission to perform this action"`

---

## 9. VALIDATION ERROR MESSAGES

The following validation error messages are generated by Laravel's validation system:
- `"errors"` (field-level validation errors returned in `$validator->errors()`)

The following validation error messages are generated by Node.js validators:
- Messages are thrown as `AppError` with specific error codes
- Field-level validation errors may be returned based on `requireFields` and `ensureAllowedValue` utilities

---

## 10. UNIQUE MESSAGE SUMMARY

### Distinct Messages (English):

1. User registered successfully.
2. The given data was invalid.
3. User not found.
4. Stored password is invalid.
5. Unable to verify the stored password hash.
6. Invalid password.
7. Login failed due to an internal error.
8. Invalid email or password
9. Logged out successfully.
10. User created successfully.
11. You cannot delete your own account.
12. User updated successfully.
13. User deleted successfully.
14. Email already exists
15. Action created successfully.
16. Action updated successfully.
17. Action deleted successfully.
18. Action not found
19. Equipment created successfully.
20. Equipment updated successfully.
21. Equipment deleted successfully.
22. Equipment not found
23. Incident created successfully.
24. Incident updated successfully.
25. Incident deleted successfully.
26. Incident not found
27. Idea created successfully.
28. Idea updated successfully.
29. Idea deleted successfully.
30. Idea not found
31. 5S audit created successfully.
32. 5S audit updated successfully.
33. 5S audit deleted successfully.
34. Unauthenticated.
35. Forbidden. You do not have access to this resource.
36. Authorization token is required
37. User no longer exists
38. Authentication required
39. You do not have permission to perform this action

---

## 11. IMPLEMENTATION NOTES

### For Laravel (back/):
- Messages are hardcoded in controllers
- Recommendation: Create Laravel language files in `resources/lang/en/` and `resources/lang/fr/`
- Use Laravel's `trans()` or `__()` helper functions
- Consider using `resources/lang/en/messages.php` for API messages

### For Node.js (back/backend/):
- Messages are hardcoded in controllers and middleware
- Recommendation: Create a `locales/en.json` and `locales/fr.json` file structure
- Use i18n library (e.g., `i18next`, `accept-language`) for language detection
- Messages are typically in `AppError` exceptions

### Language Codes to Support:
- **English (en)**: "en" or "en-US"
- **French (fr)**: "fr" or "fr-FR"

---

## 12. DYNAMIC VALUES TO CONSIDER

The following are not static messages but may need consideration for multilingual support:

- **Field names**: "role", "email", "password", "name", "department", "priority", "status", "severity", etc.
- **Enum values**: "admin", "quality_manager", "employee", "low", "medium", "high", "pending", "approved", "rejected", etc.
- **Validation rule messages**: May be generated by validation frameworks

---

## 13. MISSING LANGUAGE FILES

**Current Status**: No language files currently exist in the project.

### Files to Create:

#### Laravel:
```
resources/
  lang/
    en/
      auth.php
      messages.php
    fr/
      auth.php
      messages.php
```

#### Node.js:
```
backend/
  locales/
    en.json
    fr.json
```

---

## 14. PRIORITY RANKING

### High Priority (Used frequently):
- User registration/login messages
- CRUD success/failure messages for main entities
- Authentication errors
- Authorization errors

### Medium Priority (Used occasionally):
- Specific entity not found messages
- Password/email validation errors
- Permission-specific messages

### Low Priority (Edge cases):
- Hash verification errors
- Internal server errors
- Token expiration messages
