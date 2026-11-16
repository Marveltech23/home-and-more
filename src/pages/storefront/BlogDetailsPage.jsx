import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import SafeImage from '../../components/common/SafeImage';
import { WhatsAppIcon } from '../../components/common/BrandIcons';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../components/common/Toast';

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const { blogs } = useStore();
  const { addToast } = useToast();

  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="container-page py-20 text-center">
        <h2 className="text-2xl font-bold text-[#24150F]">Article not found</h2>
        <p className="text-[#82746B] mt-2">The article you requested could not be located.</p>
        <Link to="/blog" className="btn-primary mt-6 inline-flex">
          Back to Journal
        </Link>
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
      addToast({ message: 'Article link copied!', type: 'success' });
    }
  };

  const relatedArticles = blogs
    .filter((b) => b.id !== blog.id && b.status === 'published')
    .slice(0, 2);

  return (
    <div className="py-8 sm:py-12">
      <article className="container-page max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#82746B] hover:text-[#F36B0A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Header Block */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-[#FFF3EA] text-[#F36B0A] text-xs font-bold px-3 py-1 rounded-full border border-[#F36B0A]/30 uppercase tracking-wider">
              {blog.category}
            </span>
            <span className="text-xs text-[#82746B] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {blog.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#24150F] tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-[#F0DFD1] py-3 text-xs text-[#82746B]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold text-[#24150F]">
                <User className="w-4 h-4 text-[#F36B0A]" />
                {blog.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#F36B0A]" />
                Published {blog.publishedAt || blog.date}
              </span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 font-semibold text-[#24150F] hover:text-[#F36B0A]"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Article</span>
            </button>
          </div>
        </header>

        {/* Hero Image */}
        <div className="rounded-3xl overflow-hidden aspect-[16/9] shadow-lg border border-[#F0DFD1]">
          <SafeImage
            src={blog.featuredImage || blog.image}
            alt={blog.title}
            aspectRatio="aspect-auto"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Excerpt Callout */}
        <div className="p-6 rounded-2xl bg-[#FFF3EA]/60 border-l-4 border-[#F36B0A] text-base text-[#24150F] italic font-medium leading-relaxed">
          "{blog.excerpt}"
        </div>

        {/* Content Body */}
        <div className="prose prose-stone max-w-none text-[#24150F] leading-relaxed space-y-4 text-base">
          {blog.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-xl font-bold text-[#24150F] pt-4">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            return (
              <p key={idx} className="text-[#24150F]/90 leading-relaxed font-normal">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Showroom WhatsApp Consultation Box */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-[#29160D] to-[#431B0E] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">Need Personal Design Consultation?</h3>
            <p className="text-xs sm:text-sm text-white/80">
              Our Abuja interior specialists help you select pieces and materials for your home.
            </p>
          </div>
          <Link to="/contact" className="btn-primary text-xs sm:text-sm py-3 px-6 shrink-0">
            Contact Design Team
          </Link>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="pt-12 border-t border-[#F0DFD1] space-y-6">
            <h3 className="text-xl font-bold text-[#24150F]">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="card p-5 group flex flex-col justify-between hover:shadow-card-hover transition-all"
                >
                  <span className="text-xs font-bold text-[#F36B0A] uppercase">{rel.category}</span>
                  <h4 className="font-bold text-base text-[#24150F] group-hover:text-[#F36B0A] mt-1 transition-colors">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-[#82746B] mt-2 line-clamp-2">{rel.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
