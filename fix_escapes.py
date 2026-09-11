import sys

f = open('c:/Users/fabri/Downloads/Projcts/Galileo pj/galileoweb/src/components/Olimpiadas.astro', 'r')
content = f.read()
f.close()

# Fix invalid escape sequences
content = content.replace('\\$', '$')
content = content.replace('\\`', '`')
content = content.replace('\\)', ')')

f = open('c:/Users/fabri/Downloads/Projcts/Galileo pj/galileoweb/src/components/Olimpiadas.astro', 'w')
f.write(content)
f.close()
print('Fixed escape sequences')