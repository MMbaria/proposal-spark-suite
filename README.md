# ProposalPilot: AI-Powered Grant Proposal Assistant

## Mission
Streamline grant proposal creation, collaboration, and submission with AI-driven templates, real-time feedback, and cross-platform integration.

## Features

### ✅ Phase 1: Foundation Components (Implemented)

#### 🏠 **Dashboard & Navigation**
- **Overview Dashboard**: Real-time stats, active proposals, timeline view
- **Tabbed Navigation**: Overview, Proposals, Team, Templates, Timeline
- **Professional UI**: Academic blue palette, elegant shadows, smooth transitions

#### 📝 **Proposal Management**
- **New Proposal Modal**: Guided creation with funder-specific templates
- **Proposal Section Builder**: Dynamic, schema-validated content sections
- **Progress Tracking**: Visual progress indicators and completion status
- **Status Management**: Draft → Review → Submitted → Approved workflow

#### 💰 **Budget Builder**
- **Interactive Budget Creation**: Line-item budget management
- **Funder-Specific Rules**: Automated compliance checking (NIH caps, indirect rates)
- **Cost Categories**: Personnel, Equipment, Travel, Other Direct Costs
- **Real-time Calculations**: Automatic totals and indirect cost calculations

#### 👥 **Team Collaboration**
- **Role-Based Access Control**: Owner, Admin, Writer, Reviewer permissions
- **Team Member Management**: Invite, remove, and manage team members
- **Activity Tracking**: Last activity and join date monitoring
- **Permission Management**: Granular control over editing and submission rights

#### 📋 **Template System**
- **Template Marketplace**: Browse templates by funder, category, and success rate
- **Smart Templates**: AI-generated templates based on funder requirements
- **Template Categories**: Research, Education, Community, Healthcare, etc.
- **Success Metrics**: Track template performance and approval rates

#### ⏰ **Timeline Management**
- **Gantt Chart View**: Visual project timeline with dependencies
- **Task Management**: Assign tasks, track progress, set priorities
- **Milestone Tracking**: Key deadlines and deliverable management
- **Resource Planning**: Estimated vs. actual hours tracking

## Technical Architecture

### 🛠 **Technology Stack**
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: React hooks with local state
- **Backend**: Supabase (authentication, database, real-time)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system

### 🎨 **Design System**
- **Color Palette**: Academic blue (#2563eb) with semantic tokens
- **Typography**: Inter font family with readable hierarchies
- **Shadows**: Elegant depth with primary color accents
- **Animations**: Smooth transitions with cubic-bezier easing
- **Responsive**: Mobile-first design approach

### 📁 **Component Architecture**
```
src/
├── components/
│   ├── proposal/
│   │   ├── ProposalSection.tsx     # Dynamic content sections
│   │   └── NewProposalModal.tsx    # Proposal creation wizard
│   ├── budget/
│   │   └── BudgetBuilder.tsx       # Budget management interface
│   ├── collaboration/
│   │   └── TeamManagement.tsx      # Team collaboration tools
│   ├── templates/
│   │   └── TemplateSystem.tsx      # Template marketplace
│   ├── timeline/
│   │   └── TimelineManager.tsx     # Project timeline management
│   ├── ui/                         # Reusable UI components
│   └── Dashboard.tsx               # Main dashboard container
├── types/
│   └── proposal.ts                 # TypeScript definitions
└── hooks/                          # Custom React hooks
```

## 📊 **Data Models**

### Proposal Structure
```typescript
interface Proposal {
  id: string;
  title: string;
  description: string;
  funder: string;
  category: ProposalCategory;
  deadline: Date;
  status: ProposalStatus;
  progress: number;
  collaborators: Collaborator[];
  sections: ProposalSectionData[];
  budget: ProposalBudget;
  compliance: ComplianceData;
  metadata: ProposalMetadata;
  createdAt: Date;
  updatedAt: Date;
}
```

### Budget Structure
```typescript
interface ProposalBudget {
  totalRequested: number;
  items: BudgetItem[];
  indirectRate: number;
  costSharing: number;
}
```

### Team Member Structure
```typescript
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'writer' | 'reviewer';
  status: 'active' | 'pending' | 'inactive';
  permissions: Permission[];
  joinedAt: Date;
  lastActivity?: Date;
}
```

## 🔜 **Roadmap**

### Phase 2: AI Intelligence & Automation
- [ ] **AI Proposal Builder**: GPT-4 powered content generation
- [ ] **Smart Templates**: Dynamic template creation based on RFP analysis
- [ ] **Compliance Checker**: Real-time requirement validation
- [ ] **Content Suggestions**: AI-powered writing assistance
- [ ] **Literature Integration**: Automatic citation and reference management

### Phase 3: Platform Extensions
- [ ] **Google Docs Integration**: Real-time collaborative editing
- [ ] **Word Add-in**: Desktop integration with AI assistance
- [ ] **ChatGPT Plugin**: Conversational proposal assistance
- [ ] **Notion Integration**: Bidirectional sync with research workflows
- [ ] **API Ecosystem**: Connect with CRMs, funder portals, citation tools

### Phase 4: Advanced Features
- [ ] **Analytics Dashboard**: Success metrics and performance tracking
- [ ] **Training Hub**: Grant writing certification courses
- [ ] **Mobile App**: iOS/Android companion apps
- [ ] **Offline Mode**: Desktop synchronization capabilities
- [ ] **Enterprise Features**: SSO, advanced security, custom branding

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ or Bun
- Modern web browser
- Supabase account (for backend features)

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Configure Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📖 **Usage Guide**

### Creating Your First Proposal
1. Click "New Proposal" button in the dashboard
2. Fill in proposal details (title, funder, deadline)
3. Choose to use AI-generated templates or start from scratch
4. Invite team members and assign roles
5. Build your proposal section by section
6. Track progress and manage deadlines

### Collaboration Workflow
1. **Owner** creates proposal and invites team members
2. **Writers** draft content in assigned sections
3. **Reviewers** provide feedback and suggestions
4. **Admins** manage timeline and coordinate submissions
5. **System** tracks all changes and maintains version history

### Budget Management
1. Add budget categories (Personnel, Equipment, etc.)
2. Enter line items with justifications
3. System calculates indirect costs automatically
4. Export budget tables for proposal inclusion

## 🔒 **Security & Compliance**

- **Data Encryption**: All data encrypted in transit and at rest
- **Role-Based Access**: Granular permission system
- **Audit Logging**: Complete activity tracking
- **SOC 2 Compliance**: Enterprise-grade security standards
- **GDPR Compliant**: Privacy-by-design architecture

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: [docs.proposalpilot.com](https://docs.proposalpilot.com)
- **Community**: [Discord Server](https://discord.gg/proposalpilot)
- **Issues**: [GitHub Issues](https://github.com/proposalpilot/issues)
- **Email**: support@proposalpilot.com

---

**ProposalPilot** - Empowering researchers and organizations to create winning grant proposals with AI-driven intelligence and collaborative workflows.