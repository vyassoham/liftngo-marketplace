# Malviya Nagar Marketplace Implementation Plan

## Executive Summary

Build a production-ready, JSON-driven local business marketplace for 50 Malviya Nagar, Jaipur businesses. The system uses a single marketplace engine with dynamic storefront rendering, supporting food, clothing, jewellery, and other business types through a unified architecture.

## Repository Analysis Results

### Current Stack
- **Next.js**: 16.1.6 (App Router)
- **TypeScript**: Enabled
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Validation**: Zod (already in dependencies)
- **Authentication**: Custom auth system (`src/auth.ts`)
- **Payment**: Razorpay integration exists (`src/lib/razorpay/`)
- **Maps**: Google Maps integration (`src/lib/googleMapsLoader.ts`)
- **Analytics**: PostHog integration
- **Database**: No explicit ORM detected - will add PostgreSQL with Prisma
- **Existing Marketplace**: Khatu marketplace exists as reference (`src/app/khatu/marketplace/`)

### Key Architectural Decisions

1. **Reuse Existing Patterns**: Follow Khatu marketplace patterns for consistency
2. **Database**: Add Prisma with PostgreSQL for production-grade persistence
3. **Authentication**: Leverage existing auth system with role-based access
4. **Payment**: Extend existing Razorpay integration with webhook verification
5. **Maps**: Use existing Google Maps integration for geolocation
6. **Styling**: Follow existing Tailwind patterns and Liftngo branding
7. **State**: Use Zustand for cart and order state management
8. **Validation**: Use Zod for runtime schema validation

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [x] Add marketplace link to landing page
- [x] Define routes in constants
- [ ] Create feature branch
- [ ] Set up Prisma with PostgreSQL
- [ ] Define database schema
- [ ] Create Zod validation schemas
- [ ] Set up environment variables
- [ ] Create data directory structure

### Phase 2: Core Data Layer (Week 2)
- [ ] Create public store data schema
- [ ] Create private merchant data schema
- [ ] Create product catalogue schema
- [ ] Create order and transaction schemas
- [ ] Build data validation utilities
- [ ] Create example data files
- [ ] Build data import scripts
- [ ] Implement data seeding

### Phase 3: Marketplace Pages (Week 3)
- [ ] Build `/malviya-nagar` marketplace page
- [ ] Build `/store/[storeSlug]` dynamic storefront
- [ ] Build `/store/[storeSlug]/product/[productSlug]` product detail
- [ ] Implement category filtering
- [ ] Implement search functionality
- [ ] Add responsive mobile layouts
- [ ] Implement SEO metadata

### Phase 4: Cart & Checkout (Week 4)
- [ ] Build single-store cart system
- [ ] Implement cart persistence
- [ ] Build `/cart` page
- [ ] Build `/checkout` page
- [ ] Implement geolocation flow
- [ ] Integrate address validation
- [ ] Add delivery quotation

### Phase 5: Payment Integration (Week 5)
- [ ] Extend Razorpay integration
- [ ] Implement payment webhook verification
- [ ] Create payment state machine
- [ ] Build payment result page
- [ ] Implement refund support
- [ ] Add payment reconciliation

### Phase 6: Delivery Integration (Week 6)
- [ ] Create Liftngo delivery provider adapter
- [ ] Implement mock delivery provider
- [ ] Build delivery quotation flow
- [ ] Implement delivery booking
- [ ] Create delivery webhook handler
- [ ] Add delivery status tracking

### Phase 7: WhatsApp Integration (Week 7)
- [ ] Create WhatsApp provider adapter
- [ ] Implement mock WhatsApp provider
- [ ] Build merchant notification system
- [ ] Implement customer notifications
- [ ] Add WhatsApp webhook handler
- [ ] Create notification templates

### Phase 8: Order Tracking (Week 8)
- [ ] Build `/order/[publicTrackingToken]` page
- [ ] Implement order state machine
- [ ] Add real-time status updates
- [ ] Build order timeline
- [ ] Implement exception handling
- [ ] Add help and support

