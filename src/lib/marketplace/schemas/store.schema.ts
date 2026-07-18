import { z } from 'zod';

/**
 * Store Status Enum
 */
export const StoreStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'CLOSED',
  'PAUSED',
  'PENDING_APPROVAL',
  'SUSPENDED',
]);

/**
 * Business Category Schema
 */
export const BusinessCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().default(0),
});

/**
 * Store Identity Schema
 */
export const StoreIdentitySchema = z.object({
  name: z.string().min(1).max(200),
  shortName: z.string().min(1).max(50),
  tagline: z.string().max(150).optional(),
  usp: z.string().max(300),
  description: z.string().max(2000),
  logoUrl: z.string().url(),
  bannerUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
});

/**
 * Store Theme Schema
 */
export const StoreThemeSchema = z.object({
  layout: z.enum(['MODERN', 'CLASSIC', 'MINIMAL']).default('MODERN'),
  backgroundColor: z.string().optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#FF6B35'),
  textColor: z.string().optional(),
  buttonStyle: z.enum(['ROUNDED', 'SQUARE', 'PILL']).default('ROUNDED'),
  showLiftngoHeaderBadge: z.boolean().default(true),
  showLiftngoFooter: z.boolean().default(true),
});

/**
 * Store Public Contact Schema
 */
export const StorePublicContactSchema = z.object({
  storePhone: z.string().regex(/^[6-9]\d{9}$/),
  storeHelpline: z.string().regex(/^[6-9]\d{9}$/).optional(),
  supportPhone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  email: z.string().email().optional(),
});

/**
 * Store Legal Data Schema
 */
export const StoreLegalDataSchema = z.object({
  legalBusinessName: z.string().min(1).max(200),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
  applicableLicenceNumbers: z.array(z.string()).optional(),
  showGstin: z.boolean().default(false),
  showLicenceNumbers: z.boolean().default(false),
});

/**
 * Store Location Schema
 */
export const StoreLocationSchema = z.object({
  displayAddress: z.string().max(300),
  addressLine1: z.string().max(200),
  addressLine2: z.string().max(200).optional(),
  landmark: z.string().max(100).optional(),
  city: z.string().max(100),
  state: z.string().max(100),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  mapUrl: z.string().url().optional(),
  serviceAreaKm: z.number().min(1).max(50).default(5),
});

/**
 * Business Hours Schema
 */
export const BusinessHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6), // 0 = Sunday, 6 = Saturday
  openTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  closeTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  isClosed: z.boolean().default(false),
});

/**
 * Delivery Configuration Schema
 */
export const DeliveryConfigurationSchema = z.object({
  provider: z.enum(['LIFTNGO', 'SELF', 'PARTNER']).default('LIFTNGO'),
  deliveryType: z.enum(['STANDARD', 'EXPRESS', 'SCHEDULED']).default('STANDARD'),
  packageType: z.enum(['FOOD', 'CLOTHING', 'ELECTRONICS', 'DOCUMENTS', 'GENERAL']).default('GENERAL'),
  defaultWeightKg: z.number().min(0.1).max(50).default(1),
  customerPaysDelivery: z.boolean().default(true),
  freeDeliveryThreshold: z.number().min(0).optional(),
  deliveryInstructions: z.string().max(500).optional(),
});

/**
 * Store Operations Schema
 */
export const StoreOperationsSchema = z.object({
  acceptingOrders: z.boolean().default(true),
  orderMode: z.enum(['DELIVERY', 'PICKUP', 'BOTH']).default('BOTH'),
  averagePreparationMinutes: z.number().min(5).max(120),
  minimumOrderAmount: z.number().min(0),
  maximumOrderAmount: z.number().min(0).optional(),
  inventoryMode: z.enum(['REALTIME', 'MANUAL']).default('REALTIME'),
  autoAcceptOrders: z.boolean().default(false),
  merchantConfirmationSlaSeconds: z.number().min(60).max(600).default(120),
});

/**
 * Offer Schema
 */
