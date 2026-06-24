import re

css_map = {
    'wrapper': 'flex flex-col min-h-screen bg-[#0a0a0f]',
    'header': 'flex items-center justify-between gap-4 p-4 md:px-6 bg-[#0a0a14]/95 border-b border-white/10 backdrop-blur-md sticky top-0 z-50 flex-wrap',
    'headerLeft': 'flex items-center gap-4',
    'headerRight': 'flex items-center gap-2 flex-wrap',
    'title': 'text-lg font-bold text-[#f1f0f5]',
    'main': 'grid grid-cols-1 md:grid-cols-[320px_1fr] flex-1 min-h-0',
    'leftPanel': 'border-r border-white/10 bg-white/5 backdrop-blur-[20px] p-5 overflow-y-auto max-h-screen flex flex-col gap-4',
    'uploadZone': 'flex flex-col items-center gap-3 py-8 px-5 border-2 border-dashed border-white/10 rounded-lg text-center text-[#9099ab]',
    'tabs': 'flex gap-1 bg-white/5 rounded-md p-1 mb-2',
    'tab': 'flex-1 py-2.5 px-2 text-[11px] font-semibold rounded-md text-[#9099ab] transition-all bg-transparent border-none cursor-pointer flex items-center justify-center gap-1',
    'tabActive': '!bg-gradient-to-r !from-[#bd00ff] !to-[#7b00cc] !text-white shadow-[0_4px_12px_rgba(233,30,140,0.25)]',
    'layoutControls': 'flex flex-col gap-3.5',
    'lockToggleCard': 'flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-md transition-all hover:border-[#bd00ff]/30 hover:bg-[#bd00ff]/5',
    'controlGroup': 'flex flex-col gap-1.5',
    'selectedSlotCard': 'border border-white/10 rounded-md p-3.5 bg-white/5 flex flex-col gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] animate-[fadeIn_0.3s_ease-out]',
    'selectedSlotTitle': 'text-[12px] font-bold text-[#ecb2ff] uppercase tracking-wider border-b border-white/10 pb-1.5 m-0',
    'textPanel': 'flex flex-col gap-3.5',
    'toggleRow': 'flex items-center justify-between py-2',
    'toggle': 'w-10 h-[22px] rounded-full bg-white/10 border border-white/10 relative cursor-pointer transition-colors',
    'toggleOn': '!bg-[#bd00ff] !border-[#bd00ff] shadow-[0_0_10px_rgba(233,30,140,0.4)]',
    'toggleThumb': 'absolute top-[1px] left-[1px] w-4 h-4 rounded-full bg-white transition-transform',
    'colorPanel': 'flex flex-col gap-2',
    'layoutRow': 'flex gap-2',
    'centerPanel': 'flex items-center justify-center bg-[#0a0a0f] bg-[radial-gradient(circle_at_center,rgba(236,178,255,0.1)_0%,transparent_60%)] overflow-hidden relative min-h-[500px] p-8',
    'emptyCanvas': 'flex flex-col items-center gap-4 text-[#9099ab]',
    'instructionCard': 'p-3 bg-white/5 border border-white/10 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.1)]',
    'noSelectionCard': 'flex flex-col items-center justify-center py-6 px-4 bg-white/5 border border-dashed border-white/10 rounded-md text-center'
}

with open(r'c:\Users\DANTE\Documents\Dante\self\photoboth\frontend\components\Editor\EditorClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace import styles from './EditorClient.module.css';
content = content.replace("import styles from './EditorClient.module.css';\n", "")

# Sort keys by length descending to avoid substring match issues
sorted_keys = sorted(css_map.keys(), key=len, reverse=True)

# Function to replace className={styles.xxx} or className={`${styles.xxx} ...`}
def replace_class(match):
    full_str = match.group(0)
    for key in sorted_keys:
        val = css_map[key]
        full_str = full_str.replace(f'styles.{key}', f'"{val}"')
    
    full_str = re.sub(r'\$\{"([^"]+)"\}', r'\1', full_str)
    return full_str

content = re.sub(r'className=\{[^}]+\}', replace_class, content)

style_tag = """      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .toggleOn .toggleThumb-class {
          transform: translateX(18px);
        }
      `}</style>
"""
content = content.replace('<Toast toasts={toasts} onRemove={removeToast} />', '<Toast toasts={toasts} onRemove={removeToast} />\n' + style_tag)

# Fix toggleThumb-class
content = content.replace('"absolute top-[1px] left-[1px] w-4 h-4 rounded-full bg-white transition-transform"', '"absolute top-[1px] left-[1px] w-4 h-4 rounded-full bg-white transition-transform toggleThumb-class"')

with open(r'c:\Users\DANTE\Documents\Dante\self\photoboth\frontend\components\Editor\EditorClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
