import re, json, sys
MON = {'jan':1,'feb':2,'mar':3,'apr':4,'may':5,'jun':6,'jul':7,'aug':8,'sep':9,'sept':9,'oct':10,'nov':11,'dec':12}
pat = re.compile(r'\b(Jan(?:uary|\.)?|Feb(?:ruary|\.)?|Mar(?:ch|\.)?|Apr(?:il|\.)?|May|June?|July?|Aug(?:ust|\.)?|Sept?(?:ember|\.)?|Oct(?:ober|\.)?|Nov(?:ember|\.)?|Dec(?:ember|\.)?)\s+(\d{1,2})(?:st|nd|rd|th)?\b,?(?:\s+(1[6-9]\d\d))?')
out=[]
for book,f in (('The Book of the Damned','src/pg22472.txt'),('New Lands','src/pg78289.txt')):
    t=open(f,encoding='utf-8').read()
    start=t.find('*** START'); t=t[start:]
    t=re.sub(r'\r','',t)
    for m in pat.finditer(t):
        mo=MON[m.group(1).lower().rstrip('.')[:4] if m.group(1).lower().startswith('sept') else m.group(1).lower()[:3]]
        d=int(m.group(2))
        if not 1<=d<=31: continue
        s=max(0,m.start()-350); e=min(len(t),m.end()+450)
        ctx=' '.join(t[s:e].split())
        # find year in context
        yrs=re.findall(r'\b1[6-9]\d\d\b',t[max(0,m.start()-200):m.end()+200])
        out.append(dict(book=book,month=mo,day=d,year=m.group(3) or (yrs[0] if yrs else None),ctx=ctx,pos=m.start()))
json.dump(out,open('fort_candidates.json','w'),indent=1)
print(len(out))
from collections import Counter
print(sorted(Counter((o['month'],o['day']) for o in out).items())[:5])
