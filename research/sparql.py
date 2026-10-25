import json,subprocess,sys
q=sys.argv[1]
out=subprocess.run(['curl','-s','-m','90','-A','ForteanCalendar/0.1 (personal project)','-H','Accept: application/sparql-results+json','--data-urlencode','query='+q,'https://query.wikidata.org/sparql'],capture_output=True,text=True).stdout
try:
    d=json.loads(out)
    for b in d['results']['bindings']:
        print(' | '.join(b[k]['value'] for k in b))
except Exception as e:
    print('ERR',out[:500])
