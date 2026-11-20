import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import SafeImage from '../common/SafeImage';
import { useStore } from '../../context/StoreContext';

export default function HomeBlogSection() {
  const { publishedBlogs } = useStore();

  const recentPosts = publishedBlogs.slice(0, 3);

  if (!recentPosts || recentPosts.length === 0) return null;

  return (
    <section className="container-page mt-16 sm:mt-24" aria-label="Editorial Journal">
      <SectionHeading
        eyebrow="PERSPECTIVES &amp; ESSAYS"
        title="The Interior Design Journal"
        subtitle="In-depth explorations on architectural scale, timber longevity, and modern Nigerian living."
        actionLabel="Read All Essays"
        actionTo="/blog"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recentPosts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col bg-white border border-[#E8E3DA] overflow-hidden transition-all duration-500 hover:border-[#B89358] hover:shadow-card"
          >
            {/* Image */}
            <Link to={`/blog/${post.slug}`} className="relative aspect-[16/11] overflow-hidden bg-[#EFECE6] block">
              <SafeImage
                src={post.featuredImage || post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104 brightness-[0.96]"
              />
              <span className="absolute top-3 left-3 bg-[#1C1815]/85 backdrop-blur-xs text-white text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1">
                {post.category}
              </span>
            </Link>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#9A9185]">
                  <span>{post.publishedAt || post.date}</span>
                  <span>&bull;</span>
                  <span>{post.readTime || '5 min read'}</span>
                </div>
                <h3 className="font-luxury-serif text-xl sm:text-2xl font-normal text-[#1C1815] group-hover:text-[#B89358] transition-colors leading-snug line-clamp-2">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-xs text-[#7A7268] line-clamp-2 font-light leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E3DA] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#7A7268] truncate max-w-[160px]">{post.author}</span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="font-semibold text-xs uppercase tracking-wide text-[#1C1815] group-hover:text-[#B89358] inline-flex items-center gap-1.5 transition-colors"
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
