import json,sys,subprocess,re,time,os
MN=['January','February','March','April','May','June','July','August','September','October','November','December']
CATS=['Ufology','Cryptozoology','Ghosts','Spiritualism','Occult','Hoaxes','Mysterious disappearances','Unexplained deaths','Paranormal','Folklore','Meteorites','Missing person cases']
def q(s):
    out=subprocess.run(['curl','-s','-m','40','-A','ForteanCalendar/0.1 (personal project)','-G','https://en.wikipedia.org/w/api.php','--data-urlencode','action=query','--data-urlencode','list=search','--data-urlencode','format=json','--data-urlencode','srlimit=10','--data-urlencode','srprop=snippet','--data-urlencode','srsearch='+s],capture_output=True,text=True).stdout
    try: return json.loads(out)['query']['search']
    except Exception: return None
res={}
for a in sys.argv[1:]:
    m,d=map(int,a.split('/'))
    seen={}
    for c in CATS:
        for form in (f'"{d} {MN[m-1]}"',f'"{MN[m-1]} {d}"'):
            r=q(f'deepcat:"{c}" {form}')
            if r is None: time.sleep(2); r=q(f'deepcat:"{c}" {form}') or []
            for x in r:
                sn=re.sub(r'<[^>]+>','',x['snippet']).replace('&quot;','"').replace('&#039;',"'")
                if re.search(rf'\b{d} {MN[m-1]}\b|\b{MN[m-1]} {d}\b',sn): seen.setdefault(x['title'],sn)
            time.sleep(0.15)
    print('---',a)
    for t,sn in list(seen.items())[:10]: print('  ',t,'::',sn[:180])
