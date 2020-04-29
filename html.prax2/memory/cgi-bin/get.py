#!/usr/bin/env python
import cgi
import cgitb
import json

cgitb.enable()
form = cgi.FieldStorage()
datafolder = 'data/'

print("Content-type: text/html\n")
print("""<!DOCTYPE HTML>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Savings</title>
           
        </head>
        <body>""")

print("<h1>Table results</h1>")
print("""<div class="results-container">
            <form action="http://dijkstra.cs.ttu.ee/~albutu/cgi-bin/get.py?getLast=10">
                        <span>Enter name:</span>
                        <input type="text" name="findplayer" class="name-field">
                        <input class="button-find" type="submit" value="Find player">
            </form>
                    
            <div class="table-container">
                <table class="results-table">
                    <thead>
                        <tr>
                         <th>Date</th>
                            <th>Player</th>
                            <th>Time</th>
                            <th>Score</th>
                       </tr>
                    </thead>
                    <tbody class="table-body">
""")


def read_json(limit):
    with open(datafolder+'persons.json', 'r') as file:
        results_list = json.load(file)
        limited_results_list = list(reversed(results_list))

    if form.has_key("findplayer"):
        findplayer = form.getfirst("findplayer", "unknown")
        for result in reversed(results_list):

            if findplayer == result['name']:
                show_table(result)

    else:

        if form.has_key("getLast"):
            for result in limited_results_list[:limit]:
                show_table(result)


def show_table(result):

    gameTime = result['gameTime']
    score = result['score']
    date = result['date']
    name = result['name']
    print("<tr>")
    print("<th>{}</th>".format(date))
    print("<th>{}</th>".format(name))
    print("<th>{}</th>".format(gameTime))
    print("<th>{}</th>".format(score))

    print("</tr>")


read_json(10)

print("""          </tbody>
                </table>
            </div>    
            <div class="buttons-container">
                <a href="http://dijkstra.cs.ttu.ee/~albutu/prax3/index.html" class="button">Go back</a>
            </div>
        </div>
""")
print("""</body>
        </html>""")
