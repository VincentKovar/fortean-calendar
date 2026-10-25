import sys,re; sys.path.insert(0,'.')
import wpget
MN=['January','February','March','April','May','June','July','August','September','October','November','December']
gaps="3/11 5/5 6/5 6/29 8/3 9/18 12/8 12/16 2/23 1/21".split()
G={tuple(map(int,g.split('/'))) for g in gaps}
pages=[l.strip() for l in open(sys.argv[1]) if l.strip()]
for p in pages:
    t=wpget.get(p)
    if not t: print('MISSING',p); continue
    hits=set()
    for m,mn in enumerate(MN,1):
        for mm in re.finditer(rf'\b{mn} (\d{{1,2}})(?:st|nd|rd|th)?,? (1\d{{3}})\b|\b(\d{{1,2}}) {mn},? (1\d{{3}})\b|\b{mn} (\d{{1,2}})(?:st|nd|rd|th)?\b|\b(\d{{1,2}}) {mn}\b',t):
            d=int(next(g for g in (mm.group(1),mm.group(3),mm.group(5),mm.group(6)) if g))
            if (m,d) in G:
                ctx=t[max(0,mm.start()-110):mm.end()+150].replace('\n',' ')
                key=(m,d,ctx[100:140])
                if key in hits: continue
                hits.add(key)
                print(f'[{m}/{d}] {p}: ...{ctx}')