export const OfferSchema = z.object({
  id: z.string(),
  title: z.string().max(100),
  description: z.string().max(300),
  type: z.enum(['PERCENTAGE', 'FLAT', 'BOGO', 'FREE_DELIVERY']),
  value: z.number().min(0),
  minOrderAmount: z.number().min(0).default(0),
  maxDiscountAmount: z.number().min(0).optional(),
  validFrom: z.string(), // ISO date string
  validUntil: z.string(), // ISO date string
  applicableCategories: z.array(z.string()).optional(),
  applicableProducts: z.array(z.string()).optional(),
  maxUses: z.number().min(1).optional(),
  currentUses: z.number().min(0).default(0),
});

/**
 * Product Variant Schema
 */
export const ProductVariantSchema = z.object({
  id: z.string(),
  name: z.string().max(100),
  price: z.number().min(0),
  originalPrice: z.number().min(0).optional(),
  available: z.boolean().default(true),
  stockCount: z.number().min(0).optional(),
  attributes: z.record(z.string(), z.string()).optional(),
});

/**
 * Product Add-on Option Schema
 */
export const ProductAddOnOptionSchema = z.object({
  id: z.string(),
  name: z.string().max(100),
  price: z.number().min(0),
  available: z.boolean().default(true),
  stockCount: z.number().min(0).optional(),
});

/**
 * Product Add-on Group Schema
 */
export const ProductAddOnGroupSchema = z.object({
  groupId: z.string(),
  groupName: z.string().max(100),
  type: z.enum(['SINGLE', 'MULTIPLE']),
  required: z.boolean().default(false),
  minSelection: z.number().min(0).default(0),
  maxSelection: z.number().min(0).optional(),
  options: z.array(ProductAddOnOptionSchema),
});

/**
 * Product Pricing Schema
 */
export const ProductPricingSchema = z.object({
  originalPrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  taxPercentage: z.number().min(0).max(100).default(0),
  taxInclusive: z.boolean().default(true),
});

/**
 * Product Inventory Schema
 */
export const ProductInventorySchema = z.object({
  inStock: z.boolean().default(true),
  stockCount: z.number().min(0).optional(),
  maxOrderQuantity: z.number().min(1).default(10),
  lowStockThreshold: z.number().min(0).default(5),
});

/**
 * Product Preparation Schema
 */
export const ProductPreparationSchema = z.object({
  minutes: z.number().min(1).max(180),
});

/**
 * Catalogue Category Schema
 */
export const CatalogueCategorySchema = z.object({
  id: z.string(),
  name: z.string().max(100),
  slug: z.string(),
  description: z.string().max(300).optional(),
  order: z.number().default(0),
  icon: z.string().optional(),
  image: z.string().url().optional(),
});

/**
 * Product Schema
 */
export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  categoryId: z.string(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  images: z.array(z.string().url()).min(1).max(10),
  pricing: ProductPricingSchema,
  variants: z.array(ProductVariantSchema).optional(),
  addOns: z.array(ProductAddOnGroupSchema).optional(),
  inventory: ProductInventorySchema,
  preparation: ProductPreparationSchema,
  weight: z.number().min(0).max(50).optional(),
  packageInfo: z.string().max(200).optional(),
  tags: z.array(z.string()).max(10).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'COMING_SOON']),
  featured: z.boolean().default(false),
  recommended: z.boolean().default(false),
});

/**
 * Catalogue Schema
 */
export const CatalogueSchema = z.object({
  categories: z.array(CatalogueCategorySchema),
  products: z.array(ProductSchema),
});

/**
 * Recommendations Schema
 */
export const RecommendationsSchema = z.object({
  featuredProductIds: z.array(z.string()),
  cartRecommendationRules: z.array(z.object({
    productId: z.string(),
    recommendedProductIds: z.array(z.string()),
    condition: z.enum(['ALWAYS', 'SAME_CATEGORY', 'COMPLEMENTARY']),
  })).optional(),
});

/**
 * SEO Configuration Schema
 */
