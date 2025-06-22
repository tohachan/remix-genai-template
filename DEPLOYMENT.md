# Production Deployment Guide

## Overview
This guide covers deploying the Remix GenAI Template application to production environments with optimal performance, security, and monitoring.

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All tests pass (`npm run test`)
- [ ] TypeScript compilation is clean (`npm run type-check`)
- [ ] Linting passes (`npm run lint:fix`)
- [ ] Performance optimization is enabled
- [ ] Accessibility compliance verified
- [ ] Cross-browser compatibility tested
- [ ] Mobile responsiveness confirmed

### ✅ Security
- [ ] Environment variables are properly configured
- [ ] No sensitive data in client bundle
- [ ] HTTPS is enforced
- [ ] Security headers are configured
- [ ] Dependencies are up to date (`npm audit`)

### ✅ Performance
- [ ] Bundle size is optimized
- [ ] Code splitting is implemented
- [ ] Images are optimized
- [ ] CDN is configured for static assets
- [ ] Caching strategies are in place

## Environment Configuration

### Environment Variables
Create a `.env.production` file with these required variables:

```env
# Application
NODE_ENV=production
SESSION_SECRET=your-secure-session-secret

# Database (if applicable)
DATABASE_URL=your-production-database-url

# External APIs
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Monitoring
SENTRY_DSN=your-sentry-dsn
ANALYTICS_ID=your-analytics-id

# Performance
ENABLE_COMPRESSION=true
CACHE_MAX_AGE=31536000
```

### Build Configuration
Ensure `vite.config.ts` is optimized for production:

```typescript
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          remix: ['@remix-run/react', '@remix-run/node'],
        },
      },
    },
  },
});
```

## Deployment Platforms

### 1. Vercel Deployment

#### Setup
```bash
npm install -g vercel
vercel login
```

#### Configuration (`vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app/entry.server.tsx",
      "use": "@vercel/remix"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

#### Deploy
```bash
vercel --prod
```

### 2. Fly.io Deployment

#### Setup
```bash
npm install -g @fly-io/flytl
fly auth login
fly launch
```

#### Configuration (`fly.toml`)
```toml
app = "your-app-name"
primary_region = "lax"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[[services]]
  internal_port = 8080
  processes = ["app"]
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]
    force_https = true

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

[http_service]
  internal_port = 8080
  force_https = true
```

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
```

### 3. Railway Deployment

#### Setup
```bash
npm install -g @railway/cli
railway login
railway init
```

#### Configuration
Set environment variables in Railway dashboard:
- `NODE_ENV=production`
- `SESSION_SECRET`
- `DATABASE_URL` (if using Railway's database)

#### Deploy
```bash
railway up
```

## Performance Optimization

### 1. Bundle Analysis
```bash
npm run build
npx bundle-analyzer build/client/assets
```

### 2. Image Optimization
- Use WebP format for modern browsers
- Implement responsive images with `<picture>` elements
- Add lazy loading for images below the fold
- Optimize image sizes for different breakpoints

### 3. Caching Strategy
```typescript
// app/routes/assets.$.tsx
export async function loader({ params }: LoaderFunctionArgs) {
  const file = params['*'];
  
  return new Response(fileContent, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': getContentType(file),
    },
  });
}
```

### 4. Service Worker (Optional)
```typescript
// public/sw.js
const CACHE_NAME = 'app-v1';
const urlsToCache = [
  '/',
  '/build/root.js',
  '/build/entry.client.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

## Monitoring and Analytics

### 1. Error Tracking (Sentry)
```typescript
// app/entry.client.tsx
import * as Sentry from '@sentry/remix';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 2. Performance Monitoring
```typescript
// app/entry.client.tsx
import { initPerformanceMonitoring } from '~/shared/lib/utils/performance';

if (process.env.NODE_ENV === 'production') {
  initPerformanceMonitoring();
}
```

### 3. Analytics (Google Analytics)
```typescript
// app/entry.client.tsx
import { gtag } from '~/shared/lib/analytics';

if (process.env.NODE_ENV === 'production') {
  gtag('config', process.env.GA_TRACKING_ID);
}
```

## Security Configuration

### 1. Content Security Policy
```typescript
// app/root.tsx
export const headers = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.openai.com",
  ].join('; '),
};
```

### 2. Environment Security
- Never commit `.env` files
- Use secrets management for sensitive data
- Rotate API keys regularly
- Implement rate limiting
- Use HTTPS everywhere

## Database Migration (if applicable)

### 1. Backup Current Data
```bash
pg_dump $DATABASE_URL > backup.sql
```

### 2. Run Migrations
```bash
npm run db:migrate
```

### 3. Verify Data Integrity
```bash
npm run db:verify
```

## Post-Deployment Testing

### 1. Smoke Tests
- [ ] Application loads successfully
- [ ] Authentication works
- [ ] Core features function properly
- [ ] API endpoints respond correctly
- [ ] Database connections are stable

### 2. Performance Tests
- [ ] Page load times < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals are green

### 3. Security Tests
- [ ] HTTPS is enforced
- [ ] Security headers are present
- [ ] No sensitive data in client
- [ ] Authentication is secure

## Rollback Strategy

### 1. Quick Rollback
```bash
# Vercel
vercel rollback

# Fly.io
fly deploy --image previous-image

# Railway
railway rollback
```

### 2. Database Rollback (if needed)
```bash
psql $DATABASE_URL < backup.sql
```

## Maintenance

### 1. Regular Tasks
- Monitor application logs
- Check performance metrics
- Update dependencies monthly
- Review security advisories
- Backup database regularly

### 2. Monitoring Alerts
Set up alerts for:
- Application errors (>1% error rate)
- High response times (>5 seconds)
- Database connection issues
- SSL certificate expiration
- Disk space usage (>80%)

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### Environment Variable Issues
```bash
# Check environment variables are loaded
console.log(process.env.NODE_ENV);
```

### Health Check Endpoint
```typescript
// app/routes/health.tsx
export async function loader() {
  // Check database connectivity
  // Check external API availability
  // Return status
  
  return json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

## Support and Documentation

### Resources
- [Remix Documentation](https://remix.run/docs)
- [Deployment Guides](https://remix.run/docs/en/main/guides/deployment)
- [Performance Best Practices](https://web.dev/performance/)
- [Security Guidelines](https://owasp.org/www-project-top-ten/)

### Getting Help
- Create GitHub issues for bugs
- Join Remix Discord for community support
- Check application logs for error details
- Use monitoring dashboards for insights

---

## Quick Deploy Commands

### Development to Production
```bash
# 1. Final testing
npm run test
npm run lint:fix
npm run type-check

# 2. Build for production
npm run build

# 3. Deploy (choose platform)
vercel --prod              # Vercel
fly deploy                 # Fly.io
railway up                 # Railway
```

### Emergency Rollback
```bash
vercel rollback            # Vercel
fly deploy --image previous-image  # Fly.io
railway rollback           # Railway
``` 