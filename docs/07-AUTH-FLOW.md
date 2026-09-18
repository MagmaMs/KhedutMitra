# Authentication Flow & RBAC

## 1. Authentication Mechanism
Authentication is handled entirely via Supabase Auth.

### 1.1 Phone & Password Login
Given the target demographic, Phone Number authentication is preferred over Email.
- **Sign Up:** User provides Phone Number, Password, Name, and selects a Role.
- **OTP (Optional future enhancement):** Supabase supports Twilio/MessageBird integration for OTP verification. For the hackathon MVP, simple Phone + Password is used to reduce friction and cost.

## 2. Role-Based Access Control (RBAC)

We implement two distinct user experiences based on the `role` stored in the `profiles` table.

### 2.1 Farmer Role
- **Access:** Full platform access.
- **Capabilities:**
  - View personalized weather & AI advisory.
  - Create, edit, and delete `crop_listings`.
  - Participate in the community forum.
  - Use the disease detection tool.

### 2.2 Consumer Role
- **Access:** Limited platform access focused on the marketplace.
- **Capabilities:**
  - Browse and search `crop_listings` created by farmers.
  - View farmer profiles to establish trust.
  - Cannot create crop listings.
  - Cannot access farming-specific tools (disease tracker, weather advisory).

## 3. Frontend Implementation
Protected routes are wrapped in a `<ProtectedRoute>` component that verifies the Supabase session. Role-specific routing redirects consumers away from farmer-only dashboards.