export const SEOConfigurationSchema = z.object({
  pageTitle: z.string().max(60),
  metaDescription: z.string().max(160),
  keywords: z.array(z.string()).max(10),
  ogImage: z.string().url().optional(),
});

/**
 * Analytics Configuration Schema
 */
export const AnalyticsConfigurationSchema = z.object({
  campaignCode: z.string().optional(),
  source: z.string().optional(),
  merchantCohort: z.string().optional(),
  utmParameters: z.record(z.string(), z.string()).optional(),
});

/**
 * Store Public Config Schema (Complete)
 * This is the main schema for public store data sent to the browser
 */
export const StorePublicConfigSchema = z.object({
  schemaVersion: z.literal('1.0'),
  storeId: z.string(),
  slug: z.string(),
  status: StoreStatusSchema,
  featured: z.boolean().default(false),
  businessCategoryIds: z.array(z.string()),
  
  identity: StoreIdentitySchema,
  theme: StoreThemeSchema,
  publicContact: StorePublicContactSchema,
  legal: StoreLegalDataSchema,
  location: StoreLocationSchema,
  operations: StoreOperationsSchema,
  
  businessHours: z.array(BusinessHoursSchema),
  delivery: DeliveryConfigurationSchema,
  offers: z.array(OfferSchema).default([]),
  
  catalogue: CatalogueSchema,
  recommendations: RecommendationsSchema,
  
  seo: SEOConfigurationSchema,
  analytics: AnalyticsConfigurationSchema.optional(),
});

/**
 * Store Private Profile Schema (Server-Only)
 * This contains sensitive merchant data that should never be sent to the browser
 */
export const StorePrivateProfileSchema = z.object({
  schemaVersion: z.literal('1.0'),
  storeId: z.string(),
  
  owner: z.object({
    fullName: z.string(),
    primaryPhone: z.string().regex(/^[6-9]\d{9}$/),
    secondaryPhone: z.string().regex(/^[6-9]\d{9}$/).optional(),
    email: z.string().email(),
    whatsappOrderNumber: z.string().regex(/^[6-9]\d{9}$/),
  }),
  
  pickupContact: z.object({
    name: z.string(),
    phone: z.string().regex(/^[6-9]\d{9}$/),
  }),
  
  settlement: z.object({
    settlementMode: z.enum(['BANK_TRANSFER', 'UPI', 'CHEQUE']),
    accountHolderName: z.string(),
    bankName: z.string(),
    encryptedAccountNumber: z.string(), // Encrypted at rest
    encryptedIfsc: z.string(), // Encrypted at rest
    encryptedUpiId: z.string().optional(), // Encrypted at rest
    settlementCycle: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY']).default('WEEKLY'),
  }),
  
  compliance: z.object({
    panReference: z.string().optional(),
    gstin: z.string().optional(),
    licenceReferences: z.array(z.string()).optional(),
    agreementReference: z.string().optional(),
    ownerApprovedCatalogue: z.boolean().default(false),
    ownerApprovedAt: z.string().optional(),
  }),
  
  notifications: z.object({
    sendOrderOnWhatsApp: z.boolean().default(true),
    sendCancellationOnWhatsApp: z.boolean().default(true),
    sendSettlementSummary: z.boolean().default(true),
  }),
  
  operations: z.object({
    relationshipManager: z.string().optional(),
    catalogueManager: z.string().optional(),
    dataManager: z.string().optional(),
    escalationPhone: z.string().regex(/^[6-9]\d{9}$/).optional(),
    internalNotes: z.string().max(2000).optional(),
  }),
});

/**
 * Store Onboarding Status Schema
 */
export const StoreOnboardingStatusSchema = z.enum([
  'IDENTIFIED',
  'CONTACTED',
  'INTERESTED',
  'DATA_PENDING',
  'CONTENT_PENDING',
  'OWNER_REVIEW',
  'APPROVED',
  'PUBLISHED',
  'ACTIVE',
  'PAUSED',
]);

/**
 * Store Onboarding Checklist Schema
 */
