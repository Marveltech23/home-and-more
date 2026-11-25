import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import SafeImage from '../common/SafeImage';
import { useStore } from '../../context/StoreContext';

export default function HomeBlogSection() {
  const { publishedBlogs } = useStore();
  const recentPosts = publishedBlogs.slice(0, 3);

  if (!recentPosts || recentPosts.length === 0) return null;

  return (
    <section className="container-page py-14 sm:py-16" aria-label="Design Journal">
      <SectionHeading
        eyebrow="Editorial & Care Guides"
        title="From Our Design Journal"
        subtitle="Interior architecture tips, upholstery care, and room styling ideas from our Abuja team."
        actionLabel="Read All Articles"
        actionTo="/blog"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentPosts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col overflow-hidden bg-white rounded-xl border border-[#EAE2D9] hover:border-[#D9CBBF] hover:shadow-card-hover transition-all duration-300"
          >
            <Link to={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-[#FAF7F3]">
              <SafeImage
                src={post.featuredImage || post.image}
                alt={post.title}
                aspectRatio="aspect-auto"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#24150F] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm border border-[#EAE2D9]">
                {post.category}
              </span>
            </Link>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-[#786B62] mb-2">
                  <Calendar className="w-3 h-3 text-[#F36B0A]" />
                  <span>{post.publishedAt || post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-editorial font-semibold text-lg text-[#24150F] group-hover:text-[#F36B0A] transition-colors line-clamp-2 leading-snug">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-xs text-[#786B62] mt-2 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAE2D9] flex items-center justify-between text-xs">
                <span className="text-[#786B62] truncate max-w-[150px]">{post.author}</span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="font-semibold text-[#F36B0A] hover:text-[#D94D00] shrink-0 inline-flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