### Phase 9: Admin Dashboard (Week 9-10)
- [ ] Build admin authentication
- [ ] Create store management UI
- [ ] Build catalogue management
- [ ] Implement order dashboard
- [ ] Add delivery management
- [ ] Build payment reconciliation
- [ ] Create analytics dashboard
- [ ] Implement merchant onboarding

### Phase 10: Testing & Documentation (Week 11)
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Write E2E tests
- [ ] Create comprehensive documentation
- [ ] Build deployment checklist
- [ ] Create rollback procedures
- [ ] Performance optimization
- [ ] Security audit

## Data Architecture

### Public Data (Browser-Safe)
- Store identity (name, logo, banner)
- Store contact (public phone, address)
- Business hours
- Categories and products
- Prices and offers
- Store theme
- SEO metadata

### Private Data (Server-Only)
- Owner personal information
- Bank account details
- API credentials
- Settlement configuration
- Internal operational notes
- Compliance documents

### Transactional Data (Database)
- Orders and order items
- Customer information (encrypted)
- Payments and refunds
- Delivery jobs
- Webhook events
- Audit logs

## Key Features

### 1. Single-Store Cart
- One cart = one store
- Modal confirmation when switching stores
- Cart persistence across sessions
- Real-time price validation

### 2. Prepaid Orders Only
- No cash on delivery
- Webhook-verified payments
- Server-side amount validation
- Idempotency protection

### 3. Real Delivery Statuses
- No fake timer-based statuses
- Webhook-driven updates
- Actual Liftngo API integration
- Manual admin override capability

### 4. Secure Data Separation
- Three-layer data architecture
- Encrypted sensitive fields
- Role-based access control
- Audit logging

## Technical Specifications

### Database Schema

#### Core Tables
```prisma
model Marketplace {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  locality    String
  city        String
  state       String
  status      MarketplaceStatus
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  stores      Store[]
}

model Store {
  id              String   @id @default(cuid())
  marketplaceId   String
  slug            String   @unique
  status          StoreStatus
  featured        Boolean  @default(false)
  publicConfig    Json     // StorePublicConfig
  privateProfile  Json?    // StorePrivateProfile (server-only)
  marketplace     Marketplace @relation(fields: [marketplaceId], references: [id])
  products        Product[]
  orders          Order[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Product {
  id          String   @id @default(cuid())
  storeId     String
  slug        String
  name        String
  description String?
  config      Json     // Product config (variants, add-ons, pricing)
  status      ProductStatus
  store       Store    @relation(fields: [storeId], references: [id])
  orderItems  OrderItem[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Order {
  id                String   @id @default(cuid())
  publicOrderNumber String   @unique
  publicTrackingToken String @unique
  storeId           String
  customerId        String?
  status            OrderStatus
  paymentStatus     PaymentStatus
  deliveryStatus    DeliveryStatus?
  encryptedCustomer Json?    // Encrypted customer data
  dropAddress       Json     // Delivery address
  subtotal          Decimal
  discount          Decimal  @default(0)
  tax               Decimal  @default(0)
  deliveryFee       Decimal?
  total             Decimal
  currency          String   @default("INR")
  store             Store    @relation(fields: [storeId], references: [id])
  items             OrderItem[]
  payment           Payment?
  deliveryJob       DeliveryJob?
  events            OrderEvent[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  productId   String
  quantity    Int
  price       Decimal
  config      Json     // Snapshot of product config at order time
  order       Order    @relation(fields: [orderId], references: [id])
  product     Product @relation(fields: [productId], references: [id])
  createdAt   DateTime @default(now())
}

model Payment {
  id              String   @id @default(cuid())
  orderId         String   @unique
  provider        String
  providerTxnId   String?  @unique
  amount          Decimal
  status          PaymentStatus
  webhookVerified Boolean  @default(false)
  metadata        Json?
  order           Order    @relation(fields: [orderId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model DeliveryJob {
  id              String   @id @default(cuid())
  orderId         String   @unique
  provider        String
  providerBookingId String? @unique
  status          DeliveryStatus
  quote           Json?
  metadata        Json?
  order           Order    @relation(fields: [orderId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model OrderEvent {
  id          String   @id @default(cuid())
  orderId     String
  eventType   String
  status      String
  metadata    Json?
  order       Order    @relation(fields: [orderId], references: [id])
  createdAt   DateTime @default(now())
}
```

