

export interface GiTemplate {
  id: string;
  name: string;
  group: 'Languages' | 'Frameworks' | 'Tools' | 'Editors' | 'OS';
  body: string;
}

export const TEMPLATES: GiTemplate[] = [

  { id: 'node', name: 'Node', group: 'Languages', body:
    'node_modules/\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\n.npm\n.pnpm-store/\n*.tsbuildinfo\ndist/\nbuild/\ncoverage/\n.cache/' },
  { id: 'python', name: 'Python', group: 'Languages', body:
    '__pycache__/\n*.py[cod]\n*$py.class\n.Python\nbuild/\ndist/\n*.egg-info/\n.eggs/\n.venv/\nvenv/\nenv/\n.pytest_cache/\n.mypy_cache/\n.ruff_cache/\n.coverage\nhtmlcov/\n.ipynb_checkpoints/' },
  { id: 'java', name: 'Java', group: 'Languages', body:
    '*.class\n*.log\n*.jar\n*.war\n*.ear\n*.nar\nhs_err_pid*\nreplay_pid*\ntarget/' },
  { id: 'go', name: 'Go', group: 'Languages', body:
    '*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n*.test\n*.out\ngo.work\ngo.work.sum\nvendor/\nbin/' },
  { id: 'rust', name: 'Rust', group: 'Languages', body:
    '/target/\nCargo.lock\n**/*.rs.bk\n*.pdb' },
  { id: 'ruby', name: 'Ruby', group: 'Languages', body:
    '*.gem\n*.rbc\n/.bundle/\n/vendor/bundle\n/log/*\n/tmp/*\n.byebug_history\n.rspec_status' },
  { id: 'php', name: 'PHP', group: 'Languages', body:
    '/vendor/\ncomposer.phar\n*.log\n.phpunit.result.cache\n.php-cs-fixer.cache' },
  { id: 'csharp', name: 'C# / .NET', group: 'Languages', body:
    'bin/\nobj/\n*.user\n*.suo\n*.userprefs\n.vs/\n[Dd]ebug/\n[Rr]elease/\nartifacts/\n*.nupkg' },
  { id: 'cpp', name: 'C / C++', group: 'Languages', body:
    '*.o\n*.obj\n*.a\n*.lib\n*.so\n*.dll\n*.dylib\n*.exe\n*.out\n*.app\nbuild/\ncmake-build-*/' },
  { id: 'swift', name: 'Swift', group: 'Languages', body:
    '.build/\n*.xcodeproj\nDerivedData/\n*.moved-aside\n*.hmap\n*.ipa\n*.dSYM.zip\n.swiftpm/' },
  { id: 'kotlin', name: 'Kotlin', group: 'Languages', body:
    '*.class\n.gradle/\nbuild/\n*.log\nlocal.properties' },
  { id: 'dart', name: 'Dart / Flutter', group: 'Languages', body:
    '.dart_tool/\n.packages\nbuild/\n.flutter-plugins\n.flutter-plugins-dependencies\n.pub-cache/\n.pub/\n*.g.dart' },
  { id: 'elixir', name: 'Elixir', group: 'Languages', body:
    '/_build/\n/cover/\n/deps/\n/doc/\n/.fetch\nerl_crash.dump\n*.ez\n*.beam\n/config/*.secret.exs' },
  { id: 'scala', name: 'Scala', group: 'Languages', body:
    '*.class\n*.log\ntarget/\n.bloop/\n.metals/\n.bsp/\nproject/project/\nproject/target/' },

  { id: 'react', name: 'React', group: 'Frameworks', body:
    'node_modules/\nbuild/\ndist/\ncoverage/\n.eslintcache' },
  { id: 'nextjs', name: 'Next.js', group: 'Frameworks', body:
    'node_modules/\n.next/\nout/\nbuild/\n.vercel\n*.tsbuildinfo\nnext-env.d.ts' },
  { id: 'vue', name: 'Vue / Nuxt', group: 'Frameworks', body:
    'node_modules/\ndist/\n.nuxt/\n.output/\n.nitro/\n.cache/\n*.local' },
  { id: 'angular', name: 'Angular', group: 'Frameworks', body:
    'node_modules/\ndist/\n/tmp/\n/out-tsc/\n.angular/\n*.tsbuildinfo\n.eslintcache' },
  { id: 'svelte', name: 'Svelte / SvelteKit', group: 'Frameworks', body:
    'node_modules/\n.svelte-kit/\nbuild/\ndist/\n.vercel\n.output/' },
  { id: 'astro', name: 'Astro', group: 'Frameworks', body:
    'node_modules/\ndist/\n.astro/\n.vercel\n.netlify/' },
  { id: 'django', name: 'Django', group: 'Frameworks', body:
    '*.log\n*.pot\n*.pyc\n__pycache__/\ndb.sqlite3\ndb.sqlite3-journal\nmedia/\nstaticfiles/\nlocal_settings.py' },
  { id: 'rails', name: 'Rails', group: 'Frameworks', body:
    '/log/*\n/tmp/*\n/storage/*\n/public/assets\n/public/packs\n/node_modules\n/.bundle\n.byebug_history\nconfig/master.key' },
  { id: 'laravel', name: 'Laravel', group: 'Frameworks', body:
    '/vendor/\n/node_modules/\n/public/build\n/public/hot\n/public/storage\n/storage/*.key\nHomestead.yaml\nauth.json' },
  { id: 'spring', name: 'Spring Boot', group: 'Frameworks', body:
    'target/\n!.mvn/wrapper/maven-wrapper.jar\n*.class\n*.log\nHELP.md\n.gradle/\nbuild/' },
  { id: 'flutter', name: 'Flutter', group: 'Frameworks', body:
    '.dart_tool/\n.flutter-plugins\n.flutter-plugins-dependencies\nbuild/\n.pub-cache/\nios/Pods/\nandroid/.gradle/' },

  { id: 'docker', name: 'Docker', group: 'Tools', body:
    'docker-compose.override.yml\n*.env\n.docker/' },
  { id: 'terraform', name: 'Terraform', group: 'Tools', body:
    '.terraform/\n.terraform.lock.hcl\n*.tfstate\n*.tfstate.*\ncrash.log\n*.tfvars\noverride.tf\noverride.tf.json' },
  { id: 'gradle', name: 'Gradle', group: 'Tools', body:
    '.gradle/\nbuild/\n!gradle/wrapper/gradle-wrapper.jar\n!**/src/main/**/build/\n!**/src/test/**/build/' },
  { id: 'maven', name: 'Maven', group: 'Tools', body:
    'target/\npom.xml.tag\npom.xml.releaseBackup\npom.xml.versionsBackup\nrelease.properties\ndependency-reduced-pom.xml' },
  { id: 'webpack', name: 'Webpack / Vite', group: 'Tools', body:
    'dist/\nbuild/\n.cache/\n*.local\nstats.json' },
  { id: 'env', name: 'Env files', group: 'Tools', body:
    '.env\n.env.local\n.env.*.local\n.env.development.local\n.env.production.local\n*.pem\n*.key' },
  { id: 'logs', name: 'Logs & temp', group: 'Tools', body:
    '*.log\nlogs/\n*.tmp\n*.temp\n*.bak\n*.swp\n*~' },

  { id: 'vscode', name: 'VS Code', group: 'Editors', body:
    '.vscode/*\n!.vscode/settings.json\n!.vscode/tasks.json\n!.vscode/launch.json\n!.vscode/extensions.json\n*.code-workspace\n.history/' },
  { id: 'jetbrains', name: 'JetBrains', group: 'Editors', body:
    '.idea/\n*.iml\n*.iws\n*.ipr\nout/\n.idea_modules/\natlassian-ide-plugin.xml' },
  { id: 'vim', name: 'Vim', group: 'Editors', body:
    '*.swp\n*.swo\n*~\n.netrwhist\nSession.vim\ntags' },
  { id: 'emacs', name: 'Emacs', group: 'Editors', body:
    '*~\n\\#*\\#\n.\\#*\n.emacs.desktop\n.emacs.desktop.lock\nauto-save-list/\ntramp' },
  { id: 'sublime', name: 'Sublime Text', group: 'Editors', body:
    '*.sublime-workspace\n*.tmlanguage.cache\n*.tmPreferences.cache\n*.stTheme.cache' },

  { id: 'macos', name: 'macOS', group: 'OS', body:
    '.DS_Store\n.AppleDouble\n.LSOverride\n._*\n.Spotlight-V100\n.Trashes\n.DocumentRevisions-V100\n.fseventsd' },
  { id: 'windows', name: 'Windows', group: 'OS', body:
    'Thumbs.db\nThumbs.db:encryptable\nehthumbs.db\nehthumbs_vista.db\nDesktop.ini\n$RECYCLE.BIN/\n*.lnk\n*.cab\n*.msi' },
  { id: 'linux', name: 'Linux', group: 'OS', body:
    '*~\n.fuse_hidden*\n.directory\n.Trash-*\n.nfs*' },
];

export function build(ids: string[]): string {
  const set = new Set(ids);
  const seen = new Set<string>();
  const sections: string[] = [];

  for (const t of TEMPLATES) {
    if (!set.has(t.id)) continue;
    const lines: string[] = [];
    for (const raw of t.body.split('\n')) {
      const pat = raw.trim();
      if (pat && !pat.startsWith('#')) {
        if (seen.has(pat)) continue; 
        seen.add(pat);
      }
      lines.push(raw);
    }
    if (lines.some((l) => l.trim() && !l.startsWith('#'))) {
      sections.push(`# ${t.name}\n${lines.join('\n')}`);
    }
  }
  return sections.join('\n\n');
}
