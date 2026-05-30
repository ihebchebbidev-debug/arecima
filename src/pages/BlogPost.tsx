import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApiBlogPost, useApiBlogPosts } from '@/hooks/useApiProducts';
import SEOHead from '@/components/SEOHead';
import { SITE_URL, sitePath } from '@/lib/site';
import { absoluteUrl } from '@/lib/seo';

const BlogPost = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();

  const { post, loading } = useApiBlogPost(id);
  const { posts: allPosts } = useApiBlogPosts();
  const relatedPosts = allPosts.filter(p => p.id !== id).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <SEOHead title="Article not found" noindex />
        <p className="font-body text-muted-foreground">Article not found</p>
      </main>
    );
  }

  const title = post.title[language];
  const description = post.metaDescription?.[language] || post.excerpt[language];
  const url = sitePath(`/blog/${post.id}`);
  const postImage = absoluteUrl(typeof post.image === 'string' ? post.image : undefined);

  // JSON-LD: Article + Breadcrumb + (optional) FAQPage
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: postImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: post.author || 'Arecima',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Arecima',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: language === 'ar' ? 'ar-TN' : language === 'fr' ? 'fr-TN' : 'en-US',
    articleSection: post.category[language],
    keywords: post.tags?.map(t => t[language]).join(', '),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('nav.home'), item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: t('nav.blog'), item: sitePath('/blog') },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  };

  const schemas: Record<string, unknown>[] = [articleSchema, breadcrumbSchema];

  if (post.faq && post.faq.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq.map(f => ({
        '@type': 'Question',
        name: f.q[language],
        acceptedAnswer: { '@type': 'Answer', text: f.a[language] },
      })),
    });
  }

  return (
    <main className="min-h-screen">
      <SEOHead
        title={title}
        description={description}
        type="article"
        image={postImage}
        schema={schemas}
        canonicalPath={`/blog/${post.id}`}
      />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <nav className="font-body text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-foreground">{t('nav.home')}</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-foreground">{t('nav.blog')}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{title}</span>
        </nav>
      </div>

      {/* Hero Image */}
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <div className="relative aspect-[21/9] overflow-hidden">
            <img src={post.image} alt={title} className="w-full h-full object-cover" width={1920} height={820} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-4 lg:px-8 py-10 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-champagne text-gold">{post.category[language]}</span>
              <span className="font-body text-xs text-muted-foreground">
                {new Date(post.date).toLocaleDateString(language === 'ar' ? 'ar-TN' : language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="w-1 h-1 rounded-full bg-gold" />
              <span className="font-body text-xs text-muted-foreground">{post.readTime} {t('blog.minRead')}</span>
            </div>

            <h1 className="font-display text-3xl lg:text-5xl leading-tight mb-8">{title}</h1>

            <div className="w-16 h-px bg-gold mb-8" />

            <div className="font-body text-base lg:text-lg leading-relaxed text-muted-foreground space-y-6">
              <p className="text-lg lg:text-xl font-medium text-foreground">{post.excerpt[language]}</p>
              <p>{post.content[language]}</p>
            </div>

            {/* Structured sections */}
            {post.sections && post.sections.length > 0 && (
              <div className="mt-12 space-y-10">
                {post.sections.map((s, i) => (
                  <section key={i} className="space-y-4">
                    <h2 className="font-display text-2xl lg:text-3xl text-foreground">{s.heading[language]}</h2>
                    <div className="w-10 h-px bg-gold" />
                    <p className="font-body text-base lg:text-lg leading-relaxed text-muted-foreground">{s.body[language]}</p>
                  </section>
                ))}
              </div>
            )}

            {/* FAQ */}
            {post.faq && post.faq.length > 0 && (
              <div className="mt-14">
                <h2 className="font-display text-2xl lg:text-3xl mb-2">{language === 'fr' ? 'Questions Fréquentes' : language === 'ar' ? 'أسئلة شائعة' : 'Frequently Asked Questions'}</h2>
                <div className="w-10 h-px bg-gold mb-6" />
                <div className="space-y-5">
                  {post.faq.map((f, i) => (
                    <details key={i} className="group border-b border-border pb-4">
                      <summary className="cursor-pointer font-display text-lg lg:text-xl text-foreground hover:text-gold transition-colors list-none flex justify-between items-center">
                        <span>{f.q[language]}</span>
                        <span className="text-gold ml-4 transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 font-body text-base text-muted-foreground leading-relaxed">{f.a[language]}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span key={i} className="font-body text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 bg-secondary text-secondary-foreground rounded-sm">
                    #{tag[language]}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="border-t border-b border-border py-6 mt-12 flex items-center justify-between">
              <span className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">{t('blog.share')}</span>
              <div className="flex gap-4">
                {['facebook', 'instagram', 'twitter'].map(social => (
                  <a key={social} href="#" aria-label={`Share on ${social}`} className="text-muted-foreground hover:text-gold transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      {social === 'facebook' && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>}
                      {social === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>}
                      {social === 'twitter' && <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="bg-champagne py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-display text-2xl lg:text-3xl text-center mb-10">{t('blog.relatedArticles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {relatedPosts.map((rp, i) => (
              <motion.div key={rp.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <Link to={`/blog/${rp.id}`} className="group block">
                  <div className="overflow-hidden aspect-[4/3] mb-4">
                    <img src={rp.image} alt={rp.title[language]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" width={400} height={300} />
                  </div>
                  <p className="font-body text-[10px] tracking-wider uppercase text-gold mb-2">{rp.category[language]}</p>
                  <h3 className="font-display text-base lg:text-lg group-hover:text-gold transition-colors">{rp.title[language]}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPost;