### Zod Schemas

#### Store Public Config
```typescript
export const StorePublicConfigSchema = z.object({
  schemaVersion: z.literal('1.0'),
  storeId: z.string(),
  slug: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'CLOSED', 'PAUSED']),
  featured: z.boolean(),
  businessCategoryIds: z.array(z.string()),
  identity: z.object({
    name: z.string(),
    shortName: z.string(),
    tagline: z.string().optional(),
    usp: z.string(),
    description: z.string(),
    logoUrl: z.string().url(),
    bannerUrl: z.string().url(),
    thumbnailUrl: z.string().url(),
  }),
  theme: z.object({
    accentColor: z.string(),
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
  }),
  publicContact: z.object({
    storePhone: z.string(),
    storeHelpline: z.string().optional(),
    supportPhone: z.string().optional(),
    email: z.string().email().optional(),
  }),
  legal: z.object({
    legalBusinessName: z.string(),
    gstin: z.string().optional(),
    applicableLicenceNumbers: z.array(z.string()).optional(),
    showGstin: z.boolean(),
    showLicenceNumbers: z.boolean(),
  }),
  location: z.object({
    displayAddress: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    serviceAreaKm: z.number(),
  }),
  operations: z.object({
    acceptingOrders: z.boolean(),
    orderMode: z.enum(['DELIVERY', 'PICKUP', 'BOTH']),
    averagePreparationMinutes: z.number(),
    minimumOrderAmount: z.number(),
    maximumOrderAmount: z.number().optional(),
    autoAcceptOrders: z.boolean(),
  }),
  businessHours: z.array(z.object({
    dayOfWeek: z.number(),
    openTime: z.string(),
    closeTime: z.string(),
    isClosed: z.boolean(),
  })),
  delivery: z.object({
    provider: z.enum(['LIFTNGO', 'SELF', 'PARTNER']),
    deliveryType: z.enum(['STANDARD', 'EXPRESS', 'SCHEDULED']),
    customerPaysDelivery: z.boolean(),
    freeDeliveryThreshold: z.number().optional(),
  }),
  offers: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    type: z.enum(['PERCENTAGE', 'FLAT', 'BOGO']),
    value: z.number(),
    minOrderAmount: z.number(),
    validFrom: z.string(),
    validUntil: z.string(),
  })),
  catalogue: z.object({
    categories: z.array(z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      order: z.number(),
    })),
    products: z.array(z.object({
      id: z.string(),
      slug: z.string(),
      categoryId: z.string(),
      name: z.string(),
      description: z.string().optional(),
      images: z.array(z.string().url()),
      pricing: z.object({
        originalPrice: z.number(),
        sellingPrice: z.number(),
        taxPercentage: z.number(),
        taxInclusive: z.boolean(),
      }),
      variants: z.array(z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        available: z.boolean(),
      })).optional(),
      addOns: z.array(z.object({
        groupId: z.string(),
        groupName: z.string(),
        options: z.array(z.object({
          id: z.string(),
          name: z.string(),
          price: z.number(),
          available: z.boolean(),
        })),
      })).optional(),
      inventory: z.object({
        inStock: z.boolean(),
        stockCount: z.number().optional(),
        maxOrderQuantity: z.number(),
      }),
      preparation: z.object({
        minutes: z.number(),
      }),
      tags: z.array(z.string()).optional(),
      status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']),
    })),
  }),
  recommendations: z.object({
    featuredProductIds: z.array(z.string()),
  }),
  seo: z.object({
    pageTitle: z.string(),
    metaDescription: z.string(),
    keywords: z.array(z.string()),
  }),
});
```

## File Structure

