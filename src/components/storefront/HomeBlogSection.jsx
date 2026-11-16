import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import SafeImage from '../common/SafeImage';
import { useStore } from '../../context/StoreContext';

export default function HomeBlogSection() {
  const { publishedBlogs } = useStore();

  const recentPosts = publishedBlogs.slice(0, 3);

  if (!recentPosts || recentPosts.length === 0) return null;

  return (
    <section className="container-page mt-14 sm:mt-16" aria-label="Latest from our blog">
      <SectionHeading
        title="From Our Journal"
        subtitle="Interior design inspirations, furniture craftsmanship, and living space advice"
        actionLabel="View All Articles"
        actionTo="/blog"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentPosts.map((post) => (
          <article
            key={post.id}
            className="card overflow-hidden group flex flex-col border border-[#F0DFD1] hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 bg-white"
          >
            {/* Image */}
            <Link to={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-[#FFFAF5]">
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

            {/* Content */}
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
                  className="font-bold text-[#F36B0A] hover:underline shrink-0 inline-flex items-center gap-1"
                >
                  <span>Read More</span>
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
