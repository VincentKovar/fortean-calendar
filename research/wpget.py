import json,sys,subprocess,urllib.parse,os,time
def get(title,full=True):
    fn='wp/'+title.replace('/','_').replace(' ','_')+'.txt'
    if os.path.exists(fn) and os.path.getsize(fn)>0: return open(fn).read()
    for attempt in range(4):
        url='https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&redirects=1&format=json&titles='+urllib.parse.quote(title)
        out=subprocess.run(['curl','-s','-m','40','-A','ForteanCalendar/0.1 (personal project; contact vravok@gmail.com)',url],capture_output=True,text=True).stdout
        try:
            d=json.loads(out); p=list(d['query']['pages'].values())[0]
            if 'missing' in p: return ''
            t=p.get('extract','')
            open(fn,'w').write(t); return t
        except Exception: time.sleep(2*(attempt+1))
    return ''
if __name__=='__main__':
    t=get(sys.argv[1]); print(len(t))
