import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApiBlogPosts } from '@/hooks/useApiProducts';
import SEOHead from '@/components/SEOHead';
import { sitePath } from '@/lib/site';

const Blog = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { posts: blogPosts, loading } = useApiBlogPosts();

  const categories = Array.from(new Set(blogPosts.map(p => p.category[language])));

  const filtered = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(p => p.category[language] === selectedCategory);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-body text-muted-foreground">Loading…</p>
      </main>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <main className="min-h-screen">
        <SEOHead title={t('blog.title')} description={t('blog.description')} />
        <section className="bg-champagne py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="font-display text-3xl lg:text-5xl mb-4">{t('blog.title')}</h1>
            <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">
              {language === 'fr' ? 'Nos articles arrivent bientôt.' : language === 'ar' ? 'مقالاتنا قريباً.' : 'Our articles are coming soon.'}
            </p>
            <Link to="/" className="inline-block mt-8 font-body text-xs tracking-[0.2em] uppercase text-gold hover:underline">
              {t('nav.home')}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const featured = blogPosts[0];
  const rest = filtered.filter(p => p.id !== featured.id);

  const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Arecima Journal',
    description: t('blog.description'),
    url: sitePath('/blog'),
    blogPost: blogPosts.slice(0, 10).map(p => ({
      '@type': 'BlogPosting',
      headline: p.title[language],
      url: sitePath(`/blog/${p.id}`),
      datePublished: p.date,
      image: typeof p.image === 'string' ? p.image : undefined,
    })),
  };

  return (
    <main className="min-h-screen">
      <SEOHead
        title={t('blog.title')}
        description={t('blog.description')}
        type="website"
        schema={blogListSchema}
      />
      {/* Header */}
      <section className="bg-champagne py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-3">{t('blog.subtitle')}</p>
            <h1 className="font-display text-3xl lg:text-5xl mb-4">{t('blog.title')}</h1>
            <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">{t('blog.description')}</p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link to={`/blog/${featured.id}`} className="group block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={featured.image}
                  alt={featured.title[language]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  width={800}
                  height={600}
                />
                <div className="absolute top-4 left-4">
                  <span className="font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-gold" style={{ color: 'hsl(30, 10%, 12%)' }}>
                    {featured.category[language]}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-gold mb-3">{t('blog.featured')}</p>
                <h2 className="font-display text-2xl lg:text-4xl mb-4 group-hover:text-gold transition-colors">
                  {featured.title[language]}
                </h2>
                <p className="font-body text-sm leading-relaxed text-muted-foreground mb-6">
                  {featured.excerpt[language]}
                </p>
                <div className="flex items-center gap-4 font-body text-xs text-muted-foreground">
                  <span>{new Date(featured.date).toLocaleDateString(language === 'ar' ? 'ar-TN' : language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="w-1 h-1 rounded-full bg-gold" />
                  <span>{featured.readTime} {t('blog.minRead')}</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Category Filter */}
      <div className="container mx-auto px-4 lg:px-8 pb-4">
        <div className="flex flex-wrap gap-2 border-b border-border pb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`font-body text-xs tracking-[0.1em] uppercase px-4 py-2 border transition-colors ${
              selectedCategory === 'all' ? 'border-gold text-gold' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
            }`}
          >
            {t('products.all')}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-body text-xs tracking-[0.1em] uppercase px-4 py-2 border transition-colors ${
                selectedCategory === cat ? 'border-gold text-gold' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {rest.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={`/blog/${post.id}`} className="group block">
                <div className="relative overflow-hidden aspect-[4/3] mb-4">
                  <img
                    src={post.image}
                    alt={post.title[language]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-charcoal" style={{ color: 'hsl(40, 60%, 75%)' }}>
                      {post.category[language]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2 font-body text-[10px] text-muted-foreground tracking-wider uppercase">
                  <span>{new Date(post.date).toLocaleDateString(language === 'ar' ? 'ar-TN' : language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="w-1 h-1 rounded-full bg-gold" />
                  <span>{post.readTime} {t('blog.minRead')}</span>
                </div>
                <h3 className="font-display text-lg lg:text-xl mb-2 group-hover:text-gold transition-colors">
                  {post.title[language]}
                </h3>
                <p className="font-body text-sm text-muted-foreground line-clamp-2">{post.excerpt[language]}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-charcoal py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-body text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'hsl(40, 60%, 75%)' }}>
              {t('footer.newsletter')}
            </p>
            <h2 className="font-display text-2xl lg:text-3xl mb-4" style={{ color: 'hsl(40, 33%, 90%)' }}>
              {t('blog.newsletterTitle')}
            </h2>
            <p className="font-body text-sm mb-8" style={{ color: 'hsl(40, 20%, 65%)' }}>
              {t('blog.newsletterText')}
            </p>
            <div className="flex gap-0 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 px-4 py-3 font-body text-sm bg-transparent border border-r-0 focus:outline-none focus:border-gold"
                style={{ borderColor: 'hsl(30, 8%, 30%)', color: 'hsl(40, 33%, 85%)' }}
              />
              <button className="px-6 py-3 font-body text-xs tracking-[0.15em] uppercase bg-gold hover:bg-gold-dark transition-colors" style={{ color: 'hsl(30, 10%, 12%)' }}>
                {t('footer.subscribe')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Blog;
