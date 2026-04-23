# Collaborator Agent Module (Exported)

This package contains the complete logic for a Brand ↔ Influencer matchmaking and collaboration platform, extracted from the Nurotra ecosystem and stripped of "Nuro" branding.

## Package Structure

### Backend (`/backend`)
- **Models**: `User`, `Brand`, `Influencer`, `Chat`, `Message`, `Deliverable`.
- **Routes**:
  - `/brand`: Profile management for brands.
  - `/influencer`: Profile management for influencers.
  - `/match`: Automated matchmaking logic for both parties.
  - `/chat`: Real-time conversation management.
  - `/message`: Message persistence.
  - `/deliverable`: Proof-of-work tracking.
- **Middleware**: `authMiddleware` for JWT protection.
- **Utils**: `eventLogger` for tracking user progress.

### Frontend (`/frontend`)
- **Pages**:
  - `collabLanding`: The entry point for the agent.
  - `InfluencerDashboard` & `brandDashboard`: Role-specific control centers.
  - `InfluencerMatchingForm` & `BrandMatchingForm`: Onboarding and matchmaking criteria.
  - `MatchResultPage`: AI-sorted list of potential partners.
  - `ChatPage`: Detailed negotiation and communication interface.
- **Components**: Shared UI like `Header`, `Footer`, `BackgroundEffects`, `CurrencySelector`.
- **Contexts**:
  - `AuthContext`: Manages login and roles.
  - `SocketContext`: Handles real-time WebRTC and Chat notifications.
  - `CollabCoreContext`: Simplified state for unread messages and loading.
- **Services**: `apiService` for all backend communication.

## How to Integrate

1. **Environment Variables**:
   - `VITE_API_URL`: Point to your backend server.
   - `JWT_SECRET`: Used for authentication.

2. **Database**:
   - Set up a MongoDB instance.
   - The schemas are provided in `backend/models`.

3. **Authentication**:
   - The frontend uses `localStorage` (`collaborator_user`) to store JWTs.
   - Ensure your main App handles login/signup or use the provided logic in `AuthContext`.

4. **Real-time**:
   - Requires a Socket.io server on the backend.
   - The frontend `SocketContext` is ready to connect and handle chat/calls.

5. **Branding**:
   - Replace `frontend/assets/CollaboratorLogo.png` with your own logo.
   - Customize `frontend/styles/collab.css` for your brand colors.

## Features Removed
- Nuro AI Orchestrator integration (Interventions, Nuro Lab, Thinking states).
- Shared workspace file analysis (unless re-implemented).
- Global Nuro mentorship guides.