export const StoreOnboardingChecklistSchema = z.object({
  storeId: z.string(),
  uniqueSlug: z.boolean().default(false),
  businessName: z.boolean().default(false),
  businessCategory: z.boolean().default(false),
  storeDescription: z.boolean().default(false),
  storeUsp: z.boolean().default(false),
  logo: z.boolean().default(false),
  banner: z.boolean().default(false),
  thumbnail: z.boolean().default(false),
  publicPhone: z.boolean().default(false),
  privateOwnerPhone: z.boolean().default(false),
  whatsappOrderNumber: z.boolean().default(false),
  address: z.boolean().default(false),
  latitude: z.boolean().default(false),
  longitude: z.boolean().default(false),
  businessHours: z.boolean().default(false),
  gstin: z.boolean().default(false),
  licenceDetails: z.boolean().default(false),
  atLeastOneCategory: z.boolean().default(false),
  atLeastOneActiveProduct: z.boolean().default(false),
  everyProductHasPrice: z.boolean().default(false),
  everyProductHasImage: z.boolean().default(false),
  pickupContact: z.boolean().default(false),
  liftngoServiceabilityCheck: z.boolean().default(false),
  paymentTestCompleted: z.boolean().default(false),
  whatsappTestCompleted: z.boolean().default(false),
  deliveryBookingTestCompleted: z.boolean().default(false),
  ownerApprovalRecorded: z.boolean().default(false),
});

/**
 * Marketplace Schema
 */
export const MarketplaceSchema = z.object({
  schemaVersion: z.literal('1.0'),
  marketplaceId: z.string(),
  name: z.string(),
  slug: z.string(),
  locality: z.string(),
  city: z.string(),
  state: z.string(),
  status: z.enum(['ACTIVE', 'COMING_SOON', 'PAUSED']),
  businessCategories: z.array(BusinessCategorySchema),
  supportedStoreIds: z.array(z.string()),
  rolloutCohorts: z.record(z.string(), z.array(z.string())).optional(), // cohort -> storeIds
});

// Export types
export type StoreStatus = z.infer<typeof StoreStatusSchema>;
export type BusinessCategory = z.infer<typeof BusinessCategorySchema>;
export type StoreIdentity = z.infer<typeof StoreIdentitySchema>;
export type StoreTheme = z.infer<typeof StoreThemeSchema>;
export type StorePublicContact = z.infer<typeof StorePublicContactSchema>;
export type StoreLegalData = z.infer<typeof StoreLegalDataSchema>;
export type StoreLocation = z.infer<typeof StoreLocationSchema>;
export type BusinessHours = z.infer<typeof BusinessHoursSchema>;
export type DeliveryConfiguration = z.infer<typeof DeliveryConfigurationSchema>;
export type StoreOperations = z.infer<typeof StoreOperationsSchema>;
export type Offer = z.infer<typeof OfferSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type ProductAddOnOption = z.infer<typeof ProductAddOnOptionSchema>;
export type ProductAddOnGroup = z.infer<typeof ProductAddOnGroupSchema>;
export type ProductPricing = z.infer<typeof ProductPricingSchema>;
export type ProductInventory = z.infer<typeof ProductInventorySchema>;
export type ProductPreparation = z.infer<typeof ProductPreparationSchema>;
export type CatalogueCategory = z.infer<typeof CatalogueCategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Catalogue = z.infer<typeof CatalogueSchema>;
export type Recommendations = z.infer<typeof RecommendationsSchema>;
export type SEOConfiguration = z.infer<typeof SEOConfigurationSchema>;
export type AnalyticsConfiguration = z.infer<typeof AnalyticsConfigurationSchema>;
export type StorePublicConfig = z.infer<typeof StorePublicConfigSchema>;
export type StorePrivateProfile = z.infer<typeof StorePrivateProfileSchema>;
export type StoreOnboardingStatus = z.infer<typeof StoreOnboardingStatusSchema>;
export type StoreOnboardingChecklist = z.infer<typeof StoreOnboardingChecklistSchema>;
export type Marketplace = z.infer<typeof MarketplaceSchema>;
