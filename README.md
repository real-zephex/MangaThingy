# MangaThingy - Manga Reader Platform

A modern, full-stack manga reading platform built with Next.js, TypeScript, and integrated web scrapers. Browse, search, and read manga from multiple sources with a sleek dark-themed interface.

## 🎯 Features

- **Multi-Source Scraping**: Integrated scrapers for Mangapill and Asurascans
- **Fast Search**: Search manga across multiple providers simultaneously
- **Responsive Design**: Beautiful dark-themed UI optimized for all devices
- **Chapter Management**: Browse chapters, view manga details, and track progress
- **Local Storage**: Save reading progress and bookmarks
- **Type-Safe API**: Full TypeScript support with Zod schemas
- **Server-Side Rendering**: Optimized with Next.js App Router and ISR
- **Production Ready**: Tested and deployed on Vercel

## 🛠 Tech Stack

- **Frontend**: Next.js 16.1.1, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components, Framer Motion
- **API**: Hono for REST API routes, Axios for HTTP requests
- **Scraping**: Cheerio for HTML parsing
- **State Management**: React hooks, Context API
- **Validation**: Zod for schema validation
- **UI Components**: Radix UI, Lucide Icons

## 📋 Project Structure

```
new-manga-site/
├── app/
│   ├── api/                    # Hono API routes
│   │   └── [[...route]]/
│   │       └── route.ts        # All scraper endpoints
│   ├── manga/                  # Manga detail pages
│   ├── page.tsx                # Homepage
│   └── layout.tsx
├── lib/
│   ├── scrapers/               # Scraper implementations
│   │   ├── mangapill.ts
│   │   ├── asurascans.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── services/               # API client services
│   │   ├── manga.actions.ts
│   │   └── manga.service.ts
│   └── api-client.ts           # Type-safe frontend API client
├── components/
│   ├── custom/                 # Custom components
│   │   ├── landing/
│   │   ├── info/
│   │   └── reader/
│   └── ui/                     # Shadcn/ui components
├── public/                     # Static assets
└── [config files]
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd new-manga-site
```

2. **Install dependencies**
```bash
bun install
# or
npm install
```

3. **Run the development server**
```bash
bun run dev
# or
npm run dev
```

4. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Available API Endpoints

### Mangapill
- `GET /api/mangapill/search/:query` - Search manga
- `GET /api/mangapill/info/:id` - Get manga details
- `GET /api/mangapill/pages/:id` - Get chapter pages
- `GET /api/mangapill/newest` - Get newest manga
- `GET /api/mangapill/recent` - Get recently updated
- `GET /api/mangapill/images/:imageUrl` - Proxy images

### Asurascans
- `GET /api/asurascans/search/:query` - Search manga
- `GET /api/asurascans/info/:id` - Get manga details
- `GET /api/asurascans/pages/:id` - Get chapter pages
- `GET /api/asurascans/popular` - Get popular manga
- `GET /api/asurascans/latest/:page` - Get latest updates
- `GET /api/asurascans/genres/:type` - Get by genre
- `GET /api/asurascans/genre-list` - List available genres

## 💻 Usage

### Frontend API Client

Use the type-safe API client in React components:

```typescript
import { scrapersAPI } from '@/lib/api-client';

// Search manga
const results = await scrapersAPI.mangapill.search('naruto');

// Get manga info
const info = await scrapersAPI.mangapill.info('/manga/12/solo-leveling');

// Get chapter pages
const pages = await scrapersAPI.mangapill.pages(chapterId);
```

### Server Components

Fetch data directly in server components:

```typescript
import { MangapillService } from '@/lib/services/manga.actions';

export default async function MangaPage() {
  const manga = await MangapillService.getNewest();
  return <div>{/* render manga */}</div>;
}
```

## 🔧 Configuration

### Environment Variables

No environment variables required for development. For production on Vercel, the system automatically detects the environment and constructs proper URLs.

### Cache Settings

- ISR (Incremental Static Regeneration): 1 hour revalidation
- Images: 24-hour browser cache

## 🏗 Building for Production

### Build
```bash
bun run build
# or
npm run build
```

### Start Production Server
```bash
bun run start
# or
npm run start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Deploy automatically with zero configuration

The API routes and scrapers work seamlessly on Vercel's serverless infrastructure.

## 📖 Documentation

For detailed API documentation and examples, see:
- **[SCRAPER_API_DOCUMENTATION.md](./SCRAPER_API_DOCUMENTATION.md)** - Complete API reference
- **[SCRAPER_QUICK_START.md](./SCRAPER_QUICK_START.md)** - Quick start with code examples
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[API_INTEGRATION_COMPLETE.md](./API_INTEGRATION_COMPLETE.md)** - Integration status and features

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Build Timeout
The first build may take longer due to homepage prerendering. This is normal.

### Manga Not Found
Verify the manga exists on the source website. Some manga may be removed or the website structure may change.

### Image Loading Issues
- Ensure image URL is properly encoded
- Check network tab for CORS errors
- Verify the original image is still accessible

## 🔄 URL Encoding

The API automatically handles special characters in IDs (slashes, spaces, etc.):

```typescript
// Works automatically - no manual encoding needed
const manga = await scrapersAPI.mangapill.info('/manga/12/solo-leveling');
```

## 📝 Development Notes

- **Hot Reload**: Changes to files are automatically reflected in the browser
- **TypeScript**: Full type checking with strict mode enabled
- **Linting**: ESLint configured for code quality
- **Formatting**: Prettier configured for consistent code style

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌐 Supported Sources

- [Mangapill](https://mangapill.com) - Manga source
- [Asurascans](https://asurascans.io) - Webtoon/Manga source

## ⚠️ Legal Notice

This project is for educational purposes. The scraping functionality respects robots.txt and rate limits. Please check the target websites' terms of service before using.

## 📞 Support

For issues, questions, or suggestions, please create an issue in the GitHub repository.

## 🚀 Performance Optimization

- **ISR**: Pages revalidate every hour to keep data fresh
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: API responses cached with ISR strategy

## 🎨 Customization

The UI is built with Tailwind CSS and Shadcn/ui components, making it easy to customize:

- **Dark Theme**: Primary color scheme is dark with accent colors
- **Components**: Located in `components/` directory
- **Styles**: Global styles in `app/globals.css`
- **Tailwind Config**: Customize in `tailwind.config.ts`

---

**Happy Reading!** 📚✨