```
src/
├── app/
│   ├── malviya-nagar/
│   │   └── page.tsx                    # Marketplace landing page
│   ├── store/
│   │   └── [storeSlug]/
│   │       ├── page.tsx                # Dynamic storefront
│   │       └── product/
│   │           └── [productSlug]/
│   │               └── page.tsx        # Product detail
│   ├── cart/
│   │   └── page.tsx                    # Cart page
│   ├── checkout/
│   │   └── page.tsx                    # Checkout page
│   ├── order/
│   │   └── [publicTrackingToken]/
│   │       └── page.tsx                # Order tracking
│   ├── help/
│   │   └── page.tsx                    # Help page
│   └── admin/
│       └── marketplace/
│           ├── page.tsx                # Admin dashboard
│           ├── stores/
│           │   └── page.tsx
│           ├── catalogue/
│           │   └── page.tsx
│           ├── orders/
│           │   └── page.tsx
│           ├── delivery/
│           │   └── page.tsx
│           ├── payments/
│           │   └── page.tsx
│           ├── refunds/
│           │   └── page.tsx
│           ├── notifications/
│           │   └── page.tsx
│           └── analytics/
│               └── page.tsx
├── components/
│   └── marketplace/
│       ├── MarketplaceHero.tsx
│       ├── StoreCard.tsx
│       ├── Storefront.tsx
│       ├── ProductCard.tsx
│       ├── ProductModal.tsx
│       ├── Cart.tsx
│       ├── CartItem.tsx
│       ├── CheckoutForm.tsx
│       ├── OrderTracking.tsx
│       └── admin/
│           ├── StoreManager.tsx
│           ├── CatalogueManager.tsx
│           └── OrderDashboard.tsx
├── lib/
│   ├── marketplace/
│   │   ├── schemas/
│   │   │   ├── store.schema.ts
│   │   │   ├── product.schema.ts
│   │   │   ├── order.schema.ts
│   │   │   └── index.ts
│   │   ├── providers/
│   │   │   ├── payment/
│   │   │   │   ├── provider.ts
│   │   │   │   ├── razorpay.ts
│   │   │   │   └── mock.ts
│   │   │   ├── delivery/
│   │   │   │   ├── provider.ts
│   │   │   │   ├── liftngo.ts
│   │   │   │   └── mock.ts
│   │   │   └── whatsapp/
│   │   │       ├── provider.ts
│   │   │       ├── mock.ts
│   │   │       └── templates.ts
│   │   ├── services/
│   │   │   ├── store.service.ts
│   │   │   ├── cart.service.ts
│   │   │   ├── order.service.ts
│   │   │   └── payment.service.ts
│   │   ├── utils/
│   │   │   ├── validation.ts
│   │   │   ├── encryption.ts
│   │   │   └── helpers.ts
│   │   └── constants.ts
│   └── prisma.ts
├── store/
│   └── marketplace/
│       ├── cart.store.ts
│       └── order.store.ts
├── types/
│   └── marketplace/
│       ├── store.ts
│       ├── product.ts
│       ├── order.ts
│       └── index.ts
└── api/
    └── marketplace/
        ├── stores/
        ├── products/
        ├── cart/
        ├── orders/
        ├── payments/
        ├── delivery/
        └── webhooks/
            ├── payment/
            ├── delivery/
            └── whatsapp/

data/
└── marketplace/
    ├── malviya-nagar.example.json
    ├── private/
    │   └── store-private.example.json
    └── schema/
        └── marketplace.schema.json

scripts/
├── validate-marketplace-data.ts
├── import-marketplace-data.ts
├── export-public-catalogue.ts
└── seed-marketplace-demo.ts

prisma/
├── schema.prisma
└── seed.ts

docs/
├── malviya-nagar-marketplace-plan.md
├── malviya-nagar-marketplace-architecture.md
├── merchant-onboarding.md
├── catalogue-import-guide.md
├── liftngo-integration.md
├── payment-flow.md
├── whatsapp-order-flow.md
├── order-state-machine.md
├── admin-operations-guide.md
├── marketplace-testing-guide.md
└── marketplace-deployment-checklist.md
```

