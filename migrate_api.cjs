const fs = require('fs');
const path = require('path');

const srcApiDir = path.join(__dirname, 'legacy-nextjs/src/app/api');
const destApiDir = path.join(__dirname, 'server/api');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function traverse(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

traverse(srcApiDir, (filePath) => {
  if (!filePath.endsWith('route.ts')) return;

  const relPath = path.relative(srcApiDir, filePath);
  // change route.ts to index.ts or keep as is if it's the folder name, but nuxt uses [param].ts or folder/index.ts
  // In Nuxt, server/api/foo/index.ts is accessible at /api/foo
  // For dynamic routes like [jobId]/action/route.ts -> [jobId]/action.ts or [jobId]/action/index.ts
  let newRelPath = relPath.replace('route.ts', 'index.ts');
  const destPath = path.join(destApiDir, newRelPath);
  ensureDir(path.dirname(destPath));

  let content = fs.readFileSync(filePath, 'utf-8');

  // Convert Next.js imports
  content = content.replace(/import\s+{.*NextResponse.*}\s+from\s+['"]next\/server['"];?\n?/g, '');
  content = content.replace(/import\s+{.*NextRequest.*}\s+from\s+['"]next\/server['"];?\n?/g, '');

  // Convert handlers
  // export async function GET(request: NextRequest) { or (req: Request)
  content = content.replace(/export\s+async\s+function\s+(GET|POST|PUT|DELETE)\s*\(\s*(?:req|request)(?:\s*:\s*(?:NextRequest|Request))?(?:\s*,\s*\{\s*params\s*\}\s*:\s*\{.*?\}\s*)?\)\s*\{/g, 
    'export default defineEventHandler(async (event) => {');

  // Replace NextResponse.json(...)
  content = content.replace(/return\s+NextResponse\.json\((.*?)\)(?:;)?/g, 'return $1');
  
  // Replace NextResponse.json(..., { status: xxx })
  content = content.replace(/return\s+NextResponse\.json\((.*?),\s*\{\s*status:\s*(\d+)\s*\}\)(?:;)?/g, (match, body, status) => {
    return `setResponseStatus(event, ${status});\n  return ${body};`;
  });

  // Convert searchParams
  // const { searchParams } = new URL(req.url)
  content = content.replace(/const\s+\{\s*searchParams\s*\}\s*=\s*new\s+URL\((?:req|request)\.url\);?/g, 'const query = getQuery(event);');
  content = content.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*(?:req|request)\.nextUrl\.searchParams\.get\(['"](.*?)['"]\)/g, 'const query = getQuery(event);\n  const $1 = query.$2;');
  content = content.replace(/searchParams\.get\(['"](.*?)['"]\)/g, 'query.$1');

  // Convert req.json()
  content = content.replace(/(?:req|request)\.json\(\)/g, 'readBody(event)');
  
  // Fix params
  // params.jobId
  content = content.replace(/params\.([a-zA-Z0-9_]+)/g, 'getRouterParam(event, \'$1\')');

  // Fix imports from @/server
  content = content.replace(/@\/server\//g, '~~/server/');

  fs.writeFileSync(destPath, content);
  console.log('Migrated', relPath, '->', newRelPath);
});
