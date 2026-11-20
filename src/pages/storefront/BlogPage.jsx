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
    <div className="bg-[#FBF9F5] min-h-screen py-10 sm:py-16">
      <SEO
        title="The Atelier Gazette & Living Guides | Home & More Abuja"
        description="Interior architecture principles, timber joinery insights, and space planning essays curated by Home & More Furniture in Abuja, Nigeria."
        canonical="/blog"
      />

      <div className="container-page space-y-14">
        {/* Editorial Header */}
        <div className="border-b border-[#E8E3DA] pb-8 max-w-3xl space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-ultra-caps text-[#8C6D3B]">
            The Atelier Gazette
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-luxury-serif font-light text-[#1C1815] tracking-tight leading-[1.15]">
            Essays on Modern Living, Craft &amp; Materiality
          </h1>
          <p className="text-sm text-[#70685E] font-light leading-relaxed max-w-xl pt-2">
            Architectural perspectives, hardwood joinery standards, and interior styling principles curated by our Abuja design team.
          </p>
        </div>

        {publishedBlogs.length === 0 ? (
          <EmptyState
            title="Gazette Archives Empty"
            message="Check back soon for interior design essays and architectural care guides."
          />
        ) : (
          <>
            {/* Featured Article Hero Exhibition */}
            {featured && (
              <article className="border border-[#E8E3DA] bg-white group transition-colors duration-300 hover:border-[#1C1815]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-7 relative overflow-hidden aspect-[16/10] bg-[#EFECE6]">
                    <SafeImage
                      src={featured.featuredImage || featured.image}
                      alt={featured.title}
                      aspectRatio="aspect-auto"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#1C1815]/90 text-[#FBF9F5] text-[10px] font-semibold px-3 py-1 uppercase tracking-ultra-caps">
                        Editorial Feature
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[11px] uppercase tracking-ultra-caps text-[#70685E]">
                        <span className="text-[#8C6D3B] font-semibold">{featured.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-light">
                          <Clock className="w-3 h-3 stroke-[1.2]" />
                          {featured.readTime}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-luxury-serif font-light text-[#1C1815] group-hover:text-[#8C6D3B] transition-colors leading-snug">
                        <Link to={`/blog/${featured.slug}`}>{featured.title}</Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-[#70685E] font-light leading-relaxed line-clamp-3">
                        {featured.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#E8E3DA] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-[#1C1815]">
                        <User className="w-3.5 h-3.5 text-[#8C6D3B] stroke-[1.2]" />
                        <span className="font-light">{featured.author}</span>
                      </div>

                      <Link
                        to={`/blog/${featured.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-ultra-caps text-[#1C1815] font-semibold hover:text-[#8C6D3B] transition-colors"
                      >
                        <span>Read Essay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Remaining Articles Grid */}
            {otherPosts.length > 0 && (
              <div className="space-y-8 pt-4">
                <div className="border-b border-[#E8E3DA] pb-4">
                  <h3 className="text-2xl font-luxury-serif font-light text-[#1C1815]">
                    Recent Dispatches
                  </h3>
                  <p className="text-[11px] uppercase tracking-ultra-caps text-[#70685E] mt-1">
                    Chronicles from our showroom floor and Dei-Dei workshop
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {otherPosts.map((post) => (
                    <article
                      key={post.id}
                      className="border border-[#E8E3DA] bg-white group flex flex-col justify-between transition-colors duration-300 hover:border-[#1C1815]"
                    >
                      <Link to={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-[#EFECE6] block">
                        <SafeImage
                          src={post.featuredImage || post.image}
                          alt={post.title}
                          aspectRatio="aspect-auto"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 bg-[#1C1815]/85 text-[#FBF9F5] text-[10px] uppercase tracking-ultra-caps px-2.5 py-0.5">
                          {post.category}
                        </span>
                      </Link>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-ultra-caps text-[#70685E]">
                            <span>{post.publishedAt || post.date}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </div>
                          <h4 className="font-luxury-serif text-lg text-[#1C1815] group-hover:text-[#8C6D3B] transition-colors line-clamp-2 leading-snug">
                            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                          </h4>
                          <p className="text-xs text-[#70685E] font-light mt-2 line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#E8E3DA] flex items-center justify-between text-xs">
                          <span className="text-[#70685E] font-light truncate max-w-[150px]">{post.author}</span>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-[10px] uppercase tracking-ultra-caps text-[#8C6D3B] font-semibold hover:text-[#1C1815] shrink-0"
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
    </div>
  );
}