## Environment Variables

```env
# Marketplace
MARKETPLACE_ENABLED=true
MARKETPLACE_BASE_URL=https://yourdomain.com

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/liftngo_marketplace"

# Data Encryption
DATA_ENCRYPTION_KEY=your-encryption-key-here

# Payment (Razorpay)
PAYMENT_PROVIDER=razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=razorpay_secret_xxxxx
RAZORPAY_WEBHOOK_SECRET=webhook_secret_xxxxx

# Delivery (Liftngo)
DELIVERY_PROVIDER=liftngo
LIFTNGO_API_BASE_URL=https://api.liftngo.com
LIFTNGO_API_KEY=liftngo_api_key_xxxxx
LIFTNGO_WEBHOOK_SECRET=liftngo_webhook_secret_xxxxx
LIFTNGO_LIVE_BOOKING_ENABLED=false

# WhatsApp
WHATSAPP_PROVIDER=twilio
WHATSAPP_API_BASE_URL=https://api.twilio.com
WHATSAPP_API_KEY=twilio_api_key_xxxxx
WHATSAPP_WEBHOOK_SECRET=whatsapp_webhook_secret_xxxxx
WHATSAPP_LIVE_SEND_ENABLED=false

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=google_maps_api_key

# Support
NEXT_PUBLIC_MARKETPLACE_SUPPORT_PHONE=7891880088
NEXT_PUBLIC_MARKETPLACE_SUPPORT_WHATSAPP=917891880088
```

## Rollout Strategy

### Pilot Phase (3 businesses)
- 1 Food/Café
- 1 Clothing store
- 1 Jewellery store
- Focus on core functionality
- Intensive testing
- Merchant feedback

### Wave 1 (10 businesses)
- Add 7 more businesses
- Expand categories
- Performance optimization
- Bug fixes

### Wave 2 (15 businesses)
- Add 15 more businesses
- Advanced features
- Analytics enhancement

### Wave 3 (22 businesses)
- Complete to 50 businesses
- Full feature set
- Marketing launch

## Success Metrics

- Store conversion rate > 5%
- Average order value > ₹500
- Merchant acceptance rate > 90%
- Delivery on-time rate > 85%
- Payment success rate > 95%
- Customer satisfaction > 4.5/5
- Repeat customer rate > 30%

## Risk Mitigation

### Technical Risks
- Database scaling: Use connection pooling, caching
- Payment failures: Implement robust retry logic
- Delivery delays: Real-time tracking, customer communication
- WhatsApp failures: Fallback to SMS, manual escalation

### Business Risks
- Merchant adoption: Simplify onboarding, provide incentives
- Customer trust: Secure payments, verified merchants
- Competition: Focus on local expertise, Liftngo delivery advantage

### Operational Risks
- Data quality: Validation scripts, manual review
- Support load: Self-service help, automated responses
- Fraud: Payment verification, order monitoring

## Next Steps

1. Create feature branch
2. Set up Prisma and database
3. Implement core schemas
4. Build marketplace page
5. Implement cart and checkout
6. Integrate payment and delivery
7. Add admin dashboard
8. Testing and documentation
9. Pilot launch
10. Full rollout

## Dependencies

- Prisma for ORM
- PostgreSQL for database
- Existing Razorpay integration
- Existing Google Maps integration
- Existing auth system
- Existing PostHog analytics

## Timeline Estimate

- Phase 1: 1 week
- Phase 2: 1 week
- Phase 3: 1 week
- Phase 4: 1 week
- Phase 5: 1 week
- Phase 6: 1 week
- Phase 7: 1 week
- Phase 8: 1 week
- Phase 9: 2 weeks
- Phase 10: 1 week

**Total: 11 weeks**

## Notes

- This is a production-grade implementation, not a demo
- All integrations will have mock providers for development
- Real API credentials will be added via environment variables
- Security and data privacy are top priorities
- The architecture supports expansion to other localities
