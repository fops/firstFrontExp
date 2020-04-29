#!/usr/bin/python
# -*- coding: iso-8859-1 -*-
import cgitb; cgitb.enable()
import cgi
import json

print("Content-type: text/html")
print

# form = cgi.FieldStorage()
# date = form['date'].value
# time = form['time'].value
# score = form['score'].value

# action = form['action'].value
# if 'query' in form:
# 	query = form['query'].value
# if 'subname' in form:
# 	subname = form['subname'].value

# print(date,time,score)


# file = open('./table_data.txt', 'a+')


# file.write("{}\t{}\t{}\n".format(date, time, score))

# if action == "read":
# 	#tableData = []
# 	count = 0
# 	for line in reversed(file.readlines()):
# 		if (count > 100):
# 			break
# 		line = line.strip()
# 		result = line.split('\t')
# 		if (form.has_key('subname') and subname.lower() in result[2].lower()):
# 			count += 1
# 			if (query == "getwinners" and result[0] == "Win"):
# 				print('<tr><td>{}</td><td>{}</td><td>{}</td><td>{}</td></tr>'.format(result[1], result[2], result[3], result[4]))
# 			elif (query == "getlosers" and result[0] == "Lose"):
# 				print('<tr><td>{}</td><td>{}</td><td>{}</td><td>{}</td></tr>'.format(result[1], result[2], result[3], result[4]))
# 		elif (not form.has_key('subname')):
# 			count += 1
# 			if (query == "getwinners" and result[0] == "Win"):
# 				print('<tr><td>{}</td><td>{}</td><td>{}</td><td>{}</td></tr>'.format(result[1], result[2], result[3], result[4]))
# 			elif (query == "getlosers" and result[0] == "Lose"):
# 				print('<tr><td>{}</td><td>{}</td><td>{}</td><td>{}</td></tr>'.format(result[1], result[2], result[3], result[4]))
#     #print json.dumps(tableData)
# else:

	#clicks = form['clicks'].value
	
# file.close()



form = cgi.FieldStorage()

gameTime = form.getfirst("time")
score = form.getfirst("score")
date = form.getfirst("date")
name = form.getfirst("name")



datafolder = 'data/'

gameInfo = {
    'gameTime': gameTime,
    'score': score,
    'date': date,
	'name':name
}


def write_json(person_dict):
    try:
        data = json.load(open(datafolder+'persons.json'))
    except:
        data = []
    data.append(person_dict)

    with open(datafolder+'persons.json', 'w') as file:
        json.dump(data, file, indent=2, ensure_ascii=False)


write_json(gameInfo)

print("Content-type: text/html")
print