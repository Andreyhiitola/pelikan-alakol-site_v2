#!/bin/bash
# Build script for Cloudflare Pages
# Injects environment variables into static HTML files

echo "🔧 Build started..."

# Inject Groq API key
if [ -n "$GROQ_KEY" ]; then
  sed -i "s|window.GROQ_KEY  = '';.*|window.GROQ_KEY  = '${GROQ_KEY}';|" index.html
  echo "✅ GROQ_KEY injected into index.html"
else
  echo "⚠️  GROQ_KEY not set — AI chat will not work"
fi

echo "✅ Build complete"
