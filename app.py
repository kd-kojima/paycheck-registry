import http.server
import sys
import json
import re

args = sys.argv

address = args[1]
port = int(args[2])
index_path = './index.html'
json_path = './data.json'

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'max-age=0')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/data':
            data_list = self.sort_by_date(self.read_all())
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data_list).encode('UTF-8'))
        elif re.compile(r'/data/[0-9]*').search(self.path):
            dataid = int(re.match(r'/data/([0-9]*)', self.path).group(1))
            data = self.read(dataid)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('UTF-8'))
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path == '/data':
            data = self.create()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('UTF-8'))

    def do_PUT(self):
        if re.compile(r'/data/[0-9]*').search(self.path):
            dataid = int(re.match(r'/data/([0-9]*)', self.path).group(1))
            data = self.update(dataid)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('UTF-8'))

    def do_DELETE(self):
        if re.compile(r'/data/[0-9]*').search(self.path):
            dataid = int(re.match(r'/data/([0-9]*)', self.path).group(1))
            data = self.delete(dataid)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode('UTF-8'))


    def read_all(self):
        f = open(json_path, 'r', encoding='utf-8')
        data_list = json.load(f)
        f.close()
        return self.sort_by_id(data_list['data'])
    
    def read(self, id):
        data_all = self.read_all()
        return list(filter(lambda x: x['id'] == id, data_all))
    
    def create(self):
        body = self.rfile.read(int(self.headers['content-length'])).decode('utf-8')
        newdata = json.loads(body)
        data_all = self.read_all()
        if len(data_all) > 0:
            newdata['id'] = int(data_all[len(data_all) - 1]['id']) + 1
        else:
            newdata['id'] = 0
        data_all.append(newdata)
        self.write_json_file(data_all)
        return newdata
    
    def update(self, id):
        body = self.rfile.read(int(self.headers['content-length'])).decode('utf-8')
        newdata = json.loads(body)
        newdata['id'] = id
        data_all = self.read_all()
        deleted_data_list = list(filter(lambda x: x['id'] != id, data_all))
        deleted_data_list.append(newdata)
        self.write_json_file(deleted_data_list)
        return newdata
    
    def delete(self, id):
        data_all = self.read_all()
        deleted_data_list = list(filter(lambda x: x['id'] != id, data_all))
        self.write_json_file(deleted_data_list)
        return list(filter(lambda x: x['id'] == id, data_all))
    
    def write_json_file(self, data_all):
        json_data = { 'data': self.sort_by_id(data_all) }
        f = open(json_path, 'w', encoding='utf-8')
        f.write(json.dumps(json_data, indent=4))
        f.close()
    
    def sort_by_id(self, data_list):
        return sorted(data_list, key=lambda x: x['id'])
    
    def sort_by_date(self, data_list):
        return sorted(data_list, key=lambda x: f'{x["year"]}{x["month"]}{x["type"]}', reverse=True)



httpServer = http.server.HTTPServer((address, port), NoCacheHTTPRequestHandler)
print(f'Serving HTTP on {address} port {port} (http://{address}:{port}/) ...')
httpServer.serve_forever()