import sys,re
sys.path.insert(0,'.')
import wpget
MN=['January','February','March','April','May','June','July','August','September','October','November','December']
def check(m,d,y,page,show=True):
    t=wpget.get(page)
    if not t: print(f'[{m}/{d}] {page}: PAGE MISSING'); return False
    pats=[rf'\b{MN[m-1]} {d}\b[^\d]{{0,3}}',rf'\b{d} {MN[m-1]}\b']
    ok=False
    for pat in pats:
        for mm in re.finditer(pat,t):
            ctx=t[max(0,mm.start()-160):mm.end()+220].replace('\n',' ')
            if str(y) in ctx:
                if show: print(f'[{m}/{d}/{y}] {page} OK :: ...{ctx}\n')
                return True
    # fallback: date present but year not near
    for pat in pats:
        mm=re.search(pat,t)
        if mm:
            ctx=t[max(0,mm.start()-120):mm.end()+160].replace('\n',' ')
            print(f'[{m}/{d}/{y}] {page} DATE-ONLY :: ...{ctx}\n'); return False
    print(f'[{m}/{d}/{y}] {page} NOT FOUND'); return False
if __name__=='__main__':
    for a in sys.argv[1:]:
        m,d,y,page=a.split('|'); check(int(m),int(d),int(y),page)
