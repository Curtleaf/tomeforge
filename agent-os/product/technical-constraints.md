# TomeForge Technical Constraints

This document defines the technical boundaries, limitations, and performance targets for the TomeForge platform. These constraints ensure system reliability, maintainability, and scalability while supporting our data-driven, system-agnostic architecture.

## Table of Contents
1. [Schema Complexity Limits](#schema-complexity-limits)
2. [Performance Budgets](#performance-budgets)
3. [Security Boundaries](#security-boundaries)
4. [Scalability Thresholds](#scalability-thresholds)
5. [Data Constraints](#data-constraints)
6. [API Constraints](#api-constraints)
7. [Frontend Constraints](#frontend-constraints)
8. [Infrastructure Limits](#infrastructure-limits)

---

## Schema Complexity Limits

### Document Structure Constraints

**Maximum Nesting Depth: 3 Levels**

Prevents overly complex queries and maintains document readability.

```typescript
// ✅ ALLOWED: 3 levels deep
{
  configuration: {              // Level 1
    stats: {                    // Level 2
      strength: {               // Level 3
        name: "Strength",
        dataType: "number",
        defaultValue: 10
      }
    }
  }
}

// ❌ NOT ALLOWED: 4+ levels deep
{
  configuration: {              // Level 1
    categories: {               // Level 2
      physical: {               // Level 3
        stats: {                // Level 4
          strength: { ... }     // Level 5
        }
      }
    }
  }
}
```

**Enforcement:**
- Schema validation middleware
- Automated linting during development
- CI/CD validation checks

### Array Size Limits

**Embedded Arrays:**
- **Soft Limit:** 100 items per embedded array
- **Hard Limit:** 1,000 items per embedded array
- **Recommended:** Use separate collections for > 100 items

**Rationale:**
- MongoDB document scans become inefficient with large arrays
- Update operations on large arrays impact performance
- Indexing embedded arrays has limitations

**Examples:**
```typescript
// ✅ GOOD: Reasonable embedded array
interface System {
  stats: StatDefinition[];      // Expected: 6-20 stats
  skills: SkillDefinition[];    // Expected: 10-50 skills
}

// ⚠️ RECONSIDER: Large embedded array
interface Character {
  inventoryItems: Item[];       // Could grow to 1000+ items
  // Better: Use separate InventoryItem collection with characterId reference
}
```

### Document Size Limits

- **MongoDB Hard Limit:** 16MB per document
- **TomeForge Soft Limit:** 1MB per document
- **Warning Threshold:** 500KB per document

**Monitoring:**
- Log warnings when documents exceed 500KB
- Track document size trends in analytics
- Alert on documents approaching 1MB

**Mitigation:**
- Use GridFS for files > 16MB
- Extract large text fields (lore, descriptions) to separate collections
- Use references instead of embedding large subdocuments

### Field Name Constraints

- **Length:** 1-50 characters
- **Allowed Characters:** Letters, numbers, underscores, hyphens
- **Case:** camelCase preferred
- **Reserved Names:** Avoid MongoDB operators (`$set`, `$push`, etc.)

```typescript
// ✅ GOOD field names
{
  characterName: "...",
  maxHitPoints: 100,
  armor_class: 15
}

// ❌ BAD field names
{
  "character name": "...",      // Spaces not allowed
  "$maxHP": 100,                // Dollar sign reserved
  "verylongfieldnamethatshouldbeshortenedformaintainability": true
}
```

---

## Performance Budgets

### API Response Time Targets

**P95 Latency Targets:**
- **Read Operations:** < 200ms
- **Write Operations:** < 500ms
- **Complex Queries:** < 1000ms
- **Batch Operations:** < 2000ms

**Timeout Limits:**
- **API Request Timeout:** 30 seconds
- **Database Query Timeout:** 10 seconds
- **External Service Timeout:** 5 seconds

**Monitoring:**
- Track P50, P95, P99 latencies
- Alert on P95 > 2x target
- Auto-scale on sustained high latency

### Database Performance

**Query Performance:**
- **Simple Index Queries:** < 10ms
- **Aggregation Pipelines:** < 100ms
- **Full Collection Scans:** Avoid (require explicit approval)

**Connection Pooling:**
- **Minimum Pool Size:** 5 connections
- **Maximum Pool Size:** 50 connections
- **Connection Timeout:** 10 seconds

**Indexes:**
- **Maximum per Collection:** 64 (MongoDB limit)
- **Recommended Maximum:** 10 per collection
- **Compound Index Fields:** ≤ 5 fields

### Frontend Performance

**Load Time Targets:**
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1

**Bundle Size Limits:**
- **Initial JavaScript:** < 200KB (gzipped)
- **Initial CSS:** < 50KB (gzipped)
- **Total Page Weight:** < 1MB (excluding media)

**Component Performance:**
- **Component Render Time:** < 16ms (60fps)
- **State Update Latency:** < 100ms
- **List Virtualization:** Required for > 100 items

---

## Security Boundaries

### Authentication & Authorization

**Session Management:**
- **Session Timeout:** 24 hours of inactivity
- **Maximum Session Duration:** 30 days
- **Concurrent Sessions:** 5 per user
- **Token Refresh Window:** 1 hour before expiration

**Password Requirements:**
- **Minimum Length:** 12 characters
- **Complexity:** Must include 3 of 4 (uppercase, lowercase, numbers, symbols)
- **Password History:** Cannot reuse last 5 passwords
- **Max Login Attempts:** 5 within 15 minutes
- **Lockout Duration:** 30 minutes

**Authorization Scopes:**
```typescript
enum Permission {
  // System permissions
  SYSTEM_CREATE = 'system:create',
  SYSTEM_READ = 'system:read',
  SYSTEM_UPDATE = 'system:update',
  SYSTEM_DELETE = 'system:delete',

  // Character permissions
  CHARACTER_CREATE = 'character:create',
  CHARACTER_READ_OWN = 'character:read:own',
  CHARACTER_READ_ALL = 'character:read:all',
  CHARACTER_UPDATE_OWN = 'character:update:own',
  CHARACTER_DELETE_OWN = 'character:delete:own',

  // World permissions
  WORLD_MANAGE = 'world:manage',
  WORLD_INVITE = 'world:invite',

  // Admin permissions
  ADMIN_ALL = 'admin:*'
}
```

### Data Access Patterns

**Row-Level Security:**
- Users can only access their own data by default
- Shared resources require explicit permissions
- Admin users have separate audit trail

**API Rate Limiting:**
- **Anonymous Users:** 10 requests/minute
- **Authenticated Users:** 100 requests/minute
- **Premium Users:** 1000 requests/minute
- **Webhook/Integration:** 10,000 requests/hour

**Data Validation:**
- **All Input Sanitized:** XSS prevention
- **SQL/NoSQL Injection Prevention:** Parameterized queries only
- **File Upload Validation:** Type, size, and content checks
- **Maximum Request Size:** 10MB

### Sensitive Data Handling

**Encryption:**
- **Data at Rest:** AES-256 encryption
- **Data in Transit:** TLS 1.3 minimum
- **Sensitive Fields:** Additional field-level encryption

**Prohibited Data in Logs:**
- Passwords or password hashes
- API keys or tokens
- Payment information
- Personally Identifiable Information (PII)

**Data Retention:**
- **User Data:** Retained while account active + 30 days after deletion request
- **Audit Logs:** 1 year retention
- **Backups:** 90 days retention
- **Anonymous Analytics:** Indefinite (aggregated only)

---

## Scalability Thresholds

### Transition Triggers

**Monolith to Microservices:**
Trigger migration when:
- Single service > 100k requests/day
- Team size > 5 active developers
- Deployment frequency > 10/day
- Service-specific scaling requirements emerge

**Database Scaling:**

**Vertical Scaling (Increase Instance Size):**
- CPU utilization > 70% sustained
- Memory utilization > 80% sustained
- Disk I/O > 80% capacity

**Horizontal Scaling (Sharding/Read Replicas):**
- Single collection > 100GB
- Query latency P95 > 500ms despite optimization
- Write throughput > 10,000 ops/second

**Caching Layer (Redis):**
Introduce when:
- Repeated queries > 30% of total queries
- Database read latency P95 > 200ms
- Session storage needs exceed memory limits

**Event-Driven Architecture:**
Transition components when:
- Real-time session participants > 10 concurrent users
- Webhook volume > 100 calls/day
- Background job queue depth > 1,000 jobs
- Need for eventual consistency patterns

### Resource Allocation

**Development Environment:**
- MongoDB: 512MB RAM, 2GB storage
- Backend: 1 CPU core, 512MB RAM
- Frontend Dev Server: 1 CPU core, 512MB RAM

**Production Environment (Initial):**
- MongoDB Atlas: M10 (2GB RAM, 10GB storage)
- Backend: 2 CPU cores, 2GB RAM, auto-scale to 4 instances
- Frontend CDN: Global distribution
- Redis: 1GB RAM (when implemented)

**Scaling Plan:**
- Monitor resource utilization weekly
- Scale vertically before horizontal
- Document scaling decisions in runbook

---

## Data Constraints

### Content Limits

**Text Fields:**
- **Short Text (names, titles):** 1-200 characters
- **Medium Text (descriptions):** 1-2,000 characters
- **Long Text (lore, notes):** 1-50,000 characters
- **Maximum Text Field:** 100,000 characters (consider separate collection)

**Numeric Fields:**
- **Integers:** -2,147,483,648 to 2,147,483,647 (32-bit signed)
- **Decimals:** IEEE 754 double precision
- **Currency:** Store as integer cents/pence to avoid floating point issues

**File Uploads:**
- **Maximum File Size:** 50MB per file
- **Total User Storage:** 1GB (free tier), 100GB (premium)
- **Allowed File Types:**
  - Images: .jpg, .png, .gif, .webp
  - Documents: .pdf, .md, .txt
  - Data: .json, .csv
  - VTT: .module, .db (Foundry/Roll20 formats)

### User Limits (Free Tier)

- **Worlds:** 3 per user
- **Systems:** 10 per user
- **Characters:** 50 per user
- **File Storage:** 1GB total
- **API Requests:** 100/minute
- **Concurrent Sessions:** 5

### User Limits (Premium Tier)

- **Worlds:** Unlimited
- **Systems:** Unlimited
- **Characters:** Unlimited
- **File Storage:** 100GB total
- **API Requests:** 1,000/minute
- **Concurrent Sessions:** 20

---

## API Constraints

### Request/Response Formats

**Maximum Request Size:**
- **JSON Payload:** 10MB
- **File Upload:** 50MB
- **Batch Operations:** 100 items per request

**Pagination:**
- **Default Page Size:** 20 items
- **Maximum Page Size:** 100 items
- **Cursor-Based Pagination:** Required for > 1,000 total items

**Filtering:**
- **Maximum Filter Depth:** 3 levels
- **Maximum Filters per Query:** 10
- **Allowed Operators:** `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`, `regex`

### Versioning

**API Version Lifecycle:**
- **Active Support:** Current version + 1 previous version
- **Deprecation Notice:** 6 months before sunset
- **Breaking Changes:** Require major version bump
- **Version Header:** `X-API-Version: 1.0`

### Webhooks

**Delivery Constraints:**
- **Timeout:** 5 seconds
- **Retry Policy:** 3 attempts with exponential backoff (1s, 5s, 25s)
- **Maximum Payload:** 1MB
- **Rate Limit:** 10,000 webhooks/hour per user

**Webhook Events:**
- `character.created`
- `character.updated`
- `character.deleted`
- `system.published`
- `campaign.session_started`

---

## Frontend Constraints

### Browser Support

**Supported Browsers:**
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari (iOS): Last 2 versions
- Chrome Mobile (Android): Last 2 versions

**Unsupported:**
- Internet Explorer (any version)
- Browsers > 2 years old

### Responsive Design Breakpoints

```css
/* Mobile First Approach */
/* Base: 320px - 639px (mobile) */

/* Small tablet: 640px+ */
@media (min-width: 640px) { }

/* Tablet: 768px+ */
@media (min-width: 768px) { }

/* Desktop: 1024px+ */
@media (min-width: 1024px) { }

/* Large desktop: 1280px+ */
@media (min-width: 1280px) { }

/* Extra large: 1536px+ */
@media (min-width: 1536px) { }
```

### Accessibility Requirements

**WCAG 2.1 Level AA Compliance:**
- Color contrast ratio ≥ 4.5:1 for normal text
- Color contrast ratio ≥ 3:1 for large text (18pt+)
- All interactive elements keyboard accessible
- Focus indicators visible
- ARIA labels for complex components
- Screen reader compatibility

### State Management

**Redux/Zustand Store Size:**
- **Maximum Store Size:** 10MB in memory
- **Persisted State:** < 5MB in localStorage
- **Action Payload:** < 1MB

**Local Storage:**
- **Maximum Usage:** 5MB per origin (browser limit ~10MB)
- **Cache Duration:** 7 days for dynamic content, 30 days for static

---

## Infrastructure Limits

### Deployment Constraints

**Container Resources (Docker):**
- **Backend Container:** 2 CPU cores, 2GB RAM, 10GB storage
- **Frontend Build Container:** 1 CPU core, 1GB RAM, 5GB storage
- **Database Container (Dev):** 1 CPU core, 1GB RAM, 20GB storage

**Build Time Limits:**
- **Backend Build:** < 5 minutes
- **Frontend Build:** < 3 minutes
- **Full Monorepo Build:** < 10 minutes
- **CI/CD Pipeline:** < 15 minutes total

### Monitoring & Observability

**Metrics Retention:**
- **High-Resolution Metrics (1-minute intervals):** 7 days
- **Medium-Resolution (5-minute intervals):** 30 days
- **Low-Resolution (1-hour intervals):** 1 year

**Log Retention:**
- **Application Logs:** 30 days
- **Access Logs:** 90 days
- **Error Logs:** 1 year
- **Audit Logs:** 7 years (compliance)

**Alerting Thresholds:**
- **Error Rate:** > 1% of requests
- **P95 Latency:** > 2x target
- **CPU Utilization:** > 80% for 5 minutes
- **Memory Utilization:** > 85% for 5 minutes
- **Disk Usage:** > 80%

---

## Enforcement & Monitoring

### Automated Checks

**Pre-Commit Hooks:**
- TypeScript type checking
- ESLint validation
- Schema complexity linting
- Test coverage verification

**CI/CD Pipeline:**
- All unit tests pass
- Integration tests pass
- Performance benchmarks within budget
- Bundle size within limits
- Security vulnerability scan

**Runtime Monitoring:**
- Request/response size validation
- Query performance tracking
- Document size warnings
- Rate limit enforcement

### Review Requirements

**Manual Review Required For:**
- Schema nesting depth = 3 (max allowed)
- Embedded arrays > 50 items
- API response time > 1 second
- Breaking API changes
- Security-related changes
- Database migration scripts

---

## Exception Process

### Requesting Constraint Exceptions

**When exceptions may be granted:**
- Clear business justification
- No viable alternative approaches
- Documented mitigation plan
- Time-limited exception (with review date)

**Exception Request Template:**
```markdown
## Constraint Exception Request

**Constraint:** [Which constraint needs exception]
**Requested By:** [Your name]
**Date:** [YYYY-MM-DD]

### Justification
[Why is this exception necessary?]

### Alternatives Considered
[What other approaches were evaluated?]

### Mitigation Plan
[How will you minimize the impact?]

### Review Date
[When should this exception be reviewed?]
```

**Approval Required From:**
- Technical lead for technical constraints
- Product owner for business constraints
- Security lead for security-related exceptions

---

## Document Maintenance

**Review Frequency:** Quarterly

**Update Triggers:**
- New performance bottlenecks identified
- Scaling thresholds reached
- Technology stack changes
- Regulatory compliance changes

**Last Updated:** 2025-10-17
**Document Version:** 1.0.0
**Next Review Date:** 2026-01-17
