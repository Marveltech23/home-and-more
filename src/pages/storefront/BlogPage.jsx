import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import SafeImage from '../../components/common/SafeImage';
import EmptyState from '../../components/common/EmptyState';
import SEO from '../../components/common/SEO';
import { useStore } from '../../context/StoreContext';

export default function BlogPage() {
  const { publishedBlogs } = useStore();

  const featured = publishedBlogs[0];
  const otherPosts = publishedBlogs.slice(1);

  return (
    <div className="container-page py-8 sm:py-14 space-y-12">
      <SEO
        title="Furniture Journal & Living Guides | Abuja Design Insights"
        description="Interior design principles, timber craftsmanship insights, and space planning tips curated by our Abuja design team at Home & More Furniture."
        canonical="/blog"
      />

      {/* Header */}
      <div className="max-w-2xl">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#F36B0A]">
          Home &amp; Décor Journal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#24150F] tracking-tight mt-1">
          Modern Living Inspirations &amp; Care Guides
        </h1>
        <p className="text-sm sm:text-base text-[#82746B] mt-2">
          Interior design principles, timber craftsmanship insights, and space planning tips curated by our Abuja design team.
        </p>
      </div>

      {publishedBlogs.length === 0 ? (
        <EmptyState
          title="No articles published yet"
          message="Check back soon for interior design trends and furniture guides."
        />
      ) : (
        <>
          {/* Featured Article Hero Card */}
          {featured && (
            <article className="card overflow-hidden group border border-[#F0DFD1] hover:shadow-card-hover transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 relative overflow-hidden aspect-[16/10]">
                  <SafeImage
                    src={featured.featuredImage || featured.image}
                    alt={featured.title}
                    aspectRatio="aspect-auto"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#F36B0A] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Featured Guide
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-[#82746B]">
                      <span className="text-[#F36B0A] font-semibold">{featured.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featured.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-[#24150F] group-hover:text-[#F36B0A] transition-colors">
                      <Link to={`/blog/${featured.slug}`}>{featured.title}</Link>
                    </h2>

                    <p className="text-sm text-[#82746B] leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#F0DFD1] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#24150F] font-medium">
                      <User className="w-3.5 h-3.5 text-[#F36B0A]" />
                      <span>{featured.author}</span>
                    </div>

                    <Link
                      to={`/blog/${featured.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#F36B0A] group-hover:text-[#D94D00]"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Remaining Articles Grid */}
          {otherPosts.length > 0 && (
            <div className="space-y-6">
              <SectionHeading title="More From The Journal" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((post) => (
                  <article
                    key={post.id}
                    className="card overflow-hidden group flex flex-col border border-[#F0DFD1] hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                  >
                    <Link to={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden">
                      <SafeImage
                        src={post.featuredImage || post.image}
                        alt={post.title}
                        aspectRatio="aspect-auto"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#24150F] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#F0DFD1]">
                        {post.category}
                      </span>
                    </Link>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-[#82746B] mb-1.5">
                          <Calendar className="w-3 h-3 text-[#F36B0A]" />
                          <span>{post.publishedAt || post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="font-bold text-base text-[#24150F] group-hover:text-[#F36B0A] transition-colors line-clamp-2">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-xs text-[#82746B] mt-2 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#F0DFD1] flex items-center justify-between text-xs">
                        <span className="text-[#82746B] truncate max-w-[150px]">{post.author}</span>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="font-bold text-[#F36B0A] hover:underline shrink-0"
                        >
                          Read &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
