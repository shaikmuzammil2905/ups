import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, Tag } from 'lucide-react';
import { posts } from '../data/posts';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function PostDetail() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug || p.id === slug) || posts[0];

  const relatedProducts = products.slice(0, 3);
  const otherPosts = posts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/posts" className="hover:text-[#16a34a]">Posts</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold truncate max-w-[200px]">{post.title}</span>
      </div>

      {/* Main Article Container */}
      <article className="bg-white rounded-3xl p-6 md:p-12 border border-slate-200/80 shadow-xs space-y-6">
        {/* Category & Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium flex-wrap">
          <span className="bg-emerald-50 text-[#16a34a] font-bold px-3 py-1 rounded-full">
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

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-[#0f2b48] leading-tight">
          {post.title}
        </h1>

        {/* Author box */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-[#0f2b48] text-white flex items-center justify-center font-bold text-xs">
            {post.author.charAt(0)}
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">{post.author}</span>
            <span className="text-[10px] text-slate-500">Livkam Power Technologies Engineering</span>
          </div>
        </div>

        {/* Article Body */}
        <div 
          className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 pt-4 border-t border-slate-100"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && (
          <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400">Related Tags:</span>
            {post.tags.map((t) => (
              <span key={t} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                #{t}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Recommended Products for this Guide */}
      <div className="mt-12 space-y-6">
        <h3 className="text-xl font-black text-[#0f2b48]">
          Recommended Equipment for This Setup
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {relatedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
}
