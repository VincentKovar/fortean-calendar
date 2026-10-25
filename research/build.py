import json,glob,re,sys,os,datetime
sys.path.insert(0,'.')
import wpget
def norm(s):
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—','-').replace('–','-').replace('--','-').replace('—','-').replace('\xa0',' ')
    s=re.sub(r'_','',s)
    return re.sub(r'\s+',' ',s).lower()
def rd(p,**k): return open(p,encoding='utf-8',errors='ignore').read()
books={'BD':('The Book of the Damned (1919), Charles Fort','https://www.gutenberg.org/ebooks/22472',norm(rd('src/pg22472.txt'))),
       'NL':('New Lands (1923), Charles Fort','https://www.gutenberg.org/ebooks/78289',norm(rd('src/pg78289.txt'))),
       'BOD':("The Book of Days (1864), Robert Chambers",'https://archive.org/details/bookofdaysmiscel01cham',norm(rd('src/bookofdaysmiscel01cham.txt')+rd('src/bookofdaysmiscel02cham.txt')))}
by={}
bad=[]
def add_fort(mo,e,priority):
    d,yr,cat,title,text,src,cite,anchor=e[:8]
    w,u,t=books[src]
    if norm(anchor) not in t: bad.append((mo,d,'ANCHOR MISSING',anchor)); return
    rec=dict(m=mo,d=d,y=yr,cat=cat,title=title,text=text,src=dict(work=w,cite=cite,url=u,kind='fort'),conf='Reported by Fort' if src!='BOD' else 'Antiquarian record')
    by[(mo,d)]=(priority,rec)
for f in sorted(glob.glob('months/[0-9]*.py')):
    ns={}; exec(rd(f),ns); mo=int(os.path.basename(f)[:2])
    for e in ns['E']: add_fort(mo,e,0)
# extras: only fill missing days
ns={}; exec(rd('months/zz_extra.py'),ns)
for e in ns['E']:
    mo,rest=e[0],e[1:]
    if (mo,rest[0]) in by: continue
    add_fort(mo,rest,0)
# wikipedia layer: overrides
ns={}; exec(rd('months/wp.py'),ns)
for e in ns['E']:
    m,d,y,cat,title,text,src,cite,checks=e
    if src=='BOD':
        add_fort(m,(d,y,cat,title,text,'BOD',cite,checks),1); continue
    page=src[3:]
    t=norm(wpget.get(page))
    if not t: bad.append((m,d,'PAGE MISSING',page)); continue
    for c in checks:
        if not any(a in t for a in c.split('|')): bad.append((m,d,'CHECK FAILED',page,c))
    rec=dict(m=m,d=d,y=y,cat=cat,title=title,text=text,src=dict(work=f"Wikipedia, ‘{page}’",cite=cite,url='https://en.wikipedia.org/wiki/'+page.replace(' ','_'),kind='ref'),conf='Per Wikipedia')
    by[(m,d)]=(1,rec)
entries=[v[1] for k,v in sorted(by.items())]
print(len(entries),'entries; problems:',len(bad))
for b in bad: print(b)
allday=[(x.month,x.day) for x in (datetime.date(2024,1,1)+datetime.timedelta(i) for i in range(366))]
print('missing:',[x for x in allday if x not in by])
json.dump(entries,open('entries.json','w'),ensure_ascii=False,indent=1)
