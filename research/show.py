import json,sys,re
o=json.load(open('fort_candidates.json'))
mo=int(sys.argv[1])
for d in range(1,32):
    c=[x for x in o if x['month']==mo and x['day']==d and x['year']]
    seen=set()
    for x in c[:2]:
        k=x['ctx'][300:340]
        if k in seen: continue
        seen.add(k)
        print(f"[{mo}/{d}] {x['book'][:4]} pos{x['pos']} yr{x['year']}: {x['ctx'][170:560]}\n")
