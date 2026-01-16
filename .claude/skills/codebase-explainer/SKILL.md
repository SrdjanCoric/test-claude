---
name: codebase-explainer
description: Generates comprehensive codebase documentation for developer onboarding. Use when a developer needs to understand a new project, ramp up on a codebase, learn how a system is built, understand architecture decisions, or get up to speed quickly on a new team. Triggers on requests to explain a codebase, document a project, create onboarding docs, or help understand how a system works.
---

# Codebase Explainer

Generate comprehensive documentation to help developers ramp up on a codebase quickly. Produce the kind of documentation that answers: "What do I need to know to start contributing?"

## Analysis Process

1. **Explore project structure** - `tree` or `find` to understand layout
2. **Read configuration files** - package.json, requirements.txt, Dockerfile, etc.
3. **Identify entry points** - main files, routes, handlers
4. **Trace key flows** - follow a request through the system
5. **Document patterns** - identify conventions used throughout
6. **Generate documentation** using the template below

## Output Template

Generate a document covering these sections:

---

# [Project Name] - Developer Onboarding Guide

## 1. Project Overview

### What is this?
- One paragraph explaining what the project does
- The problem it solves
- Who uses it

### Tech Stack
| Layer | Technology |
|-------|------------|
| Language | e.g., TypeScript 5.x |
| Framework | e.g., Next.js 14 |
| Database | e.g., PostgreSQL 15 |
| Cache | e.g., Redis |
| Queue | e.g., Bull/RabbitMQ |
| Cloud | e.g., AWS (ECS, RDS, S3) |

### Key Dependencies
List critical libraries and why they're used:
- `prisma` - ORM for database access
- `zod` - Runtime validation
- `tanstack-query` - Server state management

---

## 2. Architecture

### High-Level Overview
```
[User] → [CDN] → [Load Balancer] → [App Servers] → [Database]
                                  ↘ [Cache]
                                  ↘ [Queue] → [Workers]
```

### System Components
Describe each major component:
- **API Server**: Handles HTTP requests, authentication
- **Worker Service**: Processes background jobs
- **Scheduler**: Runs cron tasks

### Data Flow
Trace a typical request through the system:
1. Request hits `/api/orders`
2. Auth middleware validates JWT
3. Controller calls OrderService
4. Service queries database via repository
5. Response serialized and returned

---

## 3. Project Structure

```
project/
├── src/
│   ├── api/           # Route handlers
│   ├── services/      # Business logic
│   ├── repositories/  # Data access
│   ├── models/        # Data models/types
│   ├── middleware/    # Express/framework middleware
│   ├── utils/         # Helper functions
│   ├── config/        # Configuration
│   └── jobs/          # Background workers
├── tests/
│   ├── unit/
│   └── integration/
├── scripts/           # Build/deploy scripts
└── docs/              # Additional documentation
```

### Key Directories Explained
- `src/api/` - Each file = one route group (users.ts, orders.ts)
- `src/services/` - One service per domain entity
- `src/repositories/` - Database queries, one per table/collection

---

## 4. Getting Started

### Prerequisites
- Node.js >= 18
- Docker & Docker Compose
- PostgreSQL 15 (or use Docker)

### Initial Setup
```bash
# Clone and install
git clone <repo>
cd project
npm install

# Environment setup
cp .env.example .env
# Edit .env with your values

# Database setup
docker-compose up -d postgres
npm run db:migrate
npm run db:seed

# Start development
npm run dev
```

### Verify Setup
```bash
# Run tests
npm test

# Check API
curl http://localhost:3000/health
```

---

## 5. Development Workflow

### Branch Strategy
- `main` - Production
- `develop` - Integration branch
- `feature/*` - New features
- `fix/*` - Bug fixes

### Making Changes
1. Create branch from `develop`
2. Make changes with tests
3. Run `npm run lint && npm test`
4. Open PR to `develop`
5. Get code review approval
6. Squash and merge

### Code Review Checklist
- [ ] Tests added/updated
- [ ] Types complete
- [ ] Error handling present
- [ ] No console.logs
- [ ] Migrations if DB changes

---

## 6. Conventions & Patterns

### Naming Conventions
| Type | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `user-service.ts` |
| Classes | PascalCase | `UserService` |
| Functions | camelCase | `getUserById` |
| Constants | UPPER_SNAKE | `MAX_RETRIES` |
| DB Tables | snake_case | `user_sessions` |

### Code Patterns

**Service Pattern:**
```typescript
class OrderService {
  constructor(private repo: OrderRepository) {}
  
  async create(data: CreateOrderDTO): Promise<Order> {
    // Validation
    // Business logic
    // Persistence
  }
}
```

