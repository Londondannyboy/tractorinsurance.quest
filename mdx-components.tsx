import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Image from "next/image";

// Custom MDX components for Puppy Insurance Quest
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Override default HTML elements with styled versions
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 mt-12">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-amber-400 mb-3 mt-8">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold text-white/90 mb-2 mt-6">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="text-white/80 leading-relaxed mb-4 text-lg">
        {children}
      </p>
    ),
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http");
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href || "#"}
          className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
        >
          {children}
        </Link>
      );
    },
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-white/80 ml-4">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-white/80 ml-4">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-white/80 leading-relaxed">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-amber-500 pl-4 py-2 my-6 bg-amber-900/20 rounded-r-lg italic text-white/70">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-stone-800 px-2 py-1 rounded text-amber-400 text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-stone-900 border border-stone-700 rounded-xl p-4 overflow-x-auto my-6">
        {children}
      </pre>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="bg-amber-900/30 border border-amber-500/30 px-4 py-3 text-left text-amber-400 font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-stone-700 px-4 py-3 text-white/80">
        {children}
      </td>
    ),
    hr: () => (
      <hr className="border-stone-700 my-8" />
    ),
    img: (props) => (
      <Image
        {...props}
        alt={props.alt || ""}
        width={800}
        height={450}
        className="rounded-2xl my-6 w-full object-cover"
      />
    ),
    ...components,
  };
}
