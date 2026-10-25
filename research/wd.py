import subprocess,json,sys,re
def run(cls,prop,limit=400):
    q=f'''SELECT ?itemLabel ?d WHERE {{
  ?item wdt:P31/wdt:P279* wd:{cls} . ?item p:{prop}/psv:{prop} ?v . ?v wikibase:timeValue ?d ; wikibase:timePrecision ?p . FILTER(?p>=11)
  SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
}} LIMIT {limit}'''
    out=subprocess.run(['curl','-s','-m','100','-A','ForteanCalendar/0.1 (personal project)','-H','Accept: application/sparql-results+json','--data-urlencode','query='+q,'https://query.wikidata.org/sparql'],capture_output=True,text=True).stdout
    try: d=json.loads(out)
    except Exception: return None
    return [(b['d']['value'][:10],b['itemLabel']['value']) for b in d['results']['bindings']]
if __name__=='__main__':
    cls,prop=sys.argv[1],sys.argv[2]
    r=run(cls,prop)
    if r is None: print('ERR/timeout'); sys.exit()
    for d,l in sorted(r,key=lambda x:x[0][5:]): print(d,l)
