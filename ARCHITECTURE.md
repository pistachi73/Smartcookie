# Project Architecture

This document describes the architecture and folder structure of our application.

## Folder Structure

```
src/
├── app/                             # Next.js App Router pages
├── features/                        # Feature-based organization
│   └── {featureName}/               # Example feature structure
│       ├── components/              # Feature UI components
│       ├── hooks/                   # Feature-specific hooks
│       ├── lib/                     # Feature utilities
│       ├── services/                # Feature services
│       │   └── actions.ts           # Server actions for this feature
│       ├── store/                   # Feature state management
│       ├── use-cases/               # Feature-specific business logic
│       └── types/                   # Feature type definitions
├── shared/                          # Shared code across features
│   ├── components/                  # Shared UI components
│   │   ├── ui/                      # Base UI components
│   │   └── layout/                  # Layout components
│   ├── hooks/                       # Shared hooks
│   ├── lib/                         # Shared utilities
│   ├── services/                    # Shared services
│   ├── use-cases/                   # Shared business logic use cases
│   └── types/                       # Shared type definitions
├── core/                            # Core application code
│   ├── config/                      # App configuration
│   │   ├── env.ts                   # Environment variables
│   │   ├── auth-config.ts           # Auth configuration
│   │   └── app-config.ts            # App configuration
│   ├── providers/                   # React context providers
│   └── stores/                      # Global state management
├── db/                              # Database code
│   ├── schema/                      # Database schema
│   ├── migrations/                  # Database migrations
│   ├── seeds/                       # Seed data
│   └── index.ts                     # Database client
├── emails/                          # Email templates
└── styles/                          # Global styles
```

## Architecture Principles

1. **Feature-First Organization**
   - Code is organized around business features rather than technical functions
   - Each feature has its own components, services, and state management
   - Reduces coupling between unrelated components

2. **Clear Separation of Concerns**
   - UI components are separated from business logic and data access
   - Services handle business logic and API calls
   - Stores manage application state
   - Use cases handle complex business logic specific to each feature

3. **Shared Code**
   - Code that is used by multiple features is moved to the shared directory
   - Common UI components are in shared/components/ui
   - Common layout components are in shared/components/layout

4. **Core Application Code**
   - Configuration and providers are in the core directory
   - Global state management is in core/stores

5. **Use Cases**
   - Each feature has its own use-cases directory for feature-specific business logic
   - Shared use cases are in the shared/use-cases directory
   - Each feature has its own actions.ts file in the services directory for server actions

## Import Conventions

Use the following import paths:

```typescript
// Import from feature
import { SomeComponent } from "@/features/feature-name/components/some-component";

// Import from feature use case
import { someFeatureUseCase } from "@/features/feature-name/use-cases/some-use-case";

// Import from shared
import { Button } from "@/ui/button";

// Import from shared use cases
import { someSharedUseCase } from "@/shared/use-cases/some-use-case";

// Import from core
import { auth } from "@/core/config/auth-config";

// Import from db
import { db } from "@/db";
```

## Adding New Features

To add a new feature:

1. Create a new directory in the features directory
2. Add the necessary subdirectories (components, hooks, lib, services, store, use-cases, types)
3. Create an actions.ts file in the services directory for server actions
4. Implement the feature
5. Update imports to use the new feature path