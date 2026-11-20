import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import SafeImage from '../../components/common/SafeImage';
import SEO from '../../components/common/SEO';
import { WhatsAppIcon } from '../../components/common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../components/common/Toast';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const { blogs, settings } = useStore();
  const { addToast } = useToast();

  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="bg-[#FBF9F5] min-h-screen py-24 text-center">
        <div className="container-page max-w-md mx-auto space-y-4">
          <h2 className="text-3xl font-luxury-serif text-[#1C1815]">Dispatch Not Located</h2>
          <p className="text-sm text-[#70685E] font-light">The requested essay has been archived or relocated.</p>
          <Link to="/blog" className="btn-luxury mt-6 inline-flex text-xs px-6 py-3">
            Return to Gazette
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast({ message: 'Essay link copied to clipboard', type: 'success' });
    }
  };

  const relatedArticles = blogs
    .filter((b) => b.id !== blog.id && b.status === 'published')
    .slice(0, 2);

  const blogImg = blog.featuredImage || blog.image;
  const blogDt = blog.publishedAt || blog.date;

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blogImg,
    datePublished: blogDt,
    author: {
      '@type': 'Person',
      name: blog.author || 'Home & More Atelier Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Home & More Furniture',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.homeandmorefurniture.com/favicon.svg',
      },
    },
    mainEntityOfPage: `https://www.homeandmorefurniture.com/blog/${blog.slug}`,
  };

  const whatsAppLink = buildWhatsAppLink(
    settings.whatsappNumber || '+2348033513144',
    `Hello Home & More Concierge, I was reading your journal essay "${blog.title}" and would like to consult with your design team.`
  );

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-10 sm:py-16">
      <SEO
        title={`${blog.title} | Atelier Gazette | Home & More Abuja`}
        description={blog.excerpt}
        canonical={`/blog/${blog.slug}`}
        image={blogImg}
        type="article"
        schema={blogSchema}
      />

      <article className="container-page max-w-4xl mx-auto space-y-10">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-ultra-caps text-[#70685E] hover:text-[#1C1815] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Gazette</span>
        </Link>

        {/* Header Block */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold">
              {blog.category}
            </span>
            <span className="text-xs text-[#A69E93]">•</span>
            <span className="text-xs text-[#70685E] flex items-center gap-1 font-light">
              <Clock className="w-3.5 h-3.5 stroke-[1.2]" />
              {blog.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-luxury-serif font-light text-[#1C1815] tracking-tight leading-[1.15]">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-[#E8E3DA] py-3.5 text-xs text-[#70685E]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-light text-[#1C1815]">
                <User className="w-3.5 h-3.5 text-[#8C6D3B] stroke-[1.2]" />
                {blog.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-light">
                <Calendar className="w-3.5 h-3.5 text-[#8C6D3B] stroke-[1.2]" />
                Published {blog.publishedAt || blog.date}
              </span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-ultra-caps text-[#1C1815] hover:text-[#8C6D3B] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Essay</span>
            </button>
          </div>
        </header>

        {/* Hero Image */}
        <div className="overflow-hidden aspect-[16/9] border border-[#E8E3DA] bg-[#EFECE6]">
          <SafeImage
            src={blog.featuredImage || blog.image}
            alt={blog.title}
            aspectRatio="aspect-auto"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Excerpt Callout */}
        <div className="p-8 bg-[#EFECE6]/50 border-l-2 border-[#8C6D3B] text-base font-luxury-serif text-[#1C1815] italic leading-relaxed">
          "{blog.excerpt}"
        </div>

        {/* Content Body */}
        <div className="prose prose-stone max-w-none text-[#1C1815] leading-relaxed space-y-6 text-sm sm:text-base font-light">
          {blog.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-xl sm:text-2xl font-luxury-serif font-light text-[#1C1815] pt-6 pb-1 border-b border-[#E8E3DA]">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            return (
              <p key={idx} className="text-[#332C26] leading-relaxed font-light">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Showroom WhatsApp Consultation Box */}
        <div className="mt-14 p-8 sm:p-12 bg-[#1C1815] text-[#FBF9F5] border border-[#35302B] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-ultra-caps text-[#C4A470] font-semibold">
              Interior Architecture Advisory
            </span>
            <h3 className="text-2xl font-luxury-serif text-[#FBF9F5]">Require Bespoke Styling Guidance?</h3>
            <p className="text-xs text-[#A69E93] font-light max-w-md leading-relaxed">
              Our Abuja interior architects provide material swatches, 3D room visualization, and white-glove bespoke commissions.
            </p>
          </div>
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-xs py-3 px-6 shrink-0 shadow-none"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Consult via WhatsApp</span>
          </a>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="pt-12 border-t border-[#E8E3DA] space-y-6">
            <h3 className="text-2xl font-luxury-serif text-[#1C1815]">Related Essays</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="group border border-[#E8E3DA] bg-white p-5 flex gap-4 transition-colors hover:border-[#1C1815]"
                >
                  <div className="w-24 h-24 shrink-0 overflow-hidden bg-[#EFECE6]">
                    <img
                      src={rel.featuredImage || rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B]">
                      {rel.category}
                    </span>
                    <h4 className="font-luxury-serif text-sm text-[#1C1815] group-hover:text-[#8C6D3B] line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] text-[#70685E] font-light block">
                      {rel.readTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
