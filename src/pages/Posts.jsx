import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import { posts } from '../data/posts';

export default function Posts() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">Guides & Knowledge Base</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs mb-10">
        <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
          Livkam Knowledge Center
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0f2b48]">
          Power Engineering Guides & Tips
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mt-2 font-medium">
          Expert articles on UPS sizing, battery maintenance protocols, inverter troubleshooting, and energy storage comparisons.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                <span className="bg-emerald-50 text-[#16a34a] font-bold px-2.5 py-0.5 rounded-full">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-[#0f2b48] group-hover:text-[#16a34a] transition-colors leading-snug">
                {post.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">By {post.author}</span>
              <Link
                to={`/posts/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] hover:underline"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
