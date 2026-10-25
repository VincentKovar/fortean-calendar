import json,re,sys,os,urllib.request,urllib.parse,time,datetime
KW0=re.compile(r'\b(UFO|flying saucer|unidentified|ghost|haunt|cryptid|monster|Bigfoot|Sasquatch|Loch Ness|disappear|vanish|mysterious|occult|séance|seance|miracle|apparition|hoax|curse|witch|vampire|poltergeist|sighting|crop circle|paranormal|spiritualis|psychic|alien|abduct|Mothman|chupacabra|Yeti|sea serpent|meteorite|Tunguska|unexplained|prophe|Nostradamus|Ouija|exorcis|stigmata|levitat|Fatima|Marian|fireball|lights?\b.*sky|Mary Celeste|Bermuda|ley|dowsing|Theosoph|Madame Blavatsky|Houdini|Fox sisters|Cottingley|Crowley|astrolog|alchem|grimoire|talisman|cursed|mystery|strange|eerie|anomal|UAP|remote viewing|Roswell)',re.I)
def fetch(title):
    fn='wp/day_'+title.replace(' ','_')+'.txt'
    if os.path.exists(fn): return open(fn).read()
    url='https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&format=json&titles='+urllib.parse.quote(title)
    import subprocess
    out=subprocess.run(['curl','-s','-m','30','-A','ForteanCalendar/0.1 (personal project)',url],capture_output=True,text=True).stdout
    d=json.loads(out)
    t=list(d['query']['pages'].values())[0].get('extract','')
    open(fn,'w').write(t); time.sleep(0.2); return t
KW=re.compile(r'\b(comet|eclipse|meteor|astronom|mystery|mysterious|disappear|vanish|missing|ghost|legend|myth|prophe|religio|cult\b|sect\b|saint|miracle|vision|apparition|witch|devil|satan|sorcer|magic|occult|spirit|haunt|monster|creature|beast|serpent|UFO|saucer|sighting|alien|strange|bizarre|unusual|curse|treasure|lost|hoax|fraud|forg|riddle|enigma|manuscript|skull|fossil|mummy|tomb|pyramid|oracle|plague|dancing|hysteria|panic|crop|Atlantis|archaeolog|artifact|relic|grail|shroud|unexplained|inexplicable|supernatural|paranormal|psychic|medium|lunar|moon|ship found|abandoned|derelict|burn|fire|pope|heresy|exorcis|sacrific|druid|stonehenge|alchem|astrolog|tarot|ouija|spiritualis|theosoph|mediumship|clairvoy|telepath|dowsing|healing|apparit)',re.I)
mn=['January','February','March','April','May','June','July','August','September','October','November','December']
for a in sys.argv[1:]:
    m,d=map(int,a.split('/'))
    t=fetch(f'{mn[m-1]} {d}')
    # keep Events section until Births
    i=t.find('== Events'); j=t.find('== Births')
    ev=t[i:j] if i>=0 and j>i else t
    hits=[l.strip() for l in ev.split('\n') if KW.search(l) and re.match(r'^\s*\d{3,4}',l.strip())]
    print(f'--- {m}/{d}')
    for l in hits[:8]: print('  ',l[:230])