**Error Handling:**
```typescript
// Use custom error classes
throw new NotFoundError('Order not found');
throw new ValidationError('Invalid email');

// Caught by global error handler
```

**API Response Format:**
```json
{
  "data": { ... },
  "meta": { "page": 1, "total": 100 }
}
```

---

## 7. Configuration & Environment

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Postgres connection string | Yes |
| `REDIS_URL` | Redis connection | Yes |
| `JWT_SECRET` | Token signing key | Yes |
| `AWS_REGION` | AWS region | No (default: us-east-1) |

### Configuration Files
- `.env` - Local environment (git-ignored)
- `.env.example` - Template with all vars
- `config/` - Runtime configuration loading

---

## 8. Database

### Schema Overview
```
users
├── id (uuid, PK)
├── email (unique)
├── created_at
└── updated_at

orders
├── id (uuid, PK)
├── user_id (FK → users)
├── status (enum)
└── total (decimal)
```

### Migrations
```bash
# Create migration
npm run db:migrate:create add_user_column

# Run migrations
npm run db:migrate

# Rollback
npm run db:migrate:undo
```

### Seeding
```bash
# Seed development data
npm run db:seed

# Seed specific data
npm run db:seed -- --only users
```

---

## 9. Testing

### Test Structure
```
tests/
├── unit/           # Isolated unit tests
│   └── services/
├── integration/    # API/DB tests
│   └── api/
└── fixtures/       # Test data
```

### Running Tests
```bash
# All tests
npm test

# With coverage
npm run test:coverage

# Specific file
npm test -- user-service.test.ts

# Watch mode
npm run test:watch
```

### Writing Tests
```typescript
describe('OrderService', () => {
  it('should create order with valid data', async () => {
    // Arrange
    const data = { ... };
    
    // Act
    const order = await service.create(data);
    
    // Assert
    expect(order.id).toBeDefined();
  });
});
```

---

## 10. Deployment

### Environments
| Env | URL | Branch |
|-----|-----|--------|
| Development | localhost:3000 | - |
| Staging | staging.app.com | develop |
| Production | app.com | main |

### Deployment Process
```bash
# Staging: auto-deploys on merge to develop
# Production: manual approval required

# Trigger production deploy
npm run deploy:prod
```

### Monitoring
- **Logs**: Datadog / CloudWatch
- **Metrics**: Grafana dashboard
- **Errors**: Sentry
- **Uptime**: PagerDuty alerts

---

## 11. Common Tasks

### Add a New API Endpoint
1. Create route in `src/api/`
2. Add service method
3. Add repository method (if DB)
4. Add validation schema
5. Write tests
6. Update API docs

### Add a Database Table
1. Create migration: `npm run db:migrate:create`
2. Define schema in migration
3. Create model in `src/models/`
4. Create repository
5. Run migration

### Add a Background Job
1. Define job in `src/jobs/`
2. Register in job processor
3. Add to queue from service
4. Test with `npm run job:test`

---

## 12. Troubleshooting

### Common Issues

**Port already in use:**
```bash
lsof -i :3000
kill -9 <PID>
```

**Database connection failed:**
- Check DATABASE_URL in .env
- Ensure Postgres is running
- Verify network access

**Tests failing on CI:**
- Check test database exists
- Verify env vars set
- Review migration state

### Getting Help
- Slack: #team-backend
- Wiki: internal.company.com/docs
- On-call: Check PagerDuty schedule

---

## 13. Glossary

| Term | Definition |
|------|------------|
| DTO | Data Transfer Object - validated input |
| Repository | Data access layer abstraction |
| Service | Business logic layer |
| Migration | Database schema change script |

---

## Quick Reference Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
npm run lint:fix     # Fix lint issues

# Database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed data
npm run db:reset     # Drop and recreate

# Testing
npm test             # Run tests
npm run test:watch   # Watch mode
npm run test:cov     # With coverage

# Other
npm run docs         # Generate API docs
npm run typecheck    # Check types
```

---

## Extraction Tips

When analyzing a codebase, look for:

1. **Entry points**: `main.ts`, `index.ts`, `app.ts`, `server.ts`
2. **Routes**: Look for route definitions, controllers
3. **Config**: `package.json` scripts, `tsconfig.json`, Docker files
4. **Patterns**: How are services structured? Error handling?
5. **Database**: ORM config, migrations folder, schema files
6. **Tests**: Test folder structure, mocking patterns
7. **CI/CD**: `.github/workflows/`, `Jenkinsfile`, `gitlab-ci.yml`
8. **Docs**: README, `/docs`, inline comments on complex code