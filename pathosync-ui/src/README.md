# Healthcare SaaS Platform

A comprehensive laboratory test management SaaS platform with multi-tenancy, collection centers, and Indian healthcare compliance.

## 🚀 Features

- **Multi-Tenant Architecture** - Support for multiple healthcare organizations
- **Collection Centers Management** - Manage multiple collection centers with staff assignments
- **Comprehensive Test Management** - Normal tests, descriptive tests, and test groups
- **Professional Lab Reports** - Generate PDF reports with custom layouts
- **Indian Healthcare Compliance** - GSTIN, PAN, Aadhaar verification support
- **WhatsApp & SMS Integration** - Automated patient communication
- **Subscription Management** - Multiple subscription tiers (Basic, Starter, Professional, Enterprise)
- **Real-time Billing** - Simple and enhanced billing processes
- **User Management** - Role-based access control with permissions
- **Statistics & Analytics** - Comprehensive reporting and analytics

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: React Hooks, Context API
- **Charts**: Recharts
- **Animations**: Motion (Framer Motion)
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite
- **Backend**: Supabase (optional)

## 📦 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/healthcare-saas/platform.git
   cd platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Login Credentials

Use these test credentials to explore different subscription tiers:

- **Basic Plan**: `admin@basic.com` / `password123`
- **Starter Plan**: `admin@starter.com` / `password123`
- **Professional Plan**: `admin@professional.com` / `password123`
- **Enterprise Plan**: `admin@enterprise.com` / `password123`
- **Technician User**: `tech@professional.com` / `password123`

## 📁 Project Structure

```
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   ├── figma/              # Figma import components
│   └── *.tsx               # Feature components
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
├── types/                  # TypeScript type definitions
├── styles/                 # Global styles and Tailwind config
├── database/               # Database schemas and setup
├── supabase/               # Supabase edge functions
└── guidelines/             # Development guidelines
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🎨 Customization

### Tailwind CSS v4 Configuration

The project uses Tailwind CSS v4 with custom design tokens defined in `/styles/globals.css`. You can customize:

- Color schemes (light/dark mode)
- Typography scales
- Component spacing
- Border radius values

### Environment Configuration

Key environment variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Supabase (if using)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Feature Flags
VITE_ENABLE_COLLECTION_CENTERS=true
VITE_ENABLE_MULTI_TENANT=true
```

## 🏗️ Architecture

### Subscription Tiers

- **Basic**: Essential features for small clinics
- **Starter**: Enhanced features with basic reporting
- **Professional**: Full features with collection centers
- **Enterprise**: Complete platform with advanced analytics

### Component Structure

- **Feature Components**: Business logic components (BillingProcess, UserManagement, etc.)
- **UI Components**: Reusable components based on Radix UI
- **Layout Components**: Application shell and navigation
- **Form Components**: React Hook Form integration with validation

### State Management

- **Authentication**: JWT tokens with refresh mechanism
- **Bills Management**: Context-based state for billing workflow
- **Theme**: Dark/light mode with system preference detection
- **User Session**: Persistent authentication with localStorage

## 🔒 Security Features

- JWT-based authentication with automatic token refresh
- Role-based access control (RBAC)
- Subscription-based feature access
- Secure API client with automatic auth headers
- Input validation with Zod schemas

## 📱 Responsive Design

The platform is fully responsive with:
- Mobile-first design approach
- Adaptive navigation for mobile/desktop
- Touch-friendly interfaces
- Progressive Web App (PWA) ready

## 🧪 Testing

The project includes mock data and test utilities for development:

- Mock user accounts with different subscription levels
- Sample test data for laboratory management
- API client with mock endpoints for development

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@healthcare-saas.com
- Documentation: [docs.healthcare-saas.com](https://docs.healthcare-saas.com)
- Issues: [GitHub Issues](https://github.com/healthcare-saas/platform/issues)

## 🙏 Acknowledgments

- [Radix UI](https://radix-ui.com/) for accessible UI primitives
- [shadcn/ui](https://ui.shadcn.com/) for beautiful component designs
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for beautiful icons