import json,sys,subprocess,urllib.parse,re,os,time
MN=['January','February','March','April','May','June','July','August','September','October','November','December']
TOPICS='(UFO OR "flying saucer" OR haunted OR poltergeist OR cryptid OR Bigfoot OR "sea serpent" OR "mysterious disappearance" OR apparition OR hoax OR séance OR meteorite OR "ghost ship" OR "unexplained" OR occult OR "strange lights")'
def search(m,d):
    q=f'("{d} {MN[m-1]}" OR "{MN[m-1]} {d}") {TOPICS}'
    fn=f'wp/s_{m}_{d}.json'
    if os.path.exists(fn): return json.load(open(fn))
    url='https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=10&srnamespace=0&srprop=snippet&srsearch='+urllib.parse.quote(q)
    for a in range(4):
        out=subprocess.run(['curl','-s','-m','40','-A','ForteanCalendar/0.1 (personal project)',url],capture_output=True,text=True).stdout
        try:
            r=json.loads(out)['query']['search']; json.dump(r,open(fn,'w')); time.sleep(0.3); return r
        except Exception: time.sleep(2*(a+1))
    return []
for a in sys.argv[1:]:
    m,d=map(int,a.split('/'))
    print('---',a)
    for r in search(m,d):
        sn=re.sub(r'<[^>]+>','',r['snippet']).replace('&quot;','"')
        # only show if snippet contains the date string
        if re.search(rf'\b{d} {MN[m-1]}|\b{MN[m-1]} {d}\b',sn):
            print('  ',r['title'],'::',sn[:200])
